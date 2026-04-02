import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-[var(--color-background)] px-4 text-center">
    <div className="mb-6 text-8xl font-extrabold text-[var(--color-navy-800)] opacity-10"
      style={{ fontFamily: "var(--font-display)" }}>
      404
    </div>
    <div className="-mt-12 mb-3 text-5xl">🗺️</div>
    <h1 className="mb-2 text-2xl font-extrabold text-[var(--color-foreground)]"
      style={{ fontFamily: "var(--font-display)" }}>
      Page not found
    </h1>
    <p className="mb-8 max-w-sm text-sm leading-relaxed text-[var(--color-muted-fg)]">
      The page you're looking for doesn't exist or has been moved. Let's get you back on track.
    </p>
    <Link
      to="/"
      className="rounded-xl bg-navy-gradient px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-90 active:scale-[0.98]"
    >
      ← Back to Home
    </Link>
  </div>
);

export default NotFound;
