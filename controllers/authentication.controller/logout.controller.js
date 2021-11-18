//Function: logout 
//Input: nothing 
//Output: clear cookie 
module.exports.logout = (req, res) => {
    console.log('User logout!!!');
    res.clearCookie('userId');
    res.redirect('/');
}