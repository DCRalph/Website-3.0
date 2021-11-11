const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const fs = require('fs');

const ejs = require('ejs');
app.set('view engine', 'ejs');
app.set('views', './views');

const showdown = require('showdown');

const config = require('./config.json')

const classMap = {
    img: 'block my-4 w-2/3 lg:w-full mx-auto rounded-3xl shadow-lg transition-all duration-300 transform hover:-translate-y-2',
    h1: 'text-white flex justify-center pb-3 text-xl sm:text-3xl font-bold font-heading text-center sm:text-left',
    p: 'text-white text-md sm:text-lg font-body text-center sm:text-left mt-2'
}

const bindings = Object.keys(classMap)
    .map(key => ({
        type: 'output',
        regex: new RegExp(`<${key}(.*)>`, 'g'),
        replace: `<${key} class="${classMap[key]}" $1>`
    }));

const conv = new showdown.Converter({
    extensions: [...bindings]
});

// conv.setFlavor('github');


// fs.readdir('./posts/about', (err, files) => {
//     files.forEach(file => {
//         const post = fs.readFileSync(`./posts/about/${file}`, 'utf-8');
//         const html = conv.makeHtml(post);
//         console.log(1);
//     });
// });

var about = getAbout();
var projects = getProjects();

function getAbout() {
    let arr = [];
    fs.readdirSync('./posts/about').forEach(file => {
        const data = fs.readFileSync(`./posts/about/${file}`, 'utf-8');
        const html = conv.makeHtml(data);
        arr.unshift({ content: html, title: file })
    });
    return arr;
}

function getProjects() {
    let arr = [];
    fs.readdirSync('./posts/projects').forEach(file => {
        const data = fs.readFileSync(`./posts/projects/${file}`, 'utf-8');
        const html = conv.makeHtml(data);
        arr.unshift({ content: html, title: file })
    });
    return arr;
}

app.get('/', function (req, res) {

    var data = { about, projects }

    res.render('index', data);
});

app.get('/reload', function (req, res) {

    if (req.cookies['key'] == config.key || req.query.key == config.key) {
        abouts = getAbout();
        projects = getProjects();

        console.log('reloaded');

        res.cookie('key', config.key);
        return res.status(200).json('reloaded');
    }
    return res.status(401).json('nope lol');

});

app.get("/icon.png", (req, res) => {
    return res.status(200).sendFile(__dirname + '/files/logo.png');
})

app.get("/favicon.ico", (req, res) => {
    return res.status(200).sendFile(__dirname + '/files/logo.png');
})

app.get("/files/:file(*)", (req, res) => {
    let path = __dirname + '/files/' + req.params.file

    if (fs.existsSync(path)) {
        return res.status(200).sendFile(path);
    }
    return res.status(404).json('404 File Not Found')
})

app.get("/*", (req, res) => {
    return res.status(404).json('404 Not Found')
})

var server = app.listen(config.port, () => {
    console.log(server.address());
})