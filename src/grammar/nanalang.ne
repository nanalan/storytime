@{%

'use strict'

const special = {
  chars: '()<>. +-*/^\\!#=\'",!{}:',
  words: ['is', 'issa',
          'win', 'lose',
          'btw',
          'tri', 'cat',
          '+', '-', '/', '*', '^', 'times', 'over', 'less', 'plus', 'add',
          'if', 'elsz', 'lan', 'howto']
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

main -> program                    {% d => d[0] %}
program -> commands:*              {% d => d[0].filter(l => l[0] !== null) %}
commands -> commandn               {% (d, i) => [d[0], i] %}

commandn -> _ command _ newline    {% d => d[1] %}
          | _ newline              {% d => null %}
          | _ call                 {% d => ['call', d[1]] %}

command -> comment                 {% d => null %}
         | define                  {% d => ['define', d[0]] %}
         | modify                  {% d => ['modify', d[0]] %}
         | block (","|":"|"..."):? {% d => d[0] %}
         | "lan"                  {% d => ['end'] %}
         
comment -> "btw" __ [^"\n"]:*

block  -> "if" __ expression  {% d => ['if', d[2]] %}
        | "elsz"              {% d => ['else'] %}

        | "tri"               {% d => ['try'] %}
        | "cat" __ var        {% d => ['catch', d[1]] %}
        | "cat"               {% d => ['catch', d[1]] %}

        | "howto" __ var __ args {% d => ['fn', d[2], d[4][0].concat([d[4][1]])] %}
        | "howto" __ var      {% d => ['fn', d[2], []] %}

define -> var __ setter __ expression        {% d => [d[0], d[4]] %}
        | setter __ var                      {% d => [d[2], undefined] %}
        #| "num "  var (__ setter __ expression {% d => d[3] %} ):? {% d=>['num',d[1],d[2]||['num', 0]] %}
        #| "str "  var (__ setter __ expression {% d => d[3] %} ):? {% d=>['str',d[1],d[2]||['str', '']] %}
        #| "bool " var (__ setter __ expression {% d => d[3] %} ):? {% d=>['bool',d[1],d[2]||['bool', false]] %}

modify -> var __ "is" __ expression {% d => ['set', d[0], d[4]] %}

setter -> "issa"

callbang -> var __ args _ "!"  {% d => [d[0], d[2][0].concat([d[2][1]])] %}
          | var _ "!"          {% d => [d[0], []] %}
call -> var __ args _ newline  {% d => [d[0], d[2][0].concat([d[2][1]])] %}
      | var _ newline          {% d => [d[0], []] %}
args    -> arg:* expression    {% d => [d[0], d[1]] %}
arg     -> expression _ "," __ {% d => d[0] %}

expression -> _ EQ _ {% d => d[1] %}

# Brackets
B -> "(" _ AS _ ")"  {% d => d[2] %}
    | float          {% d => ['num', d[0]] %}
    | int            {% d => ['num', Number(d[0])] %}
    | var            {% d => ['var', d[0]] %}
    | string         {% d => ['str', d[0]] %}
    | bool           {% d => ['bool', d[0]] %}
    | callbang       {% d => ['call', d[0]] %}

# Indicies
I -> B _ "^" _ I     {% d => ['power', d[0], d[4]] %}
   | B               {% id %}

# Division / Multiplication
DM -> DM _ "*" _ I   {% d => ['multiply', d[0], d[4]] %}
    | DM _ "/" _ I   {% d => ['divide',   d[0], d[4]] %}
    | DM " times " I {% d => ['multiply', d[0], d[2]] %}
    | DM " over " I  {% d => ['divide',   d[0], d[2]] %}
    | I              {% id %}

# Addition / Subtraction
AS -> AS _ "+" _ DM  {% d => ['plus',  d[0], d[4]] %}
    | AS _ "-" _ DM  {% d => ['minus', d[0], d[4]] %}
    | AS " less " DM {% d => ['minus', d[0], d[2]] %}
    | AS " add " DM  {% d => ['plus',  d[0], d[2]] %}
    | AS " plus " DM {% d => ['plus',  d[0], d[2]] %}
    | DM             {% id %}

# Equality
EQ -> EQ __ "is" __ AS {% d => ['eq', d[0], d[4]] %}
    | AS               {% id %}

float -> int "." [0-9]:+ {% function(d) {return parseFloat(d[0] + d[1] + d[2])} %}
int -> [0-9]:+        {% function(d) {return d[0].join(""); } %}

string -> dqstring {% d => d[0] %}
        | sqstring {% d => d[0] %}
        #| btstring {% d => d[0] %}

bool -> "win"  {% d => true  %}
      | "lose" {% d => false %}

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