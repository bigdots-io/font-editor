"use strict";

var express = require('express');
var app = express();
var mustacheExpress = require('mustache-express');
var bodyParser = require('body-parser');
var jsonfile = require('jsonfile');
var fs = require('fs');

var pathToFonts = '../typewriter';
var pathToMacros = '../macro-library';

var Fonts = {
  'system-micro': require(`${pathToFonts}/fonts/system-micro`),
  'system-medium': require(`${pathToFonts}/fonts/system-medium`)
};

var Macros = require(`${pathToMacros}/macro-config`);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));
app.engine('html', mustacheExpress());
app.set('view engine', 'html');

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/fonts', function (req, res) {
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

app.get('/macros', function (req, res) {
  var macros = [];

  for(var key in Macros) {
    macros.push({
      slug: key,
      name: Macros[key].name,
      description: Macros[key].description
    });
  }

  res.render('macros/index', {
    macros: macros
  });
});

app.get('/macros/:macro', function (req, res) {
  var macro = req.params.macro;

  res.render('macros/show', {
    macro: macro
  });
});

app.get('/fonts/new', function (req, res) {
  res.render('fonts/new');
});

app.get('/fonts/:font', function (req, res) {
  var font = req.params.font;

  if(req.xhr) {
    var font = require(`${pathToFonts}/fonts/${font}`);
    res.json(font || []);
  } else {
    res.render('fonts/show', {
      font: font
    });
  }
});

app.get('/fonts/:font/characters/:character', function (req, res) {
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

app.post('/fonts/:font/characters/:character/coordinates', function (req, res) {
  var params = req.params;

  Fonts[params.font].characters[params.character].coordinates = req.body;

  jsonfile.writeFile(`${pathToFonts}/fonts/${params.font}.json`, Fonts[params.font], {spaces: 2}, function (err) {
    res.status(201).end();
  });
})

app.post('/fonts/:font/characters/:character/dimensions', function (req, res) {
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
