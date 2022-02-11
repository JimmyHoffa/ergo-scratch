// This will require understanding the transactions, matching them by time in the history or understanding the ergotree with the swap in it
// export interface ITokenSwap {
//   amountPaid: ITokenValue;
//   valuePaid: ITokenSwapValue;
//   amountReceived: ITokenValue;
//   valueReceived: ITokenSwapValue;
// }

import { IAddressTokenAmounts } from './IAddressTokenAmounts';
import { ITokenInfo } from './ITokenInfo';
import { ITokenSwapValue } from './ITokenSwapValue';

export interface ITokenSwapMarketRepository {
  getTokensAvailableForSwapping(): Promise<ITokenInfo[]>;
  getSwappableTokenMarketCaps(): Promise<ITokenSwapValue[]>;
  getLatestTokenSwapValues(): Promise<ITokenSwapValue[]>;
  getLatestTokenSwapValueByTokenId(tokenId: string): Promise<ITokenSwapValue>;
  getLatestTokenSwapValuesForAddress(address: string): Promise<IAddressTokenAmounts | undefined>;
}
