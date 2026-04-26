export type Decision = "apply" | "maybe" | "skip";

export type ApplicationStatus =
  | "saved"
  | "applied"
  | "interviewing"
  | "rejected"
  | "offer";

export type Profile = {
  id?: string;
  user_id: string;
  target_role: string;
  experience_years: number;
  skills: string[];
  location_preference: string;
  work_types: string[];
  salary_expectation: string;
  notes: string;
};

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  job_url: string;
  description: string;
  source: string;
  created_at: string;
};

export type JobMatch = {
  id: string;
  user_id: string;
  job_id: string;
  match_score: number;
  decision: Decision;
  matched_skills: string[];
  missing_skills: string[];
  reason: string;
  suggested_resume_keywords: string[];
  created_at: string;
};

export type SavedJob = {
  id: string;
  user_id: string;
  job_id: string;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
};

export type JobWithMatch = Job & {
  job_matches?: JobMatch[];
  saved_jobs?: SavedJob[];
};