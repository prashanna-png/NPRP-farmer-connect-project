import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import {
  FaLeaf,
  FaComments,
  FaBullhorn,
  FaUser,
  FaPaperPlane,
} from "react-icons/fa";

function FarmerDashboard() {
  const userInfo = useSelector((state) => state.auth.userInfo);

  const dashboardCards = [
    {
      title: "My Questions",
      description:
        "Ask NPRP experts about potato diseases, seeds, and cultivation.",
      icon: <FaComments />,
      link: "/my-queries",
      button: "View My Questions",
    },
    {
      title: "Notices & Training",
      description:
        "Explore agricultural notices, training programs, and events.",
      icon: <FaBullhorn />,
      link: "/notices",
      button: "View Notices",
    },
    {
      title: "My Profile",
      description: "View your account and registered contact information.",
      icon: <FaUser />,
      link: "/profile",
      button: "View Profile",
    },
  ];

  return (
    <Container className="py-5">
      <div className="p-4 p-md-5 mb-4 rounded-4 bg-light">
        <FaLeaf className="text-success fs-2 mb-3" />

        <h1 className="h2 fw-bold">Welcome, {userInfo?.name || "Farmer"}!</h1>

        <p className="text-secondary mb-0">
          Access agricultural information, ask NPRP experts questions, and
          explore training opportunities.
        </p>
        <div className="mt-4">
          <Button as={Link} to="/ask-expert" variant="success">
            <FaPaperPlane className="me-2" />
            Ask NPRP Expert
          </Button>
        </div>
      </div>

      <h2 className="h4 fw-bold mb-4">Your Dashboard</h2>

      <Row className="g-4">
        {dashboardCards.map((item) => (
          <Col key={item.title} xs={12} md={6} lg={4}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="p-4 d-flex flex-column">
                <div className="text-success fs-3 mb-3">{item.icon}</div>

                <Card.Title>{item.title}</Card.Title>

                <Card.Text className="text-secondary">
                  {item.description}
                </Card.Text>

                <div className="mt-auto pt-3">
                  <Button as={Link} to={item.link} variant="outline-success">
                    {item.button}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default FarmerDashboard;
