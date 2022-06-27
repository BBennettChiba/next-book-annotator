import { useState } from "react";
import PasswordStrengthMeter from "../../components/PasswordStrengthMeter";
import styles from "../../styles/Signup.module.css";
import { useRouter } from "next/router";
import axios, { AxiosError } from "axios";

/**@TODO maybe use axios hook for all axios requests, extract out the form into component */

export default function Login() {
  const [userInfo, setUserInfo] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    confirmEmail: "",
  });

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/user", userInfo, {
        headers: { "Content-Type": "application/json" },
      });
      router.push("/login");
    } catch (e) {
      if (e instanceof AxiosError) {
        console.log(e.response?.status);
        /**@TODO handle errors, form errors from zod or prisma errors, let user know */
      }
    }
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
