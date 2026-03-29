import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = createRouteHandlerClient({ cookies });

    const { error } = await supabase.from('studio_enquiries').insert({
      name: body.name,
      email: body.email,
      company: body.company || null,
      session_type: body.session_type,
      frequency: body.frequency,
      preferred_start: body.preferred_start || null,
      preferred_end: body.preferred_end || null,
      attendees: body.attendees,
      brief: body.brief,
      status: 'pending',
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Studio enquiry error:', err);
    return NextResponse.json({ error: 'Failed to submit enquiry' }, { status: 500 });
  }
}
