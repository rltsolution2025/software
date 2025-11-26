import React, { useEffect, useState } from "react";
import api from "../../services/api"; // ✅ use centralized API

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // -----------------------------
  // Add User
  // -----------------------------
  const handleAddUser = async () => {
    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    try {
      await api.post("/api/users", { username, password }); // ✅ Updated

      setUsername("");
      setPassword("");
      fetchUsers();
      alert("User added successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Error adding user");
    }
  };

  // -----------------------------
  // Fetch Users
  // -----------------------------
  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/users"); // ✅ Updated
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // -----------------------------
  // Delete User
  // -----------------------------
  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await api.delete(`/api/users/${userId}`); // ✅ Updated
      setUsers(users.filter((u) => u._id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // -----------------------------
  // Block / Unblock User
  // -----------------------------
  const blockUser = async (userId) => {
    try {
      await api.put(`/api/users/block/${userId}`); // ✅ Updated

      setUsers(
        users.map((u) =>
          u._id === userId ? { ...u, blocked: !u.blocked } : u
        )
      );
    } catch (err) {
      console.error("Error blocking/unblocking user:", err);
    }
  };

  return (
    <div className="container mt-5">
      <h2>User Management</h2>

      {/* Add User */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="form-control mb-2"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control mb-2"
        />

        <button onClick={handleAddUser} className="btn btn-success mb-3">
          Add User
        </button>
      </div>

      {/* User List */}
      <div>
        <h4>Existing Users</h4>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Blocked</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>{user.blocked ? "Yes" : "No"}</td>

                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => blockUser(user._id)}
                  >
                    {user.blocked ? "Unblock" : "Block"}
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteUser(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default UserManagement;
