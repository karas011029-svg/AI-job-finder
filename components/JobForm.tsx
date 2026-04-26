"use client";

import { useState } from "react";

type JobFormState = {
  title: string;
  company: string;
  location: string;
  salary: string;
  job_url: string;
  description: string;
};

const initialState: JobFormState = {
  title: "",
  company: "",
  location: "",
  salary: "",
  job_url: "",
  description: "",
};

export default function JobForm({ onCreated }: { onCreated: () => void }) {
  const [form, setForm] = useState<JobFormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function updateField(name: keyof JobFormState, value: string) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!res.ok) {
      setMessage("Failed to add job.");
      return;
    }

    setForm(initialState);
    setMessage("Job added successfully.");
    onCreated();
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 p-6">
      <h2 className="text-lg font-semibold">Add Job Manually</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label">Job Title</label>
          <input
            className="input"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="Senior React Native Developer"
            required
          />
        </div>

        <div>
          <label className="label">Company</label>
          <input
            className="input"
            value={form.company}
            onChange={(e) => updateField("company", e.target.value)}
            placeholder="ABC Tech"
            required
          />
        </div>

        <div>
          <label className="label">Location</label>
          <input
            className="input"
            value={form.location}
            onChange={(e) => updateField("location", e.target.value)}
            placeholder="Remote US"
          />
        </div>

        <div>
          <label className="label">Salary</label>
          <input
            className="input"
            value={form.salary}
            onChange={(e) => updateField("salary", e.target.value)}
            placeholder="$60/hr"
          />
        </div>
      </div>

      <div>
        <label className="label">Job URL</label>
        <input
          className="input"
          value={form.job_url}
          onChange={(e) => updateField("job_url", e.target.value)}
          placeholder="https://example.com/job"
        />
      </div>

      <div>
        <label className="label">Job Description</label>
        <textarea
          className="input min-h-40"
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Paste the full job description here..."
          required
        />
      </div>

      <button className="btn-primary" disabled={loading}>
        {loading ? "Adding..." : "Add Job"}
      </button>

      {message && <p className="text-sm text-slate-600">{message}</p>}
    </form>
  );
}