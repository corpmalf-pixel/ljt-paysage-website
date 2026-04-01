/**
 * LJT Paysage - Custom Lighthouse Configuration
 * Optimized for SEO, Performance, and Accessibility
 */

module.exports = {
  // Global extension settings
  extend: 'lighthouse:default',

  // Settings for audits
  settings: {
    // Network throttling
    throttlingMethod: 'devtools',
    throttling: {
      rttMs: 40,
      downloadThroughputKbps: 11024,
      uploadThroughputKbps: 3000,
      cpuSlowdownMultiplier: 1
    },

    // Audit specific settings
    skipAudits: [],
    
    // Timeouts
    maxWaitForFcp: 30000,
    maxWaitForLoad: 45000,
    maxWaitForLcp: 45000,

    // Chrome flags
    chromeFlags: ['--disable-device-emulation']
  },

  // Audit groups and categories
  categories: {
    performance: {
      title: 'Performance',
      description: 'These metrics validate the performance of your application.',
      auditRefs: [
        { id: 'first-contentful-paint', weight: 10 },
        { id: 'largest-contentful-paint', weight: 25 },
        { id: 'cumulative-layout-shift', weight: 15 },
        { id: 'interaction-to-next-paint', weight: 15 },
        { id: 'total-blocking-time', weight: 10 },
        { id: 'speed-index', weight: 10 },
        { id: 'network-requests', weight: 5 },
        { id: 'network-rtt', weight: 5 }
      ]
    },

    accessibility: {
      title: 'Accessibility',
      description: 'These checks validate the accessibility of your application.',
      auditRefs: [
        { id: 'document-title', weight: 3 },
        { id: 'html-has-lang', weight: 3 },
        { id: 'html-lang-valid', weight: 3 },
        { id: 'bypass-links', weight: 3 },
        { id: 'color-contrast', weight: 3 },
        { id: 'image-alt', weight: 3 },
        { id: 'aria-roles', weight: 2 },
        { id: 'aria-valid-attr-role', weight: 2 },
        { id: 'button-name', weight: 3 },
        { id: 'list', weight: 3 }
      ]
    },

    'best-practices': {
      title: 'Best Practices',
      description: 'Validate best practices for your application.',
      auditRefs: [
        { id: 'image-aspect-ratio', weight: 2 },
        { id: 'image-size-responsive', weight: 2 },
        { id: 'appcache-manifest', weight: 2 },
        { id: 'no-document-write', weight: 2 },
        { id: 'geolocation-on-start', weight: 1 },
        { id: 'no-vulnerable-libraries', weight: 2 },
        { id: 'notification-on-start', weight: 1 },
        { id: 'password-inputs-can-be-pasted-into', weight: 1 },
        { id: 'uses-http2', weight: 3 },
        { id: 'uses-passive-event-listeners', weight: 2 },
        { id: 'meta-viewport', weight: 2 }
      ]
    },

    seo: {
      title: 'SEO',
      description: 'Validate SEO optimization of your application.',
      auditRefs: [
        { id: 'document-title', weight: 8 },
        { id: 'meta-description', weight: 8 },
        { id: 'http-status-code', weight: 3 },
        { id: 'link-text', weight: 3 },
        { id: 'crawlable-anchors', weight: 3 },
        { id: 'is-crawlable', weight: 5 },
        { id: 'robots-txt', weight: 2 },
        { id: 'image-alt', weight: 4 },
        { id: 'hreflang', weight: 2 },
        { id: 'canonical', weight: 3 },
        { id: 'font-size', weight: 3 },
        { id: 'plugins', weight: 1 },
        { id: 'tap-targets', weight: 5 },
        { id: 'structured-data', weight: 5 }
      ]
    }
  }
};
