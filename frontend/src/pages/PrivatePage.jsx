import { Container, Card } from "react-bootstrap";
import { useSelector } from "react-redux";

function PrivatePage() {
  const userInfo = useSelector((state) => state.auth.userInfo);

  return (
    <Container className="py-5">
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          <h1 className="h3">Protected Page</h1>
          <p>Welcome, {userInfo.name}!</p>
          <p className="mb-0">
            Your role is: <strong>{userInfo.role}</strong>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default PrivatePage;
