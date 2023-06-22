import { serve } from "./deps.js";
import { configure, renderFile } from "./deps.js";
import { sql } from "../database/database.js";
import * as listService from "../services/listService.js";
import * as listController from "../controllers/listController.js";
import * as itemController from "../controllers/itemController.js";
import { viewStatistics } from "../controllers/statisticsController.js";

import {redirectTo, responseDetails} from "../utils/requestUtils.js";

configure({
  views: `../views`,
});



const handleRequest = async (request) => {
  const data = {
    messages: await listService.activeLists(),
  };
  const url = new URL(request.url);
  console.log(url.pathname);
  console.log(request.method);


  //Shopping lists page request actions
  if (request.method === "GET" && url.pathname === ("/lists")) {
    return await listController.viewActiveLists(request);
  }
  else if(request.method === "POST" && url.pathname === ("/lists")){
    return await listController.addList(request);
  }
  else if(request.method === "POST" && url.pathname.match("/lists/[0-9]+/deactivate")){
    return await listController.deactivateList(request);
  }


  //individual shopping list request actions
  if(request.method === "POST" && url.pathname.match("/lists/[0-9]+/items/[0-9]+/collect")){
    return await itemController.collectItem(request);
  }
  else if(request.method === "POST" && url.pathname.match("/lists/[0-9]+/items")){
    return await itemController.addItem(request);
  }
  else if (request.method === "GET" && url.pathname.match("/lists/[0-9]+")) {
    return await listController.viewActiveList(request);
  }


  if (request.method === "GET" && url.pathname === ("/")) {
    return await viewStatistics(request);
  } 
  return redirectTo("/");
};

serve(handleRequest, { port: 7777 });