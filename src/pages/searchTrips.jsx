import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "./axiosConfig";

const SearchTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllTrips = async () => {
      try {
        const response = await axiosInstance.get("/trips/all");
        setTrips(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching all trips:", error);
      }
    };

    fetchAllTrips();
  }, []);

  if (loading) {
    return <p>Loading all trips...</p>;
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold my-5">All Trips</h1>
      <div className="w-full max-w-4xl">
        {trips.length === 0 ? (
          <p>No Trips</p>
        ) : (
          trips.map((trip) => (
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

export default SearchTrips;
