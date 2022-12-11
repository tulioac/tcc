const authorsDivSelector = (authorPosition: number) =>
  `div.sc-kaNhvL.frvEnU > div.sc-bYSBpT.iWCFCb > div.sc-jtRfpW.gLGHmr > div:nth-child(${authorPosition})`;

const sleep = (timeInSeconds: number) =>
  new Promise((resolver) => setTimeout(resolver, timeInSeconds * 1000));

export { authorsDivSelector, sleep };
