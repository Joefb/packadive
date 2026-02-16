import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const RegisterUser = () => {
  const { registerUser } = useAuth();
  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await registerUser(formData.email, formData.password, formData.user_name);

      setSuccess("Registration successful!");
      setFormData({
        user_name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Register User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="user_name"
          placeholder="user_name"
          value={formData.user_name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterUser;

