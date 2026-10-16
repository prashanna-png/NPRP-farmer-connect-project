import { Link, NavLink } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { FaLeaf } from "react-icons/fa";

function Header() {
  return (
    <Navbar expand="lg" className="site-header sticky-top py-3">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand">
          <FaLeaf className="brand-icon me-2" />
          NPRP <strong className="ms-1">Farmer Connect</strong>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          <Nav className="mx-auto nav-links">
            <Nav.Link as={NavLink} to="/" end>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/notices">
              Notices
            </Nav.Link>
            <Nav.Link href="/#about">About</Nav.Link>
            <Nav.Link href="/#contact">Contact</Nav.Link>
          </Nav>

          <div className="d-flex gap-2 mt-3 mt-lg-0">
            <Button as={Link} to="/login" variant="outline-success">
              Login
            </Button>

            <Button as={Link} to="/register" variant="success">
              Get Started
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
