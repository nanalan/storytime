// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }


'use strict'

const special = {
  chars: '()<>. +-*/^\\!#=\'",!{}',
  words: ['is', 'issa',
          'win', 'lose',
          'btw',
          'tri', 'cat',
          '+', '-', '/', '*', '^', 'times', 'over', 'less', 'plus', 'add',
          'if', 'elsz', 'gtfo']
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



function nth(n) {
    return function(d) {
        return d[n];
    };
}


function $(o) {
    return function(d) {
        var ret = {};
        Object.keys(o).forEach(function(k) {
            ret[k] = d[o[k]];
        });
        return ret;
    };
}
var grammar = {
    ParserRules: [
    {"name": "dqstring$ebnf$1", "symbols": []},
    {"name": "dqstring$ebnf$1", "symbols": ["dstrchar", "dqstring$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "dqstring", "symbols": [{"literal":"\""}, "dqstring$ebnf$1", {"literal":"\""}], "postprocess": function(d) {return d[1].join(""); }},
    {"name": "sqstring$ebnf$1", "symbols": []},
    {"name": "sqstring$ebnf$1", "symbols": ["sstrchar", "sqstring$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "sqstring", "symbols": [{"literal":"'"}, "sqstring$ebnf$1", {"literal":"'"}], "postprocess": function(d) {return d[1].join(""); }},
    {"name": "btstring$ebnf$1", "symbols": []},
    {"name": "btstring$ebnf$1", "symbols": [/[^`]/, "btstring$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "btstring", "symbols": [{"literal":"`"}, "btstring$ebnf$1", {"literal":"`"}], "postprocess": function(d) {return d[1].join(""); }},
    {"name": "dstrchar", "symbols": [/[^\\"\n]/], "postprocess": id},
    {"name": "dstrchar", "symbols": [{"literal":"\\"}, "strescape"], "postprocess": 
        function(d) {
            return JSON.parse("\""+d.join("")+"\"");
        }
        },
    {"name": "sstrchar", "symbols": [/[^\\'\n]/], "postprocess": id},
    {"name": "sstrchar", "symbols": [{"literal":"\\"}, "strescape"], "postprocess": 
        function(d) {
            return JSON.parse("\""+d.join("")+"\"");
        }
        },
    {"name": "strescape", "symbols": [/["'\\/bfnrt]/], "postprocess": id},
    {"name": "strescape", "symbols": [{"literal":"u"}, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/], "postprocess": 
        function(d) {
            return d.join("");
        }
        },
    {"name": "main", "symbols": ["program"], "postprocess": d => d[0]},
    {"name": "program$ebnf$1", "symbols": []},
    {"name": "program$ebnf$1", "symbols": ["commands", "program$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "program", "symbols": ["program$ebnf$1"], "postprocess": d => d[0].filter(l => l[0] !== null)},
    {"name": "commands", "symbols": ["commandn"], "postprocess": (d, i) => [d[0], i]},
    {"name": "commandn", "symbols": ["_", "command", "_", "newline"], "postprocess": d => d[1]},
    {"name": "commandn", "symbols": ["_", "newline"], "postprocess": d => null},
    {"name": "commandn", "symbols": ["_", "call"], "postprocess": d => ['call', d[1]]},
    {"name": "command", "symbols": ["comment"], "postprocess": d => null},
    {"name": "command", "symbols": ["define"], "postprocess": d => ['define', d[0]]},
    {"name": "command", "symbols": ["modify"], "postprocess": d => ['modify', d[0]]},
    {"name": "command$ebnf$1$subexpression$1", "symbols": [{"literal":","}]},
    {"name": "command$ebnf$1$subexpression$1", "symbols": [{"literal":":"}]},
    {"name": "command$ebnf$1", "symbols": ["command$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "command$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "command", "symbols": ["conditional", "command$ebnf$1"], "postprocess": d => d[0]},
    {"name": "command$string$1", "symbols": [{"literal":"g"}, {"literal":"t"}, {"literal":"f"}, {"literal":"o"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "command", "symbols": ["command$string$1"], "postprocess": d => ['end']},
    {"name": "comment$string$1", "symbols": [{"literal":"b"}, {"literal":"t"}, {"literal":"w"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "comment$ebnf$1", "symbols": []},
    {"name": "comment$ebnf$1", "symbols": [/[^"\n"]/, "comment$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "comment", "symbols": ["comment$string$1", "__", "comment$ebnf$1"]},
    {"name": "conditional$string$1", "symbols": [{"literal":"i"}, {"literal":"f"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "conditional", "symbols": ["conditional$string$1", "__", "expression"], "postprocess": d => ['if', d[2]]},
    {"name": "conditional$string$2", "symbols": [{"literal":"e"}, {"literal":"l"}, {"literal":"s"}, {"literal":"z"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "conditional", "symbols": ["conditional$string$2"], "postprocess": d => ['else']},
    {"name": "conditional$string$3", "symbols": [{"literal":"t"}, {"literal":"r"}, {"literal":"i"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "conditional", "symbols": ["conditional$string$3"], "postprocess": d => ['try']},
    {"name": "conditional$string$4", "symbols": [{"literal":"c"}, {"literal":"a"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "conditional$ebnf$1$subexpression$1", "symbols": ["__", "var"], "postprocess": d => d[1]},
    {"name": "conditional$ebnf$1", "symbols": ["conditional$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "conditional$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "conditional", "symbols": ["conditional$string$4", "conditional$ebnf$1"], "postprocess": d => ['catch', d[1]]},
    {"name": "define", "symbols": ["var", "__", "setter", "__", "expression"], "postprocess": d => [d[0], d[4]]},
    {"name": "define", "symbols": ["setter", "__", "var"], "postprocess": d => [d[2], undefined]},
    {"name": "modify$string$1", "symbols": [{"literal":"i"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "modify", "symbols": ["var", "__", "modify$string$1", "__", "expression"], "postprocess": d => ['set', d[0], d[4]]},
    {"name": "setter$string$1", "symbols": [{"literal":"i"}, {"literal":"s"}, {"literal":"s"}, {"literal":"a"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "setter", "symbols": ["setter$string$1"]},
    {"name": "callbang", "symbols": ["var", "__", "args", "_", {"literal":"!"}], "postprocess": d => [d[0], d[2][0].concat([d[2][1]])]},
    {"name": "callbang", "symbols": ["var", "_", {"literal":"!"}], "postprocess": d => [d[0], []]},
    {"name": "call", "symbols": ["var", "__", "args", "_", "newline"], "postprocess": d => [d[0], d[2][0].concat([d[2][1]])]},
    {"name": "call", "symbols": ["var", "_", "newline"], "postprocess": d => [d[0], []]},
    {"name": "args$ebnf$1", "symbols": []},
    {"name": "args$ebnf$1", "symbols": ["arg", "args$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "args", "symbols": ["args$ebnf$1", "expression"], "postprocess": d => [d[0], d[1]]},
    {"name": "arg", "symbols": ["expression", "_", {"literal":","}, "__"], "postprocess": d => d[0]},
    {"name": "expression", "symbols": ["_", "EQ", "_"], "postprocess": d => d[1]},
    {"name": "B", "symbols": [{"literal":"("}, "_", "AS", "_", {"literal":")"}], "postprocess": d => d[2]},
    {"name": "B", "symbols": ["float"], "postprocess": d => ['num', d[0]]},
    {"name": "B", "symbols": ["int"], "postprocess": d => ['num', Number(d[0])]},
    {"name": "B", "symbols": ["var"], "postprocess": d => ['var', d[0]]},
    {"name": "B", "symbols": ["string"], "postprocess": d => ['str', d[0]]},
    {"name": "B", "symbols": ["bool"], "postprocess": d => ['bool', d[0]]},
    {"name": "B", "symbols": ["callbang"], "postprocess": d => ['call', d[0]]},
    {"name": "I", "symbols": ["B", "_", {"literal":"^"}, "_", "I"], "postprocess": d => ['power', d[0], d[4]]},
    {"name": "I", "symbols": ["B"], "postprocess": id},
    {"name": "DM", "symbols": ["DM", "_", {"literal":"*"}, "_", "I"], "postprocess": d => ['multiply', d[0], d[4]]},
    {"name": "DM", "symbols": ["DM", "_", {"literal":"/"}, "_", "I"], "postprocess": d => ['divide',   d[0], d[4]]},
    {"name": "DM$string$1", "symbols": [{"literal":" "}, {"literal":"t"}, {"literal":"i"}, {"literal":"m"}, {"literal":"e"}, {"literal":"s"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "DM", "symbols": ["DM", "DM$string$1", "I"], "postprocess": d => ['multiply', d[0], d[2]]},
    {"name": "DM$string$2", "symbols": [{"literal":" "}, {"literal":"o"}, {"literal":"v"}, {"literal":"e"}, {"literal":"r"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "DM", "symbols": ["DM", "DM$string$2", "I"], "postprocess": d => ['divide',   d[0], d[2]]},
    {"name": "DM", "symbols": ["I"], "postprocess": id},
    {"name": "AS", "symbols": ["AS", "_", {"literal":"+"}, "_", "DM"], "postprocess": d => ['plus',  d[0], d[4]]},
    {"name": "AS", "symbols": ["AS", "_", {"literal":"-"}, "_", "DM"], "postprocess": d => ['minus', d[0], d[4]]},
    {"name": "AS$string$1", "symbols": [{"literal":" "}, {"literal":"l"}, {"literal":"e"}, {"literal":"s"}, {"literal":"s"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "AS", "symbols": ["AS", "AS$string$1", "DM"], "postprocess": d => ['minus', d[0], d[2]]},
    {"name": "AS$string$2", "symbols": [{"literal":" "}, {"literal":"a"}, {"literal":"d"}, {"literal":"d"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "AS", "symbols": ["AS", "AS$string$2", "DM"], "postprocess": d => ['plus',  d[0], d[2]]},
    {"name": "AS$string$3", "symbols": [{"literal":" "}, {"literal":"p"}, {"literal":"l"}, {"literal":"u"}, {"literal":"s"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "AS", "symbols": ["AS", "AS$string$3", "DM"], "postprocess": d => ['plus',  d[0], d[2]]},
    {"name": "AS", "symbols": ["DM"], "postprocess": id},
    {"name": "EQ$string$1", "symbols": [{"literal":"i"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "EQ", "symbols": ["EQ", "__", "EQ$string$1", "__", "AS"], "postprocess": d => ['eq', d[0], d[4]]},
    {"name": "EQ", "symbols": ["AS"], "postprocess": id},
    {"name": "float$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "float$ebnf$1", "symbols": [/[0-9]/, "float$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "float", "symbols": ["int", {"literal":"."}, "float$ebnf$1"], "postprocess": function(d) {return parseFloat(d[0] + d[1] + d[2])}},
    {"name": "int$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "int$ebnf$1", "symbols": [/[0-9]/, "int$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "int", "symbols": ["int$ebnf$1"], "postprocess": function(d) {return d[0].join(""); }},
    {"name": "string", "symbols": ["dqstring"], "postprocess": d => d[0]},
    {"name": "string", "symbols": ["sqstring"], "postprocess": d => d[0]},
    {"name": "bool$string$1", "symbols": [{"literal":"w"}, {"literal":"i"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "bool", "symbols": ["bool$string$1"], "postprocess": d => true},
    {"name": "bool$string$2", "symbols": [{"literal":"l"}, {"literal":"o"}, {"literal":"s"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "bool", "symbols": ["bool$string$2"], "postprocess": d => false},
    {"name": "var$ebnf$1", "symbols": ["varchar"]},
    {"name": "var$ebnf$1", "symbols": ["varchar", "var$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "var", "symbols": ["var$ebnf$1"], "postprocess":  (d, _, no) => {
        var identifier = d[0].join('')
        if(/[0-9]/.test(identifier.charAt(0)) || special.words.indexOf(identifier) !== -1) return no
        return identifier
        } },
    {"name": "varchar", "symbols": [/./], "postprocess": (d, _, no) => d[0] && special.chars.indexOf(d[0]) === -1 ? d[0] : no},
    {"name": "newline", "symbols": [{"literal":"\r"}, {"literal":"\n"}]},
    {"name": "newline", "symbols": [{"literal":"\r"}]},
    {"name": "newline", "symbols": [{"literal":"\n"}]},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": [{"literal":" "}, "_$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) { return null }},
    {"name": "__$ebnf$1", "symbols": [{"literal":" "}]},
    {"name": "__$ebnf$1", "symbols": [{"literal":" "}, "__$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) { return null }}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
