var request = require('request');
var moment = require('moment');
const download = require('image-downloader')
var fs = require('fs');
const resizeImg = require('resize-img');
const sharp = require('sharp');


exports.resizeImageGlobal = async(req, res) => {
    let file = req.body.file
    let url = req.body.url
    let width = Number(req.body.width)
    let height = Number(req.body.height)
    let img = await resizeImageGlobal(url, file, width, height)
    res.send({img: img})
}

exports.resizeImageOneSection = async(req, res) => {
    let file = req.body.file
    let url = req.body.url
    let width = Number(req.body.width)
    let height = Number(req.body.height)
    let img = await resizeImageOneSection(url, file, width, height)
    res.send({img: img})
}

exports.dowloadImage = async(req, res) => {
    let file = req.body.file
    let url = req.body.url
    let image = await dowloadImage(url, file, "public/fileImage")
    res.send({img: `fileImage/${file}/${image.name}`})
}

async function resizeImageOneSection(url, file, width, height) {
    let name = ""
    if (!fs.existsSync(`public/fileImage/${file}`)){
        fs.mkdirSync(`public/fileImage/${file}`);
    }
    if (!fs.existsSync(`public/fileImage/${file}/${width}x${height}`)){
        fs.mkdirSync(`public/fileImage/${file}/${width}x${height}`);
    }

    do{
        try {
            let image = await dowloadImage(url, file, "public/temps")
            let buf = await sharp(image.file).resize(width, height).toBuffer()
            fs.writeFileSync(`public/fileImage/${file}/${width}x${height}/${image.name}`, buf);
            name = `fileImage/${file}/${width}x${height}/${image.name}`
        } catch (e) {
            console.error(e)
            name = ""
        }
    }while(name === "")
    return name
}

async function resizeImageGlobal(url, file, width, height) {
    let name = ""
    if (!fs.existsSync(`public/fileImage/${file}`)){
        fs.mkdirSync(`public/fileImage/${file}`);
    }
    if (!fs.existsSync(`public/fileImage/${file}/${width}x${height}`)){
        fs.mkdirSync(`public/fileImage/${file}/${width}x${height}`);
    }

    do{
        try {
            let image = await dowloadImage(url, file, "public/temps")
            let buf = await resizeImg(fs.readFileSync(image.file), {width: 1600, height: 450})
            fs.writeFileSync(`public/fileImage/${file}/${width}x${height}/${image.name}`, buf);
            name = `fileImage/${file}/${width}x${height}/${image.name}`
        } catch (e) {
            console.error(e)
            name = ""
        }
    }while(name === "")
    return name
}

async function dowloadImage(url, file, urlFile){
    if (!fs.existsSync(`${urlFile}/${file}`)){
        fs.mkdirSync(`${urlFile}/${file}`);
    }
    let infomartionImage = {
        name: "",
        file: ""
    }
    const options = {
        url: url,
        dest: `${urlFile}/${file}`                  
    }

    do{
        try {
            const { filename, image } = await download.image(options)
            let indexbd = filename.lastIndexOf("\\")
            infomartionImage.name = filename.substring(indexbd+1)
            infomartionImage.file = filename
        } catch (e) {
            console.error(e)
            infomartionImage.name = ""
        }
    }while(infomartionImage.name === "")
    return infomartionImage
}