export default function(req, res) {
  switch (req.method) {
    case "POST":
      require("./richmenu/create.js").default(req, res);
      break;
    case "GET":
      require("./richmenu/read.js").default(req, res);
      break;
    case "PATCH":
      require("./richmenu/update.js").default(req, res);
      break;
    case "DELETE":
      require("./richmenu/delete.js").default(req, res);
      break;
  }
}
