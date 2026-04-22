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
    (item) =>
      item.type === "ticket" &&
      String(item.event_id) === String(event.id)
  );

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += Number(quantity);
  } else {
    cart.push({
      type: "ticket",
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

export const updateCartItemQuantity = (id, quantity, type = "ticket") => {
  const cart = getCart().map((item) => {
    const itemId =
      type === "ticket" ? item.event_id : item.merchandise_id;

    return item.type === type && String(itemId) === String(id)
      ? { ...item, quantity: Math.max(1, Number(quantity)) }
      : item;
  });

  saveCart(cart);
  return cart;
};

export const removeFromCart = (id, type = "ticket") => {
  const cart = getCart().filter((item) => {
    const itemId =
      type === "ticket" ? item.event_id : item.merchandise_id;

    return !(item.type === type && String(itemId) === String(id));
  });

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
export const addMerchToCart = (merch, quantity = 1) => {
  const cart = getCart();

  const existingIndex = cart.findIndex(
    (item) =>
      item.type === "merch" &&
      String(item.merchandise_id) === String(merch.id)
  );

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += Number(quantity);
  } else {
    cart.push({
      type: "merch",
      merchandise_id: merch.id,
      name: merch.name,
      category: merch.category,
      price: Number(merch.price || 0),
      image: merch.image || "",
      stock: Number(merch.stock || 0),
      event_id: merch.event_id || null,
      quantity: Number(quantity),
    });
  }

  saveCart(cart);
  return cart;
};

export const CART_EVENT_NAME = CART_UPDATED_EVENT;