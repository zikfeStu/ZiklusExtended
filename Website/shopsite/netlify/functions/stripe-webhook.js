const Stripe = require("stripe");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const signature = event.headers["stripe-signature"];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return { statusCode: 400, body: `Webhook error: ${error.message}` };
  }

  if (stripeEvent.type === "checkout.session.completed") {
    const session = stripeEvent.data.object;
    console.log("Paid order", {
      orderId: session.metadata && session.metadata.order_id,
      email: session.customer_details && session.customer_details.email,
      amountTotal: session.amount_total
    });
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
