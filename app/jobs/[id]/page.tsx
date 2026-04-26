import Link from "next/link";
import MatchBadge from "@/components/MatchBadge";
import StatusSelect from "@/components/StatusSelect";
import type { JobMatch, JobWithMatch, SavedJob } from "@/types";

async function getJob(id: string): Promise<JobWithMatch | null> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/jobs/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data.job;
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    return (
      <div className="card p-6">
        <h1 className="text-xl font-bold">Job not found</h1>
        <Link href="/jobs" className="mt-4 inline-block text-sm underline">
          Back to jobs
        </Link>
      </div>
    );
  }

  const match: JobMatch | undefined = job.job_matches?.[0];
  const savedJob: SavedJob | undefined = job.saved_jobs?.[0];

  return (
    <div className="space-y-6">
      <Link href="/jobs" className="text-sm text-slate-600 underline">
        Back to jobs
      </Link>

      <section className="card p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <div>
            <h1 className="text-2xl font-bold">{job.title}</h1>
            <p className="mt-2 text-slate-600">
              {job.company} · {job.location || "Location not specified"}
            </p>

            {job.salary && (
              <p className="mt-1 text-slate-600">Salary: {job.salary}</p>
            )}

            {job.job_url && (
              <a
                href={job.job_url}
                target="_blank"
                className="mt-3 inline-block text-sm text-blue-600 underline"
              >
                Open original job
              </a>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <MatchBadge
              score={match?.match_score}
              decision={match?.decision}
            />

            {savedJob && (
              <StatusSelect
                jobId={job.id}
                initialStatus={savedJob.status}
              />
            )}
          </div>
        </div>
      </section>

      {match && (
        <section className="card space-y-5 p-6">
          <h2 className="text-xl font-semibold">AI Analysis</h2>

          <div>
            <h3 className="font-medium">Reason</h3>
            <p className="mt-1 text-slate-600">{match.reason}</p>
          </div>

          <div>
            <h3 className="font-medium">Matched Skills</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {match.matched_skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium">Missing Skills</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {match.missing_skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-red-100 px-3 py-1 text-xs text-red-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium">Suggested Resume Keywords</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {match.suggested_resume_keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {!match && (
        <section className="card p-6">
          <p className="text-slate-600">
            This job has not been analyzed yet. Go back to the jobs page and
            click Analyze.
          </p>
        </section>
      )}

      <section className="card p-6">
        <h2 className="text-xl font-semibold">Job Description</h2>
        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">
          {job.description}
        </p>
      </section>
    </div>
  );
}