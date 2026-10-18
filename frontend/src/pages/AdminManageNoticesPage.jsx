/* eslint-disable react-hooks/immutability */
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, Badge, Spinner } from "react-bootstrap";
import { FaBullhorn, FaTrash, FaImage } from "react-icons/fa";
import api from "../api/axios";

function AdminManageNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");
  const [location, setLocation] = useState("");
  const [trainingDate, setTrainingDate] = useState("");
  const [registrationDeadline, setRegistrationDeadline] = useState("");
  const [published, setPublished] = useState(true);
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/notices");
      
      const fetchedNotices = data.notices ? data.notices : data;
      setNotices(fetchedNotices);
    } catch  {
      setError("Failed to load notices.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    formData.append("location", location);
    formData.append("published", published);
    
    if (trainingDate) formData.append("trainingDate", trainingDate);
    if (registrationDeadline) formData.append("registrationDeadline", registrationDeadline);
    if (image) formData.append("image", image);

    try {
      await api.post("/notices", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Notice saved successfully!");
      
      setTitle("");
      setContent("");
      setCategory("general");
      setLocation("");
      setTrainingDate("");
      setRegistrationDeadline("");
      setPublished(true);
      setImage(null);
      
      fetchNotices();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save notice.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notice permanently?")) return;
    try {
      await api.delete(`/notices/${id}`);
      setNotices(notices.filter((n) => n._id !== id));
    } catch  {
      alert("Failed to delete notice.");
    }
  };

  return (
    <Container className="py-5">
      <h2 className="fw-bold mb-4">
        <FaBullhorn className="me-2 text-success" /> Manage Notices
      </h2>

      <Row className="g-4">
        <Col lg={5}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-3">Publish New Notice</h5>
              
              {error && <Alert variant="danger" className="py-2">{error}</Alert>}
              {success && <Alert variant="success" className="py-2">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required 
                    placeholder="e.g. Free Soil Testing Training"
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="general">General</option>
                        <option value="training">Training</option>
                        <option value="advisory">Advisory</option>
                        <option value="event">Event</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Location</Form.Label>
                      <Form.Control 
                        type="text" 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)} 
                        placeholder="e.g. Kathmandu" 
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Training Date</Form.Label>
                      <Form.Control 
                        type="date" 
                        value={trainingDate} 
                        onChange={(e) => setTrainingDate(e.target.value)} 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Registration Deadline</Form.Label>
                      <Form.Control 
                        type="date" 
                        value={registrationDeadline} 
                        onChange={(e) => setRegistrationDeadline(e.target.value)} 
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Content</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={4} 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    required 
                    placeholder="Write the full details here..."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label><FaImage className="me-1"/> Upload Image (Optional)</Form.Label>
                  <Form.Control 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setImage(e.target.files[0])} 
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Check 
                    type="switch" 
                    label="Publish immediately (uncheck to save as draft)" 
                    checked={published} 
                    onChange={(e) => setPublished(e.target.checked)} 
                  />
                </Form.Group>

                <Button variant="success" type="submit" className="w-100" disabled={submitting}>
                  {submitting ? "Saving..." : "Save Notice"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={7}>
          <h5 className="fw-bold mb-3">Published & Draft Notices</h5>
          
          {loading ? (
            <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>
          ) : notices.length === 0 ? (
            <Alert variant="info">No notices found.</Alert>
          ) : (
            notices.map((notice) => (
              <Card key={notice._id} className="shadow-sm border-0 mb-3">
                <Card.Body className="p-4">
                  
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="fw-bold mb-0">
                      {notice.title} 
                      {!notice.published && <Badge bg="warning" text="dark" className="ms-2">Draft</Badge>}
                    </h5>
                    <Badge bg="success" className="text-capitalize">{notice.category}</Badge>
                  </div>
                  
                  <small className="text-muted d-block mb-3">
                    Posted on {new Date(notice.createdAt).toLocaleDateString()}
                  </small>

                  {notice.imageUrl && (
                     <img src={notice.imageUrl} alt="Notice" className="img-fluid rounded mb-3" style={{maxHeight: "200px", objectFit: "cover"}} />
                  )}
                  
                  <p className="mb-3" style={{ whiteSpace: "pre-wrap" }}>{notice.content}</p>
                  
                  <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                    <div className="text-muted small">
                      {notice.location && <span className="me-3">Location: {notice.location}</span>}
                      {notice.trainingDate && <span>Date: {new Date(notice.trainingDate).toLocaleDateString()}</span>}
                    </div>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(notice._id)}>
                      <FaTrash className="me-1" /> Delete
                    </Button>
                  </div>
                  
                </Card.Body>
              </Card>
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default AdminManageNotices;