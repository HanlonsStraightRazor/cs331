/* 
    Description: Parses check amounts in the North-American notation
*/

// lexical section of the grammar 
// ==============================

// ******* you are NOT allowed to modify the lexical section ************

%lex
%%
\s+                   /* no return statement, so skip whitespace */
[0]		      return "ZERO"
[1-9]		      return "POSITIVE_DIGIT"  
"*"                   return "ASTERISK"
"$"                   return "DOLLAR"
","                   return "COMMA"
"."                   return "POINT"
<<EOF>>               return "EOF"
.                     return "INVALID"

/lex

%start program

// phrase-structure section of the grammar
// =======================================

%%

program
    : amount EOF
    ;

// ********* this is where you must write your grammar ****************


amount
  : "DOLLAR" value
  ;

value
  : money
  | "ASTERISK" value
  ;

money
  : beforepoint
  | beforepoint "POINT" digit digit
  ;

beforepoint
  : "ZERO"
  | nonzero
  ;

nonzero
  : "POSITIVE_DIGIT"
  | "POSITIVE_DIGIT" digit
  | "POSITIVE_DIGIT" digit digit
  | nonzero "COMMA" digit digit digit
  ;

digit
  : "ZERO"
  | "POSITIVE_DIGIT"
  ;
