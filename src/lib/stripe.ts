import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export function generateReference(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `GH-${year}-${random}`;
}

export function calculateMeetingRoomTotal(hours: number): number {
  if (hours <= 4) {
    return hours * 15;
  }
  return 4 * 15 + (hours - 4) * 10;
}
