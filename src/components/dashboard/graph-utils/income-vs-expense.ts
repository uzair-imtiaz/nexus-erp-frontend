export const config = {
  data: {
    type: "fetch",
    value:
      "https://gw.alipayobjects.com/os/antvdemo/assets/data/blockchain.json",
    transform: [
      {
        type: "fold",
        fields: ["blockchain", "nlp"],
        key: "type",
        value: "value",
      },
    ],
  },

  xField: (d) => new Date(d.date),
  yField: "value",
  colorField: "type",
  axis: {
    x: { labelAutoHide: "greedy" },
  },
  height: 350,
  annotations: [
    {
      type: "text",
      data: [new Date("2017-12-17"), 100],
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
