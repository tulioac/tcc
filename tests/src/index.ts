import puppeteer, { ElementHandle, Page } from "puppeteer";

import { CPU_THROTTLING_FACTOR, TRACING_FILE_PATH, URL } from "./constants";
import { authorsElements } from "./elementsSelectors";

(async () => {
  console.log("Initiating puppeteer");

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.emulateCPUThrottling(CPU_THROTTLING_FACTOR);

  await page.goto(URL);

  const authorsButtons = await Promise.all(authorsElements(page));

  const simulate = () => simulateInteractions(authorsButtons);

  await measure(page, simulate);

  await page.close();
  await browser.close();

  console.log("Ending puppeteer");
})();

async function simulateInteractions(authorsButtons: ElementHandle<Element>[]) {
  console.log("Initiating simulation...");

  const [firstAuthor, secondAuthor, thirdAuthor] = authorsButtons;

  // Simulate an miss click that needs to be canceled by another click
  await firstAuthor.click();
  await firstAuthor.click();

  await secondAuthor.click();
  await thirdAuthor.click();

  console.log("Finished simulation!");
}

async function measure(page: Page, simulation: () => Promise<void>) {
  const firstMetrics = await page.metrics();
  console.info(firstMetrics);

  // Trace and save results at a json file
  await page.tracing.start({
    path: TRACING_FILE_PATH,
    screenshots: true,
  });

  const initialTime = performance.now();
  await simulation();
  const finalTime = performance.now();

  console.info(`Time spent in interaction: ${finalTime - initialTime} ms`);

  await page.tracing.stop();

  const lastMetrics = await page.metrics();
  console.info(lastMetrics);
}
