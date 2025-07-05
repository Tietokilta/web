import { Button } from "@payloadcms/ui";

export function OAuthButton({ enabled }: { enabled: boolean }) {
  if (!enabled) {
    return null;
  }
  return (
    <div
      style={{ marginBottom: 40, display: "flex", justifyContent: "center" }}
    >
      <a href="/api/users/oauth/google/authorize">
        <Button>Sign in with OAuth</Button>
      </a>
    </div>
  );
}
