import fs, { promises as fsp } from "fs";
import moment from "moment";
import path from "path";
import { ExplorerTokenSwapMarketRepository } from '../../ergo-price-lib';

const fileToWrite = path.resolve(process.cwd(), '..', 'charts-ui', 'src', "ticker.json");
const dataJournal = JSON.parse(fs.readFileSync(fileToWrite).toString());
const explorerRepo = new ExplorerTokenSwapMarketRepository();

const getAndWriteData = async () => {
  const tokenPools = await explorerRepo.getTokenRates();
  if (tokenPools.length < 1) {
    console.log('Failed to get pools, will try again next interval');
    return;
  }
  
  tokenPools.forEach(tokenPool => {
    (tokenPool as any).tokenName = tokenPool.token.name;
    (tokenPool as any).timestamp = moment(tokenPool.timestamp).toISOString();
  })

  if (dataJournal.length > 10000) dataJournal.splice(0, 1);
  dataJournal.push(tokenPools);
  if (fs.existsSync(fileToWrite)) {
    await fsp.unlink(fileToWrite);
  }
  await fsp.writeFile(fileToWrite, JSON.stringify(dataJournal));

  console.log(
    `${moment(tokenPools[0].timestamp)} datajournal length: ${
      dataJournal.length
    }`
  );
};

const startWritingData = (interval: number) => {
  let actualTimer = setTimeout(async () => {
    await getAndWriteData();
    clearTimeout(actualTimer);
    actualTimer = startWritingData(interval);
  }, interval);
  return actualTimer;
};

getAndWriteData(); // initial go
startWritingData(60000);

// (window as any).getTokenPoolRatios = getTokenPoolRatios;
// ((window as any).getTokenPoolRatios() as Promise<any[]>).then((tokenPools) => {
//   tokenPools.forEach((tokenPool: any) => console.log(tokenPool));
// });
