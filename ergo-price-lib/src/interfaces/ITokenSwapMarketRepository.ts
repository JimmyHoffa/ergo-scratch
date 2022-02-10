// This will require understanding the transactions, matching them by time in the history or understanding the ergotree with the swap in it
// export interface ITokenSwap {
//   amountPaid: ITokenAmount;
//   valuePaid: ITokenSwapValue;
//   amountReceived: ITokenAmount;
//   valueReceived: ITokenSwapValue;
// }

import { ITokenInfo } from './ITokenInfo';
import { ITokenSwapValue } from './ITokenSwapValue';

export interface ITokenSwapMarketRepository {
  getTokensAvailableForSwapping(): Promise<ITokenInfo[]>;
  getSwappableTokenMarketCaps(): Promise<ITokenSwapValue[]>;
  getLatestTokenSwapValues(): Promise<ITokenSwapValue[]>;
  getLatestTokenSwapValueByTokenId(tokenId: string): Promise<ITokenSwapValue>;
  getLatestTokenSwapValuesForAddress(address: string): Promise<ITokenSwapValue[]>;
}
