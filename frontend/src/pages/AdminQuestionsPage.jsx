/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import { FaClipboardList, FaUserCheck, FaSyncAlt } from "react-icons/fa";
import api from "../api/axios";

function AdminQuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [experts, setExperts] = useState([]);
  const [selectedExperts, setSelectedExperts] = useState({});
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const [questionsResponse, expertsResponse] = await Promise.all([
        api.get("/queries/expert"),
        api.get("/users/experts"),
      ]);

      setQuestions(questionsResponse.data.queries || []);
      setExperts(expertsResponse.data.experts || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load questions or experts. Check that both API endpoints exist.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async (question) => {
    const expertId = selectedExperts[question._id];

    if (!expertId) {
      setError("Please select an expert first.");
      return;
    }

    setAssigning(true);
    setError("");
    setSuccess("");

    try {
      await api.patch(`/queries/${question._id}/assign`, { expertId });

      setSuccess("Question assigned successfully.");
      setSelectedQuestion(null);

      await fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to assign this question.",
      );
    } finally {
      setAssigning(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "assigned":
        return "primary";
      case "answered":
        return "success";
      case "closed":
        return "secondary";
      default:
        return "warning";
    }
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <p className="text-success fw-semibold mb-2">ADMIN PORTAL</p>
          <h1 className="h2 fw-bold">Manage Farmer Questions</h1>
          <p className="text-secondary mb-0">
            Review submissions and assign them to NPRP experts.
          </p>
        </div>

        <Button
          variant="outline-success"
          onClick={fetchData}
          disabled={loading}
        >
          <FaSyncAlt className="me-2" />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="success" />
          <p className="text-secondary mt-3">Loading questions...</p>
        </div>
      ) : questions.length === 0 ? (
        <Card className="border-0 shadow-sm rounded-4">
          <Card.Body className="text-center p-5">
            <FaClipboardList className="fs-1 text-success mb-3" />
            <h2 className="h5 fw-bold">No questions found</h2>
            <p className="text-secondary mb-0">
              Farmer submissions will appear here.
            </p>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-3">
          {questions.map((question) => {
            const assignedExpert =
              question.assignedExpert &&
              typeof question.assignedExpert === "object"
                ? question.assignedExpert
                : null;

            return (
              <Col xs={12} key={question._id}>
                <Card className="border-0 shadow-sm rounded-4">
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                      <div className="flex-grow-1">
                        <div className="d-flex flex-wrap gap-2 mb-2">
                          <Badge bg="light" text="dark">
                            {question.category}
                          </Badge>

                          <Badge bg={getStatusVariant(question.status)}>
                            {question.status}
                          </Badge>
                        </div>

                        <h2 className="h5 fw-bold">{question.title}</h2>

                        <p className="text-secondary mb-2">
                          Farmer: {question.farmer?.name || "Unknown"}
                          {" · "}
                          {question.location?.district || "No district"}
                          {question.location?.municipality
                            ? `, ${question.location.municipality}`
                            : ""}
                        </p>

                        <p className="mb-3">{question.description}</p>

                        <p className="small text-secondary mb-0">
                          Submitted:{" "}
                          {question.createdAt
                            ? new Date(question.createdAt).toLocaleDateString()
                            : "Unknown"}
                        </p>

                        <p className="mt-3 mb-0">
                          <FaUserCheck className="me-2 text-success" />
                          <strong>Assigned expert:</strong>{" "}
                          {assignedExpert?.name || "Not assigned"}
                        </p>
                      </div>

                      {question.status !== "closed" && (
                        <div style={{ minWidth: "230px" }}>
                          <Form.Label>
                            {assignedExpert
                              ? "Reassign expert"
                              : "Assign expert"}
                          </Form.Label>

                          <Form.Select
                            value={
                              selectedExperts[question._id] ??
                              assignedExpert?._id ??
                              ""
                            }
                            onChange={(event) =>
                              setSelectedExperts((previous) => ({
                                ...previous,
                                [question._id]: event.target.value,
                              }))
                            }
                          >
                            <option value="">Select an expert</option>

                            {experts.map((expert) => (
                              <option key={expert._id} value={expert._id}>
                                {expert.name} ({expert.email})
                              </option>
                            ))}
                          </Form.Select>

                          <Button
                            variant="success"
                            className="w-100 mt-2"
                            disabled={
                              assigning ||
                              experts.length === 0 ||
                              !selectedExperts[question._id] ||
                              selectedExperts[question._id] ===
                                assignedExpert?._id
                            }
                            onClick={() => handleAssign(question)}
                          >
                            {assigning
                              ? "Assigning..."
                              : assignedExpert
                                ? "Reassign Question"
                                : "Assign Question"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      <Modal
        show={Boolean(selectedQuestion)}
        onHide={() => setSelectedQuestion(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Assignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Confirm the expert assignment for this question.
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default AdminQuestionsPage;
