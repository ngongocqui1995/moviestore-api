module.exports = (app) => {
    const image = require('../controllers/uploadImage.controller.js');

    // Tạo 1 collection
    app.post('/dowloadImage', image.dowloadImage);
}