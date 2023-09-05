import { Button } from ".";

import { render, screen } from "@testing-library/react";

describe("Button", () => {
  it("renders a button with text", () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("Test Button");
  });
});
