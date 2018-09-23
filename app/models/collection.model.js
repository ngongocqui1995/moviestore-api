const mongoose = require('mongoose');

const CollectionSchema = mongoose.Schema({
    title: String,
    otherTitle: String,
    part: String,
    episodesCurrent: String,
    episodes: String,
    content: String,
    contentImages: Array,
    releaseYear: String,
    categories: Array,
    view: Intl,
    rank: Intl,
    group: String,
    indexGroup: String,
    producer: String,
    coverImage: String,
    imageMain: String,
    fansub: Array,
    followers: Intl,
    filmActor: String,
    filmDirector: String,
    keyClass: String,
    page: String,
    status: String,
    countries: Array,
    author: String,
    linkTrailer: String,
    startMusicName: Array,
    finishMusicName: Array,
    key: String,
    videos: Array
}, {
    timestamps: true
});

module.exports = mongoose.model('collections', CollectionSchema);