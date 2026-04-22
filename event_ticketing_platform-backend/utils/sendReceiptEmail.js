import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendReceiptEmail = async ({
  to,
  userName,
  orderId,
  createdAt,
  paymentStatus,
  totalAmount,
  tickets = [],
  merchandise = [],
}) => {
  const ticketLines =
    tickets.length > 0
      ? tickets
          .map(
            (t) =>
              `<li>${t.event_title} × ${t.quantity}${
                t.ticket_code ? ` (Code: ${t.ticket_code})` : ""
              }</li>`
          )
          .join("")
      : "<li>No tickets</li>";

  const merchLines =
    merchandise.length > 0
      ? merchandise
          .map(
            (m) =>
              `<li>${m.name} × ${m.quantity} - $${Number(
                m.subtotal ?? m.unit_price * m.quantity
              ).toFixed(2)}</li>`
          )
          .join("")
      : "<li>No merchandise</li>";

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b;">
      <h2 style="color: #2563eb;">AllEventsHub Receipt</h2>
      <p>Hello ${userName},</p>
      <p>Thank you for your purchase. Your order has been received successfully.</p>

      <div style="margin: 16px 0; padding: 16px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <p><strong>Order #:</strong> ${orderId}</p>
        <p><strong>Date:</strong> ${new Date(createdAt).toLocaleString()}</p>
        <p><strong>Status:</strong> ${paymentStatus}</p>
      </div>

      <h3>Tickets</h3>
      <ul>${ticketLines}</ul>

      <h3>Merchandise</h3>
      <ul>${merchLines}</ul>

      <h3 style="margin-top: 20px;">Total: $${Number(totalAmount).toFixed(2)}</h3>

      <p style="margin-top: 24px;">Thank you for using AllEventsHub.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"AllEventsHub" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Your AllEventsHub Receipt - Order #${orderId}`,
    html,
  });
};