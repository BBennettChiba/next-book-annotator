import { User } from "@prisma/client";
import React, { useContext, useState, createContext } from "react";
import Navbar from "../components/Navbar";

const UserContext = createContext<ReturnType<typeof useUserController>>({
  user: null,
  setUser: () => {},
});

export const useUser = () => {
  return useContext(UserContext);
};

const useUserController = (propUser: User | null) => {
  const [user, setUser] = useState<null | User>(propUser);
  const value = {
    setUser,
    user,
  };
  return value;
};

export const UserProvider: React.FunctionComponent<{
  children: React.ReactNode;
  user: User | null;
}> = ({ children, user }) => {
  return (
    <UserContext.Provider value={useUserController(user)}>
      <Navbar>{children}</Navbar>
    </UserContext.Provider>
  );
};
