const CART_KEY = "event_cart";
const CART_UPDATED_EVENT = "cart-updated";

const notifyCartUpdated = () => {
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
};

export const getCart = () => {
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  notifyCartUpdated();
};

export const addToCart = (event, quantity = 1) => {
  const cart = getCart();

  const existingIndex = cart.findIndex(
    (item) => String(item.event_id) === String(event.id)
  );

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += Number(quantity);
  } else {
    cart.push({
      event_id: event.id,
      eventTitle: event.title,
      category: event.category,
      venue: event.venue,
      location: event.location,
      price: Number(event.price || 0),
      image: event.image || "",
      quantity: Number(quantity),
    });
  }

  saveCart(cart);
  return cart;
};

export const updateCartItemQuantity = (eventId, quantity) => {
  const cart = getCart().map((item) =>
    String(item.event_id) === String(eventId)
      ? { ...item, quantity: Math.max(1, Number(quantity)) }
      : item
  );

  saveCart(cart);
  return cart;
};

export const removeFromCart = (eventId) => {
  const cart = getCart().filter(
    (item) => String(item.event_id) !== String(eventId)
  );

  saveCart(cart);
  return cart;
};

export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
  notifyCartUpdated();
};

export const getCartCount = () => {
  return getCart().reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );
};

export const getCartTotal = () => {
  return getCart().reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );
};

export const CART_EVENT_NAME = CART_UPDATED_EVENT;