import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ConsentBanner } from "../components/ConsentBanner";

describe("ConsentBanner", () => {
  const defaultProps = {
    storageKey: "test-consent",
  };

  it("renders when consent is pending", () => {
    render(
      <ConsentBanner {...defaultProps}>
        <ConsentBanner.Content>Test message</ConsentBanner.Content>
      </ConsentBanner>,
    );

    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  it("does not render when consent is already accepted", () => {
    localStorage.setItem("test-consent", "accepted");

    render(
      <ConsentBanner {...defaultProps}>
        <ConsentBanner.Content>Test message</ConsentBanner.Content>
      </ConsentBanner>,
    );

    expect(screen.queryByText("Test message")).not.toBeInTheDocument();
  });

  it("hides banner when accept button is clicked", () => {
    render(
      <ConsentBanner {...defaultProps}>
        <ConsentBanner.Content>Test message</ConsentBanner.Content>
        <ConsentBanner.Actions>
          <ConsentBanner.AcceptButton>Accept</ConsentBanner.AcceptButton>
        </ConsentBanner.Actions>
      </ConsentBanner>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Accept" }));

    expect(screen.queryByText("Test message")).not.toBeInTheDocument();
    expect(localStorage.getItem("test-consent")).toBe("accepted");
  });

  it("hides banner when dismiss button is clicked", () => {
    render(
      <ConsentBanner {...defaultProps}>
        <ConsentBanner.Content>Test message</ConsentBanner.Content>
        <ConsentBanner.Actions>
          <ConsentBanner.DismissButton>Decline</ConsentBanner.DismissButton>
        </ConsentBanner.Actions>
      </ConsentBanner>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Decline" }));

    expect(screen.queryByText("Test message")).not.toBeInTheDocument();
    expect(localStorage.getItem("test-consent")).toBe("dismissed");
  });

  it("calls onAccept callback when accept is clicked", () => {
    const onAccept = vi.fn();

    render(
      <ConsentBanner {...defaultProps} onAccept={onAccept}>
        <ConsentBanner.Actions>
          <ConsentBanner.AcceptButton>Accept</ConsentBanner.AcceptButton>
        </ConsentBanner.Actions>
      </ConsentBanner>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Accept" }));

    expect(onAccept).toHaveBeenCalledTimes(1);
  });

  it("supports render prop pattern", () => {
    render(
      <ConsentBanner {...defaultProps}>
        {({ accept, status }) => (
          <div>
            <span data-testid="status">{status}</span>
            <button onClick={accept}>Custom Accept</button>
          </div>
        )}
      </ConsentBanner>,
    );

    expect(screen.getByTestId("status")).toHaveTextContent("pending");
    fireEvent.click(screen.getByRole("button", { name: "Custom Accept" }));
    expect(screen.queryByTestId("status")).not.toBeInTheDocument();
  });

  it("applies variant classes correctly", () => {
    render(
      <ConsentBanner {...defaultProps} position="top" variant="light">
        <ConsentBanner.Content>Test</ConsentBanner.Content>
      </ConsentBanner>,
    );

    const banner = screen.getByRole("alertdialog");
    expect(banner).toHaveClass("top-0");
    expect(banner).toHaveClass("bg-white");
  });

  it("has correct accessibility attributes", () => {
    render(
      <ConsentBanner {...defaultProps} aria-label="Cookie consent">
        <ConsentBanner.Content>Test</ConsentBanner.Content>
      </ConsentBanner>,
    );

    const banner = screen.getByRole("alertdialog");
    expect(banner).toHaveAttribute("aria-label", "Cookie consent");
    expect(banner).toHaveAttribute("aria-live", "polite");
  });

  it("renders link component correctly", () => {
    render(
      <ConsentBanner {...defaultProps}>
        <ConsentBanner.Content>
          Check our{" "}
          <ConsentBanner.Link href="/privacy">Privacy Policy</ConsentBanner.Link>
        </ConsentBanner.Content>
      </ConsentBanner>,
    );

    const link = screen.getByRole("link", { name: "Privacy Policy" });
    expect(link).toHaveAttribute("href", "/privacy");
  });

  it("close button hides banner without persisting", () => {
    render(
      <ConsentBanner {...defaultProps}>
        <ConsentBanner.Content>Test</ConsentBanner.Content>
        <ConsentBanner.CloseButton action="hide" />
      </ConsentBanner>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(screen.queryByText("Test")).not.toBeInTheDocument();
    // Should not persist when action is "hide"
    expect(localStorage.getItem("test-consent")).toBeNull();
  });

  it("close button dismisses when action is dismiss", () => {
    render(
      <ConsentBanner {...defaultProps}>
        <ConsentBanner.Content>Test</ConsentBanner.Content>
        <ConsentBanner.CloseButton action="dismiss" />
      </ConsentBanner>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(localStorage.getItem("test-consent")).toBe("dismissed");
  });

  // Accessibility: Keyboard support
  describe("keyboard accessibility", () => {
    it("dismisses banner when Escape key is pressed", () => {
      render(
        <ConsentBanner {...defaultProps}>
          <ConsentBanner.Content>Test message</ConsentBanner.Content>
          <ConsentBanner.Actions>
            <ConsentBanner.AcceptButton>Accept</ConsentBanner.AcceptButton>
          </ConsentBanner.Actions>
        </ConsentBanner>,
      );

      expect(screen.getByText("Test message")).toBeInTheDocument();

      fireEvent.keyDown(document, { key: "Escape" });

      expect(screen.queryByText("Test message")).not.toBeInTheDocument();
      expect(localStorage.getItem("test-consent")).toBe("dismissed");
    });

    it("hides banner without persisting when escapeAction is hide", () => {
      render(
        <ConsentBanner {...defaultProps} escapeAction="hide">
          <ConsentBanner.Content>Test message</ConsentBanner.Content>
        </ConsentBanner>,
      );

      fireEvent.keyDown(document, { key: "Escape" });

      expect(screen.queryByText("Test message")).not.toBeInTheDocument();
      expect(localStorage.getItem("test-consent")).toBeNull();
    });

    it("does nothing when escapeAction is none", () => {
      render(
        <ConsentBanner {...defaultProps} escapeAction="none">
          <ConsentBanner.Content>Test message</ConsentBanner.Content>
        </ConsentBanner>,
      );

      fireEvent.keyDown(document, { key: "Escape" });

      expect(screen.getByText("Test message")).toBeInTheDocument();
    });

    it("auto-focuses first interactive element on mount", async () => {
      render(
        <ConsentBanner {...defaultProps}>
          <ConsentBanner.Content>Test</ConsentBanner.Content>
          <ConsentBanner.Actions>
            <ConsentBanner.AcceptButton>Accept</ConsentBanner.AcceptButton>
          </ConsentBanner.Actions>
        </ConsentBanner>,
      );

      // Wait for requestAnimationFrame
      await new Promise((resolve) => requestAnimationFrame(resolve));

      expect(document.activeElement).toBe(
        screen.getByRole("button", { name: "Accept" }),
      );
    });

    it("does not auto-focus when autoFocus is false", async () => {
      const initialFocus = document.activeElement;

      render(
        <ConsentBanner {...defaultProps} autoFocus={false}>
          <ConsentBanner.Content>Test</ConsentBanner.Content>
          <ConsentBanner.Actions>
            <ConsentBanner.AcceptButton>Accept</ConsentBanner.AcceptButton>
          </ConsentBanner.Actions>
        </ConsentBanner>,
      );

      await new Promise((resolve) => requestAnimationFrame(resolve));

      expect(document.activeElement).toBe(initialFocus);
    });

    it("sets aria-modal to true for center position", () => {
      render(
        <ConsentBanner {...defaultProps} position="center">
          <ConsentBanner.Content>Test</ConsentBanner.Content>
        </ConsentBanner>,
      );

      const banner = screen.getByRole("alertdialog");
      expect(banner).toHaveAttribute("aria-modal", "true");
    });

    it("traps focus within banner when trapFocus is true", () => {
      render(
        <ConsentBanner {...defaultProps} trapFocus={true}>
          <ConsentBanner.Content>Test</ConsentBanner.Content>
          <ConsentBanner.Actions>
            <ConsentBanner.DismissButton>Decline</ConsentBanner.DismissButton>
            <ConsentBanner.AcceptButton>Accept</ConsentBanner.AcceptButton>
          </ConsentBanner.Actions>
        </ConsentBanner>,
      );

      const declineButton = screen.getByRole("button", { name: "Decline" });
      const acceptButton = screen.getByRole("button", { name: "Accept" });

      // Focus last element and press Tab - should wrap to first
      acceptButton.focus();
      fireEvent.keyDown(document, { key: "Tab" });
      expect(document.activeElement).toBe(declineButton);

      // Focus first element and press Shift+Tab - should wrap to last
      declineButton.focus();
      fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
      expect(document.activeElement).toBe(acceptButton);
    });
  });
});
