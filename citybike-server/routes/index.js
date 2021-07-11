const express = require("express");
const router = express.Router();
const cors = require("cors");

const statistics = {
  "main_used": [
    {"name": "606 - S Bayshor Dr & Aviation Ave", "day": "2021-06-24", "money": "US$ 234.454"},
    {"name": "608 - City Hall", "day": "2021-06-24", "money": "US$ 278.912"},
    {"name": "612 - SE Brickell Ave & 25th Rd", "day": "2021-06-24", "money": "US$ 134.432"},
    {"name": "616 - 150 SW 15th Road", "day": "2021-06-24", "money": "US$ 230.604"},
  ],
  "main_void": [
      {"name": "617 - S Miami Ave & 13th Street", "day": "2021-07-10", "money": "US$ 420.085"},
      {"name": "618 - SE 5th Street & Brickell Ave", "day": "2021-07-10", "money": "US$ 156.043"},
      {"name": "620 - 14th Street & SE Brickell Ave", "day": "2021-07-10", "money": "US$ 220.572"},
      {"name": "621 - SE 14th St & S Miami Ave", "day": "2021-07-10", "money": "US$ 350.050"},
  ]
};



router.get("/statistics", cors(), (req, res) => {
  console.log("entra");
  res.status(200).send({ success: true, body: statistics });
});

module.exports = router;