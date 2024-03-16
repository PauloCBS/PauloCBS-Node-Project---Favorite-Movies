const express = require("express");
const app = express();
const PORT = 3335;



app.post("/user", (req, res) => {
    const { user } = req.params;

    res.send("Você chamou o POST")

});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));









