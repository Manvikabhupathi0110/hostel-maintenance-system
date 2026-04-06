import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import MyComplaints from './pages/MyComplaints';
import NewComplaint from './pages/NewComplaint';
import ComplaintDetail from './pages/ComplaintDetail';
import MySlots from './pages/MySlots';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* student routes */}
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/complaints" element={<MyComplaints />} />
        <Route path="/new-complaint" element={<NewComplaint />} />
        <Route path="/complaint/:id" element={<ComplaintDetail />} />
        <Route path="/my-slots" element={<MySlots />} />

        <Route path="*" element={<div style={{ padding: 24 }}>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}