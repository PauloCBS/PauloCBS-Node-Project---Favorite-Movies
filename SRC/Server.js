require("express-async-errors");

const express = require("express");
const routes = require("./routes");
const app = express();
const PORT = 3335;
const AppError = require("./utils/AppError");
const migrationsRun = require("./database/sqlite/migrations");


app.use(express.json()); 
//it is necessaary to identify the type of request isnide the body. 
app.use(routes); 
app.use((error, req, res, next) => {
    if(error instanceof AppError){
        return res.status(error.statusCode).json({
            status: "error",
            message: error.message
        });
    }

    return res.status(500).json({
        status: "error",
        message: "internal server error"
    })
});


migrationsRun()

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));










