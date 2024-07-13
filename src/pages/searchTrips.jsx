import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "./axiosConfig";

const SearchTrips = () => {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllTrips = async () => {
      try {
        const response = await axiosInstance.get("/trips/all");
        console.log("Fetched trips:", response.data);
        setTrips(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching all trips:", error);
      }
    };

    fetchAllTrips();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  useEffect(() => {
    const filteredTrips = trips.reduce((acc, trip) => {
      const matchingSpots = trip.days.reduce((spotsAcc, day) => {
        const matchingDaySpots = day.travel.filter((spot) =>
          spot.spotName.toLowerCase().includes(searchTerm)
        );
        return [...spotsAcc, ...matchingDaySpots];
      }, []);

      if (matchingSpots.length > 0) {
        acc.push({ ...trip, matchingSpots });
      }
      return acc;
    }, []);

    console.log("Filtered trips:", filteredTrips);
    setFilteredTrips(filteredTrips);
  }, [trips, searchTerm]);

  if (loading) {
    return <p>Loading all trips...</p>;
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold my-5">Search Trips</h1>
      <input
        type="text"
        placeholder="Search Trips by Spot Name"
        value={searchTerm}
        onChange={handleSearchChange}
        className="border rounded py-2 px-4 w-full mb-4"
      />
      <div className="w-full max-w-4xl">
        {searchTerm === "" ? (
          trips.map((trip) => (
            <div
              key={trip._id}
              className="border p-4 mb-4 rounded flex justify-between items-center"
            >
              <p className="text-xl text-center">{trip.title}</p>
              <Link
                to={`/app/trips/${trip._id}`}
                className="text-blue-500 ml-auto"
              >
                View Trip Details
              </Link>
            </div>
          ))
        ) : filteredTrips.length === 0 ? (
          <p>No trips found for "{searchTerm}"</p>
        ) : (
          filteredTrips.map((trip) => (
            <div key={trip._id} className="border p-4 mb-4 rounded">
              <p className="text-xl font-bold text-center">{trip.title}</p>
              {trip.matchingSpots.map((spot) => (
                <div key={spot._id} className="pl-4">
                  <p className="text-lg">
                    Spot Name:{" "}
                    <span className="text-red-500">{spot.spotName}</span>
                  </p>
                </div>
              ))}
              <div className="flex justify-end">
                <Link to={`/app/trips/${trip._id}`} className="text-blue-500">
                  View Trip Details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchTrips;
