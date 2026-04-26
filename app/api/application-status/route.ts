import { NextResponse } from "next/server";
import { DEMO_USER_ID } from "@/lib/constants";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const allowedStatuses = [
  "saved",
  "applied",
  "interviewing",
  "rejected",
  "offer",
];

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const jobId = body.job_id;
    const status = body.status;

    if (!jobId || !status) {
      return NextResponse.json(
        { error: "job_id and status are required" },
        { status: 400 }
      );
    }

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("saved_jobs")
      .upsert(
        {
          user_id: DEMO_USER_ID,
          job_id: jobId,
          status,
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
        { error: "Failed to update status" },
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