export const incomeConfig = {
  xField: "date",
  yField: "value",
  colorField: "type",
  axis: {
    x: { labelAutoHide: "greedy" },
  },
  height: 350,
  smooth: true,
  annotations: [
    {
      type: "text",
      style: {
        wordWrap: true,
        wordWrapWidth: 164,
        dx: -174,
        dy: 30,
        fill: "#2C3542",
        fillOpacity: 0.65,
        fontSize: 10,
        background: true,
        backgroundRadius: 2,
        connector: true,
        startMarker: true,
        startMarkerFill: "#2C3542",
        startMarkerFillOpacity: 0.65,
      },
      tooltip: false,
    },
  ],
};
