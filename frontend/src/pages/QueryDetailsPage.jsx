/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Alert,
  Badge,
  Button,
  Card,
  Container,
  Form,
  Spinner,
} from "react-bootstrap";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa";
import api from "../api/axios";

function QueryDetailsPage() {
  const { id } = useParams();

  const [question, setQuestion] = useState(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchQuestion = async () => {
    try {
      setError("");
      const { data } = await api.get(`/queries/${id}`);
      setQuestion(data.query || data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load this question.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const handleFollowUp = async (event) => {
    event.preventDefault();

    if (!reply.trim()) return;

    setSending(true);
    setError("");
    setSuccess("");

    try {
      await api.post(`/queries/${id}/follow-up`, {
        message: reply.trim(),
      });

      setReply("");
      setSuccess("Your follow-up message was sent.");
      await fetchQuestion();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to send your message. Please try again.",
      );
    } finally {
      setSending(false);
    }
  };

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

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="text-secondary mt-3">Loading conversation...</p>
      </Container>
    );
  }

  if (!question) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error || "Question not found."}</Alert>
        <Button as={Link} to="/my-queries" variant="outline-success">
          Back to My Questions
        </Button>
      </Container>
    );
  }

  const messages = [...(question.messages || [])].sort(
    (a, b) => new Date(a.sentAt) - new Date(b.sentAt),
  );

  return (
    <Container className="py-5" style={{ maxWidth: "900px" }}>
      <Link
        to="/my-queries"
        className="text-decoration-none text-success d-inline-flex align-items-center gap-2 mb-4"
      >
        <FaArrowLeft />
        Back to My Questions
      </Link>

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

      <Card className="border-0 shadow-sm rounded-4 mb-4">
        <Card.Body className="p-4 p-md-5">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
            <Badge bg="light" text="dark">
              {question.category}
            </Badge>
            <Badge bg={getStatusVariant(question.status)}>
              {question.status}
            </Badge>
          </div>

          <h1 className="h3 fw-bold">{question.title}</h1>

          <p className="text-secondary small">
            Submitted{" "}
            {question.createdAt
              ? new Date(question.createdAt).toLocaleString()
              : ""}
          </p>

          <p style={{ whiteSpace: "pre-wrap" }}>{question.description}</p>

          <p className="text-secondary mb-3">
            <strong>Location:</strong>{" "}
            {question.location?.district || "Not provided"}
            {question.location?.municipality
              ? `, ${question.location.municipality}`
              : ""}
          </p>

          {question.imageUrl && (
            <div className="mt-4">
              <h2 className="h6 fw-bold">Uploaded photo</h2>
              <a href={question.imageUrl} target="_blank" rel="noreferrer">
                <img
                  src={question.imageUrl}
                  alt="Photo attached to the agricultural question"
                  className="img-fluid rounded-3 border"
                  style={{ maxHeight: "400px", objectFit: "contain" }}
                />
              </a>
            </div>
          )}
        </Card.Body>
      </Card>

      <h2 className="h4 fw-bold mb-3">Conversation</h2>

      <Card className="border-0 shadow-sm rounded-4 mb-4">
        <Card.Body className="p-4">
          {messages.length === 0 ? (
            <p className="text-secondary mb-0">
              No replies yet. An NPRP expert will respond when your question is
              reviewed.
            </p>
          ) : (
            <div className="d-flex flex-column gap-3">
              {messages.map((message, index) => {
                const isFarmer =
                  message.sender?._id === question.farmer?._id ||
                  message.sender === question.farmer;

                return (
                  <div
                    key={message._id || index}
                    className={`d-flex ${
                      isFarmer ? "justify-content-end" : "justify-content-start"
                    }`}
                  >
                    <div
                      className={`rounded-4 p-3 ${
                        isFarmer
                          ? "bg-success text-white"
                          : "bg-light text-dark"
                      }`}
                      style={{ maxWidth: "85%" }}
                    >
                      <div className="small fw-semibold mb-1">
                        {isFarmer ? "You" : "NPRP Expert"}
                      </div>

                      <div style={{ whiteSpace: "pre-wrap" }}>
                        {message.message}
                      </div>

                      <div className="small mt-2 opacity-75">
                        {message.sentAt
                          ? new Date(message.sentAt).toLocaleString()
                          : ""}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card.Body>
      </Card>

      {question.status !== "closed" && (
        <Card className="border-0 shadow-sm rounded-4">
          <Card.Body className="p-4">
            <h2 className="h5 fw-bold mb-3">Ask a follow-up question</h2>

            <Form onSubmit={handleFollowUp}>
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  placeholder="Ask for clarification or provide more details..."
                  maxLength={3000}
                  required
                  disabled={sending}
                />
              </Form.Group>

              <Button
                type="submit"
                variant="success"
                disabled={sending || !reply.trim()}
              >
                {sending ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="me-2" />
                    Send Follow-up
                  </>
                )}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      {question.status === "closed" && (
        <Alert variant="secondary">
          This question is closed, so follow-up messages are disabled.
        </Alert>
      )}
    </Container>
  );
}

export default QueryDetailsPage;
