"use client";

import { useDocumentInfo } from "@payloadcms/ui";
import * as React from "react";

const getTelegramMessage = async (
  locale: string,
  newsletterId: string,
): Promise<{
  message: string;
}> => {
  const response = await fetch(
    `/api/weekly-newsletters/telegram/${newsletterId}?locale=${locale}`,
  );
  return (await response.json()) as { message: string };
};

const copyTelegramMessage = async (
  locale: string,
  newsletterId: string,
): Promise<void> => {
  const textToCopy = await getTelegramMessage(locale, newsletterId);
  void navigator.clipboard.writeText(textToCopy.message);
};

export function NewsletterButton(): React.ReactElement {
  const { id: newsletterId } = useDocumentInfo();

  if (!newsletterId) {
    return <div>Loading...</div>;
  }

  if (typeof newsletterId !== "string") {
    return <div>Invalid newsletter ID, how tf?</div>;
  }

  const handleButtonClick = async (): Promise<void> => {
    // eslint-disable-next-line no-alert -- Good to have confirmation
    const confirmed = confirm(
      `Are you sure you want to send email? Remember to publish changes before.`,
    );
    if (!confirmed) return;
    await fetch(`/api/weekly-newsletters/mail/${newsletterId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
      <button
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
      </button>
      {[
        { locale: undefined, label: "Download HTML (FI + EN)" },
        { locale: "fi", label: "Download Finnish HTML" },
        { locale: "en", label: "Download English HTML" },
      ].map(({ locale, label }) => (
        <a
          key={label}
          href={`/api/weekly-newsletters/mail/${newsletterId}${locale ? `?locale=${locale}` : ""}`}
          download
          style={{
            ...buttonStyle,
            // Look like the buttons: centred label, no link underline.
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            textDecoration: "none",
          }}
          onMouseOver={(e) =>
            ((e.target as HTMLElement).style.backgroundColor =
              buttonHoverStyle.backgroundColor)
          }
          onMouseOut={(e) =>
            ((e.target as HTMLElement).style.backgroundColor =
              buttonStyle.backgroundColor)
          }
        >
          {label}
        </a>
      ))}
      <button
        style={buttonStyle}
        onMouseOver={(e) =>
          ((e.target as HTMLElement).style.backgroundColor =
            buttonHoverStyle.backgroundColor)
        }
        onMouseOut={(e) =>
          ((e.target as HTMLElement).style.backgroundColor =
            buttonStyle.backgroundColor)
        }
        onClick={() => void copyTelegramMessage("fi", newsletterId)}
      >
        Copy finnish tg
      </button>
      <button
        style={buttonStyle}
        onMouseOver={(e) =>
          ((e.target as HTMLElement).style.backgroundColor =
            buttonHoverStyle.backgroundColor)
        }
        onMouseOut={(e) =>
          ((e.target as HTMLElement).style.backgroundColor =
            buttonStyle.backgroundColor)
        }
        onClick={() => void copyTelegramMessage("en", newsletterId)}
      >
        Copy english tg
      </button>
    </div>
  );
}
