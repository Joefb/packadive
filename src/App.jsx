import { Typography, Card } from "@material-tailwind/react";
import Layout from "./components/Layout";
import UserLogin from "./pages/UserLogin";
import { useAuth } from "./contexts/AuthContext";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from "./pages/Home"
import RegisterUser from "./pages/RegisterUser"
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const { isAuthenticated, logout, } = useAuth();

  return (

    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
