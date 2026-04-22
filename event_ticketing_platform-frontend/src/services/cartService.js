const CART_KEY = "event_cart";

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
};

export const addToCart = (event, quantity = 1) => {
  const cart = getCart();

  const existingIndex = cart.findIndex(
    (item) => String(item.event_id) === String(event.id)
  );

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      event_id: event.id,
      eventTitle: event.title,
      category: event.category,
      venue: event.venue,
      location: event.location,
      price: Number(event.price || 0),
      image: event.image || "",
      quantity,
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
};

export const getCartCount = () => {
  return getCart().reduce((sum, item) => sum + Number(item.quantity || 0), 0);
};

export const getCartTotal = () => {
  return getCart().reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );
};