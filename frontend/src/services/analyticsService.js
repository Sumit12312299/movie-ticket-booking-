class AnalyticsService {
  constructor() {
    this.queue = [];
    this.enabled = true;
  }

  trackEvent(eventName, properties = {}) {
    if (!this.enabled) return;
    const event = {
      eventName,
      properties,
      timestamp: new Date().toISOString(),
    };
    this.queue.push(event);
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event);
    }
  }

  flush() {
    const eventsToFlush = [...this.queue];
    this.queue = [];
    return eventsToFlush;
  }
}

export const analytics = new AnalyticsService();
