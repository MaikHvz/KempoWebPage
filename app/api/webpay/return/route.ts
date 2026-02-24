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

        const buyOrder = response.buy_order;
        const isApproved = response.status === 'AUTHORIZED' && response.response_code === 0;

        // 2. AUDIT LOG - Registrar TODA transacción (aprobada o rechazada)
        await supabaseAdmin.from('webpay_logs').insert({
            buy_order: buyOrder,
            token: token,
            status: response.status,
            response_code: response.response_code,
            amount: response.amount,
            raw_response: response
        });

        // 3. IDEMPOTENCIA - Verificar si ya fue procesado
        const { data: existingPayment, error: fetchError } = await supabaseAdmin
            .from('payments')
            .select('id, subscription_id, amount, status, processed_at')
            .ilike('notes', `%${buyOrder}%`)
            .single();

        if (fetchError) {
            console.error('Error fetching payment:', fetchError);
            return NextResponse.redirect(new URL(`/webpay/result?status=error&message=PaymentNotFound`, request.url));
        }

        // Si ya fue procesado exitosamente, redirigir sin hacer nada
        if (existingPayment.status === 'paid' && existingPayment.processed_at) {
            console.log('⚠️ Payment already processed, skipping. Order:', buyOrder);
            return NextResponse.redirect(new URL(`/webpay/result?status=success&amount=${response.amount}&order=${buyOrder}`, request.url));
        }

        console.log('Buy Order:', buyOrder);
        console.log('Is Approved:', isApproved);

        if (isApproved) {
            // 4. VALIDACIÓN DE MONTO - Prevenir fraude
            if (response.amount !== existingPayment.amount) {
                console.error('🚨 FRAUD ALERT: Amount mismatch!', {
                    expected: existingPayment.amount,
                    received: response.amount,
                    buyOrder: buyOrder
                });
                return NextResponse.redirect(new URL(`/webpay/result?status=error&message=InvalidAmount`, request.url));
            }

            // 5. Activar Suscripción
            const { error: subError } = await supabaseAdmin
                .from('student_subscriptions')
                .update({ status: 'active' })
                .eq('id', existingPayment.subscription_id);

            if (subError) {
                console.error('Error updating subscription:', subError);
                throw subError;
            }
            console.log('✅ Subscription activated:', existingPayment.subscription_id);

            // 6. Actualizar Pago con timestamp de procesamiento
            const { error: payError } = await supabaseAdmin
                .from('payments')
                .update({
                    status: 'paid',
                    stripe_payment_id: token,
                    processed_at: new Date().toISOString()
                })
                .eq('id', existingPayment.id);

            if (payError) {
                console.error('Error updating payment:', payError);
                throw payError;
            }
            console.log('✅ Payment updated to paid:', existingPayment.id);

            return NextResponse.redirect(new URL(`/webpay/result?status=success&amount=${response.amount}&order=${buyOrder}`, request.url));
        } else {
            // Pago rechazado - marcar como fallido
            await supabaseAdmin
                .from('payments')
                .update({
                    status: 'failed',
                    processed_at: new Date().toISOString()
                })
                .eq('id', existingPayment.id);

            await supabaseAdmin
                .from('student_subscriptions')
                .update({ status: 'cancelled' })
                .eq('id', existingPayment.subscription_id);

            return NextResponse.redirect(new URL(`/webpay/result?status=failed&message=Rechazado&code=${response.response_code}`, request.url));
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
