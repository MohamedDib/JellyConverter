const express = require('express');
const {downloadVideo} = require("./controllers/downloadController");
const {readFile}=require('./controllers/convertController');
const app = express()

app.set('view engine','ejs');
app.set('views','./views');
app.use(express.static(__dirname + '/public'));

app.get('/', (req,resp)=>{
    resp.render('home',{
        'showmsg' : false,
        'dlmsg' : false,
        'load' : false
    });
})

app.post('/convert',readFile);
app.post('/download',downloadVideo);

app.listen(5000, ()=>{
    console.log(`connected succssesfly ! on port : 5000`);
});
