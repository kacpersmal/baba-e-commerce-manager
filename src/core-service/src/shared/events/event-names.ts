/**
 * Application Event Names
 * Centralized event constants for type-safe event emission and listening
 */
export const AppEvents = {
  // Authentication Events
  AUTH: {
    USER_REGISTERED: 'auth.user.registered',
    USER_LOGIN: 'auth.user.login',
    USER_LOGOUT: 'auth.user.logout',
  },
  // Notification Events
  NOTIFICATIONS: {
    EMAIL_VERIFICATION_REQUESTED: 'notifications.email.verification.requested',
    PASSWORD_RESET_REQUESTED: 'notifications.password.reset.requested',
  },
} as const;

// Type helper to extract all event names
export type AppEventName =
  (typeof AppEvents)[keyof typeof AppEvents][keyof (typeof AppEvents)[keyof typeof AppEvents]];
