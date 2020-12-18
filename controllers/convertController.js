const formidable = require('formidable');
const fs = require('fs');
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const output_path = '../output/out_';

const MediaInfo = require('mediainfo.js');
//mediainfo = MediaInfo(opts, callback, errorCallback);

exports.readFile = (req, resp) => {
    let form = formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {

        let input = {
            'path': null,
            'realpath': null,
            'type': null,
            'metadata': null
        };

        let cat = "";

        if (err) {
            return resp.status(400).json({
                'err': 'Form invalid'
            });
        }

        if (files.input_f) {
            input.metadata = fs.readFileSync(files.input_f.path);
            input.path = files.input_f.path;
            input.type = files.input_f.type;
            /*fs.realpath(files.input_f.path, (err,path)=>{
                console.log(path);
            });*/
            console.log('type :'+input.type);

        }

        //if(fields.cat){
        console.log(fields.cat);
        // meta data
        readMeta(input.path);
        //}
        if (fields.cat === 'yt') {
            toHorizontal(input.path, output_path+ "_YT_" + files.input_f.name, resp);
        } else if (fields.cat === 'story') {
            toVertical(input.path, output_path + "_STORY_" + files.input_f.name, resp);
        } else if (fields.cat === 'fb_post') {
            toSquare(input.path, output_path + "_POST_" + files.input_f.name, resp);
        } else {
            console.log("Type is not correct !");
        }

        //toHorizontal(input.path,output_path+files.input_f.name,resp);

        /*resp.json({
           input
        });*/

    });
}

async function toHorizontal(input, output, resp) {
    var command = "cd ffmpeg_lib && ffmpeg -i " + input + " -lavfi [0:v]scale=ih*16/9:-1,boxblur=luma_radius=min(h\\,w)/20:luma_power=1:chroma_radius=min(cw\\,ch)/20:chroma_power=1[bg];[bg][0:v]overlay=(W-w)/2:(H-h)/2,crop=h=iw*9/16  " + output;
    await exec(command);
    //resp.send("<script>alert('Votre fichier est pret !');</script>");
    resp.render('home', {
        'showmsg': true,
        'dlmsg' : false,
        'load' : false
    });
}

async function toVertical(input, output, resp) {
    //ffmpeg -i test2.mp4 -filter:v "crop=in_w/3:in_h/1" -c:a copy test.mp4
    var command = "cd ffmpeg_lib && ffmpeg -i " + input + " -filter:v crop=in_w/3:in_h/1 -c:a copy " + output;
    await exec(command);
    resp.render('home', {
        'showmsg': true,
        'dlmsg' : false,
        'load' : false
    });
}

async function toSquare(input, output, resp) {
    //ffmpeg -i test2.mp4 -filter:v "crop=640:640" -c:a copy hivid.mp4
    var command = "cd ffmpeg_lib && ffmpeg -i " + input + " -filter:v crop=640:640 -c:a copy " + output;
    await exec(command);
    resp.render('home', {
        'showmsg': true,
        'dlmsg' : false,
        'load' : false
    });
}

async function readMeta(path) {
    const result = await mediainfo(path);
    console.log("=======================================");
    console.log(result);
    console.log("=======================================");
}