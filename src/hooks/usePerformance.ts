"use client";

import { useEffect, useCallback, useRef } from "react";
import { monitoring } from "@/lib/monitoring";

// Hook for measuring component render performance
export function useRenderPerformance(componentName: string) {
  const renderStart = useRef<number>(0);

  useEffect(() => {
    renderStart.current = performance.now();
  });

  useEffect(() => {
    const renderTime = performance.now() - renderStart.current;
    monitoring.reportPerformanceMetric(`render-${componentName}`, renderTime);
  });
}

// Hook for debouncing expensive operations
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  ) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

// Hook for throttling high-frequency events
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
): T {
  const lastRun = useRef<number>(0);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = now;
      }
    },
    [callback, delay],
  ) as T;

  return throttledCallback;
}

// Hook for tracking user interactions
export function useAnalytics() {
  const trackEvent = useCallback(
    (eventName: string, properties?: Record<string, any>) => {
      monitoring.trackEvent(eventName, properties);
    },
    [],
  );

  const trackPageView = useCallback((pageName: string) => {
    monitoring.trackEvent("page_view", { page: pageName });
  }, []);

  const trackUserAction = useCallback((action: string, target?: string) => {
    monitoring.trackEvent("user_action", { action, target });
  }, []);

  return {
    trackEvent,
    trackPageView,
    trackUserAction,
  };
}

// Hook for detecting slow network conditions
export function useNetworkStatus() {
  const getConnectionType = useCallback(() => {
    if (typeof navigator !== "undefined" && "connection" in navigator) {
      const connection = (navigator as any).connection;
      return {
        effectiveType: connection?.effectiveType || "unknown",
        downlink: connection?.downlink || 0,
        rtt: connection?.rtt || 0,
        saveData: connection?.saveData || false,
      };
    }
    return {
      effectiveType: "unknown",
      downlink: 0,
      rtt: 0,
      saveData: false,
    };
  }, []);

  useEffect(() => {
    const connection = getConnectionType();
    monitoring.reportPerformanceMetric("network-connection", 1, connection);
  }, [getConnectionType]);

  return getConnectionType();
}

// Hook for memory usage monitoring
export function useMemoryMonitoring() {
  useEffect(() => {
    const checkMemory = () => {
      if ("memory" in performance) {
        const memory = (performance as any).memory;
        monitoring.reportPerformanceMetric(
          "memory-used",
          memory.usedJSHeapSize,
          {
            total: memory.totalJSHeapSize,
            limit: memory.jsHeapSizeLimit,
          },
        );
      }
    };

    // Check memory usage every 30 seconds
    const interval = setInterval(checkMemory, 30000);
    checkMemory(); // Initial check

    return () => clearInterval(interval);
  }, []);
}

// Hook for intersection observer optimization
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options?: IntersectionObserverInit,
) {
  const isIntersecting = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting.current = entry.isIntersecting;
      },
      {
        threshold: 0.1,
        ...options,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [elementRef, options]);

  return isIntersecting;
}
