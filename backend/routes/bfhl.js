const express = require("express");
const router = express.Router();
const processData = require("../utils/processData");

router.post("/", (req, res) => {
    const result = processData(req.body.data);

    res.json({
        user_id: "shruti_24062026",
        email_id: "shruti2369.be23@chitkara.edu.in",
        college_roll_number: "2310992369",
        ...result
    });
});

module.exports = router;
