
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Loginpage = () => {

      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const navigate = useNavigate();

    const loginSubmit = async (e) => {
      e.preventDefault();
      const loginDetails = {
        email,
        password,
      };


          const res= await fetch("api/login",{
            method : "POST",
            headers: {
                  "Content-Type": "application/json",
            },
            body: JSON.stringify(loginDetails),

          });

          console.log(res,"login res from /login");
          if(res.ok){
            const data=await res.json();
            console.log(data);
            const userType= data.userType;
            if(data.userType === 'user'){
              toast.success(`Logged in as : ${userType}`);
              return navigate("/user-home");
            }
            else if(data.userType === 'admin'){
              toast.success(`Logged in as : ${userType}`);
              return navigate("/admin-home");
            }
          }else {
            toast.error(`Please check your credentials`);
            return navigate("/");
          }
          
    }
  return (
    <>
      
      <div className='bg-gradient-to-r from-cyan-800 via-teal-600 to-emerald-900 min-h-screen flex items-center justify-center'>
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md backdrop-blur-sm bg-white/40">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 italic">Revo</h2>
          <h1 className="text-2xl font-bold mt-4 text-gray-800">Log In</h1>
        </div>
        <form onSubmit={loginSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
            <span id="passwordError" className="text-red-500 text-sm"></span>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white py-2 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            Log In
          </button>
          <div className="text-center text-xs mt-6">
            <span className="text-gray-600">New to Revo?</span>
            <a href="/sign-up" className="text-sky-600 hover:underline ml-1">Get Started</a>
            <div className="mt-4">
              <a href="/" className="text-sky-600 hover:underline">Go Back</a>
            </div>
          </div>
        </form>
      </div>
    </div>


    </>
  )
}

const getUserType = () => {
    const authToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("Authtoken"))
      ?.split("=")[1];
    console.log("documemnt.cookie vslue", authToken);
  
    const decoded = jwtDecode(authToken);
    console.log("decoded", decoded);
    const userType = decoded.userType;
    console.log("usertype", userType);
    return userType;
};
  
const getUserEmail = () => {
  const authToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("Authtoken"))
      ?.split("=")[1];
  console.log("document.cookie value", authToken);

  const decoded = jwtDecode(authToken);
  console.log("decoded", decoded);
  const userEmail = decoded.userEmail;
  console.log("useremail", userEmail);
  return userEmail;
};


export {Loginpage as default, getUserType,getUserEmail};