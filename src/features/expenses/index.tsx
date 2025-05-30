import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const Expenses = () => {
  const navigate = useNavigate();
  return (
    <Button onClick={() => navigate("/expenses/new")}>Add Expenses</Button>
  );
};

export default Expenses;
