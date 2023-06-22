import { sql } from "../database/database.js";

const createList = async (listName) => {
    await sql`INSERT INTO shopping_lists (name) VALUES (${listName})`;
};

const activeLists = async () => {
    return await sql`SELECT * FROM shopping_lists WHERE active = true`;
};

const findListByID = async (id) =>{
    
    const rows = await sql`SELECT * FROM shopping_lists WHERE id = ${id}`;
    if(rows && rows.length > 0){
        return rows[0];
    }
    return{id: 0, name:"Unknown"}
};

const deactivateListByID = async (id) =>{
    await sql`UPDATE shopping_lists SET active = false WHERE id = ${id}`;
};
const getListsCount = async () => {
    const rows = await sql`SELECT COUNT(*) as total_count FROM shopping_lists`;
    const total_count = rows[0].total_count;
    return total_count;
};

export { createList, activeLists, findListByID, deactivateListByID, getListsCount};
