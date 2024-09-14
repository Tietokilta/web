import { Button } from "@tietokilta/ui";
import * as React from "react";

const getIdFromUrl = (): string => {
  const pathArray = window.location.pathname.split("/");
  const id = pathArray[pathArray.length - 1];
  return id;
};
const getEmail = async (): Promise<{
  html: string;
  subject: string;
}> => {
  const newsletterId = getIdFromUrl();
  const response = await fetch(`/api/weekly-newsletters/mail/${newsletterId}`);
  return (await response.json()) as { html: string; subject: string };
};

const getTelegramMessage = async (
  locale: string,
): Promise<{
  message: string;
}> => {
  const newsletterId = getIdFromUrl();
  const response = await fetch(
    `/api/weekly-newsletters/telegram/${newsletterId}?locale=${locale}`,
  );
  return (await response.json()) as { message: string };
};

const downloadHtmlFile = async (): Promise<void> => {
  const textToCopy = await getEmail();

  // Create a Blob with the HTML content
  const blob = new Blob([textToCopy.html], { type: "text/html" });

  // Create a link element
  const link = document.createElement("a");

  // Create a URL for the Blob and set it as the href attribute of the link
  const url = URL.createObjectURL(blob);
  link.href = url;

  // Set the download attribute with a filename
  link.download = `${textToCopy.subject}.html`;

  // Append the link to the body (not visible)
  document.body.appendChild(link);

  // Programmatically click the link to trigger the download
  link.click();

  // Clean up by removing the link and revoking the Blob URL
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const copyTelegramMessage = async (locale: string): Promise<void> => {
  const textToCopy = await getTelegramMessage(locale);
  void navigator.clipboard.writeText(textToCopy.message);
};

const NewsletterButton = (): React.ReactElement => {
  const handleButtonClick = async (): Promise<void> => {
    // eslint-disable-next-line no-alert -- Good to have confirmation
    const confirmed = confirm(
      `Are you sure you want to send email? Remember to publish changes before.`,
    );
    if (!confirmed) return;
    const email = await getEmail();
    await fetch("/api/weekly-newsletters/mail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(email),
    });
  };
  const buttonStyle = {
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "5px",
    backgroundColor: "#000",
    color: "white",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };
  const buttonHoverStyle = {
    backgroundColor: "#333333",
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gridGap: "10px",
        maxWidth: "400px",
        margin: "0 auto",
      }}
    >
      <Button
        style={buttonStyle}
        onMouseOver={(e) =>
          ((e.target as HTMLElement).style.backgroundColor =
            buttonHoverStyle.backgroundColor)
        }
        onMouseOut={(e) =>
          ((e.target as HTMLElement).style.backgroundColor =
            buttonStyle.backgroundColor)
        }
        onClick={() => void handleButtonClick()}
      >
        Send email
      </Button>
      <Button
        style={buttonStyle}
        onMouseOver={(e) =>
          ((e.target as HTMLElement).style.backgroundColor =
            buttonHoverStyle.backgroundColor)
        }
        onMouseOut={(e) =>
          ((e.target as HTMLElement).style.backgroundColor =
            buttonStyle.backgroundColor)
        }
        onClick={() => void downloadHtmlFile()}
      >
        Download HTML
      </Button>
      <Button
        style={buttonStyle}
        onMouseOver={(e) =>
          ((e.target as HTMLElement).style.backgroundColor =
            buttonHoverStyle.backgroundColor)
        }
        onMouseOut={(e) =>
          ((e.target as HTMLElement).style.backgroundColor =
            buttonStyle.backgroundColor)
        }
        onClick={() => void copyTelegramMessage("fi")}
      >
        Copy finnish tg
      </Button>
      <Button
        style={buttonStyle}
        onMouseOver={(e) =>
          ((e.target as HTMLElement).style.backgroundColor =
            buttonHoverStyle.backgroundColor)
        }
        onMouseOut={(e) =>
          ((e.target as HTMLElement).style.backgroundColor =
            buttonStyle.backgroundColor)
        }
        onClick={() => void copyTelegramMessage("en")}
      >
        Copy english tg
      </Button>
    </div>
  );
};

export default NewsletterButton;
