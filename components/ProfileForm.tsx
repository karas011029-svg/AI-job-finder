"use client";

import { useEffect, useState } from "react";
import type { Profile } from "@/types";

type ProfileFormState = {
  target_role: string;
  experience_years: string;
  skills: string;
  location_preference: string;
  work_types: string;
  salary_expectation: string;
  notes: string;
};

const initialState: ProfileFormState = {
  target_role: "",
  experience_years: "0",
  skills: "",
  location_preference: "",
  work_types: "",
  salary_expectation: "",
  notes: "",
};

export default function ProfileForm() {
  const [form, setForm] = useState<ProfileFormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadProfile() {
    const res = await fetch("/api/profile");
    const data = await res.json();

    if (data.profile) {
      const profile: Profile = data.profile;

      setForm({
        target_role: profile.target_role || "",
        experience_years: String(profile.experience_years || 0),
        skills: profile.skills?.join(", ") || "",
        location_preference: profile.location_preference || "",
        work_types: profile.work_types?.join(", ") || "",
        salary_expectation: profile.salary_expectation || "",
        notes: profile.notes || "",
      });
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  function updateField(name: keyof ProfileFormState, value: string) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const payload = {
      target_role: form.target_role,
      experience_years: Number(form.experience_years || 0),
      skills: form.skills
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      location_preference: form.location_preference,
      work_types: form.work_types
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      salary_expectation: form.salary_expectation,
      notes: form.notes,
    };

    const res = await fetch("/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!res.ok) {
      setMessage("Failed to save profile.");
      return;
    }

    setMessage("Profile saved successfully.");
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5 p-6">
      <div>
        <label className="label">Target Role</label>
        <input
          className="input"
          value={form.target_role}
          onChange={(e) => updateField("target_role", e.target.value)}
          placeholder="React Native Developer"
          required
        />
      </div>

      <div>
        <label className="label">Experience Years</label>
        <input
          className="input"
          type="number"
          value={form.experience_years}
          onChange={(e) => updateField("experience_years", e.target.value)}
          placeholder="7"
          required
        />
      </div>

      <div>
        <label className="label">Skills</label>
        <input
          className="input"
          value={form.skills}
          onChange={(e) => updateField("skills", e.target.value)}
          placeholder="React Native, TypeScript, Expo, Firebase"
        />
        <p className="mt-1 text-xs text-slate-500">
          Separate skills with commas.
        </p>
      </div>

      <div>
        <label className="label">Location Preference</label>
        <input
          className="input"
          value={form.location_preference}
          onChange={(e) => updateField("location_preference", e.target.value)}
          placeholder="Remote US"
        />
      </div>

      <div>
        <label className="label">Work Types</label>
        <input
          className="input"
          value={form.work_types}
          onChange={(e) => updateField("work_types", e.target.value)}
          placeholder="Full-time, Contract, W2, C2C"
        />
      </div>

      <div>
        <label className="label">Salary Expectation</label>
        <input
          className="input"
          value={form.salary_expectation}
          onChange={(e) => updateField("salary_expectation", e.target.value)}
          placeholder="$60/hr"
        />
      </div>

      <div>
        <label className="label">Extra Notes</label>
        <textarea
          className="input min-h-28"
          value={form.notes}
          onChange={(e) => updateField("notes", e.target.value)}
          placeholder="I prefer remote mobile development jobs in the US."
        />
      </div>

      <button className="btn-primary" disabled={loading}>
        {loading ? "Saving..." : "Save Profile"}
      </button>

      {message && <p className="text-sm text-slate-600">{message}</p>}
    </form>
  );
}