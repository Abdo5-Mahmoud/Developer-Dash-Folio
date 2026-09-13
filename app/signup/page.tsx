import Link from "next/link";

import { connectToDatabase } from "@/lib/mongodb";
import { UserModel } from "@/lib/models/user";

type SignupPageProps = {
  searchParams: Promise<{ error?: string; created?: string }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { error, created } = await searchParams;
  let initialized = false;

  try {
    await connectToDatabase();
    initialized = (await UserModel.countDocuments({ role: "owner" })) > 0;
  } catch {
    initialized = false;
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <section className="w-full rounded-lg border border-border bg-surface p-6 shadow-[--shadow-token-md]">
        <h1 className="text-2xl font-semibold text-foreground">
          Create owner account
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          This setup creates the single owner account for this portfolio. It is
          automatically closed after the first account is created.
        </p>

        {initialized ? (
          <div className="mt-6 rounded-md border border-border bg-surface-sunken px-3 py-3 text-sm text-muted-foreground">
            Owner setup is already complete. Sign in with the existing account.
            <Link
              href="/login"
              className="mt-2 block font-medium text-accent hover:text-accent-hover"
            >
              Go to sign in
            </Link>
          </div>
        ) : (
          <>
            {error === "invalid" && (
              <p
                className="mt-4 rounded-md bg-danger-muted px-3 py-2 text-sm text-danger"
                role="alert"
              >
                Use a valid email and a password with at least 8 characters. The
                passwords must match.
              </p>
            )}
            {error === "unavailable" && (
              <p
                className="mt-4 rounded-md bg-danger-muted px-3 py-2 text-sm text-danger"
                role="alert"
              >
                Account setup is temporarily unavailable. Check the database
                connection and try again.
              </p>
            )}
            <form
              action="/api/auth/signup"
              method="post"
              className="mt-6 flex flex-col gap-4"
            >
              <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
                Email
                <input
                  className="rounded-md border border-border bg-background px-3 py-2"
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
                Password
                <input
                  className="rounded-md border border-border bg-background px-3 py-2"
                  name="password"
                  type="password"
                  minLength={8}
                  autoComplete="new-password"
                  required
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
                Confirm password
                <input
                  className="rounded-md border border-border bg-background px-3 py-2"
                  name="confirmPassword"
                  type="password"
                  minLength={8}
                  autoComplete="new-password"
                  required
                />
              </label>
              <button
                className="rounded-md bg-accent px-3 py-2 font-medium text-accent-foreground hover:bg-accent-hover"
                type="submit"
              >
                Create owner account
              </button>
            </form>
          </>
        )}

        {created === "1" && (
          <p
            className="mt-4 rounded-md bg-success-muted px-3 py-2 text-sm text-success"
            role="status"
          >
            Account created. You can sign in now.
          </p>
        )}

        <Link
          href="/login"
          className="mt-5 block text-center text-sm text-muted-foreground hover:text-foreground"
        >
          Back to sign in
        </Link>
      </section>
    </main>
  );
}
