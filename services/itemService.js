import { sql } from "../database/database.js";

const createItem = async (itemName, listID) => {
    await sql`INSERT INTO shopping_list_items (name, shopping_list_id) VALUES (${itemName}, ${listID})`;
};

const getItems = async (listID) => {
    return await sql`SELECT * FROM shopping_list_items WHERE shopping_list_id = ${listID} ORDER BY collected ASC, name ASC`;
};

const collectItemByID = async (itemID,listID) => {
    await sql`UPDATE shopping_list_items SET collected = true WHERE id = ${itemID} AND shopping_list_id = ${listID}`;
};

const getItemsCount = async () => {
    const rows = await sql`SELECT COUNT(*) as total_items FROM shopping_list_items`;
    const total_items = rows[0].total_items;
    return total_items;
};

export { createItem, getItems, collectItemByID, getItemsCount };
