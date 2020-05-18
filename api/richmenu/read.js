const fetch = require("node-fetch");
const FileType = require("file-type");

export default function(req, res) {
  let statusCode = 200;
  fetch(`https://api.line.me/v2/bot/richmenu/${req.query.richmenu_id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${req.query.access_token}`
    }
  })
    .then((response) => {
      statusCode = response.status;
      if (response.status !== 200) {
        res.status(response.status);
        if (response.status === 404) {
          return;
        }
      }
      return response.json();
    })
    .then((json) => {
      if (statusCode !== 200) {
        res.json({ menu: json });
      } else {
        fetch(
          `https://api-data.line.me/v2/bot/richmenu/${req.query.richmenu_id}/content`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${req.query.access_token}`
            }
          }
        )
          .then((response) => {
            statusCode = response.status;
            if (response.status !== 200) {
              res.status(response.status);
            }
            return response.buffer();
          })
          .then((buffer) => {
            (async () => {
              const fileType = await FileType.fromBuffer(buffer);
              res.json({
                menu: json,
                image: `data:${fileType.mime};base64,${buffer.toString(
                  "base64"
                )}`
              });
            })();
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
