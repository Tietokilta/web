import * as React from "react";

const getIdFromUrl = (): string => {
  const pathArray = window.location.pathname.split("/");
  const id = pathArray[pathArray.length - 1];
  return id;
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
        onClick={() => void copyTelegramMessage("fi")}
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
        onClick={() => void copyTelegramMessage("en")}
      >
        Copy english tg
      </button>
    </div>
  );
};

export default NewsletterButton;
