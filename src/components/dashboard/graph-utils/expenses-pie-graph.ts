import { PieConfig } from "@ant-design/plots";

export const expensesConfig: PieConfig = {
  angleField: "value",
  colorField: "name",
  legend: {
    color: {
      title: false,
      position: "bottom",
      rowPadding: 5,
    },
  },
  innerRadius: 0.9,
  height: 350,
};
