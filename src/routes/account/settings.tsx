import { createFileRoute } from "@tanstack/react-router";

import { useAuth } from "@/providers/auth-provider";

export const Route = createFileRoute("/account/settings")({
  component: AccountSettingsPage,
});

function AccountSettingsPage() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl font-medium">Account</h2>
        <p className="mt-2 text-muted-foreground">Manage your profile and sign-in details.</p>
      </div>

      <section className="rounded-3xl border border-border bg-surface p-6">
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="text-muted-foreground">Name</dt>
            <dd className="mt-1 font-medium">
              {user.firstName} {user.lastName}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd className="mt-1 font-medium">{user.email}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Phone</dt>
            <dd className="mt-1 font-medium">{user.phone}</dd>
          </div>
        </dl>
      </section>

      <button type="button" onClick={logout} className="btn-ghost inline-flex">
        Sign out
      </button>
    </div>
  );
}
