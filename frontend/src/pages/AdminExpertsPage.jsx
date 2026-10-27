/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { FaUsers, FaSyncAlt, FaUser } from "react-icons/fa";
import api from "../api/axios";

function AdminExpertsPage() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchExperts = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/users/experts");
      setExperts(data.experts || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load experts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-1">Expert Management</h2>
          <p className="text-muted mb-0">
            View experts registered in the NPRP Farmer Connect System.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-success"
          onClick={fetchExperts}
          disabled={loading}
        >
          <FaSyncAlt className="me-2" />
          Refresh
        </button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center gap-3">
              <FaUsers size={28} className="text-success" />
              <div>
                <div className="text-muted">Registered Experts</div>
                <h3 className="fw-bold mb-0">{experts.length}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm">
        <Card.Body>
          <h5 className="fw-bold mb-3">Expert Directory</h5>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="success" />
            </div>
          ) : experts.length === 0 ? (
            <Alert variant="info" className="mb-0">
              No experts have been registered yet.
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>

                <tbody>
                  {experts.map((expert, index) => (
                    <tr key={expert._id}>
                      <td>{index + 1}</td>

                      <td>
                        <div className="d-flex align-items-center gap-3">
                          {expert.profilePicture ? (
                            <img
                              src={expert.profilePicture}
                              alt={`${expert.name}'s profile`}
                              className="expert-list-avatar"
                            />
                          ) : (
                            <div className="expert-list-avatar expert-list-avatar-fallback">
                              <FaUser />
                            </div>
                          )}

                          <span className="fw-semibold">{expert.name}</span>
                        </div>
                      </td>

                      <td>{expert.email}</td>

                      <td>
                        <Badge bg="success">Expert</Badge>
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

export default AdminExpertsPage;
