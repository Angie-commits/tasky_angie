import { create, type StateCreator } from "zustand";
import { persist } from "zustand/middleware";

type UserProps = {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  avatar: string;
  lastUpdated: string;
  email: string;
};

type UserStoreProps = {
  user: UserProps | null;
  setUser: (user: UserProps) => void;
  logOut: () => void;
};

const userStore: StateCreator<UserStoreProps> = (set) => {
  return {
    user: null,
    setUser: (user: UserProps) => {
      set(() => {
        return { user };
      });
    },
    logOut: () => {
      set(() => {
        return { user: null };
      });
    },
  };
};

const useUser = create(persist(userStore, { name: "tasky-angie" }));

export default useUser;
