import JSONBigInt from "json-bigint";
import axios, { AxiosInstance } from "axios";
import moment from "moment";

import { math, renderFractions } from "./math";
import { ITokenSwapMarketRepository } from "./interfaces/ITokenSwapMarketRepository";
import { ITokenInfo } from "./interfaces/ITokenInfo";
import { ITokenSwapValue } from "./interfaces/ITokenSwapValue";

const PoolSample =
  "1999030f0400040204020404040405feffffffffffffffff0105feffffffffffffffff01050004d00f040004000406050005000580dac409d819d601b2a5730000d602e4c6a70404d603db63087201d604db6308a7d605b27203730100d606b27204730200d607b27203730300d608b27204730400d6099973058c720602d60a999973068c7205027209d60bc17201d60cc1a7d60d99720b720cd60e91720d7307d60f8c720802d6107e720f06d6117e720d06d612998c720702720fd6137e720c06d6147308d6157e721206d6167e720a06d6177e720906d6189c72117217d6199c72157217d1ededededededed93c27201c2a793e4c672010404720293b27203730900b27204730a00938c7205018c720601938c7207018c72080193b17203730b9593720a730c95720e929c9c721072117e7202069c7ef07212069a9c72137e7214067e9c720d7e72020506929c9c721372157e7202069c7ef0720d069a9c72107e7214067e9c72127e7202050695ed720e917212730d907216a19d721872139d72197210ed9272189c721672139272199c7216721091720b730e";

export const TokenSwapValueFromBox = (box: any): ITokenSwapValue => {
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
    timestamp: moment.utc().toISOString(), // accurately parseable and malleable timestamp
    sortableTs: Date.now(), // sortable number
    ergAmount,
    tokenAmount,
    ergPerToken,
    tokenPerErg,
    tokenName: token.name,
  } as any;
};

export class ExplorerTokenSwapMarketRepository
  implements ITokenSwapMarketRepository
{
  private JSONBI = JSONBigInt({ useNativeBigInt: true });
  private explorerHttpClient: AxiosInstance;

  constructor(private explorerUri: string = "https://api.ergoplatform.com") {
    this.explorerHttpClient = axios.create({
      baseURL: explorerUri,
      timeout: 5000,
      headers: { "Content-Type": "application/json" },
    });
  }

  async getTokensAvailableForSwapping(): Promise<ITokenInfo[]> {
    throw new Error("Method not implemented.");
  }
  async getSwappableTokenMarketCaps(): Promise<ITokenSwapValue[]> {
    throw new Error("Method not implemented.");
  }
  async getLatestTokenSwapValues(): Promise<ITokenSwapValue[]> {
    const {
      data: { items: boxes },
    } = await this.explorerHttpClient.request({
      url: `/api/v1/boxes/unspent/byErgoTree/${PoolSample}`,
      params: { limit: 100, offset: 0 },
      transformResponse: (data) => this.JSONBI.parse(data),
    });

    console.log("BOX", this.JSONBI.stringify(boxes[0]));
    const tokenPools = boxes.map(TokenSwapValueFromBox);
    // const tokenPools = [TokenSwapValueFromBox(boxes[0])];

    return tokenPools;
  }
  async getLatestTokenSwapValueByTokenId(
    tokenId: string
  ): Promise<ITokenSwapValue> {
    throw new Error("Method not implemented.");
  }
  async getLatestTokenSwapValuesForAddress(
    address: string
  ): Promise<ITokenSwapValue[]> {
    throw new Error("Method not implemented.");
  }
}

// export const getTokenPoolRatios = async () => {
//   const {
//     data: { items: boxes },
//   } = await explorerApi.request({
//     url: `/api/v1/boxes/unspent/byErgoTree/${PoolSample}`,
//     params: { limit: 100, offset: 0 },
//     transformResponse: (data) => JSONBI.parse(data),
//   });
//   const tokenPools = boxes.map((box: any) => {
//     const erg = { name: "ERG", decimals: 9, amount: box.value };
//     const token = {
//       decimals: box.assets[2].decimals,
//       amount: box.assets[2].amount,
//       name: box.assets[2].name,
//     };

//     const ergAmount = renderFractions(box.value, 9);
//     const tokenAmount = renderFractions(token.amount, token.decimals);
//     const ergPerToken = math.evaluate!(`${ergAmount} / ${tokenAmount}`).toFixed(
//       erg.decimals ?? 0
//     );
//     const tokenPerErg = math.evaluate!(`${tokenAmount} / ${ergAmount}`).toFixed(
//       token.decimals ?? 0
//     );
//     return {
//       timestamp: moment.utc().toISOString(), // accurately parseable and malleable timestamp
//       sortableTs: Date.now(), // sortable number
//       ergAmount,
//       tokenAmount,
//       ergPerToken,
//       tokenPerErg,
//       tokenName: token.name,
//     };
//   });

//   return tokenPools;
// };

// const fileToWrite = path.resolve(process.cwd(), "ticker.json");
// const dataJournal = JSON.parse(fs.readFileSync(fileToWrite).toString());

// const getAndWriteData = async () => {
//   const tokenPools = (await getTokenPoolRatios()).filter(
//     (tokenPool: any) => tokenPool.tokenAmount > 500
//   );
//   if (dataJournal.length > 10000) dataJournal.splice(0, 1);
//   dataJournal.push(tokenPools);
//   if (fs.existsSync(fileToWrite)) {
//     await fsp.unlink(fileToWrite);
//   }
//   await fsp.writeFile(fileToWrite, JSON.stringify(dataJournal));

//   console.log(
//     `${moment(tokenPools[0].timestamp)} datajournal length: ${
//       dataJournal.length
//     }`
//   );
// };

// const getAndWriteDataWithRetry = async (retriesLeft: number) => {
//   if (retriesLeft < 1) return;
//   try {
//     await getAndWriteData();
//     return;
//   } catch (ex) {
//     console.log("EX occurred getting pools, retry...");
//     setTimeout(() => getAndWriteDataWithRetry(retriesLeft - 1), 2000);
//   }
// };

// const startWritingData = (interval: number) => {
//   let actualTimer = setTimeout(async () => {
//     await getAndWriteDataWithRetry(10);
//     clearTimeout(actualTimer);
//     actualTimer = startWritingData(interval);
//   }, interval);
//   return actualTimer;
// };

// getAndWriteDataWithRetry(10); // initial go
// startWritingData(60000);

// // (window as any).getTokenPoolRatios = getTokenPoolRatios;
// // ((window as any).getTokenPoolRatios() as Promise<any[]>).then((tokenPools) => {
// //   tokenPools.forEach((tokenPool: any) => console.log(tokenPool));
// // });
