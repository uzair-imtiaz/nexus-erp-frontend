import React, { useState } from "react";
import { Button, Tooltip } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import "./fab-menu.css";

export interface FabAction {
  key: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
  tooltip?: string;
}

interface FabMenuProps {
  actions: FabAction[];
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  size?: "small" | "middle" | "large";
}

const FabMenu: React.FC<FabMenuProps> = ({
  actions,
  position = "bottom-right",
  size = "large",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleActionClick = (action: FabAction) => {
    action.onClick();
    setIsOpen(false);
  };

  const getPositionClass = () => {
    switch (position) {
      case "bottom-left":
        return "fab-menu-bottom-left";
      case "top-right":
        return "fab-menu-top-right";
      case "top-left":
        return "fab-menu-top-left";
      default:
        return "fab-menu-bottom-right";
    }
  };

  return (
    <div className={`fab-menu ${getPositionClass()}`}>
      {/* Action Buttons */}
      <div className={`fab-actions ${isOpen ? "fab-actions-open" : ""}`}>
        {actions.map((action, index) => (
          <Tooltip
            key={action.key}
            title={action.tooltip || action.label}
            placement={position.includes("right") ? "left" : "right"}
          >
            <Button
              className="fab-action-button"
              style={{
                backgroundColor: action.color || "#1890ff",
                borderColor: action.color || "#1890ff",
                animationDelay: `${index * 50}ms`,
              }}
              type="primary"
              shape="circle"
              size={size}
              icon={action.icon}
              onClick={() => handleActionClick(action)}
            />
          </Tooltip>
        ))}
      </div>

      {/* Main FAB Button */}
      <Button
        className={`fab-main-button ${isOpen ? "fab-main-button-open" : ""}`}
        type="primary"
        shape="circle"
        size={size}
        icon={isOpen ? <CloseOutlined /> : <PlusOutlined />}
        onClick={toggleMenu}
        style={{
          backgroundColor: isOpen ? "#ff4d4f" : "#1890ff",
          borderColor: isOpen ? "#ff4d4f" : "#1890ff",
        }}
      />

      {/* Backdrop */}
      {isOpen && (
        <div className="fab-backdrop" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default FabMenu;
