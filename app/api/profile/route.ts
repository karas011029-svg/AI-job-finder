import { NextResponse } from "next/server";
import { DEMO_USER_ID } from "@/lib/constants";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("user_id", DEMO_USER_ID)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "Failed to load profile" },
      { status: 500 }
    );
  }

  return NextResponse.json({ profile: data });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const payload = {
      user_id: DEMO_USER_ID,
      target_role: body.target_role,
      experience_years: body.experience_years,
      skills: body.skills || [],
      location_preference: body.location_preference || "",
      work_types: body.work_types || [],
      salary_expectation: body.salary_expectation || "",
      notes: body.notes || "",
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .upsert(payload, {
        onConflict: "user_id",
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to save profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({ profile: data });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}