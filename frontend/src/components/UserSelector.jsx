
import React from "react";

const UserSelector = ({ users, setSelectedUser }) => {
  return (
    <select
      onChange={(e) => setSelectedUser(e.target.value)}
      aria-label="Select User"
      className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
    >
      <option value="">Select User</option>
      {users.map((user) => (
        <option key={user.id} value={user.id}>
          {user.name}
        </option>
      ))}
    </select>
  );
};

export default UserSelector;