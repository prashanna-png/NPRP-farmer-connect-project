/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Image,
  Row,
  Spinner,
} from "react-bootstrap";
import { FaArrowLeft, FaPaperPlane, FaSyncAlt } from "react-icons/fa";
import api from "../api/axios";

function ExpertQuestionDetailsPage() {
  const { id } = useParams();

  const [question, setQuestion] = useState(null);
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState("assigned");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchQuestion = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get(`/queries/${id}`);
      const item = data.query || data;

      setQuestion(item);
      setStatus(item.status);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load this question.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  const handleReply = async (e) => {
    e.preventDefault();

    const message = reply.trim();

    if (!message) {
      setError("Please enter a reply before sending.");
      return;
    }

    try {
      setSending(true);
      setError("");
      setSuccess("");

      await api.post(`/queries/${id}/reply`, { message });

      setReply("");
      setSuccess("Your reply was sent successfully.");
      await fetchQuestion();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to send your reply.");
    } finally {
      setSending(false);
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();

    if (!status || status === question?.status) {
      return;
    }

    try {
      setUpdatingStatus(true);
      setError("");
      setSuccess("");

      await api.patch(`/queries/${id}/status`, { status });

      setSuccess("Question status updated successfully.");
      await fetchQuestion();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to update the question status.",
      );
      await fetchQuestion();
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusVariant = (value) => {
    switch (value) {
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
        <p className="text-secondary mt-3">Loading question details...</p>
      </Container>
    );
  }

  if (error && !question) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <Button as={Link} to="/expert/questions" variant="outline-success">
          <FaArrowLeft className="me-2" />
          Back to Questions
        </Button>
      </Container>
    );
  }

  if (!question) {
    return null;
  }

  const isClosed = question.status === "closed";

  return (
    <Container className="py-5">
      <div className="mb-4">
        <Button
          as={Link}
          to="/expert/questions"
          variant="outline-success"
          className="mb-3"
        >
          <FaArrowLeft className="me-2" />
          Back to Questions
        </Button>

        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div>
            <p className="text-success fw-semibold mb-2">FARMER QUERY</p>
            <h1 className="h2 fw-bold">{question.title}</h1>
            <p className="text-secondary mb-0">
              Review the problem and provide appropriate guidance.
            </p>
          </div>

          <Badge bg={getStatusVariant(question.status)} className="fs-6">
            {question.status}
          </Badge>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Row className="g-4">
        <Col lg={7}>
          <Card className="border-0 shadow-sm rounded-4 mb-4">
            <Card.Body className="p-4">
              <h2 className="h5 fw-bold mb-3">Question Details</h2>

              <Row className="g-3 mb-3">
                <Col sm={6}>
                  <div className="text-secondary small">Category</div>
                  <div className="fw-semibold">
                    {question.category || "Not specified"}
                  </div>
                </Col>

                <Col sm={6}>
                  <div className="text-secondary small">Submitted</div>
                  <div className="fw-semibold">
                    {question.createdAt
                      ? new Date(question.createdAt).toLocaleString()
                      : "Not available"}
                  </div>
                </Col>

                <Col sm={6}>
                  <div className="text-secondary small">District</div>
                  <div className="fw-semibold">
                    {question.location?.district || "Not provided"}
                  </div>
                </Col>

                <Col sm={6}>
                  <div className="text-secondary small">Municipality</div>
                  <div className="fw-semibold">
                    {question.location?.municipality || "Not provided"}
                  </div>
                </Col>
              </Row>

              <hr />

              <h3 className="h6 fw-bold">Farmer's Description</h3>
              <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
                {question.description || "No description provided."}
              </p>

              {question.imageUrl && (
                <>
                  <hr />
                  <h3 className="h6 fw-bold mb-3">Attached Photo</h3>
                  <a href={question.imageUrl} target="_blank" rel="noreferrer">
                    <Image
                      src={question.imageUrl}
                      alt="Farmer's uploaded agricultural problem"
                      fluid
                      rounded
                      style={{ maxHeight: "420px" }}
                    />
                  </a>
                </>
              )}
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm rounded-4">
            <Card.Body className="p-4">
              <h2 className="h5 fw-bold mb-3">Conversation</h2>

              {!question.messages?.length ? (
                <p className="text-secondary">
                  No messages yet. Send a reply to help the farmer.
                </p>
              ) : (
                <div className="d-flex flex-column gap-3 mb-4">
                  {question.messages.map((message, index) => {
                    const sender =
                      typeof message.sender === "object"
                        ? message.sender
                        : null;

                    return (
                      <div
                        key={message._id || index}
                        className="p-3 rounded-3 border"
                      >
                        <div className="d-flex justify-content-between flex-wrap gap-2 mb-2">
                          <strong>
                            {sender?.name ||
                              (message.sender === question.farmer?._id
                                ? "Farmer"
                                : "NPRP Expert")}
                          </strong>

                          <small className="text-secondary">
                            {message.sentAt
                              ? new Date(message.sentAt).toLocaleString()
                              : ""}
                          </small>
                        </div>

                        <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
                          {message.message}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              {isClosed ? (
                <Alert variant="secondary" className="mb-0">
                  This question is closed. Replies are disabled.
                </Alert>
              ) : (
                <Form onSubmit={handleReply}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Your Reply</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Write clear, helpful agricultural guidance..."
                      maxLength={5000}
                      required
                    />
                    <Form.Text className="text-muted">
                      {reply.length}/5000 characters
                    </Form.Text>
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
                        Send Reply
                      </>
                    )}
                  </Button>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          <Card className="border-0 shadow-sm rounded-4 mb-4">
            <Card.Body className="p-4">
              <h2 className="h5 fw-bold mb-3">Farmer Information</h2>

              <div className="mb-3">
                <div className="text-secondary small">Name</div>
                <div className="fw-semibold">
                  {question.farmer?.name || "Not available"}
                </div>
              </div>

              <div className="mb-3">
                <div className="text-secondary small">Email</div>
                <div className="fw-semibold text-break">
                  {question.farmer?.email || "Not available"}
                </div>
              </div>

              <div>
                <div className="text-secondary small">Phone</div>
                <div className="fw-semibold">
                  {question.farmer?.phone || "Not provided"}
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm rounded-4">
            <Card.Body className="p-4">
              <h2 className="h5 fw-bold mb-3">Update Status</h2>

              <Form onSubmit={handleStatusUpdate}>
                <Form.Group className="mb-3">
                  <Form.Label>Question Status</Form.Label>
                  <Form.Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    disabled={isClosed || updatingStatus}
                  >
                    <option value="assigned">Assigned</option>
                    <option value="answered">Answered</option>
                    <option value="closed">Closed</option>
                  </Form.Select>
                </Form.Group>

                <Button
                  type="submit"
                  variant="outline-success"
                  disabled={
                    isClosed || updatingStatus || status === question.status
                  }
                >
                  {updatingStatus ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FaSyncAlt className="me-2" />
                      Update Status
                    </>
                  )}
                </Button>
              </Form>

              {isClosed && (
                <p className="small text-secondary mt-3 mb-0">
                  Closed questions cannot be reopened from this page.
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ExpertQuestionDetailsPage;
