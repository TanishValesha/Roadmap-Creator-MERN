import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { baseURL } from "../utils/constants";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleloginForm = async (e) => {
    e.preventDefault();
    if (email == "" || password == "") {
      toast.error("All field are compulsory!");
    } else {
      try {
        const response = await axios.post(`${baseURL}/api/user/login`, {
          email,
          password,
        });
        console.log(response);
        if (response.data.success) {
          toast.success("Login Successful!");
          localStorage.setItem("token", response.data.token);
          setEmail("");
          setPassword("");
          navigate("/");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Something Went Wrong");
        setEmail("");
        setPassword("");
      }
    }
  };

  const navigate = useNavigate();
  return (
    <form>
      <div className="flex flex-col justify-center items-start h-screen w-80 m-auto">
        <div className="border rounded-2xl p-12 flex flex-col gap-8 ">
          <h1 className="text-left font-bold text-2xl">Welcome Back</h1>
          <div className="flex flex-col justify-center items-start w-80 gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>
          <div className="flex flex-col justify-center items-start w-80 gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <Button className="w-full" onClick={handleloginForm}>
              Login
            </Button>
            <div>
              <p>Don't have and account</p>
              <Link to={"/register"} className="underline">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Login;
