import type { Decision } from "@/types";

export default function MatchBadge({
  score,
  decision,
}: {
  score?: number;
  decision?: Decision;
}) {
  if (score === undefined || !decision) {
    return (
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
        Not analyzed
      </span>
    );
  }

  const styles: Record<Decision, string> = {
    apply: "bg-green-100 text-green-700",
    maybe: "bg-yellow-100 text-yellow-700",
    skip: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[decision]}`}
    >
      {score}% · {decision.toUpperCase()}
    </span>
  );
}