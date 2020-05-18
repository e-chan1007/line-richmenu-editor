const fetch = require("node-fetch");

export default function(req, res) {
  fetch(`https://api.line.me/v2/bot/richmenu/${req.query.richmenu_id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${req.query.access_token}`
    }
  })
    .then((response) => {
      if (response.status !== 200) {
        res.status(response.status);
      }
      return response.json();
    })
    .then((json) => {
      res.json({ delete: json });
    })
    .catch((reason) => {
      res.status(500);
      res.json(reason);
    });
}
