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

    /* to be completed */
    
};

var hasMoreEvens = function (ns) {
    return true;   /* here you may ONLY modify the "true" constant */
};

var max = function (ns) {

    /* to be completed */
    
};

var countEvens = function (ns) {

    /* to be completed */
};

var getHeaviest = function (ns) {

    /* to be completed */    
    
};

exports.hasMoreEvens = hasMoreEvens;
exports.prune = prune;
exports.countEvens = countEvens;
exports.max = max;
exports.getHeaviest = getHeaviest;