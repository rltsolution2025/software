import React, { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";

const UserManagement = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Fetch all users (admin only)
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching users");
    }
  };

  useEffect(() => {
  if (user && user.role === "admin") {
    fetchUsers();
  }
}, [user]);

  // Add user
  const handleAddUser = async () => {
    try {
      await api.post("/users", { username, password });
      setUsername("");
      setPassword("");
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding user");
    }
  };

  // Block/unblock user
  const toggleBlock = async (id) => {
    await api.patch(`/users/block/${id}`);
    fetchUsers();
  };

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    await api.delete(`/users/${id}`);
    fetchUsers();
  };

  if (user.role !== "admin") {
    return <p className="text-danger">Access denied: Admins only</p>;
  }

  return (
    <div className="container mt-5">
      <h2>User Management</h2>

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
        <button onClick={handleAddUser} className="btn btn-success mb-3"  disabled={!user || user.role !== "admin"}>
          Add User
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Blocked</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.username}</td>
              <td>{u.blocked ? "Yes" : "No"}</td>
              <td>
                <button className="btn btn-warning me-2" onClick={() => toggleBlock(u._id)}>
                  {u.blocked ? "Unblock" : "Block"}
                </button>
                <button className="btn btn-danger" onClick={() => deleteUser(u._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
