const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client (only if configured)
let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

/**
 * Store subscription in Supabase
 */
async function storeSubscriptionInSupabase(subscriptionData) {
  if (!supabase) {
    console.log('Supabase not configured, skipping database storage');
    return;
  }

  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .upsert({
        stripe_customer_id: subscriptionData.customerId,
        stripe_subscription_id: subscriptionData.subscriptionId,
        user_email: subscriptionData.email || null,
        tier: subscriptionData.tier,
        status: subscriptionData.status,
        current_period_start: subscriptionData.currentPeriodStart
          ? new Date(subscriptionData.currentPeriodStart * 1000).toISOString()
          : null,
        current_period_end: subscriptionData.currentPeriodEnd
          ? new Date(subscriptionData.currentPeriodEnd * 1000).toISOString()
          : null,
        cancel_at_period_end: subscriptionData.cancelAtPeriodEnd || false,
        metadata: subscriptionData.metadata || {},
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'stripe_customer_id'
      });

    if (error) {
      console.error('Error storing subscription in Supabase:', error);
    } else {
      console.log('Successfully stored subscription in Supabase');
    }
  } catch (error) {
    console.error('Error in storeSubscriptionInSupabase:', error);
  }
}

/**
 * Store product purchase in Supabase
 */
async function storeProductPurchaseInSupabase(purchaseData) {
  if (!supabase) {
    console.log('Supabase not configured, skipping database storage');
    return;
  }

  try {
    const { data, error } = await supabase
      .from('product_purchases')
      .insert({
        stripe_customer_id: purchaseData.customerId || null,
        stripe_payment_intent_id: purchaseData.paymentIntentId || null,
        product_key: purchaseData.productKey,
        product_name: purchaseData.productName,
        price_paid: purchaseData.amount,
        currency: purchaseData.currency || 'usd',
        metadata: purchaseData.metadata || {},
      });

    if (error) {
      console.error('Error storing product purchase in Supabase:', error);
    } else {
      console.log('Successfully stored product purchase in Supabase');
    }
  } catch (error) {
    console.error('Error in storeProductPurchaseInSupabase:', error);
  }
}

/**
 * Store payment history in Supabase
 */
async function storePaymentHistory(paymentData) {
  if (!supabase) {
    return;
  }

  try {
    const { data, error } = await supabase
      .from('payment_history')
      .insert({
        stripe_customer_id: paymentData.customerId,
        stripe_invoice_id: paymentData.invoiceId,
        stripe_payment_intent_id: paymentData.paymentIntentId,
        amount: paymentData.amount,
        currency: paymentData.currency || 'usd',
        status: paymentData.status,
        payment_date: paymentData.paymentDate || new Date().toISOString(),
        metadata: paymentData.metadata || {},
      });

    if (error) {
      console.error('Error storing payment history:', error);
    }
  } catch (error) {
    console.error('Error in storePaymentHistory:', error);
  }
}

/**
 * Get customer email from Stripe
 */
async function getCustomerEmail(customerId) {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    return customer.email || null;
  } catch (error) {
    console.error('Error fetching customer email:', error);
    return null;
  }
}

exports.handler = async (event, context) => {
  // Webhooks only accept POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Check if Stripe is configured
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY is not configured');
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Stripe is not configured' 
      })
    };
  }

  const sig = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // Netlify functions may send body as string or already parsed
  const body = typeof event.body === 'string' ? event.body : JSON.stringify(event.body);

  // Verify webhook signature if secret is configured
  let stripeEvent;
  
  if (webhookSecret) {
    try {
      stripeEvent = stripe.webhooks.constructEvent(
        body,
        sig,
        webhookSecret
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: `Webhook Error: ${err.message}` 
        }),
      };
    }
  } else {
    // If no webhook secret, parse the body directly (not recommended for production)
    console.warn('STRIPE_WEBHOOK_SECRET not configured. Webhook signature verification skipped.');
    try {
      stripeEvent = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } catch (err) {
      console.error('Failed to parse webhook body:', err.message);
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Invalid webhook payload' 
        }),
      };
    }
  }

  // Handle the event
  try {
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        const session = stripeEvent.data.object;
        console.log('Checkout completed:', session.id);
        console.log('Customer:', session.customer);
        console.log('Metadata:', session.metadata);

        // Determine if it's a subscription or one-time purchase
        const mode = session.mode; // 'subscription' or 'payment'
        const productKey = session.metadata?.product;
        const plan = session.metadata?.plan;

        if (mode === 'subscription' && session.subscription) {
          // Subscription purchase
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          const customerEmail = await getCustomerEmail(session.customer);

          await storeSubscriptionInSupabase({
            customerId: session.customer,
            subscriptionId: subscription.id,
            email: customerEmail,
            tier: plan || 'premium',
            status: subscription.status,
            currentPeriodStart: subscription.current_period_start,
            currentPeriodEnd: subscription.current_period_end,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            metadata: session.metadata || {},
          });
        } else if (mode === 'payment' && productKey) {
          // One-time product purchase
          await storeProductPurchaseInSupabase({
            customerId: session.customer,
            paymentIntentId: session.payment_intent,
            productKey: productKey,
            productName: session.metadata?.product_name || productKey,
            amount: session.amount_total || 0,
            currency: session.currency || 'usd',
            metadata: session.metadata || {},
          });
        }
        break;
      
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = stripeEvent.data.object;
        console.log('Subscription updated:', subscription.id);
        console.log('Status:', subscription.status);
        console.log('Customer:', subscription.customer);

        // Get subscription details
        const priceId = subscription.items.data[0]?.price?.id;
        const tier = priceId?.includes('family') ? 'family' : 'premium';
        const customerEmail = await getCustomerEmail(subscription.customer);

        await storeSubscriptionInSupabase({
          customerId: subscription.customer,
          subscriptionId: subscription.id,
          email: customerEmail,
          tier: tier,
          status: subscription.status,
          currentPeriodStart: subscription.current_period_start,
          currentPeriodEnd: subscription.current_period_end,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          metadata: subscription.metadata || {},
        });
        break;
      
      case 'customer.subscription.deleted':
        const deletedSubscription = stripeEvent.data.object;
        console.log('Subscription cancelled:', deletedSubscription.id);
        console.log('Customer:', deletedSubscription.customer);

        // Update subscription status to canceled
        const deletedCustomerEmail = await getCustomerEmail(deletedSubscription.customer);
        await storeSubscriptionInSupabase({
          customerId: deletedSubscription.customer,
          subscriptionId: deletedSubscription.id,
          email: deletedCustomerEmail,
          tier: 'premium', // Default, will be updated from existing record
          status: 'canceled',
          currentPeriodStart: deletedSubscription.current_period_start,
          currentPeriodEnd: deletedSubscription.current_period_end,
          cancelAtPeriodEnd: false,
          metadata: {},
        });
        break;
      
      case 'invoice.payment_succeeded':
        const invoice = stripeEvent.data.object;
        console.log('Payment succeeded:', invoice.id);
        console.log('Customer:', invoice.customer);
        console.log('Amount:', invoice.amount_paid);

        // Store payment history
        await storePaymentHistory({
          customerId: invoice.customer,
          invoiceId: invoice.id,
          paymentIntentId: invoice.payment_intent,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          status: 'succeeded',
          paymentDate: new Date(invoice.created * 1000).toISOString(),
          metadata: invoice.metadata || {},
        });
        break;
      
      case 'invoice.payment_failed':
        const failedInvoice = stripeEvent.data.object;
        console.log('Payment failed:', failedInvoice.id);
        console.log('Customer:', failedInvoice.customer);

        // Store failed payment
        await storePaymentHistory({
          customerId: failedInvoice.customer,
          invoiceId: failedInvoice.id,
          paymentIntentId: failedInvoice.payment_intent,
          amount: failedInvoice.amount_due,
          currency: failedInvoice.currency,
          status: 'failed',
          paymentDate: new Date(failedInvoice.created * 1000).toISOString(),
          metadata: failedInvoice.metadata || {},
        });

        // Update subscription status if it exists
        if (failedInvoice.subscription) {
          const failedSubscription = await stripe.subscriptions.retrieve(failedInvoice.subscription);
          const failedCustomerEmail = await getCustomerEmail(failedInvoice.customer);
          
          await storeSubscriptionInSupabase({
            customerId: failedInvoice.customer,
            subscriptionId: failedSubscription.id,
            email: failedCustomerEmail,
            tier: 'premium',
            status: failedSubscription.status, // Will be 'past_due' or 'unpaid'
            currentPeriodStart: failedSubscription.current_period_start,
            currentPeriodEnd: failedSubscription.current_period_end,
            cancelAtPeriodEnd: failedSubscription.cancel_at_period_end,
            metadata: {},
          });
        }
        break;
      
      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        received: true,
        eventType: stripeEvent.type 
      }),
    };
  } catch (error) {
    console.error('Error handling webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Webhook handler failed',
        message: error.message 
      }),
    };
  }
};
