import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>Demo</Badge>);
    expect(screen.getByText("Demo")).toBeInTheDocument();
  });

  it("applies outline variant by default", () => {
    render(<Badge>Free</Badge>);
    const el = screen.getByText("Free");
    expect(el).toHaveClass("border");
  });

  it("applies solid variant when specified", () => {
    render(<Badge variant="solid">Pro</Badge>);
    const el = screen.getByText("Pro");
    expect(el).toHaveClass("bg-[var(--accent)]");
  });
});
