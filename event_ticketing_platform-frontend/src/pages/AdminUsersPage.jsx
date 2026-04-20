import React, { useEffect, useState } from "react";
import PageHero from "../components/ui/PageHero";
import { fetchAllUsers, updateUserRole } from "../services/userService";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (err) {
      alert(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (id, role) => {
    try {
      await updateUserRole(id, role);
      await loadUsers();
    } catch (err) {
      alert(err.message || "Failed to update role");
    }
  };

  return (
    <>
      <PageHero title="User Roles" subtitle="Manage user and admin access" />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        {loading ? (
          <div className="rounded-[24px] bg-white p-8 text-center shadow-lg">
            Loading users...
          </div>
        ) : (
          <div className="rounded-[28px] bg-white p-4 shadow-lg sm:p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm sm:text-base">
                <thead>
                  <tr className="border-b text-slate-500">
                    <th className="py-3 pr-4">Name</th>
                    <th className="py-3 pr-4">Email</th>
                    <th className="py-3 pr-4">Role</th>
                    <th className="py-3 pr-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="py-4 pr-4 font-semibold">{user.name}</td>
                      <td className="py-4 pr-4">{user.email}</td>
                      <td className="py-4 pr-4">{user.role}</td>
                      <td className="py-4 pr-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="rounded-lg border border-slate-300 px-3 py-2"
                        >
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </>
  );
}