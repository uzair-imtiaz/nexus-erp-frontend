import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const Journal = () => {
  const navigate = useNavigate();
  return (
    <Button type="primary" onClick={() => navigate("/journal/new")}>
      Add Journal
    </Button>
  );
};

export default Journal;
