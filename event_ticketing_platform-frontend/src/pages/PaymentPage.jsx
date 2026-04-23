import React, { useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import PageHero from "../components/ui/PageHero";
import { checkoutOrder, fetchOrdersByUser } from "../services/orderService";
import { formatCurrency } from "../utils/formatCurrency";
import { getCart, clearCart } from "../services/cartService";

function maskCardNumber(value) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export default function PaymentPage() {
  const navigate = useNavigate();

  const cart = useMemo(() => getCart(), []);
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  const [cardName, setCardName] = useState(user?.name || "");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  if (!user) return <Navigate to="/login" replace />;
  if (!cart.length) return <Navigate to="/cart" replace />;

  const ticketCartItems = cart.filter((item) => item.type === "ticket");
  const merchCartItems = cart.filter((item) => item.type === "merch");

  const ticketItems = ticketCartItems.map((item) => ({
    event_id: item.event_id,
    quantity: Number(item.quantity),
  }));

  const merchItems = merchCartItems.map((item) => ({
    merchandise_id: item.merchandise_id,
    quantity: Number(item.quantity),
  }));

  const totalAmount = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  const handlePayment = async (e) => {
    e.preventDefault();
    setError("");

    if (!cardName.trim()) {
      setError("Cardholder name is required.");
      return;
    }

    if (cardNumber.replace(/\s/g, "").length !== 16) {
      setError("Card number must be 16 digits.");
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      setError("Expiry must be in MM/YY format.");
      return;
    }

    if (!/^\d{3,4}$/.test(cvv)) {
      setError("CVV must be 3 or 4 digits.");
      return;
    }

    try {
      setProcessing(true);

      const existingOrders = await fetchOrdersByUser(user.id);

      let shouldProceed = true;

      for (const ticket of ticketItems) {
        const existingOrder = existingOrders.find(
          (order) =>
            Array.isArray(order.tickets) &&
            order.tickets.some(
              (t) => Number(t.event_id) === Number(ticket.event_id)
            )
        );

        if (existingOrder) {
          const existingTicket = existingOrder.tickets.find(
            (t) => Number(t.event_id) === Number(ticket.event_id)
          );

          shouldProceed = window.confirm(
            `You already booked "${existingTicket.event_title}" with ${existingTicket.quantity} ticket(s).\n\nDo you want to add ${ticket.quantity} more ticket(s) to your existing booking?`
          );

          if (!shouldProceed) break;
        }
      }

      if (!shouldProceed) {
        setProcessing(false);
        return;
      }

      const result = await checkoutOrder({
        user_id: user.id,
        user_name: user.name,
        user_email: user.email,
        ticketItems,
        merchItems,
      });

      const ticketEventTitle =
        ticketCartItems.length > 0
          ? ticketCartItems.map((item) => item.eventTitle).join(", ")
          : "Merchandise Order";

      const totalQuantity = cart.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
      );

      clearCart();

      navigate("/booking-success", {
        state: {
          orderId: result.orderId,
          user_name: user.name,
          user_email: user.email,
          eventTitle: ticketEventTitle,
          quantity: totalQuantity,
          amount: result.totalAmount,
          ticketCode: result.ticketCode || "",
          qrCode: result.qrCode || "",
        },
      });
    } catch (err) {
      setError(err.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <PageHero title="Payment" subtitle="Complete your order securely" />

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[28px] bg-white p-6 shadow-lg sm:p-8">
            <h2 className="mb-4 text-2xl font-bold text-slate-900">
              Payment Details
            </h2>
            <p className="mb-6 text-slate-600">
              Enter your card details to complete this payment.
            </p>

            <form onSubmit={handlePayment} className="space-y-5">
              <div>
                <label className="mb-2 block font-semibold text-slate-800">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-800">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="Card Number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(maskCardNumber(e.target.value))}
                  className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block font-semibold text-slate-800">
                    Expiry
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-slate-800">
                    CVV
                  </label>
                  <input
                    type="password"
                    placeholder="CVV"
                    value={cvv}
                    onChange={(e) =>
                      setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-red-100 p-3 text-red-700">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={processing}
                  className="h-12 w-full rounded-xl bg-blue-600 px-6 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {processing
                    ? "Processing Payment..."
                    : `Pay ${formatCurrency(totalAmount)}`}
                </button>

                <Link
                  to="/"
                  className="flex h-12 w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-6 font-semibold text-slate-800 hover:bg-slate-50"
                >
                  Add More Events
                </Link>
              </div>
            </form>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-lg sm:p-8">
            <h2 className="mb-4 text-2xl font-bold text-slate-900">
              Order Summary
            </h2>

            <div className="space-y-4">
              {cart.map((item, i) => (
                <div
                  key={`${item.type}-${i}`}
                  className="flex justify-between rounded-xl border border-slate-200 p-4"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {item.type === "ticket" ? item.eventTitle : item.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {item.quantity} item(s) • {formatCurrency(item.price)} each
                    </p>
                  </div>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(Number(item.price) * Number(item.quantity))}
                  </span>
                </div>
              ))}
            </div>

            <hr className="my-6" />

            <div className="flex justify-between text-lg font-bold text-slate-900">
              <span>Total</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>

            <Link
              to="/"
              className="mt-6 inline-flex rounded-xl border border-slate-300 bg-white px-5 py-3 text-center font-semibold text-slate-800 hover:bg-slate-50"
            >
              Back to Events / Add More Events
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}









// import React, { useMemo, useState } from "react";
// import { Link, Navigate, useNavigate } from "react-router-dom";
// import PageHero from "../components/ui/PageHero";
// import { checkoutOrder, fetchOrdersByUser } from "../services/orderService";
// import { formatCurrency } from "../utils/formatCurrency";
// import { getCart, clearCart } from "../services/cartService";

// function maskCardNumber(value) {
//   return value
//     .replace(/\D/g, "")
//     .slice(0, 16)
//     .replace(/(.{4})/g, "$1 ")
//     .trim();
// }

// function formatExpiry(value) {
//   const digits = value.replace(/\D/g, "").slice(0, 4);
//   if (digits.length <= 2) return digits;
//   return `${digits.slice(0, 2)}/${digits.slice(2)}`;
// }

// function detectCardType(number) {
//   const cleaned = number.replace(/\s/g, "");

//   if (/^4/.test(cleaned)) return "visa";
//   if (/^5[1-5]/.test(cleaned)) return "mastercard";
//   if (/^3[47]/.test(cleaned)) return "amex";

//   return "";
// }

// function getCardLogo(cardType) {
//   if (cardType === "visa") {
//     return "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png";
//   }

//   if (cardType === "mastercard") {
//     return "https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png";
//   }

//   if (cardType === "amex") {
//     return "https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg";
//   }

//   return "";
// }

// export default function PaymentPage() {
//   const navigate = useNavigate();

//   const cart = useMemo(() => getCart(), []);
//   const user = useMemo(() => {
//     try {
//       return JSON.parse(localStorage.getItem("user"));
//     } catch {
//       return null;
//     }
//   }, []);

//   const [cardName, setCardName] = useState(user?.name || "");
//   const [cardNumber, setCardNumber] = useState("");
//   const [expiry, setExpiry] = useState("");
//   const [cvv, setCvv] = useState("");
//   const [cardType, setCardType] = useState("");
//   const [processing, setProcessing] = useState(false);
//   const [error, setError] = useState("");

//   if (!user) return <Navigate to="/login" replace />;
//   if (!cart.length) return <Navigate to="/cart" replace />;

//   const ticketItems = cart
//     .filter((item) => item.type === "ticket")
//     .map((item) => ({
//       event_id: item.event_id,
//       quantity: Number(item.quantity),
//     }));

//   const merchItems = cart
//     .filter((item) => item.type === "merch")
//     .map((item) => ({
//       merchandise_id: item.merchandise_id,
//       quantity: Number(item.quantity),
//     }));

//   const totalAmount = cart.reduce(
//     (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
//     0
//   );

//   const handlePayment = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!cardName.trim()) {
//       setError("Cardholder name is required.");
//       return;
//     }

//     if (cardNumber.replace(/\s/g, "").length !== 16) {
//       setError("Card number must be 16 digits.");
//       return;
//     }

//     if (!/^\d{2}\/\d{2}$/.test(expiry)) {
//       setError("Expiry must be in MM/YY format.");
//       return;
//     }

//     if (!/^\d{3,4}$/.test(cvv)) {
//       setError("CVV must be 3 or 4 digits.");
//       return;
//     }

//     try {
//       setProcessing(true);

//       const existingOrders = await fetchOrdersByUser(user.id);

//       let shouldProceed = true;

//       for (const ticket of ticketItems) {
//         const existingOrder = existingOrders.find(
//           (order) =>
//             Array.isArray(order.tickets) &&
//             order.tickets.some(
//               (t) => Number(t.event_id) === Number(ticket.event_id)
//             )
//         );

//         if (existingOrder) {
//           const existingTicket = existingOrder.tickets.find(
//             (t) => Number(t.event_id) === Number(ticket.event_id)
//           );

//           shouldProceed = window.confirm(
//             `You already booked "${existingTicket.event_title}" with ${existingTicket.quantity} ticket(s).\n\nDo you want to add ${ticket.quantity} more ticket(s) to your existing booking?`
//           );

//           if (!shouldProceed) break;
//         }
//       }

//       if (!shouldProceed) {
//         setProcessing(false);
//         return;
//       }

//       const result = await checkoutOrder({
//         user_id: user.id,
//         user_name: user.name,
//         user_email: user.email,
//         ticketItems,
//         merchItems,
//       });

//       clearCart();

//       navigate("/booking-success", {
//         state: {
//           orderId: result.orderId,
//           user_name: user.name,
//           user_email: user.email,
//           eventTitle:
//             ticketItems.length > 0
//               ? cart
//                   .filter((item) => item.type === "ticket")
//                   .map((item) => item.eventTitle)
//                   .join(", ")
//               : "Merchandise Order",
//           quantity: cart.reduce(
//             (sum, item) => sum + Number(item.quantity || 0),
//             0
//           ),
//           amount: result.totalAmount,
//           ticketCode: result.ticketCode || "",
//           qrCode: result.qrCode || "",
//         },
//       });
//     } catch (err) {
//       setError(err.message || "Payment failed");
//     } finally {
//       setProcessing(false);
//     }
//   };

//   return (
//     <>
//       <PageHero title="Payment" subtitle="Complete your order securely" />

//       <main className="mx-auto max-w-6xl px-4 py-10">
//         <div className="grid gap-8 lg:grid-cols-2">
//           <div className="rounded-2xl bg-white p-6 shadow-lg">
//             <h2 className="mb-4 text-xl font-bold">Payment Details</h2>
//             <p className="mb-6 text-slate-600">
//               Enter your card details to complete this payment.
//             </p>

//             <form onSubmit={handlePayment} className="space-y-4">
//               <div>
//                 <label className="mb-2 block font-semibold text-slate-800">
//                   Cardholder Name
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Cardholder Name"
//                   value={cardName}
//                   onChange={(e) => setCardName(e.target.value)}
//                   className="w-full rounded-lg border p-3"
//                 />
//               </div>

//               <div>
//                 <label className="mb-2 block font-semibold text-slate-800">
//                   Card Type
//                 </label>

//                 <div className="flex flex-wrap gap-3">
//                   <button
//                     type="button"
//                     onClick={() => setCardType("visa")}
//                     className={`flex items-center gap-2 rounded-lg border px-4 py-2 transition ${
//                       cardType === "visa"
//                         ? "border-blue-600 bg-blue-50"
//                         : "border-slate-300 bg-white"
//                     }`}
//                   >
//                     <img
//                       src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
//                       alt="Visa"
//                       className="h-5 w-auto object-contain"
//                     />
//                     <span className="text-sm font-medium text-slate-800">
//                       Visa
//                     </span>
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() => setCardType("mastercard")}
//                     className={`flex items-center gap-2 rounded-lg border px-4 py-2 transition ${
//                       cardType === "mastercard"
//                         ? "border-blue-600 bg-blue-50"
//                         : "border-slate-300 bg-white"
//                     }`}
//                   >
//                     <img
//                       src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
//                       alt="Mastercard"
//                       className="h-5 w-auto object-contain"
//                     />
//                     <span className="text-sm font-medium text-slate-800">
//                       Mastercard
//                     </span>
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() => setCardType("amex")}
//                     className={`flex items-center gap-2 rounded-lg border px-4 py-2 transition ${
//                       cardType === "amex"
//                         ? "border-blue-600 bg-blue-50"
//                         : "border-slate-300 bg-white"
//                     }`}
//                   >
//                     <img
//                       src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg"
//                       alt="American Express"
//                       className="h-5 w-auto object-contain"
//                     />
//                     <span className="text-sm font-medium text-slate-800">
//                       Amex
//                     </span>
//                   </button>
//                 </div>
//               </div>

//               <div>
//                 <label className="mb-2 block font-semibold text-slate-800">
//                   Card Number
//                 </label>

//                 <div className="relative">
//                   <input
//                     type="text"
//                     placeholder="Card Number"
//                     value={cardNumber}
//                     onChange={(e) => {
//                       const value = maskCardNumber(e.target.value);
//                       setCardNumber(value);
//                       setCardType(detectCardType(value) || cardType);
//                     }}
//                     className="w-full rounded-lg border p-3 pr-16"
//                   />

//                   {cardType && (
//                     <img
//                       src={getCardLogo(cardType)}
//                       alt={cardType}
//                       className="absolute right-3 top-1/2 h-6 w-auto -translate-y-1/2 object-contain"
//                     />
//                   )}
//                 </div>
//               </div>

//               <div className="flex gap-4">
//                 <div className="w-full">
//                   <label className="mb-2 block font-semibold text-slate-800">
//                     Expiry
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="MM/YY"
//                     value={expiry}
//                     onChange={(e) => setExpiry(formatExpiry(e.target.value))}
//                     className="w-full rounded-lg border p-3"
//                   />
//                 </div>

//                 <div className="w-full">
//                   <label className="mb-2 block font-semibold text-slate-800">
//                     CVV
//                   </label>
//                   <input
//                     type="password"
//                     placeholder="CVV"
//                     value={cvv}
//                     onChange={(e) =>
//                       setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
//                     }
//                     className="w-full rounded-lg border p-3"
//                   />
//                 </div>
//               </div>

//               {error && (
//                 <div className="rounded bg-red-100 p-3 text-red-700">
//                   {error}
//                 </div>
//               )}

//               <div className="flex flex-col gap-3 sm:flex-row">
//                 <button
//                   type="submit"
//                   disabled={processing}
//                   className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white disabled:opacity-60"
//                 >
//                   {processing
//                     ? "Processing Payment..."
//                     : `Pay ${formatCurrency(totalAmount)}`}
//                 </button>

//                 <Link
//                   to="/"
//                   className="block w-full rounded-lg border p-3 text-center font-semibold"
//                 >
//                   Add More Events
//                 </Link>
//               </div>
//             </form>
//           </div>

//           <div className="rounded-2xl bg-white p-6 shadow-lg">
//             <h2 className="mb-4 text-xl font-bold">Order Summary</h2>

//             <div className="space-y-4">
//               {cart.map((item, i) => (
//                 <div
//                   key={`${item.type}-${i}`}
//                   className="flex justify-between rounded-xl border p-4"
//                 >
//                   <div>
//                     <p className="font-semibold text-slate-900">
//                       {item.type === "ticket" ? item.eventTitle : item.name}
//                     </p>
//                     <p className="mt-1 text-sm text-slate-600">
//                       {item.quantity} item(s) • {formatCurrency(item.price)} each
//                     </p>
//                   </div>
//                   <span className="font-semibold">
//                     {formatCurrency(Number(item.price) * Number(item.quantity))}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             <hr className="my-6" />

//             <div className="flex justify-between text-lg font-bold">
//               <span>Total</span>
//               <span>{formatCurrency(totalAmount)}</span>
//             </div>

//             <Link
//               to="/"
//               className="mt-6 inline-block rounded-lg border px-5 py-3 text-center font-semibold"
//             >
//               Back to Events / Add More Events
//             </Link>
//           </div>
//         </div>
//       </main>
//     </>
//   );
// }