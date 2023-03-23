import express from 'express'
const app = express()
const appSocial = express()

import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import fs from 'fs'

import ejs from 'ejs'
app.set('view engine', 'ejs')
app.set('views', './views')

appSocial.set('view engine', 'ejs')
appSocial.set('views', './views')

import showdown from 'showdown'

const config = {
  port: 4191,
  port_social: 4192,
}

const classMap = {
  img: 'rounded-xl transition-all duration-300 transform hover:-translate-y-2',
}

const bindings = Object.keys(classMap).map((key) => ({
  type: 'output',
  regex: new RegExp(`<${key}(.*)>`, 'g'),
  replace: `<${key} class="${classMap[key]}" $1>`,
}))

const conv = new showdown.Converter({
  extensions: [...bindings],
})

// conv.setFlavor('github');

const linkFile = './social.json'
const aboutFile = './posts/about'
const projectsFile = './posts/projects'

const getLinks = () => {
  let data = JSON.parse(fs.readFileSync(linkFile, 'utf-8'))
  return data
}

const getMdFiles = (path) => {
  let arr = []
  let files = fs.readdirSync(path).sort((a, b) => {
    a = a.split('.')[0]
    b = b.split('.')[0]
    return a - b
  })

  files.forEach((file) => {
    const data = fs.readFileSync(`${path}/${file}`, 'utf-8')
    if (data.split('\n')[0] != 'hide' && file.split('.')[1] == 'md') {
      const html = conv.makeHtml(data)
      arr.unshift({ content: html, title: file })
    }
  })
  return arr
}

fs.watch(linkFile, (eventType, filename) => {
  links = getLinks()
})

fs.watch('./posts/about', (eventType, filename) => {
  // about = getAbout();
  about = getMdFiles(aboutFile)
})

fs.watch('./posts/projects', (eventType, filename) => {
  // projects = getProjects();
  projects = getMdFiles(projectsFile)
})

var links = getLinks()
var about = getMdFiles(aboutFile)
var projects = getMdFiles(projectsFile)

app.get('/', (req, res) => {
  var data = { about, projects }

  return res.render('index', data)
})

app.get('/icon.png', (req, res) => {
  return res.status(200).sendFile(__dirname + '/files/logo.png')
})

app.get('/favicon.ico', (req, res) => {
  return res.status(200).sendFile(__dirname + '/files/logo.png')
})

app.get('/files/:file(*)', (req, res) => {
  if (req.params.file.split('')[0] == '_') {
    return res
      .status(404)
      .json({ err: '404 File Not Found', file: req.params.file })
  }

  let path = __dirname + '/files/' + req.params.file

  if (fs.existsSync(path)) {
    return res.status(200).sendFile(path)
  }
  return res
    .status(404)
    .json({ err: '404 File Not Found', file: req.params.file })
})

appSocial.get('/files/:file(*)', (req, res) => {
  if (req.params.file.split('')[0] == '_') {
    return res
      .status(404)
      .json({ err: '404 File Not Found', file: req.params.file })
  }

  let path = __dirname + '/files/' + req.params.file

  if (fs.existsSync(path)) {
    return res.status(200).sendFile(path)
  }
  return res
    .status(404)
    .json({ err: '404 File Not Found', file: req.params.file })
})

app.get('/link:x(*)', (req, res) => {
  let linkID = req.params.x

  if (linkID.length > 0 && links[linkID]) {
    return res.render('social', {
      info: links[linkID].info,
      socials: Object.values(links[linkID].items),
    })
  }

  return res.status(404).json({ msg: '404 File Not Found', linkID })
})

appSocial.get('/:x(*)', (req, res) => {
  let linkID = req.params.x

  if (linkID.length > 0 && links[linkID]) {
    return res.render('social', {
      info: links[linkID].info,
      socials: Object.values(links[linkID].items),
    })
  }

  return res.status(404).json({ msg: '404 File Not Found', linkID })
})

app.get('/*', (req, res) => {
  return res.status(404).redirect('/')
  // return res.status(404).json('404 Not Found')
})

appSocial.get('/*', (req, res) => {
  return res.status(404).redirect('/')
  // return res.status(404).json('404 Not Found')
})

var server = app.listen(config.port, () => {
  console.log(server.address())
})

var serverSocial = appSocial.listen(config.port_social, () => {
  console.log(serverSocial.address())
})
