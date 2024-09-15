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
  const newsletterId = getIdFromUrl();

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
      <a
        href={`/api/weekly-newsletters/mail/${newsletterId}`}
        style={buttonStyle}
        onMouseOver={(e) =>
          ((e.target as HTMLElement).style.backgroundColor =
            buttonHoverStyle.backgroundColor)
        }
        onMouseOut={(e) =>
          ((e.target as HTMLElement).style.backgroundColor =
            buttonStyle.backgroundColor)
        }
      >
        Download HTML
      </a>
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
