import { NextResponse } from "next/server";
import { DEMO_USER_ID } from "@/lib/constants";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("saved_jobs")
    .select("*")
    .eq("user_id", DEMO_USER_ID)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "Failed to load saved jobs" },
      { status: 500 }
    );
  }

  return NextResponse.json({ saved_jobs: data });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.job_id) {
      return NextResponse.json(
        { error: "job_id is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("saved_jobs")
      .upsert(
        {
          user_id: DEMO_USER_ID,
          job_id: body.job_id,
          status: "saved",
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,job_id",
        }
      )
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to save job" },
        { status: 500 }
      );
    }

    return NextResponse.json({ saved_job: data });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}