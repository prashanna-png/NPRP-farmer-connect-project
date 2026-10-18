import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
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
  FaUsers,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";
import api from "../api/axios";

function AdminDashboard() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await api.get("/queries/expert");
        setQuestions(data.queries || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load dashboard information.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const pendingCount = questions.filter((q) => q.status === "pending").length;

  const assignedCount = questions.filter((q) => q.status === "assigned").length;

  const answeredCount = questions.filter((q) => q.status === "answered").length;

  const closedCount = questions.filter((q) => q.status === "closed").length;

  const stats = [
    {
      label: "Total Questions",
      count: questions.length,
      icon: <FaClipboardList />,
    },
    {
      label: "Awaiting Assignment",
      count: pendingCount,
      icon: <FaClock />,
    },
    {
      label: "Assigned",
      count: assignedCount,
      icon: <FaUsers />,
    },
    {
      label: "Answered",
      count: answeredCount,
      icon: <FaCheckCircle />,
    },
  ];

  return (
    <Container className="py-5">
      <div className="mb-4">
        <p className="text-success fw-semibold mb-2">NPRP FARMER CONNECT</p>
        <h1 className="h2 fw-bold">Admin Dashboard</h1>
        <p className="text-secondary">
          Manage farmer questions and coordinate NPRP experts.
        </p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="success" />
          <p className="text-secondary mt-3">Loading dashboard...</p>
        </div>
      ) : (
        <>
          <Row className="g-3 mb-4">
            {stats.map((stat) => (
              <Col xs={12} sm={6} xl={3} key={stat.label}>
                <Card className="border-0 shadow-sm rounded-4 h-100">
                  <Card.Body className="p-4">
                    <div className="text-success fs-4 mb-3">{stat.icon}</div>
                    <h2 className="h3 fw-bold">{stat.count}</h2>
                    <p className="text-secondary mb-0">{stat.label}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <Card className="border-0 shadow-sm rounded-4 mb-4">
            <Card.Body className="p-4">
              <h2 className="h5 fw-bold">Question Assignment</h2>
              <p className="text-secondary">
                Review new farmer submissions and assign each question to an
                appropriate NPRP expert.
              </p>
              <Button as={Link} to="/admin/questions" variant="success">
                Manage Questions
                <FaArrowRight className="ms-2" />
              </Button>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm rounded-4">
            <Card.Body className="p-4">
              <h2 className="h5 fw-bold">Expert Management</h2>
              <p className="text-secondary">
                View the available expert accounts before assigning questions.
              </p>
              <Button as={Link} to="/admin/experts" variant="outline-success">
                Manage Experts
                <FaArrowRight className="ms-2" />
              </Button>
            </Card.Body>
          </Card>

          <p className="text-secondary small mt-3">
            Closed questions: {closedCount}
          </p>
        </>
      )}
    </Container>
  );
}

export default AdminDashboard;
