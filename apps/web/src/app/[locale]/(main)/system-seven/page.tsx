"use client";

import { Button, Input } from "@tietokilta/ui";
import dynamic from "next/dynamic";
import { useState } from "react";

const SyseContent = dynamic(() => import("./content"));

export default function Page() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [errorText, setErrorText] = useState("");

  if (loggedIn) return <SyseContent />;

  return (
    <main
      id="main"
      className="relative mb-8 flex flex-col items-center gap-2 md:gap-6"
    >
      <h1 className="mt-20 text-4xl">Login</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const password = form.querySelector("input")?.value;
          if (password === "masterseven") setLoggedIn(true);
          else setErrorText("Incorrect password");
        }}
        className="flex flex-col gap-4"
      >
        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <Input id="password" type="password" />
        </div>
        <div className="m-auto">
          <Button type="submit" variant="destructive">
            Login
          </Button>
        </div>
        <p className="text-center text-red-500">{errorText}</p>
      </form>
    </main>
  );
}
