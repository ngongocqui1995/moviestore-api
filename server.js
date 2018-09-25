const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// create express app
const app = express();
var cors = require('cors');
module.exports = app; // for testing

// var config = {
//   appRoot: __dirname // required config
// };

// parse requests of content-type - application/json
app.use(bodyParser.json({limit: '50mb'}));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

require('./app/routes/collection.routes.js')(app);
require('./app/routes/collectiontv.routes.js')(app);
require('./app/routes/uploadImage.routes.js')(app);

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url)
.then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."});
});

// listen for requhttps://swagger.io/docs/specification/data-models/data-types/ests
app.listen(process.env.PORT || 3004, () => {
    console.log("Server is listening on port 3004");
});