

const Admin = require('../models/admin.model');


// @Function: Get all admin
// @Input: no 
// @Output: all document admin
// @Last modified day: 30/05/2021
async function getAllAdmin() {

    const allAdmin = await Admin.find((err) => {

        if(!err) console.log("Get all admin successful!");

        else console.log("Get all admin failed!");
    });

    return allAdmin;
}

// @Function: Get One admin
// @Input: object data contain document field belong to admin
// @Output: ducument match with data or null if not found
// @Last modified day: 30/05/2021
async function getOneAdmin(data) {

    const admin = await Admin.findOne(data, (err) => {
        if (!err) console.log("Get one admin successful!");
        else console.log("Get one admin failed!");
    });

    return admin;
}

// @Function: Add admin 
// @Input: object data is document admin contain all field in admin.model
// @Output: data/ null if add fail
// @Last modified day: 30/05/2021
async function addAdmin(data) {
       
    try {

        const newAdmin = new Admin(data);
    
        const saveAdmin = await newAdmin.save();

        if(saveAdmin) console.log("Add admin successful!");
            
        else console.log("Add admin failed!");

        return newAdmin;

    } catch (error) {
        
        console.log(error.message)
    }

}

// @Function: Update info admin
// @Input: object data contain field of admin need to update
// @Output: ducument admin after update/ null if can't update
// @Last modified day: 30/05/2021
async function updatedAdmin(id, data) {

    const updatedInfo = await Admin.findByIdAndUpdate(
        id,
        data,
       {
        new: true, 
    },(err) => {

        if(!err) console.log("Update admin successful!");
        
        else console.log("Update admin failed!");
    });

    return updatedInfo;
}


// @Fucntion: Delete Admin 
// @Input: id is _id of document admin need to delete
// @Output: ducument admin after delete/ null if can't delete
// @Last modified day: 30/05/2021
async function deletedAdmin(id) {

    // Counting number of   documents in collection
    const count = await User.estimatedDocumentCount({});
    if( count === 1) {

        console.log("Can't delete all Admin");
        return;
    }
    const deletedOne = await Admin.findByIdAndDelete(id,(err) => {

        if(!err) console.log("Delete admin successful!");
        
        else console.log("Delete admin failed!");
    });
    return deletedOne;  
}


// @Modules export

module.exports = {
    getAllAdmin,
    addAdmin,
    updatedAdmin,
    deletedAdmin,
    getOneAdmin
};






