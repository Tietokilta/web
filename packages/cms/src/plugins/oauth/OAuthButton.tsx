import Button from "payload/dist/admin/components/elements/Button";

export default function OAuthButton() {
  return (
    <div style={{ marginBottom: 40 }}>
      <Button el="anchor" url="/oauth2/authorize">
        Sign in with oAuth
      </Button>
    </div>
  );
}
