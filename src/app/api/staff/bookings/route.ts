import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { generateReference } from '@/lib/stripe';

async function getStaffUser(supabase: ReturnType<typeof createRouteHandlerClient>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!data || !['internal', 'studio', 'admin'].includes(data.role)) return null;
  return user;
}

// GET — all bookings (for calendar view)
export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const user = await getStaffUser(supabase);
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  let query = supabase
    .from('bookings')
    .select('*, profiles(first_name, last_name, email)')
    .order('booking_date', { ascending: true });

  if (from) query = query.gte('booking_date', from);
  if (to) query = query.lte('booking_date', to);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ bookings: data });
}

// POST — create a staff booking (no payment required)
export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const user = await getStaffUser(supabase);
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json();
  const reference = generateReference();

  const { data, error } = await supabase.from('bookings').insert({
    user_id: user.id,
    booked_by: user.id,
    booking_source: 'staff',
    space_type: body.space_type,
    booking_date: body.booking_date,
    start_time: body.start_time,
    end_time: body.end_time,
    session_type: body.session_type,
    duration_hours: body.duration_hours ?? null,
    delegates: body.delegates ?? null,
    total_ex_vat: body.total_ex_vat,
    total_inc_vat: body.total_inc_vat,
    status: 'confirmed',
    reference,
    special_requirements: body.special_requirements ?? null,
    internal_notes: body.internal_notes ?? null,
    stripe_payment_id: null,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ booking: data });
}

// PATCH — staff can cancel their own bookings
export async function PATCH(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const user = await getStaffUser(supabase);
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id, status } = await request.json();

  // Staff can only cancel their own bookings (admins can do more via admin route)
  const { data: booking } = await supabase
    .from('bookings')
    .select('user_id')
    .eq('id', id)
    .single();

  if (!booking || booking.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
