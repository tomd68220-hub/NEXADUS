export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function getWeekdays(startDate: Date = new Date(), count = 7): Date[] {
  const days: Date[] = [];
  const d = new Date(startDate);

  while (days.length < count) {
    const day = d.getDay();
    if (day !== 0 && day !== 6) {
      days.push(new Date(d));
    }
    d.setDate(d.getDate() + 1);
  }

  return days;
}

export function formatDateShort(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function isWeekday(date: Date): boolean {
  const day = date.getDay();
  return day !== 0 && day !== 6;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function daysUntilExpiry(purchasedAt: string, windowDays = 45): number {
  const purchased = new Date(purchasedAt);
  const expiry = new Date(purchased.getTime() + windowDays * 24 * 60 * 60 * 1000);
  const now = new Date();
  const diff = expiry.getTime() - now.getTime();
  return Math.max(0, Math.floor(diff / (24 * 60 * 60 * 1000)));
}
