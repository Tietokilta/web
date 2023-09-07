import * as Tabs from ".";

import { render, screen } from "@testing-library/react";
import { expect, describe, it } from "vitest";

describe("Tabs", () => {
  it("renders have defaultTab initially selected", () => {
    render(
      <Tabs.Tabs defaultValue="1">
        <Tabs.TabsList>
          <Tabs.TabsTrigger value="1">Tab 1</Tabs.TabsTrigger>
          <Tabs.TabsTrigger value="2">Tab 2</Tabs.TabsTrigger>
        </Tabs.TabsList>
        <Tabs.TabsContent value="1">Tab 1 Content</Tabs.TabsContent>
        <Tabs.TabsContent value="2">Tab 2 Content</Tabs.TabsContent>
      </Tabs.Tabs>,
    );
    expect(screen.getByRole("tablist")).toHaveTextContent("Tab 1");
    expect(screen.getByRole("tablist")).toHaveTextContent("Tab 2");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Tab 1 Content");
    expect(screen.getByRole("tabpanel")).not.toHaveTextContent("Tab 2 Content");
    expect(screen.getByRole("tab", { name: "Tab 1" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
});
