import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useConsentBanner } from "../hooks/useConsentBanner";

describe("useConsentBanner", () => {
  const defaultOptions = {
    storageKey: "test-consent",
  };

  it("returns pending status when no consent stored", () => {
    const { result } = renderHook(() => useConsentBanner(defaultOptions));

    expect(result.current.status).toBe("pending");
  });

  it("shows banner automatically when status is pending", () => {
    const { result } = renderHook(() => useConsentBanner(defaultOptions));

    expect(result.current.isVisible).toBe(true);
  });

  it("does not show banner when manual mode is enabled", () => {
    const { result } = renderHook(() => useConsentBanner({ ...defaultOptions, manual: true }));

    expect(result.current.isVisible).toBe(false);
  });

  it("accepts consent and hides banner", () => {
    const onAccept = vi.fn();
    const onChange = vi.fn();

    const { result } = renderHook(() =>
      useConsentBanner({ ...defaultOptions, onAccept, onChange }),
    );

    act(() => {
      result.current.accept();
    });

    expect(result.current.status).toBe("accepted");
    expect(result.current.isVisible).toBe(false);
    expect(onAccept).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("accepted");
  });

  it("dismisses consent and hides banner", () => {
    const onDismiss = vi.fn();
    const onChange = vi.fn();

    const { result } = renderHook(() =>
      useConsentBanner({ ...defaultOptions, onDismiss, onChange }),
    );

    act(() => {
      result.current.dismiss();
    });

    expect(result.current.status).toBe("dismissed");
    expect(result.current.isVisible).toBe(false);
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("dismissed");
  });

  it("resets consent state", () => {
    const onChange = vi.fn();

    const { result } = renderHook(() => useConsentBanner({ ...defaultOptions, onChange }));

    // First accept
    act(() => {
      result.current.accept();
    });

    expect(result.current.status).toBe("accepted");

    // Then reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.status).toBe("pending");
    expect(result.current.isVisible).toBe(true);
    expect(onChange).toHaveBeenLastCalledWith("pending");
  });

  it("manually shows and hides banner", () => {
    const { result } = renderHook(() => useConsentBanner({ ...defaultOptions, manual: true }));

    expect(result.current.isVisible).toBe(false);

    act(() => {
      result.current.show();
    });

    expect(result.current.isVisible).toBe(true);

    act(() => {
      result.current.hide();
    });

    expect(result.current.isVisible).toBe(false);
  });

  it("persists accepted status across rerenders", () => {
    // First render - accept consent
    const { result: result1 } = renderHook(() => useConsentBanner(defaultOptions));

    act(() => {
      result1.current.accept();
    });

    // Second render - should show accepted status
    const { result: result2 } = renderHook(() => useConsentBanner(defaultOptions));

    expect(result2.current.status).toBe("accepted");
    expect(result2.current.isVisible).toBe(false);
  });

  it("uses sessionStorage when specified", () => {
    const { result } = renderHook(() =>
      useConsentBanner({ ...defaultOptions, type: "sessionStorage" }),
    );

    act(() => {
      result.current.accept();
    });

    expect(sessionStorage.getItem("test-consent")).toBe("accepted");
  });
});

describe("useConsentBanner — autoAcceptOnNavigate false positives", () => {
  it("does not auto-accept when history.replaceState fires without changing the URL", async () => {
    // Next.js's own App Router calls replaceState routinely for internal
    // bookkeeping (scroll restoration, shallow route state) with the SAME
    // href -- this must never be mistaken for the user navigating away.
    const { result } = renderHook(() =>
      useConsentBanner({ storageKey: "replacestate-same-url", autoAcceptOnNavigate: true }),
    );

    expect(result.current.isVisible).toBe(true);

    await act(async () => {
      history.replaceState(history.state, "", location.href);
      // handleNavigation's write is deferred via queueMicrotask
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(result.current.status).toBe("pending");
    expect(result.current.isVisible).toBe(true);
  });

  it("auto-accepts when history.pushState actually changes the URL", async () => {
    const { result } = renderHook(() =>
      useConsentBanner({ storageKey: "pushstate-new-url", autoAcceptOnNavigate: true }),
    );

    await act(async () => {
      history.pushState(null, "", "/somewhere-else");
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(result.current.status).toBe("accepted");
    expect(result.current.isVisible).toBe(false);

    // Restore the URL so later tests in this file aren't affected.
    history.pushState(null, "", "/");
  });

  it("does not auto-accept just because the component unmounts", () => {
    // A component can unmount for reasons unrelated to the user leaving the
    // page: a parent conditionally stops rendering it, React Strict Mode's
    // dev-only double-invoke of effects, Fast Refresh, an error boundary
    // reset. Real navigation-away is covered by `pagehide` and the
    // href-diffed history hooks, not by unmount itself.
    const { result, unmount } = renderHook(() =>
      useConsentBanner({ storageKey: "unmount-is-not-navigation", autoAcceptOnNavigate: true }),
    );

    expect(result.current.status).toBe("pending");

    unmount();

    const { result: result2 } = renderHook(() =>
      useConsentBanner({ storageKey: "unmount-is-not-navigation" }),
    );
    expect(result2.current.status).toBe("pending");
  });

  it("auto-accepts on pagehide (the page is actually being left)", async () => {
    const { result } = renderHook(() =>
      useConsentBanner({ storageKey: "pagehide-is-navigation", autoAcceptOnNavigate: true }),
    );

    await act(async () => {
      window.dispatchEvent(new Event("pagehide"));
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(result.current.status).toBe("accepted");
  });
});
