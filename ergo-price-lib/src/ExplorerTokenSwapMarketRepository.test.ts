import JSONBigInt from 'json-bigint';
import { ExplorerTokenSwapMarketRepository } from './ExplorerTokenSwapMarketRepository';
import { tokenSwapValuesExample } from './ExplorerTokenSwapMarketRepository.test.samples';

const JSONBI = JSONBigInt({ useNativeBigInt: true });

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
    const tokenSwapMarketRepo = new ExplorerTokenSwapMarketRepository('http://test.example.com', 1, 150, {
      timeout: 100,
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

describe('getLatestTokenSwapValuesForAddress', () => {
  it('should return undefined when it cant retrieve data', async () => {
    const expectedTokenData = undefined;
    const tokenSwapMarketRepo = new ExplorerTokenSwapMarketRepository('http://test.example.com', 1, 150, {
      timeout: 100,
    });
    const actualTokenData = await tokenSwapMarketRepo.getLatestTokenSwapValuesForAddress('asdf');

    expect(actualTokenData).toEqual(expectedTokenData);
  });
  it('should return wallet values for tokens in address', async () => {
    jest.setTimeout(20000);

    const tokenSwapMarketRepo = new ExplorerTokenSwapMarketRepository();
    const tokenValueForAddress = await tokenSwapMarketRepo.getLatestTokenSwapValuesForAddress(
      '9gzfBJLomCgKk5dgpo5nboEb4aLZtJ9gGsv5TmzcnNSS1ou4ADn'
    );

    // console.log('AAAA', JSONBI.stringify(tokenValueForAddress, undefined, 2));
    // Object.values(tokenValueForAddress).forEach(addrVal => {console.log((addrVal || {}).token.name, (addrVal || {}).total.valueInErgs)});
    // console.log('AAAA', JSONBI.stringify((tokenValueForAddress || {})['d71693c49a84fbbecd4908c94813b46514b18b67a99952dc1e6e4791556de413']));
    // console.log('AAAA', JSONBI.stringify((tokenValueForAddress || {})['5a34d53ca483924b9a6aa0c771f11888881b516a8d1a9cdc535d063fe26d065e']));
    jest.setTimeout(5000);
  });
});
