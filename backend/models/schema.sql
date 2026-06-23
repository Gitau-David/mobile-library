-- ═══════════════════════════════════════════════════
--  Mobile Library DB — Schema & Seed Data
--  Run this file once in MySQL before starting the backend.
--  CLI:  mysql -u root -p < backend/models/schema.sql
-- ═══════════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS mobile_library_db;
USE mobile_library_db;

-- ─────────────────────────────────────────
-- 1. Users (Authentication)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    username   VARCHAR(50)  NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,              -- bcrypt hash
    name       VARCHAR(100) NOT NULL,
    role       ENUM('Librarian', 'Admin') DEFAULT 'Librarian',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ─────────────────────────────────────────
-- 2. Schools (Deployment Nodes)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS schools (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL UNIQUE,
    location   VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ─────────────────────────────────────────
-- 3. Students (Borrower Profiles)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS students (
    id         VARCHAR(50)  PRIMARY KEY,            -- Student ID / Barcode
    name       VARCHAR(100) NOT NULL,
    school_id  INT NOT NULL,
    status     ENUM('Active', 'Suspended') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ─────────────────────────────────────────
-- 4. Books (Physical Assets)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS books (
    id         VARCHAR(50)  PRIMARY KEY,            -- Barcode / ISBN
    title      VARCHAR(150) NOT NULL,
    author     VARCHAR(100) NOT NULL,
    status     ENUM('Available', 'Borrowed') DEFAULT 'Available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ─────────────────────────────────────────
-- 5. Transactions (Circulation Log)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transactions (
    id                 INT AUTO_INCREMENT PRIMARY KEY,
    book_id            VARCHAR(50) NOT NULL,
    student_id         VARCHAR(50) NOT NULL,
    checkout_school_id INT NOT NULL,
    return_school_id   INT NULL,                    -- may differ from checkout node
    borrow_date        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    return_date        TIMESTAMP NULL,
    status             ENUM('Issued', 'Recovered') DEFAULT 'Issued',
    FOREIGN KEY (book_id)            REFERENCES books(id)    ON DELETE CASCADE,
    FOREIGN KEY (student_id)         REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (checkout_school_id) REFERENCES schools(id),
    FOREIGN KEY (return_school_id)   REFERENCES schools(id)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────
-- Seed Data
-- password for 'librarian' is: password123
-- ─────────────────────────────────────────
INSERT IGNORE INTO users (username, password, name, role) VALUES
('librarian', '$2b$10$wK7Mv/XbZUX7.K7IOmHOn.MvOnmXg.C6tXbU6.qI9Iih1FESXWpEq', 'David Kariuki', 'Librarian');

INSERT IGNORE INTO schools (name, location) VALUES
('Kilifi Primary School',     'Kilifi Town'),
('Matsangoni Primary School', 'Matsangoni'),
('Watamu Primary School',     'Watamu');

INSERT IGNORE INTO students (id, name, school_id, status) VALUES
('STU001', 'Emmanuel Zawadi', 1, 'Active'),
('STU002', 'Amani Mwaka',     2, 'Active'),
('STU003', 'Furaha Mapenzi',  3, 'Active');

INSERT IGNORE INTO books (id, title, author, status) VALUES
('BKP001', 'Longhorn Secondary English', 'OUP East Africa',  'Available'),
('BKP002', 'Peak Revision Mathematics',  'H. Kimani',        'Available'),
('BKP003', 'Gateway Kiswahili Sanifu',   'D. Kingei',        'Available'),
('BKP004', 'The River and the Source',   'Margaret Ogola',   'Available');
