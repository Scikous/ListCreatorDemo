import * as itemService from "../services/itemService.js";
import * as listService from "../services/listService.js";
import { renderFile } from "../shopping-lists/deps.js";
import { redirectTo, responseDetails, getListID } from "../utils/requestUtils.js";

const addItem = async (request) => { //add item to given list
    const listID = await getListID(request);

    const formData = await request.formData();
    const item = formData.get("name");

    await itemService.createItem(item, listID);
    return redirectTo(`/lists/${listID}`);
};

const collectItem = async (request) => {
     const urlParts = new URL(request.url).pathname.split("/");
     const itemID = urlParts[4];
     const listID = await getListID(request);
     console.log("LOL"+itemID);

     await itemService.collectItemByID(itemID,listID);

    return redirectTo(`/lists/${listID}`);
};


const viewItems = async (request) => { //view all items in list
    const listID = await getListID(request);

    const data = {
        list: await itemService.getItems(listID),
    };
    return new Response(await renderFile("list.eta",data), responseDetails);
};

export {addItem, viewItems, collectItem};