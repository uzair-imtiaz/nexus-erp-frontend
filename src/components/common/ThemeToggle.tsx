import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import { useTheme } from "../../contexts/ThemeContext";

const ThemeToggle: React.FC = () => {
  const { themeMode, toggleTheme } = useTheme();

  return (
    <Tooltip
      title={`Switch to ${themeMode === "light" ? "dark" : "light"} mode`}
      styles={{ body: { color: themeMode === "light" ? "black" : "white" } }}
      color={themeMode === "light" ? "white" : "black"}
    >
      <Button
        type="text"
        icon={themeMode === "light" ? <MoonOutlined /> : <SunOutlined />}
        onClick={toggleTheme}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 40,
          height: 40,
          borderRadius: "50%",
        }}
      />
    </Tooltip>
  );
};

export default ThemeToggle;
