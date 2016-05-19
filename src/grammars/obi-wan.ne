@{%

var special = require('../specials.js')

var join = function(a) {
  // this is black magic
  var last = a[a.length - 1]
  return [a[0], ...last]
}

var flatten = function(arr) {
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

main -> command:* {% function(d) { return d[0] } %}
command -> arithmetic {% function(d) { return ['statement', d[0]] } %}
         | comment {% function(d) { return d[0] } %}
         | keyword _ command {% function(d) { return d } %}
         | comment {% function(d) { return d[0] } %}
         | command _ comment {% function(d) { return [d[0], d[2]] } %}
comment -> _ "#" _ [^"\n"]:* {% function(d) { return ['comment', d[3].join('')] } %}

indent -> "  "

keyword -> "print"

string -> dqstring
        | sqstring
        | btstring

arithmetic -> _ AS _ {% function(d) {return d[1]; } %}
            

# Brackets
B -> "(" _ AS _ ")" {% function(d) {return d[2]; } %}
    | float         {% function(d) { return ['float', flatten(d)[0]] } %}
    | int           {% function(d) { return ['integer', parseInt(flatten(d)[0])] } %}
    | var           {% function(d) { return ['variable', flatten(d)[0]] } %}

# Indicies
I -> B _ "^" _ I    {% function(d) { return ['power', flatten(d)[0]] } %}
   | B              {% id %}

# Division / Multiplication
DM -> DM _ "*" _ I  {% function(d) { return ['multiply', d[0], d[4] ] } %}
    | DM _ "/" _ I  {% function(d) { return ['divide', d[0], d[4] ] } %}
    | I             {% id %}

# Addition / Subtraction
AS -> AS _ "+" _ DM {% function(d) { return ['plus', d[0], d[4] ] } %}
    | AS _ "-" _ DM {% function(d) { return ['minus', d[0], d[4] ] } %}
    | DM            {% id %}

float -> int "." [0-9]:+ {% function(d) {return parseFloat(d[0] + d[1] + d[2])} %}
int -> [0-9]:+        {% function(d) {return d[0].join(""); } %}

var -> varchar:+ {% function(data, _, reject) {
      var identifier = data[0].join('')
      if(/[0-9]/.test(identifier.charAt(0)) || special.words.indexOf(identifier) !== -1)
        return reject
      return identifier
      } %}
varchar -> . {% function(data, _, reject) {
            if(data[0] && special.chars.indexOf(data[0]) === -1)
              return data[0]
            return reject
            } %}

_ -> [\s]:*     {% function(d) { return null } %}