import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import logo from "../assets/images/logo.jpg";
import axios from "axios";
import axiosInstance from "./axiosConfig";
import { ImCross } from "react-icons/im";
const App = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const handleLogout = async () => {
    try {
      const response = await axiosInstance.get(
        "http://localhost:3000/auth/logout"
      );

      if (response.status === 200) {
        navigate("/"); // Redirect to the home page after successful logout
      } else {
        alert("Logout failed"); // Handle other response statuses (e.g., 401)
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Logout failed");
    }
  };
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get("http://localhost:3000/trips/show", {
          withCredentials: true,
        });

        if (response.data) {
          setTrips(response.data);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Unauthorized, navigate to login page
          navigate("/login");
        } else {
          console.error("Error fetching trips:", error);
        }
      }
    };

    fetchTrips();
  }, []);

  const handleNewTripClick = () => {
    navigate("createTrip"); // Navigate to the '/createTrip' route
  };

  const handleDeleteTrip = async (tripId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this trip?"
    );
    if (confirmDelete) {
      try {
        const response = await axiosInstance.delete(
          `http://localhost:3000/trips/delete/${tripId}`
        );

        if (response.status === 200) {
          // Remove the deleted trip from the trips state
          const updatedTrips = trips.filter((trip) => trip._id !== tripId);
          setTrips(updatedTrips);
        } else {
          alert("Failed to delete trip");
        }
      } catch (error) {
        console.error("Error deleting trip:", error);
        alert("Failed to delete trip");
      }
    }
  };
  return (
    <div>
      <div className="h-[15vh] w-[100%] flex justify-between items-center p-10">
        <img src={logo} width="90" height="100" />
        <h1 className="text-[3rem] font-semibold">Local Wanderer</h1>

        <p
          className="rounded-2xl  hover:underline underline-offset-8 text-[1.5rem] cursor-pointer"
          onClick={handleLogout}
        >
          Logout 👋
        </p>
      </div>
      <div className="flex width-[100vw] justify-center py-[2rem]">
        <p className="text-[2rem]">Welcome Back! Fellow Traveller 😎</p>
      </div>
      <div className="w-full flex justify-center">
        <Link to={`community`} className="text-blue-500">
          <p className="text-[1.5rem] font-semibold underline underline-offset-4 pb-5">
            Checkout other Local Wanderers 😁🙌
          </p>
        </Link>
      </div>
      <div className="w-full flex justify-center">
        <Link to={`trips/search`} className="text-blue-500">
          <p className="text-[1.5rem] font-semibold underline underline-offset-4 pb-5">
            Search for Trips 🔍
          </p>
        </Link>
      </div>
      <div className="flex justify-center w-[100vw]">
        <div className="flex flex-col justify-center items-center">
          <p className="text-[3rem] font-semibold underline underline-offset-4 pb-5">
            Your Trips ✈️
          </p>
          <button
            className="bg-green-400 text-[1.5rem] font-bold py-[1rem] px-[2rem] rounded-xl hover:bg-green-500"
            onClick={handleNewTripClick}
          >
            + New Trip
          </button>
          <div className="flex flex-row flex-wrap gap-[2rem] py-10">
            {trips.map((trip) => (
              <div className="flex flex-row px-[3rem] py-[3rem] border border-black gap-10 rounded-xl">
                <div className="flex flex-col">
                  <Link
                    to={`/trip/${trip._id}`} // Navigate to the trip details page
                    className="text-[2.5rem] font-semibold hover:underline underline-offset-8 cursor-pointer"
                  >
                    {trip.title}
                  </Link>
                  <p className="text-[1.2rem]">
                    From:{" "}
                    {new Date(trip.startDate).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                  <p className="text-[1.2rem]">
                    To:{" "}
                    {new Date(trip.endDate).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                  <p className="text-[1.5rem]">
                    Duration:
                    <p className="font-bold text-[1.2rem] pl-2 pr-2">
                      {trip.duration} Days{" "}
                    </p>
                  </p>
                  <Link
                    to={`/trip/${trip._id}`} // Navigate to the trip details page
                    className="text-[2.5rem] font-semibold hover:underline underline-offset-8 cursor-pointer"
                  >
                    <button className="bg-green-400 text-[1.2rem] font-bold py-[0.8rem] px-[1rem] rounded-xl hover:bg-green-500">
                      Edit Trip
                    </button>
                  </Link>
                </div>
                <ImCross
                  className="cursor-pointer"
                  onClick={() => handleDeleteTrip(trip._id)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
