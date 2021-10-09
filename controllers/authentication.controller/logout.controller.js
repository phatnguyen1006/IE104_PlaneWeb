//Function: logout 
//Input: nothing 
//Output: clear cookie 
//Last modified day: 19/5/2021
module.exports.logout = (req, res) => {
    console.log('User logout!!!');
    res.clearCookie('userId');
    res.redirect('/');
}