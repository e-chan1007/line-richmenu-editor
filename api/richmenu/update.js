const fetch = require("node-fetch");

export default function(req, res) {
  console.log(req.query);
  switch (req.query.action) {
    case "set_default":
      fetch(
        `https://api.line.me/v2/bot/user/all/richmenu/${req.query.richmenu_id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${req.query.access_token}`
          }
        }
      )
        .then((response) => {
          if (response.status !== 200) {
            res.status(response.status);
          }
          return response.json();
        })
        .then((json) => {
          res.json({ setDefault: json });
        })
        .catch((reason) => {
          res.status(500);
          res.json(reason);
        });
      break;
  }
}
