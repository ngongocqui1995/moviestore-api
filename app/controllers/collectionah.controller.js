const moment = require('moment');
const axios = require('axios');
const delay = require('delay');
const jsdom = require("jsdom");
const { Script } = require("vm");
const { JSDOM } = jsdom;

exports.getAllCategory = async(req, res) => {
    let response = await axios.get('http://animehay.tv/')
    let data = response.data
    if(data){
        let categories = getAllCategory(data)
        res.send(categories)
    }else{
        res.send({ message: "lỗi" })
    }
}

exports.getNumberPage = async(req, res) => {
    let key = req.body.key
    let response = await axios.get(`http://animehay.tv/${key}`)
    let data = response.data
    if(data){   
        let numberPage = getNumberPage(data)
        res.send(numberPage)
    }else{
        res.send({ message: "lỗi" })
    }
}

exports.getAllMovie = async(req, res) => {
    let key = req.body.key
    let indexPage = Number(req.body.indexPage)
    let response = await axios.get(`http://animehay.tv/${key}?page=${indexPage}`)
    let data = response.data
    if(data){   
        let movies = await getAllMovie(data)
        let page = await getNumberPage(data)
        res.send({
            items: movies,
            page: page
        })
    }else{
        res.send({ message: "lỗi" })
    }
}

exports.getInformationCollection = async(req, res) => {
    let keyCollection = req.params.keyCollection
    let response = await axios.get(`http://animehay.tv/phim/${keyCollection}.html`)
    let data = response.data
    if(data){
        let information = getInformationCollection(data)
        res.send(information)
    }else{
        res.send({ message: "lỗi" })
    }
}

exports.getAllEpisodes = async(req, res) => {
    let keyCollection = req.params.keyCollection
    let response = await axios.get(`http://animehay.tv/phim/${keyCollection}.html`)
    let data = response.data
    if(data){   
        let episodes = await getAllEpisodes(data)
        res.send(episodes)
    }else{
        res.send({ message: "lỗi" })
    }
}

exports.getLinkVideo = async(req, res) => {
    let keyCollection = req.params.keyCollection
    let link = `http://animehay.tv/phim/${keyCollection}.html`
    let videos = await getLinkVideo(link)
    res.send(videos)
}

async function getLinkVideo(link){
    let videos = []
    let response = await axios.get(`http://localhost:10080/JavaAPI/rest/api/getlinkanimehay?url=${link}`)
    let data = response.data
    videos.push({ link: data })
    
    return videos
}

function getAllEpisodes(data){
    let episodes = []
    const dom = new JSDOM(data)
    let divClassAhWfLe = dom.window.document.getElementsByClassName('ah-wf-le')[0]
    let tagA = divClassAhWfLe.getElementsByTagName('a')
    for(let i=0; i<tagA.length; i++){
        let title = tagA[i].textContent.trim()
        let key = tagA[i].getAttribute('href')
        key = subStringKeyFilm(key)
        
        episodes.push({
            title: title,
            key: key
        })
    }
    return episodes
}

function getInformationCollection(data){
    let informationCollection = []
    const dom = new JSDOM(data)

    // class ah-pif-head
    let divClassAhPifHead = dom.window.document.getElementsByClassName('ah-pif-head')[0]
    let title = divClassAhPifHead.getElementsByClassName('ah-pif-fname')[0].textContent.trim()

    // class ah-clear-both relative cth
    let divClassImg = divClassAhPifHead.getElementsByClassName('ah-clear-both relative cth')[0]
    let imgMain = divClassImg.getElementsByTagName('img')[0].getAttribute('src')
    let imgContent = divClassImg.getElementsByTagName('img')[1].getAttribute('src')
    
    // class ah-pif-ftool ah-bg-bd ah-clear-both
    let divClassLink = divClassAhPifHead.getElementsByClassName('ah-pif-ftool ah-bg-bd ah-clear-both')[0]
    let key = divClassLink.getElementsByTagName('a')[0].getAttribute('href')
    key = subStringKeyFilm(key)

    // class ah-rate-film
    let divClassAhRateFilm = dom.window.document.getElementsByClassName('ah-rate-film')[0]
    let rank = divClassAhRateFilm.getElementsByTagName('span')[0].textContent.trim()
    let rating = divClassAhRateFilm.getElementsByTagName('span')[1].textContent.trim().substring(1).trim()
    
    // class ah-pif-body
    let divClassAhPifBody = dom.window.document.getElementsByClassName('ah-pif-body')[0]
    // lấy thông tin
    let divClassahPifFdetails = divClassAhPifBody.getElementsByClassName('ah-pif-fdetails')[0]
    let listLi = divClassahPifFdetails.getElementsByTagName('li')
    let information = getInformationMovie(listLi)

    // lấy nội dung
    let divClassAhPifFcontent = dom.window.document.getElementsByClassName('ah-pif-fcontent')[0]
    let content = divClassAhPifFcontent.getElementsByTagName('p')[0].textContent.trim()

    informationCollection.push({
        title: title,
        imgMain: imgMain,
        imgContent: imgContent,
        key: key,
        rank: rank,
        rating: rating,
        episodes: information.episodes,
        yearOfRelease: information.yearOfRelease,
        categories: information.categories,
        timeASet: information.timeASet,
        content: content
    })

    return informationCollection
}

function getInformationMovie(listLi){
    // lấy tập mới
    let episodes = []
    let listAEpisodes = listLi[0].getElementsByTagName('a')
    for(let i=0; i<listAEpisodes.length; i++){
        let title = listAEpisodes[i].textContent.trim()
        let key = listAEpisodes[i].getAttribute('href')
        key = subStringKeyFilm(key)
        episodes.push({
            title: title,
            key: key
        })
    }

    // lấy năm phát hành
    let yearOfRelease = listLi[1].textContent.trim()
    let splitYearOfRelease = yearOfRelease.split(" ")
    yearOfRelease = splitYearOfRelease[splitYearOfRelease.length-1]

    // lấy thể loại
    let categories = []
    let tagACategories = listLi[2].getElementsByTagName('a')
    for(let i=0; i<tagACategories.length; i++){
        let title = tagACategories[i].textContent.trim()
        let key = tagACategories[i].getAttribute('href')
        key = subStringKeyCategories(key)
        categories.push({
            title: title,
            key: key
        })
    }

    // lấy thời lượng
    let timeASet = listLi[3].textContent.trim()
    let splitTimeASet = timeASet.split(" ")
    timeASet = splitTimeASet[splitTimeASet.length-2] + " " + splitTimeASet[splitTimeASet.length-1]

    let information = {
        episodes: episodes,
        yearOfRelease: yearOfRelease,
        categories: categories,
        timeASet: timeASet
    }

    return information
}

function getItemsCategories(data){
    let items = []
    let listA = data.getElementsByTagName('a')
    for(let i=0; i<listA.length; i++){
        let title = listA[i].textContent.trim()
        let key = listA[i].getAttribute('href')
        key = subStringKeyCategories(key)
        items.push({ 
            title: title,
            key: key
        })
    }
    return items
}

async function getAllMovie(data){
    let dataCopy = data
    let movies = []
    
    const dom = new JSDOM(dataCopy)
    let divClassFilm = dom.window.document.getElementsByClassName('ah-row-film')[0].getElementsByClassName('ah-col-film')
    for(let i=0; i<divClassFilm.length; i++){
        let tagA = divClassFilm[i].getElementsByTagName('a')[1]
        let key = tagA.getAttribute('href')
        key = subStringKeyFilm(key)
        
        // lấy thông tin phim
        let img = tagA.getElementsByTagName('img')[0].getAttribute('src')
        let episodes = tagA.getElementsByTagName('span')[0].textContent.trim()
        let rank = tagA.getElementsByTagName('span')[1].textContent.trim()
        let title = tagA.getElementsByTagName('span')[2].textContent.trim()

        movies.push({
            img: img,
            title: title,
            key: key,
            episodes: episodes,
            rank: rank
        })
    }
    return movies
}

function getNumberPage(data){
    let numberPage = []
    const dom = new JSDOM(data)
    let ulClassPagination = dom.window.document.getElementsByClassName('pagination')[0]
    
    if(ulClassPagination){
        ulClassPagination = ulClassPagination.children
        let href = ulClassPagination[ulClassPagination.length-1].getElementsByTagName('a')[0].getAttribute('href')
        let indexbd = href.indexOf("=")
        let page = Number(href.substring(indexbd+1))
        
        numberPage.push({ page: page })
    }else{
        numberPage.push({ page: 1 })
    }
    return numberPage
}

function getAllCategory(data){
    let categories = []
    const dom = new JSDOM(data)
    let divClassNav = dom.window.document.getElementsByClassName('nav')[0]
    let tagUl = divClassNav.getElementsByTagName('ul')[0]
    let liClassAhLsm = tagUl.getElementsByClassName('ah-lsm')
    let ulClassAhUlsm = tagUl.getElementsByClassName('ah-ulsm')
    for(let i=0; i<liClassAhLsm.length; i++){
        let title = liClassAhLsm[i].getElementsByTagName('a')[0].textContent.trim()
        let key = liClassAhLsm[i].getElementsByTagName('a')[0].getAttribute('href').substring(1)
        let items = getItemsCategories(ulClassAhUlsm[i])
        categories.push({
            title: title,
            key: key,
            items: items
        })
    }
    let index = liClassAhLsm.length+ulClassAhUlsm.length
    for(let i=index; i<tagUl.children.length; i++){
        let title = tagUl.children[i].getElementsByTagName('a')[0].textContent.trim()
        let key = tagUl.children[i].getElementsByTagName('a')[0].getAttribute('href').substring(1)
        categories.push({
            title: title,
            key: key,
            items: []
        })
    }
    return categories
}

function subStringKeyCategories(key){
    let keyPre = key
    let indexbd = keyPre.indexOf('animehay')
    indexbd = keyPre.indexOf('/', indexbd)
    keyPre = keyPre.substring(indexbd+1)
    return keyPre
}

function subStringKeyFilm(key){
    let keyPre = key
    let indexbd = keyPre.indexOf('animehay')
    indexbd = keyPre.indexOf('/', indexbd)
    let indexkt = keyPre.lastIndexOf('.')
    keyPre = keyPre.substring(indexbd+1, indexkt)
    return keyPre
}
