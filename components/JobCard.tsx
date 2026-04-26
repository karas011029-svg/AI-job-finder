"use client";

import Link from "next/link";
import { useState } from "react";
import type { JobMatch, JobWithMatch } from "@/types";
import MatchBadge from "./MatchBadge";

export default function JobCard({
  job,
  onUpdated,
}: {
  job: JobWithMatch;
  onUpdated: () => void;
}) {
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);

  const match: JobMatch | undefined = job.job_matches?.[0];
  const isSaved = Boolean(job.saved_jobs?.[0]);

  async function analyzeJob() {
    setAnalyzing(true);

    await fetch("/api/analyze-job", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        job_id: job.id,
      }),
    });

    setAnalyzing(false);
    onUpdated();
  }

  async function saveJob() {
    setSaving(true);

    await fetch("/api/saved-jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        job_id: job.id,
      }),
    });

    setSaving(false);
    onUpdated();
  }

  return (
    <div className="card p-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-semibold">{job.title}</h2>
            <MatchBadge score={match?.match_score} decision={match?.decision} />
          </div>

          <p className="mt-1 text-sm text-slate-600">
            {job.company} · {job.location || "Location not specified"}
          </p>

          {job.salary && (
            <p className="mt-1 text-sm text-slate-600">Salary: {job.salary}</p>
          )}

          <p className="mt-3 line-clamp-3 text-sm text-slate-600">
            {job.description}
          </p>
        </div>

        <div className="flex min-w-40 flex-col gap-2">
          <Link href={`/jobs/${job.id}`} className="btn-secondary text-center">
            View Details
          </Link>

          <button
            className="btn-primary"
            onClick={analyzeJob}
            disabled={analyzing}
          >
            {analyzing ? "Analyzing..." : "Analyze"}
          </button>

          <button
            className="btn-secondary"
            onClick={saveJob}
            disabled={saving || isSaved}
          >
            {isSaved ? "Saved" : saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}