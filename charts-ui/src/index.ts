import moment from "moment";
import { ExplorerTokenSwapMarketRepository } from '../../ergo-price-lib';
import { setChartData } from "./chart";
import tickerData from "./ticker.json";
(window as any).tickerData = tickerData;

const explorerRepo = new ExplorerTokenSwapMarketRepository();

const curData: any[] = tickerData as any[];
const updateCharts = async () => {
  const tokenPools = await explorerRepo.getTokenRates();
  if (tokenPools === undefined) {
    console.log('Failed to get pools, will try again next interval');
  }
  
  console.log(moment().toISOString(), 'New tokenpools', tokenPools);
  tokenPools.forEach(tokenPool => {
    (tokenPool as any).tokenName = tokenPool.token.name;
    (tokenPool as any).timestamp = moment(tokenPool.timestamp).toISOString();
  })
  if (curData.length > 10000) curData.splice(0, 1);
  curData.push(tokenPools);
  
  console.log("Data points in use (maxes at 10,000):", curData.length);
  setChartData(curData, true);
  setChartData(curData, false);
};
updateCharts();
setInterval(updateCharts, 60000);

