import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature error:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as { id: string; metadata: Record<string, string> };
        const { booking_id } = paymentIntent.metadata;

        if (booking_id) {
          // Confirm booking
          await supabase
            .from('bookings')
            .update({ status: 'upcoming', stripe_payment_id: paymentIntent.id })
            .eq('id', booking_id);

          // Create invoice record
          const { data: booking } = await supabase
            .from('bookings')
            .select('*, profiles(*)')
            .eq('id', booking_id)
            .single();

          if (booking) {
            const invoiceNumber = `GH-INV-${Date.now()}`;
            await supabase.from('invoices').insert({
              user_id: booking.user_id,
              booking_id: booking_id,
              invoice_number: invoiceNumber,
              description: `${booking.space_type.replace('_', ' ')} — ${booking.booking_date}`,
              amount_ex_vat: booking.total_ex_vat,
              vat_amount: booking.total_inc_vat - booking.total_ex_vat,
              total_inc_vat: booking.total_inc_vat,
            });
          }
        }
        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object as { id: string; metadata: Record<string, string>; payment_intent: string };
        const { user_id, pass_type, total_passes } = session.metadata;

        if (user_id && pass_type && total_passes) {
          await supabase.from('pass_balances').insert({
            user_id,
            pass_type,
            total_passes: parseInt(total_passes),
            used_passes: 0,
            stripe_payment_id: session.payment_intent,
          });
        }
        break;
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
