"use client";

import { useEffect, useState } from "react";
import JobForm from "@/components/JobForm";
import JobCard from "@/components/JobCard";
import type { JobWithMatch } from "@/types";

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobWithMatch[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadJobs() {
    setLoading(true);

    const res = await fetch("/api/jobs");
    const data = await res.json();

    setJobs(data.jobs || []);
    setLoading(false);
  }

  useEffect(() => {
    loadJobs();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Jobs</h1>
        <p className="mt-2 text-slate-600">
          Add jobs manually, then use AI to analyze how well they match your
          profile.
        </p>
      </div>

      <JobForm onCreated={loadJobs} />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Job List</h2>

        {loading && <p className="text-slate-600">Loading jobs...</p>}

        {!loading && jobs.length === 0 && (
          <p className="text-slate-600">No jobs added yet.</p>
        )}

        {!loading &&
          jobs.map((job) => (
            <JobCard key={job.id} job={job} onUpdated={loadJobs} />
          ))}
      </section>
    </div>
  );
}