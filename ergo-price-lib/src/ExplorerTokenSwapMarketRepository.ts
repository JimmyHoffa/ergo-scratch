import { AxiosRequestConfig } from 'axios';
import JSONBigInt from 'json-bigint';
import moment from 'moment';
import { ExplorerRequestManager } from './ExplorerRequestManager';
import { IBox } from './interfaces/Explorer/IBox';
import { ITokenInfo } from './interfaces/ITokenInfo';
import { ITokenSwapMarketRepository } from './interfaces/ITokenSwapMarketRepository';
import { ITokenSwapValue } from './interfaces/ITokenSwapValue';
import { math, renderFractions } from './math';

const PoolSample =
  '1999030f0400040204020404040405feffffffffffffffff0105feffffffffffffffff01050004d00f040004000406050005000580dac409d819d601b2a5730000d602e4c6a70404d603db63087201d604db6308a7d605b27203730100d606b27204730200d607b27203730300d608b27204730400d6099973058c720602d60a999973068c7205027209d60bc17201d60cc1a7d60d99720b720cd60e91720d7307d60f8c720802d6107e720f06d6117e720d06d612998c720702720fd6137e720c06d6147308d6157e721206d6167e720a06d6177e720906d6189c72117217d6199c72157217d1ededededededed93c27201c2a793e4c672010404720293b27203730900b27204730a00938c7205018c720601938c7207018c72080193b17203730b9593720a730c95720e929c9c721072117e7202069c7ef07212069a9c72137e7214067e9c720d7e72020506929c9c721372157e7202069c7ef0720d069a9c72107e7214067e9c72127e7202050695ed720e917212730d907216a19d721872139d72197210ed9272189c721672139272199c7216721091720b730e';

export const tokenSwapValueFromBox = (box: IBox): ITokenSwapValue => {
  const erg = { name: 'ERG', decimals: 9, amount: box.value };
  const token = box.assets[2];

  const ergAmount = renderFractions(box.value, 9);
  const tokenAmount = renderFractions(token.amount, token.decimals);
  const ergPerToken = math.evaluate?.(`${ergAmount} / ${tokenAmount}`).toFixed(erg.decimals ?? 0);
  const tokenPerErg = math.evaluate?.(`${tokenAmount} / ${ergAmount}`).toFixed(token.decimals ?? 0);
  const tokenInfo: ITokenInfo = {
    name: token.name,
    tokenId: token.tokenId,
    decimals: token.decimals,
  };
  return {
    timestamp: moment.utc().valueOf(), // accurately parseable and malleable timestamp
    ergPerToken,
    tokenPerErg,
    token: tokenInfo,
  };
};

export class ExplorerTokenSwapMarketRepository implements ITokenSwapMarketRepository {
  private JSONBI = JSONBigInt({ useNativeBigInt: true });

  private explorerHttpClient: ExplorerRequestManager;

  constructor(
    private explorerUri: string = 'https://api.ergoplatform.com',
    private defaultRetryCount = 5,
    private defaultRetryWaitMillis = 2000,
    axiosInstanceConfig: AxiosRequestConfig = {}
  ) {
    this.explorerHttpClient = new ExplorerRequestManager(explorerUri, axiosInstanceConfig);
  }

  async getTokenInfoById(
    tokenId: string,
    numberOfTimesToRetry = this.defaultRetryCount,
    retryWaitTime: number = this.defaultRetryWaitMillis
  ): Promise<ITokenInfo> {
    const token = await this.explorerHttpClient.requestWithRetries<{ items: IBox[] }>(
      {
        url: `/api/v1/tokens/${tokenId}`,
        params: { limit: 100, offset: 0 },
        transformResponse: (data) => this.JSONBI.parse(data),
      },
      numberOfTimesToRetry,
      retryWaitTime
    );

    if (token === undefined) return undefined as any; // Failed to retrieve values, we got nothin to give back.

    return token as any;
  }

  async getTokensAvailableForSwapping(): Promise<ITokenInfo[]> {
    throw new Error('Method not implemented.');
  }

  async getSwappableTokenMarketCaps(): Promise<ITokenSwapValue[]> {
    throw new Error('Method not implemented.');
  }

  async getLatestTokenSwapValues(
    numberOfTimesToRetry = this.defaultRetryCount,
    retryWaitTime: number = this.defaultRetryWaitMillis
  ): Promise<ITokenSwapValue[]> {
    const boxItems = await this.explorerHttpClient.requestWithRetries<{ items: IBox[] }>(
      {
        url: `/api/v1/boxes/unspent/byErgoTree/${PoolSample}`,
        params: { limit: 100, offset: 0 },
        transformResponse: (data) => this.JSONBI.parse(data),
      },
      numberOfTimesToRetry,
      retryWaitTime
    );

    if (boxItems === undefined) return []; // Failed to retrieve values, we got nothin to give back.

    return boxItems.items.map(tokenSwapValueFromBox);
  }

  async getLatestTokenSwapValueByTokenId(tokenId: string): Promise<ITokenSwapValue> {
    throw new Error('Method not implemented.');
  }

  async getLatestTokenSwapValuesForAddress(address: string): Promise<ITokenSwapValue[]> {
    throw new Error('Method not implemented.');
  }
}
