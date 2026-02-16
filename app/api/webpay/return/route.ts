import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import tx from '@/lib/transbank';
import supabaseAdmin from '@/utils/supabase/admin';

async function processTransaction(request: Request, token: string) {
    try {
        // 1. Commit Transaction
        console.log('Commiting transaction with token:', token);
        const response = await tx.commit(token);
        console.log('Transbank Response:', response);

        // 2. Update Database using Admin Client (Bypass RLS)
        const buyOrder = response.buy_order;
        const isApproved = response.status === 'AUTHORIZED' && response.response_code === 0;

        console.log('Buy Order:', buyOrder);
        console.log('Is Approved:', isApproved);

        if (isApproved) {
            // Find payment by BuyOrder
            const { data: payment, error: fetchError } = await supabaseAdmin
                .from('payments')
                .select('subscription_id, id')
                .ilike('notes', `%${buyOrder}%`)
                .single();

            console.log('Payment Found:', payment);
            if (fetchError) console.error('Error fetching payment:', fetchError);

            if (payment) {
                // Activate Subscription
                const { error: subError } = await supabaseAdmin
                    .from('student_subscriptions')
                    .update({ status: 'active' })
                    .eq('id', payment.subscription_id);

                if (subError) console.error('Error updating subscription:', subError);
                else console.log('Subscription activated:', payment.subscription_id);

                // Update Payment
                const { error: payError } = await supabaseAdmin
                    .from('payments')
                    .update({
                        status: 'paid',
                        stripe_payment_id: token
                    })
                    .eq('id', payment.id);

                if (payError) console.error('Error updating payment:', payError);
                else console.log('Payment updated to paid:', payment.id);
            } else {
                console.error('CRITICAL: Payment record not found for order:', buyOrder);
            }

            return NextResponse.redirect(new URL(`/webpay/result?status=success&amount=${response.amount}&order=${buyOrder}`, request.url));
        } else {
            return NextResponse.redirect(new URL(`/webpay/result?status=failed&message=Rechazado`, request.url));
        }

    } catch (error: any) {
        console.error('WebPay Return Error:', error);
        return NextResponse.redirect(new URL(`/webpay/result?status=error&message=${encodeURIComponent(error.message)}`, request.url));
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const token = formData.get('token_ws') as string;
        const tbkToken = formData.get('TBK_TOKEN');

        if (!token && tbkToken) {
            return NextResponse.redirect(new URL(`/webpay/result?status=aborted`, request.url));
        }

        if (!token) {
            return NextResponse.json({ error: 'Token missing' }, { status: 400 });
        }

        return processTransaction(request, token);

    } catch (err) {
        return NextResponse.redirect(new URL(`/webpay/result?status=error&message=FormError`, request.url));
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token_ws');
    const tbkToken = searchParams.get('TBK_TOKEN');

    if (!token && tbkToken) {
        return NextResponse.redirect(new URL(`/webpay/result?status=aborted`, request.url));
    }

    if (token) {
        return processTransaction(request, token);
    }

    return NextResponse.redirect(new URL('/', request.url));
}
