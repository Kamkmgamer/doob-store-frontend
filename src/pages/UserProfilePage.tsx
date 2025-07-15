import React from 'react';
import { useAuth } from '../contexts/AuthContext'; // Import our auth hook

const UserProfilePage: React.FC = () => {
  const { user } = useAuth(); // Get the logged-in user object from context

  // This page is expected to be wrapped by ProtectedRoute,
  // so `user` should theoretically never be null here,
  // but it's good practice to handle it defensively.
  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl text-gray-700">User data not found. Please log in.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-2xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
          Welcome, <span className="text-blue-600">{user.username}</span>!
        </h2>
        <p className="text-lg text-gray-700 mb-4">
          This is your personal profile page.
        </p>

        <div className="text-left bg-gray-50 p-6 rounded-md shadow-inner">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">Your Details:</h3>
          <p className="text-lg text-gray-800 mb-2">
            <strong className="text-gray-900">Username:</strong> {user.username}
          </p>
          <p className="text-lg text-gray-800 mb-2">
            <strong className="text-gray-900">User ID:</strong> {user.id}
          </p>
          {/* Add more mock details here if you want */}
          <p className="text-lg text-gray-800">
            <strong className="text-gray-900">Account Status:</strong> Active
          </p>
          {/* Example of adding mock email */}
          {/* <p className="text-lg text-gray-800">
            <strong className="text-gray-900">Email:</strong> {user.username}@example.com
          </p> */}
        </div>

        <p className="text-md text-gray-500 mt-6">
          (In a real application, you might find options to edit profile, view order history, etc., here.)
        </p>
      </div>
    </div>
  );
};

export default UserProfilePage;