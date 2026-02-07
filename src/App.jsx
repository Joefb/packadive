import { Typography, Card } from "@material-tailwind/react";
import Layout from "./components/Layout";
import UserLoginForm from "./components/UserLoginForm";
import { useAuth } from "./contexts/AuthContext";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from "./pages/Home"
import RegisterUser from "./pages/RegisterUser"

export default function App() {
  const { isAuthenticated, logout, } = useAuth();

  return (

    <BrowserRouter>
      <Layout>
        {/* {isAuthenticated != true && ( */}
        {/*   <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"> */}
        {/*     <div className="bg-white p-8 rounded shadow-lg relative w-1/2 m-10"> */}
        {/*       <UserLoginForm /> */}
        {/*     </div> */}
        {/*   </div> */}
        {/* )} */}
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/register" element={<RegisterUser />} /> */}
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/login" element={<UserLoginForm />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
