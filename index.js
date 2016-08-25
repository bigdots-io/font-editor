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
    var characters = require(`${pathToFonts}/fonts/${font}/characters`);
    res.json(characters || []);
  } else {
    res.render('font', {
      font: font
    });
  }
});

app.get('/:font/character/:character', function (req, res) {
  var font = req.params.font,
      character = req.params.character;

  if(req.xhr) {
    var characters = require(`${pathToFonts}/fonts/${font}/characters`);
    res.json({
      character: character,
      coordinates: characters[character] || []
    });
  } else {
    res.render('character', {
      font: font
    });
  }
});

app.post('/:font/character/:character', function (req, res) {
  var font = req.params.font,
      character = req.params.character;

  var characters = require(`${pathToFonts}/fonts/${font}/characters`);
  characters[character] = req.body.coordinates;
  jsonfile.writeFile(`${pathToFonts}/fonts/${font}/characters.json`, characters, {spaces: 2}, function (err) {
    // something?
  });
  res.status(201).end();
})

app.listen(3000)
