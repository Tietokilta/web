import { Button } from "@tietokilta/ui";
import * as React from "react";
import dotenv from "dotenv";

const getIdFromUrl = () => {
  const pathArray = window.location.pathname.split("/");
  const id = pathArray[pathArray.length - 1];
  return id;
};
const getEmail = async () => {
  const newsletterId = getIdFromUrl();
  const response = await fetch(`/api/weekly-newsletters/mail/${newsletterId}`);
  return (await response.json()) as { html: string; subject: string };
};

const copyToClipboard = async () => {
  const textToCopy = await getEmail();
  if (!textToCopy) return;
  void navigator.clipboard.writeText(textToCopy.html);
};
const NewsletterButton = () => {
  const handleButtonClick = async () => {
    const confirmed = confirm(
      `Are you sure you want to send email? Remember to publish changes before.`,
    );
    if (!confirmed) return;
    dotenv.config();
    const email = await getEmail();
    if (!email) return;
    void fetch("/api/weekly-newsletters/mail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(email),
    });
  };
  return (
    <div>
      <Button onClick={handleButtonClick}>Send email</Button>
      <Button onClick={copyToClipboard}>Copy to clipboard</Button>
    </div>
  );
};

export default NewsletterButton;
