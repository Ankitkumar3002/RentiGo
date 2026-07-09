import { useState, useEffect } from "react";
import { adminAPI } from "../../services/api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState("");

  const load = () => {
    const params = filterRole ? { role: filterRole } : {};
    adminAPI.getUsers(params).then(({ data }) => setUsers(data.data)).catch(console.error);
  };

  useEffect(() => { load(); }, [filterRole]);

  const handleStatus = async (id, status) => {
    await adminAPI.updateUserStatus(id, { status });
    setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, status } : u)));
  };

  return (
    <div className="user-management-page">
      <h1>User management</h1>

      <div className="filter-row">
        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
          <option value="">All roles</option>
          <option value="customer">Customer</option>
          <option value="agency">Agency</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <table className="data-table">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td><span className={`badge badge-role-${u.role}`}>{u.role}</span></td>
              <td><span className={`badge badge-${u.status}`}>{u.status}</span></td>
              <td>
                {u.status === "active" ? (
                  <button className="btn-outline small" onClick={() => handleStatus(u._id, "suspended")}>Suspend</button>
                ) : (
                  <button className="btn-primary small" onClick={() => handleStatus(u._id, "active")}>Restore</button>
                )}
                <button className="btn-danger small" onClick={() => handleStatus(u._id, "banned")}>Ban</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
