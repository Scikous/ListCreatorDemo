import * as listService from "../services/listService.js";
import * as itemService from "../services/itemService.js";
import { renderFile } from "../shopping-lists/deps.js";
import { redirectTo, responseDetails, getListID } from "../utils/requestUtils.js";

const viewStatistics = async (request) =>{
    const data = {
        listsCount: await listService.getListsCount(),
        itemsCount: await itemService.getItemsCount(),
    };
    return new Response(await renderFile("index.eta",data), responseDetails);
};

export {viewStatistics};