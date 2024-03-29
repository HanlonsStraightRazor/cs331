/* global SLang : true, parser */
/*
 * Names: Martin Mueller and Isaiah Ley
*/

(function () {
  "use strict";
  var A = window.SLang.absyn;
  var E = window.SLang.env;
  var parser = window.parser || window.grammar;

function nth(n) {
  switch (n+1) {
    case 1:
      return "first";
    case 2:
      return "second";
    case 3:
      return "third";
    default:
      return (n+1) + "th";
  }
}

function typeCheckPrimitiveOp(op,args,typeCheckerFunctions) {
  var numArgs = typeCheckerFunctions.length;
  if (args.length !== numArgs) {
    throw new Error("Wrong number of arguments given to '" + op + "'.");
  }
  for( var index = 0; index<numArgs; index++) {
    if ( ! (typeCheckerFunctions[index])(args[index]) ) {
      throw new Error("The " + nth(index) + " argument of '" + op +
      "' has the wrong type.");
    }
  }
}

function applyPrimitive(prim,args) {
  switch (prim) {
    case "+":
      if ( E.isNum(args[0]) && E.isNum(args[1]) ) {
        typeCheckPrimitiveOp(prim, args, [E.isNum, E.isNum]);
        return E.createNum( E.getNumValue(args[0]) + E.getNumValue(args[1]));
      } else if ( E.isNum(args[0]) && E.isString(args[1])) {
        typeCheckPrimitiveOp(prim, args, [E.isNum, E.isString]);
        return E.createString( E.getNumValue(args[0]) + E.getString(args[1]));
      } else if ( E.isString(args[0]) && E.isNum(args[1])) {
        typeCheckPrimitiveOp(prim, args, [E.isString, E.isNum]);
        return E.createString( E.getString(args[0]) + E.getNumValue(args[1]));
      } else if ( E.isString(args[0]) && E.isString(args[1])) {
        typeCheckPrimitiveOp(prim, args, [E.isString, E.isString]);
        return E.createString( E.getString(args[0]) + E.getString(args[1]));
      }
      typeCheckPrimitiveOp(prim, args, [E.isNum, E.isNum]);
      return null;
    case "*":
      typeCheckPrimitiveOp(prim, args, [E.isNum, E.isNum]);
      return E.createNum( E.getNumValue(args[0]) * E.getNumValue(args[1]));
    case "add1":
      typeCheckPrimitiveOp(prim, args, [E.isNum]);
      return E.createNum( 1 + E.getNumValue(args[0]) );
    case "length":
      typeCheckPrimitiveOp(prim, args, [E.isString]);
      return E.createNum( E.getString(args[0]).length );
  }
}

function evalExp(exp,envir) {
  if (A.isIntExp(exp)) {
    return E.createNum(A.getIntExpValue(exp));
  } else if (A.isVarExp(exp)) {
    return E.lookup(envir,A.getVarExpId(exp));
  } else if (A.isFnExp(exp)) {
    return E.createClo(A.getFnExpParams(exp), A.getFnExpBody(exp), envir);
  } else if (A.isAppExp(exp)) {
    var f = evalExp(A.getAppExpFn(exp), envir);
    var args = A.getAppExpArgs(exp).map( function(arg) {
    return evalExp(arg, envir); }
    );
    if (E.isClo(f)) {
      if (E.getCloParams(f).length !== args.length) {
        throw new Error("Runtime error: wrong number of arguments in " +
        "a function call (" + E.getCloParams(f).length +
        " expected but " + args.length + " given)");
      } else {
        return evalExp(E.getCloBody(f),
        E.update(E.getCloEnv(f),E.getCloParams(f),args));
      }
    } else {
      throw f + " is not a closure and thus cannot be applied.";
    }
  } else if (A.isPrimAppExp(exp)) {
    return applyPrimitive(A.getPrimAppExpPrim(exp),
    SLang.absyn.getPrimAppExpArgs(exp)
    .map( function(arg) { return evalExp(arg,envir); } ));
  } else if (A.isStringExp(exp)) {
    return E.createString(A.getStringExp(exp));
  } else if (A.isIfExp(exp)) {
    if (E.getNumValue(evalExp(A.getIfExpNum1(exp), envir)) >
        E.getNumValue(evalExp(A.getIfExpNum2(exp), envir))) {
      return evalExp(A.getIfExpExp1(exp), envir);
    } else {
      return evalExp(A.getIfExpExp2(exp), envir);
    }
  } else {
    throw "Error: Attempting to evaluate an invalid expression";
  }
}

function myEval(p) {
  if (A.isProgram(p)) {
    return evalExp(A.getProgramExp(p),E.initEnv());
  } else {
    window.alert( "The input is not a program.");
  }
}

function interpret(source) {
  var theParser = typeof grammar === 'undefined' ? parser : grammar;
  var output='';
  try {
    if (source === '') {
      window.alert('Nothing to interpret: you must provide some input!');
    } else {
      var ast = theParser.parse(source);
      var value = myEval( ast );
      return JSON.stringify(value);
    }
  } catch (exception) {
    window.alert(exception);
    return "No output [Runtime error]";
  }
  return output;
}

SLang.interpret = interpret; // make the interpreter public

}());
