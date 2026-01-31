import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

export interface N8NEvent {
  eventType: 'OPERATION_CREATED' | 'OPERATION_STATUS_CHANGED';
  actorUserId: string;
  operationId: string;
  previousStatus?: string;
  newStatus?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

@Injectable()
export class N8NIntegrationService {
  private readonly logger = new Logger(N8NIntegrationService.name);
  private readonly n8nUrl = process.env.N8N_WEBHOOK_URL;
  private readonly isEnabled = process.env.N8N_ENABLED === 'true';

  async sendEvent(event: N8NEvent): Promise<void> {
    if (!this.isEnabled) {
      this.logger.warn('n8n integration is disabled');
      return;
    }

    if (!this.n8nUrl) {
      this.logger.error('N8N_WEBHOOK_URL is not configured');
      return;
    }

    try {
      this.logger.debug(`Sending event to n8n: ${event.eventType}`);

      await axios.post(this.n8nUrl, {
        eventType: event.eventType,
        actorUserId: event.actorUserId,
        operationId: event.operationId,
        previousStatus: event.previousStatus,
        newStatus: event.newStatus,
        timestamp: event.timestamp,
        metadata: event.metadata,
      });

      this.logger.debug(`Event sent successfully to n8n`);
    } catch (error) {
      this.logger.error(`Failed to send event to n8n: ${error.message}`);
      // Don't throw - we don't want to fail the main operation if n8n is down
    }
  }

  async testWebhook(): Promise<boolean> {
    if (!this.isEnabled) {
      this.logger.warn('n8n integration is disabled');
      return false;
    }

    if (!this.n8nUrl) {
      this.logger.error('N8N_WEBHOOK_URL is not configured');
      return false;
    }

    try {
      this.logger.debug('Testing n8n webhook');

      await axios.post(this.n8nUrl, {
        eventType: 'TEST_EVENT',
        timestamp: new Date(),
        message: 'This is a test event from ElPatrón CRM',
      });

      this.logger.debug('Webhook test successful');
      return true;
    } catch (error) {
      this.logger.error(`Webhook test failed: ${error.message}`);
      return false;
    }
  }
}
