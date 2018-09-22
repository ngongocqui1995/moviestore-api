const Collection = require('../models/collection.model.js');
var request = require('request');
var moment = require('moment');


// Tạo 1 collection
exports.create = async(req, res) => {
    if(!req.body.title) {
        res.send({message: "body error"});
    }

    let countries = req.body.countries
    let categories = req.body.categories
    let videos = req.body.videos
    let responeCollection = await Collection.find({key: req.body.key})
    if(responeCollection.length > 0){
        let kt = checkUpdateCollection(responeCollection[0].videos, videos)
        if(kt){
            Collection.findByIdAndUpdate(responeCollection[0]._id, 
                {videos:  videos}
            , {new: true})
            .then(result => {
                console.log({message: "update ok"});
                res.send({message: "update ok"});
            }).catch(err => {
                console.log({message: "update error"});
                res.send({message: "update error"});
            });
        }else{
            console.log({message: "not update"})
            res.send({message: "not update"});
        }
    }else{
        const collection = new Collection({
            title: req.body.title,
            otherTitle: "",
            part: "",
            episodesCurrent: "",
            episodes: videos[0].episodes.length,
            content: req.body.content,
            contentImages: [],
            releaseYear: "",
            categories: categories,
            view: 0,
            rank: 0,
            group: "",
            indexGroup: 1,
            producer: "",
            imageMain: req.body.img,
            fansub: [],
            followers: 0,
            filmActor: "",
            filmDirector: "",
            keyClass: "",
            page: "zingtv",
            status: "",
            countries: countries,
            author: "",
            linkTrailer: "",
            startMusicName: [],
            finishMusicName: [],
            key: req.body.key,
            videos: videos
        });
    
        collection.save()
        .then(result => {
            console.log({message: "add ok"})
            res.send({message: "add ok"});
        }).catch(err => {
            console.log({message: "add error"})
            res.send({message: "add error"});
        });
    }
};

// Lấy tất cả collection mới cập nhật
exports.findAll = (req, res) => {
    Collection.find({}, { "videos.urlReal": 0, "videos.otherLink.urlReal": 0 })
    .then(result => {
       res.send(result);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving collections."
        });
    });
};

// Lấy tất cả collection giới hạn số lượng
exports.findAllLimit = (req, res) => {
    let limit = Number(req.params.limit);
    Collection.find({}, { 
        part: 0,
        contentImages: 0,
        releaseYear: 0,
        categories: 0,
        group: 0,
        indexGroup: 0,
        producer: 0,
        fansub: 0,
        followers: 0,
        filmActor: 0,
        filmDirector: 0,
        page: 0,
        status: 0,
        countries: 0,
        author: 0,
        linkTrailer: 0,
        startMusicName: 0,
        finishMusicName: 0,
        videos: 0
    })
    .limit(limit)
    .then(result => {
       res.send(result);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving collections."
        });
    });
};

// Lấy tất cả collection mới cập nhật có giới hạn số lượng
exports.findAllCollectionLimit = (req, res) => {
    let limit = Number(req.params.limit);
    Collection.find({}, { "videos.urlReal": 0, "videos.otherLink.urlReal": 0 })
    .sort({ updatedAt: -1 })
    .limit(limit)
    .then(result => {
       res.send(result);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving collections."
        });
    });
};

// Lấy tất cả collection mới cập nhật theo thể loại
exports.findAllCollectionCategory = (req, res) => {
    Collection.find({"categories.key": req.params.keyCategory}, { "videos.urlReal": 0, "videos.otherLink.urlReal": 0 })
    .sort({ updatedAt: -1 })
    .then(result => {
       res.send(result);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving collections."
        });
    });
};

// Lấy tất cả collection mới cập nhật có giới hạn số lượng theo thể loại
exports.findAllCollectionCategoryLimit = (req, res) => {
    let limit = Number(req.params.limit);
    Collection.find({"categories.key": req.params.keyCategory}, { "videos.urlReal": 0, "videos.otherLink.urlReal": 0 })
    .sort({ updatedAt: -1 })
    .limit(limit)
    .then(result => {
       res.send(result);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving collections."
        });
    });
};

// Lấy tất cả collection
exports.findAllCollection = (req, res) => {
    Collection.find()
    .then(result => {
       res.send(result);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving collections."
        });
    });
};

// Tìm 1 collection theo id
exports.findOne = (req, res) => {
    Collection.findById({_id: req.params.collectionId }, { "videos.urlReal": 0, "videos.otherLink.urlReal": 0 })
    .then(result => {
        if(!result) {
            return res.status(404).send({
                message: "collection not found with id " + req.params.collectionId
            });            
        }
        res.send(result);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "collection not found with id " + req.params.collectionId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving collection with id " + req.params.collectionId
        });
    });
};

// Tìm 1 collection theo key
exports.findOneFromKey = (req, res) => {
    Collection.find({key: req.params.collectionKey }, { "videos.urlReal": 0, "videos.otherLink.urlReal": 0 })
    .then(result => {
        if(!result) {
            return res.status(404).send({
                message: "collection not found with id " + req.params.collectionId
            });            
        }
        res.send(result);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "collection not found with id " + req.params.collectionId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving collection with id " + req.params.collectionId
        });
    });
};

// Tìm 1 collection theo id
exports.findOneCollection = (req, res) => {
    Collection.findById(req.params.collectionId)
    .then(result => {
        if(!result) {
            return res.status(404).send({
                message: "collection not found with id " + req.params.collectionId
            });            
        }
        res.send(result);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "collection not found with id " + req.params.collectionId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving collection with id " + req.params.collectionId
        });
    });
};

// Sửa 1 collection
exports.update = (req, res) => {
    if(!req.body.title) {
        return res.status(400).send({
            message: "collection content can not be empty"
        });
    }

    Collection.findByIdAndUpdate(req.params.collectionId, 
        req.body
    , {new: true})
    .then(result => {
        if(!result) {
            return res.status(404).send({
                message: "collection not found with id " + req.params.collectionId
            });
        }
        res.send(result);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "collection not found with id " + req.params.collectionId
            });                
        }
        return res.status(500).send({
            message: "Error updating collection with id " + req.params.collectionId
        });
    });
};

// Xoá 1 collection
exports.delete = (req, res) => {
    Collection.findByIdAndRemove(req.params.collectionId)
    .then(result => {
        if(!result) {
            return res.status(404).send({
                message: "collection not found with id " + req.params.collectionId
            });
        }
        res.send({message: "collection deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "collection not found with id " + req.params.collectionId
            });                
        }
        return res.status(500).send({
            message: "Could not delete collection with id " + req.params.collectionId
        });
    });
};

// Thêm 1 tập trong collection
exports.addEpisodes = (req, res) => {
    Collection.findByIdAndUpdate(req.params.collectionId,{$push: {videos: {
		title: req.body.title,
		key: req.body.key,
		url: req.body.url,
		urlReal: req.body.urlReal,
		currentUpdateDate: req.body.currentUpdateDate,
		numberEpisodes: req.body.numberEpisodes,
		otherLink: req.body.otherLink
	}}}, {new: true})
    .then(result => {
        if(!result) {
            return res.status(404).send({
                message: "Không tìm thấy note với id " + req.params.collectionId
            });
        }
        res.send(result);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: err.message
            });
        }
        return res.status(500).send({
            message: "Error"
        });
    });
}

//Xóa 1 tập trong collection
exports.removeEpisodes = (req, res) => {
    Collection.update({_id: req.params.collectionId},{$pull: {videos: {
		title: req.body.title,
		key: req.body.key,
		url: req.body.url,
		currentUpdateDate: req.body.currentUpdateDate,
		numberEpisodes: req.body.numberEpisodes,
		otherLink: req.body.otherLink
	}}}, {new: true})
    .then(result => {
        if(!result) {
            return res.status(404).send({
                message: "Không tìm thấy note với id " + req.params.collectionId
            });
        }
        res.send(result);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: err.message
            });                
        }
        return res.status(500).send({
            message: "Error"
        });
    });
}

exports.getPage = (req, res) => {
    var quantity = Number(req.params.quantity); // 2
    var numberPage = Number(req.params.numberPage); // 3 
    console.log(quantity);
    console.log(numberPage);
    var index = numberPage == 1 ? 0 : Number(quantity*numberPage - quantity); // 0
    Collection.find().sort({ updatedAt: -1 }).limit(quantity).skip(index) // 
    .then(result => {
        if(!result) {
            return res.status(404).send({
                message: "Không !"
            });
        }
        res.send(result);
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Không tìm thấy với id "
            });
        }
        return res.status(500).send({
            message: "Không thể xóa với id "
        });
    });
}

// lấy top lượt xem nhiều nhất trong ngày
exports.findTopViewDay = (req, res) => {
    let quantity = Number(req.params.quantity);
    let date = new Date();
    let dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    let dateEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 0);

    Collection.find({createdAt: { $gte: dateStart, $lte: dateEnd }}, { "videos.urlReal": 0, "videos.otherLink.urlReal": 0 })
    .sort({ view: -1 })
    .limit(quantity)
    .then(result => {
        if(!result) {
            console.log("Không tìm thấy");       
        }else{
            res.status(200).json(result);
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}

// lấy top lượt xem nhiều nhất trong tuần
exports.findTopViewWeek = (req, res) => {
    let quantity = Number(req.params.quantity);
    let dateStart = moment().subtract(7, 'days');
    let dateEnd = moment(Date.now());

    Collection.find({createdAt: { $gte: new Date(dateStart), $lte: new Date(dateEnd) }}, { "videos.urlReal": 0, "videos.otherLink.urlReal": 0 })
    .sort({ view: -1 })
    .limit(quantity)
    .then(result => {
        if(!result) {
            console.log("Không tìm thấy");       
        }else{
            res.status(200).json(result);
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}

// lấy top lượt xem nhiều nhất trong tháng
exports.findTopViewMonth = (req, res) => {
    let quantity = Number(req.params.quantity);
    let dateStart = moment().subtract(30, 'days');
    let dateEnd = moment(Date.now());

    Collection.find({createdAt: { $gte: new Date(dateStart), $lte: new Date(dateEnd) }}, { "videos.urlReal": 0, "videos.otherLink.urlReal": 0 })
    .sort({ view: -1 })
    .limit(quantity)
    .then(result => {
        if(!result) {
            console.log("Không tìm thấy");       
        }else{
            res.status(200).json(result);
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}


// lấy top lượt xem nhiều nhất trong năm
exports.findTopViewYear = (req, res) => {
    let quantity = Number(req.params.quantity);
    let dateStart = moment().subtract(365, 'days');
    let dateEnd = moment(Date.now());

    Collection.find({createdAt: { $gte: new Date(dateStart), $lte: new Date(dateEnd) }}, { "videos.urlReal": 0, "videos.otherLink.urlReal": 0 })
    .sort({ view: -1 })
    .limit(quantity)
    .then(result => {
        if(!result) {
            console.log("Không tìm thấy");       
        }else{
            res.status(200).json(result);
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}

function checkUpdateCollection(videosResponeMongodb, videosRequest){
    let kt = false
    if(videosRequest.length > videosResponeMongodb.length){
        return true
    }
    for(let i=0; i<videosResponeMongodb.length; i++){
        if(videosRequest[i].episodes.length > videosResponeMongodb[i].episodes.length){
            kt = true
            break
        }
    }
    return kt
}

function checkUpdateCollection(videosResponeMongodb, videosRequest){
    let kt = false
    if(videosRequest.length > videosResponeMongodb.length){
        return true
    }
    for(let i=0; i<videosResponeMongodb.length; i++){
        if(videosRequest[i].episodes.length > videosResponeMongodb[i].episodes.length){
            kt = true
            break
        }
    }
    return kt
}