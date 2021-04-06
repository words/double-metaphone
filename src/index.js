/* eslint-env browser */

import {doubleMetaphone} from 'double-metaphone'

var $input = document.querySelector('input')
var $output = document.querySelector('output')

$input.addEventListener('input', oninputchange)

oninputchange()

function oninputchange() {
  $output.textContent = JSON.stringify(doubleMetaphone($input.value))
}
