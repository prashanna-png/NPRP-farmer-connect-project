import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Badge,
} from "react-bootstrap";
import {
  FaUser,
  FaMapMarkerAlt,
  FaLock,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import api from "../api/axios";
import { setCredentials } from "../slices/authSlice"; 

function ProfilePage() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [name, setName] = useState(userInfo?.name || "");
  const [phone, setPhone] = useState(userInfo?.phone || "");
  const [district, setDistrict] = useState(userInfo?.location?.district || "");
  const [municipality, setMunicipality] = useState(
    userInfo?.location?.municipality || "",
  );
  const [ward, setWard] = useState(userInfo?.location?.ward || "");
  const [updateMsg, setUpdateMsg] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const [passError, setPassError] = useState("");
  const [loadingPass, setLoadingPass] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdateMsg("");
    setUpdateError("");
    setLoadingProfile(true);

    try {
      const { data } = await api.put("/users/profile", {
        name,
        phone,
        location: { district, municipality, ward: Number(ward) || undefined },
      });

      dispatch(setCredentials({ userInfo: data.user }));
      setUpdateMsg("Profile updated successfully!");
    } catch (error) {
      setUpdateError(
        error.response?.data?.message || "Failed to update profile",
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassMsg("");
    setPassError("");

    if (newPassword !== confirmPassword) {
      return setPassError("New passwords do not match");
    }
    if (newPassword.length < 8) {
      return setPassError("Password must be at least 8 characters");
    }

    setLoadingPass(true);
    try {
      await api.put("/users/password", { currentPassword, newPassword });
      setPassMsg("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPassError(
        error.response?.data?.message || "Failed to change password",
      );
    } finally {
      setLoadingPass(false);
    }
  };

  return (
    <Container className="py-5">
      <h2 className="fw-bold mb-4">My Profile</h2>

      <Row className="g-4">
        <Col lg={4}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body className="text-center p-4">
              <div
                className="bg-success text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3"
                style={{ width: "80px", height: "80px", fontSize: "2rem" }}
              >
                {userInfo?.name?.charAt(0).toUpperCase()}
              </div>
              <h4 className="fw-bold mb-1">{userInfo?.name}</h4>
              <Badge
                bg={
                  userInfo?.role === "expert"
                    ? "info"
                    : userInfo?.role === "admin"
                      ? "danger"
                      : "success"
                }
                className="mb-3 text-capitalize"
              >
                {userInfo?.role}
              </Badge>

              <div className="text-start mt-4">
                <p className="mb-2 text-muted">
                  <FaEnvelope className="me-2" /> {userInfo?.email}
                </p>
                <p className="mb-2 text-muted">
                  <FaPhone className="me-2" />{" "}
                  {userInfo?.phone || "No phone added"}
                </p>
                <p className="mb-0 text-muted">
                  <FaMapMarkerAlt className="me-2" />
                  {userInfo?.location?.district
                    ? `${userInfo.location.district}, ${userInfo.location.municipality || ""}`
                    : "No location added"}
                </p>
              </div>
            </Card.Body>
          </Card>

          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-3">
                <FaLock className="me-2" />
                Change Password
              </h5>
              {passError && (
                <Alert variant="danger" className="py-2">
                  {passError}
                </Alert>
              )}
              {passMsg && (
                <Alert variant="success" className="py-2">
                  {passMsg}
                </Alert>
              )}

              <Form onSubmit={handlePasswordSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button
                  variant="success"
                  type="submit"
                  className="w-100"
                  disabled={loadingPass}
                >
                  {loadingPass ? "Updating..." : "Update Password"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-4">
                <FaUser className="me-2" />
                Edit Profile
              </h5>

              {updateError && (
                <Alert variant="danger" className="py-2">
                  {updateError}
                </Alert>
              )}
              {updateMsg && (
                <Alert variant="success" className="py-2">
                  {updateMsg}
                </Alert>
              )}

              <Form onSubmit={handleProfileSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="98XXXXXXXX"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <hr className="my-4" />
                <h6 className="fw-bold mb-3">
                  <FaMapMarkerAlt className="me-2" />
                  Location Details
                </h6>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>District</Form.Label>
                      <Form.Control
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="e.g. Kathmandu"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Municipality</Form.Label>
                      <Form.Control
                        type="text"
                        value={municipality}
                        onChange={(e) => setMunicipality(e.target.value)}
                        placeholder="e.g. Budhanilkantha"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Ward No.</Form.Label>
                      <Form.Control
                        type="number"
                        value={ward}
                        onChange={(e) => setWard(e.target.value)}
                        placeholder="e.g. 11"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button
                  variant="success"
                  type="submit"
                  className="mt-3 px-5"
                  disabled={loadingProfile}
                >
                  {loadingProfile ? "Saving..." : "Save Changes"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ProfilePage;
