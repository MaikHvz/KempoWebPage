import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import tx from '@/lib/transbank';
import supabaseAdmin from '@/utils/supabase/admin';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
        }

        const body = await request.json();
        const { planId, beneficiaryId } = body; // Get beneficiaryId

        // 1. Get Plan Details (Admin client ensures we can read even if something is off)
        const { data: plan, error: planError } = await supabaseAdmin
            .from('memberships')
            .select('*')
            .eq('id', planId)
            .single();

        if (planError || !plan) {
            return NextResponse.json({ error: 'Plan no encontrado' }, { status: 404 });
        }

        // 2. Create Subscription Record (Pending)
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + plan.duration_months);

        const { data: subscription, error: subError } = await supabaseAdmin
            .from('student_subscriptions')
            .insert([{
                user_id: user.id,
                beneficiary_id: beneficiaryId || null, // Store beneficiary
                membership_id: plan.id,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                status: 'pending_payment', // Will be active after payment
                payment_method: 'webpay'
            }])
            .select()
            .single();

        if (subError) throw subError;

        // 3. Create Payment Record (Pending)
        // We use the Payment ID or Subscription ID as part of the Buy Order
        // BuyOrder must be unique. We can use a combination of timestamp and sub ID characters
        const buyOrder = `ORD-${Date.now()}-${subscription.id.slice(0, 4)}`;
        const sessionId = user.id;
        const amount = plan.price;
        const returnUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/webpay/return`;

        const { error: payError } = await supabaseAdmin
            .from('payments')
            .insert([{
                subscription_id: subscription.id,
                amount: amount,
                status: 'pending',
                notes: `WebPay Order: ${buyOrder}`
            }]);

        if (payError) throw payError;

        // 4. Create Transaction in Transbank
        const response = await tx.create(
            buyOrder,
            sessionId,
            amount,
            returnUrl
        );

        return NextResponse.json({
            token: response.token,
            url: response.url,
            buyOrder
        });

    } catch (error: any) {
        console.error('WebPay Create Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
