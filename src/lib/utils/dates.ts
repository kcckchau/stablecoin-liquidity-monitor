/**
 * Date utility functions for timestamp manipulation
 */

export function getStartOfDay(date: Date = new Date()): Date {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
}

export function getDaysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

export function getHoursAgo(hours: number): Date {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date;
}

export function formatTimestamp(date: Date): string {
  return date.toISOString();
}

export function parseTimestamp(timestamp: string): Date {
  return new Date(timestamp);
}

export function isToday(date: Date): boolean {
  const today = getStartOfDay();
  const check = getStartOfDay(date);
  return today.getTime() === check.getTime();
}

export function getDateRange(startDays: number, endDays: number = 0): { start: Date; end: Date } {
  return {
    start: getDaysAgo(startDays),
    end: getDaysAgo(endDays),
  };
}
