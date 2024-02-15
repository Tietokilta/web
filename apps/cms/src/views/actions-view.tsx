import * as React from "react";

export const ActionsView = (): React.JSX.Element => {
  const [file, setFile] = React.useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {};

  return (
    <div style={{ margin: 20 }}>
      <a href="/admin">Back</a>
      <h1>Actions</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 10,
        }}
      >
        <label htmlFor="file" className="sr-only">
          Choose a csv file
        </label>
        <input id="file" type="file" onChange={handleFileChange} />
        {file && <button onClick={void handleUpload}>Upload</button>}
      </div>
    </div>
  );
};

export const ActionsLink = (): React.JSX.Element => {
  return <a href="/admin/actions">Actions</a>;
};
