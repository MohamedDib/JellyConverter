const formidable = require('formidable');
const util = require("util");
const youtubedl = require('youtube-dl');
const fs = require('fs');
const exec = util.promisify(require("child_process").exec);
const output_path = './output/';

exports.downloadVideo = (req, res) => {

    let form = formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {

        if (err) {
            return resp.status(400).json({
                'err': 'Form invalid'
            });
        }

        let vid_url = fields.video_url;

        download(vid_url, res);
       // download2();
    });
};

function download(path,resp){
    let downloaded = 0
    let output = "download.mp4";
   if (fs.existsSync(output)) {
        downloaded = fs.statSync(output).size
    }

    const video = youtubedl(path,

        // Optional arguments passed to youtube-dl.
        ['--format=18'],

        // start will be sent as a range header
        { start: downloaded, cwd: __dirname })

// Will be called when the download starts.
    video.on('info', function(info) {
        console.log('Download started')
        console.log('filename: ' + info._filename)
        resp.setHeader('load',true);
        // info.size will be the amount to download, add
        let total = info.size + downloaded
        console.log('size: ' + total)

        if (downloaded > 0) {
            // size will be the amount already downloaded
            console.log('resuming from: ' + downloaded)

            // display the remaining bytes to download
            console.log('remaining bytes: ' + info.size)
        }
    })

    video.pipe(fs.createWriteStream(output_path+output, { flags: 'a' }))

// Will be called if download was already completed and there is nothing more to download.
    video.on('complete', function complete(info) {
        'use strict'
        console.log('filename: ' + info._filename + ' already downloaded.')
    })

    video.on('end', function() {
        console.log('finished downloading!');
        resp.render('home', {
            'dlmsg': true,
            'showmsg' : false,
            'load' : false
        });
    })
}