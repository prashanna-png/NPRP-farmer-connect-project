import { useEffect } from "react";
import { useDispatch } from "react-redux";

import api from "../api/axios";
import { setCredentials, clearCredentials } from "../slices/authSlice";

function SessionLoader({ children }) {
  const displatch = useDispatch();

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data } = await api.get("/auth/me");
        displatch(setCredentials(data.user));
      } catch {
        displatch(clearCredentials());
      }
    };
    restoreSession();
  }, [displatch]);

  return children;
}

export default SessionLoader;
