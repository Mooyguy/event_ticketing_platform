CREATE DATABASE IF NOT EXISTS event_ticketing_db;

USE event_ticketing_db;

CREATE TABLE IF NOT EXISTS events (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    venue VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Available',
    image TEXT,
    description TEXT,
    seats_left INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
);

-- Auth
CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uniq_users_email (email)
);

-- Bookings & tickets
CREATE TABLE IF NOT EXISTS bookings (
    id INT NOT NULL AUTO_INCREMENT,
    order_id INT NULL,
    user_id INT NOT NULL,
    user_name VARCHAR(255) NULL,
    user_email VARCHAR(255) NULL,
    event_id INT NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(10, 2) NULL,
    ticket_code VARCHAR(100) NULL,
    qr_code TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'confirmed',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_bookings_user_id (user_id),
    KEY idx_bookings_event_id (event_id),
    KEY idx_bookings_order_id (order_id),
    CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_bookings_event FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tickets (
    id INT NOT NULL AUTO_INCREMENT,
    booking_id INT NOT NULL,
    ticket_code VARCHAR(100) NOT NULL,
    qr_code TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uniq_tickets_code (ticket_code),
    KEY idx_tickets_booking_id (booking_id),
    CONSTRAINT fk_tickets_booking FOREIGN KEY (booking_id) REFERENCES bookings (id) ON DELETE CASCADE
);

-- Merchandise
CREATE TABLE IF NOT EXISTS merchandise (
    id INT NOT NULL AUTO_INCREMENT,
    event_id INT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    image TEXT,
    category VARCHAR(100) NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Available',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_merch_event_id (event_id),
    CONSTRAINT fk_merch_event FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE SET NULL
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    order_type VARCHAR(50) NOT NULL DEFAULT 'mixed',
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_orders_user_id (user_id),
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS merch_orders (
    id INT NOT NULL AUTO_INCREMENT,
    order_id INT NULL,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_merch_orders_order_id (order_id),
    KEY idx_merch_orders_user_id (user_id),
    CONSTRAINT fk_merch_orders_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_merch_orders_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS merch_order_items (
    id INT NOT NULL AUTO_INCREMENT,
    merch_order_id INT NOT NULL,
    merchandise_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_moi_merch_order_id (merch_order_id),
    KEY idx_moi_merchandise_id (merchandise_id),
    CONSTRAINT fk_moi_merch_order FOREIGN KEY (merch_order_id) REFERENCES merch_orders (id) ON DELETE CASCADE,
    CONSTRAINT fk_moi_merchandise FOREIGN KEY (merchandise_id) REFERENCES merchandise (id) ON DELETE CASCADE
);