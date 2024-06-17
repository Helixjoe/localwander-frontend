import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import signupBg from '../assets/images/signup.jpg'
import axiosInstance from './axiosConfig';
const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleRegister = async () => {
        try {
            const response = await axiosInstance.post('http://localhost:3000/auth/register', {
                email,
                password,
            });
            if (response.data.message === 'User registered successfully') {
                navigate('/login');
            }
        } catch (error) {
            console.error(error);
        }
    };


    return (

        <div className='flex justify-center items-center w-full h-[100vh] bg-white'>
         <img src = {signupBg}
        className="h-[80vh] bg-cover bg-center mr-[5rem]"
        />
            <div className='flex flex-col items-center gap-[2rem] bg-white'>
                <h2 className='text-[35px] font-semibold border-b-2 border-blue-500 px-5'>Sign Up</h2>
                <div className='flex flex-col gap-5'>
                    <div className='flex gap-5'>
                        <div className='flex flex-col gap-2'>
                            <label className='pl-1'>First Name</label>
                            <input
                                type="text"
                                placeholder="First Name"
                                className=' py-4 pl-5 pr-[2rem] rounded-xl bg-gray-100 text-[20px]'
                            />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label className='pl-1'>Last Name</label>
                            <input
                                type="text"
                                placeholder="Last Name"
                                className=' py-4 pl-5 pr-[2rem] rounded-xl bg-gray-100 text-[20px]'
                            />
                        </div>
                    </div>

                    <div className='flex flex-col gap-5'>
                        <div className='flex flex-col gap-2'>
                            <label className='pl-1'>Email Address</label>
                            <input
                                type="text"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className=' py-4 pl-5 pr-[10rem] rounded-xl bg-gray-100 text-[20px]'
                            />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label className='pl-1'>Password</label>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className=' py-4 pl-5 pr-10 rounded-xl bg-gray-100 text-[20px]'
                            />
                        </div>
                    </div>
                    <div className='flex flex-col items-center gap-5 mt-5'>
                        <Link to='/login'><h1 className='underline underline-offset-4 font-semibold text-gray-500 hover:text-black'>Already Have an account ?</h1></Link>
                        <button onClick={handleRegister} className='text-[20px] font-bold bg-red-500 rounded-xl text-white py-2 px-12 hover:text-red-500 hover:bg-white border-red-500 border-2'>Signup</button>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Register;
