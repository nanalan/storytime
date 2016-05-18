@{%

var special = require('../specials.js')

%}

@builtin "string.ne"
@include "grammars/arithmetic.ne"

main -> _ arithmetic _

indent -> "  "

string -> dqstring
        | sqstring
        | btstring