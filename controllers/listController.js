import * as listService from "../services/listService.js";
import * as itemService from "../services/itemService.js";
import { renderFile } from "../shopping-lists/deps.js";
import { redirectTo, responseDetails, getListID } from "../utils/requestUtils.js";

const addList = async (request) => { //add list to database
    const formData = await request.formData();
    const list = formData.get("name");

    await listService.createList(list);
    return redirectTo("/lists");
};

const viewActiveLists = async (request) => { //get all lists
    const data = {
        lists: await listService.activeLists(),
    };
    return new Response(await renderFile("lists.eta",data), responseDetails);
};

const viewActiveList = async (request) => { //get specific list
    const listID = await getListID(request);

    const data = {
        list: await listService.findListByID(listID),
        items: await itemService.getItems(listID),
    };
    return new Response(await renderFile("list.eta",data), responseDetails);
};

const deactivateList = async (request) => {
    const listID = await getListID(request);
    await listService.deactivateListByID(listID);
    return redirectTo("/lists");
    
};

 
export {addList, viewActiveLists, viewActiveList, deactivateList};