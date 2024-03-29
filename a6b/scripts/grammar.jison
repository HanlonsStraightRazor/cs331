/* description: Grammar for SLang 1 */
/*
 * Names: Martin Mueller and Isaiah Ley
*/

/* lexical grammar */
%lex

DIGIT         [0-9]
LETTER        [a-zA-Z]

%%

\s+                             { /* skip whitespace */ }
"fn"                            { return 'FN'; }
"("                             { return 'LPAREN'; }
")"                             { return 'RPAREN'; }
"+"                             { return 'PLUS'; }
"*"                             { return 'TIMES'; }
">"                             { return 'GREATERTHAN'; }
"\""({LETTER}|{DIGIT}|_)*"\""   { return 'STRING'; }
"add1"                          { return 'ADD1'; }
"length"                        { return 'LENGTH'; }
"if"                            { return 'IF'; }
"then"                          { return 'THEN'; }
"else"                          { return 'ELSE'; }
","                             { return 'COMMA'; }
"=>"                            { return 'THATRETURNS'; }
{LETTER}({LETTER}|{DIGIT}|_)*   { return 'VAR'; }
{DIGIT}+                        { return 'INT'; }
<<EOF>>                         { return 'EOF'; }
.                               { return 'INVALID'; }

/lex

%start program

%% /* language grammar */

program
    : exp EOF
      { return SLang.absyn.createProgram($1); }
    ;

exp
    : var_exp
      { $$ = $1; }
    | intlit_exp
      { $$ = $1; }
    | fn_exp
      { $$ = $1; }
    | app_exp
      { $$ = $1; }
    | prim_app_exp
      { $$ = $1; }
    | string_exp
      { $$ = $1; }
    | if_exp
      { $$ = $1; }
    ;

var_exp
    : VAR
      { $$ = SLang.absyn.createVarExp( $1 ); }
    ;

intlit_exp
    : INT
      { $$ = SLang.absyn.createIntExp( $1 ); }
    ;

fn_exp
    : FN LPAREN formals RPAREN THATRETURNS exp
      { $$ = SLang.absyn.createFnExp($3,$6); }
    ;

string_exp
    : STRING
      { $$ = SLang.absyn.createStringExp( $1 ); }
    ;

if_exp
    : IF exp GREATERTHAN exp THEN exp ELSE exp
      { $$ = SLang.absyn.createIfExp($2, $4, $6, $8); }
    ;

formals
    : /* empty */ { $$ = [ ]; }
    | VAR moreformals
      {
        var result;
        if ($2 === [ ])
          result = [ $1 ];
        else {
          $2.unshift($1);
          result = $2;
        }
        $$ = result;
      }
    ;

moreformals
    : /* empty */ { $$ = [ ] }
    | COMMA VAR moreformals
      { $3.unshift($2);
        $$ = $3; }
    ;

app_exp
    : LPAREN exp args RPAREN
      { $3.unshift("args");
        $$ = SLang.absyn.createAppExp($2,$3); }
    ;

prim_app_exp
    : prim_op LPAREN prim_args RPAREN
      { $$ = SLang.absyn.createPrimAppExp($1,$3); }
    ;

prim_op
    : PLUS
      { $$ = $1; }
    | TIMES
      { $$ = $1; }
    | ADD1
      { $$ = $1; }
    | LENGTH
      { $$ = $1; }
    ;

args
    : /* empty */ { $$ = [ ]; }
    | exp args
      {
        var result;
        if ($2 === [ ])
          result = [ $1 ];
        else {
          $2.unshift($1);
          result = $2;
        }
        $$ = result;
      }
    ;

prim_args
    :  /* empty */ { $$ = [ ]; }
    |  exp more_prim_args
       { $2.unshift($1); $$ = $2; }
    ;

more_prim_args
    : /* empty */ { $$ = [ ] }
    | COMMA exp more_prim_args
      { $3.unshift($2); $$ = $3; }
    ;

%%

