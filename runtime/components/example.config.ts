consentManagementPlatform: {
  cookieName: 'consent',
  cookieMaxAge: 60 * 60 * 24 * 365, // 1 year
  initialModal: {
    title: "Hmmmm Cookies...",
    logo: null,
    description: "Welcome, would you be bothered if we use cookies for {{ purposes }} to make your experience better?",
    decline: {
      type: 'inline', // 'button' | 'link' | 'inline' | 'disabled' 
      text: "Decline",
      color: 'red',
      inline: {
        text: 'You can also',
        link: 'decline',
      }
    },
    more: {
      type: 'inline', // 'button' | 'link' | 'inline' | 'disabled' 
      text: "More",
      color: 'green',
      inline: {
        text: ' You can also control your cookies ',
        link: 'here',
      }
    },
    privacyPolicy: {
      type: 'inline', // 'button' | 'link' | 'inline' | 'disabled' 
      text: "Privacy Policy",
      color: 'yellow',
      inline: {
        text: ' For more information, check out our ',
        link: 'privacy policy',
      }
    },
    accept: {
      type: 'link', // 'button' | 'link'
      text: "Accept",
      color: 'cyan',
    }
  },
  preferencesModal: {
    title: "Cookie Settings",
    description: "Manage your privacy preferences and cookie settings",
    logo: null,
    updatedAt: new Date().toISOString(),
    purposes: [
      {
        id: "services",
        title: "Services", 
        description: "These services are essential for the proper functioning of this website. You cannot disable them here, as otherwise the service would not function correctly.",
        services: [
          {
            id: "session",
            title: "Session",
            description: "Remembers your preferences, activities and settings during your session to provide a safe, personalized and seamless experience while you use the website.",
            required: true
          },
          {
            id: "consent-management", 
            title: "Consent-management",
            description: "Manages your cookie and data processing consent preferences, giving you control over your information and privacy while browsing.",
            required: true
          }
        ]
      },
      {
        id: "performance-optimization",
        title: "Performance optimization",
        description: "These services process personal information to optimize the service provided by this website.",
        services: [
          {
            id: "matomo-analytics",
            title: "Matomo Analytics", 
            description: "Collects data about your website visit using cookies to help us improve performance and user experience.",
            required: false
          }
        ]
      },
      {
        id: "marketing",
        title: "Marketing",
        description: "These services process personal information to show you relevant content about products, services or topics that may be of interest to you.",
        services: [
          {
            id: "conversion-api",
            title: "Conversion API",
            description: "Uses personal data to better understand target audiences, measure campaign effectiveness, and personalize your experience.",
            required: false
          },
          {
            id: "meta-pixel",
            title: "Meta-pixel",
            description: "Uses cookies to collect data about your interactions on our website, so we can provide targeted advertising through Meta and measure the effectiveness of our marketing campaigns.",
            required: false
          }
        ]
      }
    ]
  },