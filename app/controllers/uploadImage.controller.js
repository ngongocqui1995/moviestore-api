var request = require('request');
var moment = require('moment');
const download = require('image-downloader')
var fs = require('fs');


exports.dowloadImage = async(req, res) => {
    let file = req.body.file
    let url = req.body.url
    let img = await downloadIMG(url, file)
    res.send({img: img})
}

async function downloadIMG(url, file) {
    let name = ""
    if (!fs.existsSync(`./fileImage/${file}`)){
        fs.mkdirSync(`./fileImage/${file}`);
    }
    const options = {
        url: url,
        dest: `./fileImage/${file}`                  
    }

    do{
        try {
            const { filename, image } = await download.image(options)
            name = filename // => /uploadImages/filename/image.jpg 
        } catch (e) {
            console.error(e)
            name = ""
        }
    }while(name === "")
    return name
}