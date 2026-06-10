const Stripe = require("stripe");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: "STRIPE_SECRET_KEY is missing" }) };
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const order = JSON.parse(event.body || "{}");
  const origin = process.env.URL || "https://ziklus.de";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: order.customer && order.customer.email,
    success_url: `${origin}/erfolg.html?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/warenkorb.html`,
    metadata: {
      order_id: order.id || "",
      customer_name: order.customer ? order.customer.name || "" : ""
    },
    payment_intent_data: {
      receipt_email: order.customer && order.customer.email
    },
    line_items: (order.items || []).map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "eur",
        unit_amount: Math.round(item.price * 100),
        product_data: {
          name: item.name,
          description: item.teaser || item.category
        }
      }
    }))
  });

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: session.url })
  };
};
