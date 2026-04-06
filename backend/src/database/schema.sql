-- Drop existing tables if they exist
DROP TABLE IF EXISTS ratings CASCADE;
DROP TABLE IF EXISTS work_records CASCADE;
DROP TABLE IF EXISTS slots CASCADE;
DROP TABLE IF EXISTS complaints CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS hostels CASCADE;
DROP TABLE IF EXISTS electricians CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'electrician', 'warden', 'admin')),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Electricians table
CREATE TABLE electricians (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  experience_years INT DEFAULT 0,
  specialization TEXT,
  availability_status VARCHAR(50) DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'on_leave')),
  total_jobs INT DEFAULT 0,
  completed_jobs INT DEFAULT 0,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  total_earnings DECIMAL(10, 2) DEFAULT 0,
  bio TEXT,
  certificates TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_electrician_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Hostels table
CREATE TABLE hostels (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  hostel_type VARCHAR(50) NOT NULL CHECK (hostel_type IN ('boys', 'girls')),
  total_rooms INT,
  warden_id INT,
  location TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_hostel_warden FOREIGN KEY (warden_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Rooms table
CREATE TABLE rooms (
  id SERIAL PRIMARY KEY,
  hostel_id INT NOT NULL,
  room_number VARCHAR(50) NOT NULL,
  floor INT,
  capacity INT DEFAULT 2,
  occupants INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_room_hostel FOREIGN KEY (hostel_id) REFERENCES hostels(id) ON DELETE CASCADE,
  UNIQUE (hostel_id, room_number)
);

-- Complaints table
CREATE TABLE complaints (
  id SERIAL PRIMARY KEY,
  room_id INT NOT NULL,
  student_id INT NOT NULL,
  hostel_id INT NOT NULL,
  issue_description TEXT NOT NULL,
  category VARCHAR(100) DEFAULT 'general' CHECK (category IN ('lighting', 'fan', 'switch', 'wiring', 'appliance', 'general')),
  issue_photo_url TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_progress', 'completed', 'cancelled')),
  priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_complaint_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  CONSTRAINT fk_complaint_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_complaint_hostel FOREIGN KEY (hostel_id) REFERENCES hostels(id) ON DELETE CASCADE
);

-- Slots table (Time slots for repairs)
CREATE TABLE slots (
  id SERIAL PRIMARY KEY,
  complaint_id INT NOT NULL,
  electrician_id INT,
  hostel_id INT NOT NULL,
  room_id INT NOT NULL,
  slot_date DATE NOT NULL,
  slot_start_time TIME NOT NULL,
  slot_end_time TIME NOT NULL,
  status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'booked', 'in_progress', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_slot_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
  CONSTRAINT fk_slot_electrician FOREIGN KEY (electrician_id) REFERENCES electricians(id) ON DELETE SET NULL,
  CONSTRAINT fk_slot_hostel FOREIGN KEY (hostel_id) REFERENCES hostels(id) ON DELETE CASCADE,
  CONSTRAINT fk_slot_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- Work records table
CREATE TABLE work_records (
  id SERIAL PRIMARY KEY,
  slot_id INT NOT NULL UNIQUE,
  electrician_id INT NOT NULL,
  complaint_id INT NOT NULL,
  before_photo_url TEXT,
  after_photo_url TEXT,
  parts_used TEXT,
  labor_hours DECIMAL(5, 2),
  notes TEXT,
  work_status VARCHAR(50) DEFAULT 'completed' CHECK (work_status IN ('in_progress', 'completed', 'issues')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_work_record_slot FOREIGN KEY (slot_id) REFERENCES slots(id) ON DELETE CASCADE,
  CONSTRAINT fk_work_record_electrician FOREIGN KEY (electrician_id) REFERENCES electricians(id) ON DELETE CASCADE,
  CONSTRAINT fk_work_record_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
);

-- Ratings table
CREATE TABLE ratings (
  id SERIAL PRIMARY KEY,
  work_record_id INT NOT NULL,
  student_id INT NOT NULL,
  electrician_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_rating_work_record FOREIGN KEY (work_record_id) REFERENCES work_records(id) ON DELETE CASCADE,
  CONSTRAINT fk_rating_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_rating_electrician FOREIGN KEY (electrician_id) REFERENCES electricians(id) ON DELETE CASCADE,
  UNIQUE (work_record_id, student_id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_electricians_rating ON electricians(average_rating);
CREATE INDEX idx_electricians_availability ON electricians(availability_status);
CREATE INDEX idx_hostels_type ON hostels(hostel_type);
CREATE INDEX idx_rooms_hostel ON rooms(hostel_id);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_hostel ON complaints(hostel_id);
CREATE INDEX idx_complaints_student ON complaints(student_id);
CREATE INDEX idx_complaints_created_at ON complaints(created_at);
CREATE INDEX idx_slots_date ON slots(slot_date);
CREATE INDEX idx_slots_electrician ON slots(electrician_id);
CREATE INDEX idx_slots_status ON slots(status);
CREATE INDEX idx_slots_hostel ON slots(hostel_id);
CREATE INDEX idx_slots_electrician_date ON slots(electrician_id, slot_date);
CREATE INDEX idx_work_records_electrician ON work_records(electrician_id);
CREATE INDEX idx_work_records_complaint ON work_records(complaint_id);
CREATE INDEX idx_ratings_electrician ON ratings(electrician_id);
CREATE INDEX idx_ratings_student ON ratings(student_id);