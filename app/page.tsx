import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="card p-8">
        <h1 className="text-3xl font-bold text-slate-900">
          AI Job Finder
        </h1>

        <p className="mt-4 max-w-2xl text-slate-600">
          Practice AI development by building a job matching app. Create your
          profile, add job descriptions, and let AI analyze whether each job is
          a good match for you.
        </p>

        <div className="mt-6 flex gap-3">
          <Link href="/profile" className="btn-primary">
            Create Profile
          </Link>

          <Link href="/jobs" className="btn-secondary">
            View Jobs
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="card p-5">
          <h2 className="font-semibold">1. Add Profile</h2>
          <p className="mt-2 text-sm text-slate-600">
            Add your role, skills, salary, work type, and location preferences.
          </p>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold">2. Add Jobs</h2>
          <p className="mt-2 text-sm text-slate-600">
            Paste job descriptions manually first. Later, you can connect job
            APIs.
          </p>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold">3. Analyze with AI</h2>
          <p className="mt-2 text-sm text-slate-600">
            AI gives match score, missing skills, decision, and resume keywords.
          </p>
        </div>
      </section>
    </div>
  );
}