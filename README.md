# ListCreatorDemo

## Info
This is a simple web application that can be run locally. In this, one can create lists and items for said lists and collect said items (the default text assumes shopping list). On the Main Page, one can see how many shopping lists exist in the database and how many items exist in the database as a whole.

## Requirements
* Docker
* Postgresql-Client
* Deno

## How To Use
Open up a terminal at the root of the directory where you have project at (inside the ListCreatorDemo directory).

### Step 1:
Use the following command (--build is only required if this is the first time or significant changes have been made to the project):

```
docker-compose up (--build)
```

### Step 2:
Open up a web browser and navigate to `localhost:7777`


### Step 3:
Have fun exploring!

#### Main Page/Shared Shopping Lists
`Lists` link goes to the `Shopping lists` page, where one can create their own shopping lists
#### Shopping lists
`Main Page` goes back to the `Shared Shopping Lists` page
`Create List!` will create the list assuming it has a name (name MUST have at least one character)
`<list name>` these links will appear when creating a shopping list and will lead to the associated shopping list page
`Deactivate list` will "archive" the list in the database, and will not appear again on this page
#### Shopping list
All of the items here will appear in alphabetical order, and those items that have been `collected` will appear below all of the `uncollected` items in alphabetical order.

`Shopping Lists` goes back to the `Shopping lists` page
`Add Item` will create an item and add it to the associated shopping list
`Mark Collected` will "collect" the item (striking it through)

## Running Automated Tests
**!** WARNING: Running these tests will wipe out all entries from the local database

Using the following command in the terminal will run the automated tests located in `e2e-playwright\tests\fullTest.spec.js`:

```
docker-compose run --entrypoint=npx e2e-playwright playwright test && docker-compose rm -sf
```
