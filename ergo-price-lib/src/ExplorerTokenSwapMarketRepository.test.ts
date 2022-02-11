import { ExplorerTokenSwapMarketRepository } from './ExplorerTokenSwapMarketRepository';
import { tokenSwapValuesExample } from './ExplorerTokenSwapMarketRepository.test.samples';

describe('getLatestTokenSwapValues', () => {
  it('should return an empty array when it cant retrieve data', async () => {
    const expectedSwapValues: any[] = [];
    const tokenSwapMarketRepo = new ExplorerTokenSwapMarketRepository('http://test.example.com', 2, 200, {
      timeout: 200,
    });
    const actualSwapValues = await tokenSwapMarketRepo.getLatestTokenSwapValues();

    expect(actualSwapValues).toEqual(expectedSwapValues);
  });
  it('should return token swap values succesfully', async () => {
    jest.setTimeout(20000);
    const expectedSwapValues = tokenSwapValuesExample;
    const tokenSwapMarketRepo = new ExplorerTokenSwapMarketRepository();
    const actualSwapValues = await tokenSwapMarketRepo.getLatestTokenSwapValues();

    expect(actualSwapValues.length).toBeGreaterThanOrEqual(expectedSwapValues.length);
    expect(actualSwapValues[0].ergPerToken).toBeDefined();
    expect(actualSwapValues[0].tokenPerErg).toBeDefined();
    expect(actualSwapValues.map((value) => value.token)).toContainEqual(expectedSwapValues[0].token);
    jest.setTimeout(5000);
  });
});

describe('getTokenInfoById', () => {
  it('should return undefined when it cant retrieve data', async () => {
    const expectedTokenData = undefined;
    const tokenSwapMarketRepo = new ExplorerTokenSwapMarketRepository('http://test.example.com', 2, 200, {
      timeout: 200,
    });
    const actualTokenData = await tokenSwapMarketRepo.getTokenInfoById('asdf');

    expect(actualTokenData).toEqual(expectedTokenData);
  });
  it('should return neta data for neta tokenId', async () => {
    jest.setTimeout(20000);
    const expectedTokenData = {
      boxId: '12ba7cb7c13f738ae3a5be2b353774bc3eb8f0ef72933a839907cbdcb046af9a',
      decimals: 6,
      description: '',
      emissionAmount: 1000000000000000n,
      id: '472c3d4ecaa08fb7392ff041ee2e6af75f4a558810a74b28600549d5392810e8',
      name: 'NETA',
      type: 'EIP-004',
    };
    const tokenSwapMarketRepo = new ExplorerTokenSwapMarketRepository();
    const actualTokenData = await tokenSwapMarketRepo.getTokenInfoById(
      '472c3d4ecaa08fb7392ff041ee2e6af75f4a558810a74b28600549d5392810e8'
    );

    jest.setTimeout(5000);
    expect(actualTokenData).toEqual(expectedTokenData);
  });
});
