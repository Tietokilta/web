import { Button } from "@tietokilta/ui";

export function OAuthButton() {
  return (
    <div style={{ marginBottom: 40 }}>
      <a href="/api/users/oauth/google/authorize">
        <Button>Sign in with OAuth</Button>
      </a>
    </div>
  );
}
