import { InventoryItem } from "../types";

export interface AddEditItemModalProps {
  item?: InventoryItem;
  onClose: () => void;
  onSuccess: (item: InventoryItem) => void;
}
