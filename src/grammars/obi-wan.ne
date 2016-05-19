@{%

'use strict'

const special = {
  chars: '()<>. +-*/^\\!#',
  words: ['num', 'str']
}

const join = function(a) {
  // this is black magic
  var last = a[a.length - 1]
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

main -> commands:* {% (d) => d[0].filter(l => l !== null).map(l => ['line', l]) %}

commands -> command:? _ newline {% d => d[0] %}

command -> expression         {% d => d[0] %}
         | comment            {% d => null %}
         | define             {% d => ['define', d[0]] %}
         | modify             {% d => ['modify', d[0]] %}
         | call               {% d => ['call', d[0]] %}
         | command _ comment  {% d => d[0] %}
         
comment -> _ "#" _ [^"\n"]:*  {% d => null %}

indent -> "  "

expression -> arithmetic {% (d) => d[0] %}

keyword -> "say" {% () => 'print' %}

define -> "num " var (__ setter __ expression {% d => d[3] %} ):? {% d => ['num', d[1], d[2] || 0] %}

modify -> var __ setter __ expression {% d => ['set', d[0], d[4]] %}

setter -> "="
        | "is"

call -> var __ args             {% d => [d[0], ...d[2]] %}
      | var                     {% d => [d[0]         ] %}
      | var "(" _ args:? _ ")"  {% d => [d[0], ...d[3]] %}

args -> arg:+                   {% d => d[0] %}
arg  -> expression _ "," _ args {% join %}
      | expression              {% d => d[0] %}

arithmetic -> _ AS _ {% (d) => d[1] %}

# Brackets
B -> "(" _ AS _ ")" {% d => d[2] %}
    | float         {% d => ['num', flatten(d)[0]] %}
    | int           {% d => ['num', parseInt(flatten(d)[0])] %}
    | var           {% d => ['var', flatten(d)[0]] %}
    | string        {% d => ['str', d[0]] %}

# Indicies
I -> B _ "^" _ I    {% function(d) { return ['power', flatten(d)[0]] } %}
   | B              {% id %}

# Division / Multiplication
DM -> DM _ "*" _ I    {% d => ['multiply', d[0], d[4]] %}
    | DM _ "/" _ I    {% d => ['divide',   d[0], d[4]] %}
    | DM " times " I  {% d => ['multiply', d[0], d[2]] %}
    | DM " divide " I {% d => ['divide',   d[0], d[2]] %}
    | DM " over " I   {% d => ['divide',   d[0], d[2]] %}
    | I               {% id %}

# Addition / Subtraction
AS -> AS _ "+" _ DM  {% d => ['plus',  d[0], d[4] ] %}
    | AS _ "-" _ DM  {% d => ['minus', d[0], d[4] ] %}
    | AS " less " DM {% d => ['minus', d[0], d[2] ] %}
    | AS " add " DM  {% d => ['plus',  d[0], d[2] ] %}
    | AS " plus " DM {% d => ['plus',  d[0], d[2] ] %}
    | DM             {% id %}

float -> int "." [0-9]:+ {% function(d) {return parseFloat(d[0] + d[1] + d[2])} %}
int -> [0-9]:+        {% function(d) {return d[0].join(""); } %}

string -> dqstring {% d => d[0] %}
        | sqstring {% d => d[0] %}
        | btstring {% d => d[0] %}

var -> varchar:+ {% (d, _, no) => {
      var identifier = d[0].join('')
      if(/[0-9]/.test(identifier.charAt(0)) || special.words.indexOf(identifier) !== -1) return no
      return identifier
      } %} 
varchar -> . {% (d, _, no) => d[0] && special.chars.indexOf(d[0]) === -1 ? d[0] : no %} 

newline -> "\r" "\n"
         | "\r"
         | "\n"

_  -> " ":*     {% function(d) { return null } %}
__ -> " ":+     {% function(d) { return null } %}