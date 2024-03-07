/* eslint-disable no-alert -- TODO: Implement proper alerting system */
import * as React from "react";

export const ActionsView = (): React.JSX.Element => {
  const [success, setSuccess] = React.useState<boolean>(false);

  const importCommittees = async (
    csv: string,
    year: number,
  ): Promise<boolean> => {
    const response = await fetch("/api/committees/import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ csv, year }),
    });

    console.log(response);

    return response.ok;
  };

  const handleSubmit = async (
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
    if (result) {
      setSuccess(true);
    }
  };

  return (
    <div style={{ margin: 20 }}>
      <a href="/admin">Back</a>
      <h1>Actions</h1>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 10,
        }}
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => void handleSubmit(e)}
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
        {success && <p style={{ color: "success" }}>Import successful!</p>}
      </form>
    </div>
  );
};

export const ActionsLink = (): React.JSX.Element => {
  return <a href="/admin/actions">Actions</a>;
};
