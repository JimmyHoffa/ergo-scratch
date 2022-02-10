import { ExplorerTokenSwapMarketRepository } from "./ExplorerTokenSwapMarketRepository";
export { ITokenInfo } from "./interfaces/ITokenInfo";
export { ITokenDetail } from "./interfaces/ITokenDetail";
export { ITokenAmount } from "./interfaces/ITokenAmount";
export { ITokenSwapValue } from "./interfaces/ITokenSwapValue";
export { ITokenSwapMarketRepository } from "./interfaces/ITokenSwapMarketRepository";

const tokenSwapMarketRepo = new ExplorerTokenSwapMarketRepository();
const pools = tokenSwapMarketRepo.getLatestTokenSwapValues().then((pool) => {
  console.log(pool.length);
});
