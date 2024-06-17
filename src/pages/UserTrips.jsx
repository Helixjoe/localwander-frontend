import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "./axiosConfig";

const UserTrips = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserTrips = async () => {
      try {
        const response = await axiosInstance.get(`/users/${userId}`);
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user trips:", error);
      }
    };

    fetchUserTrips();
  }, [userId]);

  if (loading) {
    return <p>Loading user trips...</p>;
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold my-5">Trips</h1>
      <div className="w-full max-w-4xl">
        {user.length == 0 ? (
          <p>No Trips</p>
        ) : (
          user.map((trip) => (
            <div
              key={trip._id}
              className="border p-4 mb-4 rounded flex justify-between w-full"
            >
              <p className="text-xl">{trip.title}</p>
              <Link to={`/app/trips/${trip._id}`} className="text-blue-500">
                View Trip Details
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserTrips;
