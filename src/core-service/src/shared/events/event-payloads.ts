import { Role } from '@prisma/client';

/**
 * Base event interface
 */
export interface BaseEvent {
  timestamp: Date;
}

/**
 * User Registered Event Payload
 */
export interface UserRegisteredEvent extends BaseEvent {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

/**
 * Email Verification Requested Event Payload
 */
export interface EmailVerificationRequestedEvent extends BaseEvent {
  userId: string;
  email: string;
  code: string;
}

/**
 * Password Reset Requested Event Payload
 */
export interface PasswordResetRequestedEvent extends BaseEvent {
  userId: string;
  email: string;
  code: string;
}

/**
 * User Login Event Payload
 */
export interface UserLoginEvent extends BaseEvent {
  userId: string;
  email: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * User Logout Event Payload
 */
export interface UserLogoutEvent extends BaseEvent {
  userId: string;
  email: string;
}
