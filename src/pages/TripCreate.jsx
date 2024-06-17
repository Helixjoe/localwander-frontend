import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LuBaggageClaim } from "react-icons/lu";
const CreateTrip = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const privateTrip = true;
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error state
    setError("");
    setLoading(true);

    try {
      // Make API request to create a new trip
      const response = await axios.post(
        "http://localhost:3000/trips/create",
        {
          title,
          location,
          startDate,
          endDate,
          privateTrip,
        },
        { withCredentials: true }
      );

      // Handle success
      console.log("Trip created:", response.data);
      alert("Trip created successfully");
      navigate("/app");
      // Reset form fields
      setTitle("");
      setLocation("");
      setStartDate("");
      setEndDate("");
    } catch (error) {
      // Handle error
      console.error("Error creating trip:", error);
      if (error.response && error.response.status === 400) {
        // If 400 error, display overlapping trip details in the error message
        const overlappingTrips = error.response.data.overlappingTrips;
        const overlappingDetails = overlappingTrips
          .map((trip) => `${trip.title}`)
          .join("\n");
        setError(`This trip is overlapping with \n${overlappingDetails}`);
      } else {
        setError("Failed to create trip. Please try again.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="w-[100vw] flex flex-col p-[2rem] justify-center items-center">
      <h2 className="text-[3rem] underline underline-offset-8 pb-10 flex items-center gap-2">
        New Trip <LuBaggageClaim />
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div className="flex gap-5 justify-center items-center">
          <label className="text-[2rem]">Trip Name :</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="text-[2rem] font-bold bg-gray-200 p-[1rem] rounded-xl"
          />
        </div>
        <div className="flex flex-col items-center pt-10">
          {" "}
          <label className="p-[2rem] text-[1.5rem]">
            Start Date :
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="text-[2rem] pl-5"
            />
          </label>
          <label className="p-[2rem] text-[1.5rem]">
            End Date :
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="text-[2rem] pl-5"
            />
          </label>
        </div>

        <button
          className="bg-green-400 mt-10 py-5 px-2 rounded-lg w-[30%] text-[1.5rem] font-bold hover:bg-green-500"
          type="submit"
          disabled={loading}
        >
          Create Trip
        </button>
        {error && (
          <p
            style={{ color: "red" }}
            className="pt-5 text-[1.5rem] font-medium"
          >
            {error}
          </p>
        )}
      </form>
    </div>
  );
};

export default CreateTrip;
