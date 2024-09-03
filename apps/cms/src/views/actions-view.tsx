/* eslint-disable no-alert -- TODO: Implement proper alerting system */
import * as React from "react";

export const ActionsView = (): React.JSX.Element => {
  const [resultMessage, setResultMessage] = React.useState<string>("");

  const importCommittees = async (
    csv: string,
    year: number,
  ): Promise<Response> =>
    await fetch("/api/committees/import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ csv, year }),
    });

  const handleSubmitImportCommittees = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();

    const formData = new FormData(e.currentTarget);

    const committeeYear: number = parseInt(formData.get("year") as string);
    if (Number.isNaN(committeeYear)) {
      alert("Invalid year");
      return;
    }

    const file = formData.get("file");
    if (!(file instanceof File)) {
      alert("Invalid file");
      return;
    }
    const content = await file.text();

    const result = await importCommittees(content, committeeYear);
    if (result.ok) {
      setResultMessage("Import successful!");
    } else {
      setResultMessage(`Import failed. ${await result.text()}`);
    }
  };

  const handleSubmitLinkCommitteeImages = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();

    const formData = new FormData(e.currentTarget);

    const year = formData.get("year");

    if (!year) {
      alert("Invalid year");
      return;
    }

    const result = await fetch("/api/committee-members/link-photos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ year }),
    });
    if (result.ok) {
      setResultMessage("Linking successful!");
    } else {
      setResultMessage(`Linking failed. ${await result.text()}`);
    }
  };

  return (
    <div
      style={{
        margin: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        gap: 30,
      }}
    >
      <a href="/admin">Back</a>
      <span
        style={{
          color: "red",
          fontSize: "2em",
          WebkitTextStroke: "1px white",
          border: "2px solid red",
          padding: "10px",
        }}
      >
        ⚠️ DO NOT USE UNLESS YOU KNOW WHAT YOU'RE DOING! ⚠️
      </span>
      {resultMessage && <h2 style={{ color: "success" }}>{resultMessage}</h2>}
      <h1>Actions</h1>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 10,
        }}
        onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
          void handleSubmitImportCommittees(e)
        }
      >
        <h2>Import committees</h2>
        <label htmlFor="year">Committee year</label>
        <input
          id="year"
          name="year"
          type="number"
          placeholder="Committee year"
          defaultValue={new Date().getFullYear().toString()}
        />
        <label htmlFor="file" className="sr-only">
          Choose a csv file
        </label>
        <input id="file" name="file" type="file" />
        <button type="submit">Upload</button>
      </form>

      <form
        onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
          void handleSubmitLinkCommitteeImages(e)
        }
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 10,
        }}
      >
        <h2>Link committee images</h2>
        <p>
          Link committee images to the committee members based on name in the
          given year.
        </p>
        <input
          id="year"
          name="year"
          type="number"
          placeholder="Committee year"
          defaultValue={new Date().getFullYear().toString()}
        />
        <button type="submit">Link</button>
      </form>
    </div>
  );
};

export const ActionsLink = (): React.JSX.Element => {
  return <a href="/admin/actions">Actions</a>;
};
