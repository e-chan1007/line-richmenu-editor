const fetch = require("node-fetch");
export default function(req, res) {
  let statusCode = 200;
  fetch("https://api.line.me/v2/bot/richmenu", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${req.body.accessToken}`,
      "Content-Type": "application/json"
    },
    body: req.body.json
  })
    .then((response) => {
      statusCode = response.status;
      if (response.status !== 200) {
        res.status(response.status);
      }
      return response.json();
    })
    .then((json) => {
      if (statusCode !== 200) {
        res.json({ create: json });
      } else {
        const buffer = Buffer.from(req.body.image.split(",")[1], "base64");
        const mimeType = req.body.image.match(/(:)([a-z/]+)(;)/)[2];

        fetch(
          `https://api-data.line.me/v2/bot/richmenu/${json.richMenuId}/content`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${req.body.accessToken}`,
              "Content-Type": mimeType
            },
            body: buffer
          }
        )
          .then((response) => {
            statusCode = response.status;
            if (response.status !== 200) {
              res.status(response.status);
            }
            return response.json();
          })
          .then((json2) => {
            res.json({ create: json, image: json2 });
          })
          .catch((reason) => {
            res.status(500);
            res.json(reason);
          });
      }
    })
    .catch((reason) => {
      res.status(500);
      res.json(reason);
    });
}
