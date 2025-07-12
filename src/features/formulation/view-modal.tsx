import { Modal, Typography } from "antd";
import FormulationDetail from "./formulation-detail";
interface ViewFormulationModalProps {
  formulation: any;
  onCancel: () => void;
}
const ViewFormulationModal: React.FC<ViewFormulationModalProps> = ({
  formulation,
  onCancel,
}) => {
  if (!formulation) return null;

  return (
    <Modal
      open={true}
      footer={null}
      onCancel={onCancel}
      title={
        <Typography.Title level={4} style={{ margin: 0 }}>
          Formulation Details
        </Typography.Title>
      }
      width={900}
    >
      <FormulationDetail formulation={formulation} />
    </Modal>
  );
};

export default ViewFormulationModal;
