import { ITokenDetail } from './ITokenDetail';

export interface ITokenSwapValue extends ITokenDetail {
  sigUSDPerToken: number;
  ergPerToken: number;
  tokenPerErg: number;
  tokenPerSigUSD: number;
  timestamp: number; // Unix epoch is more efficient for storage than the ISO8601 and moment can keep it straight. Always work in UTC, only use locale on display.
}
