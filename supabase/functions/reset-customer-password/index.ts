import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// DRAFT — not deployed. Admin-only endpoint to reset one existing CUSTOMER's
// password via the Supabase Admin API. See Phase report for the full
// authorization/invocation explanation.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const MIN_PASSWORD_LENGTH = 6
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const GENERIC_ERROR = 'Internal server error'
const RESET_FAILED_ERROR = 'Password reset failed'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Only POST does anything. No request body is read for any other method.
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    const authHeader = req.headers.get('Authorization')

    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing Authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      // Safe server-side log only — never tell the caller which secret is missing.
      console.error('reset-customer-password: missing required server configuration')
      return new Response(
        JSON.stringify({ error: GENERIC_ERROR }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Caller-context client: runs AS the caller (their JWT is forwarded),
    // so it can only do what that user is actually allowed to do. Used
    // purely to identify the caller and check their role — never to
    // perform the privileged reset itself.
    const supabaseUser = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data: { user }, error: userError } = await supabaseUser.auth.getUser()

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired session' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Same admin check the existing frontend already relies on
    // (Appointments.tsx calls this same RPC client-side). Running it here
    // through the caller's own client means Postgres enforces the EXECUTE
    // grant and SECURITY DEFINER logic exactly as it does everywhere else —
    // this function adds no new trust path.
    const { data: isAdmin, error: roleError } = await supabaseUser.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin',
    })

    if (roleError || isAdmin !== true) {
      return new Response(
        JSON.stringify({ error: 'Forbidden' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { targetUserId, newPassword } = await req.json()

    if (!targetUserId || typeof targetUserId !== 'string' || !UUID_PATTERN.test(targetUserId)) {
      return new Response(
        JSON.stringify({ error: 'A valid targetUserId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < MIN_PASSWORD_LENGTH) {
      return new Response(
        JSON.stringify({ error: `newPassword must be at least ${MIN_PASSWORD_LENGTH} characters` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Only reached after the caller is confirmed to be an authenticated
    // admin. The service-role client is created here, used only for the
    // customer-account check and the reset itself, and never returned or logged.
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // This function resets CUSTOMER passwords only. profiles RLS doesn't
    // grant admins general read access to other customers' profiles, so this
    // check deliberately runs on the service-role client, only after the
    // caller has already been verified as an admin above. A target with no
    // profiles row — another admin account, or any Auth user that isn't a
    // customer — is rejected before the password is ever touched.
    const { data: profileRow, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('user_id')
      .eq('user_id', targetUserId)
      .maybeSingle()

    if (profileError) {
      console.error('reset-customer-password: profile lookup failed:', profileError.message)
      return new Response(
        JSON.stringify({ error: GENERIC_ERROR }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!profileRow) {
      return new Response(
        JSON.stringify({ error: 'Customer account not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Having a profiles row proves the target is a customer, but doesn't
    // rule out that same Auth user also holding an admin role. This
    // function must never reset an admin's password, so check user_roles
    // directly (trusted server-side, after the CALLER is already verified
    // as admin above) and refuse if the target has 'admin' in any form.
    const { data: targetAdminRole, error: targetRoleError } = await supabaseAdmin
      .from('user_roles')
      .select('user_id')
      .eq('user_id', targetUserId)
      .eq('role', 'admin')
      .maybeSingle()

    if (targetRoleError) {
      console.error('reset-customer-password: target role lookup failed:', targetRoleError.message)
      return new Response(
        JSON.stringify({ error: GENERIC_ERROR }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (targetAdminRole) {
      return new Response(
        JSON.stringify({ error: 'Cannot reset this account' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      targetUserId,
      { password: newPassword }
    )

    if (updateError) {
      // Safe technical detail server-side only — never returned to the caller.
      console.error('reset-customer-password: updateUserById failed:', updateError.message)
      return new Response(
        JSON.stringify({ error: RESET_FAILED_ERROR }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Minimal response only — no password, tokens, or user metadata echoed back.
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: unknown) {
    // Safe technical detail server-side only — never returned to the caller.
    console.error('reset-customer-password: unexpected error:', error instanceof Error ? error.message : error)
    return new Response(
      JSON.stringify({ error: GENERIC_ERROR }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
