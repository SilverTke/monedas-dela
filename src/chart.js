import * as echarts from "echarts";
import { DateTime } from "luxon";

let chart;
/**
 *
 * @param {string} unit
 */
export async function setupChart(unit) {
  const res = await fetch(`https://mindicador.cl/api/${unit}`);
  /** @type {{fecha: string, valor: number}[]} */
  const series = (await res.json()).serie;
  const data = series.slice(0, 10);
  if (!chart) {
    chart = echarts.init(document.querySelector("#chart"));
  }
  chart.setOption({
    title: { text: "Valor en los últimos 10 días (registrado)" },
    tooltip: {
      trigger: "axis",
      formatter: (params) => {
        /** @type {[DateTime, number]} */
        const data = params[0].data;
        return `<b>${DateTime.fromJSDate(data[0]).toLocaleString({ month: "long", day: "numeric" }, { locale: "es-cl" })}:</b> ${data[1]}`;
      },
    },
    xAxis: {
      type: "time",
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        type: "line",
        data: data.map((v) => [
          DateTime.fromISO(v.fecha).setZone("America/Santiago").toJSDate(),
          v.valor,
        ]),
      },
    ],
  });
}
