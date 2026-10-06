"use client";

/* eslint-disable no-alert -- TODO: Implement proper alerting system */
import Link from "next/link";
import * as React from "react";
import type { ValidationResult } from "../controllers/validate-committees-controller";

function ValidateCommitteesForm(): React.JSX.Element {
  const [result, setResult] = React.useState<ValidationResult | null>(null);
  const [error, setError] = React.useState<string>("");
  const [isValidating, setIsValidating] = React.useState(false);
  const [allYears, setAllYears] = React.useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();

    const year = new FormData(e.currentTarget).get("year");
    if (!allYears && !year) {
      setError("Invalid year");
      return;
    }

    setResult(null);
    setError("");
    setIsValidating(true);
    try {
      const response = await fetch("/api/committees/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(allYears ? { all: true } : { year }),
      });
      if (response.ok) {
        setResult((await response.json()) as ValidationResult);
      } else {
        setError(`Validation failed. ${await response.text()}`);
      }
    } catch (err) {
      setError(`Validation failed. ${String(err)}`);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <form
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => void handleSubmit(e)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 10,
      }}
    >
      <h2>Validate committees</h2>
      <p>
        Check the committees and committee members of the given year against the
        schema. Read-only, nothing is changed.
      </p>
      <label htmlFor="validate-year">Year</label>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <input
          id="validate-year"
          name="year"
          type="number"
          placeholder="Committee year"
          defaultValue={new Date().getFullYear().toString()}
          disabled={allYears}
        />
        <label htmlFor="validate-all-years">
          <input
            id="validate-all-years"
            type="checkbox"
            checked={allYears}
            onChange={(e) => setAllYears(e.target.checked)}
          />{" "}
          All
        </label>
      </div>
      <button type="submit" disabled={isValidating}>
        {isValidating ? "Validating..." : "Validate"}
      </button>
      {isValidating ? <progress aria-label="Validating committees" /> : null}
      {error ? <p style={{ color: "red" }}>{error}</p> : null}
      {result ? (
        <div>
          <p>
            Checked {result.committeeCount} committees and{" "}
            {result.committeeMemberCount} committee members in{" "}
            {result.year ?? "all years"}.{" "}
            {result.issues.length === 0
              ? "No issues found."
              : `${result.issues.length} issue(s) found:`}
          </p>
          <ul>
            {result.issues.map((issue) => (
              <li
                key={`${issue.collection}-${issue.id}-${issue.path}-${issue.message}`}
              >
                <Link
                  href={`/admin/collections/${issue.collection}/${issue.id}`}
                >
                  {issue.collection}: {issue.label}
                </Link>{" "}
                — <code>{issue.path}</code>: {issue.message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </form>
  );
}

export function ActionsView(): React.JSX.Element {
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
      <Link href="/admin">Back</Link>
      <span
        style={{
          color: "red",
          fontSize: "2em",
          WebkitTextStroke: "1px white",
          border: "2px solid red",
          padding: "10px",
        }}
      >
        ⚠️ DO NOT USE UNLESS YOU KNOW WHAT YOU&apos;RE DOING! ⚠️
      </span>
      {resultMessage ? (
        <h2 style={{ color: "success" }}>{resultMessage}</h2>
      ) : null}
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

      <ValidateCommitteesForm />
    </div>
  );
}

export function ActionsLink(): React.JSX.Element {
  return <Link href="/admin/actions">Actions</Link>;
}
