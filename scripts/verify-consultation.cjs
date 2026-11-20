const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const baseURL = process.env.BASE_URL || "http://localhost:3000";
fs.mkdirSync("artifacts", { recursive: true });
(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROMIUM_PATH
      ? { executablePath: process.env.CHROMIUM_PATH }
      : {}),
  });
  try {
    for (const [width, gender] of [
      [1490, "male"],
      [390, "female"],
    ]) {
      const page = await browser.newPage({
        viewport: { width, height: width === 1490 ? 690 : 844 },
      });
      page.setDefaultTimeout(30000);
      const runtimeErrors = [];
      const submissions = [];
      let mode = "success";
      page.on("pageerror", (error) => runtimeErrors.push(error.message));
      // Never create real CRM/database leads during browser checks.
      await page.route("**/api/submissions", async (route) => {
        submissions.push(route.request().postDataJSON());
        await new Promise((resolve) => setTimeout(resolve, 250));
        await route.fulfill({
          status: mode === "server-error" ? 500 : 200,
          contentType: "application/json",
          body: JSON.stringify(
            mode === "not-saved"
              ? {
                  success: true,
                  database: "failed",
                  excel: "not_configured",
                  telecrm: null,
                }
              : mode === "server-error"
                ? { success: false }
                : { success: true, database: "saved" },
          ),
        });
      });
      await page.goto(baseURL, { waitUntil: "networkidle" });
      assert.equal(
        await page.locator(".call-button").getAttribute("href"),
        "tel:+917358034097",
      );
      await page
        .locator(".call-button")
        .evaluate((element) =>
          element.addEventListener("click", (event) => event.preventDefault()),
        );
      await page.locator(".call-button").click();
      assert.equal(await page.getByRole("dialog").count(), 0);
      // Existing evaluation navigation must not open the appointment modal.
      await page.getByLabel("NAME", { exact: true }).fill("Evaluation Test");
      await page.getByLabel("MOBILE NO", { exact: true }).fill("9876543210");
      await page
        .getByLabel("EMAIL ID", { exact: true })
        .fill("evaluation@example.com");
      await page.getByRole("button", { name: "NEXT", exact: true }).click();
      assert.equal(await page.getByRole("dialog").count(), 0);
      await page.locator(".age-option").nth(2).click();
      await page
        .locator(".gender-option")
        .nth(gender === "male" ? 0 : 1)
        .click();
      await page
        .getByRole("button", { name: "LET'S BEGIN", exact: true })
        .click();
      for (let number = 1; number <= 10; number++) {
        await page.locator(`.question-${number}`).waitFor();
        assert.equal(await page.getByRole("dialog").count(), 0);
        await page.locator(".answer-option").first().click();
        if (number === 5 || number === 10)
          await page.locator(".question-step .action-button").click();
      }
      await page
        .getByRole("region", { name: "Evaluation completed" })
        .waitFor();
      const directCall = page
        .locator(".result-actions")
        .getByRole("link", { name: "Call Now", exact: true });
      assert.equal(await directCall.getAttribute("href"), "tel:+917358034097");
      await directCall.evaluate((element) =>
        element.addEventListener("click", (event) => event.preventDefault()),
      );
      await directCall.click();
      assert.equal(await page.getByRole("dialog").count(), 0);
      await page.waitForTimeout(300);
      submissions.length = 0;
      await page.locator(".result-actions button").click();
      let modal = page.getByRole("dialog", {
        name: "Book Hair Consultation With Trichologist",
      });
      await modal.waitFor();
      await page.evaluate(() => document.fonts.ready);
      await modal
        .locator("img")
        .evaluateAll((images) =>
          Promise.all(images.map((image) => image.decode().catch(() => {}))),
        );
      assert.equal(await modal.getByRole("radio").count(), 5);
      assert.equal(await modal.locator("img").count(), 2);
      assert.equal(await modal.locator("[data-stage-illustration]").count(), 5);
      assert.equal(
        (
          await page.request.get(baseURL + "/consultation/stage-atlas.png")
        ).status(),
        200,
      );
      const badImages = await modal
        .locator("img")
        .evaluateAll((images) =>
          images
            .filter((image) => !image.naturalWidth)
            .map((image) => image.src),
        );
      assert.deepEqual(badImages, []);
      assert.equal(
        await page.evaluate(() => document.body.style.overflow),
        "hidden",
      );
      assert.equal(
        await modal
          .locator("section")
          .evaluate((element) => element.scrollWidth <= element.clientWidth),
        true,
      );
      await page.screenshot({
        path: `artifacts/consultation-${gender}.png`,
        fullPage: true,
      });
      await modal.getByLabel("Full Name", { exact: true }).fill("");
      await modal.getByLabel("Phone Number", { exact: true }).fill("");
      await modal
        .getByRole("button", { name: "Book Your Appointment Now" })
        .click();
      assert.equal(submissions.length, 0);
      assert.equal(await modal.locator('[aria-invalid="true"]').count(), 9);
      await modal.getByLabel("Full Name", { exact: true }).fill("Popup Test");
      await modal
        .getByLabel("Phone Number", { exact: true })
        .fill("1234567890");
      await modal
        .getByLabel("What Are Your Concerns", { exact: true })
        .selectOption("Hair Fall");
      await modal.getByLabel("6-Digit Pincode", { exact: true }).fill("012345");
      await modal.getByText("S3 - Moderate thinning", { exact: true }).click();
      await modal
        .getByRole("button", { name: "Book Your Appointment Now" })
        .click();
      assert.equal(submissions.length, 0);
      assert.equal(await modal.locator('[aria-invalid="true"]').count(), 2);
      await modal
        .getByLabel("Phone Number", { exact: true })
        .fill("9876543210");
      await modal.getByLabel("6-Digit Pincode", { exact: true }).fill("600001");
      mode = "not-saved";
      await modal
        .getByRole("button", { name: "Book Your Appointment Now" })
        .click();
      await modal.getByRole("alert").waitFor();
      assert.ok(
        (await modal.getByRole("alert").innerText()).includes(
          "couldn't confirm",
        ),
      );
      assert.equal(await modal.getByRole("status").count(), 0);
      mode = "server-error";
      await modal
        .getByRole("button", { name: "Book Your Appointment Now" })
        .click();
      await modal
        .getByRole("button", { name: "Book Your Appointment Now" })
        .waitFor();
      assert.ok(await modal.getByRole("alert").isVisible());
      mode = "success";
      await modal
        .getByRole("button", { name: "Book Your Appointment Now" })
        .click();
      assert.equal(
        await modal.getByRole("button", { name: "Submitting..." }).isDisabled(),
        true,
      );
      await modal.getByRole("status").waitFor();
      assert.ok(
        (await modal.getByRole("status").innerText()).includes("Popup Test"),
      );
      assert.equal(submissions.length, 3);
      const saved = submissions[2];
      assert.equal(saved.name, "Popup Test");
      assert.equal(saved.phone, "9876543210");
      assert.equal(saved.source, "Consultation Modal");
      assert.equal(saved.answers.consultation.pincode, "600001");
      assert.equal(saved.answers.consultation.hairLossStage, "stage3");
      assert.equal(
        saved.answers.consultation.trigger,
        "Results Book Your Consultation",
      );
      assert.ok(
        saved.concern.includes(
          "Hair Fall | Pincode: 600001 | Hair loss stage: S3",
        ),
      );
      await modal.getByRole("button", { name: "Done", exact: true }).click();
      assert.equal(await page.getByRole("dialog").count(), 0);
      assert.equal(await page.evaluate(() => document.body.style.overflow), "");
      assert.equal(
        await page
          .locator(".result-actions button")
          .evaluate((element) => element === document.activeElement),
        true,
      );
      await page.locator(".result-actions button").click();
      await page.keyboard.press("Escape");
      assert.equal(await page.getByRole("dialog").count(), 0);
      await page.locator(".result-actions button").click();
      await page
        .getByRole("button", { name: "Close consultation form" })
        .click();
      assert.equal(await page.getByRole("dialog").count(), 0);
      if (width === 1490) {
        await page.locator(".result-actions button").click();
        await page.mouse.click(5, 5);
        assert.equal(await page.getByRole("dialog").count(), 0);
      }
      for (const button of ["Book Your Consultation"]) {
        await page
          .locator(".result-actions")
          .getByRole("button", { name: button, exact: true })
          .click();
        modal = page.getByRole("dialog");
        await modal.waitFor();
        assert.equal(
          await modal.getByLabel("Full Name", { exact: true }).inputValue(),
          "Evaluation Test",
        );
        assert.equal(
          await modal.getByLabel("Phone Number", { exact: true }).inputValue(),
          "9876543210",
        );
        await modal
          .getByRole("button", { name: "Close consultation form" })
          .click();
      }
      assert.deepEqual(runtimeErrors, []);
      console.log(
        `PASS ${width}px: matching assets, popup validation, confirmed/failed saves, keyboard/backdrop/close, focus restoration, all 10 evaluation steps, booking popup and direct phone links.`,
      );
      await page.close();
    }
    console.log("All submissions were mocked; no real leads were created.");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
