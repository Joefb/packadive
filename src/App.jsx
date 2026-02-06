import { Typography, Card } from "@material-tailwind/react";
import Layout from "./components/Layout";
import { useAuth } from "./contexts/AuthContext";

export default function App() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold">Testing</h1>
    </Layout>
  );
}
