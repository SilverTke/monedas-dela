import * as echarts from "echarts";
import { DateTime } from "luxon";

/**
 *
 * @param {string} unit
 */
export async function setupChart(unit) {
  const res = await fetch(`https://mindicador.cl/api/${unit}`);
  /** @type {{fecha: string, valor: number}[]} */
  const series = (await res.json()).serie;
  const data = series.slice(0, 10);
  const chart = echarts.init(document.querySelector("#chart"));
  chart.setOption({
    title: { text: "Valor en los últimos 10 días" },
    tooltip: {},
    xAxis: {
      type: "time",
      data: data.map((v) =>
        DateTime.fromISO(v.fecha).setZone("America/Santiago"),
      ),
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        type: "line",
        data: data.map((v) => v.valor),
      },
    ],
  });
}
