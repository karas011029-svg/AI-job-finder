import { NextResponse } from "next/server";
import { DEMO_USER_ID } from "@/lib/constants";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("jobs")
    .select(
      `
      *,
      job_matches (*),
      saved_jobs (*)
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "Failed to load jobs" },
      { status: 500 }
    );
  }

  const jobs = data.map((job) => ({
    ...job,
    job_matches: job.job_matches?.filter(
      (match: any) => match.user_id === DEMO_USER_ID
    ),
    saved_jobs: job.saved_jobs?.filter(
      (saved: any) => saved.user_id === DEMO_USER_ID
    ),
  }));

  return NextResponse.json({ jobs });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.title || !body.company || !body.description) {
      return NextResponse.json(
        { error: "title, company, and description are required" },
        { status: 400 }
      );
    }

    const payload = {
      title: body.title,
      company: body.company,
      location: body.location || "",
      salary: body.salary || "",
      job_url: body.job_url || null,
      description: body.description,
      source: "manual",
    };

    const { data, error } = await supabaseAdmin
      .from("jobs")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to create job" },
        { status: 500 }
      );
    }

    return NextResponse.json({ job: data });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}