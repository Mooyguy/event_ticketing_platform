CREATE DATABASE IF NOT EXISTS event_ticketing_db;
USE event_ticketing_db;

CREATE TABLE IF NOT EXISTS events (
  id INT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  venue VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Available',
  image TEXT,
  description TEXT,
  seats_left INT NOT NULL DEFAULT 0
);