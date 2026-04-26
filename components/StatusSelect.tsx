"use client";

import { useState } from "react";
import type { ApplicationStatus } from "@/types";
import { APPLICATION_STATUSES } from "@/lib/constants";

export default function StatusSelect({
  jobId,
  initialStatus,
  onUpdated,
}: {
  jobId: string;
  initialStatus: ApplicationStatus;
  onUpdated?: () => void;
}) {
  const [status, setStatus] = useState<ApplicationStatus>(initialStatus);
  const [loading, setLoading] = useState(false);

  async function updateStatus(nextStatus: ApplicationStatus) {
    setStatus(nextStatus);
    setLoading(true);

    await fetch("/api/application-status", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        job_id: jobId,
        status: nextStatus,
      }),
    });

    setLoading(false);
    onUpdated?.();
  }

  return (
    <select
      className="input max-w-44"
      value={status}
      disabled={loading}
      onChange={(e) => updateStatus(e.target.value as ApplicationStatus)}
    >
      {APPLICATION_STATUSES.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
}