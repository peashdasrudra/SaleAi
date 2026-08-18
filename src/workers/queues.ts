import { Queue } from 'bullmq';
import { Redis } from 'ioredis';

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

export const importQueue = new Queue('import', { connection, defaultJobOptions: { attempts: 3, backoff: { type: 'exponential', delay: 2000 }, removeOnComplete: { count: 500 }, removeOnFail: { count: 1000 } } });
export const researchQueue = new Queue('research', { connection, defaultJobOptions: { attempts: 3, backoff: { type: 'exponential', delay: 2000 }, removeOnComplete: { count: 1000 }, removeOnFail: { count: 1000 } } });
export const scoringQueue = new Queue('scoring', { connection, defaultJobOptions: { attempts: 3, backoff: { type: 'exponential', delay: 2000 }, removeOnComplete: { count: 1000 }, removeOnFail: { count: 1000 } } });
export const emailGenerationQueue = new Queue('email-generation', { connection, defaultJobOptions: { attempts: 3, backoff: { type: 'exponential', delay: 2000 }, removeOnComplete: { count: 1000 }, removeOnFail: { count: 1000 } } });
export const emailSendQueue = new Queue('email-send', { connection, defaultJobOptions: { attempts: 1, removeOnComplete: { count: 1000 } } }); // No auto-retry on send
export const webhookQueue = new Queue('webhook', { connection, defaultJobOptions: { attempts: 5, backoff: { type: 'exponential', delay: 1000 }, removeOnComplete: { count: 5000 }, removeOnFail: { count: 5000 } } });
export const notificationQueue = new Queue('notification', { connection, defaultJobOptions: { attempts: 3, backoff: { type: 'exponential', delay: 2000 }, removeOnComplete: { count: 1000 }, removeOnFail: { count: 1000 } } });
export const schedulerQueue = new Queue('scheduler', { connection, defaultJobOptions: { attempts: 1, removeOnComplete: { count: 100 }, removeOnFail: { count: 500 } } });

export { connection };
