@{%

'use strict'

const special = {
  chars: '()<>. +-*/^\\!#=\'",!{}',
  words: ['is', 'issa',
          'tru', 'fals', 'lie',
          'if', 'otherwise']
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

main -> program                                     {% d => d[0] %}
program -> commands:*                               {% d => d[0].filter(l => l[0] !== null) %}
commands -> (_ command {% d => d[1] %}):? _ newline {% (d, i) => [d[0], i] %}

command -> comment           {% d => null %}
         | define            {% d => ['define', d[0]] %}
         | modify            {% d => ['modify', d[0]] %}
         | call              {% d => ['call', d[0]] %}
         | conditional       {% d => d[0] %}
         | "kek"             {% d => ['end'] %}
         
comment -> _ "(..." [^")"]:* ")"

expression -> arithmetic     {% d => d[0] %}

conditional -> "is" __ expression (__ expression {% d => d[1] %}):? "?" {% d => ['if', d[2], d[3] || ['bool',true]] %}
             | "uvawys,"           {% d => ['else'] %}

define -> var __ setter __ expression        {% d => [d[0], d[4]] %}
        | setter var                         {% d => [d[1], undefined] %}
        #| "num "  var (__ setter __ expression {% d => d[3] %} ):? {% d=>['num',d[1],d[2]||['num', 0]] %}
        #| "str "  var (__ setter __ expression {% d => d[3] %} ):? {% d=>['str',d[1],d[2]||['str', '']] %}
        #| "bool " var (__ setter __ expression {% d => d[3] %} ):? {% d=>['bool',d[1],d[2]||['bool', false]] %}

modify -> var __ "is" __ expression {% d => ['set', d[0], d[4]] %}

setter -> "issa"

call -> var __ args              {% d => [d[0], d[2]] %}
      | var callEnd              {% d => [d[0], []] %}

args -> arg:* expression callEnd {% d => { d[0].push(d[1]); return d[0] } %}
arg  -> expression _ "," _       {% d => d[0] %}

callEnd -> "."

arithmetic -> _ AS _ {% d => d[1] %}

# Brackets
B -> "(" _ AS _ ")"  {% d => d[2] %}
    | float          {% d => ['num', d[0]] %}
    | int            {% d => ['num', parseInt(d[0])] %}
    | var            {% d => ['var', d[0]] %}
    | string         {% d => ['str', d[0]] %}
    | bool           {% d => ['bool', d[0]] %}

# Indicies
I -> B _ "^" _ I     {% function(d) { return ['power', flatten(d)[0]] } %}
   | B               {% id %}

# Division / Multiplication
DM -> DM _ "*" _ I   {% d => ['multiply', d[0], d[4]] %}
    | DM _ "/" _ I   {% d => ['divide',   d[0], d[4]] %}
    | DM " times " I {% d => ['multiply', d[0], d[2]] %}
    | DM " over " I  {% d => ['divide',   d[0], d[2]] %}
    | I              {% id %}

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
        #| btstring {% d => d[0] %}

bool -> "tru"  {% () => true  %}
      | "fals" {% () => false %}
      | "lie" {% () => false %}

var -> _ varchar:+ _ {% (d, _, no) => {
      var identifier = d[1].join('')
      if(/[0-9]/.test(identifier.charAt(0)) || special.words.indexOf(identifier) !== -1) return no
      return identifier
      } %}
varchar -> . {% (d, _, no) => d[0] && special.chars.indexOf(d[0]) === -1 ? d[0] : no %}

newline -> "\r" "\n"
         | "\r"
         | "\n"

_  -> " ":*     {% function(d) { return null } %}
__ -> " ":+     {% function(d) { return null } %}