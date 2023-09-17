import { Collapsible, CollapsibleContent, CollapsibleTrigger } from ".";

import { act, render, screen } from "@testing-library/react";
import { expect, describe, it } from "vitest";

describe("Collapsible", () => {
  it("only renders trigger initially", () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Trigger</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>,
    );
    expect(screen.getByRole("button")).toHaveTextContent("Trigger");
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
  });

  it("renders content when trigger is clicked", () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Trigger</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>,
    );
    act(() => screen.getByRole("button").click());
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});
