import { sanitizeRedirectPath } from "@/lib/auth";

type LoginPageProps = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, next } = await searchParams;
  const destination = sanitizeRedirectPath(next);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <section className="w-full rounded-lg border border-border bg-surface p-6 shadow-[--shadow-token-md]">
        <h1 className="text-2xl font-semibold text-foreground">Admin sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">Use the administrator credentials configured for this site.</p>
        {error === "invalid" && (
          <p className="mt-4 rounded-md bg-danger-muted px-3 py-2 text-sm text-danger" role="alert">
            Invalid email or password.
          </p>
        )}
        <form action="/api/auth/login" method="post" className="mt-6 flex flex-col gap-4">
          <input name="next" type="hidden" value={destination} />
          <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
            Email
            <input className="rounded-md border border-border bg-background px-3 py-2" name="email" type="email" autoComplete="username" required />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
            Password
            <input className="rounded-md border border-border bg-background px-3 py-2" name="password" type="password" autoComplete="current-password" required />
          </label>
          <button className="rounded-md bg-accent px-3 py-2 font-medium text-accent-foreground hover:bg-accent-hover" type="submit">
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}
