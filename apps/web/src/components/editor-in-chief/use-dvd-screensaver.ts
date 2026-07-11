import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

/**
 * Vendored from `react-dvd-screensaver`:
 * https://github.com/samuelweckstrom/react-dvd-screensaver
 *
 * Original source:
 * https://github.com/samuelweckstrom/react-dvd-screensaver/blob/main/react-dvd-screensaver/src/useDvdScreensaver.ts
 *
 * Copyright (c) Samuel Weckstrom.
 * Licensed under the MIT License:
 * https://github.com/samuelweckstrom/react-dvd-screensaver/blob/main/LICENSE
 */

type DvdScreensaverOptions = {
  freezeOnHover?: boolean;
  impactCallback?: (count: number) => void;
  onCornerHit?: () => void;
  hoverCallback?: () => void;
  paused?: boolean;
  speed?: number;
};

type AnimationState = {
  animationFrameId: number;
  impactCount: number;
  isPosXIncrement: boolean;
  isPosYIncrement: boolean;
  lastTimestamp: number;
  positionX: number;
  positionY: number;
};

type UseDvdScreensaver<T extends HTMLElement = HTMLDivElement> = {
  containerRef: RefObject<T | null>;
  elementRef: RefObject<T | null>;
  hovered: boolean;
  impactCount: number;
};

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export function useDvdScreensaver<T extends HTMLElement = HTMLDivElement>(
  options?: Partial<DvdScreensaverOptions>,
): UseDvdScreensaver<T> {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const animationState = useRef<AnimationState>({
    animationFrameId: 0,
    impactCount: 0,
    isPosXIncrement: true,
    isPosYIncrement: true,
    lastTimestamp: 0,
    positionX: 0,
    positionY: 0,
  });

  const animateFnRef = useRef<((timestamp: number) => void) | undefined>(
    undefined,
  );
  const containerRef = useRef<T | null>(null);
  const elementRef = useRef<T | null>(null);
  const [hovered, setHovered] = useState(false);
  const [impactCount, setImpactCount] = useState(0);
  const hoveredRef = useRef(false);

  function prefersReducedMotion() {
    return (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function startAnimation() {
    if (!animateFnRef.current || animationState.current.animationFrameId) {
      return;
    }

    if (prefersReducedMotion()) {
      return;
    }

    animationState.current.animationFrameId = requestAnimationFrame(
      animateFnRef.current,
    );
  }

  function stopAnimation() {
    cancelAnimationFrame(animationState.current.animationFrameId);
    animationState.current.animationFrameId = 0;
    animationState.current.lastTimestamp = 0;
  }

  useIsomorphicLayoutEffect(() => {
    const mountedElement = elementRef.current;
    const mql =
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;

    const setActive = () => setHovered(true);
    const setInactive = () => setHovered(false);
    const handleTouchEnd = (event: TouchEvent) => {
      if (event.touches.length === 0) {
        setInactive();
      }
    };

    const onMotionPrefChange = () => {
      if (mql?.matches) {
        stopAnimation();
      } else if (!optionsRef.current?.paused && !hoveredRef.current) {
        startAnimation();
      }
    };

    function updatePosition(
      containerSpan: number,
      delta: number,
      elementSpan: number,
      prevPos: number,
      toggleKey: "isPosXIncrement" | "isPosYIncrement",
    ): { hit: boolean; pos: number } {
      const boundary = Math.max(0, containerSpan - elementSpan);
      let newPos =
        prevPos + (animationState.current[toggleKey] ? delta : -delta);
      let hit = false;

      if (newPos <= 0 || newPos >= boundary) {
        animationState.current[toggleKey] = !animationState.current[toggleKey];
        animationState.current.impactCount += 1;
        setImpactCount(animationState.current.impactCount);
        optionsRef.current?.impactCallback?.(
          animationState.current.impactCount,
        );
        newPos = Math.max(0, Math.min(newPos, boundary));
        hit = true;
      }

      return { hit, pos: newPos };
    }

    function animate(timestamp: number) {
      const currentElement = elementRef.current;
      const container = containerRef.current ?? currentElement?.parentElement;

      if (currentElement && container) {
        const lastTimestamp = animationState.current.lastTimestamp;
        const elapsed = lastTimestamp
          ? Math.min(timestamp - lastTimestamp, 50)
          : 1000 / 60;
        animationState.current.lastTimestamp = timestamp;

        const speed = optionsRef.current?.speed ?? 2;
        const delta = (speed * 60 * elapsed) / 1000;
        const { hit: hitX, pos: posX } = updatePosition(
          container.clientWidth,
          delta,
          currentElement.clientWidth,
          animationState.current.positionX,
          "isPosXIncrement",
        );
        const { hit: hitY, pos: posY } = updatePosition(
          container.clientHeight,
          delta,
          currentElement.clientHeight,
          animationState.current.positionY,
          "isPosYIncrement",
        );

        if (hitX && hitY) {
          optionsRef.current?.onCornerHit?.();
        }

        currentElement.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
        animationState.current.positionX = posX;
        animationState.current.positionY = posY;
      }

      animationState.current.animationFrameId = requestAnimationFrame(animate);
    }

    animateFnRef.current = animate;

    if (mountedElement) {
      mountedElement.style.willChange = "transform";
      mountedElement.style.userSelect = "none";
      mountedElement.style.setProperty("-webkit-touch-callout", "none");

      const container = containerRef.current ?? mountedElement.parentElement;
      if (container) {
        const maxX = Math.max(
          0,
          container.clientWidth - mountedElement.clientWidth,
        );
        const maxY = Math.max(
          0,
          container.clientHeight - mountedElement.clientHeight,
        );
        animationState.current.positionX = Math.random() * maxX;
        animationState.current.positionY = Math.random() * maxY;
      }

      mountedElement.addEventListener("mouseover", setActive);
      mountedElement.addEventListener("mouseout", setInactive);
      mountedElement.addEventListener("touchstart", setActive, {
        passive: true,
      });
      mountedElement.addEventListener("touchend", handleTouchEnd, {
        passive: true,
      });
      mountedElement.addEventListener("touchcancel", handleTouchEnd, {
        passive: true,
      });
      mql?.addEventListener("change", onMotionPrefChange);

      if (!optionsRef.current?.paused && !mql?.matches) {
        animationState.current.animationFrameId =
          requestAnimationFrame(animate);
      }
    }

    return () => {
      mountedElement?.removeEventListener("mouseover", setActive);
      mountedElement?.removeEventListener("mouseout", setInactive);
      mountedElement?.removeEventListener("touchstart", setActive);
      mountedElement?.removeEventListener("touchend", handleTouchEnd);
      mountedElement?.removeEventListener("touchcancel", handleTouchEnd);
      mql?.removeEventListener("change", onMotionPrefChange);
      cancelAnimationFrame(animationState.current.animationFrameId);
    };
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    const container = containerRef.current ?? element?.parentElement;

    if (!container || typeof ResizeObserver === "undefined") {
      return () => {};
    }

    const observer = new ResizeObserver(() => {
      if (!elementRef.current) {
        return;
      }

      const maxX = Math.max(
        0,
        container.clientWidth - elementRef.current.clientWidth,
      );
      const maxY = Math.max(
        0,
        container.clientHeight - elementRef.current.clientHeight,
      );
      animationState.current.positionX = Math.min(
        animationState.current.positionX,
        maxX,
      );
      animationState.current.positionY = Math.min(
        animationState.current.positionY,
        maxY,
      );
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const wasHovered = hoveredRef.current;
    hoveredRef.current = hovered;

    if (hovered && !wasHovered) {
      optionsRef.current?.hoverCallback?.();
    }

    if (!optionsRef.current?.freezeOnHover) {
      return;
    }

    if (hovered) {
      stopAnimation();
    } else {
      startAnimation();
    }
  }, [hovered]);

  useEffect(() => {
    if (options?.paused) {
      stopAnimation();
    } else if (!hoveredRef.current || !optionsRef.current?.freezeOnHover) {
      startAnimation();
    }
  }, [options?.paused]);

  useEffect(() => {
    if (!options?.freezeOnHover && !options?.paused) {
      startAnimation();
    }
  }, [options?.freezeOnHover, options?.paused]);

  return { containerRef, elementRef, hovered, impactCount };
}
