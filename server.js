const express = require("express");
const app = express();

// attach modules
require("./cctvName")(app);
require("./musicName")(app);

// only ONE listen here
app.listen(3000, () => console.log("Server UP"));
