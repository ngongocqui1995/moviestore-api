module.exports = (app) => {
    const collection = require('../controllers/collectionah.controller.js');
  
    // Lấy tất cả các thể loại
    app.get('/collectionah/categories', collection.getAllCategory);

    // lấy danh sách từng bộ phim
    app.post('/collectionah/listmovie', collection.getAllMovie);

    // Lấy số trang danh sách phim
    app.post('/collectionah/page/listmovie', collection.getNumberPage);
    
    // Lấy thông tin của từng tập phim
    app.get('/collectionahinformation/phim/:keyCollection', collection.getInformationCollection);

    // Lấy từng tập trong 1 bộ phim
    app.get('/collectionah/phim/:keyCollection', collection.getAllEpisodes);

    // Lấy link video
    app.get('/collectionah/video/phim/:keyCollection', collection.getLinkVideo);

}