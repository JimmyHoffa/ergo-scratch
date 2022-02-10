import JSONBigInt from "json-bigint";
import axios from "axios";
import { all, create, MathJsStatic } from "mathjs";
import moment from "moment";
import { setChartData } from "./chart";
import tickerData from "./ticker.json";
(window as any).tickerData = tickerData;

const PoolSample =
  "1999030f0400040204020404040405feffffffffffffffff0105feffffffffffffffff01050004d00f040004000406050005000580dac409d819d601b2a5730000d602e4c6a70404d603db63087201d604db6308a7d605b27203730100d606b27204730200d607b27203730300d608b27204730400d6099973058c720602d60a999973068c7205027209d60bc17201d60cc1a7d60d99720b720cd60e91720d7307d60f8c720802d6107e720f06d6117e720d06d612998c720702720fd6137e720c06d6147308d6157e721206d6167e720a06d6177e720906d6189c72117217d6199c72157217d1ededededededed93c27201c2a793e4c672010404720293b27203730900b27204730a00938c7205018c720601938c7207018c72080193b17203730b9593720a730c95720e929c9c721072117e7202069c7ef07212069a9c72137e7214067e9c720d7e72020506929c9c721372157e7202069c7ef0720d069a9c72107e7214067e9c72127e7202050695ed720e917212730d907216a19d721872139d72197210ed9272189c721672139272199c7216721091720b730e";

const math = create(all, {
  epsilon: 1e-24,
  matrix: "Matrix",
  number: "BigNumber",
  precision: 64,
}) as Partial<MathJsStatic>;

const renderFractions = (
  fractions: bigint | number | string,
  numDecimals?: number
): string => {
  return math.format!(math.evaluate!(`${fractions} / 10^${numDecimals || 0}`), {
    notation: "fixed",
    lowerExp: 1e-100,
    upperExp: 1e100,
  });
};

const explorerApi = axios.create({
  baseURL: "https://api.ergoplatform.com",
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});
const JSONBI = JSONBigInt({ useNativeBigInt: true });
(window as any).getTokenPoolRatios = async () => {
  const {
    data: { items: boxes },
  } = await explorerApi.request({
    url: `/api/v1/boxes/unspent/byErgoTree/${PoolSample}`,
    params: { limit: 100, offset: 0 },
    transformResponse: (data) => JSONBI.parse(data),
  });
  const tokenPools = boxes.map((box: any) => {
    const erg = { name: "ERG", decimals: 9, amount: box.value };
    const token = {
      decimals: box.assets[2].decimals,
      amount: box.assets[2].amount,
      name: box.assets[2].name,
    };

    const ergAmount = renderFractions(box.value, 9);
    const tokenAmount = renderFractions(token.amount, token.decimals);
    const ergPerToken = math.evaluate!(`${ergAmount} / ${tokenAmount}`).toFixed(
      erg.decimals ?? 0
    );
    const tokenPerErg = math.evaluate!(`${tokenAmount} / ${ergAmount}`).toFixed(
      token.decimals ?? 0
    );
    return {
      ergAmount,
      tokenAmount,
      ergPerToken,
      tokenPerErg,
      tokenName: token.name,
    };
  });

  return tokenPools;
};

const curData: any[] = tickerData;
const updateCharts = async () => {
  try {
    const tokenPools = await (window as any).getTokenPoolRatios();
    tokenPools.forEach((tokenPool: any) => {
      tokenPool.timestamp = moment.utc().toISOString();
      tokenPool.sortableTs = Date.now();
    });
    if (curData.length > 10000) curData.splice(0, 1);
    curData.push(tokenPools);
  } catch (ex) {
    console.log("Errored retrieving data.. will try again on next interval");
  }
  console.log("Data points in use (maxes at 10,000):", curData.length);
  setChartData(curData, true);
  setChartData(curData, false);
};
updateCharts();
setInterval(updateCharts, 60000);
