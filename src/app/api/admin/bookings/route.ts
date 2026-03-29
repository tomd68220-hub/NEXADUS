import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

async function isAdmin(supabase: ReturnType<typeof createRouteHandlerClient>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  return data?.role === 'admin';
}

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  if (!(await isAdmin(supabase))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const space = searchParams.get('space');
  const status = searchParams.get('status');

  let query = supabase.from('bookings').select('*, profiles(first_name, last_name, email)').order('booking_date', { ascending: false });
  if (space) query = query.eq('space_type', space);
  if (status) query = query.eq('status', status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ bookings: data });
}

export async function PATCH(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  if (!(await isAdmin(supabase))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { id, status } = body;

  const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
