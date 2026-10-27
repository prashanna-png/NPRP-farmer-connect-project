import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Spinner,
  Alert,
  Modal,
  Button,
} from "react-bootstrap";
import {
  FaBullhorn,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTimes,
} from "react-icons/fa";

const API_URL = "http://localhost:5000/api/notices";

function NoticesPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedNotice, setSelectedNotice] = useState(null);

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

  const getLocation = (location) => {
    if (!location) return null;

    if (typeof location === "string") return location;

    return [
      location.district,
      location.municipality,
      location.ward ? `Ward ${location.ward}` : null,
    ]
      .filter(Boolean)
      .join(", ");
  };

  return (
    <main className="notices-page">
      <section className="notices-page-hero">
        <Container>
          <span className="section-eyebrow">NPRP FARMER CONNECT</span>
          <h1>Notices & Agricultural Updates</h1>
          <p>
            Explore potato research updates, farming advisories, training
            opportunities, and announcements from NPRP.
          </p>
        </Container>
      </section>

      <section className="notices-list-section">
        <Container>
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
            <div>
              <h2>Latest Notices</h2>
            </div>

            {!loading && !error && (
              <Badge bg="success" pill>
                {notices.length} {notices.length === 1 ? "notice" : "notices"}
              </Badge>
            )}
          </div>

          {loading && (
            <div className="text-center py-5">
              <Spinner animation="border" variant="success" />
              <p className="text-muted mt-3">Loading notices...</p>
            </div>
          )}

          {error && !loading && <Alert variant="danger">{error}</Alert>}

          {!loading && !error && notices.length === 0 && (
            <div className="notice-empty-state text-center">
              <FaBullhorn />
              <h3>No notices available yet</h3>
              <p>
                NPRP notices and agricultural updates will appear here when they
                are published.
              </p>
            </div>
          )}

          {!loading && !error && notices.length > 0 && (
            <Row className="g-4">
              {notices.map((notice) => (
                <Col md={6} lg={4} key={notice._id}>
                  <Card
                    className="notice-card h-100"
                    onClick={() => setSelectedNotice(notice)}
                    style={{ cursor: "pointer" }}
                  >
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

                      <Card.Text>
                        {notice.content?.length > 130
                          ? `${notice.content.slice(0, 130)}...`
                          : notice.content}
                      </Card.Text>

                      <div className="notice-meta mt-auto">
                        {formatDate(notice.trainingDate) && (
                          <div>
                            <FaCalendarAlt />
                            <span>
                              Training: {formatDate(notice.trainingDate)}
                            </span>
                          </div>
                        )}

                        {getLocation(notice.location) && (
                          <div>
                            <FaMapMarkerAlt />
                            <span>{getLocation(notice.location)}</span>
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

                      <div className="mt-3 text-success fw-semibold">
                        View full details →
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>

      <Modal
        show={Boolean(selectedNotice)}
        onHide={() => setSelectedNotice(null)}
        centered
        size="lg"
        scrollable
      >
        {selectedNotice && (
          <>
            <Modal.Header closeButton className="border-0 pb-0">
              <Badge bg="success">{selectedNotice.category || "General"}</Badge>
            </Modal.Header>

            {selectedNotice.imageUrl && (
              <div className="px-3 pt-3">
                <img
                  src={selectedNotice.imageUrl}
                  alt={selectedNotice.title}
                  className="w-100 rounded"
                  style={{
                    maxHeight: "420px",
                    objectFit: "contain",
                    backgroundColor: "#f5f5f5",
                  }}
                />
              </div>
            )}

            <Modal.Body className="p-4">
              <h2 className="h3 fw-bold mb-3">{selectedNotice.title}</h2>

              <div className="notice-meta d-flex flex-column gap-2 mb-4">
                {formatDate(selectedNotice.createdAt) && (
                  <div>
                    <FaCalendarAlt />
                    <span>
                      Published: {formatDate(selectedNotice.createdAt)}
                    </span>
                  </div>
                )}

                {formatDate(selectedNotice.trainingDate) && (
                  <div>
                    <FaCalendarAlt />
                    <span>
                      Training date: {formatDate(selectedNotice.trainingDate)}
                    </span>
                  </div>
                )}

                {getLocation(selectedNotice.location) && (
                  <div>
                    <FaMapMarkerAlt />
                    <span>{getLocation(selectedNotice.location)}</span>
                  </div>
                )}
              </div>

              <hr />

              <h3 className="h5 fw-bold mb-3">Notice Details</h3>

              <div
                style={{
                  whiteSpace: "pre-wrap",
                  overflowWrap: "anywhere",
                  lineHeight: 1.8,
                }}
              >
                {selectedNotice.content || "No additional details provided."}
              </div>
            </Modal.Body>

            <Modal.Footer className="border-0">
              <Button variant="success" onClick={() => setSelectedNotice(null)}>
                <FaTimes className="me-2" />
                Close
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </main>
  );
}

export default NoticesPage;
