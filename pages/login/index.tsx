import { useState } from "react";
import { useUser } from "../../hooks/customHooks";
import Router from "next/router";
import axios, { AxiosError } from "axios";
import { User } from "@prisma/client";

export default function Login() {
  const [userInfo, setUserInfo] = useState({
    username: "",
    password: "",
    email: "",
  });
  const { setUser } = useUser();

  const handleLogin = async () => {
    const response = await fetch("/api/login", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(userInfo),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const user = await response.json();
    try {
      const user: User = await axios.post("/api/login", userInfo, {
        headers: { "Content-Type": "application/json" },
      });
      setUser(user);
      Router.push("/");
    } catch (e) {
      if (e instanceof AxiosError) {
        console.log(e.response?.status);
        /**@TODO handle errors, form errors from zod or prisma errors, let user know */
      }
    }
  };

  return (
    <div>
      Login!!!
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <label>
          Username
          <input
            required
            type="text"
            id="username"
            onChange={(e) =>
              setUserInfo({ ...userInfo, username: e.target.value })
            }
          />
        </label>
        <label>
          Password
          <input
            required
            type="password"
            id="password"
            onChange={(e) => {
              setUserInfo({ ...userInfo, password: e.target.value });
            }}
          />
        </label>
        <input value="submit" type="submit" />
      </form>
    </div>
  );
}
