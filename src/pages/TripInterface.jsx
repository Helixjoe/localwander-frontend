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
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await axiosInstance.get(`/trips/show/${tripid}`);
        setTrip(response.data);
        setUpdatedTrip(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trip:", error);
        setError("Error fetching trip data. Please try again.");
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
    // Reset error state
    setError("");
    try {
      await axiosInstance.put(`/trips/edit/${tripid}`, updatedTrip);
      navigate("/app");
    } catch (error) {
      // Handle error
      console.error("Error updating trip:", error);
      if (error.response) {
        if (error.response.status === 400) {
          // If 400 error, display detailed error message
          setError(error.response.data.error);
        } else if (error.response.status === 404) {
          setError("Trip not found.");
        } else {
          setError("Failed to update trip. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
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

  const handleShareTrip = () => {
    const shareableLink = `${window.location.origin}/app/trips/${tripid}`;

    navigator.clipboard
      .writeText(shareableLink)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 3000); // Reset the copied state after 3 seconds
      })
      .catch((error) => {
        console.error("Failed to copy shareable link:", error);
      });
  };

  if (loading) {
    return <p>Loading trip data...</p>;
  }

  return (
    <div>
      {trip ? (
        <div className="flex flex-col">
          <div className="w-[100vw] flex flex-col text-[2rem] justify-center items-center py-5">
            <div className="flex items-center justify-center w-full pb-5">
              <input
                type="text"
                name="title"
                value={updatedTrip.title}
                onChange={(e) =>
                  setUpdatedTrip({ ...updatedTrip, title: e.target.value })
                }
                className="w-[30%] text-center"
              />
            </div>
            <div className="flex items-center mr-10 justify-around w-full pb-5">
              <div className="flex items-center">
                <p className="text-[1.3rem] font-semibold">Start Date:</p>
                <input
                  type="date"
                  name="startDate"
                  value={updatedTrip.startDate.split("T")[0]}
                  onChange={handleChange}
                  className="text-[1.4rem]"
                />
              </div>
              <div className="flex items-center">
                <p className="text-[1.3rem] font-semibold">End Date:</p>
                <input
                  type="date"
                  name="endDate"
                  value={updatedTrip.endDate.split("T")[0]}
                  onChange={handleChange}
                  className="text-[1.4rem]"
                />
              </div>
              <div className="flex gap-5 items-center">
                <p className="text-[1.3rem] font-semibold">Duration: </p>
                <p className="text-[1.3rem]">{updatedTrip.duration} Days</p>
              </div>
              <div className="flex gap-5 items-center">
                <p className="text-[1.4rem] font-semibold">Total Expense: </p>
                <p className="text-[1.7rem] font-medium">₹{trip.expense}</p>
              </div>
              <div className="flex items-center gap-10">
                <p className="pr-2 font-semibold text-[1.4rem]">
                  Private Trip:
                </p>
                <div>
                  <input
                    type="radio"
                    name="privateTrip"
                    value={true}
                    checked={updatedTrip.privateTrip === true}
                    onChange={(e) =>
                      setUpdatedTrip({
                        ...updatedTrip,
                        privateTrip: e.target.value === "true",
                      })
                    }
                  />
                  <label className="pl-2">Yes</label>
                </div>
                <div>
                  <input
                    type="radio"
                    name="privateTrip"
                    value={false}
                    checked={updatedTrip.privateTrip === false}
                    onChange={(e) =>
                      setUpdatedTrip({
                        ...updatedTrip,
                        privateTrip: e.target.value === "true",
                      })
                    }
                  />
                  <label className="pl-2">No</label>
                </div>
              </div>
            </div>
            {error && (
              <p
                style={{ color: "red" }}
                className="pt-5 text-[1.5rem] font-medium pb-5"
              >
                {error}
              </p>
            )}
            <div className="flex gap-10">
              <button
                onClick={handleUpdateTrip}
                className="bg-green-400  hover:bg-green-500 px-5 py-3 rounded-xl text-[1.5rem]"
              >
                Update Trip
              </button>
              <button
                onClick={handleShareTrip}
                className="bg-blue-400  hover:bg-blue-500 px-5 rounded-xl text-[1.5rem]"
              >
                {copied ? "Link Copied!" : "Share Trip"}
              </button>
              <button
                onClick={handleLeavePage}
                className="bg-red-500 px-5 rounded-xl text-[1.5rem]"
              >
                Leave Page
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-center items-center gap-10">
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
                    <div className="gap-2 flex items-center pl-10">
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
                    <div className="gap-2 flex items-center">
                      <label className="text-[1.2rem]">Transport</label>
                      <input
                        type="text"
                        name="transport"
                        value={travel.transport || ""}
                        onChange={(e) => handleChange(e, index, travelIndex)}
                        placeholder="Transport"
                        className="w-[50%]"
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
        </div>
      ) : (
        <p>Loading trip data...</p>
      )}
    </div>
  );
};

export default TripInterface;
