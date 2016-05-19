// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }


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
    {"name": "main$ebnf$1", "symbols": []},
    {"name": "main$ebnf$1", "symbols": ["command", "main$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "main", "symbols": ["main$ebnf$1"], "postprocess": function(d) { return d[0] }},
    {"name": "command", "symbols": ["arithmetic"], "postprocess": function(d) { return ['statement', d[0]] }},
    {"name": "command", "symbols": ["comment"], "postprocess": function(d) { return d[0] }},
    {"name": "command", "symbols": ["keyword", "_", "command"], "postprocess": function(d) { return d }},
    {"name": "command", "symbols": ["comment"], "postprocess": function(d) { return d[0] }},
    {"name": "command", "symbols": ["command", "_", "comment"], "postprocess": function(d) { return [d[0], d[2]] }},
    {"name": "comment$ebnf$1", "symbols": []},
    {"name": "comment$ebnf$1", "symbols": [/[^"\n"]/, "comment$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "comment", "symbols": ["_", {"literal":"#"}, "_", "comment$ebnf$1"], "postprocess": function(d) { return ['comment', d[3].join('')] }},
    {"name": "indent$string$1", "symbols": [{"literal":" "}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "indent", "symbols": ["indent$string$1"]},
    {"name": "keyword$string$1", "symbols": [{"literal":"p"}, {"literal":"r"}, {"literal":"i"}, {"literal":"n"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "keyword", "symbols": ["keyword$string$1"]},
    {"name": "string", "symbols": ["dqstring"]},
    {"name": "string", "symbols": ["sqstring"]},
    {"name": "string", "symbols": ["btstring"]},
    {"name": "arithmetic", "symbols": ["_", "AS", "_"], "postprocess": function(d) {return d[1]; }},
    {"name": "B", "symbols": [{"literal":"("}, "_", "AS", "_", {"literal":")"}], "postprocess": function(d) {return d[2]; }},
    {"name": "B", "symbols": ["float"], "postprocess": function(d) { return ['float', flatten(d)[0]] }},
    {"name": "B", "symbols": ["int"], "postprocess": function(d) { return ['integer', parseInt(flatten(d)[0])] }},
    {"name": "B", "symbols": ["var"], "postprocess": function(d) { return ['variable', flatten(d)[0]] }},
    {"name": "I", "symbols": ["B", "_", {"literal":"^"}, "_", "I"], "postprocess": function(d) { return ['power', flatten(d)[0]] }},
    {"name": "I", "symbols": ["B"], "postprocess": id},
    {"name": "DM", "symbols": ["DM", "_", {"literal":"*"}, "_", "I"], "postprocess": function(d) { return ['multiply', d[0], d[4] ] }},
    {"name": "DM", "symbols": ["DM", "_", {"literal":"/"}, "_", "I"], "postprocess": function(d) { return ['divide', d[0], d[4] ] }},
    {"name": "DM", "symbols": ["I"], "postprocess": id},
    {"name": "AS", "symbols": ["AS", "_", {"literal":"+"}, "_", "DM"], "postprocess": function(d) { return ['plus', d[0], d[4] ] }},
    {"name": "AS", "symbols": ["AS", "_", {"literal":"-"}, "_", "DM"], "postprocess": function(d) { return ['minus', d[0], d[4] ] }},
    {"name": "AS", "symbols": ["DM"], "postprocess": id},
    {"name": "float$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "float$ebnf$1", "symbols": [/[0-9]/, "float$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "float", "symbols": ["int", {"literal":"."}, "float$ebnf$1"], "postprocess": function(d) {return parseFloat(d[0] + d[1] + d[2])}},
    {"name": "int$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "int$ebnf$1", "symbols": [/[0-9]/, "int$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "int", "symbols": ["int$ebnf$1"], "postprocess": function(d) {return d[0].join(""); }},
    {"name": "var$ebnf$1", "symbols": ["varchar"]},
    {"name": "var$ebnf$1", "symbols": ["varchar", "var$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "var", "symbols": ["var$ebnf$1"], "postprocess":  function(data, _, reject) {
        var identifier = data[0].join('')
        if(/[0-9]/.test(identifier.charAt(0)) || special.words.indexOf(identifier) !== -1)
          return reject
        return identifier
        } },
    {"name": "varchar", "symbols": [/./], "postprocess":  function(data, _, reject) {
        if(data[0] && special.chars.indexOf(data[0]) === -1)
          return data[0]
        return reject
        } },
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": [/[\s]/, "_$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) { return null }}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
