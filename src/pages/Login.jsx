import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import loginBg from "../assets/images/login.jpg";
import { Link } from "react-router-dom";
import axiosInstance from "./axiosConfig";
const imageUrl = "../assets/images/login.png";
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post(
        "http://localhost:3000/auth/login",
        {
          username,
          password,
        }
      );
      if (response.data.message === "Login successful") {
        // Redirect to the app page upon successful login
        navigate("/app");
      }
    } catch (error) {
      console.error(error);
      alert("Invalid Password or Email");
    }
  };

  return (
    <div className="flex items-center h-[100vh] bg-white">
      <img
        src={loginBg}
        className="h-[80vh] inset-0 bg-cover bg-center ml-[15rem]"
      />
      <div className="flex justify-center items-center w-[50%] bg-white">
        <div className="flex flex-col items-center gap-[3rem]">
          <div className="flex flex-col gap-2 items-center">
            <h2 className="text-[35px] font-semibold border-b-2 border-blue-500 px-5">
              Login
            </h2>
            <h2 className="font-semibold text-[20px]">
              Welcome back you've been missed!
            </h2>
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="pl-1">Email Address</label>
                <input
                  type="text"
                  placeholder="Enter Email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className=" py-4 pl-5 pr-[10rem] rounded-xl bg-gray-100 text-[20px]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="pl-1">Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className=" py-4 pl-5 pr-10 rounded-xl bg-gray-100 text-[20px]"
                />
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Link to="/register">
                <h1 className="underline underline-offset-4 font-semibold text-gray-500 hover:text-black">
                  Create a new Account ?
                </h1>
              </Link>
              <button
                onClick={handleLogin}
                className="text-[20px] font-bold bg-red-500 rounded-xl text-white py-2 px-12 hover:text-red-500 hover:bg-white border-red-500 border-2"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
