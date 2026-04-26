import { NextResponse } from "next/server";
import { DEMO_USER_ID } from "@/lib/constants";
import { openai, OPENAI_MODEL } from "@/lib/openai";
import { buildJobMatchPrompt } from "@/lib/prompts";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { Job, Profile } from "@/types";

type AIJobMatchResponse = {
  match_score: number;
  decision: "apply" | "maybe" | "skip";
  matched_skills: string[];
  missing_skills: string[];
  reason: string;
  suggested_resume_keywords: string[];
};

function normalizeAIResult(result: AIJobMatchResponse): AIJobMatchResponse {
  const score = Math.max(0, Math.min(100, Number(result.match_score || 0)));

  let decision: "apply" | "maybe" | "skip" = result.decision;

  if (!["apply", "maybe", "skip"].includes(decision)) {
    if (score >= 75) decision = "apply";
    else if (score >= 50) decision = "maybe";
    else decision = "skip";
  }

  return {
    match_score: score,
    decision,
    matched_skills: Array.isArray(result.matched_skills)
      ? result.matched_skills
      : [],
    missing_skills: Array.isArray(result.missing_skills)
      ? result.missing_skills
      : [],
    reason: result.reason || "No reason provided.",
    suggested_resume_keywords: Array.isArray(result.suggested_resume_keywords)
      ? result.suggested_resume_keywords
      : [],
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const jobId = body.job_id;

    if (!jobId) {
      return NextResponse.json(
        { error: "job_id is required" },
        { status: 400 }
      );
    }

    const { data: profileData, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("user_id", DEMO_USER_ID)
      .maybeSingle();

    if (profileError || !profileData) {
      return NextResponse.json(
        { error: "Please create your profile first." },
        { status: 400 }
      );
    }

    const { data: jobData, error: jobError } = await supabaseAdmin
      .from("jobs")
      .select("*")
      .eq("id", jobId)
      .single();

    if (jobError || !jobData) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    const profile = profileData as Profile;
    const job = jobData as Job;

    const prompt = buildJobMatchPrompt(profile, job);

    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      temperature: 0.2,
      response_format: {
        type: "json_object",
      },
      messages: [
        {
          role: "system",
          content:
            "You are a strict job matching assistant. Always return valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "AI returned empty response" },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(content) as AIJobMatchResponse;
    const normalized = normalizeAIResult(parsed);

    const { data: savedMatch, error: saveError } = await supabaseAdmin
      .from("job_matches")
      .upsert(
        {
          user_id: DEMO_USER_ID,
          job_id: jobId,
          match_score: normalized.match_score,
          decision: normalized.decision,
          matched_skills: normalized.matched_skills,
          missing_skills: normalized.missing_skills,
          reason: normalized.reason,
          suggested_resume_keywords: normalized.suggested_resume_keywords,
        },
        {
          onConflict: "user_id,job_id",
        }
      )
      .select("*")
      .single();

    if (saveError) {
      return NextResponse.json(
        { error: "Failed to save AI analysis" },
        { status: 500 }
      );
    }

    return NextResponse.json({ match: savedMatch });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to analyze job" },
      { status: 500 }
    );
  }
}