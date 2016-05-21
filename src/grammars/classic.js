// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }


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
    {"name": "commands$ebnf$1$subexpression$1", "symbols": ["_", "command"], "postprocess": d => d[1]},
    {"name": "commands$ebnf$1", "symbols": ["commands$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "commands$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "commands", "symbols": ["commands$ebnf$1", "_", "newline"], "postprocess": (d, i) => [d[0], i]},
    {"name": "command", "symbols": ["comment"], "postprocess": d => null},
    {"name": "command", "symbols": ["define"], "postprocess": d => ['define', d[0]]},
    {"name": "command", "symbols": ["modify"], "postprocess": d => ['modify', d[0]]},
    {"name": "command", "symbols": ["call"], "postprocess": d => ['call', d[0]]},
    {"name": "command", "symbols": ["conditional"], "postprocess": d => d[0]},
    {"name": "command$string$1", "symbols": [{"literal":"k"}, {"literal":"e"}, {"literal":"k"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "command", "symbols": ["command$string$1"], "postprocess": d => ['end']},
    {"name": "comment$string$1", "symbols": [{"literal":"("}, {"literal":"."}, {"literal":"."}, {"literal":"."}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "comment$ebnf$1", "symbols": []},
    {"name": "comment$ebnf$1", "symbols": [/[^")"]/, "comment$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "comment", "symbols": ["_", "comment$string$1", "comment$ebnf$1", {"literal":")"}]},
    {"name": "expression", "symbols": ["arithmetic"], "postprocess": d => d[0]},
    {"name": "conditional$string$1", "symbols": [{"literal":"i"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "conditional$ebnf$1$subexpression$1", "symbols": ["__", "expression"], "postprocess": d => d[1]},
    {"name": "conditional$ebnf$1", "symbols": ["conditional$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "conditional$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "conditional", "symbols": ["conditional$string$1", "__", "expression", "conditional$ebnf$1", {"literal":"?"}], "postprocess": d => ['if', d[2], d[3] || ['bool',true]]},
    {"name": "conditional$string$2", "symbols": [{"literal":"u"}, {"literal":"v"}, {"literal":"a"}, {"literal":"w"}, {"literal":"y"}, {"literal":"s"}, {"literal":","}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "conditional", "symbols": ["conditional$string$2"], "postprocess": d => ['else']},
    {"name": "define", "symbols": ["var", "__", "setter", "__", "expression"], "postprocess": d => [d[0], d[4]]},
    {"name": "define", "symbols": ["setter", "var"], "postprocess": d => [d[1], undefined]},
    {"name": "modify$string$1", "symbols": [{"literal":"i"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "modify", "symbols": ["var", "__", "modify$string$1", "__", "expression"], "postprocess": d => ['set', d[0], d[4]]},
    {"name": "setter$string$1", "symbols": [{"literal":"i"}, {"literal":"s"}, {"literal":"s"}, {"literal":"a"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "setter", "symbols": ["setter$string$1"]},
    {"name": "call", "symbols": ["var", "__", "args"], "postprocess": d => [d[0], d[2]]},
    {"name": "call", "symbols": ["var", "callEnd"], "postprocess": d => [d[0], []]},
    {"name": "args$ebnf$1", "symbols": []},
    {"name": "args$ebnf$1", "symbols": ["arg", "args$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "args", "symbols": ["args$ebnf$1", "expression", "callEnd"], "postprocess": d => { d[0].push(d[1]); return d[0] }},
    {"name": "arg", "symbols": ["expression", "_", {"literal":","}, "_"], "postprocess": d => d[0]},
    {"name": "callEnd", "symbols": [{"literal":"."}]},
    {"name": "arithmetic", "symbols": ["_", "AS", "_"], "postprocess": d => d[1]},
    {"name": "B", "symbols": [{"literal":"("}, "_", "AS", "_", {"literal":")"}], "postprocess": d => d[2]},
    {"name": "B", "symbols": ["float"], "postprocess": d => ['num', d[0]]},
    {"name": "B", "symbols": ["int"], "postprocess": d => ['num', parseInt(d[0])]},
    {"name": "B", "symbols": ["var"], "postprocess": d => ['var', d[0]]},
    {"name": "B", "symbols": ["string"], "postprocess": d => ['str', d[0]]},
    {"name": "B", "symbols": ["bool"], "postprocess": d => ['bool', d[0]]},
    {"name": "I", "symbols": ["B", "_", {"literal":"^"}, "_", "I"], "postprocess": function(d) { return ['power', flatten(d)[0]] }},
    {"name": "I", "symbols": ["B"], "postprocess": id},
    {"name": "DM", "symbols": ["DM", "_", {"literal":"*"}, "_", "I"], "postprocess": d => ['multiply', d[0], d[4]]},
    {"name": "DM", "symbols": ["DM", "_", {"literal":"/"}, "_", "I"], "postprocess": d => ['divide',   d[0], d[4]]},
    {"name": "DM$string$1", "symbols": [{"literal":" "}, {"literal":"t"}, {"literal":"i"}, {"literal":"m"}, {"literal":"e"}, {"literal":"s"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "DM", "symbols": ["DM", "DM$string$1", "I"], "postprocess": d => ['multiply', d[0], d[2]]},
    {"name": "DM$string$2", "symbols": [{"literal":" "}, {"literal":"o"}, {"literal":"v"}, {"literal":"e"}, {"literal":"r"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "DM", "symbols": ["DM", "DM$string$2", "I"], "postprocess": d => ['divide',   d[0], d[2]]},
    {"name": "DM", "symbols": ["I"], "postprocess": id},
    {"name": "AS", "symbols": ["AS", "_", {"literal":"+"}, "_", "DM"], "postprocess": d => ['plus',  d[0], d[4] ]},
    {"name": "AS", "symbols": ["AS", "_", {"literal":"-"}, "_", "DM"], "postprocess": d => ['minus', d[0], d[4] ]},
    {"name": "AS$string$1", "symbols": [{"literal":" "}, {"literal":"l"}, {"literal":"e"}, {"literal":"s"}, {"literal":"s"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "AS", "symbols": ["AS", "AS$string$1", "DM"], "postprocess": d => ['minus', d[0], d[2] ]},
    {"name": "AS$string$2", "symbols": [{"literal":" "}, {"literal":"a"}, {"literal":"d"}, {"literal":"d"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "AS", "symbols": ["AS", "AS$string$2", "DM"], "postprocess": d => ['plus',  d[0], d[2] ]},
    {"name": "AS$string$3", "symbols": [{"literal":" "}, {"literal":"p"}, {"literal":"l"}, {"literal":"u"}, {"literal":"s"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "AS", "symbols": ["AS", "AS$string$3", "DM"], "postprocess": d => ['plus',  d[0], d[2] ]},
    {"name": "AS", "symbols": ["DM"], "postprocess": id},
    {"name": "float$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "float$ebnf$1", "symbols": [/[0-9]/, "float$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "float", "symbols": ["int", {"literal":"."}, "float$ebnf$1"], "postprocess": function(d) {return parseFloat(d[0] + d[1] + d[2])}},
    {"name": "int$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "int$ebnf$1", "symbols": [/[0-9]/, "int$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "int", "symbols": ["int$ebnf$1"], "postprocess": function(d) {return d[0].join(""); }},
    {"name": "string", "symbols": ["dqstring"], "postprocess": d => d[0]},
    {"name": "string", "symbols": ["sqstring"], "postprocess": d => d[0]},
    {"name": "bool$string$1", "symbols": [{"literal":"t"}, {"literal":"r"}, {"literal":"u"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "bool", "symbols": ["bool$string$1"], "postprocess": () => true},
    {"name": "bool$string$2", "symbols": [{"literal":"f"}, {"literal":"a"}, {"literal":"l"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "bool", "symbols": ["bool$string$2"], "postprocess": () => false},
    {"name": "bool$string$3", "symbols": [{"literal":"l"}, {"literal":"i"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "bool", "symbols": ["bool$string$3"], "postprocess": () => false},
    {"name": "var$ebnf$1", "symbols": ["varchar"]},
    {"name": "var$ebnf$1", "symbols": ["varchar", "var$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "var", "symbols": ["_", "var$ebnf$1", "_"], "postprocess":  (d, _, no) => {
        var identifier = d[1].join('')
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
