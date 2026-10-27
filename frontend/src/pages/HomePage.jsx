import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Badge,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useEffect, useState } from "react";

import {
  FaSeedling,
  FaBullhorn,
  FaArrowRight,
  FaLeaf,
  FaBug,
  FaFlask,
} from "react-icons/fa";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

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
const API_URL = "http://localhost:5000/api/notices";

function HomePage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Unable to load notices. Please try again later.");
        }

        const data = await response.json();

        const noticeList = Array.isArray(data)
          ? data
          : (data.notices ?? data.data ?? []);

        setNotices(noticeList);
      } catch (err) {
        setError(err.message || "Something went wrong while loading notices.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);
  const formatDate = (date) => {
    if (!date) return null;

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return null;

    return parsedDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

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

          <div className="notice-placeholder mt-4 d-flex flex-column">
            {/* Wrapped in a Fragment to group them as one flex item */}
            <>
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4 w-100">
                <div>
                  <h2 className="mb-0 d-flex align-items-center gap-2">
                    <FaBullhorn /> Latest Notices
                  </h2>
                </div>

                {!loading && !error && (
                  <Badge bg="success" pill>
                    {notices.length}{" "}
                    {notices.length === 1 ? "notice" : "notices"}
                  </Badge>
                )}
              </div>

              {loading && (
                <div className="text-center py-5 w-100">
                  <Spinner animation="border" variant="success" />
                  <p className="text-muted mt-3">Loading notices...</p>
                </div>
              )}

              {error && !loading && (
                <Alert variant="danger" className="w-100">
                  {error}
                </Alert>
              )}

              {!loading && !error && notices.length === 0 && (
                <div className="notice-empty-state text-center w-100">
                  <FaBullhorn />
                  <h3>No notices available yet</h3>
                  <p>
                    NPRP notices and agricultural updates will appear here when
                    they are published.
                  </p>
                </div>
              )}

              {!loading && !error && notices.length > 0 && (
                <Row className="g-4 w-100">
                  {notices.map((notice) => (
                    <Col md={6} lg={4} key={notice._id}>
                      <Card className="notice-card h-100">
                        {notice.imageUrl && (
                          <Card.Img
                            variant="top"
                            src={notice.imageUrl}
                            alt={notice.title}
                          />
                        )}

                        <Card.Body className="d-flex flex-column">
                          <div className="mb-3">
                            <Badge bg="success" className="notice-category">
                              {notice.category || "General"}
                            </Badge>
                          </div>

                          <Card.Title>{notice.title}</Card.Title>
                          <Card.Text>{notice.content}</Card.Text>

                          <div className="notice-meta mt-auto">
                            {formatDate(notice.trainingDate) && (
                              <div>
                                <FaCalendarAlt />
                                <span>
                                  Training: {formatDate(notice.trainingDate)}
                                </span>
                              </div>
                            )}

                            {notice.location && (
                              <div>
                                <FaMapMarkerAlt />
                                <span>
                                  {typeof notice.location === "string"
                                    ? notice.location
                                    : [
                                        notice.location.district,
                                        notice.location.municipality,
                                      ]
                                        .filter(Boolean)
                                        .join(", ")}
                                </span>
                              </div>
                            )}

                            {formatDate(notice.createdAt) && (
                              <div>
                                <FaCalendarAlt />
                                <span>
                                  Published: {formatDate(notice.createdAt)}
                                </span>
                              </div>
                            )}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </>
          </div>
        </Container>
      </section>
    </>
  );
}

export default HomePage;
