const express = require("express");
const cors = require("cors");

const bfhlRoutes = require("./routes/bfhl");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/bfhl", bfhlRoutes);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
