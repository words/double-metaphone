'use strict'

/* eslint-env browser */

var doubleMetaphone = require('double-metaphone')

var $input = document.querySelector('input')
var $output = document.querySelector('output')

$input.addEventListener('input', oninputchange)

oninputchange()

function oninputchange() {
  $output.textContent = JSON.stringify(doubleMetaphone($input.value))
}
