import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import axiosInstance from "./axiosConfig";

const TripDetails = () => {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await axiosInstance.get(`/trips/show/${tripId}`);
        setTrip(response.data);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Unauthorized, navigate to login page
          navigate("/login");
        } else {
          console.error("Error fetching trips:", error);
        }
      }
    };

    fetchTripDetails();
  }, [tripId]);

  if (loading) {
    return <p>Loading trip details...</p>;
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold my-5">{trip.title}</h1>
      <div className="w-full max-w-4xl">
        <div className="w-full gap-10 flex py-10">
          <p className="text-xl black">
            Start Date: <p>{new Date(trip.startDate).toDateString()}</p>
          </p>
          <p className="text-xl black">
            End Date: <p>{new Date(trip.endDate).toDateString()}</p>
          </p>
          <p className="text-xl black">
            Duration: <p>{trip.duration}</p> days
          </p>
          <p className="text-xl black">
            Total Expense: <p>₹{trip.expense}</p>
          </p>
        </div>
        {trip.days.map((day, index) => (
          <div key={index} className="border p-10 mb-4 rounded">
            <div className="w-full flex justify-between">
              <p className="text-xl font-bold">
                Day {index + 1}: {day.name}
              </p>
              <p>Expense: ₹{day.expense}</p>
            </div>

            <h3 className="text-xl font-bold mt-2">Travel Spots</h3>

            {day.travel.map((spot, idx) => (
              <div key={idx} className="ml-4 flex justify-between py-4">
                <div className="flex flex-col items-center">
                  <p>Spot Name:</p>
                  <p className="text-[1.2rem]">{spot.spotName}</p>
                </div>
                <div className="flex flex-col items-center">
                  <p>Time Spent</p>
                  <p className="text-[1.2rem]">{spot.timeToReach}</p>
                </div>
                <div className="flex flex-col items-center">
                  <p>Transport:</p>
                  <p className="text-[1.2rem]"> {spot.transport}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TripDetails;
