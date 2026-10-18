import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner,
} from "react-bootstrap";
import {
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaArrowRight,
  FaComments,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import api from "../api/axios";

function ExpertDashboard() {
  const userInfo = useSelector((state) => state.auth.userInfo);

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await api.get("/queries/expert");

        const items = Array.isArray(data) ? data : data.queries || [];

        setQuestions(items);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load questions. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const assignedCount = questions.filter((q) => q.status === "assigned").length;

  const answeredCount = questions.filter((q) => q.status === "answered").length;

  const closedCount = questions.filter((q) => q.status === "closed").length;

  const stats = [
    {
      label: "Assigned questions",
      count: assignedCount,
      icon: <FaClipboardList />,
    },
    {
      label: "Answered",
      count: answeredCount,
      icon: <FaCheckCircle />,
    },
    {
      label: "Closed",
      count: closedCount,
      icon: <FaClock />,
    },
  ];

  const getStatusVariant = (status) => {
    switch (status) {
      case "answered":
        return "success";
      case "assigned":
        return "primary";
      case "closed":
        return "secondary";
      default:
        return "warning";
    }
  };

  return (
    <Container className="py-5">
      <div className="mb-4">
        <p className="text-success fw-semibold mb-2">NPRP FARMER CONNECT</p>

        <h1 className="h2 fw-bold">Welcome, {userInfo?.name || "Expert"}</h1>

        <p className="text-secondary">
          Review farmer questions, provide research-based guidance, and help
          improve agricultural communication.
        </p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="g-3 mb-5">
        {stats.map((stat) => (
          <Col md={4} key={stat.label}>
            <Card className="h-100 border-0 shadow-sm rounded-4">
              <Card.Body className="p-4">
                <div className="text-success fs-4 mb-3">{stat.icon}</div>

                <h2 className="h3 fw-bold">{loading ? "—" : stat.count}</h2>

                <p className="text-secondary mb-0">{stat.label}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
        <div>
          <h2 className="h4 fw-bold mb-1">Recent Questions</h2>
          <p className="text-secondary mb-0">
            Farmer submissions available for review.
          </p>
        </div>

        <Button as={Link} to="/expert/questions" variant="success">
          View All Questions <FaArrowRight className="ms-2" />
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="success" />
          <p className="text-secondary mt-3">Loading questions...</p>
        </div>
      ) : questions.length === 0 ? (
        <Card className="border-0 shadow-sm rounded-4">
          <Card.Body className="text-center p-5">
            <FaComments className="fs-1 text-success mb-3" />

            <h3 className="h5 fw-bold">No questions available</h3>

            <p className="text-secondary mb-0">
              Farmer questions will appear here when they are available to your
              account.
            </p>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-3">
          {[...questions]
            .sort(
              (a, b) =>
                new Date(b.updatedAt || b.createdAt) -
                new Date(a.updatedAt || a.createdAt),
            )
            .slice(0, 5)
            .map((question) => (
              <Col xs={12} key={question._id}>
                <Card className="border-0 shadow-sm rounded-4">
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                      <div>
                        <Badge bg="light" text="dark" className="mb-2">
                          {question.category}
                        </Badge>

                        <h3 className="h5 fw-bold">{question.title}</h3>

                        <p className="text-secondary mb-2">
                          {question.location?.district ||
                            "Location not provided"}
                          {question.location?.municipality
                            ? `, ${question.location.municipality}`
                            : ""}
                        </p>

                        <p className="mb-0 small text-secondary">
                          Submitted{" "}
                          {question.createdAt
                            ? new Date(question.createdAt).toLocaleDateString()
                            : "Unknown"}
                        </p>
                      </div>

                      <div className="text-end">
                        <Badge bg={getStatusVariant(question.status)}>
                          {question.status}
                        </Badge>

                        <div className="mt-3">
                          <Button
                            as={Link}
                            to={`/expert/questions/${question._id}`}
                            variant="outline-success"
                            size="sm"
                          >
                            Review <FaArrowRight className="ms-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>
      )}
    </Container>
  );
}

export default ExpertDashboard;
