import Link from "next/link";
import StatusSelect from "@/components/StatusSelect";
import { DEMO_USER_ID } from "@/lib/constants";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { ApplicationStatus } from "@/types";

export default async function ApplicationsPage() {
  const { data, error } = await supabaseAdmin
    .from("saved_jobs")
    .select(
      `
      id,
      status,
      job_id,
      jobs (
        id,
        title,
        company,
        location,
        salary
      )
    `
    )
    .eq("user_id", DEMO_USER_ID)
    .neq("status", "saved")
    .order("updated_at", { ascending: false });

  if (error) {
    return <p>Failed to load applications.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Applications</h1>
        <p className="mt-2 text-slate-600">
          Track jobs after you apply.
        </p>
      </div>

      {data.length === 0 && (
        <p className="text-slate-600">No applications yet.</p>
      )}

      <div className="space-y-4">
        {data.map((item: any) => {
          const job = item.jobs;

          return (
            <div key={item.id} className="card p-5">
              <div className="flex flex-col justify-between gap-4 md:flex-row">
                <div>
                  <h2 className="text-lg font-semibold">{job.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {job.company} · {job.location}
                  </p>

                  <Link
                    href={`/jobs/${job.id}`}
                    className="mt-3 inline-block text-sm text-blue-600 underline"
                  >
                    View Details
                  </Link>
                </div>

                <StatusSelect
                  jobId={job.id}
                  initialStatus={item.status as ApplicationStatus}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}