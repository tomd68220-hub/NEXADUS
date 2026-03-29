import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { generateReference } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const reference = generateReference();

    const { data, error } = await supabase.from('bookings').insert({
      user_id: user.id,
      space_type: body.space_type,
      booking_date: body.booking_date,
      start_time: body.start_time,
      end_time: body.end_time,
      session_type: body.session_type,
      duration_hours: body.duration_hours || null,
      delegates: body.delegates || null,
      total_ex_vat: body.total_ex_vat,
      total_inc_vat: body.total_inc_vat,
      status: 'upcoming',
      reference,
      special_requirements: body.special_requirements || null,
      stripe_payment_id: body.stripe_payment_id,
    }).select().single();

    if (error) throw error;

    return NextResponse.json({ booking: data });
  } catch (err) {
    console.error('Booking error:', err);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
      .order('booking_date', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ bookings: data });
  } catch (err) {
    console.error('Get bookings error:', err);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
