import { useState } from "react";

export default function Login() {
  const [userInfo, setUserInfo] = useState({
    username: "",
    password: "",
    email: "",
  });

    return (
    <div>
      Login!!!
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log("submit");
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
        <label>
          Email
          <input
            required
            type="email"
            id="email"
            onChange={(e) =>
              setUserInfo({ ...userInfo, email: e.target.value })
            }
          />
        </label>
        <input value="submit" type="submit" />
      </form>
    </div>
  );
}
