import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";
import AdminProductList from "./components/subCompo/AdminProductList"; // Admin-specific pages
import UserProductList from "./components/subCompo/UserProductList"; // User-specific pages
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS globally

function App() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role"); // Get the role from local storage
  const isLoggedIn = localStorage.getItem("token"); // Assuming token is stored in localStorage

  useEffect(() => {
    if (isLoggedIn) {
      if (role === "admin") {
        navigate("/admin-dashboard"); // Redirect to admin dashboard if logged in as admin
      } else if (role === "user") {
        navigate("/user-dashboard"); // Redirect to user dashboard if logged in as user
      }
    } else {
      navigate("/login"); // Redirect to login page if not logged in
    }
  }, [isLoggedIn, role, navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {role === "admin" ? (
        <>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-products" element={<AdminProductList />} />
        </>
      ) : (
        <>
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/user-products" element={<UserProductList />} />
        </>
      )}
    </Routes>
  );
}

export default App;
