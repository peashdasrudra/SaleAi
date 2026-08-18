import { getProspectTimezone, getNextSendTime } from './timezone-utils';
import { prisma } from '../db';

export function addRandomDelay(date: Date, maxMinutes: number = 30): Date {
  const delay = Math.floor(Math.random() * maxMinutes * 60 * 1000);
  return new Date(date.getTime() + delay);
}

export function calculateSendTime(prospect: any, campaign: any): Date {
  const tz = getProspectTimezone(prospect);
  const baseTime = getNextSendTime(tz, '09:00', '17:00', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  return addRandomDelay(baseTime);
}

export async function checkDailyLimit(workspaceId: string, campaignId: string, date: Date): Promise<boolean> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const sentToday = await prisma.emailMessage.count({
    where: {
      workspaceId,
      campaignId,
      sentAt: { gte: startOfDay }
    }
  });

  return sentToday < 500; // Mock limit
}

export async function checkDomainLimit(workspaceId: string, domain: string, campaignId: string, date: Date): Promise<boolean> {
  // Mock logic
  return true;
}
