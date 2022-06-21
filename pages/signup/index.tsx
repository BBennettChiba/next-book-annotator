import { useState } from "react";
import zxcvbn from "zxcvbn";

export default function Login() {
  const [userInfo, setUserInfo] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [passwordFeedback, setPasswordFeedback] =
    useState<zxcvbn.ZXCVBNResult>();

  const checkPassword = (pass: string) => {
    const evaluation = zxcvbn(userInfo.password);
    console.log(evaluation);
    setPasswordFeedback(evaluation);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(userInfo),
    }).then((res) => console.log(res));
  };

  return (
    <div>
      signup
      <form onSubmit={handleSubmit}>
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
              checkPassword(e.target.value);
            }}
          />
        </label>
        <label>
          Re-enter password
          <input required type="password" id="password" />
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
      {passwordFeedback && (
        <div>
          <div>score {passwordFeedback.score}</div>
          <div>warning: {passwordFeedback.feedback.warning}</div>
          <div>suggestions: {passwordFeedback.feedback.suggestions}</div>
        </div>
      )}
    </div>
  );
}
