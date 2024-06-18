import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "./axiosConfig";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/users/all");
        console.log(response.data);
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <p>Loading users...</p>;
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold my-5">Other Local Wanderers</h1>
      <div className="w-full max-w-4xl">
        {users.map((user) => (
          <div
            key={user._id}
            className="border p-4 mb-4 rounded flex justify-between w-full"
          >
            <p className="text-xl">
              {user.email} - Trips Planned: {user.trips.length}
            </p>
            <Link to={`users/${user._id}`} className="text-blue-500">
              View Trips
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllUsers;
