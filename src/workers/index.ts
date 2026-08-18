import { Worker } from 'bullmq';
import { connection } from './queues';
import importProcessor from './processors/import-prospects';
import scoreProcessor from './processors/score-prospect';
import generateEmailProcessor from './processors/generate-email';
import sendEmailProcessor from './processors/send-email';
import webhookProcessor from './processors/process-email-webhook';
import classifyReplyProcessor from './processors/classify-reply';
import notificationProcessor from './processors/create-notification';
import campaignSchedulerProcessor from './processors/campaign-scheduler';
import campaignPauseCheckProcessor from './processors/campaign-pause-check';
import researchProcessor from './processors/research-prospect';

const workers: Worker[] = [];

async function startWorkers() {
  console.log('Starting BullMQ workers...');

  workers.push(new Worker('import', importProcessor, { connection, concurrency: 5 }));
  workers.push(new Worker('scoring', scoreProcessor, { connection, concurrency: 10 }));
  workers.push(new Worker('email-generation', generateEmailProcessor, { connection, concurrency: 10 }));
  workers.push(new Worker('email-send', sendEmailProcessor, { connection, concurrency: 20 }));
  workers.push(new Worker('webhook', webhookProcessor, { connection, concurrency: 20 }));
  workers.push(new Worker('research', researchProcessor, { connection, concurrency: 5 }));
  workers.push(new Worker('notification', notificationProcessor, { connection, concurrency: 10 }));
  
  const schedulerWorker = new Worker('scheduler', async (job) => {
    switch(job.name) {
      case 'campaign-scheduler': return campaignSchedulerProcessor(job);
      case 'campaign-pause-check': return campaignPauseCheckProcessor(job);
    }
  }, { connection, concurrency: 2 });
  
  workers.push(schedulerWorker);

  // Set up recurring jobs
  const { schedulerQueue } = await import('./queues');
  
  await schedulerQueue.add('campaign-scheduler', {}, {
    repeat: {
      pattern: '* * * * *', // every 1 min
    }
  });

  await schedulerQueue.add('campaign-pause-check', {}, {
    repeat: {
      pattern: '*/15 * * * *', // every 15 min
    }
  });

  console.log('Workers started successfully');
}

async function shutdown() {
  console.log('Shutting down workers...');
  await Promise.all(workers.map(w => w.close()));
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception in worker process:', err);
});

startWorkers().catch(err => {
  console.error('Failed to start workers:', err);
  process.exit(1);
});
