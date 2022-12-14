import { ElementHandle, Page } from "puppeteer";

import { AUTHORS_QUANTITY } from "./constants";

const authorDivSelector = (authorPosition: number) =>
  `div.sc-kaNhvL.frvEnU > div.sc-bYSBpT.iWCFCb > div.sc-jtRfpW.gLGHmr > div:nth-child(${authorPosition})`;

const authorsElements = (page: Page): Promise<ElementHandle<any>>[] => {
  return Array(AUTHORS_QUANTITY)
    .fill(null)
    .map(async (_, index) => {
      const authorSelector = authorDivSelector(index + 1);

      const element = await page.waitForSelector(authorSelector);

      return element;
    });
};

export { authorsElements };
