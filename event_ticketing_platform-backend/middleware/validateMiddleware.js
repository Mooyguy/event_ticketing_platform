import validator from "validator";

export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  if (!validator.isEmail(String(email))) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  // Password policy
  const passwordValue = String(password);
  const strongEnough =
    passwordValue.length >= 8 &&
    /[A-Z]/.test(passwordValue) &&
    /[a-z]/.test(passwordValue) &&
    /[0-9]/.test(passwordValue) &&
    /[^A-Za-z0-9]/.test(passwordValue);

  if (!strongEnough) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
    });
  }

  // Basic sanitization
  req.body.name = validator.escape(String(name).trim());
  req.body.email = validator.normalizeEmail(String(email).trim());

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  if (!validator.isEmail(String(email))) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  req.body.email = validator.normalizeEmail(String(email).trim());

  next();
};

export const validateBooking = (req, res, next) => {
  const { user_id, user_name, user_email, event_id, quantity } = req.body;

  if (!user_id || !user_name || !user_email || !event_id || !quantity) {
    return res.status(400).json({ message: "Missing required booking fields" });
  }

  if (!validator.isEmail(String(user_email))) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  if (!Number.isInteger(Number(event_id)) || Number(event_id) <= 0) {
    return res.status(400).json({ message: "Invalid event id" });
  }

  if (!Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
    return res.status(400).json({ message: "Quantity must be a positive integer" });
  }

  req.body.user_name = validator.escape(String(user_name).trim());
  req.body.user_email = validator.normalizeEmail(String(user_email).trim());
  req.body.event_id = Number(event_id);
  req.body.quantity = Number(quantity);

  next();
};

export const validateEventInput = (req, res, next) => {
  const {
    title,
    category,
    event_date,
    event_time,
    venue,
    location,
    price,
    description,
    seats_left,
  } = req.body;

  if (
    !title ||
    !category ||
    !event_date ||
    !event_time ||
    !venue ||
    !location ||
    price === undefined ||
    !description ||
    seats_left === undefined
  ) {
    return res.status(400).json({ message: "All required event fields must be provided" });
  }

  if (!validator.isDate(String(event_date))) {
    return res.status(400).json({ message: "Invalid event date" });
  }

  if (Number(price) < 0) {
    return res.status(400).json({ message: "Price cannot be negative" });
  }

  if (!Number.isInteger(Number(seats_left)) || Number(seats_left) < 0) {
    return res.status(400).json({ message: "Seats left must be a non-negative integer" });
  }

  req.body.title = validator.escape(String(title).trim());
  req.body.category = validator.escape(String(category).trim());
  req.body.venue = validator.escape(String(venue).trim());
  req.body.location = validator.escape(String(location).trim());
  req.body.description = validator.escape(String(description).trim());

  if (req.body.image) {
    req.body.image = validator.isURL(String(req.body.image), {
      require_protocol: true,
    })
      ? String(req.body.image).trim()
      : "";
  }

  req.body.price = Number(price);
  req.body.seats_left = Number(seats_left);

  next();
};