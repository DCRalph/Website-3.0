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
    img: 'rounded-xl transition-all duration-300 transform hover:-translate-y-2',
    // img: 'block my-4 w-2/3 lg:w-full mx-auto rounded-3xl shadow-lg transition-all duration-300 transform hover:-translate-y-2',
    // h1: 'text-white flex justify-center pb-3 text-xl sm:text-3xl font-bold font-heading text-center sm:text-left',
    // p: 'text-white text-md sm:text-lg font-body text-center sm:text-left mt-2'
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

// const socials = {
//     instagram: {
//         name: 'Instagram',
//         url: 'https://www.instagram.com/williamgiles05/',
//         urlShow: 'instagram.com/williamgiles05',
//         icon: '/files/ig.png',
//         color: 'instagram text-white'
//     },
//     website: {
//         name: 'Website',
//         url: 'https://williamgiles.co.nz',
//         urlShow: 'williamgiles.co.nz',
//         icon: '/files/logo.png',
//         color: 'bg-[#000] text-white'
//     },
//     twitter: {
//         name: 'Twitter',
//         url: 'https://twitter.com/dcralph_',
//         urlShow: 'twitter.com/dcralph_',
//         icon: '/files/twitter.svg',
//         color: 'bg-[#1da1f2] text-white'
//     },
//     email: {
//         name: 'Email',
//         url: 'mailto:william@williamgiles.co.nz',
//         urlShow: 'william@williamgiles.co.nz',
//         icon: '/files/mail.png',
//         color: 'bg-blue-600 text-white'
//     },
//     youtube: {
//         name: 'YouTube',
//         url: 'https://www.youtube.com/channel/UCJ2jGzghu5ChWSXkwn63FEQ',
//         urlShow: 'youtube.com',
//         icon: '/files/yt.png',
//         color: 'bg-[#ff0000] text-white'
//     },
//     facebook: {
//         name: 'Facebook',
//         url: 'https://www.facebook.com/william.giles.948/',
//         urlShow: 'fb.com/william.giles.948',
//         icon: '/files/facebook.svg',
//         color: 'bg-[#1877f2] text-white'
//     },
//     snapchat: {
//         name: 'Snapchat',
//         url: 'https://www.snapchat.com/add/williamgiles05',
//         urlShow: 'snapchat.com/add/williamgiles05',
//         icon: '/files/snapchat.png',
//         color: 'bg-[#fffc00] text-black'
//     },
//     github: {
//         name: 'GitHub',
//         url: 'https://github.com/dcralph',
//         urlShow: 'github.com/dcralph',
//         icon: '/files/github dark.png',
//         color: 'bg-[#000] text-white'
//     },
//     // contact: {
//     //     name: 'Contact',
//     //     url: '/files/contact.vcf',
//     //     urlShow: 'contact.vcf',
//     //     icon: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Contacts_%28iOS%29.png',
//     //     color: 'bg-[#a8a8a8]'
//     // },
//     discord: {
//         name: 'Discord',
//         url: 'https://discord.com/invite/5Kz7DsERx4',
//         urlShow: 'discord.com/invite/5Kz7DsERx4',
//         icon: '/files/discord.png',
//         color: 'bg-[#5865f2] text-white'
//     },
//     twitch: {
//         name: 'Twitch',
//         url: 'https://www.twitch.tv/dcralph0',
//         urlShow: 'twitch.tv/dcralph0',
//         icon: '/files/twitch.png',
//         color: 'bg-[#9146ff] text-white'
//     }
// }

// const socialsMap = {
//     0: Object.values(socials),
//     1: [socials.instagram, socials.snapchat, socials.website],
// }


const linkFile = './social.json'
const aboutFile = './posts/about'
const projectsFile = './posts/projects'

fs.watch(linkFile, (eventType, filename) => {
    links = getLinks();
});

var links = getLinks();

function getLinks() {
    let data = JSON.parse(fs.readFileSync(linkFile, 'utf-8'));
    return data
}


fs.watch('./posts/about', (eventType, filename) => {
    // about = getAbout();
    about = getMdFiles(aboutFile)
});

fs.watch('./posts/projects', (eventType, filename) => {
    // projects = getProjects();
    projects = getMdFiles(projectsFile)
});

// var about = getAbout();
// var projects = getProjects();

var about = getMdFiles(aboutFile)
var projects = getMdFiles(projectsFile)

// function getAbout() {
//     console.log('updates about');
//     let arr = [];
//     files = fs.readdirSync('./posts/about').sort((a, b) => {
//         a = a.split('.')[0];
//         b = b.split('.')[0];
//         return a - b;
//     });

//     files.forEach(file => {
//         const data = fs.readFileSync(`./posts/about/${file}`, 'utf-8');
//         if (data.split('\n')[0] != 'hide' && file.split('.')[1] == 'md') {
//             const html = conv.makeHtml(data);
//             arr.unshift({ content: html, title: file })
//         }
//     });
//     return arr;
// }

// function getProjects() {
//     console.log('updates projects');
//     let arr = [];
//     files = fs.readdirSync('./posts/projects').sort((a, b) => {
//         a = a.split('.')[0];
//         b = b.split('.')[0];
//         return a - b;
//     });

//     files.forEach(file => {
//         const data = fs.readFileSync(`./posts/projects/${file}`, 'utf-8');
//         if (data.split('\n')[0] != 'hide' && file.split('.')[1] == 'md') {
//             const html = conv.makeHtml(data);
//             arr.unshift({ content: html, title: file })
//         }
//     });
//     return arr;
// }

function getMdFiles(path) { 
    let arr = [];
    files = fs.readdirSync(path).sort((a, b) => {
        a = a.split('.')[0];
        b = b.split('.')[0];
        return a - b;
    });

    files.forEach(file => {
        const data = fs.readFileSync(`${path}/${file}`, 'utf-8');
        if (data.split('\n')[0] != 'hide' && file.split('.')[1] == 'md') {
            const html = conv.makeHtml(data);
            arr.unshift({ content: html, title: file })
        }
    });
    return arr;
}

app.get('/', function (req, res) {

    var data = { about, projects }

    return res.render('index', data);
});


app.get("/icon.png", (req, res) => {
    return res.status(200).sendFile(__dirname + '/files/logo.png');
})

app.get("/favicon.ico", (req, res) => {
    return res.status(200).sendFile(__dirname + '/files/logo.png');
})

app.get("/files/:file(*)", (req, res) => {
    if (req.params.file.split('')[0] == '_') {
        return res.status(404).json({ err: '404 File Not Found' })
    }

    let path = __dirname + '/files/' + req.params.file

    if (fs.existsSync(path)) {
        return res.status(200).sendFile(path);
    }
    return res.status(404).json({ err: '404 File Not Found', file: req.params.file })
})


app.get("/link:x(*)", (req, res) => {
    let linkID = req.params.x

    // if (socialsMap[socialsNum]) {
    //     // return res.status(200).json(socialsMap[socialsNum]);
    //     return res.render('social', { socials: socialsMap[socialsNum] });
    // } else {
    //     return res.render('social', { socials: socialsMap[0] });
    // }

    if (linkID.length > 0 && links[linkID]) {
        return res.render('social', { info: links[linkID].info, socials: Object.values(links[linkID].items) });
    }

    return res.status(404).json({ msg: '404 File Not Found', linkID })
})

app.get("/*", (req, res) => {
    return res.status(404).redirect('/');
    // return res.status(404).json('404 Not Found')
})

var server = app.listen(config.port, () => {
    console.log(server.address());
})
