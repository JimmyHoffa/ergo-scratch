import { ExplorerTokenSwapMarketRepository } from "./ExplorerTokenSwapMarketRepository";

describe("getLatestTokenSwapValues", () => {
  it("should return an empty array when it cant retrieve data", async () => {
    const expectedSwapValues: any[] = [];
    const tokenSwapMarketRepo = new ExplorerTokenSwapMarketRepository('http://test.example.com', { timeout: 200 }, 2, 200);
    const actualSwapValues = await tokenSwapMarketRepo.getLatestTokenSwapValues();
    
    expect(actualSwapValues).toEqual(expectedSwapValues);
  });
});
