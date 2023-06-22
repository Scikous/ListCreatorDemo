const responseDetails = {
    headers: { "Content-Type": "text/html;charset=UTF-8" },
  };
  
  const redirectTo = (path) => {
    return new Response("-", {
      status: 303,
      headers: {
        "Location": path,
      },
    });
  };

  const getListID = (request) => {
    const urlParts = new URL(request.url).pathname.split("/");
    const listID = urlParts[2];

    return listID;
  }

  

  export {redirectTo, responseDetails, getListID};