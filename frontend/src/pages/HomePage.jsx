import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import {
  FaSeedling,
  FaBullhorn,
  FaArrowRight,
  FaLeaf,
  FaBug,
  FaFlask,
} from "react-icons/fa";

const services = [
  {
    icon: <FaBug />,
    title: "Potato Disease & Pest Support",
    description:
      "Ask agricultural experts about potato diseases, pests, symptoms, and possible management practices.",
  },
  {
    icon: <FaSeedling />,
    title: "Potato Seeds & Varieties",
    description:
      "Learn about potato varieties, quality seed selection, and seed production information.",
  },
  {
    icon: <FaFlask />,
    title: "Cultivation & Soil Guidance",
    description:
      "Explore guidance on soil conditions, nutrient management, and potato cultivation practices.",
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
                  Potato Research & Farmer Support
                </span>

                <h1>
                  Better Potato Farming Starts with{" "}
                  <span>Better Knowledge.</span>
                </h1>

                <p className="hero-description">
                  Connect with agricultural experts, get support for potato
                  farming problems, explore cultivation information, and stay
                  updated on training and notices from NPRP.
                </p>

                <div className="d-flex flex-wrap gap-3 mt-4">
                  <Button as={Link} to="/register" variant="success" size="lg">
                    Ask for Support <FaArrowRight className="ms-2" />
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
                  Helping connect potato farmers with agricultural knowledge
                </div>
              </div>
            </Col>

            <Col lg={6}>
              <div className="hero-visual">
                <img
                  src="https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1200&q=85"
                  alt="Potatoes representing potato farming and agriculture"
                  className="hero-image"
                />

                <div className="hero-image-label">
                  <FaSeedling />
                  <div>
                    <strong>Supporting Potato Farmers</strong>
                    <span>Research. Guidance. Connection.</span>
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
            <span className="section-eyebrow">FARMER SUPPORT</span>
            <h2>Support for Your Potato Farming Questions</h2>
            <p>
              Find relevant information and connect with experts when you need
              help with potato production.
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
                      Get support <FaArrowRight className="ms-2" />
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
              <span className="section-eyebrow">NPRP UPDATES</span>
              <h2>Potato Research, Training & Notices</h2>
              <p>
                Stay informed about potato farming advisories, training
                opportunities, research updates, and official announcements
                published by NPRP.
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
              Published NPRP notices will appear here when the notices API is
              connected.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}

export default HomePage;
