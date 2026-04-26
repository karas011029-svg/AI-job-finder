import type { Job, Profile } from "@/types";

export function buildJobMatchPrompt(profile: Profile, job: Job) {
  return `You are a strict AI job matching assistant. Always return ONLY valid JSON with no other text.

Your task:
Analyze how well the job matches the user's profile.

Scoring rule:
- Skills match: 40%
- Experience match: 20%
- Location and work type match: 20%
- Salary match: 10%
- Seniority match: 10%

User Profile:
Target Role: ${profile.target_role}
Experience: ${profile.experience_years} years
Skills: ${profile.skills.join(", ")}
Location Preference: ${profile.location_preference}
Work Types: ${profile.work_types.join(", ")}
Salary Expectation: ${profile.salary_expectation}
Notes: ${profile.notes || "N/A"}

Job:
Title: ${job.title}
Company: ${job.company}
Location: ${job.location}
Salary: ${job.salary || "N/A"}
Description:
${job.description}

Return ONLY this JSON structure with no additional text:
{
  "match_score": number,
  "decision": "apply" | "maybe" | "skip",
  "matched_skills": string[],
  "missing_skills": string[],
  "reason": string,
  "suggested_resume_keywords": string[]
}

Rules:
- match_score must be from 0 to 100.
- Use "apply" if score is 75 or higher.
- Use "maybe" if score is between 50 and 74.
- Use "skip" if score is below 50.
- Be strict about required skills, work type, salary, seniority, and location.
- matched_skills should include skills from the user profile that are useful for this job.
- missing_skills should include important job requirements not clearly shown in the profile.
- reason should be short and practical.`;
}