
import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'
import { useState } from 'react'
import Logo from '../assets/images/RevoLogo.png'

const Signuppage = () => {
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [userType, setUserType] = useState("admin")
  const navigate = useNavigate()

  // signup
  const signupSubmit = async (userDetails) => {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    })

    if (res.ok) {
      toast.success(`Signup successful`)
      return navigate("/")
    } else {
      toast.error(`Please check the input data`)
      return navigate("/sign-up")
    }
  }

  const submitForm = (e) => {
    e.preventDefault()
    const userDetails = {
      userName,
      password,
      email,
      userType
    }

    signupSubmit(userDetails)
  }

  return (
    <div className="bg-gradient-to-r from-cyan-800 via-teal-600 to-emerald-900 min-h-screen  flex items-center justify-center">
      <form onSubmit={submitForm} className="w-full max-w-md  backdrop-blur-sm  bg-white/20 rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center mb-6">
          
          <h1 className="text-2xl font-bold text-gray-800">Create an Account</h1>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
            <span id="passwordError" className="text-red-500 text-sm"></span>
          </div>
          <div>
            <label htmlFor="usertype" className="block text-gray-700 mb-2">Select User Type</label>
            <select
              id="userType"
              name="userType"
              className="border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white py-2 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500">Sign Up</button>
        </div>
        <div className="mt-6 text-center">
          <span className="text-gray-600 text-sm">Already have an account?</span>
          <Link to="/login" className="text-sky-600 hover:underline ml-1 text-sm">Log In</Link>
        </div>
      </form>
    </div>
  )
}

export default Signuppage







