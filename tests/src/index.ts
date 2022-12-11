import puppeteer, { ElementHandle, Page } from "puppeteer";

import { AUTHORS_QUANTITY, TRACING_FILE_PATH, URL } from "./constants";
import { authorsDivSelector, sleep } from "./utils";

(async () => {
  console.log("Initiating puppeteer");

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // const pageSession = await page.target().createCDPSession();

  // // O valor não é exibido na aba de performance do Chrome, não sei se é assim mesmo, ou não está funcionando
  // // Tentativa 01
  // await pageSession.send("Emulation.setCPUThrottlingRate", { rate: 6 });
  // // Tentativa 02
  // await page.emulateCPUThrottling(6);

  await page.goto(URL);

  const authorsButtons = await Promise.all(
    Array(AUTHORS_QUANTITY)
      .fill(null)
      .map(async (_, index) => {
        const authorSelector = authorsDivSelector(index + 1);

        const element = await page.waitForSelector(authorSelector);

        return element;
      })
  );

  await sleep(5);

  await measure(page, () => simulateInteractions(authorsButtons));

  // await browser.close();
  console.log("Ending puppeteer");
})();

async function simulateInteractions(authorsButtons: ElementHandle<Element>[]) {
  console.log("Initiating simulation...");

  await authorsButtons[0].click();
  await authorsButtons[1].click();
  await authorsButtons[2].click();

  await authorsButtons[2].click();
  await authorsButtons[1].click();
  await authorsButtons[0].click();

  await authorsButtons[0].click();
  await authorsButtons[0].click();
  await authorsButtons[0].click();

  await authorsButtons[1].click();
  await authorsButtons[1].click();
  await authorsButtons[1].click();

  await authorsButtons[2].click();
  await authorsButtons[2].click();
  await authorsButtons[2].click();

  console.log("Finished simulation!");
}

async function measure(page: Page, simulation: () => Promise<void>) {
  const firstMetrics = await page.metrics();

  console.info(firstMetrics);

  await page.tracing.start({
    path: TRACING_FILE_PATH,
    screenshots: true,
  });

  await simulation();

  await page.tracing.stop();

  const lastMetrics = await page.metrics();

  console.info(lastMetrics);
}
