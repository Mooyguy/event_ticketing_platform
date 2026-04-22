import React, { useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import PageHero from "../components/ui/PageHero";
import {
  createBooking,
  addTicketsToBooking,
} from "../services/bookingService";
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
  const loggedInUser = useMemo(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  }, []);

  const [cardName, setCardName] = useState(loggedInUser?.name || "");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  if (!loggedInUser) {
    return <Navigate to="/login" replace />;
  }

  if (!cart.length) {
    return <Navigate to="/cart" replace />;
  }

  const totalAmount = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  const handlePayment = async (e) => {
    e.preventDefault();
    setError("");

    const cleanCardNumber = cardNumber.replace(/\s/g, "");
    const cleanExpiry = expiry.trim();

    if (!cardName.trim()) {
      setError("Please enter the cardholder name.");
      return;
    }

    if (cleanCardNumber.length !== 16) {
      setError("Card number must be 16 digits.");
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(cleanExpiry)) {
      setError("Expiry date must be in MM/YY format.");
      return;
    }

    if (!/^\d{3,4}$/.test(cvv)) {
      setError("CVV must be 3 or 4 digits.");
      return;
    }

    try {
      setProcessing(true);

      await new Promise((resolve) => setTimeout(resolve, 1200));

      let updatedBooking = false;
      let finalTicketCode = "";
      let finalQrCode = "";

      for (const item of cart) {
        try {
          const result = await createBooking({
            user_id: loggedInUser.id,
            user_name: loggedInUser.name,
            user_email: loggedInUser.email,
            event_id: item.event_id,
            quantity: Number(item.quantity),
          });

          finalTicketCode = result.ticketCode || finalTicketCode;
          finalQrCode = result.qrCode || finalQrCode;
        } catch (err) {
          if (err.status === 409 && err.data?.bookingExists) {
            const shouldMerge = window.confirm(
              `You already booked "${item.eventTitle}" with ${err.data.existingQuantity} ticket(s).\n\nDo you want to add ${item.quantity} more ticket(s) to your existing booking?`
            );

            if (!shouldMerge) {
              continue;
            }

            const updated = await addTicketsToBooking(
              err.data.existingBookingId,
              Number(item.quantity)
            );

            updatedBooking = true;
            finalTicketCode = updated.ticketCode || finalTicketCode;
            finalQrCode = updated.qrCode || finalQrCode;
          } else {
            throw err;
          }
        }
      }

      clearCart();

      navigate("/booking-success", {
        state: {
          user_name: loggedInUser.name,
          user_email: loggedInUser.email,
          eventTitle: "Multiple Events Booking",
          quantity: cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
          ticketCode: finalTicketCode,
          qrCode: finalQrCode,
          amount: totalAmount,
          event_id: cart[0]?.event_id,
          isUpdated: updatedBooking,
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
      <PageHero
        title="Payment"
        subtitle="Complete your payment to confirm your event bookings"
      />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[28px] bg-white p-5 shadow-lg sm:p-8">
            <h2 className="text-2xl font-bold text-slate-900">Payment Details</h2>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Enter your card details to complete this payment.
            </p>

            <form onSubmit={handlePayment} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block font-semibold text-slate-800">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Name on card"
                  className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-800">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(maskCardNumber(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block font-semibold text-slate-800">
                    Expiry
                  </label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/YY"
                    className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-slate-800">
                    CVV
                  </label>
                  <input
                    type="password"
                    value={cvv}
                    onChange={(e) =>
                      setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    placeholder="123"
                    className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-red-100 p-4 text-red-700">
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

          <div className="rounded-[28px] bg-white p-5 shadow-lg sm:p-8">
            <h2 className="text-2xl font-bold text-slate-900">Order Summary</h2>

            <div className="mt-6 space-y-4">
              {cart.map((item) => (
                <div key={item.event_id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-600">{item.eventTitle}</span>
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-slate-600">
                    {item.quantity} ticket(s) • {formatCurrency(item.price)} each
                  </div>
                </div>
              ))}

              <div className="border-t pt-4">
                <div className="flex justify-between gap-4">
                  <span className="text-lg font-bold text-slate-900">Total</span>
                  <span className="text-lg font-bold text-slate-900">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/"
                  className="inline-flex rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 hover:bg-slate-50"
                >
                  Back to Events / Add More Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}






// import React, { useMemo, useState } from "react";
// import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
// import PageHero from "../components/ui/PageHero";
// import {
//   createBooking,
//   addTicketsToBooking,
// } from "../services/bookingService";
// import { formatCurrency } from "../utils/formatCurrency";

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

// export default function PaymentPage() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const bookingData = location.state;

//   const loggedInUser = useMemo(() => {
//     const storedUser = localStorage.getItem("user");

//     if (!storedUser) return null;

//     try {
//       return JSON.parse(storedUser);
//     } catch (error) {
//       console.error("Invalid user data in localStorage:", error);
//       localStorage.removeItem("user");
//       localStorage.removeItem("token");
//       return null;
//     }
//   }, []);

//   const [cardName, setCardName] = useState(loggedInUser?.name || "");
//   const [cardNumber, setCardNumber] = useState("");
//   const [expiry, setExpiry] = useState("");
//   const [cvv, setCvv] = useState("");
//   const [processing, setProcessing] = useState(false);
//   const [error, setError] = useState("");

//   if (!bookingData || !loggedInUser) {
//     return <Navigate to="/" replace />;
//   }

//   const totalAmount =
//     Number(bookingData.price || 0) * Number(bookingData.quantity || 0);

//   const handlePayment = async (e) => {
//     e.preventDefault();
//     setError("");

//     const cleanCardNumber = cardNumber.replace(/\s/g, "");
//     const cleanExpiry = expiry.trim();

//     if (!cardName.trim()) {
//       setError("Please enter the cardholder name.");
//       return;
//     }

//     if (cleanCardNumber.length !== 16) {
//       setError("Card number must be 16 digits.");
//       return;
//     }

//     if (!/^\d{2}\/\d{2}$/.test(cleanExpiry)) {
//       setError("Expiry date must be in MM/YY format.");
//       return;
//     }

//     if (!/^\d{3,4}$/.test(cvv)) {
//       setError("CVV must be 3 or 4 digits.");
//       return;
//     }

//     try {
//       setProcessing(true);

//       // demo payment delay
//       await new Promise((resolve) => setTimeout(resolve, 1200));

//       const result = await createBooking({
//         user_id: loggedInUser.id,
//         user_name: loggedInUser.name,
//         user_email: loggedInUser.email,
//         event_id: bookingData.event_id,
//         quantity: Number(bookingData.quantity),
//       });

//       navigate("/booking-success", {
//         state: {
//           user_name: loggedInUser.name,
//           user_email: loggedInUser.email,
//           eventTitle: bookingData.eventTitle,
//           quantity: Number(bookingData.quantity),
//           ticketCode: result.ticketCode || "",
//           qrCode: result.qrCode || "",
//           amount: totalAmount,
//           event_id: bookingData.event_id,
//           isUpdated: false,
//         },
//       });
//     } catch (err) {
//       if (err.status === 409 && err.data?.bookingExists) {
//         const shouldMerge = window.confirm(
//           `You already booked this event with ${err.data.existingQuantity} ticket(s).\n\nDo you want to add ${bookingData.quantity} more ticket(s) to your existing booking?`
//         );

//         if (!shouldMerge) {
//           setError("Booking update cancelled.");
//           return;
//         }

//         try {
//           const updated = await addTicketsToBooking(
//             err.data.existingBookingId,
//             Number(bookingData.quantity)
//           );

//           navigate("/booking-success", {
//             state: {
//               user_name: loggedInUser.name,
//               user_email: loggedInUser.email,
//               eventTitle: bookingData.eventTitle,
//               quantity: updated.newQuantity,
//               ticketCode: updated.ticketCode || "",
//               qrCode: updated.qrCode || "",
//               amount: Number(bookingData.price) * Number(updated.newQuantity),
//               event_id: bookingData.event_id,
//               isUpdated: true,
//             },
//           });
//         } catch (mergeError) {
//           setError(mergeError.message || "Failed to update existing booking");
//         }

//         return;
//       }

//       setError(err.message || "Payment failed");
//     } finally {
//       setProcessing(false);
//     }
//   };

//   return (
//     <>
//       <PageHero
//         title="Payment"
//         subtitle="Complete your payment to confirm your ticket booking"
//       />

//       <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
//         <div className="grid gap-8 lg:grid-cols-2">
//           <div className="rounded-[28px] bg-white p-5 shadow-lg sm:p-8">
//             <h2 className="text-2xl font-bold text-slate-900">
//               Payment Details
//             </h2>
//             <p className="mt-2 text-sm text-slate-600 sm:text-base">
//               Enter your card details to complete this payment.
//             </p>

//             <form onSubmit={handlePayment} className="mt-6 space-y-5">
//               <div>
//                 <label className="mb-2 block font-semibold text-slate-800">
//                   Cardholder Name
//                 </label>
//                 <input
//                   type="text"
//                   value={cardName}
//                   onChange={(e) => setCardName(e.target.value)}
//                   placeholder="Name on card"
//                   className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="mb-2 block font-semibold text-slate-800">
//                   Card Number
//                 </label>
//                 <input
//                   type="text"
//                   value={cardNumber}
//                   onChange={(e) => setCardNumber(maskCardNumber(e.target.value))}
//                   placeholder="1234 5678 9012 3456"
//                   className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500"
//                   required
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="mb-2 block font-semibold text-slate-800">
//                     Expiry
//                   </label>
//                   <input
//                     type="text"
//                     value={expiry}
//                     onChange={(e) => setExpiry(formatExpiry(e.target.value))}
//                     placeholder="MM/YY"
//                     className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-2 block font-semibold text-slate-800">
//                     CVV
//                   </label>
//                   <input
//                     type="password"
//                     value={cvv}
//                     onChange={(e) =>
//                       setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
//                     }
//                     placeholder="123"
//                     className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500"
//                     required
//                   />
//                 </div>
//               </div>

//               {error && (
//                 <div className="rounded-xl bg-red-100 p-4 text-red-700">
//                   {error}
//                 </div>
//               )}

//               <div className="flex flex-col gap-3 sm:flex-row">
//                 <button
//                   type="submit"
//                   disabled={processing}
//                   className="h-12 w-full rounded-xl bg-blue-600 px-6 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
//                 >
//                   {processing
//                     ? "Processing Payment..."
//                     : `Pay ${formatCurrency(totalAmount)}`}
//                 </button>

//                 <Link
//                   to={`/events/${bookingData.event_id}`}
//                   className="flex h-12 w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-6 font-semibold text-slate-800 hover:bg-slate-50"
//                 >
//                   Cancel
//                 </Link>
//               </div>
//             </form>

//             <p className="mt-4 text-xs text-slate-500">
//               Demo payment page for capstone project. Card details are validated
//               in the UI only and are not stored.
//             </p>
//           </div>

//           <div className="rounded-[28px] bg-white p-5 shadow-lg sm:p-8">
//             <h2 className="text-2xl font-bold text-slate-900">Order Summary</h2>

//             <div className="mt-6 space-y-4 text-sm sm:text-base">
//               <div className="flex justify-between gap-4">
//                 <span className="text-slate-600">Event</span>
//                 <span className="text-right font-semibold text-slate-900">
//                   {bookingData.eventTitle}
//                 </span>
//               </div>

//               <div className="flex justify-between gap-4">
//                 <span className="text-slate-600">Category</span>
//                 <span className="text-right font-semibold text-slate-900">
//                   {bookingData.category}
//                 </span>
//               </div>

//               <div className="flex justify-between gap-4">
//                 <span className="text-slate-600">Venue</span>
//                 <span className="text-right font-semibold text-slate-900">
//                   {bookingData.venue}
//                 </span>
//               </div>

//               <div className="flex justify-between gap-4">
//                 <span className="text-slate-600">Tickets</span>
//                 <span className="font-semibold text-slate-900">
//                   {bookingData.quantity}
//                 </span>
//               </div>

//               <div className="flex justify-between gap-4">
//                 <span className="text-slate-600">Price per ticket</span>
//                 <span className="font-semibold text-slate-900">
//                   {formatCurrency(bookingData.price)}
//                 </span>
//               </div>

//               <div className="border-t pt-4">
//                 <div className="flex justify-between gap-4">
//                   <span className="text-lg font-bold text-slate-900">Total</span>
//                   <span className="text-lg font-bold text-slate-900">
//                     {formatCurrency(totalAmount)}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </>
//   );
// }