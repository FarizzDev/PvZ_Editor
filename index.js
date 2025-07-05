const puppeteer = require("puppeteer");
const path = require("path");

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  try {
    await page.goto("https://pvsz2.ru/editor/en", {
      waitUntil: "networkidle2",
      timeout: 60_000,
    });

    const fileInput = await page.$('input[name="f-editor-rton"]');
    const submitFile = await page.$('button[name="f-editor-upload"]');

    await fileInput.uploadFile(path.resolve(__dirname, "pp.dat"));

    await page.evaluate(() => {
      document
        .querySelector('input[name="f-editor-rton"]')
        .dispatchEvent(new Event("change", { bubbles: true }));
    });

    await delay(232);
    await page.screenshot({ path: "./result/edi.png", fullPage: true });
    await submitFile.click();
    await delay(500);

    console.log({
      browserCookies: await browser.cookies(),
      pageCookies: await page.cookies(),
    });

    await page.$eval(
      "form",
      (el) =>
        (el.action =
          "https://connectors-put-contribution-infant.trycloudflare.com/"),
    );

    await page.click("button[name='f-editor-download']");

    console.log(page.url());
    await page.screenshot({ path: "./result/editor.png" });
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await browser.close();
  }
})();

async function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
