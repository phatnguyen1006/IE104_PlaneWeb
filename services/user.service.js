
// @Require every user Schema from user.model
const Users = require('../models/user.model');
 

// @Function: Get all users from db
// @Input: no
// @Output: array of user/ null if get fail
// @Last modified day: 30/05/2021
async function getAllUser() {

    const users = await Users.find((err) => {

        if(!err) console.log("Get all user successful!");
        
        else console.log("Get all user failed!");
    });

    return users;
}

// @Function: Find user from db
// @Input: object info contain field of user need to find
// @Outpt: array ducument user if found/ null if not found
// @Last modified day: 30/05/2021
async function findUser(info){

    const userFound = await Users.find(info,(err) => {

        if(!err) console.log("Find  user successful!");
        
        else console.log("Find user failed!");
    });

    return userFound;
}

// @Function: Find one user from db
// @Input: object info contain field of user need to find
// @Outpt: ducument user if found/ null if not found
// @Last modified day: 30/05/2021
async function findOneUser(data){

    const userFound = await Users.findOne(data,(err) => {

        if(!err) console.log("Find  user successful!--User Login");
        
        else console.log("Find user failed!");
    });

    return userFound;
}

// @Fucntion: Add user
// @For register account
// @Input: object data contain all field of user need to add
// @Output: ducument user add sucess/ null if add fail
// @Last modified day: 30/05/2021
async function addUser(data) {
    
    try {

        const newUser = new Users(data);

        const saveUser = await newUser.save();

        if(saveUser) console.log('Register successful!');       
        else    console.log('Register unsuccessful!');

        return saveUser;

    } catch (error) {
        
        console.log(error.message)
    }
    
}

// @Function: Update data user
// @Input: object data contain  field of user need to update
// @Output: ducument user after update sucess/ null if update fail
// @Last modified day: 30/05/2021
async function updateUserById(id, data) {
    
    const userUpdated = await Users.findOneAndUpdate({
        _id: id,
    }, data, {
        new: true, 
    },(err) => {

        if(!err) console.log("Update user successful!");
        
        else console.log("Udate user failed!");
    });

    return userUpdated;
}


// @Modules export

module.exports = {
    getAllUser,
    findUser,
    findOneUser,
    addUser,
    updateUserById,
};

