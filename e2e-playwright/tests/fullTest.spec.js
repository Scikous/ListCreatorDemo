const { test, expect } = require("@playwright/test");

let shoppingListID; //required for navigation to shopping list page
let shoppingListName; //required for navigation to shopping list page

test("Main page has expected titles, statistics and navigation", async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector('h1'); //page should've loaded completely

  await expect(page).toHaveTitle("Shared shopping lists");
  await expect(page.locator('h1')).toHaveText("Shared shopping lists");

  //statistics no data or some data if shopping lists exist or not
  await expect(page.locator('h2')).toHaveText("No shopping lists yet.");
  
  //test navigation to /lists through main page
  await page.locator(`a >> text="Lists"`).click();
  const listsPath = new URL(page.url()).pathname;
  await expect(listsPath==='/lists').toBe(true);
});


test("Shopping lists page has expected title, path, list creation functionality", async ({ page }) => {
  await page.goto("/lists");
  await page.waitForSelector('h1'); //page should've loaded completely

  await expect(page).toHaveTitle("Shopping lists");
  await expect(page.locator('h1')).toHaveText("Shopping lists");


  const shoppingLists = ['groceries', 'pets', 'vehicles', 'weapons', 'sweets', "power tools"];

  //test list creation and redirection
  for (const shoppingList of shoppingLists) {
    //try to create list
    await page.locator("input[type=text]").type(shoppingList);
    await page.locator("input[type=submit][value=Create]").click();
  }
  await postRedirectGetTester({ page });
});

test("Navigation to individual shopping page works", async ({ page }) => {
  await page.goto("/lists");//navigation can only happen from here to an individual list
  await page.waitForSelector('h1'); //page should've loaded completely
  await expect(page.locator('h1')).toHaveText("Shopping lists");

  //go to a random shopping list
  const links = await page.$$('a');
  const randomIndex = Math.floor(Math.random() * (links.length-1))+1; // choose random list to navigate to, avoid choosing Main Page link
  const link = links[randomIndex];
  shoppingListName = await link.textContent();
  await link.click();

  //if path and name correct, then navigation worked
  const listPath = new URL(page.url()).pathname;
  const pathParts = listPath.split('/');
  shoppingListID = pathParts[pathParts.length - 1];
  await expect(listPath===`/lists/${shoppingListID}`).toBe(true);
  await expect(page.locator('h1')).toHaveText(`${shoppingListName}`); //if name exists then navigation worked
});

test("Individual shopping list page has expected item creation and collecting functionality", async ({ page }) => {
  await page.goto(`/lists/${shoppingListID}`);
  await page.waitForSelector('h1'); //page should've loaded completely
  await expect(page.locator('h1')).toHaveText(`${shoppingListName}`);
  
  const shoppingListItems = ['apple', 'banana', 'crow', 'cherry', 'monke', 'dragon', 'Airplane','Arrow','raven','cinnamon  roll', "cinnamon boll", "Joker"];
  //create items
  for (const item of shoppingListItems) {
    //try to create item
    await page.waitForSelector(`input[type=submit][value="Add Item"]`); //if add item exists then presume text box also exists
    await page.locator("input[type=text]").type(item);
    await page.locator(`input[type=submit][value="Add Item"]`).click();
  }
  await postRedirectGetTester({ page });

  //collect items
  const lowerBound = Math.floor(Math.random() * (shoppingListItems.length-6)); //at max half are collected

  for (const item of shoppingListItems.slice(lowerBound, shoppingListItems.length)) {
    //try to collect item
    await page.waitForSelector(`input[type=submit][value="Mark Collected!"][name="${item}"]`);
    await page.locator(`input[type=submit][value="Mark Collected!"][name="${item}"]`).nth(0).click();  // if duplicates exist only try the first one
  }
});

test("Individual shopping list page has expected item display order, and navigation back to lists works", async ({ page }) => {
  await page.goto(`/lists/${shoppingListID}`);
  await page.waitForSelector('h1'); //page should've loaded completely
  await expect(page.locator('h1')).toHaveText(`${shoppingListName}`);

  //get both the collected and non collected items
  const delElements = await page.$$('del');
  const allItems = await elementsGetter({page}, "h3");

  const delItems = await Promise.all(delElements.map((element) => element.textContent()));
  const noDelItems= allItems.filter((text) => !delItems.includes(text)); //removes all <del> items from allItems

  //check if items are sorted in alphabetical ordser
  const removeWhitespace = (text) => text.replace(/\s/g, ''); // Remove all whitespace characters

  const isNoDelSorted = noDelItems.every((text, index) => index === 0 || removeWhitespace(text).localeCompare(removeWhitespace(noDelItems[index - 1])) >= 0);
  const isDelSorted=  delItems.every((text, index) => index === 0 || removeWhitespace(text).localeCompare(removeWhitespace(delItems[index - 1])) >= 0);

  await expect(isNoDelSorted && isDelSorted).toBe(true);

  // test navigation back to /lists from shopping list page
  await page.locator(`a >> text="Shopping Lists"`).click();
  const path = new URL(page.url()).pathname;
  await expect(path==='/lists').toBe(true);
});


test("Shopping lists page has expected list deactivation and navigation functionalities", async ({ page }) => {
  await page.goto("/lists");
  await page.waitForSelector('h1'); //page should've loaded completely

  await expect(page).toHaveTitle("Shopping lists");
  await expect(page.locator('h1')).toHaveText("Shopping lists");
  
  //test list deactivation and redirection
  const initShoppingLists = await elementsGetter({page}, "h3");
  const lowerBound = Math.floor(Math.random() * (initShoppingLists.length-3)); //at max half are deactivated
  
  //try to deactivate lists
  for (const shoppingList of initShoppingLists.slice(lowerBound, initShoppingLists.length)) {
    //await page.waitForSelector(`input[type=submit][value="Deactivate list!"][name="${shoppingList}"]`);
    await page.locator(`input[type=submit][value="Deactivate list!"][name="${shoppingList}"]`).nth(0).click();  // if duplicates exist only try the first one
  }
  await postRedirectGetTester({ page });

  const finalShoppingLists = await elementsGetter({page}, "h3");
  await expect(finalShoppingLists.length).toBeLessThan(initShoppingLists.length); //if final less than init, then successfully deactivated lists.

  // test navigation back to main page through /lists
  await page.locator(`a >> text="Main Page"`).click();
  const path = new URL(page.url()).pathname;
  await expect(path==='/').toBe(true);
});

test("Main page has expected statistics", async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector('h1'); //page should've loaded completely

  await expect(page).toHaveTitle("Shared shopping lists");
  await expect(page.locator('h1')).toHaveText("Shared shopping lists");

  //statistics has some data
  const statisticsText = await elementsGetter({page}, 'h2');
  const shoppingListsPattern = /Shopping lists: [0-9]+/;
  const shoppingListItemsPattern = /Shopping list items: [0-9]+/;

  for (const text of statisticsText) {
    expect(shoppingListsPattern.test(text) || shoppingListItemsPattern.test(text)).toBe(true); //both patterns should match otherwise problem
  }
});

/* Helper functions */
//get elements data (all of the individual links,texts, etc.)
const elementsGetter = async ({page}, tag) =>{
  const elementsRaw = await page.$$(tag);
  const elements = await Promise.all(elementsRaw.map((element) => element.textContent()));
  return elements;
}

//reloading page should not resubmit form
const postRedirectGetTester = async ({ page }) => { //reloading page should not resubmit form
  const initObjCount = await elementsGetter({page}, "h3"); //shopping lists or item amounts
  await page.reload();
  const finalObjCount = await elementsGetter({page}, "h3");
  await expect(finalObjCount.length).toBe(initObjCount.length); //after page reload link count should be the same, if not then expect that the form was resubmitted.
};


