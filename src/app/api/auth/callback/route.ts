import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirect = requestUrl.searchParams.get('redirect') || '/dashboard';

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.exchangeCodeForSession(code);

    // Ensure profile exists
    if (user) {
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!existing) {
        const meta = user.user_metadata;
        await supabase.from('profiles').insert({
          id: user.id,
          email: user.email,
          first_name: meta?.full_name?.split(' ')[0] || meta?.first_name || '',
          last_name: meta?.full_name?.split(' ').slice(1).join(' ') || meta?.last_name || '',
          role: 'external',
        });
      }
    }
  }

  return NextResponse.redirect(new URL(redirect, requestUrl.origin));
}
