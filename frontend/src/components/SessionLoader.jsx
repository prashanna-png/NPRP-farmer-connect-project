import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Spinner } from "react-bootstrap";

import api from "../api/axios";
import { setCredentials, clearCredentials } from "../slices/authSlice";

function SessionLoader({ children }) {
  const dispatch = useDispatch();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data } = await api.get("/auth/me");
        dispatch(setCredentials(data.user));
      } catch {
        dispatch(clearCredentials());
      } finally {
        setCheckingSession(false);
      }
    };

    restoreSession();
  }, [dispatch]);

  if (checkingSession) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  return children;
}

export default SessionLoader;
