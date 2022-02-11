import { ITokenDetail } from './ITokenDetail';
import { ITokenSwapValue } from './ITokenSwapValue';

export interface ITokenValue {
  amount: number;
  valueInErgs?: number;
}

export interface ITokenBalance extends ITokenDetail {
  confirmed: ITokenValue;
  unconfirmed: ITokenValue;
  total: ITokenValue;
  value?: ITokenSwapValue;
}
