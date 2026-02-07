import { Typography, Card } from "@material-tailwind/react";
import Layout from "./components/Layout";
import UserLoginForm from "./components/UserLoginForm";
import { useAuth } from "./contexts/AuthContext";

export default function App() {
  const { isAuthenticated, logout, } = useAuth();

  return (
    <Layout>
      {!isAuthenticated && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded shadow-lg relative w-screen m-10">
            {/* <button */}
            {/*   className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" */}
            {/*   onClick={() => setShowTechForm(false)} */}
            {/* > */}
            {/*   &times; */}
            {/* </button> */}
            <UserLoginForm />
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold">Testing</h1>

    </Layout>
  );
}
