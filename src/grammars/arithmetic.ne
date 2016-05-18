arithmetic -> _ AS _ {% function(d) {return d[1]; } %}

# Brackets
B -> "(" _ AS _ ")" {% function(d) {return d[2]; } %}
    | n             {% id %}

# Indicies
I -> B _ "^" _ I
   | B              {% id %}

# Division / Multiplication
DM -> DM _ "*" _ I
    | DM _ "/" _ I
    | I             {% id %}

# Addition / Subtraction
AS -> AS _ "+" _ DM
    | AS _ "-" _ DM
    | DM            {% id %}

n -> float {% id %}
   | var

float -> int "." [0-9]:+ {% function(d) {return parseFloat(d[0] + d[1] + d[2])} %}
       | int         {% function(d) {return parseInt(d[0])} %}

int -> [0-9]:+        {% function(d) {return d[0].join(""); } %}

var -> varchar:+ {% function(data, _, reject) {
      var identifier = data[0].join('')
      if(/[0-9]/.test(identifier.charAt(0)) || special.words.indexOf(identifier) !== -1)
        return reject
      return ['variable', identifier]
      } %}
varchar -> . {% function(data, _, reject) {
            if(data[0] && special.chars.indexOf(data[0]) === -1)
              return data[0]
            return reject
            } %}

_ -> [\s]:*     {% function(d) {return null; } %}