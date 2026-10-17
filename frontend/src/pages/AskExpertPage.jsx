import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa";

import api from "../api/axios";

function AskExpertPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "disease",
    description: "",
    district: "",
    municipality: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/queries", {
        title: formData.title.trim(),
        category: formData.category,
        description: formData.description.trim(),
        location: {
          district: formData.district.trim(),
          municipality: formData.municipality.trim(),
        },
      });

      navigate("/my-queries", {
        replace: true,
        state: { message: "Your question was submitted successfully." },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to submit your question. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8} xl={7}>
          <Link
            to="/farmer/dashboard"
            className="text-decoration-none text-success d-inline-flex align-items-center gap-2 mb-4"
          >
            <FaArrowLeft /> Back to Dashboard
          </Link>

          <div className="mb-4">
            <h1 className="h2 fw-bold">Ask an NPRP Expert</h1>
            <p className="text-secondary mb-0">
              Describe your potato farming problem. An authorized NPRP expert
              can review your question and respond.
            </p>
          </div>

          <Card className="border-0 shadow-sm rounded-4">
            <Card.Body className="p-4 p-md-5">
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4" controlId="queryTitle">
                  <Form.Label className="fw-semibold">
                    Question title
                  </Form.Label>
                  <Form.Control
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Dark spots appearing on potato leaves"
                    maxLength={150}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="queryCategory">
                  <Form.Label className="fw-semibold">
                    Problem category
                  </Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="disease">Disease</option>
                    <option value="seed">Seed and potato varieties</option>
                    <option value="soil">Soil</option>
                    <option value="cultivation">Cultivation</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4" controlId="queryDescription">
                  <Form.Label className="fw-semibold">
                    Describe your problem
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Explain what you observed, when it started, and any steps you have already taken..."
                    maxLength={5000}
                    required
                  />
                  <Form.Text muted>
                    Include as much detail as possible to help the expert
                    understand your problem.
                  </Form.Text>
                </Form.Group>

                <h2 className="h5 fw-bold mb-3">Your farm location</h2>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4" controlId="queryDistrict">
                      <Form.Label>District</Form.Label>
                      <Form.Control
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        placeholder="Enter district"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-4" controlId="queryMunicipality">
                      <Form.Label>Municipality / Rural Municipality</Form.Label>
                      <Form.Control
                        name="municipality"
                        value={formData.municipality}
                        onChange={handleChange}
                        placeholder="Enter municipality"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex flex-column flex-sm-row gap-3 mt-2">
                  <Button
                    type="submit"
                    variant="success"
                    disabled={loading}
                    className="px-4"
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="me-2" />
                        Submit Question
                      </>
                    )}
                  </Button>

                  <Button
                    as={Link}
                    to="/farmer/dashboard"
                    variant="outline-secondary"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AskExpertPage;
