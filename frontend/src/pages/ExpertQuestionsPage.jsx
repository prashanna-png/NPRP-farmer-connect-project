/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Badge,
  Button,
  Card,
  Container,
  Spinner,
  Table,
} from "react-bootstrap";
import { FaArrowRight, FaSyncAlt } from "react-icons/fa";
import api from "../api/axios";

function ExpertQuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/queries/expert");
      setQuestions(Array.isArray(data) ? data : data.queries || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load assigned questions.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const statusVariant = (status) => {
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
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h1 className="h2 fw-bold">Assigned Questions</h1>
          <p className="text-secondary mb-0">
            Review farmer problems assigned to you and respond with guidance.
          </p>
        </div>

        <Button
          variant="outline-success"
          onClick={fetchQuestions}
          disabled={loading}
        >
          <FaSyncAlt className="me-2" />
          Refresh
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="success" />
              <p className="text-secondary mt-3">Loading questions...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-5 px-3">
              <h2 className="h5 fw-bold">No assigned questions yet</h2>
              <p className="text-secondary mb-0">
                Questions assigned to your account will appear here.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Question</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {questions.map((question) => (
                    <tr key={question._id}>
                      <td className="fw-semibold">{question.title}</td>
                      <td>{question.category}</td>
                      <td>
                        {question.location?.district || "Not provided"}
                        {question.location?.municipality
                          ? `, ${question.location.municipality}`
                          : ""}
                      </td>
                      <td>
                        <Badge bg={statusVariant(question.status)}>
                          {question.status}
                        </Badge>
                      </td>
                      <td>
                        {question.createdAt
                          ? new Date(question.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td>
                        <Button
                          as={Link}
                          to={`/expert/questions/${question._id}`}
                          variant="outline-success"
                          size="sm"
                        >
                          Review <FaArrowRight className="ms-1" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ExpertQuestionsPage;
