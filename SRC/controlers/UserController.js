const AppError = require('../utils/AppError');
const sqliteConnection = require('../database/sqlite');
const { hash } = require('bcryptjs');

class UserController{

    async create(req, res){
        const { name, email, password } = req.body;

        const database = await sqliteConnection();
        const checUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email]);
        const passwordHash = await hash(password, 8);


         if (checUserExists){
            throw new AppError('Email already exists');
        }  
        
        await database.run(
            "INSERT INTO users (name, email, password) VALUES(?, ?, ?)", [name, email, passwordHash]
        )
        
        return res.status(201).json("User created");
        
        
    }

}

module.exports = UserController