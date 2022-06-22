import { useState } from "react";
import PasswordStrengthMeter from "../../components/PasswordStrengthMeter";
import styles from "../../styles/Signup.module.css";
export default function Login() {
  const [userInfo, setUserInfo] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    confirmEmail: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch("/api/user", {
      method: "POST",
      body: JSON.stringify(userInfo),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => console.log(res));
  };

  return (
    <div className={styles.body}>
      signup
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          <h3>Username </h3>
          <input
            className={styles.input}
            required
            type="text"
            id="username"
            onChange={(e) =>
              setUserInfo({ ...userInfo, username: e.target.value })
            }
          />
        </label>
        <label className={styles.label}>
          <h3> Password </h3>
          <input
            className={styles.input}
            required
            type="password"
            id="password"
            onChange={(e) =>
              setUserInfo({ ...userInfo, password: e.target.value })
            }
          />
        </label>
        <label className={styles.label}>
          <h3> Confirm password</h3>
          <input
            required
            className={styles.input}
            type="password"
            id="confirmPassword"
            onChange={(e) =>
              setUserInfo({ ...userInfo, confirmPassword: e.target.value })
            }
          />
        </label>
        <label className={styles.label}>
          <h3>Email</h3>
          <input
            className={styles.input}
            required
            type="email"
            id="email"
            onChange={(e) =>
              setUserInfo({ ...userInfo, email: e.target.value })
            }
          />
        </label>
        <label className={styles.label}>
          <h3>Confirm Email</h3>
          <input
            className={styles.input}
            required
            type="email"
            id="confirmEmail"
            onChange={(e) =>
              setUserInfo({ ...userInfo, confirmEmail: e.target.value })
            }
          />
        </label>

        <input value="submit" type="submit" />
      </form>
      <PasswordStrengthMeter password={userInfo.password} />
    </div>
  );
}
