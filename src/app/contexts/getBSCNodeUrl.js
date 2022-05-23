import random from 'lodash/random';

// Array of available nodes to connect to
export const nodes = [
  'https://bsc-dataseed1.ninicoin.io',
  'https://bsc-dataseed1.defibit.io',
  'https://bsc-dataseed.binance.org',
];

export const testNodes = [
  'https://data-seed-prebsc-1-s1.binance.org:8545',
  'https://data-seed-prebsc-2-s1.binance.org:8545',
  'https://data-seed-prebsc-1-s2.binance.org:8545',
];

const getBSCNodeUrl = () => {
  const randomIndex = random(0, nodes.length - 1);
  return nodes[randomIndex];
};

const getBSCTestNodeUrl = () => {
  const randomIndex = random(0, testNodes.length - 1);
  return testNodes[randomIndex];
};

export { getBSCNodeUrl, getBSCTestNodeUrl };
