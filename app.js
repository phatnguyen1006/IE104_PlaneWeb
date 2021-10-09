const express = require('express');
const app = express() // tao 1 express moi
const connectDB = require('./config/db-connect');
connectDB();

// Lib
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
var csurf = require('csurf');
const upload = require('./middlewares/uploads.middleware');

require('dotenv').config(); // to use .env file 
const port = process.env.PORT || 4000;
const favicon  = require('serve-favicon');
const path = require('path');

// blogs
const blogsRoute = require('./routes/blogs/blogs.route');

// auth
const loginRoute = require('./routes/authentication.route/login.route');
const signupRoute = require('./routes/signup.route');
const logoutRoute = require('./routes/authentication.route/logout.route');

// Middleware
const authMiddleware = require('./middlewares/auth.middleware');
const userMiddleware = require('./middlewares/user.middleware');

// Data from database
const { getAirports } = require('./services/QD6.service');


app.set('view engine', 'pug'); //install pug as view
app.set('views', './views'); // view 
app.use(favicon(path.join(__dirname, 'public','logoIcon.ico'))); // favicon
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static('public'));
app.use(cookieParser(process.env.SECRET_COOKIES));
app.use(upload.single('avatar'));
app.use(csurf({ cookie: true }));
app.use(session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: parseInt(process.env.SESSION_TIMEOUT) || 60000000 }
}));
app.use(userMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/login', loginRoute);
app.use('/signup', signupRoute);
app.use('/logout', logoutRoute);

// Blogs
app.use('/blogs', blogsRoute);

app.get('/', async(req, res) => {
    res.render('home', {
        user: res.locals.user,
        Airports: await getAirports()
    });
});

//The 404 Route
app.get('*', function(req, res){
    //res.status(404).send('SORRY!! SOMETHING WRONG!!THIS PAGE WAS NOT FOUND!!!');
    res.render('404')
});

app.listen(port, () => {
    // check if the website is runnig
    console.log(`The app is listening at port ${port}`);
});

