module.exports = (app) => {
    const collection = require('../controllers/collection.controller.js');

    // Lấy tất cả collection mới cập nhật giới hạn số lượng
    app.post('/v1/collection/limit', collection.findAllCollectionLimit);




    // Tạo 1 collection
    app.post('/collection', collection.create);

    // Lấy tất cả collection mới cập nhật
    app.get('/collection', collection.findAll);

    // Lấy tất cả collection giới hạn số lượng
    app.get('/collection/limit/:limit', collection.findAllLimit);

    // Lấy tất cả collection mới cập nhật theo thể loại
    app.get('/collection/categories/:keyCategory', collection.findAllCollectionCategory);

    // Lấy tất cả collection mới cập nhật giới hạn số lượng theo thể loại
    app.get('/collectionLimit/categories/:keyCategory/:limit', collection.findAllCollectionCategoryLimit);
	
	// Lấy tất cả collection
    app.get('/collectionAll', collection.findAllCollection);

    // Lấy 1 collection theo id
    app.get('/collection/:collectionId', collection.findOne);

    // Lấy 1 collection theo key
    app.get('/collection/key/:collectionKey', collection.findOneFromKey);
	
	// Lấy 1 collection theo id
    app.get('/collectionAll/:collectionId', collection.findOneCollection);

    // Sửa 1 collection
    app.put('/collection/:collectionId', collection.update);

    // Xoá 1 collection
    app.delete('/collection/:collectionId', collection.delete);

    // Thêm 1 tập trong collection
    app.put('/addEpisodes/:collectionId', collection.addEpisodes);

    // Xóa 1 tập trong collection
    app.put('/removeEpisodes/:collectionId', collection.removeEpisodes);

    // phân trang collection
    app.get('/pageCollection/:numberPage/:quantity', collection.getPage);

    // lấy top lượt xem nhiều nhất trong ngày
    app.get('/collection/topView/day/:quantity', collection.findTopViewDay)

    // lấy top lượt xem nhiều nhất trong tuần
    app.get('/collection/topView/week/:quantity', collection.findTopViewWeek)

    // lấy top lượt xem nhiều nhất trong tháng
    app.get('/collection/topView/month/:quantity', collection.findTopViewMonth)

    // lấy top lượt xem nhiều nhất trong năm
    app.get('/collection/topView/year/:quantity', collection.findTopViewYear)
}