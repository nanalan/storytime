@{%

'use strict'

const special = require('../specials.js')

const join = function(a) {
  // this is black magic
  let last = a[a.length - 1]
  return [a[0], ...last]
}

const flatten = function(arr) {
  return arr.filter(function(e){
    return e != null
  }).reduce(function (flat, toFlatten) {
    return flat.filter(function(e){
      return e != null
    }).concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, [])
}

%}

@builtin "string.ne"

main -> command_:* {% (d) => d[0].map((x) => ['line', x]) %}

command_ -> command "\n" {% d => d[0] %}

command -> expression         {% d => d[0] %}
         | comment            {% d => d[0] %}
         | keyword _ command  {% d => [d[0], d[2]] %}
         | comment            {% d => null %}
         | new_var            {% d => ['new', d[0]] %}
         | command _ comment  {% d => d[0] %}
         
comment -> _ "#" _ [^"\n"]:*  {% d => null %}
         | _ "//" _ [^"\n"]:* {% d => null %}

indent -> "  "

expression -> arithmetic {% (d) => d[0] %}

keyword -> "say" {% () => 'print' %}

new_var -> "int " var (" " setter " " expression {% d => d[3] %} ):? {% (d) => ['integer', d[1], d[2] || 0] %}

setter -> "="
        | "is"

arithmetic -> _ AS _ {% (d) => d[1] %}

# Brackets
B -> "(" _ AS _ ")" {% (d) => d[2] %}
    | float         {% (d) => ['float', flatten(d)[0]] %}
    | int           {% d => ['integer', parseInt(flatten(d)[0])] %}
    | var           {% d => ['identifier', flatten(d)[0]] %}
    | string        {% d => ['string', d[0]] %}

# Indicies
I -> B _ "^" _ I    {% function(d) { return ['power', flatten(d)[0]] } %}
   | B              {% id %}

# Division / Multiplication
DM -> DM _ "*" _ I  {% function(d) { return ['multiply', d[0], d[4] ] } %}
    | DM _ "/" _ I  {% function(d) { return ['divide', d[0], d[4] ] } %}
    | I             {% id %}

# Addition / Subtraction
AS -> AS _ "+" _ DM {% function(d) { return ['plus', d[0], d[4] ] } %}
    | AS _ "-" _ DM {% d => ['minus', d[0], d[4] ] %}
    | AS " less " DM {% d => ['minus', d[0], d[2] ] %}
    | DM            {% id %}

float -> int "." [0-9]:+ {% function(d) {return parseFloat(d[0] + d[1] + d[2])} %}
int -> [0-9]:+        {% function(d) {return d[0].join(""); } %}

string -> dqstring {% d => d[0] %}
        | sqstring {% d => d[0] %}
        | btstring {% d => d[0] %}

var -> varchar:+ {% function(data, _, reject) {
      var identifier = data[0].join('')
      if(/[0-9]/.test(identifier.charAt(0)) || special.words.