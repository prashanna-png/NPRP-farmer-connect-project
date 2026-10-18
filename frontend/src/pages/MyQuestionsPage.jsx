import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { FaComments, FaPlus, FaArrowRight } from "react-icons/fa";
import api from "../api/axios";

function MyQuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await api.get("/queries/my-queries");
        setQuestions(data.queries || data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Could not load your questions. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

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
      <Row className="align-items-center mb-4 g-3">
        <Col>
          <h1 className="h2 fw-bold mb-2">My Questions</h1>
          <p className="text-secondary mb-0">
            Track your agricultural questions and replies from NPRP experts.
          </p>
        </Col>
        <Col xs="auto">
          <Button as={Link} to="/ask-expert" variant="success">
            <FaPlus className="me-2" />
            Ask an Expert
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="success" />
          <p className="text-secondary mt-3">Loading your questions...</p>
        </div>
      ) : questions.length === 0 ? (
        <Card className="border-0 shadow-sm rounded-4 text-center p-5">
          <Card.Body>
            <FaComments className="fs-1 text-success mb-3" />
            <h2 className="h5 fw-bold">No questions yet</h2>
            <p className="text-secondary">
              Have a question about potato diseases, seeds, or cultivation?
              Submit it to an NPRP expert.
            </p>
            <Button as={Link} to="/ask-expert" variant="success">
              Ask Your First Question
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {questions.map((question) => (
            <Col md={6} lg={4} key={question._id}>
              <Card className="h-100 border-0 shadow-sm rounded-4">
                <Card.Body className="p-4 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                    <Badge bg="light" text="dark">
                      {question.category}
                    </Badge>
                    <Badge bg={getStatusVariant(question.status)}>
                      {question.status}
                    </Badge>
                  </div>

                  <h2 className="h5 fw-bold">{question.title}</h2>

                  <p className="text-secondary flex-grow-1">
                    {question.description.length > 140
                      ? `${question.description.slice(0, 140)}...`
                      : question.description}
                  </p>

                  <div className="small text-secondary mb-3">
                    <div>
                      Location: {question.location?.district || "Not provided"}
                    </div>
                    <div>
                      Submitted:{" "}
                      {new Date(question.createdAt).toLocaleDateString()}
                    </div>
                    <div>Replies: {question.messages?.length || 0}</div>
                  </div>

                  <Button
                    as={Link}
                    to={`/my-queries/${question._id}`}
                    variant="outline-success"
                    className="mt-auto"
                  >
                    View Conversation <FaArrowRight className="ms-2" />
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default MyQuestionsPage;
