export function isBusinessDay(date: Date, sendingDays: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']): boolean {
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  return sendingDays.includes(dayName);
}

export function getNextBusinessDay(date: Date, sendingDays?: string[]): Date {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  while (!isBusinessDay(nextDay, sendingDays)) {
    nextDay.setDate(nextDay.getDate() + 1);
  }
  return nextDay;
}

export function addBusinessDays(date: Date, days: number, sendingDays?: string[]): Date {
  let result = new Date(date);
  let daysAdded = 0;
  while (daysAdded < days) {
    result.setDate(result.getDate() + 1);
    if (isBusinessDay(result, sendingDays)) {
      daysAdded++;
    }
  }
  return result;
}
