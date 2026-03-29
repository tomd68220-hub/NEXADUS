import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('pass_balances')
      .select('*')
      .eq('user_id', user.id)
      .order('purchased_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ passes: data });
  } catch (err) {
    console.error('Get passes error:', err);
    return NextResponse.json({ error: 'Failed to fetch passes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const { data, error } = await supabase.from('pass_balances').insert({
      user_id: user.id,
      pass_type: body.pass_type,
      total_passes: body.total_passes,
      used_passes: 0,
      stripe_payment_id: body.stripe_payment_id,
    }).select().single();

    if (error) throw error;

    return NextResponse.json({ pass_balance: data });
  } catch (err) {
    console.error('Create passes error:', err);
    return NextResponse.json({ error: 'Failed to add passes' }, { status: 500 });
  }
}
