"use strict";

var express = require('express');
var app = express();
var mustacheExpress = require('mustache-express');
var bodyParser = require('body-parser');
var jsonfile = require('jsonfile');

var pathToFonts = '../typewriter';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));
app.engine('html', mustacheExpress());
app.set('view engine', 'html');

app.get('/:font/', function (req, res) {
  var font = req.params.font,
      letter = req.params.letter;

  if(req.xhr) {
    var font = require(`${pathToFonts}/fonts/${font}`);
    res.json(font || []);
  } else {
    res.render('font', {
      font: font
    });
  }
});

app.get('/:font/character/:character', function (req, res) {
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
    res.render('character', {
      font: params.font
    });
  }
});

app.post('/:font/character/:character', function (req, res) {
  var params = req.params;

  var font = require(`${pathToFonts}/fonts/${params.font}`);
  font.characters[params.character] = {
    coordinates: req.body.coordinates
  }

  if(params.width) {
    font.width = params.width
  }

  jsonfile.writeFile(`${pathToFonts}/fonts/${params.font}.json`, font, {spaces: 2}, function (err) {
    // something?
  });
  res.status(201).end();
})

app.listen(3000)
