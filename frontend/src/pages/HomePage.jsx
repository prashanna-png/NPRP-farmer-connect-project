import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import {
  FaSeedling,
  FaComments,
  FaBullhorn,
  FaArrowRight,
  FaLeaf,
  FaBookOpen,
} from "react-icons/fa";

const services = [
  {
    icon: <FaComments />,
    title: "Ask an Agricultural Expert",
    description:
      "Get help with potato diseases, seed selection, soil conditions, and cultivation problems.",
  },
  {
    icon: <FaBullhorn />,
    title: "Agricultural Notices",
    description:
      "Stay informed about training programs, research updates, and important announcements.",
  },
  {
    icon: <FaBookOpen />,
    title: "Farming Knowledge",
    description:
      "Access practical agricultural information to support better farming decisions.",
  },
];

function HomePage() {
  return (
    <>
      <section className="hero-section">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <div className="hero-content">
                <span className="hero-tag">
                  <FaLeaf className="me-2" />
                  Agricultural Knowledge & Support
                </span>

                <h1>
                  Better Farming Starts with <span>Better Knowledge.</span>
                </h1>

                <p className="hero-description">
                  Connect with agricultural experts, explore research-based
                  farming information, and stay updated on training and
                  agricultural notices through NPRP Farmer Connect.
                </p>

                <div className="d-flex flex-wrap gap-3 mt-4">
                  <Button as={Link} to="/register" variant="success" size="lg">
                    Get Started <FaArrowRight className="ms-2" />
                  </Button>

                  <Button
                    as={Link}
                    to="/notices"
                    variant="outline-success"
                    size="lg"
                  >
                    Explore Notices
                  </Button>
                </div>

                <div className="hero-note">
                  <FaSeedling className="me-2" />
                  Supporting farmers with accessible agricultural information
                </div>
              </div>
            </Col>

            <Col lg={6}>
              <div className="hero-visual">
                <img
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=85"
                  alt="Green agricultural fields and farmland"
                  className="hero-image"
                />

                <div className="hero-image-label">
                  <FaSeedling />
                  <div>
                    <strong>Knowledge for Farmers</strong>
                    <span>Information. Guidance. Connection.</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="services-section" id="about">
        <Container>
          <div className="section-heading text-center">
            <span className="section-eyebrow">WHAT WE OFFER</span>
            <h2>A Better Connection to Agricultural Support</h2>
            <p>
              Find useful information and get support for your agricultural
              questions in one place.
            </p>
          </div>

          <Row className="g-4 mt-3">
            {services.map((service) => (
              <Col md={6} lg={4} key={service.title}>
                <Card className="service-card h-100">
                  <Card.Body>
                    <div className="service-icon">{service.icon}</div>

                    <Card.Title>{service.title}</Card.Title>

                    <Card.Text>{service.description}</Card.Text>

                    <Link to="/register" className="service-link">
                      Learn more <FaArrowRight className="ms-2" />
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="notices-section">
        <Container>
          <Row className="align-items-center g-4">
            <Col lg={8}>
              <span className="section-eyebrow">STAY INFORMED</span>
              <h2>Latest Agricultural Notices & Training</h2>
              <p>
                Discover announcements, training opportunities, and agricultural
                advisories published by the NPRP team.
              </p>
            </Col>

            <Col lg={4} className="text-lg-end">
              <Button as={Link} to="/notices" variant="success" size="lg">
                View All Notices <FaArrowRight className="ms-2" />
              </Button>
            </Col>
          </Row>

          <div className="notice-placeholder mt-4">
            <FaBullhorn />
            <p>
              Published notices will appear here when we connect the frontend to
              the backend.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}

export default HomePage;
