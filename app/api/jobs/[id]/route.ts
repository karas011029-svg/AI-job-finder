import { NextResponse } from "next/server";
import { DEMO_USER_ID } from "@/lib/constants";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from("jobs")
    .select(
      `
      *,
      job_matches (*),
      saved_jobs (*)
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Failed to load job" },
      { status: 500 }
    );
  }

  const job = {
    ...data,
    job_matches: data.job_matches?.filter(
      (match: any) => match.user_id === DEMO_USER_ID
    ),
    saved_jobs: data.saved_jobs?.filter(
      (saved: any) => saved.user_id === DEMO_USER_ID
    ),
  };

  return NextResponse.json({ job });
}