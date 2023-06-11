const { Builder, By, Key, until } = require("selenium-webdriver");
const assert = require("assert");

async function runTests() {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    // Test Case 1: Verify page title
    await driver.get("http://localhost:3000");
    const pageTitle = await driver.getTitle();
    assert.strictEqual(pageTitle, "Secrets");

    // Test Case 2: Verify presence of register button
    const registerButton = await driver.findElement(By.linkText("Register"));
    assert(await registerButton.isDisplayed());
    assert(await registerButton.isEnabled());

    // Test Case 3: Verify presence of login button
    const loginButton = await driver.findElement(By.linkText("Login"));
    assert(await loginButton.isDisplayed());
    assert(await loginButton.isEnabled());

    console.log("Test case 1 passed.");
  } catch (error) {
    console.error("Test case 1 failed:", error);
  }
  try {
    const registerButton1 = await driver.findElement(
      By.className("btn btn-light btn-lg")
    );
    await registerButton1.click();

    // Test Case 1: Verify presence of email input field
    const emailInput = await driver.findElement(By.css("input[type='email']"));
    assert(await emailInput.isDisplayed());

    // Test Case 2: Verify presence of password input field
    const passwordInput = await driver.findElement(
      By.css("input[type='password']")
    );
    assert(await passwordInput.isDisplayed());

    // Test Case 3: Verify presence of register button
    const registerButton = await driver.findElement(
      By.css("button[type='submit']")
    );
    assert(await registerButton.isDisplayed());
    assert(await registerButton.isEnabled());

    const pageTitleElement = await driver.findElement(By.css("h1"));
    const pageTitleText = await pageTitleElement.getText();
    assert.strictEqual(pageTitleText, "Register");

    console.log("Test case 2 passed.");
  } catch (error) {
    console.error("Test case 2 failed:", error);
  }

  try {
    // Test Case 1: Fill in the login form and verify the expected behavior
    await driver.get("http://localhost:3000/register");
    const usernameInput = await driver.findElement(
      By.css("input[name='username']")
    );
    const passwordInput = await driver.findElement(
      By.css("input[name='password']")
    );
    const loginButton = await driver.findElement(
      By.css("button[type='submit']")
    );

    // Fill in the form inputs
    await usernameInput.sendKeys("humza100@gmail.com");
    await passwordInput.sendKeys("password123");

    // Click the Login button
    await loginButton.click();

    // Verify the expected behavior after logging in
    const pageTitleElement = await driver.findElement(By.css("h1"));
    const pageTitleText = await pageTitleElement.getText();
    assert.strictEqual(pageTitleText, "My Darkest Secrets!!!");

    console.log("Test case 3 passed.");
  } catch (error) {
    console.error("Test case 3 failed:", error);
  } finally {
    // Quit the WebDriver
    await driver.quit();
  }
}

runTests();
