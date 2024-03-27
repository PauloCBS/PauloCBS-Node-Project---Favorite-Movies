const AppError = require('../utils/AppError');
const sqliteConnection = require('../database/sqlite');
const { hash, compare } = require('bcryptjs');

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

    async update(req, res){
        const { name, email, password, old_password } = req.body;
        const { id } = req.params

        const database = await sqliteConnection();
        const user = await database.get("SELECT * FROM users WHERE id = (?)", [id]);

        if(!user){
            throw new AppError("User not found");
        }

        const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email])

        if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
            throw new AppError("E-mail already in use");
        }

        user.name = name ?? user.name;
        user.email = email ?? user.email;

        if(password && !old_password){

            throw new AppError("You need to inform the old password to set a new password");
        }

        if(password && old_password){
            const checkOldPassword = await compare(old_password, user.password);

            if(!checkOldPassword){
                throw new AppError("Old password does not match");
            }

            user.password = await hash(password, 8);


            
        }
        
        await database.run(`
                UPDATE users SET
                name = ?,
                email = ?,
                password = ?,
                updated_at = DATETIME('now')
                WHERE id = ?`,
                [user.name, user.email, user.password, id]
         )

        

        
        return res.status(200).json()
    }

}

module.exports = UserController