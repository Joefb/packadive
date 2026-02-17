import { useState } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useList } from "../contexts/ListContext";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { stats } = useList();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ email });
      setMessage('Email updated successfully.');
      setEmail('');
    } catch (err) {
      setMessage('Failed to update email.');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      await updateUser({ password });
      setMessage('Password updated successfully.');
      setPassword('');
    } catch (err) {
      setMessage('Failed to update password.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Profile for {user?.user_name}</h2>
      <p className="mb-6 text-gray-700">
        <strong className="font-semibold">Username:</strong> {user?.user_name}
      </p>
      <p className="mb-6 text-gray-700">
        <strong className="font-semibold">Email:</strong> {user?.email}
      </p>
      <div className="mb-6 p-4 bg-gray-100 rounded">
        Total Items Packed: <span className="font-semibold">{stats.packedItems}</span><br />
        Total Items: <span className="font-semibold">{stats.totalItems}</span><br />
        Total Lists: <span className="font-semibold">{stats.totalLists}</span>
      </div>

      <form onSubmit={handleEmailUpdate} className="mb-6">
        <label className="block mb-2 text-gray-700 font-semibold">
          Email:
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
          />
        </label>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors font-semibold mt-2"
        >
          Update Email
        </button>
      </form>
      <form onSubmit={handlePasswordUpdate} className="mb-4">
        <label className="block mb-2 text-gray-700 font-semibold">
          New Password:
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
          />
        </label>
        <label className="block mb-2 text-gray-700 font-semibold">
          Confirm New Password:
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
          />
        </label>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors font-semibold mt-2"
        >
          Update Password
        </button>
      </form>
      {message && (
        <p className="text-center text-sm text-red-600 font-medium">{message}</p>
      )}
    </div>

  );
};

export default Profile;
