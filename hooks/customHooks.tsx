import { User } from "@prisma/client";
import React, { useContext, useState, createContext } from "react";
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
  console.log("usercontexuser", user);
  return (
    <UserContext.Provider value={useUserController(user)}>
      {children}
    </UserContext.Provider>
  );
};
