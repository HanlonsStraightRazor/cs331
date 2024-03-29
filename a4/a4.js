/*************************************
   CS 331 - A4

   your name(s): Martin Mueller & Isaiah Ley

 *************************************/

var fp = require('./fp');
if ( ! exports ) {
   var exports = [ ];
}

var prune = function (ns) {
  if (fp.isNull(ns)) {
    return ns;
  } else if (fp.isNull(fp.tl(ns))) {
    return [];
  } else if (fp.isList(fp.hd(ns))) {
    return fp.cons(prune(fp.hd(ns)), prune(fp.tl(ns)));
  } else {
    return fp.cons(fp.hd(ns), prune(fp.tl(ns)));
  }
};

var hasMoreEvensHelper = function (ns, a) {
  if (fp.isNull(ns)) {
    return a;
  } else if (fp.isList(fp.hd(ns))) {
    return fp.add(hasMoreEvensHelper(fp.hd(ns), a),
                  hasMoreEvensHelper(fp.tl(ns), a));
  } else if (fp.isEq(fp.rem(fp.hd(ns), 2), 0)) {
    return hasMoreEvensHelper(fp.tl(ns), fp.add(a, 1));
  } else {
    return hasMoreEvensHelper(fp.tl(ns), fp.sub(a, 1));
  }
};

var hasMoreEvens = function (ns) {
  return fp.isGT(hasMoreEvensHelper(ns, 0), 0);
};

var max = function (ns) {
  return fp.reduce(fp.max, ns, fp.hd(ns));
};

var countEvens = function (ns) {
  return fp.reduce(
    fp.add,
    fp.map(function (x) {
             return fp.rem(fp.add(x, 1), 2);
           },
           ns
    ),
    0
  );
};

var getHeaviest = function (ns) {
  return fp.reduce(
    fp.max,
    fp.map(function (x) {
             if (fp.isList(x)) {
               return fp.reduce(fp.add, x, 0);
             } else {
               return x;
             }
           },
           ns
    ),
    0
  );
};

exports.hasMoreEvens = hasMoreEvens;
exports.prune = prune;
exports.countEvens = countEvens;
exports.max = max;
exports.getHeaviest = getHeaviest;
