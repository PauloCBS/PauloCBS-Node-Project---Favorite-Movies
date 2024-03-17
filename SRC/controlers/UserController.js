const AppError = require('../utils/AppError');

class UserController{

    create(req, res){
        const { name, email, password } = req.body;


        if(!name){
            throw new AppError('Name is required');
        }
        res.status(201).json({ name, email, password });
    }

}

module.exports = UserController