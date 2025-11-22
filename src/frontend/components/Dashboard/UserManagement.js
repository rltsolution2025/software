import React, { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";

const UserManagement = () => {
  const { user } = useContext(AuthContext); // user object with token
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleAddUser = async () => {
    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }
    try {
      await api.post( 
        "http://localhost:5000/api/users",
        { username, password },
        // { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setUsername("");
      setPassword("");
      // fetchUsers();
      alert("User added successfully");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error adding user");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try{
        const res = await api.get("http://localhost:5000/api/users", {
          // headers: { Authorization: `Bearer ${user.token}` },
        });
        setUsers(res.data || []);
      }
      catch(err){
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);


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
        <button
          onClick={handleAddUser}
          className="btn btn-success mb-3"
        >
          Add User
        </button>
      <div>
        <h4>Existing Users</h4>
        <table className="table table-bordered">
          <thead> 
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Blocked</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>{user.blocked ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      </div>
    </div>
  );
};

export default UserManagement;
