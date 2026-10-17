import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container, Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import {
  FaLeaf,
  FaTachometerAlt,
  FaComments,
  FaBullhorn,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

import api from "../api/axios";
import { clearCredentials } from "../slices/authSlice";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.auth.userInfo);

  const [loggingOut, setLoggingOut] = useState(false);

  const homeLink = userInfo?.role === "farmer" ? "/farmer/dashboard" : "/";

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      dispatch(clearCredentials());
      setLoggingOut(false);
      navigate("/", { replace: true });
    }
  };

  return (
    <Navbar expand="lg" bg="white" className="border-bottom py-3">
      <Container>
        <Navbar.Brand
          as={Link}
          to={homeLink}
          className="fw-bold text-success d-flex align-items-center gap-2"
        >
          <FaLeaf />
          NPRP Farmer Connect
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-lg-center gap-lg-2">
            {userInfo?.role === "farmer" ? (
              <>
                <Nav.Link as={Link} to="/farmer/dashboard">
                  <FaTachometerAlt className="me-1" />
                  Dashboard
                </Nav.Link>

                <Nav.Link as={Link} to="/my-queries">
                  <FaComments className="me-1" />
                  My Questions
                </Nav.Link>

                <Nav.Link as={Link} to="/notices">
                  <FaBullhorn className="me-1" />
                  Notices & Training
                </Nav.Link>

                <NavDropdown
                  title={
                    <>
                      <FaUser className="me-1" />
                      {userInfo.name}
                    </>
                  }
                  id="farmer-account-menu"
                  align="end"
                >
                  <NavDropdown.Item as={Link} to="/profile">
                    My Profile
                  </NavDropdown.Item>

                  <NavDropdown.Divider />

                  <NavDropdown.Item
                    onClick={handleLogout}
                    disabled={loggingOut}
                  >
                    <FaSignOutAlt className="me-2" />
                    {loggingOut ? "Logging out..." : "Logout"}
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/">
                  Home
                </Nav.Link>

                <Nav.Link as={Link} to="/notices">
                  Notices & Training
                </Nav.Link>

                <Button
                  as={Link}
                  to="/login"
                  variant="outline-success"
                  className="ms-lg-2"
                >
                  Login
                </Button>

                <Button
                  as={Link}
                  to="/register"
                  variant="success"
                  className="ms-lg-2"
                >
                  Register
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
