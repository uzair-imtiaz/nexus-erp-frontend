export interface AddEditItemModalProps {
  item?: InventoryItem;
  setItems: (item: InventoryItem) => void;
  onClose: () => void;
}
