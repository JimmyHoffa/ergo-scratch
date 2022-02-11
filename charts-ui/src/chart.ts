// {
//   "timestamp": "2022-02-08T20:18:53.822Z",
//   "sortableTs": 1644351533822,
//   "ergAmount": "0.962411657",
//   "tokenAmount": "21.02",
//   "ergPerToken": "0.045785521",
//   "tokenPerErg": "21.84",
//   "tokenName": "SigUSD"
// }
import * as echarts from "echarts";
import moment from "moment";

const chartDom: any = document.getElementById("app");
const ergChartSpan = document.createElement("span");
chartDom.appendChild(ergChartSpan);
const usdChartSpan = document.createElement("span");
chartDom.appendChild(usdChartSpan);

const addChartDiv = async (parent: any) => {
  const chartDiv = document.createElement("div");
  chartDiv.className = "chart";
  chartDiv.setAttribute(
    "style",
    "position: relative; height: 300px; width: 900px;"
  );
  parent.appendChild(chartDiv);
  return await new Promise((res) =>
    setTimeout(() => {
      res(echarts.init(chartDiv as any));
    }, 500)
  );
};

const tokenCharts: any = { usd: {}, erg: {} };
export const setChartData = async (tickerData: any[], usd: boolean = true) => {
  const poolTimeMap: any = {};

  const poolTimeCategories: any[] = [];
  tickerData.forEach((poolTimes: any) => {
    poolTimeCategories.push(moment(poolTimes[0].timestamp).toISOString());
    poolTimes.forEach((pool) => {
      poolTimeMap[pool.tokenName] = poolTimeMap[pool.tokenName] || [];
      poolTimeMap[pool.tokenName].push(pool);
    });
  });

  const tokenNames = Object.keys(poolTimeMap);
  await Promise.all(
    tokenNames.map(async (tokenName) => {
      tokenCharts[usd ? "usd" : "erg"][tokenName] =
        tokenCharts[usd ? "usd" : "erg"][tokenName] ||
        (await addChartDiv(usd ? usdChartSpan : ergChartSpan));
    })
  );

  const getUsdValueOfTokenAtTimeIndex = (tokenName, timeIndex) => {
    return (
      parseFloat(poolTimeMap.SigUSD[timeIndex].tokenPerErg) *
      parseFloat(poolTimeMap[tokenName][timeIndex].ergPerToken)
    );
  };

  const tokenChartOptions = tokenNames.reduce((opts, tokenName) => {
    opts[tokenName] = {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross" },
      },
      legend: {},
      xAxis: {
        type: "time",
        data: poolTimeCategories.map((ts) => moment(ts as any).toDate()),
        axisTick: {
          alignWithLabel: true,
        },
        axisLabel: {
          rotate: 30,
        },
      },
      yAxis: {
        type: "value",
        name: usd
          ? `1 ${tokenName} = ~${(
              parseFloat(poolTimeMap.SigUSD.slice(-1)[0].tokenPerErg) *
              parseFloat(poolTimeMap[tokenName].slice(-1)[0].ergPerToken)
            )
              .toString()
              .substr(0, 5)} SigUSD`
          : `1 erg = ${
              poolTimeMap[tokenName].slice(-1)[0].tokenPerErg
            } ${tokenName}`,
        position: "right",
        axisLabel: {
          formatter: usd ? "{value} SigUSD" : "{value} Ergs",
        },
        smooth: true,
      },
      series: {
        data: poolTimeMap[tokenName].map((p, timeIndex) => ({
          name: p.timestamp,
          value: [
            moment(p.timestamp).toDate(),
            usd
              ? getUsdValueOfTokenAtTimeIndex(tokenName, timeIndex)
              : p.ergPerToken,
          ],
        })),
        type: "line",
        name: tokenName,
        showSymbol: false,
      },
    };
    return opts;
  }, {});

  tokenNames.forEach((tokenName) => {
    tokenCharts[usd ? "usd" : "erg"][tokenName].setOption(
      tokenChartOptions[tokenName]
    );
  });
};

(window as any).setChartData = setChartData;
