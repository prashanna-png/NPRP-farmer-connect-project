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
import { FaLeaf } from "react-icons/fa";
import api from "../api/axios";

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    district: "",
    municipality: "",
    ward: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        location: {
          district: formData.district.trim(),
          municipality: formData.municipality.trim(),
          ward: formData.ward.trim(),
        },
      });

      navigate("/login", {
        replace: true,
        state: { message: "Account created successfully. Please log in." },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Registration failed. Please check your information and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section py-5">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={9} lg={7} xl={6}>
            <Card className="auth-card border-0 shadow-sm">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <FaLeaf className="auth-logo mb-3" />
                  <h1 className="h3 fw-bold">Create Your Account</h1>
                  <p className="text-secondary mb-0">
                    Join NPRP Farmer Connect for potato farming support.
                  </p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Full name</Form.Label>
                    <Form.Control
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="registerEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="registerPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          autoComplete="new-password"
                          minLength={8}
                          placeholder="At least 8 characters"
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="confirmPassword">
                        <Form.Label>Confirm password</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          autoComplete="new-password"
                          placeholder="Repeat password"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3" controlId="phone">
                    <Form.Label>Phone number (optional)</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      autoComplete="tel"
                    />
                  </Form.Group>

                  <h2 className="h6 fw-bold mt-4 mb-3">
                    Your farming location
                  </h2>

                  <Form.Group className="mb-3" controlId="district">
                    <Form.Label>District</Form.Label>
                    <Form.Control
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      placeholder="Enter your district"
                    />
                  </Form.Group>

                  <Row>
                    <Col sm={8}>
                      <Form.Group className="mb-3" controlId="municipality">
                        <Form.Label>
                          Municipality / Rural municipality
                        </Form.Label>
                        <Form.Control
                          name="municipality"
                          value={formData.municipality}
                          onChange={handleChange}
                          placeholder="Enter municipality"
                        />
                      </Form.Group>
                    </Col>

                    <Col sm={4}>
                      <Form.Group className="mb-3" controlId="ward">
                        <Form.Label>Ward no.</Form.Label>
                        <Form.Control
                          name="ward"
                          value={formData.ward}
                          onChange={handleChange}
                          placeholder="Ward"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button
                    type="submit"
                    variant="success"
                    className="w-100 mt-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </Form>

                <p className="text-center text-secondary mt-4 mb-0">
                  Already have an account?{" "}
                  <Link to="/login" className="auth-link">
                    Log in
                  </Link>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default RegisterPage;
