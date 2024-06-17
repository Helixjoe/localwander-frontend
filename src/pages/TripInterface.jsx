import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "./axiosConfig";
import { ImCross } from "react-icons/im";

const TripInterface = () => {
  const { tripid } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [updatedTrip, setUpdatedTrip] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await axiosInstance.get(`/trips/show/${tripid}`);
        setTrip(response.data);
        setUpdatedTrip(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trip:", error);
      }
    };

    fetchTrip();

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [tripid]);

  const handleChange = (e, index, travelIndex = null) => {
    const { name, value } = e.target;

    if (name === "startDate" || name === "endDate") {
      setUpdatedTrip({ ...updatedTrip, [name]: value });
    } else if (name === "name" || name === "expense") {
      const updatedDays = [...updatedTrip.days];
      updatedDays[index][name] = value;
      setUpdatedTrip({ ...updatedTrip, days: updatedDays });
    } else if (
      name === "spotName" ||
      name === "timeToReach" ||
      name === "transport"
    ) {
      const updatedDays = [...updatedTrip.days];
      if (!updatedDays[index].travel) {
        updatedDays[index].travel = [
          { spotName: "", timeToReach: "", transport: "" },
        ];
      }
      updatedDays[index].travel[travelIndex][name] = value;
      setUpdatedTrip({ ...updatedTrip, days: updatedDays });
    }
    setIsDirty(true);
  };

  const handleAddDay = () => {
    setUpdatedTrip({
      ...updatedTrip,
      days: [
        ...updatedTrip.days,
        {
          name: "",
          expense: 0,
          travel: [{ spotName: "", timeToReach: "", transport: "" }],
        },
      ],
    });
    setIsDirty(true);
  };

  const handleRemoveDay = (index) => {
    const updatedDays = [...updatedTrip.days];
    updatedDays.splice(index, 1);
    setUpdatedTrip({ ...updatedTrip, days: updatedDays });
    setIsDirty(true);
  };

  const handleAddTravel = (index) => {
    const updatedDays = [...updatedTrip.days];
    updatedDays[index].travel.push({
      spotName: "",
      timeToReach: "",
      transport: "",
    });
    setUpdatedTrip({ ...updatedTrip, days: updatedDays });
    setIsDirty(true);
  };

  const handleRemoveTravel = (index, travelIndex) => {
    const updatedDays = [...updatedTrip.days];
    updatedDays[index].travel.splice(travelIndex, 1);
    setUpdatedTrip({ ...updatedTrip, days: updatedDays });
    setIsDirty(true);
  };

  const handleUpdateTrip = async () => {
    try {
      await axiosInstance.put(`/trips/edit/${tripid}`, updatedTrip);
      navigate("/app");
    } catch (error) {
      console.error("Error updating trip:", error);
      if (error.response && error.response.status === 400) {
        const overlappingTrips = error.response.data.overlappingTrips;
        const overlappingDetails = overlappingTrips
          .map((trip) => `${trip.title}`)
          .join("\n");
        alert(`This trip is overlapping with \n${overlappingDetails}`);
      } else {
        alert("Failed to update trip. Please try again.");
      }
    }
  };

  const handleBeforeUnload = (e) => {
    if (isDirty) {
      e.preventDefault();
      e.returnValue = "";
    }
  };

  const handleLeavePage = () => {
    if (isDirty) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Please click on 'Update Trip' to save your changes before leaving. Are you sure you want to leave without saving?"
      );
      if (!confirmLeave) {
        return;
      }
    }
    navigate("/app");
  };

  if (loading) {
    return <p>Loading trip data...</p>;
  }

  return (
    <div>
      {trip ? (
        <div className="flex flex-col">
          <div className="w-[100vw] flex text-[2rem] justify-center items-center py-5">
            <div className="flex items-center justify-start w-[30%]">
              <p className="text-[2rem]">Trip Name :</p>
              <input
                type="text"
                name="title"
                value={updatedTrip.title}
                onChange={(e) =>
                  setUpdatedTrip({ ...updatedTrip, title: e.target.value })
                }
                className="w-[50%]"
              />
            </div>
            <div className="flex items-center justify-between mr-10">
              <div className="flex items-center">
                <p>Start Date:</p>
                <input
                  type="date"
                  name="startDate"
                  value={updatedTrip.startDate.split("T")[0]}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center">
                <p>End Date:</p>
                <input
                  type="date"
                  name="endDate"
                  value={updatedTrip.endDate.split("T")[0]}
                  onChange={handleChange}
                />
              </div>
              <p>Duration: {updatedTrip.duration} Days</p>
            </div>
            <button
              onClick={handleUpdateTrip}
              className="bg-green-400  hover:bg-green-500 p-4 rounded-xl"
            >
              Update Trip
            </button>
          </div>
          <div className="flex flex-col justify-center items-center gap-10">
            <h2 className="text-[3rem]">Itinerary 🧳</h2>
            {updatedTrip.days.map((day, index) => (
              <div
                key={index}
                className="flex flex-col items-start border-black border-solid border-2 rounded-xl py-5 px-20"
              >
                <div className="flex justify-between gap-[5rem] w-full">
                  <p className="text-[3rem]">Day {index + 1}</p>
                  <button onClick={() => handleRemoveDay(index)}>
                    <ImCross className="decoration-red-500" />
                  </button>
                </div>
                <input
                  type="text"
                  name="name"
                  value={day.name || ""}
                  onChange={(e) => handleChange(e, index)}
                  placeholder="Name of Day"
                  className="text-[2rem]"
                />
                <div className="flex items-center">
                  <label className="pr-5">Expense</label>
                  <p className="pr-2 text-[1.3rem]">₹</p>
                  <input
                    type="number"
                    name="expense"
                    value={day.expense || ""}
                    onChange={(e) => handleChange(e, index)}
                    placeholder="Expense"
                    className="text-[1.5rem]"
                  />
                </div>

                {day.travel.map((travel, travelIndex) => (
                  <div
                    key={travelIndex}
                    className="flex justify-center items-center p-10 text-[2rem]"
                  >
                    <div className="gap-5 flex items-center pr-10">
                      <label>Location</label>
                      <input
                        type="text"
                        name="spotName"
                        value={travel.spotName || ""}
                        onChange={(e) => handleChange(e, index, travelIndex)}
                        placeholder="Spot Name"
                        className="w-full"
                      />
                    </div>
                    <div className="gap-5 flex items-center pl-10">
                      <label>Time Spent (Hrs)</label>
                      <input
                        type="text"
                        name="timeToReach"
                        value={travel.timeToReach || ""}
                        onChange={(e) => handleChange(e, index, travelIndex)}
                        placeholder="Hrs"
                        className="w-[15%]"
                      />
                    </div>
                    <div className="gap-5 flex items-center">
                      <label className="text-[1.2rem]">Transport</label>
                      <input
                        type="text"
                        name="transport"
                        value={travel.transport || ""}
                        onChange={(e) => handleChange(e, index, travelIndex)}
                        placeholder="Transport"
                        className="w-[30%]"
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveTravel(index, travelIndex)}
                    >
                      X
                    </button>
                  </div>
                ))}
                <div className="w-full flex justify-center">
                  <button
                    className="bg-green-500 p-4 rounded-xl"
                    onClick={() => handleAddTravel(index)}
                  >
                    Add Spot
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={handleAddDay}
              className="bg-green-400  hover:bg-green-500 p-4 rounded-xl"
            >
              Add Day
            </button>
          </div>
          <button
            onClick={handleLeavePage}
            className="bg-red-500 p-4 rounded-xl"
          >
            Leave Page
          </button>
        </div>
      ) : (
        <p>Loading trip data...</p>
      )}
    </div>
  );
};

export default TripInterface;