/**
 * Client-side user interaction analytics and event tracking stub.
 */

export const trackEvent = (eventName, properties = {}) => {
  const payload = {
    event: eventName,
    properties: {
      ...properties,
      timestamp: new Date().toISOString(),
      url: window.location.pathname,
    },
  };

  // Safe console log in development environment
  if (import.meta.env?.DEV) {
    console.debug('[Analytics Track]:', payload);
  }

  // Hook for dispatching to external telemetry (Google Analytics, Mixpanel, etc.)
  if (window.gtag) {
    window.gtag('event', eventName, properties);
  }
};

export const trackPageView = (pagePath) => {
  trackEvent('page_view', { path: pagePath || window.location.pathname });
};
