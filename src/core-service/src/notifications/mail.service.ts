import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AppEvents } from '../shared/events';
import type {
  EmailVerificationRequestedEvent,
  PasswordResetRequestedEvent,
} from '../shared/events';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  /**
   * Handle email verification requests
   */
  @OnEvent(AppEvents.NOTIFICATIONS.EMAIL_VERIFICATION_REQUESTED)
  async handleEmailVerificationRequested(
    event: EmailVerificationRequestedEvent,
  ): Promise<void> {
    this.logger.log(
      `[EMAIL VERIFICATION] Sending verification email to user ${event.userId}`,
    );
    this.logger.log(`  Email: ${event.email}`);
    this.logger.log(`  Code: ${event.code}`);
    this.logger.log(`  Timestamp: ${event.timestamp.toISOString()}`);

    // TODO: Integrate with actual email service (SendGrid, AWS SES, etc.)
    // Example:
    // await this.emailProvider.send({
    //   to: event.email,
    //   template: 'email-verification',
    //   data: {
    //     code: event.code,
    //   },
    // });

    this.logger.log(
      `✅ Email verification sent successfully to ${event.email}`,
    );
  }

  /**
   * Handle password reset requests
   */
  @OnEvent(AppEvents.NOTIFICATIONS.PASSWORD_RESET_REQUESTED)
  async handlePasswordResetRequested(
    event: PasswordResetRequestedEvent,
  ): Promise<void> {
    this.logger.log(
      `[PASSWORD RESET] Sending password reset email to user ${event.userId}`,
    );
    this.logger.log(`  Email: ${event.email}`);
    this.logger.log(`  Code: ${event.code}`);
    this.logger.log(`  Timestamp: ${event.timestamp.toISOString()}`);

    // TODO: Integrate with actual email service (SendGrid, AWS SES, etc.)
    // Example:
    // await this.emailProvider.send({
    //   to: event.email,
    //   template: 'password-reset',
    //   data: {
    //     code: event.code,
    //   },
    // });

    this.logger.log(
      `✅ Password reset email sent successfully to ${event.email}`,
    );
  }
}
