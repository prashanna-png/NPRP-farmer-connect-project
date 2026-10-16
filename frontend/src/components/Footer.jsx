
import { Container } from "react-bootstrap";
import { FaLeaf } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <Container>
        <div className="footer-brand">
          <FaLeaf />
          <span>NPRP Farmer Connect</span>
        </div>

        <p className="footer-description">
          Connecting farmers with agricultural research,
          practical knowledge, and expert support.
        </p>

        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/notices">Notices</Link>
          <Link to="/login">Login</Link>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} NPRP Farmer Connect
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
