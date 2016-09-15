"use strict";

var express = require('express');
var app = express();
var mustacheExpress = require('mustache-express');
var bodyParser = require('body-parser');
var jsonfile = require('jsonfile');
var fs = require('fs');

var pathToFonts = '../typewriter';

var Fonts = {
  'system-micro': require(`${pathToFonts}/fonts/system-micro`),
  'system-medium': require(`${pathToFonts}/fonts/system-medium`)
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));
app.engine('html', mustacheExpress());
app.set('view engine', 'html');

app.get('/', function (req, res) {
  var fonts = [];

  for(var key in Fonts) {
    fonts.push({
      slug: key,
      name: Fonts[key].name,
      description: Fonts[key].description,
      height: Fonts[key].height,
      width: Fonts[key].width,
      monospace: Fonts[key].monospace,
      author: Fonts[key].author
    });
  }

  res.render('fonts/index', {
    fonts: fonts
  });
});

app.post('/', function (req, res) {
  var body = req.body;

  var font = require('./font-template.json');
  font.height = body.height
  font.width = body.width

  jsonfile.writeFile(`${pathToFonts}/fonts/${body.name}.json`, font, {spaces: 2}, function (err) {
    res.redirect(`fonts/${body.name}`);
  });
});

app.get('/new', function (req, res) {
  res.render('fonts/new');
});

app.get('/:font', function (req, res) {
  var font = req.params.font,
      letter = req.params.letter;

  if(req.xhr) {
    var font = require(`${pathToFonts}/fonts/${font}`);
    res.json(font || []);
  } else {
    res.render('fonts/show', {
      font: font
    });
  }
});

app.get('/:font/characters/:character', function (req, res) {
  var params = req.params;

  if(req.xhr) {
    var font = require(`${pathToFonts}/fonts/${params.font}`),
        character = font.characters[params.character],
        width,
        height,
        coordinates;

    if(character) {
      width = character.width || font.width;
      height = character.height || font.height;
      coordinates = character.coordinates || [];
    } else {
      width = font.width;
      height = font.height;
      coordinates = [];
    }

    res.json({
      character: params.character,
      height: height,
      width: width,
      coordinates: coordinates
    });
  } else {
    res.render(`fonts/characters/show`, {
      character: params.character,
      font: params.font
    });
  }
});

app.post('/:font/characters/:character/coordinates', function (req, res) {
  var params = req.params;

  Fonts[params.font].characters[params.character].coordinates = req.body;

  jsonfile.writeFile(`${pathToFonts}/fonts/${params.font}.json`, Fonts[params.font], {spaces: 2}, function (err) {
    res.status(201).end();
  });
})

app.post('/:font/characters/:character/dimensions', function (req, res) {
  var body = req.body,
      params = req.params;

  var font = require(`${pathToFonts}/fonts/${params.font}`);

  font.characters[params.character].width = body.width;
  font.characters[params.character].height = body.height;

  jsonfile.writeFile(`${pathToFonts}/fonts/${params.font}.json`, font, {spaces: 2}, function (err) {
    res.redirect(`/${params.font}/characters/${encodeURIComponent(params.character)}`);
  });
})

app.listen(3000)
