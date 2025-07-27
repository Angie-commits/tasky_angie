import { BASE_URL } from "../constant";
import { useQuery } from "@tanstack/react-query";
import useUser from "../store/userStore";
import { useEffect } from "react";

export async function fetchUser() {
  const response = await fetch(`${BASE_URL}/user`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.user;
}

export function useUserQuery() {
  const { setUser } = useUser();

  const query = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      setUser(query.data);
    }
  }, [query.isSuccess, query.data, setUser]);

  return query;
}
