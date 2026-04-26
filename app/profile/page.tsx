import ProfileForm from "@/components/ProfileForm";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="mt-2 text-slate-600">
          AI will use this profile to compare jobs against your experience and
          preferences.
        </p>
      </div>

      <ProfileForm />
    </div>
  );
}