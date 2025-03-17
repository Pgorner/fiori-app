/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff5400.formula.editor"
],
function(oFF)
{
"use strict";
oFF.loadHiloLexer = function() {

// $ANTLR 3.3 Nov 30, 2010 12:46:29 antlr\\Hilo.g 2023-09-25 17:17:38

var HiloLexer = function(input, state) {
// alternate constructor @todo
// public HiloLexer(CharStream input)
// public HiloLexer(CharStream input, RecognizerSharedState state) {
    if (!state) {
        state = new org.antlr.runtime.RecognizerSharedState();
    }

    (function(){

            //-------------------------------
            // Error management
            //-------------------------------
            this.emitErrorMessage = function(message) {
                throw new Error(message);
            };

    }).call(this);

    this.dfa11 = new HiloLexer.DFA11(this);
    this.dfa29 = new HiloLexer.DFA29(this);
    this.dfa34 = new HiloLexer.DFA34(this);
    HiloLexer.superclass.constructor.call(this, input, state);


};

org.antlr.lang.augmentObject(HiloLexer, {
    EOF: -1,
    PARENTH_GROUP: 4,
    FUNCALL: 5,
    VARACCESS: 6,
    ARRAY: 7,
    SUBSCRIPT: 8,
    UNARY_PLUS: 9,
    UNARY_MINUS: 10,
    RANGE_UP_TO_: 11,
    RANGE_UP_TO: 12,
    RANGE_UP_FROM_: 13,
    RANGE_UP_FROM: 14,
    CAGR_FORMULA: 15,
    CAGR_FORMULA_WITH_DIMENSION: 16,
    LOOKUP_FORMULA: 17,
    SMA_FORMULA: 18,
    SMA_FORMULA_WITH_DIMENSION: 19,
    YOY_FORMULA: 20,
    YOY_FORMULA_WITH_DIMENSION: 21,
    LINK_FORMULA: 22,
    ITERATE_FUNCTION: 23,
    EQ: 24,
    NEQ: 25,
    LT: 26,
    GT: 27,
    GTE: 28,
    LTE: 29,
    PLUS: 30,
    MINUS: 31,
    MULT: 32,
    DIV: 33,
    REM: 34,
    POW: 35,
    PIPE: 36,
    ASSIGN: 37,
    LPAR: 38,
    RPAR: 39,
    LBRA: 40,
    RBRA: 41,
    COMMA: 42,
    DOT: 43,
    SEMICOLON: 44,
    A: 45,
    B: 46,
    C: 47,
    D: 48,
    E: 49,
    F: 50,
    G: 51,
    H: 52,
    I: 53,
    J: 54,
    K: 55,
    L: 56,
    M: 57,
    N: 58,
    O: 59,
    P: 60,
    Q: 61,
    R: 62,
    S: 63,
    T: 64,
    U: 65,
    V: 66,
    W: 67,
    X: 68,
    Y: 69,
    Z: 70,
    OR: 71,
    AND: 72,
    NOT: 73,
    CAGR: 74,
    LOOKUP: 75,
    SMA: 76,
    YOY: 77,
    LINK: 78,
    ITERATE: 79,
    NULL: 80,
    TRUE: 81,
    FALSE: 82,
    YES: 83,
    NO: 84,
    STRING: 85,
    FIELD: 86,
    MEASURE_FIELD: 87,
    INTEGER: 88,
    DOUBLE: 89,
    DATE_TIME: 90,
    DOT_SEP_STRING: 91,
    DQ_ALLOW_ESC_REGEX_STRING: 92,
    ATTRIBUTE: 93,
    OLD_ATTRIBUTE: 94,
    IDENTIFIER: 95,
    WHITESPACE: 96,
    COMMENT: 97,
    DIGIT: 98,
    EXPONENT: 99,
    LETTER: 100,
    SHARP: 101,
    DQ_STRING: 102,
    SQ_STRING: 103,
    ESC_REGEX: 104,
    ESC_SEQ: 105,
    HEX_DIGIT: 106,
    VARIABLE_FIELD: 107,
    NAME_IN_QUOTE: 108,
    OLD_FIELD_STR: 109,
    DIM_MEASURE_FIELD: 110,
    CALC_FIELD: 111
});

(function(){
var HIDDEN = org.antlr.runtime.Token.HIDDEN_CHANNEL,
    EOF = org.antlr.runtime.Token.EOF;
org.antlr.lang.extend(HiloLexer, org.antlr.runtime.Lexer, {
    EOF : -1,
    PARENTH_GROUP : 4,
    FUNCALL : 5,
    VARACCESS : 6,
    ARRAY : 7,
    SUBSCRIPT : 8,
    UNARY_PLUS : 9,
    UNARY_MINUS : 10,
    RANGE_UP_TO_ : 11,
    RANGE_UP_TO : 12,
    RANGE_UP_FROM_ : 13,
    RANGE_UP_FROM : 14,
    CAGR_FORMULA : 15,
    CAGR_FORMULA_WITH_DIMENSION : 16,
    LOOKUP_FORMULA : 17,
    SMA_FORMULA : 18,
    SMA_FORMULA_WITH_DIMENSION : 19,
    YOY_FORMULA : 20,
    YOY_FORMULA_WITH_DIMENSION : 21,
    LINK_FORMULA : 22,
    ITERATE_FUNCTION : 23,
    EQ : 24,
    NEQ : 25,
    LT : 26,
    GT : 27,
    GTE : 28,
    LTE : 29,
    PLUS : 30,
    MINUS : 31,
    MULT : 32,
    DIV : 33,
    REM : 34,
    POW : 35,
    PIPE : 36,
    ASSIGN : 37,
    LPAR : 38,
    RPAR : 39,
    LBRA : 40,
    RBRA : 41,
    COMMA : 42,
    DOT : 43,
    SEMICOLON : 44,
    A : 45,
    B : 46,
    C : 47,
    D : 48,
    E : 49,
    F : 50,
    G : 51,
    H : 52,
    I : 53,
    J : 54,
    K : 55,
    L : 56,
    M : 57,
    N : 58,
    O : 59,
    P : 60,
    Q : 61,
    R : 62,
    S : 63,
    T : 64,
    U : 65,
    V : 66,
    W : 67,
    X : 68,
    Y : 69,
    Z : 70,
    OR : 71,
    AND : 72,
    NOT : 73,
    CAGR : 74,
    LOOKUP : 75,
    SMA : 76,
    YOY : 77,
    LINK : 78,
    ITERATE : 79,
    NULL : 80,
    TRUE : 81,
    FALSE : 82,
    YES : 83,
    NO : 84,
    STRING : 85,
    FIELD : 86,
    MEASURE_FIELD : 87,
    INTEGER : 88,
    DOUBLE : 89,
    DATE_TIME : 90,
    DOT_SEP_STRING : 91,
    DQ_ALLOW_ESC_REGEX_STRING : 92,
    ATTRIBUTE : 93,
    OLD_ATTRIBUTE : 94,
    IDENTIFIER : 95,
    WHITESPACE : 96,
    COMMENT : 97,
    DIGIT : 98,
    EXPONENT : 99,
    LETTER : 100,
    SHARP : 101,
    DQ_STRING : 102,
    SQ_STRING : 103,
    ESC_REGEX : 104,
    ESC_SEQ : 105,
    HEX_DIGIT : 106,
    VARIABLE_FIELD : 107,
    NAME_IN_QUOTE : 108,
    OLD_FIELD_STR : 109,
    DIM_MEASURE_FIELD : 110,
    CALC_FIELD : 111,
    getGrammarFileName: function() { return "antlr\\Hilo.g"; }
});
org.antlr.lang.augmentObject(HiloLexer.prototype, {
    // $ANTLR start EQ
    mEQ: function()  {
        try {
            var _type = this.EQ;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:16:4: ( '=' )
            // antlr\\Hilo.g:16:6: '='
            this.match('=');



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "EQ",

    // $ANTLR start NEQ
    mNEQ: function()  {
        try {
            var _type = this.NEQ;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:17:5: ( '!=' )
            // antlr\\Hilo.g:17:7: '!='
            this.match("!=");




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "NEQ",

    // $ANTLR start LT
    mLT: function()  {
        try {
            var _type = this.LT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:18:4: ( '<' )
            // antlr\\Hilo.g:18:6: '<'
            this.match('<');



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "LT",

    // $ANTLR start GT
    mGT: function()  {
        try {
            var _type = this.GT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:19:4: ( '>' )
            // antlr\\Hilo.g:19:6: '>'
            this.match('>');



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "GT",

    // $ANTLR start GTE
    mGTE: function()  {
        try {
            var _type = this.GTE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:20:5: ( '>=' )
            // antlr\\Hilo.g:20:7: '>='
            this.match(">=");




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "GTE",

    // $ANTLR start LTE
    mLTE: function()  {
        try {
            var _type = this.LTE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:21:5: ( '<=' )
            // antlr\\Hilo.g:21:7: '<='
            this.match("<=");




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "LTE",

    // $ANTLR start PLUS
    mPLUS: function()  {
        try {
            var _type = this.PLUS;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:22:6: ( '+' )
            // antlr\\Hilo.g:22:8: '+'
            this.match('+');



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "PLUS",

    // $ANTLR start MINUS
    mMINUS: function()  {
        try {
            var _type = this.MINUS;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:23:7: ( '-' )
            // antlr\\Hilo.g:23:9: '-'
            this.match('-');



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "MINUS",

    // $ANTLR start MULT
    mMULT: function()  {
        try {
            var _type = this.MULT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:24:6: ( '*' )
            // antlr\\Hilo.g:24:8: '*'
            this.match('*');



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "MULT",

    // $ANTLR start DIV
    mDIV: function()  {
        try {
            var _type = this.DIV;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:25:5: ( '/' )
            // antlr\\Hilo.g:25:7: '/'
            this.match('/');



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DIV",

    // $ANTLR start REM
    mREM: function()  {
        try {
            var _type = this.REM;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:26:5: ( '%' )
            // antlr\\Hilo.g:26:7: '%'
            this.match('%');



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "REM",

    // $ANTLR start POW
    mPOW: function()  {
        try {
            var _type = this.POW;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:27:5: ( '**' )
            // antlr\\Hilo.g:27:7: '**'
            this.match("**");




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "POW",

    // $ANTLR start PIPE
    mPIPE: function()  {
        try {
            var _type = this.PIPE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:28:6: ( '|' )
            // antlr\\Hilo.g:28:8: '|'
            this.match('|');



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "PIPE",

    // $ANTLR start ASSIGN
    mASSIGN: function()  {
        try {
            var _type = this.ASSIGN;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:29:8: ( ':=' )
            // antlr\\Hilo.g:29:10: ':='
            this.match(":=");




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "ASSIGN",

    // $ANTLR start LPAR
    mLPAR: function()  {
        try {
            var _type = this.LPAR;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:30:6: ( '(' )
            // antlr\\Hilo.g:30:8: '('
            this.match('(');



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "LPAR",

    // $ANTLR start RPAR
    mRPAR: function()  {
        try {
            var _type = this.RPAR;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:31:6: ( ')' )
            // antlr\\Hilo.g:31:8: ')'
            this.match(')');



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "RPAR",

    // $ANTLR start LBRA
    mLBRA: function()  {
        try {
            var _type = this.LBRA;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:32:6: ( '[' )
            // antlr\\Hilo.g:32:8: '['
            this.match('[');



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "LBRA",

    // $ANTLR start RBRA
    mRBRA: function()  {
        try {
            var _type = this.RBRA;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:33:6: ( ']' )
            // antlr\\Hilo.g:33:8: ']'
            this.match(']');



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "RBRA",

    // $ANTLR start COMMA
    mCOMMA: function()  {
        try {
            var _type = this.COMMA;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:34:7: ( ',' )
            // antlr\\Hilo.g:34:9: ','
            this.match(',');



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "COMMA",

    // $ANTLR start DOT
    mDOT: function()  {
        try {
            var _type = this.DOT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:35:5: ( '.' )
            // antlr\\Hilo.g:35:7: '.'
            this.match('.');



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DOT",

    // $ANTLR start SEMICOLON
    mSEMICOLON: function()  {
        try {
            var _type = this.SEMICOLON;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:36:11: ( ';' )
            // antlr\\Hilo.g:36:13: ';'
            this.match(';');



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "SEMICOLON",

    // $ANTLR start A
    mA: function()  {
        try {
            // antlr\\Hilo.g:123:11: ( ( 'a' | 'A' ) )
            // antlr\\Hilo.g:123:13: ( 'a' | 'A' )
            if ( this.input.LA(1)=='A'||this.input.LA(1)=='a' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "A",

    // $ANTLR start B
    mB: function()  {
        try {
            // antlr\\Hilo.g:124:11: ( ( 'b' | 'B' ) )
            // antlr\\Hilo.g:124:13: ( 'b' | 'B' )
            if ( this.input.LA(1)=='B'||this.input.LA(1)=='b' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "B",

    // $ANTLR start C
    mC: function()  {
        try {
            // antlr\\Hilo.g:125:11: ( ( 'c' | 'C' ) )
            // antlr\\Hilo.g:125:13: ( 'c' | 'C' )
            if ( this.input.LA(1)=='C'||this.input.LA(1)=='c' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "C",

    // $ANTLR start D
    mD: function()  {
        try {
            // antlr\\Hilo.g:126:11: ( ( 'd' | 'D' ) )
            // antlr\\Hilo.g:126:13: ( 'd' | 'D' )
            if ( this.input.LA(1)=='D'||this.input.LA(1)=='d' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "D",

    // $ANTLR start E
    mE: function()  {
        try {
            // antlr\\Hilo.g:127:11: ( ( 'e' | 'E' ) )
            // antlr\\Hilo.g:127:13: ( 'e' | 'E' )
            if ( this.input.LA(1)=='E'||this.input.LA(1)=='e' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "E",

    // $ANTLR start F
    mF: function()  {
        try {
            // antlr\\Hilo.g:128:11: ( ( 'f' | 'F' ) )
            // antlr\\Hilo.g:128:13: ( 'f' | 'F' )
            if ( this.input.LA(1)=='F'||this.input.LA(1)=='f' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "F",

    // $ANTLR start G
    mG: function()  {
        try {
            // antlr\\Hilo.g:129:11: ( ( 'g' | 'G' ) )
            // antlr\\Hilo.g:129:13: ( 'g' | 'G' )
            if ( this.input.LA(1)=='G'||this.input.LA(1)=='g' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "G",

    // $ANTLR start H
    mH: function()  {
        try {
            // antlr\\Hilo.g:130:11: ( ( 'h' | 'H' ) )
            // antlr\\Hilo.g:130:13: ( 'h' | 'H' )
            if ( this.input.LA(1)=='H'||this.input.LA(1)=='h' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "H",

    // $ANTLR start I
    mI: function()  {
        try {
            // antlr\\Hilo.g:131:11: ( ( 'i' | 'I' ) )
            // antlr\\Hilo.g:131:13: ( 'i' | 'I' )
            if ( this.input.LA(1)=='I'||this.input.LA(1)=='i' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "I",

    // $ANTLR start J
    mJ: function()  {
        try {
            // antlr\\Hilo.g:132:11: ( ( 'j' | 'J' ) )
            // antlr\\Hilo.g:132:13: ( 'j' | 'J' )
            if ( this.input.LA(1)=='J'||this.input.LA(1)=='j' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "J",

    // $ANTLR start K
    mK: function()  {
        try {
            // antlr\\Hilo.g:133:11: ( ( 'k' | 'K' ) )
            // antlr\\Hilo.g:133:13: ( 'k' | 'K' )
            if ( this.input.LA(1)=='K'||this.input.LA(1)=='k' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "K",

    // $ANTLR start L
    mL: function()  {
        try {
            // antlr\\Hilo.g:134:11: ( ( 'l' | 'L' ) )
            // antlr\\Hilo.g:134:13: ( 'l' | 'L' )
            if ( this.input.LA(1)=='L'||this.input.LA(1)=='l' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "L",

    // $ANTLR start M
    mM: function()  {
        try {
            // antlr\\Hilo.g:135:11: ( ( 'm' | 'M' ) )
            // antlr\\Hilo.g:135:13: ( 'm' | 'M' )
            if ( this.input.LA(1)=='M'||this.input.LA(1)=='m' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "M",

    // $ANTLR start N
    mN: function()  {
        try {
            // antlr\\Hilo.g:136:11: ( ( 'n' | 'N' ) )
            // antlr\\Hilo.g:136:13: ( 'n' | 'N' )
            if ( this.input.LA(1)=='N'||this.input.LA(1)=='n' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "N",

    // $ANTLR start O
    mO: function()  {
        try {
            // antlr\\Hilo.g:137:11: ( ( 'o' | 'O' ) )
            // antlr\\Hilo.g:137:13: ( 'o' | 'O' )
            if ( this.input.LA(1)=='O'||this.input.LA(1)=='o' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "O",

    // $ANTLR start P
    mP: function()  {
        try {
            // antlr\\Hilo.g:138:11: ( ( 'p' | 'P' ) )
            // antlr\\Hilo.g:138:13: ( 'p' | 'P' )
            if ( this.input.LA(1)=='P'||this.input.LA(1)=='p' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "P",

    // $ANTLR start Q
    mQ: function()  {
        try {
            // antlr\\Hilo.g:139:11: ( ( 'q' | 'Q' ) )
            // antlr\\Hilo.g:139:13: ( 'q' | 'Q' )
            if ( this.input.LA(1)=='Q'||this.input.LA(1)=='q' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "Q",

    // $ANTLR start R
    mR: function()  {
        try {
            // antlr\\Hilo.g:140:11: ( ( 'r' | 'R' ) )
            // antlr\\Hilo.g:140:13: ( 'r' | 'R' )
            if ( this.input.LA(1)=='R'||this.input.LA(1)=='r' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "R",

    // $ANTLR start S
    mS: function()  {
        try {
            // antlr\\Hilo.g:141:11: ( ( 's' | 'S' ) )
            // antlr\\Hilo.g:141:13: ( 's' | 'S' )
            if ( this.input.LA(1)=='S'||this.input.LA(1)=='s' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "S",

    // $ANTLR start T
    mT: function()  {
        try {
            // antlr\\Hilo.g:142:11: ( ( 't' | 'T' ) )
            // antlr\\Hilo.g:142:13: ( 't' | 'T' )
            if ( this.input.LA(1)=='T'||this.input.LA(1)=='t' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "T",

    // $ANTLR start U
    mU: function()  {
        try {
            // antlr\\Hilo.g:143:11: ( ( 'u' | 'U' ) )
            // antlr\\Hilo.g:143:13: ( 'u' | 'U' )
            if ( this.input.LA(1)=='U'||this.input.LA(1)=='u' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "U",

    // $ANTLR start V
    mV: function()  {
        try {
            // antlr\\Hilo.g:144:11: ( ( 'v' | 'V' ) )
            // antlr\\Hilo.g:144:13: ( 'v' | 'V' )
            if ( this.input.LA(1)=='V'||this.input.LA(1)=='v' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "V",

    // $ANTLR start W
    mW: function()  {
        try {
            // antlr\\Hilo.g:145:11: ( ( 'w' | 'W' ) )
            // antlr\\Hilo.g:145:13: ( 'w' | 'W' )
            if ( this.input.LA(1)=='W'||this.input.LA(1)=='w' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "W",

    // $ANTLR start X
    mX: function()  {
        try {
            // antlr\\Hilo.g:146:11: ( ( 'x' | 'X' ) )
            // antlr\\Hilo.g:146:13: ( 'x' | 'X' )
            if ( this.input.LA(1)=='X'||this.input.LA(1)=='x' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "X",

    // $ANTLR start Y
    mY: function()  {
        try {
            // antlr\\Hilo.g:147:11: ( ( 'y' | 'Y' ) )
            // antlr\\Hilo.g:147:13: ( 'y' | 'Y' )
            if ( this.input.LA(1)=='Y'||this.input.LA(1)=='y' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "Y",

    // $ANTLR start Z
    mZ: function()  {
        try {
            // antlr\\Hilo.g:148:11: ( ( 'z' | 'Z' ) )
            // antlr\\Hilo.g:148:13: ( 'z' | 'Z' )
            if ( this.input.LA(1)=='Z'||this.input.LA(1)=='z' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "Z",

    // $ANTLR start OR
    mOR: function()  {
        try {
            var _type = this.OR;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:151:13: ( O R )
            // antlr\\Hilo.g:151:15: O R
            this.mO();
            this.mR();



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "OR",

    // $ANTLR start AND
    mAND: function()  {
        try {
            var _type = this.AND;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:152:13: ( A N D )
            // antlr\\Hilo.g:152:15: A N D
            this.mA();
            this.mN();
            this.mD();



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "AND",

    // $ANTLR start NOT
    mNOT: function()  {
        try {
            var _type = this.NOT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:153:13: ( N O T )
            // antlr\\Hilo.g:153:15: N O T
            this.mN();
            this.mO();
            this.mT();



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "NOT",

    // $ANTLR start CAGR
    mCAGR: function()  {
        try {
            var _type = this.CAGR;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:154:13: ( C A G R )
            // antlr\\Hilo.g:154:15: C A G R
            this.mC();
            this.mA();
            this.mG();
            this.mR();



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "CAGR",

    // $ANTLR start LOOKUP
    mLOOKUP: function()  {
        try {
            var _type = this.LOOKUP;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:155:13: ( L O O K U P )
            // antlr\\Hilo.g:155:15: L O O K U P
            this.mL();
            this.mO();
            this.mO();
            this.mK();
            this.mU();
            this.mP();



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "LOOKUP",

    // $ANTLR start SMA
    mSMA: function()  {
        try {
            var _type = this.SMA;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:156:13: ( S M A )
            // antlr\\Hilo.g:156:15: S M A
            this.mS();
            this.mM();
            this.mA();



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "SMA",

    // $ANTLR start YOY
    mYOY: function()  {
        try {
            var _type = this.YOY;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:157:13: ( Y O Y )
            // antlr\\Hilo.g:157:15: Y O Y
            this.mY();
            this.mO();
            this.mY();



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "YOY",

    // $ANTLR start LINK
    mLINK: function()  {
        try {
            var _type = this.LINK;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:158:13: ( L I N K )
            // antlr\\Hilo.g:158:15: L I N K
            this.mL();
            this.mI();
            this.mN();
            this.mK();



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "LINK",

    // $ANTLR start ITERATE
    mITERATE: function()  {
        try {
            var _type = this.ITERATE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:159:13: ( I T E R A T E )
            // antlr\\Hilo.g:159:15: I T E R A T E
            this.mI();
            this.mT();
            this.mE();
            this.mR();
            this.mA();
            this.mT();
            this.mE();



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "ITERATE",

    // $ANTLR start NULL
    mNULL: function()  {
        try {
            var _type = this.NULL;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:162:13: ( N U L L )
            // antlr\\Hilo.g:162:15: N U L L
            this.mN();
            this.mU();
            this.mL();
            this.mL();



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "NULL",

    // $ANTLR start TRUE
    mTRUE: function()  {
        try {
            var _type = this.TRUE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:163:13: ( T R U E )
            // antlr\\Hilo.g:163:15: T R U E
            this.mT();
            this.mR();
            this.mU();
            this.mE();



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "TRUE",

    // $ANTLR start FALSE
    mFALSE: function()  {
        try {
            var _type = this.FALSE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:164:13: ( F A L S E )
            // antlr\\Hilo.g:164:15: F A L S E
            this.mF();
            this.mA();
            this.mL();
            this.mS();
            this.mE();



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "FALSE",

    // $ANTLR start YES
    mYES: function()  {
        try {
            var _type = this.YES;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:165:13: ( Y E S )
            // antlr\\Hilo.g:165:15: Y E S
            this.mY();
            this.mE();
            this.mS();



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "YES",

    // $ANTLR start NO
    mNO: function()  {
        try {
            var _type = this.NO;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:166:13: ( N O )
            // antlr\\Hilo.g:166:15: N O
            this.mN();
            this.mO();



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "NO",

    // $ANTLR start WHITESPACE
    mWHITESPACE: function()  {
        try {
            var _type = this.WHITESPACE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:364:5: ( ( '\\t' | ' ' | '\\r' | '\\n' | '\\u000C' )+ )
            // antlr\\Hilo.g:364:7: ( '\\t' | ' ' | '\\r' | '\\n' | '\\u000C' )+
            // antlr\\Hilo.g:364:7: ( '\\t' | ' ' | '\\r' | '\\n' | '\\u000C' )+
            var cnt1=0;
            loop1:
            do {
                var alt1=2;
                switch ( this.input.LA(1) ) {
                case '\t':
                case '\n':
                case '\f':
                case '\r':
                case ' ':
                    alt1=1;
                    break;

                }

                switch (alt1) {
                case 1 :
                    // antlr\\Hilo.g:
                    if ( (this.input.LA(1)>='\t' && this.input.LA(1)<='\n')||(this.input.LA(1)>='\f' && this.input.LA(1)<='\r')||this.input.LA(1)==' ' ) {
                        this.input.consume();

                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        this.recover(mse);
                        throw mse;}



                    break;

                default :
                    if ( cnt1 >= 1 ) {
                        break loop1;
                    }
                        var eee = new org.antlr.runtime.EarlyExitException(1, this.input);
                        throw eee;
                }
                cnt1++;
            } while (true);

            _channel = HIDDEN;



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "WHITESPACE",

    // $ANTLR start COMMENT
    mCOMMENT: function()  {
        try {
            var _type = this.COMMENT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:368:5: ( '//' (~ ( '\\n' | '\\r' ) )* ( '\\r' )? '\\n' )
            // antlr\\Hilo.g:368:7: '//' (~ ( '\\n' | '\\r' ) )* ( '\\r' )? '\\n'
            this.match("//");

            // antlr\\Hilo.g:368:12: (~ ( '\\n' | '\\r' ) )*
            loop2:
            do {
                var alt2=2;
                var LA2_0 = this.input.LA(1);

                if ( ((LA2_0>='\u0000' && LA2_0<='\t')||(LA2_0>='\u000B' && LA2_0<='\f')||(LA2_0>='\u000E' && LA2_0<='\uFFFF')) ) {
                    alt2=1;
                }


                switch (alt2) {
                case 1 :
                    // antlr\\Hilo.g:368:12: ~ ( '\\n' | '\\r' )
                    if ( (this.input.LA(1)>='\u0000' && this.input.LA(1)<='\t')||(this.input.LA(1)>='\u000B' && this.input.LA(1)<='\f')||(this.input.LA(1)>='\u000E' && this.input.LA(1)<='\uFFFF') ) {
                        this.input.consume();

                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        this.recover(mse);
                        throw mse;}



                    break;

                default :
                    break loop2;
                }
            } while (true);

            // antlr\\Hilo.g:368:26: ( '\\r' )?
            var alt3=2;
            switch ( this.input.LA(1) ) {
                case '\r':
                    alt3=1;
                    break;
            }

            switch (alt3) {
                case 1 :
                    // antlr\\Hilo.g:368:26: '\\r'
                    this.match('\r');


                    break;

            }

            this.match('\n');
            _channel=HIDDEN;



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "COMMENT",

    // $ANTLR start INTEGER
    mINTEGER: function()  {
        try {
            var _type = this.INTEGER;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:371:9: ( ( DIGIT )+ )
            // antlr\\Hilo.g:371:11: ( DIGIT )+
            // antlr\\Hilo.g:371:11: ( DIGIT )+
            var cnt4=0;
            loop4:
            do {
                var alt4=2;
                switch ( this.input.LA(1) ) {
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    alt4=1;
                    break;

                }

                switch (alt4) {
                case 1 :
                    // antlr\\Hilo.g:371:11: DIGIT
                    this.mDIGIT();


                    break;

                default :
                    if ( cnt4 >= 1 ) {
                        break loop4;
                    }
                        var eee = new org.antlr.runtime.EarlyExitException(4, this.input);
                        throw eee;
                }
                cnt4++;
            } while (true);




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "INTEGER",

    // $ANTLR start DOUBLE
    mDOUBLE: function()  {
        try {
            var _type = this.DOUBLE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:374:5: ( ( DIGIT )+ '.' ( DIGIT )* ( EXPONENT )? | '.' ( DIGIT )+ ( EXPONENT )? | ( DIGIT )+ EXPONENT )
            var alt11=3;
            alt11 = this.dfa11.predict(this.input);
            switch (alt11) {
                case 1 :
                    // antlr\\Hilo.g:374:9: ( DIGIT )+ '.' ( DIGIT )* ( EXPONENT )?
                    // antlr\\Hilo.g:374:9: ( DIGIT )+
                    var cnt5=0;
                    loop5:
                    do {
                        var alt5=2;
                        switch ( this.input.LA(1) ) {
                        case '0':
                        case '1':
                        case '2':
                        case '3':
                        case '4':
                        case '5':
                        case '6':
                        case '7':
                        case '8':
                        case '9':
                            alt5=1;
                            break;

                        }

                        switch (alt5) {
                        case 1 :
                            // antlr\\Hilo.g:374:9: DIGIT
                            this.mDIGIT();


                            break;

                        default :
                            if ( cnt5 >= 1 ) {
                                break loop5;
                            }
                                var eee = new org.antlr.runtime.EarlyExitException(5, this.input);
                                throw eee;
                        }
                        cnt5++;
                    } while (true);

                    this.match('.');
                    // antlr\\Hilo.g:374:20: ( DIGIT )*
                    loop6:
                    do {
                        var alt6=2;
                        switch ( this.input.LA(1) ) {
                        case '0':
                        case '1':
                        case '2':
                        case '3':
                        case '4':
                        case '5':
                        case '6':
                        case '7':
                        case '8':
                        case '9':
                            alt6=1;
                            break;

                        }

                        switch (alt6) {
                        case 1 :
                            // antlr\\Hilo.g:374:20: DIGIT
                            this.mDIGIT();


                            break;

                        default :
                            break loop6;
                        }
                    } while (true);

                    // antlr\\Hilo.g:374:27: ( EXPONENT )?
                    var alt7=2;
                    switch ( this.input.LA(1) ) {
                        case 'E':
                        case 'e':
                            alt7=1;
                            break;
                    }

                    switch (alt7) {
                        case 1 :
                            // antlr\\Hilo.g:374:27: EXPONENT
                            this.mEXPONENT();


                            break;

                    }



                    break;
                case 2 :
                    // antlr\\Hilo.g:375:9: '.' ( DIGIT )+ ( EXPONENT )?
                    this.match('.');
                    // antlr\\Hilo.g:375:13: ( DIGIT )+
                    var cnt8=0;
                    loop8:
                    do {
                        var alt8=2;
                        switch ( this.input.LA(1) ) {
                        case '0':
                        case '1':
                        case '2':
                        case '3':
                        case '4':
                        case '5':
                        case '6':
                        case '7':
                        case '8':
                        case '9':
                            alt8=1;
                            break;

                        }

                        switch (alt8) {
                        case 1 :
                            // antlr\\Hilo.g:375:13: DIGIT
                            this.mDIGIT();


                            break;

                        default :
                            if ( cnt8 >= 1 ) {
                                break loop8;
                            }
                                var eee = new org.antlr.runtime.EarlyExitException(8, this.input);
                                throw eee;
                        }
                        cnt8++;
                    } while (true);

                    // antlr\\Hilo.g:375:20: ( EXPONENT )?
                    var alt9=2;
                    switch ( this.input.LA(1) ) {
                        case 'E':
                        case 'e':
                            alt9=1;
                            break;
                    }

                    switch (alt9) {
                        case 1 :
                            // antlr\\Hilo.g:375:20: EXPONENT
                            this.mEXPONENT();


                            break;

                    }



                    break;
                case 3 :
                    // antlr\\Hilo.g:376:9: ( DIGIT )+ EXPONENT
                    // antlr\\Hilo.g:376:9: ( DIGIT )+
                    var cnt10=0;
                    loop10:
                    do {
                        var alt10=2;
                        switch ( this.input.LA(1) ) {
                        case '0':
                        case '1':
                        case '2':
                        case '3':
                        case '4':
                        case '5':
                        case '6':
                        case '7':
                        case '8':
                        case '9':
                            alt10=1;
                            break;

                        }

                        switch (alt10) {
                        case 1 :
                            // antlr\\Hilo.g:376:9: DIGIT
                            this.mDIGIT();


                            break;

                        default :
                            if ( cnt10 >= 1 ) {
                                break loop10;
                            }
                                var eee = new org.antlr.runtime.EarlyExitException(10, this.input);
                                throw eee;
                        }
                        cnt10++;
                    } while (true);

                    this.mEXPONENT();


                    break;

            }
            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DOUBLE",

    // $ANTLR start EXPONENT
    mEXPONENT: function()  {
        try {
            // antlr\\Hilo.g:380:10: ( ( 'e' | 'E' ) ( '+' | '-' )? ( DIGIT )+ )
            // antlr\\Hilo.g:380:12: ( 'e' | 'E' ) ( '+' | '-' )? ( DIGIT )+
            if ( this.input.LA(1)=='E'||this.input.LA(1)=='e' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}

            // antlr\\Hilo.g:380:22: ( '+' | '-' )?
            var alt12=2;
            switch ( this.input.LA(1) ) {
                case '+':
                case '-':
                    alt12=1;
                    break;
            }

            switch (alt12) {
                case 1 :
                    // antlr\\Hilo.g:
                    if ( this.input.LA(1)=='+'||this.input.LA(1)=='-' ) {
                        this.input.consume();

                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        this.recover(mse);
                        throw mse;}



                    break;

            }

            // antlr\\Hilo.g:380:33: ( DIGIT )+
            var cnt13=0;
            loop13:
            do {
                var alt13=2;
                switch ( this.input.LA(1) ) {
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    alt13=1;
                    break;

                }

                switch (alt13) {
                case 1 :
                    // antlr\\Hilo.g:380:33: DIGIT
                    this.mDIGIT();


                    break;

                default :
                    if ( cnt13 >= 1 ) {
                        break loop13;
                    }
                        var eee = new org.antlr.runtime.EarlyExitException(13, this.input);
                        throw eee;
                }
                cnt13++;
            } while (true);




        }
        finally {
        }
    },
    // $ANTLR end "EXPONENT",

    // $ANTLR start IDENTIFIER
    mIDENTIFIER: function()  {
        try {
            var _type = this.IDENTIFIER;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:382:12: ( '%' G R A N D T O T A L | '%' S U B T O T A L | ( LETTER | '_' ) ( LETTER | DIGIT | '_' )* )
            var alt15=3;
            switch ( this.input.LA(1) ) {
            case '%':
                switch ( this.input.LA(2) ) {
                case 'G':
                case 'g':
                    alt15=1;
                    break;
                case 'S':
                case 's':
                    alt15=2;
                    break;
                default:
                    var nvae =
                        new org.antlr.runtime.NoViableAltException("", 15, 1, this.input);

                    throw nvae;
                }

                break;
            case 'A':
            case 'B':
            case 'C':
            case 'D':
            case 'E':
            case 'F':
            case 'G':
            case 'H':
            case 'I':
            case 'J':
            case 'K':
            case 'L':
            case 'M':
            case 'N':
            case 'O':
            case 'P':
            case 'Q':
            case 'R':
            case 'S':
            case 'T':
            case 'U':
            case 'V':
            case 'W':
            case 'X':
            case 'Y':
            case 'Z':
            case '_':
            case 'a':
            case 'b':
            case 'c':
            case 'd':
            case 'e':
            case 'f':
            case 'g':
            case 'h':
            case 'i':
            case 'j':
            case 'k':
            case 'l':
            case 'm':
            case 'n':
            case 'o':
            case 'p':
            case 'q':
            case 'r':
            case 's':
            case 't':
            case 'u':
            case 'v':
            case 'w':
            case 'x':
            case 'y':
            case 'z':
                alt15=3;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 15, 0, this.input);

                throw nvae;
            }

            switch (alt15) {
                case 1 :
                    // antlr\\Hilo.g:382:14: '%' G R A N D T O T A L
                    this.match('%');
                    this.mG();
                    this.mR();
                    this.mA();
                    this.mN();
                    this.mD();
                    this.mT();
                    this.mO();
                    this.mT();
                    this.mA();
                    this.mL();


                    break;
                case 2 :
                    // antlr\\Hilo.g:382:39: '%' S U B T O T A L
                    this.match('%');
                    this.mS();
                    this.mU();
                    this.mB();
                    this.mT();
                    this.mO();
                    this.mT();
                    this.mA();
                    this.mL();


                    break;
                case 3 :
                    // antlr\\Hilo.g:382:60: ( LETTER | '_' ) ( LETTER | DIGIT | '_' )*
                    if ( (this.input.LA(1)>='A' && this.input.LA(1)<='Z')||this.input.LA(1)=='_'||(this.input.LA(1)>='a' && this.input.LA(1)<='z') ) {
                        this.input.consume();

                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        this.recover(mse);
                        throw mse;}

                    // antlr\\Hilo.g:382:75: ( LETTER | DIGIT | '_' )*
                    loop14:
                    do {
                        var alt14=2;
                        switch ( this.input.LA(1) ) {
                        case '0':
                        case '1':
                        case '2':
                        case '3':
                        case '4':
                        case '5':
                        case '6':
                        case '7':
                        case '8':
                        case '9':
                        case 'A':
                        case 'B':
                        case 'C':
                        case 'D':
                        case 'E':
                        case 'F':
                        case 'G':
                        case 'H':
                        case 'I':
                        case 'J':
                        case 'K':
                        case 'L':
                        case 'M':
                        case 'N':
                        case 'O':
                        case 'P':
                        case 'Q':
                        case 'R':
                        case 'S':
                        case 'T':
                        case 'U':
                        case 'V':
                        case 'W':
                        case 'X':
                        case 'Y':
                        case 'Z':
                        case '_':
                        case 'a':
                        case 'b':
                        case 'c':
                        case 'd':
                        case 'e':
                        case 'f':
                        case 'g':
                        case 'h':
                        case 'i':
                        case 'j':
                        case 'k':
                        case 'l':
                        case 'm':
                        case 'n':
                        case 'o':
                        case 'p':
                        case 'q':
                        case 'r':
                        case 's':
                        case 't':
                        case 'u':
                        case 'v':
                        case 'w':
                        case 'x':
                        case 'y':
                        case 'z':
                            alt14=1;
                            break;

                        }

                        switch (alt14) {
                        case 1 :
                            // antlr\\Hilo.g:
                            if ( (this.input.LA(1)>='0' && this.input.LA(1)<='9')||(this.input.LA(1)>='A' && this.input.LA(1)<='Z')||this.input.LA(1)=='_'||(this.input.LA(1)>='a' && this.input.LA(1)<='z') ) {
                                this.input.consume();

                            }
                            else {
                                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                                this.recover(mse);
                                throw mse;}



                            break;

                        default :
                            break loop14;
                        }
                    } while (true);



                    break;

            }
            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "IDENTIFIER",

    // $ANTLR start DATE_TIME
    mDATE_TIME: function()  {
        try {
            var _type = this.DATE_TIME;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:387:5: ( SHARP (~ ( '\\n' | SHARP ) )* SHARP )
            // antlr\\Hilo.g:387:7: SHARP (~ ( '\\n' | SHARP ) )* SHARP
            this.mSHARP();
            // antlr\\Hilo.g:387:13: (~ ( '\\n' | SHARP ) )*
            loop16:
            do {
                var alt16=2;
                var LA16_0 = this.input.LA(1);

                if ( ((LA16_0>='\u0000' && LA16_0<='\t')||(LA16_0>='\u000B' && LA16_0<='\"')||(LA16_0>='$' && LA16_0<='\uFFFF')) ) {
                    alt16=1;
                }


                switch (alt16) {
                case 1 :
                    // antlr\\Hilo.g:387:13: ~ ( '\\n' | SHARP )
                    if ( (this.input.LA(1)>='\u0000' && this.input.LA(1)<='\t')||(this.input.LA(1)>='\u000B' && this.input.LA(1)<='\"')||(this.input.LA(1)>='$' && this.input.LA(1)<='\uFFFF') ) {
                        this.input.consume();

                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        this.recover(mse);
                        throw mse;}



                    break;

                default :
                    break loop16;
                }
            } while (true);

            this.mSHARP();



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DATE_TIME",

    // $ANTLR start SHARP
    mSHARP: function()  {
        try {
            // antlr\\Hilo.g:389:16: ( '#' )
            // antlr\\Hilo.g:389:18: '#'
            this.match('#');



        }
        finally {
        }
    },
    // $ANTLR end "SHARP",

    // $ANTLR start STRING
    mSTRING: function()  {
        try {
            var _type = this.STRING;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:391:8: ( DQ_STRING | SQ_STRING )
            var alt17=2;
            switch ( this.input.LA(1) ) {
            case '\"':
                alt17=1;
                break;
            case '\'':
                alt17=2;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 17, 0, this.input);

                throw nvae;
            }

            switch (alt17) {
                case 1 :
                    // antlr\\Hilo.g:391:10: DQ_STRING
                    this.mDQ_STRING();


                    break;
                case 2 :
                    // antlr\\Hilo.g:391:22: SQ_STRING
                    this.mSQ_STRING();


                    break;

            }
            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "STRING",

    // $ANTLR start DOT_SEP_STRING
    mDOT_SEP_STRING: function()  {
        try {
            var _type = this.DOT_SEP_STRING;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:394:16: ( DQ_STRING ( '.' DQ_STRING )+ )
            // antlr\\Hilo.g:394:18: DQ_STRING ( '.' DQ_STRING )+
            this.mDQ_STRING();
            var b = []; b.push("\"" + this.getText() + "\"");
            // antlr\\Hilo.g:395:18: ( '.' DQ_STRING )+
            var cnt18=0;
            loop18:
            do {
                var alt18=2;
                switch ( this.input.LA(1) ) {
                case '.':
                    alt18=1;
                    break;

                }

                switch (alt18) {
                case 1 :
                    // antlr\\Hilo.g:396:18: '.' DQ_STRING
                    this.match('.');
                    b.push(".\"");
                    this.mDQ_STRING();
                    b.push(this.getText() + "\"");


                    break;

                default :
                    if ( cnt18 >= 1 ) {
                        break loop18;
                    }
                        var eee = new org.antlr.runtime.EarlyExitException(18, this.input);
                        throw eee;
                }
                cnt18++;
            } while (true);

            this.setText(b.join(""));



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DOT_SEP_STRING",

    // $ANTLR start DQ_ALLOW_ESC_REGEX_STRING
    mDQ_ALLOW_ESC_REGEX_STRING: function()  {
        try {
            var _type = this.DQ_ALLOW_ESC_REGEX_STRING;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            var c;

            // antlr\\Hilo.g:403:5: ( '\"' ( ESC_REGEX | ESC_SEQ | c=~ ( '\\\\' | '\"' ) )* '\"' )
            // antlr\\Hilo.g:403:8: '\"' ( ESC_REGEX | ESC_SEQ | c=~ ( '\\\\' | '\"' ) )* '\"'
            this.match('\"');
            var b = []
            // antlr\\Hilo.g:404:5: ( ESC_REGEX | ESC_SEQ | c=~ ( '\\\\' | '\"' ) )*
            loop19:
            do {
                var alt19=4;
                var LA19_0 = this.input.LA(1);

                if ( (LA19_0=='\\') ) {
                    switch ( this.input.LA(2) ) {
                    case '\"':
                    case '\'':
                    case '\\':
                    case 'b':
                    case 'f':
                    case 'n':
                    case 'r':
                    case 't':
                    case 'u':
                        alt19=2;
                        break;
                    case '$':
                    case '(':
                    case ')':
                    case '*':
                    case '+':
                    case '.':
                    case '1':
                    case '?':
                    case 'D':
                    case 'S':
                    case 'W':
                    case '[':
                    case ']':
                    case '^':
                    case 'd':
                    case 's':
                    case 'w':
                    case '{':
                    case '|':
                    case '}':
                        alt19=1;
                        break;

                    }

                }
                else if ( ((LA19_0>='\u0000' && LA19_0<='!')||(LA19_0>='#' && LA19_0<='[')||(LA19_0>=']' && LA19_0<='\uFFFF')) ) {
                    alt19=3;
                }


                switch (alt19) {
                case 1 :
                    // antlr\\Hilo.g:404:6: ESC_REGEX
                    this.mESC_REGEX();
                    b.push(this.getText());


                    break;
                case 2 :
                    // antlr\\Hilo.g:405:7: ESC_SEQ
                    this.mESC_SEQ();
                    b.push(this.getText());


                    break;
                case 3 :
                    // antlr\\Hilo.g:406:7: c=~ ( '\\\\' | '\"' )
                    c= this.input.LA(1);
                    if ( (this.input.LA(1)>='\u0000' && this.input.LA(1)<='!')||(this.input.LA(1)>='#' && this.input.LA(1)<='[')||(this.input.LA(1)>=']' && this.input.LA(1)<='\uFFFF') ) {
                        this.input.consume();

                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        this.recover(mse);
                        throw mse;}

                    b.push(c);


                    break;

                default :
                    break loop19;
                }
            } while (true);

            this.match('\"');
            this.setText(b.join(""));



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DQ_ALLOW_ESC_REGEX_STRING",

    // $ANTLR start DQ_STRING
    mDQ_STRING: function()  {
        try {
            var c;

            // antlr\\Hilo.g:413:5: ( '\"' ( ESC_SEQ | c=~ ( '\\\\' | '\"' ) )* '\"' )
            // antlr\\Hilo.g:413:8: '\"' ( ESC_SEQ | c=~ ( '\\\\' | '\"' ) )* '\"'
            this.match('\"');
            var b = []
            // antlr\\Hilo.g:414:5: ( ESC_SEQ | c=~ ( '\\\\' | '\"' ) )*
            loop20:
            do {
                var alt20=3;
                var LA20_0 = this.input.LA(1);

                if ( (LA20_0=='\\') ) {
                    alt20=1;
                }
                else if ( ((LA20_0>='\u0000' && LA20_0<='!')||(LA20_0>='#' && LA20_0<='[')||(LA20_0>=']' && LA20_0<='\uFFFF')) ) {
                    alt20=2;
                }


                switch (alt20) {
                case 1 :
                    // antlr\\Hilo.g:414:6: ESC_SEQ
                    this.mESC_SEQ();
                    b.push(this.getText());


                    break;
                case 2 :
                    // antlr\\Hilo.g:415:7: c=~ ( '\\\\' | '\"' )
                    c= this.input.LA(1);
                    if ( (this.input.LA(1)>='\u0000' && this.input.LA(1)<='!')||(this.input.LA(1)>='#' && this.input.LA(1)<='[')||(this.input.LA(1)>=']' && this.input.LA(1)<='\uFFFF') ) {
                        this.input.consume();

                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        this.recover(mse);
                        throw mse;}

                    b.push(c);


                    break;

                default :
                    break loop20;
                }
            } while (true);

            this.match('\"');
            this.setText(b.join(""));



        }
        finally {
        }
    },
    // $ANTLR end "DQ_STRING",

    // $ANTLR start SQ_STRING
    mSQ_STRING: function()  {
        try {
            var c;

            // antlr\\Hilo.g:422:5: ( '\\'' ( ESC_SEQ | c=~ ( '\\\\' | '\\'' ) )* '\\'' )
            // antlr\\Hilo.g:422:8: '\\'' ( ESC_SEQ | c=~ ( '\\\\' | '\\'' ) )* '\\''
            this.match('\'');
            var b = [];
            // antlr\\Hilo.g:423:5: ( ESC_SEQ | c=~ ( '\\\\' | '\\'' ) )*
            loop21:
            do {
                var alt21=3;
                var LA21_0 = this.input.LA(1);

                if ( (LA21_0=='\\') ) {
                    alt21=1;
                }
                else if ( ((LA21_0>='\u0000' && LA21_0<='&')||(LA21_0>='(' && LA21_0<='[')||(LA21_0>=']' && LA21_0<='\uFFFF')) ) {
                    alt21=2;
                }


                switch (alt21) {
                case 1 :
                    // antlr\\Hilo.g:423:6: ESC_SEQ
                    this.mESC_SEQ();
                    b.push(this.getText());


                    break;
                case 2 :
                    // antlr\\Hilo.g:424:7: c=~ ( '\\\\' | '\\'' )
                    c= this.input.LA(1);
                    if ( (this.input.LA(1)>='\u0000' && this.input.LA(1)<='&')||(this.input.LA(1)>='(' && this.input.LA(1)<='[')||(this.input.LA(1)>=']' && this.input.LA(1)<='\uFFFF') ) {
                        this.input.consume();

                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        this.recover(mse);
                        throw mse;}

                    b.push(c);


                    break;

                default :
                    break loop21;
                }
            } while (true);

            this.match('\'');
            this.setText(b.join(""));



        }
        finally {
        }
    },
    // $ANTLR end "SQ_STRING",

    // $ANTLR start ESC_SEQ
    mESC_SEQ: function()  {
        try {
            var a=null;
            var b=null;
            var c=null;
            var d=null;

            // antlr\\Hilo.g:431:5: ( '\\\\' ( 'b' | 't' | 'n' | 'f' | 'r' | '\\\"' | '\\'' | '\\\\' ) | '\\\\' 'u' a= HEX_DIGIT b= HEX_DIGIT c= HEX_DIGIT d= HEX_DIGIT )
            var alt23=2;
            switch ( this.input.LA(1) ) {
            case '\\':
                switch ( this.input.LA(2) ) {
                case 'u':
                    alt23=2;
                    break;
                case '\"':
                case '\'':
                case '\\':
                case 'b':
                case 'f':
                case 'n':
                case 'r':
                case 't':
                    alt23=1;
                    break;
                default:
                    var nvae =
                        new org.antlr.runtime.NoViableAltException("", 23, 1, this.input);

                    throw nvae;
                }

                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 23, 0, this.input);

                throw nvae;
            }

            switch (alt23) {
                case 1 :
                    // antlr\\Hilo.g:431:9: '\\\\' ( 'b' | 't' | 'n' | 'f' | 'r' | '\\\"' | '\\'' | '\\\\' )
                    this.match('\\');
                    // antlr\\Hilo.g:432:5: ( 'b' | 't' | 'n' | 'f' | 'r' | '\\\"' | '\\'' | '\\\\' )
                    var alt22=8;
                    switch ( this.input.LA(1) ) {
                    case 'b':
                        alt22=1;
                        break;
                    case 't':
                        alt22=2;
                        break;
                    case 'n':
                        alt22=3;
                        break;
                    case 'f':
                        alt22=4;
                        break;
                    case 'r':
                        alt22=5;
                        break;
                    case '\"':
                        alt22=6;
                        break;
                    case '\'':
                        alt22=7;
                        break;
                    case '\\':
                        alt22=8;
                        break;
                    default:
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 22, 0, this.input);

                        throw nvae;
                    }

                    switch (alt22) {
                        case 1 :
                            // antlr\\Hilo.g:432:6: 'b'
                            this.match('b');
                            this.setText("\b");


                            break;
                        case 2 :
                            // antlr\\Hilo.g:433:6: 't'
                            this.match('t');
                            this.setText("\t");


                            break;
                        case 3 :
                            // antlr\\Hilo.g:434:6: 'n'
                            this.match('n');
                            this.setText("\n");


                            break;
                        case 4 :
                            // antlr\\Hilo.g:435:6: 'f'
                            this.match('f');
                            this.setText("\f");


                            break;
                        case 5 :
                            // antlr\\Hilo.g:436:6: 'r'
                            this.match('r');
                            this.setText("\r");


                            break;
                        case 6 :
                            // antlr\\Hilo.g:437:6: '\\\"'
                            this.match('\"');
                            this.setText("\"");


                            break;
                        case 7 :
                            // antlr\\Hilo.g:438:6: '\\''
                            this.match('\'');
                            this.setText("\'");


                            break;
                        case 8 :
                            // antlr\\Hilo.g:439:6: '\\\\'
                            this.match('\\');
                            this.setText("\\");


                            break;

                    }



                    break;
                case 2 :
                    // antlr\\Hilo.g:441:9: '\\\\' 'u' a= HEX_DIGIT b= HEX_DIGIT c= HEX_DIGIT d= HEX_DIGIT
                    this.match('\\');
                    this.match('u');
                    var aStart2529 = this.getCharIndex();
                    this.mHEX_DIGIT();
                    a = new org.antlr.runtime.CommonToken(this.input, org.antlr.runtime.Token.INVALID_TOKEN_TYPE, org.antlr.runtime.Token.DEFAULT_CHANNEL, aStart2529, this.getCharIndex()-1);
                    var bStart2533 = this.getCharIndex();
                    this.mHEX_DIGIT();
                    b = new org.antlr.runtime.CommonToken(this.input, org.antlr.runtime.Token.INVALID_TOKEN_TYPE, org.antlr.runtime.Token.DEFAULT_CHANNEL, bStart2533, this.getCharIndex()-1);
                    var cStart2537 = this.getCharIndex();
                    this.mHEX_DIGIT();
                    c = new org.antlr.runtime.CommonToken(this.input, org.antlr.runtime.Token.INVALID_TOKEN_TYPE, org.antlr.runtime.Token.DEFAULT_CHANNEL, cStart2537, this.getCharIndex()-1);
                    var dStart2541 = this.getCharIndex();
                    this.mHEX_DIGIT();
                    d = new org.antlr.runtime.CommonToken(this.input, org.antlr.runtime.Token.INVALID_TOKEN_TYPE, org.antlr.runtime.Token.DEFAULT_CHANNEL, dStart2541, this.getCharIndex()-1);

                                                                       var h = [];
                                                                       h.push(a.getText());
                                                                       h.push(b.getText());
                                                                       h.push(c.getText());
                                                                       h.push(d.getText());
                                                                       var code = parseInt(h.join(""), 16);
                                                                       this.setText(String.fromCharCode(code));



                    break;

            }
        }
        finally {
        }
    },
    // $ANTLR end "ESC_SEQ",

    // $ANTLR start ESC_REGEX
    mESC_REGEX: function()  {
        try {
            // antlr\\Hilo.g:455:5: ( '\\\\' ( '.' | '*' | '+' | '?' | '$' | '^' | 'd' | 'D' | 's' | 'S' | 'w' | 'W' | '|' | '1' | '(' | ')' | '{' | '}' | '[' | ']' ) )
            // antlr\\Hilo.g:455:9: '\\\\' ( '.' | '*' | '+' | '?' | '$' | '^' | 'd' | 'D' | 's' | 'S' | 'w' | 'W' | '|' | '1' | '(' | ')' | '{' | '}' | '[' | ']' )
            this.match('\\');
            // antlr\\Hilo.g:456:5: ( '.' | '*' | '+' | '?' | '$' | '^' | 'd' | 'D' | 's' | 'S' | 'w' | 'W' | '|' | '1' | '(' | ')' | '{' | '}' | '[' | ']' )
            var alt24=20;
            switch ( this.input.LA(1) ) {
            case '.':
                alt24=1;
                break;
            case '*':
                alt24=2;
                break;
            case '+':
                alt24=3;
                break;
            case '?':
                alt24=4;
                break;
            case '$':
                alt24=5;
                break;
            case '^':
                alt24=6;
                break;
            case 'd':
                alt24=7;
                break;
            case 'D':
                alt24=8;
                break;
            case 's':
                alt24=9;
                break;
            case 'S':
                alt24=10;
                break;
            case 'w':
                alt24=11;
                break;
            case 'W':
                alt24=12;
                break;
            case '|':
                alt24=13;
                break;
            case '1':
                alt24=14;
                break;
            case '(':
                alt24=15;
                break;
            case ')':
                alt24=16;
                break;
            case '{':
                alt24=17;
                break;
            case '}':
                alt24=18;
                break;
            case '[':
                alt24=19;
                break;
            case ']':
                alt24=20;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 24, 0, this.input);

                throw nvae;
            }

            switch (alt24) {
                case 1 :
                    // antlr\\Hilo.g:456:6: '.'
                    this.match('.');
                    this.setText("\\.");


                    break;
                case 2 :
                    // antlr\\Hilo.g:457:6: '*'
                    this.match('*');
                    this.setText("\\*");


                    break;
                case 3 :
                    // antlr\\Hilo.g:458:6: '+'
                    this.match('+');
                    this.setText("\\+");


                    break;
                case 4 :
                    // antlr\\Hilo.g:459:6: '?'
                    this.match('?');
                    this.setText("\\?");


                    break;
                case 5 :
                    // antlr\\Hilo.g:460:6: '$'
                    this.match('$');
                    this.setText("\\$");


                    break;
                case 6 :
                    // antlr\\Hilo.g:461:6: '^'
                    this.match('^');
                    this.setText("\\^");


                    break;
                case 7 :
                    // antlr\\Hilo.g:462:6: 'd'
                    this.match('d');
                    this.setText("\\d");


                    break;
                case 8 :
                    // antlr\\Hilo.g:463:6: 'D'
                    this.match('D');
                    this.setText("\\D");


                    break;
                case 9 :
                    // antlr\\Hilo.g:464:6: 's'
                    this.match('s');
                    this.setText("\\s");


                    break;
                case 10 :
                    // antlr\\Hilo.g:465:6: 'S'
                    this.match('S');
                    this.setText("\\S");


                    break;
                case 11 :
                    // antlr\\Hilo.g:466:6: 'w'
                    this.match('w');
                    this.setText("\\w");


                    break;
                case 12 :
                    // antlr\\Hilo.g:467:6: 'W'
                    this.match('W');
                    this.setText("\\W");


                    break;
                case 13 :
                    // antlr\\Hilo.g:468:6: '|'
                    this.match('|');
                    this.setText("\\|");


                    break;
                case 14 :
                    // antlr\\Hilo.g:469:6: '1'
                    this.match('1');
                    this.setText("\\1");


                    break;
                case 15 :
                    // antlr\\Hilo.g:470:6: '('
                    this.match('(');
                    this.setText("\\(");


                    break;
                case 16 :
                    // antlr\\Hilo.g:471:6: ')'
                    this.match(')');
                    this.setText("\\)");


                    break;
                case 17 :
                    // antlr\\Hilo.g:472:6: '{'
                    this.match('{');
                    this.setText("\\{");


                    break;
                case 18 :
                    // antlr\\Hilo.g:473:6: '}'
                    this.match('}');
                    this.setText("\\}");


                    break;
                case 19 :
                    // antlr\\Hilo.g:474:6: '['
                    this.match('[');
                    this.setText("\\[");


                    break;
                case 20 :
                    // antlr\\Hilo.g:475:6: ']'
                    this.match(']');
                    this.setText("\\]");


                    break;

            }




        }
        finally {
        }
    },
    // $ANTLR end "ESC_REGEX",

    // $ANTLR start HEX_DIGIT
    mHEX_DIGIT: function()  {
        try {
            // antlr\\Hilo.g:480:11: ( ( DIGIT | 'a' .. 'f' | 'A' .. 'F' ) )
            // antlr\\Hilo.g:480:13: ( DIGIT | 'a' .. 'f' | 'A' .. 'F' )
            if ( (this.input.LA(1)>='0' && this.input.LA(1)<='9')||(this.input.LA(1)>='A' && this.input.LA(1)<='F')||(this.input.LA(1)>='a' && this.input.LA(1)<='f') ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "HEX_DIGIT",

    // $ANTLR start DIGIT
    mDIGIT: function()  {
        try {
            // antlr\\Hilo.g:483:7: ( '0' .. '9' )
            // antlr\\Hilo.g:483:9: '0' .. '9'
            this.matchRange('0','9');



        }
        finally {
        }
    },
    // $ANTLR end "DIGIT",

    // $ANTLR start LETTER
    mLETTER: function()  {
        try {
            // antlr\\Hilo.g:486:8: ( 'a' .. 'z' | 'A' .. 'Z' )
            // antlr\\Hilo.g:
            if ( (this.input.LA(1)>='A' && this.input.LA(1)<='Z')||(this.input.LA(1)>='a' && this.input.LA(1)<='z') ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "LETTER",

    // $ANTLR start VARIABLE_FIELD
    mVARIABLE_FIELD: function()  {
        try {
            // antlr\\Hilo.g:489:16: ( LBRA '\\'' LETTER ( '_' | LETTER | DIGIT )* '\\'' RBRA )
            // antlr\\Hilo.g:489:18: LBRA '\\'' LETTER ( '_' | LETTER | DIGIT )* '\\'' RBRA
            this.mLBRA();
            this.match('\'');
            this.mLETTER();
            // antlr\\Hilo.g:489:35: ( '_' | LETTER | DIGIT )*
            loop25:
            do {
                var alt25=2;
                switch ( this.input.LA(1) ) {
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                case 'A':
                case 'B':
                case 'C':
                case 'D':
                case 'E':
                case 'F':
                case 'G':
                case 'H':
                case 'I':
                case 'J':
                case 'K':
                case 'L':
                case 'M':
                case 'N':
                case 'O':
                case 'P':
                case 'Q':
                case 'R':
                case 'S':
                case 'T':
                case 'U':
                case 'V':
                case 'W':
                case 'X':
                case 'Y':
                case 'Z':
                case '_':
                case 'a':
                case 'b':
                case 'c':
                case 'd':
                case 'e':
                case 'f':
                case 'g':
                case 'h':
                case 'i':
                case 'j':
                case 'k':
                case 'l':
                case 'm':
                case 'n':
                case 'o':
                case 'p':
                case 'q':
                case 'r':
                case 's':
                case 't':
                case 'u':
                case 'v':
                case 'w':
                case 'x':
                case 'y':
                case 'z':
                    alt25=1;
                    break;

                }

                switch (alt25) {
                case 1 :
                    // antlr\\Hilo.g:
                    if ( (this.input.LA(1)>='0' && this.input.LA(1)<='9')||(this.input.LA(1)>='A' && this.input.LA(1)<='Z')||this.input.LA(1)=='_'||(this.input.LA(1)>='a' && this.input.LA(1)<='z') ) {
                        this.input.consume();

                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        this.recover(mse);
                        throw mse;}



                    break;

                default :
                    break loop25;
                }
            } while (true);

            this.match('\'');
            this.mRBRA();



        }
        finally {
        }
    },
    // $ANTLR end "VARIABLE_FIELD",

    // $ANTLR start NAME_IN_QUOTE
    mNAME_IN_QUOTE: function()  {
        try {
            // antlr\\Hilo.g:493:15: ( '\"' ( '\\\\\\\"' | '\\\\\\\\' | ~ ( '\\\"' | '\\\\' | '\\n' ) )+ '\"' )
            // antlr\\Hilo.g:493:17: '\"' ( '\\\\\\\"' | '\\\\\\\\' | ~ ( '\\\"' | '\\\\' | '\\n' ) )+ '\"'
            this.match('\"');
            // antlr\\Hilo.g:493:21: ( '\\\\\\\"' | '\\\\\\\\' | ~ ( '\\\"' | '\\\\' | '\\n' ) )+
            var cnt26=0;
            loop26:
            do {
                var alt26=4;
                var LA26_0 = this.input.LA(1);

                if ( (LA26_0=='\\') ) {
                    switch ( this.input.LA(2) ) {
                    case '\"':
                        alt26=1;
                        break;
                    case '\\':
                        alt26=2;
                        break;

                    }

                }
                else if ( ((LA26_0>='\u0000' && LA26_0<='\t')||(LA26_0>='\u000B' && LA26_0<='!')||(LA26_0>='#' && LA26_0<='[')||(LA26_0>=']' && LA26_0<='\uFFFF')) ) {
                    alt26=3;
                }


                switch (alt26) {
                case 1 :
                    // antlr\\Hilo.g:493:22: '\\\\\\\"'
                    this.match("\\\"");



                    break;
                case 2 :
                    // antlr\\Hilo.g:493:31: '\\\\\\\\'
                    this.match("\\\\");



                    break;
                case 3 :
                    // antlr\\Hilo.g:493:40: ~ ( '\\\"' | '\\\\' | '\\n' )
                    if ( (this.input.LA(1)>='\u0000' && this.input.LA(1)<='\t')||(this.input.LA(1)>='\u000B' && this.input.LA(1)<='!')||(this.input.LA(1)>='#' && this.input.LA(1)<='[')||(this.input.LA(1)>=']' && this.input.LA(1)<='\uFFFF') ) {
                        this.input.consume();

                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        this.recover(mse);
                        throw mse;}



                    break;

                default :
                    if ( cnt26 >= 1 ) {
                        break loop26;
                    }
                        var eee = new org.antlr.runtime.EarlyExitException(26, this.input);
                        throw eee;
                }
                cnt26++;
            } while (true);

            this.match('\"');



        }
        finally {
        }
    },
    // $ANTLR end "NAME_IN_QUOTE",

    // $ANTLR start OLD_FIELD_STR
    mOLD_FIELD_STR: function()  {
        try {
            // antlr\\Hilo.g:496:15: ( ( LETTER | DIGIT | '_' | ':' | '.' | '-' )+ )
            // antlr\\Hilo.g:496:17: ( LETTER | DIGIT | '_' | ':' | '.' | '-' )+
            // antlr\\Hilo.g:496:17: ( LETTER | DIGIT | '_' | ':' | '.' | '-' )+
            var cnt27=0;
            loop27:
            do {
                var alt27=2;
                switch ( this.input.LA(1) ) {
                case '-':
                case '.':
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                case ':':
                case 'A':
                case 'B':
                case 'C':
                case 'D':
                case 'E':
                case 'F':
                case 'G':
                case 'H':
                case 'I':
                case 'J':
                case 'K':
                case 'L':
                case 'M':
                case 'N':
                case 'O':
                case 'P':
                case 'Q':
                case 'R':
                case 'S':
                case 'T':
                case 'U':
                case 'V':
                case 'W':
                case 'X':
                case 'Y':
                case 'Z':
                case '_':
                case 'a':
                case 'b':
                case 'c':
                case 'd':
                case 'e':
                case 'f':
                case 'g':
                case 'h':
                case 'i':
                case 'j':
                case 'k':
                case 'l':
                case 'm':
                case 'n':
                case 'o':
                case 'p':
                case 'q':
                case 'r':
                case 's':
                case 't':
                case 'u':
                case 'v':
                case 'w':
                case 'x':
                case 'y':
                case 'z':
                    alt27=1;
                    break;

                }

                switch (alt27) {
                case 1 :
                    // antlr\\Hilo.g:
                    if ( (this.input.LA(1)>='-' && this.input.LA(1)<='.')||(this.input.LA(1)>='0' && this.input.LA(1)<=':')||(this.input.LA(1)>='A' && this.input.LA(1)<='Z')||this.input.LA(1)=='_'||(this.input.LA(1)>='a' && this.input.LA(1)<='z') ) {
                        this.input.consume();

                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        this.recover(mse);
                        throw mse;}



                    break;

                default :
                    if ( cnt27 >= 1 ) {
                        break loop27;
                    }
                        var eee = new org.antlr.runtime.EarlyExitException(27, this.input);
                        throw eee;
                }
                cnt27++;
            } while (true);




        }
        finally {
        }
    },
    // $ANTLR end "OLD_FIELD_STR",

    // $ANTLR start DIM_MEASURE_FIELD
    mDIM_MEASURE_FIELD: function()  {
        try {
            // antlr\\Hilo.g:500:5: ( LBRA ( 'd/' | 'h/' | 'p/' )? ( NAME_IN_QUOTE ':' )? ( NAME_IN_QUOTE | OLD_FIELD_STR ) RBRA )
            // antlr\\Hilo.g:500:7: LBRA ( 'd/' | 'h/' | 'p/' )? ( NAME_IN_QUOTE ':' )? ( NAME_IN_QUOTE | OLD_FIELD_STR ) RBRA
            this.mLBRA();
            // antlr\\Hilo.g:500:12: ( 'd/' | 'h/' | 'p/' )?
            var alt28=4;
            switch ( this.input.LA(1) ) {
                case 'd':
                    switch ( this.input.LA(2) ) {
                        case '/':
                            alt28=1;
                            break;
                    }

                    break;
                case 'h':
                    switch ( this.input.LA(2) ) {
                        case '/':
                            alt28=2;
                            break;
                    }

                    break;
                case 'p':
                    switch ( this.input.LA(2) ) {
                        case '/':
                            alt28=3;
                            break;
                    }

                    break;
            }

            switch (alt28) {
                case 1 :
                    // antlr\\Hilo.g:500:13: 'd/'
                    this.match("d/");



                    break;
                case 2 :
                    // antlr\\Hilo.g:500:20: 'h/'
                    this.match("h/");



                    break;
                case 3 :
                    // antlr\\Hilo.g:500:27: 'p/'
                    this.match("p/");



                    break;

            }

            // antlr\\Hilo.g:500:34: ( NAME_IN_QUOTE ':' )?
            var alt29=2;
            alt29 = this.dfa29.predict(this.input);
            switch (alt29) {
                case 1 :
                    // antlr\\Hilo.g:500:35: NAME_IN_QUOTE ':'
                    this.mNAME_IN_QUOTE();
                    this.match(':');


                    break;

            }

            // antlr\\Hilo.g:500:55: ( NAME_IN_QUOTE | OLD_FIELD_STR )
            var alt30=2;
            switch ( this.input.LA(1) ) {
            case '\"':
                alt30=1;
                break;
            case '-':
            case '.':
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case ':':
            case 'A':
            case 'B':
            case 'C':
            case 'D':
            case 'E':
            case 'F':
            case 'G':
            case 'H':
            case 'I':
            case 'J':
            case 'K':
            case 'L':
            case 'M':
            case 'N':
            case 'O':
            case 'P':
            case 'Q':
            case 'R':
            case 'S':
            case 'T':
            case 'U':
            case 'V':
            case 'W':
            case 'X':
            case 'Y':
            case 'Z':
            case '_':
            case 'a':
            case 'b':
            case 'c':
            case 'd':
            case 'e':
            case 'f':
            case 'g':
            case 'h':
            case 'i':
            case 'j':
            case 'k':
            case 'l':
            case 'm':
            case 'n':
            case 'o':
            case 'p':
            case 'q':
            case 'r':
            case 's':
            case 't':
            case 'u':
            case 'v':
            case 'w':
            case 'x':
            case 'y':
            case 'z':
                alt30=2;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 30, 0, this.input);

                throw nvae;
            }

            switch (alt30) {
                case 1 :
                    // antlr\\Hilo.g:500:56: NAME_IN_QUOTE
                    this.mNAME_IN_QUOTE();


                    break;
                case 2 :
                    // antlr\\Hilo.g:500:72: OLD_FIELD_STR
                    this.mOLD_FIELD_STR();


                    break;

            }

            this.mRBRA();



        }
        finally {
        }
    },
    // $ANTLR end "DIM_MEASURE_FIELD",

    // $ANTLR start CALC_FIELD
    mCALC_FIELD: function()  {
        try {
            // antlr\\Hilo.g:505:12: ( LBRA ( '#' | '@' ) (~ ( '.' | ',' | '[' | ']' | '{' | '}' ) )+ RBRA )
            // antlr\\Hilo.g:505:14: LBRA ( '#' | '@' ) (~ ( '.' | ',' | '[' | ']' | '{' | '}' ) )+ RBRA
            this.mLBRA();
            if ( this.input.LA(1)=='#'||this.input.LA(1)=='@' ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}

            // antlr\\Hilo.g:505:31: (~ ( '.' | ',' | '[' | ']' | '{' | '}' ) )+
            var cnt31=0;
            loop31:
            do {
                var alt31=2;
                var LA31_0 = this.input.LA(1);

                if ( ((LA31_0>='\u0000' && LA31_0<='+')||LA31_0=='-'||(LA31_0>='/' && LA31_0<='Z')||LA31_0=='\\'||(LA31_0>='^' && LA31_0<='z')||LA31_0=='|'||(LA31_0>='~' && LA31_0<='\uFFFF')) ) {
                    alt31=1;
                }


                switch (alt31) {
                case 1 :
                    // antlr\\Hilo.g:505:31: ~ ( '.' | ',' | '[' | ']' | '{' | '}' )
                    if ( (this.input.LA(1)>='\u0000' && this.input.LA(1)<='+')||this.input.LA(1)=='-'||(this.input.LA(1)>='/' && this.input.LA(1)<='Z')||this.input.LA(1)=='\\'||(this.input.LA(1)>='^' && this.input.LA(1)<='z')||this.input.LA(1)=='|'||(this.input.LA(1)>='~' && this.input.LA(1)<='\uFFFF') ) {
                        this.input.consume();

                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        this.recover(mse);
                        throw mse;}



                    break;

                default :
                    if ( cnt31 >= 1 ) {
                        break loop31;
                    }
                        var eee = new org.antlr.runtime.EarlyExitException(31, this.input);
                        throw eee;
                }
                cnt31++;
            } while (true);

            this.mRBRA();



        }
        finally {
        }
    },
    // $ANTLR end "CALC_FIELD",

    // $ANTLR start FIELD
    mFIELD: function()  {
        try {
            var _type = this.FIELD;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:508:7: ( DIM_MEASURE_FIELD | CALC_FIELD | VARIABLE_FIELD )
            var alt32=3;
            switch ( this.input.LA(1) ) {
            case '[':
                switch ( this.input.LA(2) ) {
                case '\"':
                case '-':
                case '.':
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                case ':':
                case 'A':
                case 'B':
                case 'C':
                case 'D':
                case 'E':
                case 'F':
                case 'G':
                case 'H':
                case 'I':
                case 'J':
                case 'K':
                case 'L':
                case 'M':
                case 'N':
                case 'O':
                case 'P':
                case 'Q':
                case 'R':
                case 'S':
                case 'T':
                case 'U':
                case 'V':
                case 'W':
                case 'X':
                case 'Y':
                case 'Z':
                case '_':
                case 'a':
                case 'b':
                case 'c':
                case 'd':
                case 'e':
                case 'f':
                case 'g':
                case 'h':
                case 'i':
                case 'j':
                case 'k':
                case 'l':
                case 'm':
                case 'n':
                case 'o':
                case 'p':
                case 'q':
                case 'r':
                case 's':
                case 't':
                case 'u':
                case 'v':
                case 'w':
                case 'x':
                case 'y':
                case 'z':
                    alt32=1;
                    break;
                case '#':
                case '@':
                    alt32=2;
                    break;
                case '\'':
                    alt32=3;
                    break;
                default:
                    var nvae =
                        new org.antlr.runtime.NoViableAltException("", 32, 1, this.input);

                    throw nvae;
                }

                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 32, 0, this.input);

                throw nvae;
            }

            switch (alt32) {
                case 1 :
                    // antlr\\Hilo.g:508:9: DIM_MEASURE_FIELD
                    this.mDIM_MEASURE_FIELD();


                    break;
                case 2 :
                    // antlr\\Hilo.g:508:29: CALC_FIELD
                    this.mCALC_FIELD();


                    break;
                case 3 :
                    // antlr\\Hilo.g:508:42: VARIABLE_FIELD
                    this.mVARIABLE_FIELD();


                    break;

            }
            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "FIELD",

    // $ANTLR start ATTRIBUTE
    mATTRIBUTE: function()  {
        try {
            var _type = this.ATTRIBUTE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:511:5: ( FIELD DOT FIELD )
            // antlr\\Hilo.g:511:7: FIELD DOT FIELD
            this.mFIELD();
            this.mDOT();
            this.mFIELD();



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "ATTRIBUTE",

    // $ANTLR start MEASURE_FIELD
    mMEASURE_FIELD: function()  {
        try {
            var _type = this.MEASURE_FIELD;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:515:15: ( LBRA (~ ( '\\n' | RBRA ) )* RBRA )
            // antlr\\Hilo.g:515:17: LBRA (~ ( '\\n' | RBRA ) )* RBRA
            this.mLBRA();
            // antlr\\Hilo.g:515:22: (~ ( '\\n' | RBRA ) )*
            loop33:
            do {
                var alt33=2;
                var LA33_0 = this.input.LA(1);

                if ( ((LA33_0>='\u0000' && LA33_0<='\t')||(LA33_0>='\u000B' && LA33_0<='\\')||(LA33_0>='^' && LA33_0<='\uFFFF')) ) {
                    alt33=1;
                }


                switch (alt33) {
                case 1 :
                    // antlr\\Hilo.g:515:22: ~ ( '\\n' | RBRA )
                    if ( (this.input.LA(1)>='\u0000' && this.input.LA(1)<='\t')||(this.input.LA(1)>='\u000B' && this.input.LA(1)<='\\')||(this.input.LA(1)>='^' && this.input.LA(1)<='\uFFFF') ) {
                        this.input.consume();

                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        this.recover(mse);
                        throw mse;}



                    break;

                default :
                    break loop33;
                }
            } while (true);

            this.mRBRA();



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "MEASURE_FIELD",

    // $ANTLR start OLD_ATTRIBUTE
    mOLD_ATTRIBUTE: function()  {
        try {
            var _type = this.OLD_ATTRIBUTE;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // antlr\\Hilo.g:519:5: ( MEASURE_FIELD DOT MEASURE_FIELD )
            // antlr\\Hilo.g:519:7: MEASURE_FIELD DOT MEASURE_FIELD
            this.mMEASURE_FIELD();
            this.mDOT();
            this.mMEASURE_FIELD();



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "OLD_ATTRIBUTE",

    mTokens: function() {
        // antlr\\Hilo.g:1:8: ( EQ | NEQ | LT | GT | GTE | LTE | PLUS | MINUS | MULT | DIV | REM | POW | PIPE | ASSIGN | LPAR | RPAR | LBRA | RBRA | COMMA | DOT | SEMICOLON | OR | AND | NOT | CAGR | LOOKUP | SMA | YOY | LINK | ITERATE | NULL | TRUE | FALSE | YES | NO | WHITESPACE | COMMENT | INTEGER | DOUBLE | IDENTIFIER | DATE_TIME | STRING | DOT_SEP_STRING | DQ_ALLOW_ESC_REGEX_STRING | FIELD | ATTRIBUTE | MEASURE_FIELD | OLD_ATTRIBUTE )
        var alt34=48;
        alt34 = this.dfa34.predict(this.input);
        switch (alt34) {
            case 1 :
                // antlr\\Hilo.g:1:10: EQ
                this.mEQ();


                break;
            case 2 :
                // antlr\\Hilo.g:1:13: NEQ
                this.mNEQ();


                break;
            case 3 :
                // antlr\\Hilo.g:1:17: LT
                this.mLT();


                break;
            case 4 :
                // antlr\\Hilo.g:1:20: GT
                this.mGT();


                break;
            case 5 :
                // antlr\\Hilo.g:1:23: GTE
                this.mGTE();


                break;
            case 6 :
                // antlr\\Hilo.g:1:27: LTE
                this.mLTE();


                break;
            case 7 :
                // antlr\\Hilo.g:1:31: PLUS
                this.mPLUS();


                break;
            case 8 :
                // antlr\\Hilo.g:1:36: MINUS
                this.mMINUS();


                break;
            case 9 :
                // antlr\\Hilo.g:1:42: MULT
                this.mMULT();


                break;
            case 10 :
                // antlr\\Hilo.g:1:47: DIV
                this.mDIV();


                break;
            case 11 :
                // antlr\\Hilo.g:1:51: REM
                this.mREM();


                break;
            case 12 :
                // antlr\\Hilo.g:1:55: POW
                this.mPOW();


                break;
            case 13 :
                // antlr\\Hilo.g:1:59: PIPE
                this.mPIPE();


                break;
            case 14 :
                // antlr\\Hilo.g:1:64: ASSIGN
                this.mASSIGN();


                break;
            case 15 :
                // antlr\\Hilo.g:1:71: LPAR
                this.mLPAR();


                break;
            case 16 :
                // antlr\\Hilo.g:1:76: RPAR
                this.mRPAR();


                break;
            case 17 :
                // antlr\\Hilo.g:1:81: LBRA
                this.mLBRA();


                break;
            case 18 :
                // antlr\\Hilo.g:1:86: RBRA
                this.mRBRA();


                break;
            case 19 :
                // antlr\\Hilo.g:1:91: COMMA
                this.mCOMMA();


                break;
            case 20 :
                // antlr\\Hilo.g:1:97: DOT
                this.mDOT();


                break;
            case 21 :
                // antlr\\Hilo.g:1:101: SEMICOLON
                this.mSEMICOLON();


                break;
            case 22 :
                // antlr\\Hilo.g:1:111: OR
                this.mOR();


                break;
            case 23 :
                // antlr\\Hilo.g:1:114: AND
                this.mAND();


                break;
            case 24 :
                // antlr\\Hilo.g:1:118: NOT
                this.mNOT();


                break;
            case 25 :
                // antlr\\Hilo.g:1:122: CAGR
                this.mCAGR();


                break;
            case 26 :
                // antlr\\Hilo.g:1:127: LOOKUP
                this.mLOOKUP();


                break;
            case 27 :
                // antlr\\Hilo.g:1:134: SMA
                this.mSMA();


                break;
            case 28 :
                // antlr\\Hilo.g:1:138: YOY
                this.mYOY();


                break;
            case 29 :
                // antlr\\Hilo.g:1:142: LINK
                this.mLINK();


                break;
            case 30 :
                // antlr\\Hilo.g:1:147: ITERATE
                this.mITERATE();


                break;
            case 31 :
                // antlr\\Hilo.g:1:155: NULL
                this.mNULL();


                break;
            case 32 :
                // antlr\\Hilo.g:1:160: TRUE
                this.mTRUE();


                break;
            case 33 :
                // antlr\\Hilo.g:1:165: FALSE
                this.mFALSE();


                break;
            case 34 :
                // antlr\\Hilo.g:1:171: YES
                this.mYES();


                break;
            case 35 :
                // antlr\\Hilo.g:1:175: NO
                this.mNO();


                break;
            case 36 :
                // antlr\\Hilo.g:1:178: WHITESPACE
                this.mWHITESPACE();


                break;
            case 37 :
                // antlr\\Hilo.g:1:189: COMMENT
                this.mCOMMENT();


                break;
            case 38 :
                // antlr\\Hilo.g:1:197: INTEGER
                this.mINTEGER();


                break;
            case 39 :
                // antlr\\Hilo.g:1:205: DOUBLE
                this.mDOUBLE();


                break;
            case 40 :
                // antlr\\Hilo.g:1:212: IDENTIFIER
                this.mIDENTIFIER();


                break;
            case 41 :
                // antlr\\Hilo.g:1:223: DATE_TIME
                this.mDATE_TIME();


                break;
            case 42 :
                // antlr\\Hilo.g:1:233: STRING
                this.mSTRING();


                break;
            case 43 :
                // antlr\\Hilo.g:1:240: DOT_SEP_STRING
                this.mDOT_SEP_STRING();


                break;
            case 44 :
                // antlr\\Hilo.g:1:255: DQ_ALLOW_ESC_REGEX_STRING
                this.mDQ_ALLOW_ESC_REGEX_STRING();


                break;
            case 45 :
                // antlr\\Hilo.g:1:281: FIELD
                this.mFIELD();


                break;
            case 46 :
                // antlr\\Hilo.g:1:287: ATTRIBUTE
                this.mATTRIBUTE();


                break;
            case 47 :
                // antlr\\Hilo.g:1:297: MEASURE_FIELD
                this.mMEASURE_FIELD();


                break;
            case 48 :
                // antlr\\Hilo.g:1:311: OLD_ATTRIBUTE
                this.mOLD_ATTRIBUTE();


                break;

        }

    }

}, true); // important to pass true to overwrite default implementations

org.antlr.lang.augmentObject(HiloLexer, {
    DFA11_eotS:
        "\u0005\uffff",
    DFA11_eofS:
        "\u0005\uffff",
    DFA11_minS:
        "\u0002\u002e\u0003\uffff",
    DFA11_maxS:
        "\u0001\u0039\u0001\u0065\u0003\uffff",
    DFA11_acceptS:
        "\u0002\uffff\u0001\u0002\u0001\u0001\u0001\u0003",
    DFA11_specialS:
        "\u0005\uffff}>",
    DFA11_transitionS: [
            "\u0001\u0002\u0001\uffff\u000a\u0001",
            "\u0001\u0003\u0001\uffff\u000a\u0001\u000b\uffff\u0001\u0004"+
            "\u001f\uffff\u0001\u0004",
            "",
            "",
            ""
    ]
});

org.antlr.lang.augmentObject(HiloLexer, {
    DFA11_eot:
        org.antlr.runtime.DFA.unpackEncodedString(HiloLexer.DFA11_eotS),
    DFA11_eof:
        org.antlr.runtime.DFA.unpackEncodedString(HiloLexer.DFA11_eofS),
    DFA11_min:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(HiloLexer.DFA11_minS),
    DFA11_max:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(HiloLexer.DFA11_maxS),
    DFA11_accept:
        org.antlr.runtime.DFA.unpackEncodedString(HiloLexer.DFA11_acceptS),
    DFA11_special:
        org.antlr.runtime.DFA.unpackEncodedString(HiloLexer.DFA11_specialS),
    DFA11_transition: (function() {
        var a = [],
            i,
            numStates = HiloLexer.DFA11_transitionS.length;
        for (i=0; i<numStates; i++) {
            a.push(org.antlr.runtime.DFA.unpackEncodedString(HiloLexer.DFA11_transitionS[i]));
        }
        return a;
    })()
});

HiloLexer.DFA11 = function(recognizer) {
    this.recognizer = recognizer;
    this.decisionNumber = 11;
    this.eot = HiloLexer.DFA11_eot;
    this.eof = HiloLexer.DFA11_eof;
    this.min = HiloLexer.DFA11_min;
    this.max = HiloLexer.DFA11_max;
    this.accept = HiloLexer.DFA11_accept;
    this.special = HiloLexer.DFA11_special;
    this.transition = HiloLexer.DFA11_transition;
};

org.antlr.lang.extend(HiloLexer.DFA11, org.antlr.runtime.DFA, {
    getDescription: function() {
        return "373:1: DOUBLE : ( ( DIGIT )+ '.' ( DIGIT )* ( EXPONENT )? | '.' ( DIGIT )+ ( EXPONENT )? | ( DIGIT )+ EXPONENT );";
    },
    dummy: null
});
org.antlr.lang.augmentObject(HiloLexer, {
    DFA29_eotS:
        "\u0009\uffff",
    DFA29_eofS:
        "\u0009\uffff",
    DFA29_minS:
        "\u0001\u0022\u0001\u0000\u0001\uffff\u0001\u0022\u0003\u0000\u0001"+
    "\u003a\u0001\uffff",
    DFA29_maxS:
        "\u0001\u007a\u0001\uffff\u0001\uffff\u0001\u005c\u0003\uffff\u0001"+
    "\u005d\u0001\uffff",
    DFA29_acceptS:
        "\u0002\uffff\u0001\u0002\u0005\uffff\u0001\u0001",
    DFA29_specialS:
        "\u0001\uffff\u0001\u0003\u0002\uffff\u0001\u0000\u0001\u0001\u0001"+
    "\u0002\u0002\uffff}>",
    DFA29_transitionS: [
            "\u0001\u0001\u000a\uffff\u0002\u0002\u0001\uffff\u000b\u0002"+
            "\u0006\uffff\u001a\u0002\u0004\uffff\u0001\u0002\u0001\uffff"+
            "\u001a\u0002",
            "\u000a\u0004\u0001\uffff\u0017\u0004\u0001\uffff\u0039\u0004"+
            "\u0001\u0003\uffa3\u0004",
            "",
            "\u0001\u0005\u0039\uffff\u0001\u0006",
            "\u000a\u0004\u0001\uffff\u0017\u0004\u0001\u0007\u0039\u0004"+
            "\u0001\u0003\uffa3\u0004",
            "\u000a\u0004\u0001\uffff\u0017\u0004\u0001\u0007\u0039\u0004"+
            "\u0001\u0003\uffa3\u0004",
            "\u000a\u0004\u0001\uffff\u0017\u0004\u0001\u0007\u0039\u0004"+
            "\u0001\u0003\uffa3\u0004",
            "\u0001\u0008\u0022\uffff\u0001\u0002",
            ""
    ]
});

org.antlr.lang.augmentObject(HiloLexer, {
    DFA29_eot:
        org.antlr.runtime.DFA.unpackEncodedString(HiloLexer.DFA29_eotS),
    DFA29_eof:
        org.antlr.runtime.DFA.unpackEncodedString(HiloLexer.DFA29_eofS),
    DFA29_min:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(HiloLexer.DFA29_minS),
    DFA29_max:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(HiloLexer.DFA29_maxS),
    DFA29_accept:
        org.antlr.runtime.DFA.unpackEncodedString(HiloLexer.DFA29_acceptS),
    DFA29_special:
        org.antlr.runtime.DFA.unpackEncodedString(HiloLexer.DFA29_specialS),
    DFA29_transition: (function() {
        var a = [],
            i,
            numStates = HiloLexer.DFA29_transitionS.length;
        for (i=0; i<numStates; i++) {
            a.push(org.antlr.runtime.DFA.unpackEncodedString(HiloLexer.DFA29_transitionS[i]));
        }
        return a;
    })()
});

HiloLexer.DFA29 = function(recognizer) {
    this.recognizer = recognizer;
    this.decisionNumber = 29;
    this.eot = HiloLexer.DFA29_eot;
    this.eof = HiloLexer.DFA29_eof;
    this.min = HiloLexer.DFA29_min;
    this.max = HiloLexer.DFA29_max;
    this.accept = HiloLexer.DFA29_accept;
    this.special = HiloLexer.DFA29_special;
    this.transition = HiloLexer.DFA29_transition;
};

org.antlr.lang.extend(HiloLexer.DFA29, org.antlr.runtime.DFA, {
    getDescription: function() {
        return "500:34: ( NAME_IN_QUOTE ':' )?";
    },
    specialStateTransition: function(s, input) {
        var _s = s;
        /* bind to recognizer so semantic predicates can be evaluated */
        var retval = (function(s, input) {
            switch ( s ) {
                        case 0 :
                            var LA29_4 = input.LA(1);

                            s = -1;
                            if ( (LA29_4=='\"') ) {s = 7;}

                            else if ( (LA29_4=='\\') ) {s = 3;}

                            else if ( ((LA29_4>='\u0000' && LA29_4<='\t')||(LA29_4>='\u000B' && LA29_4<='!')||(LA29_4>='#' && LA29_4<='[')||(LA29_4>=']' && LA29_4<='\uFFFF')) ) {s = 4;}

                            if ( s>=0 ) return s;
                            break;
                        case 1 :
                            var LA29_5 = input.LA(1);

                            s = -1;
                            if ( (LA29_5=='\"') ) {s = 7;}

                            else if ( (LA29_5=='\\') ) {s = 3;}

                            else if ( ((LA29_5>='\u0000' && LA29_5<='\t')||(LA29_5>='\u000B' && LA29_5<='!')||(LA29_5>='#' && LA29_5<='[')||(LA29_5>=']' && LA29_5<='\uFFFF')) ) {s = 4;}

                            if ( s>=0 ) return s;
                            break;
                        case 2 :
                            var LA29_6 = input.LA(1);

                            s = -1;
                            if ( (LA29_6=='\"') ) {s = 7;}

                            else if ( (LA29_6=='\\') ) {s = 3;}

                            else if ( ((LA29_6>='\u0000' && LA29_6<='\t')||(LA29_6>='\u000B' && LA29_6<='!')||(LA29_6>='#' && LA29_6<='[')||(LA29_6>=']' && LA29_6<='\uFFFF')) ) {s = 4;}

                            if ( s>=0 ) return s;
                            break;
                        case 3 :
                            var LA29_1 = input.LA(1);

                            s = -1;
                            if ( (LA29_1=='\\') ) {s = 3;}

                            else if ( ((LA29_1>='\u0000' && LA29_1<='\t')||(LA29_1>='\u000B' && LA29_1<='!')||(LA29_1>='#' && LA29_1<='[')||(LA29_1>=']' && LA29_1<='\uFFFF')) ) {s = 4;}

                            if ( s>=0 ) return s;
                            break;
            }
        }).call(this.recognizer, s, input);
        if (!org.antlr.lang.isUndefined(retval)) {
            return retval;
        }
        var nvae =
            new org.antlr.runtime.NoViableAltException(this.getDescription(), 29, _s, input);
        this.error(nvae);
        throw nvae;
    },
    dummy: null
});
org.antlr.lang.augmentObject(HiloLexer, {
    DFA34_eotS:
        "\u0003\uffff\u0001\u0024\u0001\u0026\u0002\uffff\u0001\u0028\u0001"+
    "\u002a\u0001\u002b\u0004\uffff\u0001\u002c\u0002\uffff\u0001\u0036\u0001"+
    "\uffff\u000a\u001f\u0001\uffff\u0001\u0045\u0016\uffff\u0001\u0053\u0002"+
    "\uffff\u0001\u0055\u0001\u001f\u0001\u0057\u000a\u001f\u0003\uffff\u0001"+
    "\u0022\u0001\uffff\u0001\u006e\u0003\uffff\u0001\u0053\u0007\uffff\u0001"+
    "\u007b\u0001\uffff\u0001\u007c\u0004\u001f\u0001\u0081\u0001\u0082\u0001"+
    "\u0083\u0003\u001f\u0014\uffff\u0002\u006e\u0004\uffff\u0001\u0091\u0001"+
    "\u0092\u0001\u001f\u0001\u0094\u0003\uffff\u0001\u001f\u0001\u0096\u0001"+
    "\u001f\u0003\uffff\u0001\u006e\u0005\uffff\u0001\u006e\u0002\uffff\u0001"+
    "\u001f\u0001\uffff\u0001\u001f\u0001\uffff\u0001\u00a9\u000d\uffff\u0001"+
    "\u0054\u0001\uffff\u0001\u00bd\u0001\u001f\u0007\uffff\u0001\u0054\u0006"+
    "\uffff\u0001\u006e\u0003\uffff\u0001\u0053\u0002\uffff\u0001\u00cf\u0014"+
    "\uffff\u0001\u0054\u0007\uffff\u0001\u0054\u0004\uffff",
    DFA34_eofS:
        "\u00e0\uffff",
    DFA34_minS:
        "\u0001\u0009\u0002\uffff\u0002\u003d\u0002\uffff\u0001\u002a\u0001"+
    "\u002f\u0001\u0047\u0004\uffff\u0001\u0000\u0002\uffff\u0001\u0030\u0001"+
    "\uffff\u0001\u0052\u0001\u004e\u0001\u004f\u0001\u0041\u0001\u0049\u0001"+
    "\u004d\u0001\u0045\u0001\u0054\u0001\u0052\u0001\u0041\u0001\uffff\u0001"+
    "\u002e\u0002\uffff\u0001\u0000\u000b\uffff\u0008\u0000\u0001\u002e\u0002"+
    "\uffff\u0001\u0030\u0001\u0044\u0001\u0030\u0001\u004c\u0001\u0047\u0001"+
    "\u004f\u0001\u004e\u0001\u0041\u0001\u0059\u0001\u0053\u0001\u0045\u0001"+
    "\u0055\u0001\u004c\u0001\uffff\u0001\u0022\u0001\u0000\u0001\u002e\u0001"+
    "\u0000\u0001\u002e\u0008\u0000\u0003\uffff\u0001\u0030\u0001\uffff\u0001"+
    "\u0030\u0001\u004c\u0001\u0052\u0002\u004b\u0003\u0030\u0001\u0052\u0001"+
    "\u0045\u0001\u0053\u0001\u0030\u0008\u0000\u0003\uffff\u0001\u005b\u0002"+
    "\u0000\u0001\u003a\u0001\u0022\u0003\u0000\u0002\u002e\u0002\u0000\u0002"+
    "\uffff\u0002\u0030\u0001\u0055\u0001\u0030\u0003\uffff\u0001\u0041\u0001"+
    "\u0030\u0001\u0045\u0001\u0030\u0001\u0000\u0001\u0022\u0001\u002e\u0004"+
    "\u0000\u0001\uffff\u0001\u002e\u0002\uffff\u0001\u0050\u0001\uffff\u0001"+
    "\u0054\u0001\uffff\u0002\u0030\u0008\u0000\u0001\u002d\u0005\u0000\u0001"+
    "\u0030\u0001\u0045\u0001\uffff\u0001\u0030\u0001\u0000\u0001\uffff\u0007"+
    "\u0000\u0001\u0022\u0002\u0000\u0001\u002e\u0005\u0000\u0001\uffff\u0001"+
    "\u0030\u0004\u0000\u0001\uffff\u0004\u0000\u0001\u005d\u0006\u0000\u0001"+
    "\uffff\u0001\u0000\u0001\uffff\u000e\u0000",
    DFA34_maxS:
        "\u0001\u007c\u0002\uffff\u0002\u003d\u0002\uffff\u0001\u002a\u0001"+
    "\u002f\u0001\u0073\u0004\uffff\u0001\uffff\u0002\uffff\u0001\u0039\u0001"+
    "\uffff\u0001\u0072\u0001\u006e\u0001\u0075\u0001\u0061\u0001\u006f\u0001"+
    "\u006d\u0001\u006f\u0001\u0074\u0001\u0072\u0001\u0061\u0001\uffff\u0001"+
    "\u0065\u0002\uffff\u0001\uffff\u000b\uffff\u0008\uffff\u0001\u002e\u0002"+
    "\uffff\u0001\u007a\u0001\u0064\u0001\u007a\u0001\u006c\u0001\u0067\u0001"+
    "\u006f\u0001\u006e\u0001\u0061\u0001\u0079\u0001\u0073\u0001\u0065\u0001"+
    "\u0075\u0001\u006c\u0001\uffff\u0001\u007d\u0001\uffff\u0001\u002e\u0001"+
    "\uffff\u0001\u002e\u0008\uffff\u0003\uffff\u0001\u007a\u0001\uffff\u0001"+
    "\u007a\u0001\u006c\u0001\u0072\u0002\u006b\u0003\u007a\u0001\u0072\u0001"+
    "\u0065\u0001\u0073\u0001\u0066\u0008\uffff\u0003\uffff\u0001\u005b\u0002"+
    "\uffff\u0001\u005d\u0001\u005c\u0003\uffff\u0002\u002e\u0002\uffff\u0002"+
    "\uffff\u0002\u007a\u0001\u0075\u0001\u007a\u0003\uffff\u0001\u0061\u0001"+
    "\u007a\u0001\u0065\u0001\u0066\u0001\uffff\u0001\u007a\u0001\u002e\u0004"+
    "\uffff\u0001\uffff\u0001\u002e\u0002\uffff\u0001\u0070\u0001\uffff\u0001"+
    "\u0074\u0001\uffff\u0001\u007a\u0001\u0066\u0008\uffff\u0001\u007a\u0005"+
    "\uffff\u0001\u007a\u0001\u0065\u0001\uffff\u0001\u0066\u0001\uffff\u0001"+
    "\uffff\u0007\uffff\u0001\u005c\u0002\uffff\u0001\u002e\u0005\uffff\u0001"+
    "\uffff\u0001\u007a\u0004\uffff\u0001\uffff\u0004\uffff\u0001\u005d\u0006"+
    "\uffff\u0001\uffff\u0001\uffff\u0001\uffff\u000e\uffff",
    DFA34_acceptS:
        "\u0001\uffff\u0001\u0001\u0001\u0002\u0002\uffff\u0001\u0007\u0001"+
    "\u0008\u0003\uffff\u0001\u000d\u0001\u000e\u0001\u000f\u0001\u0010\u0001"+
    "\uffff\u0001\u0012\u0001\u0013\u0001\uffff\u0001\u0015\u000a\uffff\u0001"+
    "\u0024\u0001\uffff\u0001\u0028\u0001\u0029\u0001\uffff\u0001\u002a\u0001"+
    "\u0006\u0001\u0003\u0001\u0005\u0001\u0004\u0001\u000c\u0001\u0009\u0001"+
    "\u0025\u0001\u000a\u0001\u000b\u0001\u0011\u0009\uffff\u0001\u0014\u0001"+
    "\u0027\u000d\uffff\u0001\u0026\u000d\uffff\u0001\u002f\u0001\u0030\u0001"+
    "\u0016\u0001\uffff\u0001\u0023\u0014\uffff\u0001\u002c\u0001\u002b\u0001"+
    "\u002d\u000c\uffff\u0001\u0017\u0001\u0018\u0004\uffff\u0001\u001b\u0001"+
    "\u001c\u0001\u0022\u000b\uffff\u0001\u002e\u0001\uffff\u0001\u001f\u0001"+
    "\u0019\u0001\uffff\u0001\u001d\u0001\uffff\u0001\u0020\u0012\uffff\u0001"+
    "\u0021\u0002\uffff\u0001\u002e\u0010\uffff\u0001\u001a\u0005\uffff\u0001"+
    "\u002e\u000b\uffff\u0001\u001e\u0001\uffff\u0001\u002e\u000e\uffff",
    DFA34_specialS:
        "\u000e\uffff\u0001\u005b\u0012\uffff\u0001\u0001\u000b\uffff\u0001"+
    "\u0041\u0001\u0043\u0001\u0046\u0001\u0042\u0001\u005a\u0001\u0037\u0001"+
    "\u0029\u0001\u004a\u0012\uffff\u0001\u0060\u0001\uffff\u0001\u0044\u0001"+
    "\uffff\u0001\u0048\u0001\u0049\u0001\u0036\u0001\u003a\u0001\u0045\u0001"+
    "\u0005\u0001\u001a\u0001\u0004\u0011\uffff\u0001\u000f\u0001\u0014\u0001"+
    "\u0018\u0001\u001c\u0001\u0020\u0001\u002a\u0001\u002b\u0001\u0031\u0004"+
    "\uffff\u0001\u003f\u0001\u0040\u0002\uffff\u0001\u0032\u0001\u005e\u0001"+
    "\u0000\u0002\uffff\u0001\u001f\u0001\u005d\u000d\uffff\u0001\u0056\u0002"+
    "\uffff\u0001\u0059\u0001\u005c\u0001\u000c\u0001\u0011\u000a\uffff\u0001"+
    "\u0024\u0001\u0025\u0001\u0028\u0001\u0026\u0001\u002f\u0001\u001b\u0001"+
    "\u0013\u0001\u005f\u0001\uffff\u0001\u003b\u0001\u0012\u0001\u0022\u0001"+
    "\u0038\u0001\u0047\u0004\uffff\u0001\u0055\u0001\uffff\u0001\u0057\u0001"+
    "\u0058\u0001\u004c\u0001\u0009\u0001\u0054\u0001\u0034\u0001\u0033\u0001"+
    "\uffff\u0001\u0030\u0001\u004d\u0001\uffff\u0001\u001d\u0001\u001e\u0001"+
    "\u0010\u0001\u000a\u0001\u0019\u0002\uffff\u0001\u003d\u0001\u0051\u0001"+
    "\u0053\u0001\u0003\u0001\uffff\u0001\u003e\u0001\u002e\u0001\u002c\u0001"+
    "\u002d\u0001\uffff\u0001\u0023\u0001\u0035\u0001\u0016\u0001\u0017\u0001"+
    "\u0002\u0001\u0039\u0001\uffff\u0001\u0008\u0001\uffff\u0001\u004b\u0001"+
    "\u0007\u0001\u0052\u0001\u003c\u0001\u0027\u0001\u004f\u0001\u0050\u0001"+
    "\u0015\u0001\u0006\u0001\u0021\u0001\u000e\u0001\u000b\u0001\u000d\u0001"+
    "\u004e}>",
    DFA34_transitionS: [
            "\u0002\u001d\u0001\uffff\u0002\u001d\u0012\uffff\u0001\u001d"+
            "\u0001\u0002\u0001\u0021\u0001\u0020\u0001\uffff\u0001\u0009"+
            "\u0001\uffff\u0001\u0022\u0001\u000c\u0001\u000d\u0001\u0007"+
            "\u0001\u0005\u0001\u0010\u0001\u0006\u0001\u0011\u0001\u0008"+
            "\u000a\u001e\u0001\u000b\u0001\u0012\u0001\u0003\u0001\u0001"+
            "\u0001\u0004\u0002\uffff\u0001\u0014\u0001\u001f\u0001\u0016"+
            "\u0002\u001f\u0001\u001c\u0002\u001f\u0001\u001a\u0002\u001f"+
            "\u0001\u0017\u0001\u001f\u0001\u0015\u0001\u0013\u0003\u001f"+
            "\u0001\u0018\u0001\u001b\u0004\u001f\u0001\u0019\u0001\u001f"+
            "\u0001\u000e\u0001\uffff\u0001\u000f\u0001\uffff\u0001\u001f"+
            "\u0001\uffff\u0001\u0014\u0001\u001f\u0001\u0016\u0002\u001f"+
            "\u0001\u001c\u0002\u001f\u0001\u001a\u0002\u001f\u0001\u0017"+
            "\u0001\u001f\u0001\u0015\u0001\u0013\u0003\u001f\u0001\u0018"+
            "\u0001\u001b\u0004\u001f\u0001\u0019\u0001\u001f\u0001\uffff"+
            "\u0001\u000a",
            "",
            "",
            "\u0001\u0023",
            "\u0001\u0025",
            "",
            "",
            "\u0001\u0027",
            "\u0001\u0029",
            "\u0001\u001f\u000b\uffff\u0001\u001f\u0013\uffff\u0001\u001f"+
            "\u000b\uffff\u0001\u001f",
            "",
            "",
            "",
            "",
            "\u000a\u0034\u0001\uffff\u0017\u0034\u0001\u0030\u0001\u0032"+
            "\u0003\u0034\u0001\u0033\u0005\u0034\u0002\u0031\u0001\u0034"+
            "\u000b\u0031\u0005\u0034\u0001\u0032\u001a\u0031\u0002\u0034"+
            "\u0001\u0035\u0001\u0034\u0001\u0031\u0001\u0034\u0003\u0031"+
            "\u0001\u002d\u0003\u0031\u0001\u002e\u0007\u0031\u0001\u002f"+
            "\u000a\u0031\uff85\u0034",
            "",
            "",
            "\u000a\u0037",
            "",
            "\u0001\u0038\u001f\uffff\u0001\u0038",
            "\u0001\u0039\u001f\uffff\u0001\u0039",
            "\u0001\u003a\u0005\uffff\u0001\u003b\u0019\uffff\u0001\u003a"+
            "\u0005\uffff\u0001\u003b",
            "\u0001\u003c\u001f\uffff\u0001\u003c",
            "\u0001\u003e\u0005\uffff\u0001\u003d\u0019\uffff\u0001\u003e"+
            "\u0005\uffff\u0001\u003d",
            "\u0001\u003f\u001f\uffff\u0001\u003f",
            "\u0001\u0041\u0009\uffff\u0001\u0040\u0015\uffff\u0001\u0041"+
            "\u0009\uffff\u0001\u0040",
            "\u0001\u0042\u001f\uffff\u0001\u0042",
            "\u0001\u0043\u001f\uffff\u0001\u0043",
            "\u0001\u0044\u001f\uffff\u0001\u0044",
            "",
            "\u0001\u0037\u0001\uffff\u000a\u001e\u000b\uffff\u0001\u0037"+
            "\u001f\uffff\u0001\u0037",
            "",
            "",
            "\u0022\u0047\u0001\u0048\u0039\u0047\u0001\u0046\uffa3\u0047",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "\u000a\u0034\u0001\uffff\u0022\u0034\u0002\u0031\u0001\u0049"+
            "\u000b\u0031\u0006\u0034\u001a\u0031\u0002\u0034\u0001\u004a"+
            "\u0001\u0034\u0001\u0031\u0001\u0034\u001a\u0031\uff85\u0034",
            "\u000a\u0034\u0001\uffff\u0022\u0034\u0002\u0031\u0001\u004b"+
            "\u000b\u0031\u0006\u0034\u001a\u0031\u0002\u0034\u0001\u004a"+
            "\u0001\u0034\u0001\u0031\u0001\u0034\u001a\u0031\uff85\u0034",
            "\u000a\u0034\u0001\uffff\u0022\u0034\u0002\u0031\u0001\u004c"+
            "\u000b\u0031\u0006\u0034\u001a\u0031\u0002\u0034\u0001\u004a"+
            "\u0001\u0034\u0001\u0031\u0001\u0034\u001a\u0031\uff85\u0034",
            "\u000a\u004f\u0001\uffff\u0017\u004f\u0001\u0034\u0039\u004f"+
            "\u0001\u004d\u0001\u004e\uffa2\u004f",
            "\u000a\u0034\u0001\uffff\u0022\u0034\u0002\u0031\u0001\u0034"+
            "\u000b\u0031\u0006\u0034\u001a\u0031\u0002\u0034\u0001\u004a"+
            "\u0001\u0034\u0001\u0031\u0001\u0034\u001a\u0031\uff85\u0034",
            "\u000a\u0050\u0001\u0051\u0021\u0050\u0001\u0034\u0001\u0050"+
            "\u0001\u0034\u002c\u0050\u0001\u0034\u0001\u0050\u0001\u0035"+
            "\u001d\u0050\u0001\u0034\u0001\u0050\u0001\u0034\uff82\u0050",
            "\u000a\u0034\u0001\uffff\u0036\u0034\u001a\u0052\u0002\u0034"+
            "\u0001\u0035\u0003\u0034\u001a\u0052\uff85\u0034",
            "\u000a\u0034\u0001\uffff\u0052\u0034\u0001\u0035\uffa2\u0034",
            "\u0001\u0054",
            "",
            "",
            "\u000a\u001f\u0007\uffff\u001a\u001f\u0004\uffff\u0001\u001f"+
            "\u0001\uffff\u001a\u001f",
            "\u0001\u0056\u001f\uffff\u0001\u0056",
            "\u000a\u001f\u0007\uffff\u0013\u001f\u0001\u0058\u0006\u001f"+
            "\u0004\uffff\u0001\u001f\u0001\uffff\u0013\u001f\u0001\u0058"+
            "\u0006\u001f",
            "\u0001\u0059\u001f\uffff\u0001\u0059",
            "\u0001\u005a\u001f\uffff\u0001\u005a",
            "\u0001\u005b\u001f\uffff\u0001\u005b",
            "\u0001\u005c\u001f\uffff\u0001\u005c",
            "\u0001\u005d\u001f\uffff\u0001\u005d",
            "\u0001\u005e\u001f\uffff\u0001\u005e",
            "\u0001\u005f\u001f\uffff\u0001\u005f",
            "\u0001\u0060\u001f\uffff\u0001\u0060",
            "\u0001\u0061\u001f\uffff\u0001\u0061",
            "\u0001\u0062\u001f\uffff\u0001\u0062",
            "",
            "\u0001\u0069\u0001\uffff\u0001\u006c\u0002\uffff\u0001\u006a"+
            "\u0004\u006c\u0002\uffff\u0001\u006c\u0002\uffff\u0001\u006c"+
            "\u000d\uffff\u0001\u006c\u0004\uffff\u0001\u006c\u000e\uffff"+
            "\u0001\u006c\u0003\uffff\u0001\u006c\u0003\uffff\u0001\u006c"+
            "\u0001\u006b\u0002\u006c\u0003\uffff\u0001\u0064\u0001\uffff"+
            "\u0001\u006c\u0001\uffff\u0001\u0067\u0007\uffff\u0001\u0066"+
            "\u0003\uffff\u0001\u0068\u0001\u006c\u0001\u0065\u0001\u0063"+
            "\u0001\uffff\u0001\u006c\u0003\uffff\u0003\u006c",
            "\u0022\u0047\u0001\u0048\u0039\u0047\u0001\u0046\uffa3\u0047",
            "\u0001\u006d",
            "\u000a\u0034\u0001\uffff\u0017\u0034\u0001\u0030\u000a\u0034"+
            "\u0002\u0031\u0001\u0034\u000b\u0031\u0006\u0034\u001a\u0031"+
            "\u0002\u0034\u0001\u0035\u0001\u0034\u0001\u0031\u0001\u0034"+
            "\u001a\u0031\uff85\u0034",
            "\u0001\u006f",
            "\u000a\u0034\u0001\uffff\u0017\u0034\u0001\u0030\u000a\u0034"+
            "\u0002\u0031\u0001\u0034\u000b\u0031\u0006\u0034\u001a\u0031"+
            "\u0002\u0034\u0001\u0035\u0001\u0034\u0001\u0031\u0001\u0034"+
            "\u001a\u0031\uff85\u0034",
            "\u000a\u0034\u0001\uffff\u0017\u0034\u0001\u0030\u000a\u0034"+
            "\u0002\u0031\u0001\u0034\u000b\u0031\u0006\u0034\u001a\u0031"+
            "\u0002\u0034\u0001\u0035\u0001\u0034\u0001\u0031\u0001\u0034"+
            "\u001a\u0031\uff85\u0034",
            "\u000a\u0034\u0001\uffff\u0017\u0034\u0001\u0070\u0039\u0034"+
            "\u0001\u0071\u0001\u0035\uffa2\u0034",
            "\u000a\u0075\u0001\uffff\u0017\u0075\u0001\u0072\u000b\u0075"+
            "\u0001\u0074\u002d\u0075\u0001\u0073\uffa3\u0075",
            "\u000a\u004f\u0001\uffff\u0017\u004f\u0001\u0076\u0039\u004f"+
            "\u0001\u004d\u0001\u004e\uffa2\u004f",
            "\u000a\u0050\u0001\u0051\u0021\u0050\u0001\u0034\u0001\u0050"+
            "\u0001\u0034\u002c\u0050\u0001\u0034\u0001\u0050\u0001\u0077"+
            "\u001d\u0050\u0001\u0034\u0001\u0050\u0001\u0034\uff82\u0050",
            "\u002c\u0051\u0001\uffff\u0001\u0051\u0001\uffff\u002c\u0051"+
            "\u0001\uffff\u0001\u0051\u0001\u0078\u001d\u0051\u0001\uffff"+
            "\u0001\u0051\u0001\uffff\uff82\u0051",
            "\u000a\u0034\u0001\uffff\u001c\u0034\u0001\u007a\u0008\u0034"+
            "\u000a\u0079\u0007\u0034\u001a\u0079\u0002\u0034\u0001\u0035"+
            "\u0001\u0034\u0001\u0079\u0001\u0034\u001a\u0079\uff85\u0034",
            "",
            "",
            "",
            "\u000a\u001f\u0007\uffff\u001a\u001f\u0004\uffff\u0001\u001f"+
            "\u0001\uffff\u001a\u001f",
            "",
            "\u000a\u001f\u0007\uffff\u001a\u001f\u0004\uffff\u0001\u001f"+
            "\u0001\uffff\u001a\u001f",
            "\u0001\u007d\u001f\uffff\u0001\u007d",
            "\u0001\u007e\u001f\uffff\u0001\u007e",
            "\u0001\u007f\u001f\uffff\u0001\u007f",
            "\u0001\u0080\u001f\uffff\u0001\u0080",
            "\u000a\u001f\u0007\uffff\u001a\u001f\u0004\uffff\u0001\u001f"+
            "\u0001\uffff\u001a\u001f",
            "\u000a\u001f\u0007\uffff\u001a\u001f\u0004\uffff\u0001\u001f"+
            "\u0001\uffff\u001a\u001f",
            "\u000a\u001f\u0007\uffff\u001a\u001f\u0004\uffff\u0001\u001f"+
            "\u0001\uffff\u001a\u001f",
            "\u0001\u0084\u001f\uffff\u0001\u0084",
            "\u0001\u0085\u001f\uffff\u0001\u0085",
            "\u0001\u0086\u001f\uffff\u0001\u0086",
            "\u000a\u0087\u0007\uffff\u0006\u0087\u001a\uffff\u0006\u0087",
            "\u0022\u0047\u0001\u0048\u0039\u0047\u0001\u0046\uffa3\u0047",
            "\u0022\u0047\u0001\u0048\u0039\u0047\u0001\u0046\uffa3\u0047",
            "\u0022\u0047\u0001\u0048\u0039\u0047\u0001\u0046\uffa3\u0047",
            "\u0022\u0047\u0001\u0048\u0039\u0047\u0001\u0046\uffa3\u0047",
            "\u0022\u0047\u0001\u0048\u0039\u0047\u0001\u0046\uffa3\u0047",
            "\u0022\u0047\u0001\u0048\u0039\u0047\u0001\u0046\uffa3\u0047",
            "\u0022\u0047\u0001\u0048\u0039\u0047\u0001\u0046\uffa3\u0047",
            "\u0022\u0047\u0001\u0048\u0039\u0047\u0001\u0046\uffa3\u0047",
            "",
            "",
            "",
            "\u0001\u0088",
            "\u000a\u004f\u0001\uffff\u0017\u004f\u0001\u0076\u0039\u004f"+
            "\u0001\u004d\u0001\u004e\uffa2\u004f",
            "\u000a\u004f\u0001\uffff\u0017\u004f\u0001\u0076\u0039\u004f"+
            "\u0001\u004d\u0001\u004e\uffa2\u004f",
            "\u0001\u0089\u0022\uffff\u0001\u008a",
            "\u0001\u008b\u0039\uffff\u0001\u008c",
            "\u000a\u0075\u0001\uffff\u0017\u0075\u0001\u0072\u0038\u0075"+
            "\u0001\u008d\u0001\u0073\uffa3\u0075",
            "\u000a\u0075\u0001\uffff\u0017\u0075\u0001\u0072\u0039\u0075"+
            "\u0001\u0073\uffa3\u0075",
            "\u000a\u0034\u0001\uffff\u002f\u0034\u0001\u008e\u0022\u0034"+
            "\u0001\u004a\uffa2\u0034",
            "\u0001\u006f",
            "\u0001\u008f",
            "\u000a\u0034\u0001\uffff\u001c\u0034\u0001\u007a\u0008\u0034"+
            "\u000a\u0079\u0007\u0034\u001a\u0079\u0002\u0034\u0001\u0035"+
            "\u0001\u0034\u0001\u0079\u0001\u0034\u001a\u0079\uff85\u0034",
            "\u000a\u0034\u0001\uffff\u0052\u0034\u0001\u0090\uffa2\u0034",
            "",
            "",
            "\u000a\u001f\u0007\uffff\u001a\u001f\u0004\uffff\u0001\u001f"+
            "\u0001\uffff\u001a\u001f",
            "\u000a\u001f\u0007\uffff\u001a\u001f\u0004\uffff\u0001\u001f"+
            "\u0001\uffff\u001a\u001f",
            "\u0001\u0093\u001f\uffff\u0001\u0093",
            "\u000a\u001f\u0007\uffff\u001a\u001f\u0004\uffff\u0001\u001f"+
            "\u0001\uffff\u001a\u001f",
            "",
            "",
            "",
            "\u0001\u0095\u001f\uffff\u0001\u0095",
            "\u000a\u001f\u0007\uffff\u001a\u001f\u0004\uffff\u0001\u001f"+
            "\u0001\uffff\u001a\u001f",
            "\u0001\u0097\u001f\uffff\u0001\u0097",
            "\u000a\u0098\u0007\uffff\u0006\u0098\u001a\uffff\u0006\u0098",
            "\u000a\u0054\u0001\uffff\u0017\u0054\u0001\u009c\u0001\u009e"+
            "\u0003\u0054\u0001\u009f\u0005\u0054\u0002\u009d\u0001\u0054"+
            "\u000b\u009d\u0005\u0054\u0001\u009e\u001a\u009d\u0004\u0054"+
            "\u0001\u009d\u0001\u0054\u0003\u009d\u0001\u0099\u0003\u009d"+
            "\u0001\u009a\u0007\u009d\u0001\u009b\u000a\u009d\uff85\u0054",
            "\u0001\u00a0\u000a\uffff\u0002\u00a1\u0001\uffff\u000b\u00a1"+
            "\u0006\uffff\u001a\u00a1\u0004\uffff\u0001\u00a1\u0001\uffff"+
            "\u001a\u00a1",
            "\u0001\u008f",
            "\u000a\u0075\u0001\uffff\u0017\u0075\u0001\u0072\u0039\u0075"+
            "\u0001\u0073\uffa3\u0075",
            "\u000a\u0075\u0001\uffff\u0017\u0075\u0001\u0072\u0039\u0075"+
            "\u0001\u0073\uffa3\u0075",
            "\u000a\u00a4\u0001\uffff\u0017\u00a4\u0001\u00a2\u0039\u00a4"+
            "\u0001\u00a3\u0001\u00a5\uffa2\u00a4",
            "\u000a\u0034\u0001\uffff\u0017\u0034\u0001\u00a6\u000a\u0034"+
            "\u0002\u0031\u0001\u0034\u000b\u0031\u0006\u0034\u001a\u0031"+
            "\u0002\u0034\u0001\u0035\u0001\u0034\u0001\u0031\u0001\u0034"+
            "\u001a\u0031\uff85\u0034",
            "",
            "\u0001\u006f",
            "",
            "",
            "\u0001\u00a7\u001f\uffff\u0001\u00a7",
            "",
            "\u0001\u00a8\u001f\uffff\u0001\u00a8",
            "",
            "\u000a\u001f\u0007\uffff\u001a\u001f\u0004\uffff\u0001\u001f"+
            "\u0001\uffff\u001a\u001f",
            "\u000a\u00aa\u0007\uffff\u0006\u00aa\u001a\uffff\u0006\u00aa",
            "\u000a\u0054\u0001\uffff\u0022\u0054\u0002\u009d\u0001\u00ab"+
            "\u000b\u009d\u0006\u0054\u001a\u009d\u0002\u0054\u0001\u00ac"+
            "\u0001\u0054\u0001\u009d\u0001\u0054\u001a\u009d\uff85\u0054",
            "\u000a\u0054\u0001\uffff\u0022\u0054\u0002\u009d\u0001\u00ad"+
            "\u000b\u009d\u0006\u0054\u001a\u009d\u0002\u0054\u0001\u00ac"+
            "\u0001\u0054\u0001\u009d\u0001\u0054\u001a\u009d\uff85\u0054",
            "\u000a\u0054\u0001\uffff\u0022\u0054\u0002\u009d\u0001\u00ae"+
            "\u000b\u009d\u0006\u0054\u001a\u009d\u0002\u0054\u0001\u00ac"+
            "\u0001\u0054\u0001\u009d\u0001\u0054\u001a\u009d\uff85\u0054",
            "\u000a\u00b1\u0001\uffff\u0017\u00b1\u0001\u0054\u0039\u00b1"+
            "\u0001\u00af\u0001\u00b0\uffa2\u00b1",
            "\u000a\u0054\u0001\uffff\u0022\u0054\u0002\u009d\u0001\u0054"+
            "\u000b\u009d\u0006\u0054\u001a\u009d\u0002\u0054\u0001\u00ac"+
            "\u0001\u0054\u0001\u009d\u0001\u0054\u001a\u009d\uff85\u0054",
            "\u000a\u00b2\u0001\u008f\u0021\u00b2\u0001\u0054\u0001\u00b2"+
            "\u0001\u0054\u002c\u00b2\u0001\u0054\u0001\u00b2\u0001\u0054"+
            "\u001d\u00b2\u0001\u0054\u0001\u00b2\u0001\u0054\uff82\u00b2",
            "\u000a\u0054\u0001\uffff\u0036\u0054\u001a\u00b3\u0006\u0054"+
            "\u001a\u00b3\uff85\u0054",
            "\u000a\u00b5\u0001\uffff\u0017\u00b5\u0001\uffff\u0039\u00b5"+
            "\u0001\u00b4\uffa3\u00b5",
            "\u0002\u00a1\u0001\uffff\u000b\u00a1\u0006\uffff\u001a\u00a1"+
            "\u0002\uffff\u0001\u008a\u0001\uffff\u0001\u00a1\u0001\uffff"+
            "\u001a\u00a1",
            "\u000a\u0054\u0001\uffff\u002f\u0054\u0001\u00b6\u0022\u0054"+
            "\u0001\u00b7\uffa2\u0054",
            "\u000a\u0054\u0001\uffff\u0017\u0054\u0001\u00b8\u0039\u0054"+
            "\u0001\u00b9\uffa3\u0054",
            "\u000a\u00a4\u0001\uffff\u0017\u00a4\u0001\u00a2\u0039\u00a4"+
            "\u0001\u00a3\u0001\u00a5\uffa2\u00a4",
            "\u000a\u0075\u0001\uffff\u0017\u0075\u0001\u0072\u0039\u0075"+
            "\u0001\u0073\uffa3\u0075",
            "\u000a\u00bc\u0001\uffff\u0017\u00bc\u0001\u0034\u0039\u00bc"+
            "\u0001\u00ba\u0001\u00bb\uffa2\u00bc",
            "\u000a\u001f\u0007\uffff\u001a\u001f\u0004\uffff\u0001\u001f"+
            "\u0001\uffff\u001a\u001f",
            "\u0001\u00be\u001f\uffff\u0001\u00be",
            "",
            "\u000a\u00bf\u0007\uffff\u0006\u00bf\u001a\uffff\u0006\u00bf",
            "\u000a\u0054\u0001\uffff\u0017\u0054\u0001\u009c\u000a\u0054"+
            "\u0002\u009d\u0001\u0054\u000b\u009d\u0006\u0054\u001a\u009d"+
            "\u0004\u0054\u0001\u009d\u0001\u0054\u001a\u009d\uff85\u0054",
            "",
            "\u000a\u0054\u0001\uffff\u0017\u0054\u0001\u009c\u000a\u0054"+
            "\u0002\u009d\u0001\u0054\u000b\u009d\u0006\u0054\u001a\u009d"+
            "\u0004\u0054\u0001\u009d\u0001\u0054\u001a\u009d\uff85\u0054",
            "\u000a\u0054\u0001\uffff\u0017\u0054\u0001\u009c\u000a\u0054"+
            "\u0002\u009d\u0001\u0054\u000b\u009d\u0006\u0054\u001a\u009d"+
            "\u0004\u0054\u0001\u009d\u0001\u0054\u001a\u009d\uff85\u0054",
            "\u000a\u0054\u0001\uffff\u0017\u0054\u0001\u00c0\u0039\u0054"+
            "\u0001\u00c1\uffa3\u0054",
            "\u000a\u008f\u0001\uffff\ufff5\u008f",
            "\u000a\u00b1\u0001\uffff\u0017\u00b1\u0001\u00c2\u0039\u00b1"+
            "\u0001\u00af\u0001\u00b0\uffa2\u00b1",
            "\u000a\u00b2\u0001\u008f\u0021\u00b2\u0001\u0054\u0001\u00b2"+
            "\u0001\u0054\u002c\u00b2\u0001\u0054\u0001\u00b2\u0001\u00c3"+
            "\u001d\u00b2\u0001\u0054\u0001\u00b2\u0001\u0054\uff82\u00b2",
            "\u000a\u0054\u0001\uffff\u001c\u0054\u0001\u00c5\u0008\u0054"+
            "\u000a\u00c4\u0007\u0054\u001a\u00c4\u0004\u0054\u0001\u00c4"+
            "\u0001\u0054\u001a\u00c4\uff85\u0054",
            "\u0001\u00c6\u0039\uffff\u0001\u00c7",
            "\u000a\u00b5\u0001\uffff\u0017\u00b5\u0001\u00c8\u0039\u00b5"+
            "\u0001\u00b4\uffa3\u00b5",
            "\u000a\u0054\u0001\uffff\u0017\u0054\u0001\u00c9\u000a\u0054"+
            "\u0002\u00ca\u0001\u0054\u000b\u00ca\u0006\u0054\u001a\u00ca"+
            "\u0004\u0054\u0001\u00ca\u0001\u0054\u001a\u00ca\uff85\u0054",
            "\u0001\u008f",
            "\u000a\u00a4\u0001\uffff\u0017\u00a4\u0001\u00a2\u0039\u00a4"+
            "\u0001\u00a3\u0001\u00a5\uffa2\u00a4",
            "\u000a\u00a4\u0001\uffff\u0017\u00a4\u0001\u00a2\u0039\u00a4"+
            "\u0001\u00a3\u0001\u00a5\uffa2\u00a4",
            "\u000a\u0034\u0001\uffff\u0017\u0034\u0001\u00cb\u0039\u0034"+
            "\u0001\u00cc\u0001\u0035\uffa2\u0034",
            "\u000a\u00b5\u0001\uffff\u0017\u00b5\u0001\u00c8\u000b\u00b5"+
            "\u0001\u00cd\u002d\u00b5\u0001\u00b4\uffa3\u00b5",
            "\u000a\u00bc\u0001\uffff\u0017\u00bc\u0001\u00ce\u0039\u00bc"+
            "\u0001\u00ba\u0001\u00bb\uffa2\u00bc",
            "",
            "\u000a\u001f\u0007\uffff\u001a\u001f\u0004\uffff\u0001\u001f"+
            "\u0001\uffff\u001a\u001f",
            "\u0022\u0047\u0001\u0048\u0039\u0047\u0001\u0046\uffa3\u0047",
            "\u000a\u00b1\u0001\uffff\u0017\u00b1\u0001\u00c2\u0039\u00b1"+
            "\u0001\u00af\u0001\u00b0\uffa2\u00b1",
            "\u000a\u00b1\u0001\uffff\u0017\u00b1\u0001\u00c2\u0039\u00b1"+
            "\u0001\u00af\u0001\u00b0\uffa2\u00b1",
            "\u000a\u0054\u0001\uffff\u002f\u0054\u0001\u00d0\u0022\u0054"+
            "\u0001\u00ac\uffa2\u0054",
            "",
            "\u000a\u0054\u0001\uffff\u001c\u0054\u0001\u00c5\u0008\u0054"+
            "\u000a\u00c4\u0007\u0054\u001a\u00c4\u0004\u0054\u0001\u00c4"+
            "\u0001\u0054\u001a\u00c4\uff85\u0054",
            "\u000a\u0054\u0001\uffff\u0052\u0054\u0001\u00d1\uffa2\u0054",
            "\u000a\u00b5\u0001\uffff\u0017\u00b5\u0001\u00c8\u0039\u00b5"+
            "\u0001\u00b4\uffa3\u00b5",
            "\u000a\u00b5\u0001\uffff\u0017\u00b5\u0001\u00c8\u0039\u00b5"+
            "\u0001\u00b4\uffa3\u00b5",
            "\u0001\u008a",
            "\u000a\u00d4\u0001\uffff\u0017\u00d4\u0001\u0054\u0039\u00d4"+
            "\u0001\u00d2\u0001\u00d3\uffa2\u00d4",
            "\u000a\u0054\u0001\uffff\u0022\u0054\u0002\u00ca\u0001\u0054"+
            "\u000b\u00ca\u0006\u0054\u001a\u00ca\u0002\u0054\u0001\u00b7"+
            "\u0001\u0054\u0001\u00ca\u0001\u0054\u001a\u00ca\uff85\u0054",
            "\u000a\u00bc\u0001\uffff\u0017\u00bc\u0001\u00ce\u0039\u00bc"+
            "\u0001\u00ba\u0001\u00bb\uffa2\u00bc",
            "\u000a\u00bc\u0001\uffff\u0017\u00bc\u0001\u00ce\u0039\u00bc"+
            "\u0001\u00ba\u0001\u00bb\uffa2\u00bc",
            "\u000a\u00b5\u0001\uffff\u0017\u00b5\u0001\u00c8\u0038\u00b5"+
            "\u0001\u00d5\u0001\u00b4\uffa3\u00b5",
            "\u000a\u0034\u0001\uffff\u0052\u0034\u0001\u004a\uffa2\u0034",
            "",
            "\u000a\u0054\u0001\uffff\u0017\u0054\u0001\u00d6\u000a\u0054"+
            "\u0002\u009d\u0001\u0054\u000b\u009d\u0006\u0054\u001a\u009d"+
            "\u0004\u0054\u0001\u009d\u0001\u0054\u001a\u009d\uff85\u0054",
            "",
            "\u000a\u0054\u0001\uffff\u0017\u0054\u0001\u00d7\u0039\u0054"+
            "\u0001\u00d8\uffa3\u0054",
            "\u000a\u00b5\u0001\uffff\u0017\u00b5\u0001\u00c8\u0039\u00b5"+
            "\u0001\u00b4\uffa3\u00b5",
            "\u000a\u00d4\u0001\uffff\u0017\u00d4\u0001\u00d9\u0039\u00d4"+
            "\u0001\u00d2\u0001\u00d3\uffa2\u00d4",
            "\u000a\u00d4\u0001\uffff\u0017\u00d4\u0001\u00d9\u0039\u00d4"+
            "\u0001\u00d2\u0001\u00d3\uffa2\u00d4",
            "\u000a\u00dc\u0001\uffff\u0017\u00dc\u0001\u0054\u0039\u00dc"+
            "\u0001\u00da\u0001\u00db\uffa2\u00dc",
            "\u000a\u00d4\u0001\uffff\u0017\u00d4\u0001\u00d9\u0039\u00d4"+
            "\u0001\u00d2\u0001\u00d3\uffa2\u00d4",
            "\u000a\u00d4\u0001\uffff\u0017\u00d4\u0001\u00d9\u0039\u00d4"+
            "\u0001\u00d2\u0001\u00d3\uffa2\u00d4",
            "\u000a\u0054\u0001\uffff\u0052\u0054\u0001\u00b7\uffa2\u0054",
            "\u000a\u0054\u0001\uffff\u0017\u0054\u0001\u00dd\u0039\u0054"+
            "\u0001\u00de\uffa3\u0054",
            "\u000a\u008f\u0001\uffff\ufff5\u008f",
            "\u000a\u00dc\u0001\uffff\u0017\u00dc\u0001\u00df\u0039\u00dc"+
            "\u0001\u00da\u0001\u00db\uffa2\u00dc",
            "\u000a\u00dc\u0001\uffff\u0017\u00dc\u0001\u00df\u0039\u00dc"+
            "\u0001\u00da\u0001\u00db\uffa2\u00dc",
            "\u000a\u00dc\u0001\uffff\u0017\u00dc\u0001\u00df\u0039\u00dc"+
            "\u0001\u00da\u0001\u00db\uffa2\u00dc",
            "\u000a\u0054\u0001\uffff\u0052\u0054\u0001\u00ac\uffa2\u0054"
    ]
});

org.antlr.lang.augmentObject(HiloLexer, {
    DFA34_eot:
        org.antlr.runtime.DFA.unpackEncodedString(HiloLexer.DFA34_eotS),
    DFA34_eof:
        org.antlr.runtime.DFA.unpackEncodedString(HiloLexer.DFA34_eofS),
    DFA34_min:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(HiloLexer.DFA34_minS),
    DFA34_max:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(HiloLexer.DFA34_maxS),
    DFA34_accept:
        org.antlr.runtime.DFA.unpackEncodedString(HiloLexer.DFA34_acceptS),
    DFA34_special:
        org.antlr.runtime.DFA.unpackEncodedString(HiloLexer.DFA34_specialS),
    DFA34_transition: (function() {
        var a = [],
            i,
            numStates = HiloLexer.DFA34_transitionS.length;
        for (i=0; i<numStates; i++) {
            a.push(org.antlr.runtime.DFA.unpackEncodedString(HiloLexer.DFA34_transitionS[i]));
        }
        return a;
    })()
});

HiloLexer.DFA34 = function(recognizer) {
    this.recognizer = recognizer;
    this.decisionNumber = 34;
    this.eot = HiloLexer.DFA34_eot;
    this.eof = HiloLexer.DFA34_eof;
    this.min = HiloLexer.DFA34_min;
    this.max = HiloLexer.DFA34_max;
    this.accept = HiloLexer.DFA34_accept;
    this.special = HiloLexer.DFA34_special;
    this.transition = HiloLexer.DFA34_transition;
};

org.antlr.lang.extend(HiloLexer.DFA34, org.antlr.runtime.DFA, {
    getDescription: function() {
        return "1:1: Tokens : ( EQ | NEQ | LT | GT | GTE | LTE | PLUS | MINUS | MULT | DIV | REM | POW | PIPE | ASSIGN | LPAR | RPAR | LBRA | RBRA | COMMA | DOT | SEMICOLON | OR | AND | NOT | CAGR | LOOKUP | SMA | YOY | LINK | ITERATE | NULL | TRUE | FALSE | YES | NO | WHITESPACE | COMMENT | INTEGER | DOUBLE | IDENTIFIER | DATE_TIME | STRING | DOT_SEP_STRING | DQ_ALLOW_ESC_REGEX_STRING | FIELD | ATTRIBUTE | MEASURE_FIELD | OLD_ATTRIBUTE );";
    },
    specialStateTransition: function(s, input) {
        var _s = s;
        /* bind to recognizer so semantic predicates can be evaluated */
        var retval = (function(s, input) {
            switch ( s ) {
                        case 0 :
                            var LA34_118 = input.LA(1);

                            s = -1;
                            if ( (LA34_118==':') ) {s = 142;}

                            else if ( (LA34_118==']') ) {s = 74;}

                            else if ( ((LA34_118>='\u0000' && LA34_118<='\t')||(LA34_118>='\u000B' && LA34_118<='9')||(LA34_118>=';' && LA34_118<='\\')||(LA34_118>='^' && LA34_118<='\uFFFF')) ) {s = 52;}

                            if ( s>=0 ) return s;
                            break;
                        case 1 :
                            var LA34_33 = input.LA(1);

                            s = -1;
                            if ( (LA34_33=='\\') ) {s = 70;}

                            else if ( ((LA34_33>='\u0000' && LA34_33<='!')||(LA34_33>='#' && LA34_33<='[')||(LA34_33>=']' && LA34_33<='\uFFFF')) ) {s = 71;}

                            else if ( (LA34_33=='\"') ) {s = 72;}

                            if ( s>=0 ) return s;
                            break;
                        case 2 :
                            var LA34_205 = input.LA(1);

                            s = -1;
                            if ( (LA34_205=='\"') ) {s = 200;}

                            else if ( (LA34_205=='\\') ) {s = 180;}

                            else if ( (LA34_205=='[') ) {s = 213;}

                            else if ( ((LA34_205>='\u0000' && LA34_205<='\t')||(LA34_205>='\u000B' && LA34_205<='!')||(LA34_205>='#' && LA34_205<='Z')||(LA34_205>=']' && LA34_205<='\uFFFF')) ) {s = 181;}

                            if ( s>=0 ) return s;
                            break;
                        case 3 :
                            var LA34_194 = input.LA(1);

                            s = -1;
                            if ( (LA34_194==':') ) {s = 208;}

                            else if ( (LA34_194==']') ) {s = 172;}

                            else if ( ((LA34_194>='\u0000' && LA34_194<='\t')||(LA34_194>='\u000B' && LA34_194<='9')||(LA34_194>=';' && LA34_194<='\\')||(LA34_194>='^' && LA34_194<='\uFFFF')) ) {s = 84;}

                            if ( s>=0 ) return s;
                            break;
                        case 4 :
                            var LA34_82 = input.LA(1);

                            s = -1;
                            if ( ((LA34_82>='0' && LA34_82<='9')||(LA34_82>='A' && LA34_82<='Z')||LA34_82=='_'||(LA34_82>='a' && LA34_82<='z')) ) {s = 121;}

                            else if ( (LA34_82=='\'') ) {s = 122;}

                            else if ( (LA34_82==']') ) {s = 53;}

                            else if ( ((LA34_82>='\u0000' && LA34_82<='\t')||(LA34_82>='\u000B' && LA34_82<='&')||(LA34_82>='(' && LA34_82<='/')||(LA34_82>=':' && LA34_82<='@')||(LA34_82>='[' && LA34_82<='\\')||LA34_82=='^'||LA34_82=='`'||(LA34_82>='{' && LA34_82<='\uFFFF')) ) {s = 52;}

                            if ( s>=0 ) return s;
                            break;
                        case 5 :
                            var LA34_80 = input.LA(1);

                            s = -1;
                            if ( (LA34_80==']') ) {s = 119;}

                            else if ( ((LA34_80>='\u0000' && LA34_80<='\t')||(LA34_80>='\u000B' && LA34_80<='+')||LA34_80=='-'||(LA34_80>='/' && LA34_80<='Z')||LA34_80=='\\'||(LA34_80>='^' && LA34_80<='z')||LA34_80=='|'||(LA34_80>='~' && LA34_80<='\uFFFF')) ) {s = 80;}

                            else if ( (LA34_80=='\n') ) {s = 81;}

                            else if ( (LA34_80==','||LA34_80=='.'||LA34_80=='['||LA34_80=='{'||LA34_80=='}') ) {s = 52;}

                            if ( s>=0 ) return s;
                            break;
                        case 6 :
                            var LA34_218 = input.LA(1);

                            s = -1;
                            if ( (LA34_218=='\"') ) {s = 221;}

                            else if ( (LA34_218=='\\') ) {s = 222;}

                            else if ( ((LA34_218>='\u0000' && LA34_218<='\t')||(LA34_218>='\u000B' && LA34_218<='!')||(LA34_218>='#' && LA34_218<='[')||(LA34_218>=']' && LA34_218<='\uFFFF')) ) {s = 84;}

                            if ( s>=0 ) return s;
                            break;
                        case 7 :
                            var LA34_211 = input.LA(1);

                            s = -1;
                            if ( (LA34_211=='\"') ) {s = 200;}

                            else if ( (LA34_211=='\\') ) {s = 180;}

                            else if ( ((LA34_211>='\u0000' && LA34_211<='\t')||(LA34_211>='\u000B' && LA34_211<='!')||(LA34_211>='#' && LA34_211<='[')||(LA34_211>=']' && LA34_211<='\uFFFF')) ) {s = 181;}

                            else s = 84;

                            if ( s>=0 ) return s;
                            break;
                        case 8 :
                            var LA34_208 = input.LA(1);

                            s = -1;
                            if ( (LA34_208=='\"') ) {s = 214;}

                            else if ( ((LA34_208>='-' && LA34_208<='.')||(LA34_208>='0' && LA34_208<=':')||(LA34_208>='A' && LA34_208<='Z')||LA34_208=='_'||(LA34_208>='a' && LA34_208<='z')) ) {s = 157;}

                            else if ( ((LA34_208>='\u0000' && LA34_208<='\t')||(LA34_208>='\u000B' && LA34_208<='!')||(LA34_208>='#' && LA34_208<=',')||LA34_208=='/'||(LA34_208>=';' && LA34_208<='@')||(LA34_208>='[' && LA34_208<='^')||LA34_208=='`'||(LA34_208>='{' && LA34_208<='\uFFFF')) ) {s = 84;}

                            if ( s>=0 ) return s;
                            break;
                        case 9 :
                            var LA34_176 = input.LA(1);

                            s = -1;
                            if ( ((LA34_176>='\u0000' && LA34_176<='\t')||(LA34_176>='\u000B' && LA34_176<='\uFFFF')) ) {s = 143;}

                            else s = 84;

                            if ( s>=0 ) return s;
                            break;
                        case 10 :
                            var LA34_187 = input.LA(1);

                            s = -1;
                            if ( (LA34_187=='\"') ) {s = 200;}

                            else if ( (LA34_187=='\\') ) {s = 180;}

                            else if ( (LA34_187=='.') ) {s = 205;}

                            else if ( ((LA34_187>='\u0000' && LA34_187<='\t')||(LA34_187>='\u000B' && LA34_187<='!')||(LA34_187>='#' && LA34_187<='-')||(LA34_187>='/' && LA34_187<='[')||(LA34_187>=']' && LA34_187<='\uFFFF')) ) {s = 181;}

                            else s = 83;

                            if ( s>=0 ) return s;
                            break;
                        case 11 :
                            var LA34_221 = input.LA(1);

                            s = -1;
                            if ( (LA34_221=='\"') ) {s = 223;}

                            else if ( (LA34_221=='\\') ) {s = 218;}

                            else if ( (LA34_221==']') ) {s = 219;}

                            else if ( ((LA34_221>='\u0000' && LA34_221<='\t')||(LA34_221>='\u000B' && LA34_221<='!')||(LA34_221>='#' && LA34_221<='[')||(LA34_221>='^' && LA34_221<='\uFFFF')) ) {s = 220;}

                            if ( s>=0 ) return s;
                            break;
                        case 12 :
                            var LA34_141 = input.LA(1);

                            s = -1;
                            if ( (LA34_141=='\"') ) {s = 162;}

                            else if ( (LA34_141=='\\') ) {s = 163;}

                            else if ( ((LA34_141>='\u0000' && LA34_141<='\t')||(LA34_141>='\u000B' && LA34_141<='!')||(LA34_141>='#' && LA34_141<='[')||(LA34_141>='^' && LA34_141<='\uFFFF')) ) {s = 164;}

                            else if ( (LA34_141==']') ) {s = 165;}

                            if ( s>=0 ) return s;
                            break;
                        case 13 :
                            var LA34_222 = input.LA(1);

                            s = -1;
                            if ( (LA34_222=='\"') ) {s = 223;}

                            else if ( (LA34_222=='\\') ) {s = 218;}

                            else if ( (LA34_222==']') ) {s = 219;}

                            else if ( ((LA34_222>='\u0000' && LA34_222<='\t')||(LA34_222>='\u000B' && LA34_222<='!')||(LA34_222>='#' && LA34_222<='[')||(LA34_222>='^' && LA34_222<='\uFFFF')) ) {s = 220;}

                            if ( s>=0 ) return s;
                            break;
                        case 14 :
                            var LA34_220 = input.LA(1);

                            s = -1;
                            if ( (LA34_220=='\"') ) {s = 223;}

                            else if ( (LA34_220=='\\') ) {s = 218;}

                            else if ( (LA34_220==']') ) {s = 219;}

                            else if ( ((LA34_220>='\u0000' && LA34_220<='\t')||(LA34_220>='\u000B' && LA34_220<='!')||(LA34_220>='#' && LA34_220<='[')||(LA34_220>='^' && LA34_220<='\uFFFF')) ) {s = 220;}

                            if ( s>=0 ) return s;
                            break;
                        case 15 :
                            var LA34_100 = input.LA(1);

                            s = -1;
                            if ( (LA34_100=='\"') ) {s = 72;}

                            else if ( (LA34_100=='\\') ) {s = 70;}

                            else if ( ((LA34_100>='\u0000' && LA34_100<='!')||(LA34_100>='#' && LA34_100<='[')||(LA34_100>=']' && LA34_100<='\uFFFF')) ) {s = 71;}

                            if ( s>=0 ) return s;
                            break;
                        case 16 :
                            var LA34_186 = input.LA(1);

                            s = -1;
                            if ( (LA34_186=='\"') ) {s = 203;}

                            else if ( (LA34_186=='\\') ) {s = 204;}

                            else if ( (LA34_186==']') ) {s = 53;}

                            else if ( ((LA34_186>='\u0000' && LA34_186<='\t')||(LA34_186>='\u000B' && LA34_186<='!')||(LA34_186>='#' && LA34_186<='[')||(LA34_186>='^' && LA34_186<='\uFFFF')) ) {s = 52;}

                            if ( s>=0 ) return s;
                            break;
                        case 17 :
                            var LA34_142 = input.LA(1);

                            s = -1;
                            if ( (LA34_142=='\"') ) {s = 166;}

                            else if ( ((LA34_142>='-' && LA34_142<='.')||(LA34_142>='0' && LA34_142<=':')||(LA34_142>='A' && LA34_142<='Z')||LA34_142=='_'||(LA34_142>='a' && LA34_142<='z')) ) {s = 49;}

                            else if ( (LA34_142==']') ) {s = 53;}

                            else if ( ((LA34_142>='\u0000' && LA34_142<='\t')||(LA34_142>='\u000B' && LA34_142<='!')||(LA34_142>='#' && LA34_142<=',')||LA34_142=='/'||(LA34_142>=';' && LA34_142<='@')||(LA34_142>='[' && LA34_142<='\\')||LA34_142=='^'||LA34_142=='`'||(LA34_142>='{' && LA34_142<='\uFFFF')) ) {s = 52;}

                            if ( s>=0 ) return s;
                            break;
                        case 18 :
                            var LA34_163 = input.LA(1);

                            s = -1;
                            if ( (LA34_163=='\"') ) {s = 184;}

                            else if ( (LA34_163=='\\') ) {s = 185;}

                            else if ( ((LA34_163>='\u0000' && LA34_163<='\t')||(LA34_163>='\u000B' && LA34_163<='!')||(LA34_163>='#' && LA34_163<='[')||(LA34_163>=']' && LA34_163<='\uFFFF')) ) {s = 84;}

                            if ( s>=0 ) return s;
                            break;
                        case 19 :
                            var LA34_159 = input.LA(1);

                            s = -1;
                            if ( ((LA34_159>='A' && LA34_159<='Z')||(LA34_159>='a' && LA34_159<='z')) ) {s = 179;}

                            else if ( ((LA34_159>='\u0000' && LA34_159<='\t')||(LA34_159>='\u000B' && LA34_159<='@')||(LA34_159>='[' && LA34_159<='`')||(LA34_159>='{' && LA34_159<='\uFFFF')) ) {s = 84;}

                            if ( s>=0 ) return s;
                            break;
                        case 20 :
                            var LA34_101 = input.LA(1);

                            s = -1;
                            if ( (LA34_101=='\"') ) {s = 72;}

                            else if ( (LA34_101=='\\') ) {s = 70;}

                            else if ( ((LA34_101>='\u0000' && LA34_101<='!')||(LA34_101>='#' && LA34_101<='[')||(LA34_101>=']' && LA34_101<='\uFFFF')) ) {s = 71;}

                            if ( s>=0 ) return s;
                            break;
                        case 21 :
                            var LA34_217 = input.LA(1);

                            s = -1;
                            if ( (LA34_217==']') ) {s = 183;}

                            else if ( ((LA34_217>='\u0000' && LA34_217<='\t')||(LA34_217>='\u000B' && LA34_217<='\\')||(LA34_217>='^' && LA34_217<='\uFFFF')) ) {s = 84;}

                            if ( s>=0 ) return s;
                            break;
                        case 22 :
                            var LA34_203 = input.LA(1);

                            s = -1;
                            if ( (LA34_203=='\"') ) {s = 206;}

                            else if ( (LA34_203=='\\') ) {s = 186;}

                            else if ( (LA34_203==']') ) {s = 187;}

                            else if ( ((LA34_203>='\u0000' && LA34_203<='\t')||(LA34_203>='\u000B' && LA34_203<='!')||(LA34_203>='#' && LA34_203<='[')||(LA34_203>='^' && LA34_203<='\uFFFF')) ) {s = 188;}

                            if ( s>=0 ) return s;
                            break;
                        case 23 :
                            var LA34_204 = input.LA(1);

                            s = -1;
                            if ( (LA34_204=='\"') ) {s = 206;}

                            else if ( (LA34_204=='\\') ) {s = 186;}

                            else if ( (LA34_204==']') ) {s = 187;}

                            else if ( ((LA34_204>='\u0000' && LA34_204<='\t')||(LA34_204>='\u000B' && LA34_204<='!')||(LA34_204>='#' && LA34_204<='[')||(LA34_204>='^' && LA34_204<='\uFFFF')) ) {s = 188;}

                            if ( s>=0 ) return s;
                            break;
                        case 24 :
                            var LA34_102 = input.LA(1);

                            s = -1;
                            if ( (LA34_102=='\"') ) {s = 72;}

                            else if ( (LA34_102=='\\') ) {s = 70;}

                            else if ( ((LA34_102>='\u0000' && LA34_102<='!')||(LA34_102>='#' && LA34_102<='[')||(LA34_102>=']' && LA34_102<='\uFFFF')) ) {s = 71;}

                            if ( s>=0 ) return s;
                            break;
                        case 25 :
                            var LA34_188 = input.LA(1);

                            s = -1;
                            if ( (LA34_188=='\"') ) {s = 206;}

                            else if ( (LA34_188=='\\') ) {s = 186;}

                            else if ( (LA34_188==']') ) {s = 187;}

                            else if ( ((LA34_188>='\u0000' && LA34_188<='\t')||(LA34_188>='\u000B' && LA34_188<='!')||(LA34_188>='#' && LA34_188<='[')||(LA34_188>='^' && LA34_188<='\uFFFF')) ) {s = 188;}

                            if ( s>=0 ) return s;
                            break;
                        case 26 :
                            var LA34_81 = input.LA(1);

                            s = -1;
                            if ( (LA34_81==']') ) {s = 120;}

                            else if ( ((LA34_81>='\u0000' && LA34_81<='+')||LA34_81=='-'||(LA34_81>='/' && LA34_81<='Z')||LA34_81=='\\'||(LA34_81>='^' && LA34_81<='z')||LA34_81=='|'||(LA34_81>='~' && LA34_81<='\uFFFF')) ) {s = 81;}

                            if ( s>=0 ) return s;
                            break;
                        case 27 :
                            var LA34_158 = input.LA(1);

                            s = -1;
                            if ( ((LA34_158>='\u0000' && LA34_158<='\t')||(LA34_158>='\u000B' && LA34_158<='+')||LA34_158=='-'||(LA34_158>='/' && LA34_158<='Z')||LA34_158=='\\'||(LA34_158>='^' && LA34_158<='z')||LA34_158=='|'||(LA34_158>='~' && LA34_158<='\uFFFF')) ) {s = 178;}

                            else if ( (LA34_158==','||LA34_158=='.'||LA34_158=='['||LA34_158==']'||LA34_158=='{'||LA34_158=='}') ) {s = 84;}

                            else if ( (LA34_158=='\n') ) {s = 143;}

                            if ( s>=0 ) return s;
                            break;
                        case 28 :
                            var LA34_103 = input.LA(1);

                            s = -1;
                            if ( (LA34_103=='\"') ) {s = 72;}

                            else if ( (LA34_103=='\\') ) {s = 70;}

                            else if ( ((LA34_103>='\u0000' && LA34_103<='!')||(LA34_103>='#' && LA34_103<='[')||(LA34_103>=']' && LA34_103<='\uFFFF')) ) {s = 71;}

                            if ( s>=0 ) return s;
                            break;
                        case 29 :
                            var LA34_184 = input.LA(1);

                            s = -1;
                            if ( (LA34_184=='\"') ) {s = 162;}

                            else if ( (LA34_184=='\\') ) {s = 163;}

                            else if ( (LA34_184==']') ) {s = 165;}

                            else if ( ((LA34_184>='\u0000' && LA34_184<='\t')||(LA34_184>='\u000B' && LA34_184<='!')||(LA34_184>='#' && LA34_184<='[')||(LA34_184>='^' && LA34_184<='\uFFFF')) ) {s = 164;}

                            if ( s>=0 ) return s;
                            break;
                        case 30 :
                            var LA34_185 = input.LA(1);

                            s = -1;
                            if ( (LA34_185=='\"') ) {s = 162;}

                            else if ( (LA34_185=='\\') ) {s = 163;}

                            else if ( (LA34_185==']') ) {s = 165;}

                            else if ( ((LA34_185>='\u0000' && LA34_185<='\t')||(LA34_185>='\u000B' && LA34_185<='!')||(LA34_185>='#' && LA34_185<='[')||(LA34_185>='^' && LA34_185<='\uFFFF')) ) {s = 164;}

                            if ( s>=0 ) return s;
                            break;
                        case 31 :
                            var LA34_121 = input.LA(1);

                            s = -1;
                            if ( (LA34_121=='\'') ) {s = 122;}

                            else if ( ((LA34_121>='0' && LA34_121<='9')||(LA34_121>='A' && LA34_121<='Z')||LA34_121=='_'||(LA34_121>='a' && LA34_121<='z')) ) {s = 121;}

                            else if ( (LA34_121==']') ) {s = 53;}

                            else if ( ((LA34_121>='\u0000' && LA34_121<='\t')||(LA34_121>='\u000B' && LA34_121<='&')||(LA34_121>='(' && LA34_121<='/')||(LA34_121>=':' && LA34_121<='@')||(LA34_121>='[' && LA34_121<='\\')||LA34_121=='^'||LA34_121=='`'||(LA34_121>='{' && LA34_121<='\uFFFF')) ) {s = 52;}

                            if ( s>=0 ) return s;
                            break;
                        case 32 :
                            var LA34_104 = input.LA(1);

                            s = -1;
                            if ( (LA34_104=='\"') ) {s = 72;}

                            else if ( (LA34_104=='\\') ) {s = 70;}

                            else if ( ((LA34_104>='\u0000' && LA34_104<='!')||(LA34_104>='#' && LA34_104<='[')||(LA34_104>=']' && LA34_104<='\uFFFF')) ) {s = 71;}

                            if ( s>=0 ) return s;
                            break;
                        case 33 :
                            var LA34_219 = input.LA(1);

                            s = -1;
                            if ( ((LA34_219>='\u0000' && LA34_219<='\t')||(LA34_219>='\u000B' && LA34_219<='\uFFFF')) ) {s = 143;}

                            else s = 84;

                            if ( s>=0 ) return s;
                            break;
                        case 34 :
                            var LA34_164 = input.LA(1);

                            s = -1;
                            if ( (LA34_164=='\"') ) {s = 162;}

                            else if ( (LA34_164=='\\') ) {s = 163;}

                            else if ( (LA34_164==']') ) {s = 165;}

                            else if ( ((LA34_164>='\u0000' && LA34_164<='\t')||(LA34_164>='\u000B' && LA34_164<='!')||(LA34_164>='#' && LA34_164<='[')||(LA34_164>='^' && LA34_164<='\uFFFF')) ) {s = 164;}

                            if ( s>=0 ) return s;
                            break;
                        case 35 :
                            var LA34_201 = input.LA(1);

                            s = -1;
                            if ( (LA34_201=='\\') ) {s = 210;}

                            else if ( (LA34_201==']') ) {s = 211;}

                            else if ( ((LA34_201>='\u0000' && LA34_201<='\t')||(LA34_201>='\u000B' && LA34_201<='!')||(LA34_201>='#' && LA34_201<='[')||(LA34_201>='^' && LA34_201<='\uFFFF')) ) {s = 212;}

                            else if ( (LA34_201=='\"') ) {s = 84;}

                            if ( s>=0 ) return s;
                            break;
                        case 36 :
                            var LA34_153 = input.LA(1);

                            s = -1;
                            if ( (LA34_153=='/') ) {s = 171;}

                            else if ( (LA34_153==']') ) {s = 172;}

                            else if ( ((LA34_153>='-' && LA34_153<='.')||(LA34_153>='0' && LA34_153<=':')||(LA34_153>='A' && LA34_153<='Z')||LA34_153=='_'||(LA34_153>='a' && LA34_153<='z')) ) {s = 157;}

                            else if ( ((LA34_153>='\u0000' && LA34_153<='\t')||(LA34_153>='\u000B' && LA34_153<=',')||(LA34_153>=';' && LA34_153<='@')||(LA34_153>='[' && LA34_153<='\\')||LA34_153=='^'||LA34_153=='`'||(LA34_153>='{' && LA34_153<='\uFFFF')) ) {s = 84;}

                            if ( s>=0 ) return s;
                            break;
                        case 37 :
                            var LA34_154 = input.LA(1);

                            s = -1;
                            if ( (LA34_154=='/') ) {s = 173;}

                            else if ( (LA34_154==']') ) {s = 172;}

                            else if ( ((LA34_154>='-' && LA34_154<='.')||(LA34_154>='0' && LA34_154<=':')||(LA34_154>='A' && LA34_154<='Z')||LA34_154=='_'||(LA34_154>='a' && LA34_154<='z')) ) {s = 157;}

                            else if ( ((LA34_154>='\u0000' && LA34_154<='\t')||(LA34_154>='\u000B' && LA34_154<=',')||(LA34_154>=';' && LA34_154<='@')||(LA34_154>='[' && LA34_154<='\\')||LA34_154=='^'||LA34_154=='`'||(LA34_154>='{' && LA34_154<='\uFFFF')) ) {s = 84;}

                            if ( s>=0 ) return s;
                            break;
                        case 38 :
                            var LA34_156 = input.LA(1);

                            s = -1;
                            if ( (LA34_156=='\\') ) {s = 175;}

                            else if ( (LA34_156==']') ) {s = 176;}

                            else if ( ((LA34_156>='\u0000' && LA34_156<='\t')||(LA34_156>='\u000B' && LA34_156<='!')||(LA34_156>='#' && LA34_156<='[')||(LA34_156>='^' && LA34_156<='\uFFFF')) ) {s = 177;}

                            else if ( (LA34_156=='\"') ) {s = 84;}

                            if ( s>=0 ) return s;
                            break;
                        case 39 :
                            var LA34_214 = input.LA(1);

                            s = -1;
                            if ( (LA34_214=='\\') ) {s = 218;}

                            else if ( (LA34_214==']') ) {s = 219;}

                            else if ( ((LA34_214>='\u0000' && LA34_214<='\t')||(LA34_214>='\u000B' && LA34_214<='!')||(LA34_214>='#' && LA34_214<='[')||(LA34_214>='^' && LA34_214<='\uFFFF')) ) {s = 220;}

                            else if ( (LA34_214=='\"') ) {s = 84;}

                            if ( s>=0 ) return s;
                            break;
                        case 40 :
                            var LA34_155 = input.LA(1);

                            s = -1;
                            if ( (LA34_155=='/') ) {s = 174;}

                            else if ( (LA34_155==']') ) {s = 172;}

                            else if ( ((LA34_155>='-' && LA34_155<='.')||(LA34_155>='0' && LA34_155<=':')||(LA34_155>='A' && LA34_155<='Z')||LA34_155=='_'||(LA34_155>='a' && LA34_155<='z')) ) {s = 157;}

                            else if ( ((LA34_155>='\u0000' && LA34_155<='\t')||(LA34_155>='\u000B' && LA34_155<=',')||(LA34_155>=';' && LA34_155<='@')||(LA34_155>='[' && LA34_155<='\\')||LA34_155=='^'||LA34_155=='`'||(LA34_155>='{' && LA34_155<='\uFFFF')) ) {s = 84;}

                            if ( s>=0 ) return s;
                            break;
                        case 41 :
                            var LA34_51 = input.LA(1);

                            s = -1;
                            if ( ((LA34_51>='A' && LA34_51<='Z')||(LA34_51>='a' && LA34_51<='z')) ) {s = 82;}

                            else if ( (LA34_51==']') ) {s = 53;}

                            else if ( ((LA34_51>='\u0000' && LA34_51<='\t')||(LA34_51>='\u000B' && LA34_51<='@')||(LA34_51>='[' && LA34_51<='\\')||(LA34_51>='^' && LA34_51<='`')||(LA34_51>='{' && LA34_51<='\uFFFF')) ) {s = 52;}

                            if ( s>=0 ) return s;
                            break;
                        case 42 :
                            var LA34_105 = input.LA(1);

                            s = -1;
                            if ( (LA34_105=='\"') ) {s = 72;}

                            else if ( (LA34_105=='\\') ) {s = 70;}

                            else if ( ((LA34_105>='\u0000' && LA34_105<='!')||(LA34_105>='#' && LA34_105<='[')||(LA34_105>=']' && LA34_105<='\uFFFF')) ) {s = 71;}

                            if ( s>=0 ) return s;
                            break;
                        case 43 :
                            var LA34_106 = input.LA(1);

                            s = -1;
                            if ( (LA34_106=='\"') ) {s = 72;}

                            else if ( (LA34_106=='\\') ) {s = 70;}

                            else if ( ((LA34_106>='\u0000' && LA34_106<='!')||(LA34_106>='#' && LA34_106<='[')||(LA34_106>=']' && LA34_106<='\uFFFF')) ) {s = 71;}

                            if ( s>=0 ) return s;
                            break;
                        case 44 :
                            var LA34_198 = input.LA(1);

                            s = -1;
                            if ( (LA34_198=='\"') ) {s = 200;}

                            else if ( (LA34_198=='\\') ) {s = 180;}

                            else if ( ((LA34_198>='\u0000' && LA34_198<='\t')||(LA34_198>='\u000B' && LA34_198<='!')||(LA34_198>='#' && LA34_198<='[')||(LA34_198>=']' && LA34_198<='\uFFFF')) ) {s = 181;}

                            if ( s>=0 ) return s;
                            break;
                        case 45 :
                            var LA34_199 = input.LA(1);

                            s = -1;
                            if ( (LA34_199=='\"') ) {s = 200;}

                            else if ( (LA34_199=='\\') ) {s = 180;}

                            else if ( ((LA34_199>='\u0000' && LA34_199<='\t')||(LA34_199>='\u000B' && LA34_199<='!')||(LA34_199>='#' && LA34_199<='[')||(LA34_199>=']' && LA34_199<='\uFFFF')) ) {s = 181;}

                            if ( s>=0 ) return s;
                            break;
                        case 46 :
                            var LA34_197 = input.LA(1);

                            s = -1;
                            if ( (LA34_197==']') ) {s = 209;}

                            else if ( ((LA34_197>='\u0000' && LA34_197<='\t')||(LA34_197>='\u000B' && LA34_197<='\\')||(LA34_197>='^' && LA34_197<='\uFFFF')) ) {s = 84;}

                            if ( s>=0 ) return s;
                            break;
                        case 47 :
                            var LA34_157 = input.LA(1);

                            s = -1;
                            if ( (LA34_157==']') ) {s = 172;}

                            else if ( ((LA34_157>='-' && LA34_157<='.')||(LA34_157>='0' && LA34_157<=':')||(LA34_157>='A' && LA34_157<='Z')||LA34_157=='_'||(LA34_157>='a' && LA34_157<='z')) ) {s = 157;}

                            else if ( ((LA34_157>='\u0000' && LA34_157<='\t')||(LA34_157>='\u000B' && LA34_157<=',')||LA34_157=='/'||(LA34_157>=';' && LA34_157<='@')||(LA34_157>='[' && LA34_157<='\\')||LA34_157=='^'||LA34_157=='`'||(LA34_157>='{' && LA34_157<='\uFFFF')) ) {s = 84;}

                            if ( s>=0 ) return s;
                            break;
                        case 48 :
                            var LA34_181 = input.LA(1);

                            s = -1;
                            if ( (LA34_181=='\"') ) {s = 200;}

                            else if ( (LA34_181=='\\') ) {s = 180;}

                            else if ( ((LA34_181>='\u0000' && LA34_181<='\t')||(LA34_181>='\u000B' && LA34_181<='!')||(LA34_181>='#' && LA34_181<='[')||(LA34_181>=']' && LA34_181<='\uFFFF')) ) {s = 181;}

                            if ( s>=0 ) return s;
                            break;
                        case 49 :
                            var LA34_107 = input.LA(1);

                            s = -1;
                            if ( (LA34_107=='\"') ) {s = 72;}

                            else if ( (LA34_107=='\\') ) {s = 70;}

                            else if ( ((LA34_107>='\u0000' && LA34_107<='!')||(LA34_107>='#' && LA34_107<='[')||(LA34_107>=']' && LA34_107<='\uFFFF')) ) {s = 71;}

                            if ( s>=0 ) return s;
                            break;
                        case 50 :
                            var LA34_116 = input.LA(1);

                            s = -1;
                            if ( (LA34_116=='\"') ) {s = 114;}

                            else if ( (LA34_116=='\\') ) {s = 115;}

                            else if ( (LA34_116=='[') ) {s = 141;}

                            else if ( ((LA34_116>='\u0000' && LA34_116<='\t')||(LA34_116>='\u000B' && LA34_116<='!')||(LA34_116>='#' && LA34_116<='Z')||(LA34_116>=']' && LA34_116<='\uFFFF')) ) {s = 117;}

                            if ( s>=0 ) return s;
                            break;
                        case 51 :
                            var LA34_179 = input.LA(1);

                            s = -1;
                            if ( ((LA34_179>='0' && LA34_179<='9')||(LA34_179>='A' && LA34_179<='Z')||LA34_179=='_'||(LA34_179>='a' && LA34_179<='z')) ) {s = 196;}

                            else if ( (LA34_179=='\'') ) {s = 197;}

                            else if ( ((LA34_179>='\u0000' && LA34_179<='\t')||(LA34_179>='\u000B' && LA34_179<='&')||(LA34_179>='(' && LA34_179<='/')||(LA34_179>=':' && LA34_179<='@')||(LA34_179>='[' && LA34_179<='^')||LA34_179=='`'||(LA34_179>='{' && LA34_179<='\uFFFF')) ) {s = 84;}

                            if ( s>=0 ) return s;
                            break;
                        case 52 :
                            var LA34_178 = input.LA(1);

                            s = -1;
                            if ( (LA34_178==']') ) {s = 195;}

                            else if ( ((LA34_178>='\u0000' && LA34_178<='\t')||(LA34_178>='\u000B' && LA34_178<='+')||LA34_178=='-'||(LA34_178>='/' && LA34_178<='Z')||LA34_178=='\\'||(LA34_178>='^' && LA34_178<='z')||LA34_178=='|'||(LA34_178>='~' && LA34_178<='\uFFFF')) ) {s = 178;}

                            else if ( (LA34_178=='\n') ) {s = 143;}

                            else if ( (LA34_178==','||LA34_178=='.'||LA34_178=='['||LA34_178=='{'||LA34_178=='}') ) {s = 84;}

                            if ( s>=0 ) return s;
                            break;
                        case 53 :
                            var LA34_202 = input.LA(1);

                            s = -1;
                            if ( (LA34_202==']') ) {s = 183;}

                            else if ( ((LA34_202>='-' && LA34_202<='.')||(LA34_202>='0' && LA34_202<=':')||(LA34_202>='A' && LA34_202<='Z')||LA34_202=='_'||(LA34_202>='a' && LA34_202<='z')) ) {s = 202;}

                            else if ( ((LA34_202>='\u0000' && LA34_202<='\t')||(LA34_202>='\u000B' && LA34_202<=',')||LA34_202=='/'||(LA34_202>=';' && LA34_202<='@')||(LA34_202>='[' && LA34_202<='\\')||LA34_202=='^'||LA34_202=='`'||(LA34_202>='{' && LA34_202<='\uFFFF')) ) {s = 84;}

                            if ( s>=0 ) return s;
                            break;
                        case 54 :
                            var LA34_77 = input.LA(1);

                            s = -1;
                            if ( (LA34_77=='\"') ) {s = 112;}

                            else if ( (LA34_77=='\\') ) {s = 113;}

                            else if ( (LA34_77==']') ) {s = 53;}

                            else if ( ((LA34_77>='\u0000' && LA34_77<='\t')||(LA34_77>='\u000B' && LA34_77<='!')||(LA34_77>='#' && LA34_77<='[')||(LA34_77>='^' && LA34_77<='\uFFFF')) ) {s = 52;}

                            if ( s>=0 ) return s;
                            break;
                        case 55 :
                            var LA34_50 = input.LA(1);

                            s = -1;
                            if ( ((LA34_50>='\u0000' && LA34_50<='\t')||(LA34_50>='\u000B' && LA34_50<='+')||LA34_50=='-'||(LA34_50>='/' && LA34_50<='Z')||LA34_50=='\\'||(LA34_50>='^' && LA34_50<='z')||LA34_50=='|'||(LA34_50>='~' && LA34_50<='\uFFFF')) ) {s = 80;}

                            else if ( (LA34_50==']') ) {s = 53;}

                            else if ( (LA34_50=='\n') ) {s = 81;}

                            else if ( (LA34_50==','||LA34_50=='.'||LA34_50=='['||LA34_50=='{'||LA34_50=='}') ) {s = 52;}

                            if ( s>=0 ) return s;
                            break;
                        case 56 :
                            var LA34_165 = input.LA(1);

                            s = -1;
                            if ( (LA34_165=='\"') ) {s = 114;}

                            else if ( (LA34_165=='\\') ) {s = 115;}

                            else if ( ((LA34_165>='\u0000' && LA34_165<='\t')||(LA34_165>='\u000B' && LA34_165<='!')||(LA34_165>='#' && LA34_165<='[')||(LA34_165>=']' && LA34_165<='\uFFFF')) ) {s = 117;}

                            else s = 84;

                            if ( s>=0 ) return s;
                            break;
                        case 57 :
                            var LA34_206 = input.LA(1);

                            s = -1;
                            if ( (LA34_206==']') ) {s = 74;}

                            else if ( ((LA34_206>='\u0000' && LA34_206<='\t')||(LA34_206>='\u000B' && LA34_206<='\\')||(LA34_206>='^' && LA34_206<='\uFFFF')) ) {s = 52;}

                            if ( s>=0 ) return s;
                            break;
                        case 58 :
                            var LA34_78 = input.LA(1);

                            s = -1;
                            if ( (LA34_78=='\"') ) {s = 114;}

                            else if ( (LA34_78=='\\') ) {s = 115;}

                            else if ( (LA34_78=='.') ) {s = 116;}

                            else if ( ((LA34_78>='\u0000' && LA34_78<='\t')||(LA34_78>='\u000B' && LA34_78<='!')||(LA34_78>='#' && LA34_78<='-')||(LA34_78>='/' && LA34_78<='[')||(LA34_78>=']' && LA34_78<='\uFFFF')) ) {s = 117;}

                            else s = 83;

                            if ( s>=0 ) return s;
                            break;
                        case 59 :
                            var LA34_162 = input.LA(1);

                            s = -1;
                            if ( (LA34_162==':') ) {s = 182;}

                            else if ( (LA34_162==']') ) {s = 183;}

                            else if ( ((LA34_162>='\u0000' && LA34_162<='\t')||(LA34_162>='\u000B' && LA34_162<='9')||(LA34_162>=';' && LA34_162<='\\')||(LA34_162>='^' && LA34_162<='\uFFFF')) ) {s = 84;}

                            if ( s>=0 ) return s;
                            break;
                        case 60 :
                            var LA34_213 = input.LA(1);

                            s = -1;
                            if ( (LA34_213=='\"') ) {s = 217;}

                            else if ( (LA34_213=='\\') ) {s = 210;}

                            else if ( ((LA34_213>='\u0000' && LA34_213<='\t')||(LA34_213>='\u000B' && LA34_213<='!')||(LA34_213>='#' && LA34_213<='[')||(LA34_213>='^' && LA34_213<='\uFFFF')) ) {s = 212;}

                            else if ( (LA34_213==']') ) {s = 211;}

                            if ( s>=0 ) return s;
                            break;
                        case 61 :
                            var LA34_191 = input.LA(1);

                            s = -1;
                            if ( (LA34_191=='\"') ) {s = 72;}

                            else if ( (LA34_191=='\\') ) {s = 70;}

                            else if ( ((LA34_191>='\u0000' && LA34_191<='!')||(LA34_191>='#' && LA34_191<='[')||(LA34_191>=']' && LA34_191<='\uFFFF')) ) {s = 71;}

                            if ( s>=0 ) return s;
                            break;
                        case 62 :
                            var LA34_196 = input.LA(1);

                            s = -1;
                            if ( (LA34_196=='\'') ) {s = 197;}

                            else if ( ((LA34_196>='0' && LA34_196<='9')||(LA34_196>='A' && LA34_196<='Z')||LA34_196=='_'||(LA34_196>='a' && LA34_196<='z')) ) {s = 196;}

                            else if ( ((LA34_196>='\u0000' && LA34_196<='\t')||(LA34_196>='\u000B' && LA34_196<='&')||(LA34_196>='(' && LA34_196<='/')||(LA34_196>=':' && LA34_196<='@')||(LA34_196>='[' && LA34_196<='^')||LA34_196=='`'||(LA34_196>='{' && LA34_196<='\uFFFF')) ) {s = 84;}

                            if ( s>=0 ) return s;
                            break;
                        case 63 :
                            var LA34_112 = input.LA(1);

                            s = -1;
                            if ( (LA34_112=='\"') ) {s = 118;}

                            else if ( (LA34_112=='\\') ) {s = 77;}

                            else if ( (LA34_112==']') ) {s = 78;}

                            else if ( ((LA34_112>='\u0000' && LA34_112<='\t')||(LA34_112>='\u000B' && LA34_112<='!')||(LA34_112>='#' && LA34_112<='[')||(LA34_112>='^' && LA34_112<='\uFFFF')) ) {s = 79;}

                            if ( s>=0 ) return s;
                            break;
                        case 64 :
                            var LA34_113 = input.LA(1);

                            s = -1;
                            if ( (LA34_113=='\"') ) {s = 118;}

                            else if ( (LA34_113=='\\') ) {s = 77;}

                            else if ( (LA34_113==']') ) {s = 78;}

                            else if ( ((LA34_113>='\u0000' && LA34_113<='\t')||(LA34_113>='\u000B' && LA34_113<='!')||(LA34_113>='#' && LA34_113<='[')||(LA34_113>='^' && LA34_113<='\uFFFF')) ) {s = 79;}

                            if ( s>=0 ) return s;
                            break;
                        case 65 :
                            var LA34_45 = input.LA(1);

                            s = -1;
                            if ( (LA34_45=='/') ) {s = 73;}

                            else if ( (LA34_45==']') ) {s = 74;}

                            else if ( ((LA34_45>='-' && LA34_45<='.')||(LA34_45>='0' && LA34_45<=':')||(LA34_45>='A' && LA34_45<='Z')||LA34_45=='_'||(LA34_45>='a' && LA34_45<='z')) ) {s = 49;}

                            else if ( ((LA34_45>='\u0000' && LA34_45<='\t')||(LA34_45>='\u000B' && LA34_45<=',')||(LA34_45>=';' && LA34_45<='@')||(LA34_45>='[' && LA34_45<='\\')||LA34_45=='^'||LA34_45=='`'||(LA34_45>='{' && LA34_45<='\uFFFF')) ) {s = 52;}

                            if ( s>=0 ) return s;
                            break;
                        case 66 :
                            var LA34_48 = input.LA(1);

                            s = -1;
                            if ( (LA34_48=='\\') ) {s = 77;}

                            else if ( (LA34_48==']') ) {s = 78;}

                            else if ( ((LA34_48>='\u0000' && LA34_48<='\t')||(LA34_48>='\u000B' && LA34_48<='!')||(LA34_48>='#' && LA34_48<='[')||(LA34_48>='^' && LA34_48<='\uFFFF')) ) {s = 79;}

                            else if ( (LA34_48=='\"') ) {s = 52;}

                            if ( s>=0 ) return s;
                            break;
                        case 67 :
                            var LA34_46 = input.LA(1);

                            s = -1;
                            if ( (LA34_46=='/') ) {s = 75;}

                            else if ( (LA34_46==']') ) {s = 74;}

                            else if ( ((LA34_46>='-' && LA34_46<='.')||(LA34_46>='0' && LA34_46<=':')||(LA34_46>='A' && LA34_46<='Z')||LA34_46=='_'||(LA34_46>='a' && LA34_46<='z')) ) {s = 49;}

                            else if ( ((LA34_46>='\u0000' && LA34_46<='\t')||(LA34_46>='\u000B' && LA34_46<=',')||(LA34_46>=';' && LA34_46<='@')||(LA34_46>='[' && LA34_46<='\\')||LA34_46=='^'||LA34_46=='`'||(LA34_46>='{' && LA34_46<='\uFFFF')) ) {s = 52;}

                            if ( s>=0 ) return s;
                            break;
                        case 68 :
                            var LA34_73 = input.LA(1);

                            s = -1;
                            if ( (LA34_73=='\"') ) {s = 48;}

                            else if ( ((LA34_73>='-' && LA34_73<='.')||(LA34_73>='0' && LA34_73<=':')||(LA34_73>='A' && LA34_73<='Z')||LA34_73=='_'||(LA34_73>='a' && LA34_73<='z')) ) {s = 49;}

                            else if ( (LA34_73==']') ) {s = 53;}

                            else if ( ((LA34_73>='\u0000' && LA34_73<='\t')||(LA34_73>='\u000B' && LA34_73<='!')||(LA34_73>='#' && LA34_73<=',')||LA34_73=='/'||(LA34_73>=';' && LA34_73<='@')||(LA34_73>='[' && LA34_73<='\\')||LA34_73=='^'||LA34_73=='`'||(LA34_73>='{' && LA34_73<='\uFFFF')) ) {s = 52;}

                            if ( s>=0 ) return s;
                            break;
                        case 69 :
                            var LA34_79 = input.LA(1);

                            s = -1;
                            if ( (LA34_79=='\"') ) {s = 118;}

                            else if ( (LA34_79=='\\') ) {s = 77;}

                            else if ( (LA34_79==']') ) {s = 78;}

                            else if ( ((LA34_79>='\u0000' && LA34_79<='\t')||(LA34_79>='\u000B' && LA34_79<='!')||(LA34_79>='#' && LA34_79<='[')||(LA34_79>='^' && LA34_79<='\uFFFF')) ) {s = 79;}

                            if ( s>=0 ) return s;
                            break;
                        case 70 :
                            var LA34_47 = input.LA(1);

                            s = -1;
                            if ( (LA34_47=='/') ) {s = 76;}

                            else if ( (LA34_47==']') ) {s = 74;}

                            else if ( ((LA34_47>='-' && LA34_47<='.')||(LA34_47>='0' && LA34_47<=':')||(LA34_47>='A' && LA34_47<='Z')||LA34_47=='_'||(LA34_47>='a' && LA34_47<='z')) ) {s = 49;}

                            else if ( ((LA34_47>='\u0000' && LA34_47<='\t')||(LA34_47>='\u000B' && LA34_47<=',')||(LA34_47>=';' && LA34_47<='@')||(LA34_47>='[' && LA34_47<='\\')||LA34_47=='^'||LA34_47=='`'||(LA34_47>='{' && LA34_47<='\uFFFF')) ) {s = 52;}

                            if ( s>=0 ) return s;
                            break;
                        case 71 :
                            var LA34_166 = input.LA(1);

                            s = -1;
                            if ( (LA34_166=='\\') ) {s = 186;}

                            else if ( (LA34_166==']') ) {s = 187;}

                            else if ( ((LA34_166>='\u0000' && LA34_166<='\t')||(LA34_166>='\u000B' && LA34_166<='!')||(LA34_166>='#' && LA34_166<='[')||(LA34_166>='^' && LA34_166<='\uFFFF')) ) {s = 188;}

                            else if ( (LA34_166=='\"') ) {s = 52;}

                            if ( s>=0 ) return s;
                            break;
                        case 72 :
                            var LA34_75 = input.LA(1);

                            s = -1;
                            if ( (LA34_75=='\"') ) {s = 48;}

                            else if ( ((LA34_75>='-' && LA34_75<='.')||(LA34_75>='0' && LA34_75<=':')||(LA34_75>='A' && LA34_75<='Z')||LA34_75=='_'||(LA34_75>='a' && LA34_75<='z')) ) {s = 49;}

                            else if ( (LA34_75==']') ) {s = 53;}

                            else if ( ((LA34_75>='\u0000' && LA34_75<='\t')||(LA34_75>='\u000B' && LA34_75<='!')||(LA34_75>='#' && LA34_75<=',')||LA34_75=='/'||(LA34_75>=';' && LA34_75<='@')||(LA34_75>='[' && LA34_75<='\\')||LA34_75=='^'||LA34_75=='`'||(LA34_75>='{' && LA34_75<='\uFFFF')) ) {s = 52;}

                            if ( s>=0 ) return s;
                            break;
                        case 73 :
                            var LA34_76 = input.LA(1);

                            s = -1;
                            if ( (LA34_76=='\"') ) {s = 48;}

                            else if ( ((LA34_76>='-' && LA34_76<='.')||(LA34_76>='0' && LA34_76<=':')||(LA34_76>='A' && LA34_76<='Z')||LA34_76=='_'||(LA34_76>='a' && LA34_76<='z')) ) {s = 49;}

                            else if ( (LA34_76==']') ) {s = 53;}

                            else if ( ((LA34_76>='\u0000' && LA34_76<='\t')||(LA34_76>='\u000B' && LA34_76<='!')||(LA34_76>='#' && LA34_76<=',')||LA34_76=='/'||(LA34_76>=';' && LA34_76<='@')||(LA34_76>='[' && LA34_76<='\\')||LA34_76=='^'||LA34_76=='`'||(LA34_76>='{' && LA34_76<='\uFFFF')) ) {s = 52;}

                            if ( s>=0 ) return s;
                            break;
                        case 74 :
                            var LA34_52 = input.LA(1);

                            s = -1;
                            if ( (LA34_52==']') ) {s = 53;}

                            else if ( ((LA34_52>='\u0000' && LA34_52<='\t')||(LA34_52>='\u000B' && LA34_52<='\\')||(LA34_52>='^' && LA34_52<='\uFFFF')) ) {s = 52;}

                            if ( s>=0 ) return s;
                            break;
                        case 75 :
                            var LA34_210 = input.LA(1);

                            s = -1;
                            if ( (LA34_210=='\"') ) {s = 215;}

                            else if ( (LA34_210=='\\') ) {s = 216;}

                            else if ( ((LA34_210>='\u0000' && LA34_210<='\t')||(LA34_210>='\u000B' && LA34_210<='!')||(LA34_210>='#' && LA34_210<='[')||(LA34_210>=']' && LA34_210<='\uFFFF')) ) {s = 84;}

                            if ( s>=0 ) return s;
                            break;
                        case 76 :
                            var LA34_175 = input.LA(1);

                            s = -1;
                            if ( (LA34_175=='\"') ) {s = 192;}

                            else if ( (LA34_175=='\\') ) {s = 193;}

                            else if ( ((LA34_175>='\u0000' && LA34_175<='\t')||(LA34_175>='\u000B' && LA34_175<='!')||(LA34_175>='#' && LA34_175<='[')||(LA34_175>=']' && LA34_175<='\uFFFF')) ) {s = 84;}

                            if ( s>=0 ) return s;
                            break;
                        case 77 :
                            var LA34_182 = input.LA(1);

                            s = -1;
                            if ( (LA34_182=='\"') ) {s = 201;}

                            else if ( ((LA34_182>='-' && LA34_182<='.')||(LA34_182>='0' && LA34_182<=':')||(LA34_182>='A' && LA34_182<='Z')||LA34_182=='_'||(LA34_182>='a' && LA34_182<='z')) ) {s = 202;}

                            else if ( ((LA34_182>='\u0000' && LA34_182<='\t')||(LA34_182>='\u000B' && LA34_182<='!')||(LA34_182>='#' && LA34_182<=',')||LA34_182=='/'||(LA34_182>=';' && LA34_182<='@')||(LA34_182>='[' && LA34_182<='^')||LA34_182=='`'||(LA34_182>='{' && LA34_182<='\uFFFF')) ) {s = 84;}

                            if ( s>=0 ) return s;
                            break;
                        case 78 :
                            var LA34_223 = input.LA(1);

                            s = -1;
                            if ( (LA34_223==']') ) {s = 172;}

                            else if ( ((LA34_223>='\u0000' && LA34_223<='\t')||(LA34_223>='\u000B' && LA34_223<='\\')||(LA34_223>='^' && LA34_223<='\uFFFF')) ) {s = 84;}

                            if ( s>=0 ) return s;
                            break;
                        case 79 :
                            var LA34_215 = input.LA(1);

                            s = -1;
                            if ( (LA34_215=='\"') ) {s = 217;}

                            else if ( (LA34_215=='\\') ) {s = 210;}

                            else if ( (LA34_215==']') ) {s = 211;}

                            else if ( ((LA34_215>='\u0000' && LA34_215<='\t')||(LA34_215>='\u000B' && LA34_215<='!')||(LA34_215>='#' && LA34_215<='[')||(LA34_215>='^' && LA34_215<='\uFFFF')) ) {s = 212;}

                            if ( s>=0 ) return s;
                            break;
                        case 80 :
                            var LA34_216 = input.LA(1);

                            s = -1;
                            if ( (LA34_216=='\"') ) {s = 217;}

                            else if ( (LA34_216=='\\') ) {s = 210;}

                            else if ( (LA34_216==']') ) {s = 211;}

                            else if ( ((LA34_216>='\u0000' && LA34_216<='\t')||(LA34_216>='\u000B' && LA34_216<='!')||(LA34_216>='#' && LA34_216<='[')||(LA34_216>='^' && LA34_216<='\uFFFF')) ) {s = 212;}

                            if ( s>=0 ) return s;
                            break;
                        case 81 :
                            var LA34_192 = input.LA(1);

                            s = -1;
                            if ( (LA34_192=='\"') ) {s = 194;}

                            else if ( (LA34_192=='\\') ) {s = 175;}

                            else if ( (LA34_192==']') ) {s = 176;}

                            else if ( ((LA34_192>='\u0000' && LA34_192<='\t')||(LA34_192>='\u000B' && LA34_192<='!')||(LA34_192>='#' && LA34_192<='[')||(LA34_192>='^' && LA34_192<='\uFFFF')) ) {s = 177;}

                            if ( s>=0 ) return s;
                            break;
                        case 82 :
                            var LA34_212 = input.LA(1);

                            s = -1;
                            if ( (LA34_212=='\"') ) {s = 217;}

                            else if ( (LA34_212=='\\') ) {s = 210;}

                            else if ( (LA34_212==']') ) {s = 211;}

                            else if ( ((LA34_212>='\u0000' && LA34_212<='\t')||(LA34_212>='\u000B' && LA34_212<='!')||(LA34_212>='#' && LA34_212<='[')||(LA34_212>='^' && LA34_212<='\uFFFF')) ) {s = 212;}

                            if ( s>=0 ) return s;
                            break;
                        case 83 :
                            var LA34_193 = input.LA(1);

                            s = -1;
                            if ( (LA34_193=='\"') ) {s = 194;}

                            else if ( (LA34_193=='\\') ) {s = 175;}

                            else if ( (LA34_193==']') ) {s = 176;}

                            else if ( ((LA34_193>='\u0000' && LA34_193<='\t')||(LA34_193>='\u000B' && LA34_193<='!')||(LA34_193>='#' && LA34_193<='[')||(LA34_193>='^' && LA34_193<='\uFFFF')) ) {s = 177;}

                            if ( s>=0 ) return s;
                            break;
                        case 84 :
                            var LA34_177 = input.LA(1);

                            s = -1;
                            if ( (LA34_177=='\"') ) {s = 194;}

                            else if ( (LA34_177=='\\') ) {s = 175;}

                            else if ( (LA34_177==']') ) {s = 176;}

                            else if ( ((LA34_177>='\u0000' && LA34_177<='\t')||(LA34_177>='\u000B' && LA34_177<='!')||(LA34_177>='#' && LA34_177<='[')||(LA34_177>='^' && LA34_177<='\uFFFF')) ) {s = 177;}

                            if ( s>=0 ) return s;
                            break;
                        case 85 :
                            var LA34_171 = input.LA(1);

                            s = -1;
                            if ( (LA34_171=='\"') ) {s = 156;}

                            else if ( ((LA34_171>='-' && LA34_171<='.')||(LA34_171>='0' && LA34_171<=':')||(LA34_171>='A' && LA34_171<='Z')||LA34_171=='_'||(LA34_171>='a' && LA34_171<='z')) ) {s = 157;}

                            else if ( ((LA34_171>='\u0000' && LA34_171<='\t')||(LA34_171>='\u000B' && LA34_171<='!')||(LA34_171>='#' && LA34_171<=',')||LA34_171=='/'||(LA34_171>=';' && LA34_171<='@')||(LA34_171>='[' && LA34_171<='^')||LA34_171=='`'||(LA34_171>='{' && LA34_171<='\uFFFF')) ) {s = 84;}

                            if ( s>=0 ) return s;
                            break;
                        case 86 :
                            var LA34_136 = input.LA(1);

                            s = -1;
                            if ( (LA34_136=='d') ) {s = 153;}

                            else if ( (LA34_136=='h') ) {s = 154;}

                            else if ( (LA34_136=='p') ) {s = 155;}

                            else if ( (LA34_136=='\"') ) {s = 156;}

                            else if ( ((LA34_136>='-' && LA34_136<='.')||(LA34_136>='0' && LA34_136<=':')||(LA34_136>='A' && LA34_136<='Z')||LA34_136=='_'||(LA34_136>='a' && LA34_136<='c')||(LA34_136>='e' && LA34_136<='g')||(LA34_136>='i' && LA34_136<='o')||(LA34_136>='q' && LA34_136<='z')) ) {s = 157;}

                            else if ( (LA34_136=='#'||LA34_136=='@') ) {s = 158;}

                            else if ( (LA34_136=='\'') ) {s = 159;}

                            else if ( ((LA34_136>='\u0000' && LA34_136<='\t')||(LA34_136>='\u000B' && LA34_136<='!')||(LA34_136>='$' && LA34_136<='&')||(LA34_136>='(' && LA34_136<=',')||LA34_136=='/'||(LA34_136>=';' && LA34_136<='?')||(LA34_136>='[' && LA34_136<='^')||LA34_136=='`'||(LA34_136>='{' && LA34_136<='\uFFFF')) ) {s = 84;}

                            if ( s>=0 ) return s;
                            break;
                        case 87 :
                            var LA34_173 = input.LA(1);

                            s = -1;
                            if ( (LA34_173=='\"') ) {s = 156;}

                            else if ( ((LA34_173>='-' && LA34_173<='.')||(LA34_173>='0' && LA34_173<=':')||(LA34_173>='A' && LA34_173<='Z')||LA34_173=='_'||(LA34_173>='a' && LA34_173<='z')) ) {s = 157;}

                            else if ( ((LA34_173>='\u0000' && LA34_173<='\t')||(LA34_173>='\u000B' && LA34_173<='!')||(LA34_173>='#' && LA34_173<=',')||LA34_173=='/'||(LA34_173>=';' && LA34_173<='@')||(LA34_173>='[' && LA34_173<='^')||LA34_173=='`'||(LA34_173>='{' && LA34_173<='\uFFFF')) ) {s = 84;}

                            if ( s>=0 ) return s;
                            break;
                        case 88 :
                            var LA34_174 = input.LA(1);

                            s = -1;
                            if ( (LA34_174=='\"') ) {s = 156;}

                            else if ( ((LA34_174>='-' && LA34_174<='.')||(LA34_174>='0' && LA34_174<=':')||(LA34_174>='A' && LA34_174<='Z')||LA34_174=='_'||(LA34_174>='a' && LA34_174<='z')) ) {s = 157;}

                            else if ( ((LA34_174>='\u0000' && LA34_174<='\t')||(LA34_174>='\u000B' && LA34_174<='!')||(LA34_174>='#' && LA34_174<=',')||LA34_174=='/'||(LA34_174>=';' && LA34_174<='@')||(LA34_174>='[' && LA34_174<='^')||LA34_174=='`'||(LA34_174>='{' && LA34_174<='\uFFFF')) ) {s = 84;}

                            if ( s>=0 ) return s;
                            break;
                        case 89 :
                            var LA34_139 = input.LA(1);

                            s = -1;
                            if ( (LA34_139=='\"') ) {s = 114;}

                            else if ( (LA34_139=='\\') ) {s = 115;}

                            else if ( ((LA34_139>='\u0000' && LA34_139<='\t')||(LA34_139>='\u000B' && LA34_139<='!')||(LA34_139>='#' && LA34_139<='[')||(LA34_139>=']' && LA34_139<='\uFFFF')) ) {s = 117;}

                            if ( s>=0 ) return s;
                            break;
                        case 90 :
                            var LA34_49 = input.LA(1);

                            s = -1;
                            if ( (LA34_49==']') ) {s = 74;}

                            else if ( ((LA34_49>='-' && LA34_49<='.')||(LA34_49>='0' && LA34_49<=':')||(LA34_49>='A' && LA34_49<='Z')||LA34_49=='_'||(LA34_49>='a' && LA34_49<='z')) ) {s = 49;}

                            else if ( ((LA34_49>='\u0000' && LA34_49<='\t')||(LA34_49>='\u000B' && LA34_49<=',')||LA34_49=='/'||(LA34_49>=';' && LA34_49<='@')||(LA34_49>='[' && LA34_49<='\\')||LA34_49=='^'||LA34_49=='`'||(LA34_49>='{' && LA34_49<='\uFFFF')) ) {s = 52;}

                            if ( s>=0 ) return s;
                            break;
                        case 91 :
                            var LA34_14 = input.LA(1);

                            s = -1;
                            if ( (LA34_14=='d') ) {s = 45;}

                            else if ( (LA34_14=='h') ) {s = 46;}

                            else if ( (LA34_14=='p') ) {s = 47;}

                            else if ( (LA34_14=='\"') ) {s = 48;}

                            else if ( ((LA34_14>='-' && LA34_14<='.')||(LA34_14>='0' && LA34_14<=':')||(LA34_14>='A' && LA34_14<='Z')||LA34_14=='_'||(LA34_14>='a' && LA34_14<='c')||(LA34_14>='e' && LA34_14<='g')||(LA34_14>='i' && LA34_14<='o')||(LA34_14>='q' && LA34_14<='z')) ) {s = 49;}

                            else if ( (LA34_14=='#'||LA34_14=='@') ) {s = 50;}

                            else if ( (LA34_14=='\'') ) {s = 51;}

                            else if ( ((LA34_14>='\u0000' && LA34_14<='\t')||(LA34_14>='\u000B' && LA34_14<='!')||(LA34_14>='$' && LA34_14<='&')||(LA34_14>='(' && LA34_14<=',')||LA34_14=='/'||(LA34_14>=';' && LA34_14<='?')||(LA34_14>='[' && LA34_14<='\\')||LA34_14=='^'||LA34_14=='`'||(LA34_14>='{' && LA34_14<='\uFFFF')) ) {s = 52;}

                            else if ( (LA34_14==']') ) {s = 53;}

                            else s = 44;

                            if ( s>=0 ) return s;
                            break;
                        case 92 :
                            var LA34_140 = input.LA(1);

                            s = -1;
                            if ( (LA34_140=='\"') ) {s = 114;}

                            else if ( (LA34_140=='\\') ) {s = 115;}

                            else if ( ((LA34_140>='\u0000' && LA34_140<='\t')||(LA34_140>='\u000B' && LA34_140<='!')||(LA34_140>='#' && LA34_140<='[')||(LA34_140>=']' && LA34_140<='\uFFFF')) ) {s = 117;}

                            if ( s>=0 ) return s;
                            break;
                        case 93 :
                            var LA34_122 = input.LA(1);

                            s = -1;
                            if ( (LA34_122==']') ) {s = 144;}

                            else if ( ((LA34_122>='\u0000' && LA34_122<='\t')||(LA34_122>='\u000B' && LA34_122<='\\')||(LA34_122>='^' && LA34_122<='\uFFFF')) ) {s = 52;}

                            if ( s>=0 ) return s;
                            break;
                        case 94 :
                            var LA34_117 = input.LA(1);

                            s = -1;
                            if ( (LA34_117=='\"') ) {s = 114;}

                            else if ( (LA34_117=='\\') ) {s = 115;}

                            else if ( ((LA34_117>='\u0000' && LA34_117<='\t')||(LA34_117>='\u000B' && LA34_117<='!')||(LA34_117>='#' && LA34_117<='[')||(LA34_117>=']' && LA34_117<='\uFFFF')) ) {s = 117;}

                            if ( s>=0 ) return s;
                            break;
                        case 95 :
                            var LA34_160 = input.LA(1);

                            s = -1;
                            if ( (LA34_160=='\\') ) {s = 180;}

                            else if ( ((LA34_160>='\u0000' && LA34_160<='\t')||(LA34_160>='\u000B' && LA34_160<='!')||(LA34_160>='#' && LA34_160<='[')||(LA34_160>=']' && LA34_160<='\uFFFF')) ) {s = 181;}

                            if ( s>=0 ) return s;
                            break;
                        case 96 :
                            var LA34_71 = input.LA(1);

                            s = -1;
                            if ( (LA34_71=='\"') ) {s = 72;}

                            else if ( (LA34_71=='\\') ) {s = 70;}

                            else if ( ((LA34_71>='\u0000' && LA34_71<='!')||(LA34_71>='#' && LA34_71<='[')||(LA34_71>=']' && LA34_71<='\uFFFF')) ) {s = 71;}

                            if ( s>=0 ) return s;
                            break;
            }
        }).call(this.recognizer, s, input);
        if (!org.antlr.lang.isUndefined(retval)) {
            return retval;
        }
        var nvae =
            new org.antlr.runtime.NoViableAltException(this.getDescription(), 34, _s, input);
        this.error(nvae);
        throw nvae;
    },
    dummy: null
});

})();

oFF.HiloLexer = HiloLexer;
}
oFF.loadHiloParser = function() {

// $ANTLR 3.3 Nov 30, 2010 12:46:29 antlr\\Hilo.g 2023-09-25 17:17:38

var HiloParser = function(input, state) {
    if (!state) {
        state = new org.antlr.runtime.RecognizerSharedState();
    }

    (function(){

            this._builder = null;

            //-------------------------------
            // Error management
            //-------------------------------
            this.emitErrorMessage = function(message) {
                throw new Error(message);
            };

    }).call(this);

    HiloParser.superclass.constructor.call(this, input, state);

    this.dfa14 = new HiloParser.DFA14(this);
    this.dfa33 = new HiloParser.DFA33(this);
    this.dfa42 = new HiloParser.DFA42(this);



    /* @todo only create adaptor if output=AST */
    this.adaptor = new org.antlr.runtime.tree.CommonTreeAdaptor();

};

org.antlr.lang.augmentObject(HiloParser, {
    EOF: -1,
    PARENTH_GROUP: 4,
    FUNCALL: 5,
    VARACCESS: 6,
    ARRAY: 7,
    SUBSCRIPT: 8,
    UNARY_PLUS: 9,
    UNARY_MINUS: 10,
    RANGE_UP_TO_: 11,
    RANGE_UP_TO: 12,
    RANGE_UP_FROM_: 13,
    RANGE_UP_FROM: 14,
    CAGR_FORMULA: 15,
    CAGR_FORMULA_WITH_DIMENSION: 16,
    LOOKUP_FORMULA: 17,
    SMA_FORMULA: 18,
    SMA_FORMULA_WITH_DIMENSION: 19,
    YOY_FORMULA: 20,
    YOY_FORMULA_WITH_DIMENSION: 21,
    LINK_FORMULA: 22,
    ITERATE_FUNCTION: 23,
    EQ: 24,
    NEQ: 25,
    LT: 26,
    GT: 27,
    GTE: 28,
    LTE: 29,
    PLUS: 30,
    MINUS: 31,
    MULT: 32,
    DIV: 33,
    REM: 34,
    POW: 35,
    PIPE: 36,
    ASSIGN: 37,
    LPAR: 38,
    RPAR: 39,
    LBRA: 40,
    RBRA: 41,
    COMMA: 42,
    DOT: 43,
    SEMICOLON: 44,
    A: 45,
    B: 46,
    C: 47,
    D: 48,
    E: 49,
    F: 50,
    G: 51,
    H: 52,
    I: 53,
    J: 54,
    K: 55,
    L: 56,
    M: 57,
    N: 58,
    O: 59,
    P: 60,
    Q: 61,
    R: 62,
    S: 63,
    T: 64,
    U: 65,
    V: 66,
    W: 67,
    X: 68,
    Y: 69,
    Z: 70,
    OR: 71,
    AND: 72,
    NOT: 73,
    CAGR: 74,
    LOOKUP: 75,
    SMA: 76,
    YOY: 77,
    LINK: 78,
    ITERATE: 79,
    NULL: 80,
    TRUE: 81,
    FALSE: 82,
    YES: 83,
    NO: 84,
    STRING: 85,
    FIELD: 86,
    MEASURE_FIELD: 87,
    INTEGER: 88,
    DOUBLE: 89,
    DATE_TIME: 90,
    DOT_SEP_STRING: 91,
    DQ_ALLOW_ESC_REGEX_STRING: 92,
    ATTRIBUTE: 93,
    OLD_ATTRIBUTE: 94,
    IDENTIFIER: 95,
    WHITESPACE: 96,
    COMMENT: 97,
    DIGIT: 98,
    EXPONENT: 99,
    LETTER: 100,
    SHARP: 101,
    DQ_STRING: 102,
    SQ_STRING: 103,
    ESC_REGEX: 104,
    ESC_SEQ: 105,
    HEX_DIGIT: 106,
    VARIABLE_FIELD: 107,
    NAME_IN_QUOTE: 108,
    OLD_FIELD_STR: 109,
    DIM_MEASURE_FIELD: 110,
    CALC_FIELD: 111
});

(function(){
// public class variables
var EOF= -1,
    PARENTH_GROUP= 4,
    FUNCALL= 5,
    VARACCESS= 6,
    ARRAY= 7,
    SUBSCRIPT= 8,
    UNARY_PLUS= 9,
    UNARY_MINUS= 10,
    RANGE_UP_TO_= 11,
    RANGE_UP_TO= 12,
    RANGE_UP_FROM_= 13,
    RANGE_UP_FROM= 14,
    CAGR_FORMULA= 15,
    CAGR_FORMULA_WITH_DIMENSION= 16,
    LOOKUP_FORMULA= 17,
    SMA_FORMULA= 18,
    SMA_FORMULA_WITH_DIMENSION= 19,
    YOY_FORMULA= 20,
    YOY_FORMULA_WITH_DIMENSION= 21,
    LINK_FORMULA= 22,
    ITERATE_FUNCTION= 23,
    EQ= 24,
    NEQ= 25,
    LT= 26,
    GT= 27,
    GTE= 28,
    LTE= 29,
    PLUS= 30,
    MINUS= 31,
    MULT= 32,
    DIV= 33,
    REM= 34,
    POW= 35,
    PIPE= 36,
    ASSIGN= 37,
    LPAR= 38,
    RPAR= 39,
    LBRA= 40,
    RBRA= 41,
    COMMA= 42,
    DOT= 43,
    SEMICOLON= 44,
    A= 45,
    B= 46,
    C= 47,
    D= 48,
    E= 49,
    F= 50,
    G= 51,
    H= 52,
    I= 53,
    J= 54,
    K= 55,
    L= 56,
    M= 57,
    N= 58,
    O= 59,
    P= 60,
    Q= 61,
    R= 62,
    S= 63,
    T= 64,
    U= 65,
    V= 66,
    W= 67,
    X= 68,
    Y= 69,
    Z= 70,
    OR= 71,
    AND= 72,
    NOT= 73,
    CAGR= 74,
    LOOKUP= 75,
    SMA= 76,
    YOY= 77,
    LINK= 78,
    ITERATE= 79,
    NULL= 80,
    TRUE= 81,
    FALSE= 82,
    YES= 83,
    NO= 84,
    STRING= 85,
    FIELD= 86,
    MEASURE_FIELD= 87,
    INTEGER= 88,
    DOUBLE= 89,
    DATE_TIME= 90,
    DOT_SEP_STRING= 91,
    DQ_ALLOW_ESC_REGEX_STRING= 92,
    ATTRIBUTE= 93,
    OLD_ATTRIBUTE= 94,
    IDENTIFIER= 95,
    WHITESPACE= 96,
    COMMENT= 97,
    DIGIT= 98,
    EXPONENT= 99,
    LETTER= 100,
    SHARP= 101,
    DQ_STRING= 102,
    SQ_STRING= 103,
    ESC_REGEX= 104,
    ESC_SEQ= 105,
    HEX_DIGIT= 106,
    VARIABLE_FIELD= 107,
    NAME_IN_QUOTE= 108,
    OLD_FIELD_STR= 109,
    DIM_MEASURE_FIELD= 110,
    CALC_FIELD= 111;

// public instance methods/vars
org.antlr.lang.extend(HiloParser, org.antlr.runtime.Parser, {

    setTreeAdaptor: function(adaptor) {
        this.adaptor = adaptor;
    },
    getTreeAdaptor: function() {
        return this.adaptor;
    },

    getTokenNames: function() { return HiloParser.tokenNames; },
    getGrammarFileName: function() { return "antlr\\Hilo.g"; }
});
org.antlr.lang.augmentObject(HiloParser.prototype, {

    // inline static return class
    formula_return: (function() {
        HiloParser.formula_return = function(){};
        org.antlr.lang.extend(HiloParser.formula_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:168:1: formula : ( expr EOF | cagr EOF | lookup EOF | sma EOF | yoy EOF | link EOF );
    // $ANTLR start "formula"
    formula: function() {
        var retval = new HiloParser.formula_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var EOF2 = null;
        var EOF4 = null;
        var EOF6 = null;
        var EOF8 = null;
        var EOF10 = null;
        var EOF12 = null;
         var expr1 = null;
         var cagr3 = null;
         var lookup5 = null;
         var sma7 = null;
         var yoy9 = null;
         var link11 = null;

        var EOF2_tree=null;
        var EOF4_tree=null;
        var EOF6_tree=null;
        var EOF8_tree=null;
        var EOF10_tree=null;
        var EOF12_tree=null;

        try {
            // antlr\\Hilo.g:169:5: ( expr EOF | cagr EOF | lookup EOF | sma EOF | yoy EOF | link EOF )
            var alt1=6;
            switch ( this.input.LA(1) ) {
            case PLUS:
            case MINUS:
            case LPAR:
            case NOT:
            case ITERATE:
            case NULL:
            case TRUE:
            case FALSE:
            case YES:
            case NO:
            case STRING:
            case FIELD:
            case MEASURE_FIELD:
            case INTEGER:
            case DOUBLE:
            case DATE_TIME:
            case DOT_SEP_STRING:
            case DQ_ALLOW_ESC_REGEX_STRING:
            case ATTRIBUTE:
            case OLD_ATTRIBUTE:
            case IDENTIFIER:
                alt1=1;
                break;
            case CAGR:
                alt1=2;
                break;
            case LOOKUP:
                alt1=3;
                break;
            case SMA:
                alt1=4;
                break;
            case YOY:
                alt1=5;
                break;
            case LINK:
                alt1=6;
                break;
            default:
                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 1, 0, this.input);

                throw nvae;
            }

            switch (alt1) {
                case 1 :
                    // antlr\\Hilo.g:169:7: expr EOF
                    root_0 = this.adaptor.nil();

                    this.pushFollow(HiloParser.FOLLOW_expr_in_formula1300);
                    expr1=this.expr();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, expr1.getTree());
                    EOF2=this.match(this.input,EOF,HiloParser.FOLLOW_EOF_in_formula1302); if (this.state.failed) return retval;


                    break;
                case 2 :
                    // antlr\\Hilo.g:170:7: cagr EOF
                    root_0 = this.adaptor.nil();

                    this.pushFollow(HiloParser.FOLLOW_cagr_in_formula1311);
                    cagr3=this.cagr();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, cagr3.getTree());
                    EOF4=this.match(this.input,EOF,HiloParser.FOLLOW_EOF_in_formula1313); if (this.state.failed) return retval;


                    break;
                case 3 :
                    // antlr\\Hilo.g:171:7: lookup EOF
                    root_0 = this.adaptor.nil();

                    this.pushFollow(HiloParser.FOLLOW_lookup_in_formula1322);
                    lookup5=this.lookup();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, lookup5.getTree());
                    EOF6=this.match(this.input,EOF,HiloParser.FOLLOW_EOF_in_formula1324); if (this.state.failed) return retval;


                    break;
                case 4 :
                    // antlr\\Hilo.g:172:4: sma EOF
                    root_0 = this.adaptor.nil();

                    this.pushFollow(HiloParser.FOLLOW_sma_in_formula1330);
                    sma7=this.sma();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, sma7.getTree());
                    EOF8=this.match(this.input,EOF,HiloParser.FOLLOW_EOF_in_formula1332); if (this.state.failed) return retval;


                    break;
                case 5 :
                    // antlr\\Hilo.g:173:4: yoy EOF
                    root_0 = this.adaptor.nil();

                    this.pushFollow(HiloParser.FOLLOW_yoy_in_formula1338);
                    yoy9=this.yoy();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, yoy9.getTree());
                    EOF10=this.match(this.input,EOF,HiloParser.FOLLOW_EOF_in_formula1340); if (this.state.failed) return retval;


                    break;
                case 6 :
                    // antlr\\Hilo.g:174:4: link EOF
                    root_0 = this.adaptor.nil();

                    this.pushFollow(HiloParser.FOLLOW_link_in_formula1346);
                    link11=this.link();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, link11.getTree());
                    EOF12=this.match(this.input,EOF,HiloParser.FOLLOW_EOF_in_formula1348); if (this.state.failed) return retval;


                    break;

            }
            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    exprList_return: (function() {
        HiloParser.exprList_return = function(){};
        org.antlr.lang.extend(HiloParser.exprList_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:180:1: exprList : expr ( COMMA expr )* ;
    // $ANTLR start "exprList"
    exprList: function() {
        var retval = new HiloParser.exprList_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var COMMA14 = null;
         var expr13 = null;
         var expr15 = null;

        var COMMA14_tree=null;

        try {
            // antlr\\Hilo.g:181:5: ( expr ( COMMA expr )* )
            // antlr\\Hilo.g:181:7: expr ( COMMA expr )*
            root_0 = this.adaptor.nil();

            this.pushFollow(HiloParser.FOLLOW_expr_in_exprList1369);
            expr13=this.expr();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, expr13.getTree());
            // antlr\\Hilo.g:181:12: ( COMMA expr )*
            loop2:
            do {
                var alt2=2;
                switch ( this.input.LA(1) ) {
                case COMMA:
                    alt2=1;
                    break;

                }

                switch (alt2) {
                case 1 :
                    // antlr\\Hilo.g:181:13: COMMA expr
                    COMMA14=this.match(this.input,COMMA,HiloParser.FOLLOW_COMMA_in_exprList1372); if (this.state.failed) return retval;
                    this.pushFollow(HiloParser.FOLLOW_expr_in_exprList1375);
                    expr15=this.expr();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, expr15.getTree());


                    break;

                default :
                    break loop2;
                }
            } while (true);




            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    orList_return: (function() {
        HiloParser.orList_return = function(){};
        org.antlr.lang.extend(HiloParser.orList_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:184:1: orList : primitive ( OR primitive )+ ;
    // $ANTLR start "orList"
    orList: function() {
        var retval = new HiloParser.orList_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var OR17 = null;
         var primitive16 = null;
         var primitive18 = null;

        var OR17_tree=null;

        try {
            // antlr\\Hilo.g:185:5: ( primitive ( OR primitive )+ )
            // antlr\\Hilo.g:185:7: primitive ( OR primitive )+
            root_0 = this.adaptor.nil();

            this.pushFollow(HiloParser.FOLLOW_primitive_in_orList1394);
            primitive16=this.primitive();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, primitive16.getTree());
            // antlr\\Hilo.g:185:17: ( OR primitive )+
            var cnt3=0;
            loop3:
            do {
                var alt3=2;
                switch ( this.input.LA(1) ) {
                case OR:
                    alt3=1;
                    break;

                }

                switch (alt3) {
                case 1 :
                    // antlr\\Hilo.g:185:18: OR primitive
                    OR17=this.match(this.input,OR,HiloParser.FOLLOW_OR_in_orList1397); if (this.state.failed) return retval;
                    this.pushFollow(HiloParser.FOLLOW_primitive_in_orList1400);
                    primitive18=this.primitive();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, primitive18.getTree());


                    break;

                default :
                    if ( cnt3 >= 1 ) {
                        break loop3;
                    }
                    if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var eee = new org.antlr.runtime.EarlyExitException(3, this.input);
                        throw eee;
                }
                cnt3++;
            } while (true);




            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    andList_return: (function() {
        HiloParser.andList_return = function(){};
        org.antlr.lang.extend(HiloParser.andList_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:188:1: andList : primitive ( AND primitive )+ ;
    // $ANTLR start "andList"
    andList: function() {
        var retval = new HiloParser.andList_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var AND20 = null;
         var primitive19 = null;
         var primitive21 = null;

        var AND20_tree=null;

        try {
            // antlr\\Hilo.g:189:5: ( primitive ( AND primitive )+ )
            // antlr\\Hilo.g:189:7: primitive ( AND primitive )+
            root_0 = this.adaptor.nil();

            this.pushFollow(HiloParser.FOLLOW_primitive_in_andList1419);
            primitive19=this.primitive();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, primitive19.getTree());
            // antlr\\Hilo.g:189:17: ( AND primitive )+
            var cnt4=0;
            loop4:
            do {
                var alt4=2;
                switch ( this.input.LA(1) ) {
                case AND:
                    alt4=1;
                    break;

                }

                switch (alt4) {
                case 1 :
                    // antlr\\Hilo.g:189:18: AND primitive
                    AND20=this.match(this.input,AND,HiloParser.FOLLOW_AND_in_andList1422); if (this.state.failed) return retval;
                    this.pushFollow(HiloParser.FOLLOW_primitive_in_andList1425);
                    primitive21=this.primitive();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, primitive21.getTree());


                    break;

                default :
                    if ( cnt4 >= 1 ) {
                        break loop4;
                    }
                    if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var eee = new org.antlr.runtime.EarlyExitException(4, this.input);
                        throw eee;
                }
                cnt4++;
            } while (true);




            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    commaList_return: (function() {
        HiloParser.commaList_return = function(){};
        org.antlr.lang.extend(HiloParser.commaList_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:192:1: commaList : primitive ( COMMA primitive )+ ;
    // $ANTLR start "commaList"
    commaList: function() {
        var retval = new HiloParser.commaList_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var COMMA23 = null;
         var primitive22 = null;
         var primitive24 = null;

        var COMMA23_tree=null;

        try {
            // antlr\\Hilo.g:193:5: ( primitive ( COMMA primitive )+ )
            // antlr\\Hilo.g:193:7: primitive ( COMMA primitive )+
            root_0 = this.adaptor.nil();

            this.pushFollow(HiloParser.FOLLOW_primitive_in_commaList1444);
            primitive22=this.primitive();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, primitive22.getTree());
            // antlr\\Hilo.g:193:17: ( COMMA primitive )+
            var cnt5=0;
            loop5:
            do {
                var alt5=2;
                switch ( this.input.LA(1) ) {
                case COMMA:
                    alt5=1;
                    break;

                }

                switch (alt5) {
                case 1 :
                    // antlr\\Hilo.g:193:18: COMMA primitive
                    COMMA23=this.match(this.input,COMMA,HiloParser.FOLLOW_COMMA_in_commaList1447); if (this.state.failed) return retval;
                    this.pushFollow(HiloParser.FOLLOW_primitive_in_commaList1450);
                    primitive24=this.primitive();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, primitive24.getTree());


                    break;

                default :
                    if ( cnt5 >= 1 ) {
                        break loop5;
                    }
                    if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var eee = new org.antlr.runtime.EarlyExitException(5, this.input);
                        throw eee;
                }
                cnt5++;
            } while (true);




            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    stringList_return: (function() {
        HiloParser.stringList_return = function(){};
        org.antlr.lang.extend(HiloParser.stringList_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:196:1: stringList : STRING ( COMMA STRING )* ;
    // $ANTLR start "stringList"
    stringList: function() {
        var retval = new HiloParser.stringList_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var STRING25 = null;
        var COMMA26 = null;
        var STRING27 = null;

        var STRING25_tree=null;
        var COMMA26_tree=null;
        var STRING27_tree=null;

        try {
            // antlr\\Hilo.g:197:5: ( STRING ( COMMA STRING )* )
            // antlr\\Hilo.g:197:7: STRING ( COMMA STRING )*
            root_0 = this.adaptor.nil();

            STRING25=this.match(this.input,STRING,HiloParser.FOLLOW_STRING_in_stringList1469); if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) {
            STRING25_tree = this.adaptor.create(STRING25);
            this.adaptor.addChild(root_0, STRING25_tree);
            }
            // antlr\\Hilo.g:197:14: ( COMMA STRING )*
            loop6:
            do {
                var alt6=2;
                switch ( this.input.LA(1) ) {
                case COMMA:
                    alt6=1;
                    break;

                }

                switch (alt6) {
                case 1 :
                    // antlr\\Hilo.g:197:15: COMMA STRING
                    COMMA26=this.match(this.input,COMMA,HiloParser.FOLLOW_COMMA_in_stringList1472); if (this.state.failed) return retval;
                    STRING27=this.match(this.input,STRING,HiloParser.FOLLOW_STRING_in_stringList1475); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) {
                    STRING27_tree = this.adaptor.create(STRING27);
                    this.adaptor.addChild(root_0, STRING27_tree);
                    }


                    break;

                default :
                    break loop6;
                }
            } while (true);




            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    expr_return: (function() {
        HiloParser.expr_return = function(){};
        org.antlr.lang.extend(HiloParser.expr_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:200:1: expr : chainExpr ;
    // $ANTLR start "expr"
    expr: function() {
        var retval = new HiloParser.expr_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

         var chainExpr28 = null;


        try {
            // antlr\\Hilo.g:201:5: ( chainExpr )
            // antlr\\Hilo.g:201:7: chainExpr
            root_0 = this.adaptor.nil();

            this.pushFollow(HiloParser.FOLLOW_chainExpr_in_expr1494);
            chainExpr28=this.chainExpr();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, chainExpr28.getTree());



            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    iterate_return: (function() {
        HiloParser.iterate_return = function(){};
        org.antlr.lang.extend(HiloParser.iterate_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:204:1: iterate : ITERATE LPAR (func= expr COMMA (base= FIELD | base= MEASURE_FIELD )? COMMA dims= expr ) RPAR -> ^( ITERATE_FUNCTION $func ( $base)? $dims) ;
    // $ANTLR start "iterate"
    iterate: function() {
        var retval = new HiloParser.iterate_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var base = null;
        var ITERATE29 = null;
        var LPAR30 = null;
        var COMMA31 = null;
        var COMMA32 = null;
        var RPAR33 = null;
         var func = null;
         var dims = null;

        var base_tree=null;
        var ITERATE29_tree=null;
        var LPAR30_tree=null;
        var COMMA31_tree=null;
        var COMMA32_tree=null;
        var RPAR33_tree=null;
        var stream_COMMA=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token COMMA");
        var stream_MEASURE_FIELD=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token MEASURE_FIELD");
        var stream_LPAR=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token LPAR");
        var stream_FIELD=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token FIELD");
        var stream_RPAR=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token RPAR");
        var stream_ITERATE=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token ITERATE");
        var stream_expr=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule expr");
        try {
            // antlr\\Hilo.g:205:5: ( ITERATE LPAR (func= expr COMMA (base= FIELD | base= MEASURE_FIELD )? COMMA dims= expr ) RPAR -> ^( ITERATE_FUNCTION $func ( $base)? $dims) )
            // antlr\\Hilo.g:205:7: ITERATE LPAR (func= expr COMMA (base= FIELD | base= MEASURE_FIELD )? COMMA dims= expr ) RPAR
            ITERATE29=this.match(this.input,ITERATE,HiloParser.FOLLOW_ITERATE_in_iterate1511); if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_ITERATE.add(ITERATE29);

            LPAR30=this.match(this.input,LPAR,HiloParser.FOLLOW_LPAR_in_iterate1513); if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_LPAR.add(LPAR30);

            // antlr\\Hilo.g:205:20: (func= expr COMMA (base= FIELD | base= MEASURE_FIELD )? COMMA dims= expr )
            // antlr\\Hilo.g:205:21: func= expr COMMA (base= FIELD | base= MEASURE_FIELD )? COMMA dims= expr
            this.pushFollow(HiloParser.FOLLOW_expr_in_iterate1518);
            func=this.expr();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_expr.add(func.getTree());
            COMMA31=this.match(this.input,COMMA,HiloParser.FOLLOW_COMMA_in_iterate1520); if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_COMMA.add(COMMA31);

            // antlr\\Hilo.g:205:37: (base= FIELD | base= MEASURE_FIELD )?
            var alt7=3;
            switch ( this.input.LA(1) ) {
                case FIELD:
                    alt7=1;
                    break;
                case MEASURE_FIELD:
                    alt7=2;
                    break;
            }

            switch (alt7) {
                case 1 :
                    // antlr\\Hilo.g:205:38: base= FIELD
                    base=this.match(this.input,FIELD,HiloParser.FOLLOW_FIELD_in_iterate1525); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_FIELD.add(base);



                    break;
                case 2 :
                    // antlr\\Hilo.g:205:51: base= MEASURE_FIELD
                    base=this.match(this.input,MEASURE_FIELD,HiloParser.FOLLOW_MEASURE_FIELD_in_iterate1531); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_MEASURE_FIELD.add(base);



                    break;

            }

            COMMA32=this.match(this.input,COMMA,HiloParser.FOLLOW_COMMA_in_iterate1535); if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_COMMA.add(COMMA32);

            this.pushFollow(HiloParser.FOLLOW_expr_in_iterate1539);
            dims=this.expr();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_expr.add(dims.getTree());



            RPAR33=this.match(this.input,RPAR,HiloParser.FOLLOW_RPAR_in_iterate1542); if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_RPAR.add(RPAR33);



            // AST REWRITE
            // elements: dims, base, func
            // token labels: base
            // rule labels: dims, func, retval
            // token list labels:
            // rule list labels:
            if ( this.state.backtracking===0 ) {
            retval.tree = root_0;
            var stream_base=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token base",base);
            var stream_dims=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token dims",dims!=null?dims.tree:null);
            var stream_func=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token func",func!=null?func.tree:null);
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 205:94: -> ^( ITERATE_FUNCTION $func ( $base)? $dims)
            {
                // antlr\\Hilo.g:205:97: ^( ITERATE_FUNCTION $func ( $base)? $dims)
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(ITERATE_FUNCTION, "ITERATE_FUNCTION"), root_1);

                this.adaptor.addChild(root_1, stream_func.nextTree());
                // antlr\\Hilo.g:205:122: ( $base)?
                if ( stream_base.hasNext() ) {
                    this.adaptor.addChild(root_1, stream_base.nextNode());

                }
                stream_base.reset();
                this.adaptor.addChild(root_1, stream_dims.nextTree());

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;}


            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    cagr_return: (function() {
        HiloParser.cagr_return = function(){};
        org.antlr.lang.extend(HiloParser.cagr_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:208:1: cagr : ( CAGR LPAR (measure= FIELD | measure= MEASURE_FIELD ) COMMA (start= STRING | start= FIELD ) COMMA (end= STRING | end= FIELD ) RPAR -> ^( CAGR_FORMULA $measure $start $end) | CAGR LPAR (measure= FIELD | measure= MEASURE_FIELD ) COMMA dimension= FIELD COMMA (start= STRING | start= FIELD ) COMMA (end= STRING | end= FIELD ) RPAR -> ^( CAGR_FORMULA_WITH_DIMENSION $measure $start $end $dimension) );
    // $ANTLR start "cagr"
    cagr: function() {
        var retval = new HiloParser.cagr_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var measure = null;
        var start = null;
        var end = null;
        var dimension = null;
        var CAGR34 = null;
        var LPAR35 = null;
        var COMMA36 = null;
        var COMMA37 = null;
        var RPAR38 = null;
        var CAGR39 = null;
        var LPAR40 = null;
        var COMMA41 = null;
        var COMMA42 = null;
        var COMMA43 = null;
        var RPAR44 = null;

        var measure_tree=null;
        var start_tree=null;
        var end_tree=null;
        var dimension_tree=null;
        var CAGR34_tree=null;
        var LPAR35_tree=null;
        var COMMA36_tree=null;
        var COMMA37_tree=null;
        var RPAR38_tree=null;
        var CAGR39_tree=null;
        var LPAR40_tree=null;
        var COMMA41_tree=null;
        var COMMA42_tree=null;
        var COMMA43_tree=null;
        var RPAR44_tree=null;
        var stream_COMMA=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token COMMA");
        var stream_MEASURE_FIELD=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token MEASURE_FIELD");
        var stream_CAGR=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token CAGR");
        var stream_LPAR=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token LPAR");
        var stream_FIELD=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token FIELD");
        var stream_STRING=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token STRING");
        var stream_RPAR=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token RPAR");

        try {
            // antlr\\Hilo.g:209:5: ( CAGR LPAR (measure= FIELD | measure= MEASURE_FIELD ) COMMA (start= STRING | start= FIELD ) COMMA (end= STRING | end= FIELD ) RPAR -> ^( CAGR_FORMULA $measure $start $end) | CAGR LPAR (measure= FIELD | measure= MEASURE_FIELD ) COMMA dimension= FIELD COMMA (start= STRING | start= FIELD ) COMMA (end= STRING | end= FIELD ) RPAR -> ^( CAGR_FORMULA_WITH_DIMENSION $measure $start $end $dimension) )
            var alt14=2;
            alt14 = this.dfa14.predict(this.input);
            switch (alt14) {
                case 1 :
                    // antlr\\Hilo.g:209:7: CAGR LPAR (measure= FIELD | measure= MEASURE_FIELD ) COMMA (start= STRING | start= FIELD ) COMMA (end= STRING | end= FIELD ) RPAR
                    CAGR34=this.match(this.input,CAGR,HiloParser.FOLLOW_CAGR_in_cagr1575); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_CAGR.add(CAGR34);

                    LPAR35=this.match(this.input,LPAR,HiloParser.FOLLOW_LPAR_in_cagr1577); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_LPAR.add(LPAR35);

                    // antlr\\Hilo.g:209:17: (measure= FIELD | measure= MEASURE_FIELD )
                    var alt8=2;
                    switch ( this.input.LA(1) ) {
                    case FIELD:
                        alt8=1;
                        break;
                    case MEASURE_FIELD:
                        alt8=2;
                        break;
                    default:
                        if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 8, 0, this.input);

                        throw nvae;
                    }

                    switch (alt8) {
                        case 1 :
                            // antlr\\Hilo.g:209:18: measure= FIELD
                            measure=this.match(this.input,FIELD,HiloParser.FOLLOW_FIELD_in_cagr1582); if (this.state.failed) return retval;
                            if ( this.state.backtracking===0 ) stream_FIELD.add(measure);



                            break;
                        case 2 :
                            // antlr\\Hilo.g:209:34: measure= MEASURE_FIELD
                            measure=this.match(this.input,MEASURE_FIELD,HiloParser.FOLLOW_MEASURE_FIELD_in_cagr1588); if (this.state.failed) return retval;
                            if ( this.state.backtracking===0 ) stream_MEASURE_FIELD.add(measure);



                            break;

                    }

                    COMMA36=this.match(this.input,COMMA,HiloParser.FOLLOW_COMMA_in_cagr1591); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_COMMA.add(COMMA36);

                    // antlr\\Hilo.g:209:63: (start= STRING | start= FIELD )
                    var alt9=2;
                    switch ( this.input.LA(1) ) {
                    case STRING:
                        alt9=1;
                        break;
                    case FIELD:
                        alt9=2;
                        break;
                    default:
                        if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 9, 0, this.input);

                        throw nvae;
                    }

                    switch (alt9) {
                        case 1 :
                            // antlr\\Hilo.g:209:64: start= STRING
                            start=this.match(this.input,STRING,HiloParser.FOLLOW_STRING_in_cagr1596); if (this.state.failed) return retval;
                            if ( this.state.backtracking===0 ) stream_STRING.add(start);



                            break;
                        case 2 :
                            // antlr\\Hilo.g:209:79: start= FIELD
                            start=this.match(this.input,FIELD,HiloParser.FOLLOW_FIELD_in_cagr1602); if (this.state.failed) return retval;
                            if ( this.state.backtracking===0 ) stream_FIELD.add(start);



                            break;

                    }

                    COMMA37=this.match(this.input,COMMA,HiloParser.FOLLOW_COMMA_in_cagr1605); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_COMMA.add(COMMA37);

                    // antlr\\Hilo.g:209:98: (end= STRING | end= FIELD )
                    var alt10=2;
                    switch ( this.input.LA(1) ) {
                    case STRING:
                        alt10=1;
                        break;
                    case FIELD:
                        alt10=2;
                        break;
                    default:
                        if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 10, 0, this.input);

                        throw nvae;
                    }

                    switch (alt10) {
                        case 1 :
                            // antlr\\Hilo.g:209:99: end= STRING
                            end=this.match(this.input,STRING,HiloParser.FOLLOW_STRING_in_cagr1610); if (this.state.failed) return retval;
                            if ( this.state.backtracking===0 ) stream_STRING.add(end);



                            break;
                        case 2 :
                            // antlr\\Hilo.g:209:112: end= FIELD
                            end=this.match(this.input,FIELD,HiloParser.FOLLOW_FIELD_in_cagr1616); if (this.state.failed) return retval;
                            if ( this.state.backtracking===0 ) stream_FIELD.add(end);



                            break;

                    }

                    RPAR38=this.match(this.input,RPAR,HiloParser.FOLLOW_RPAR_in_cagr1619); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_RPAR.add(RPAR38);



                    // AST REWRITE
                    // elements: start, end, measure
                    // token labels: measure, start, end
                    // rule labels: retval
                    // token list labels:
                    // rule list labels:
                    if ( this.state.backtracking===0 ) {
                    retval.tree = root_0;
                    var stream_measure=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token measure",measure);
                    var stream_start=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token start",start);
                    var stream_end=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token end",end);
                    var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

                    root_0 = this.adaptor.nil();
                    // 209:129: -> ^( CAGR_FORMULA $measure $start $end)
                    {
                        // antlr\\Hilo.g:209:133: ^( CAGR_FORMULA $measure $start $end)
                        {
                        var root_1 = this.adaptor.nil();
                        root_1 = this.adaptor.becomeRoot(this.adaptor.create(CAGR_FORMULA, "CAGR_FORMULA"), root_1);

                        this.adaptor.addChild(root_1, stream_measure.nextNode());
                        this.adaptor.addChild(root_1, stream_start.nextNode());
                        this.adaptor.addChild(root_1, stream_end.nextNode());

                        this.adaptor.addChild(root_0, root_1);
                        }

                    }

                    retval.tree = root_0;}

                    break;
                case 2 :
                    // antlr\\Hilo.g:210:7: CAGR LPAR (measure= FIELD | measure= MEASURE_FIELD ) COMMA dimension= FIELD COMMA (start= STRING | start= FIELD ) COMMA (end= STRING | end= FIELD ) RPAR
                    CAGR39=this.match(this.input,CAGR,HiloParser.FOLLOW_CAGR_in_cagr1644); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_CAGR.add(CAGR39);

                    LPAR40=this.match(this.input,LPAR,HiloParser.FOLLOW_LPAR_in_cagr1646); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_LPAR.add(LPAR40);

                    // antlr\\Hilo.g:210:17: (measure= FIELD | measure= MEASURE_FIELD )
                    var alt11=2;
                    switch ( this.input.LA(1) ) {
                    case FIELD:
                        alt11=1;
                        break;
                    case MEASURE_FIELD:
                        alt11=2;
                        break;
                    default:
                        if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 11, 0, this.input);

                        throw nvae;
                    }

                    switch (alt11) {
                        case 1 :
                            // antlr\\Hilo.g:210:18: measure= FIELD
                            measure=this.match(this.input,FIELD,HiloParser.FOLLOW_FIELD_in_cagr1651); if (this.state.failed) return retval;
                            if ( this.state.backtracking===0 ) stream_FIELD.add(measure);



                            break;
                        case 2 :
                            // antlr\\Hilo.g:210:34: measure= MEASURE_FIELD
                            measure=this.match(this.input,MEASURE_FIELD,HiloParser.FOLLOW_MEASURE_FIELD_in_cagr1657); if (this.state.failed) return retval;
                            if ( this.state.backtracking===0 ) stream_MEASURE_FIELD.add(measure);



                            break;

                    }

                    COMMA41=this.match(this.input,COMMA,HiloParser.FOLLOW_COMMA_in_cagr1660); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_COMMA.add(COMMA41);

                    dimension=this.match(this.input,FIELD,HiloParser.FOLLOW_FIELD_in_cagr1664); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_FIELD.add(dimension);

                    COMMA42=this.match(this.input,COMMA,HiloParser.FOLLOW_COMMA_in_cagr1666); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_COMMA.add(COMMA42);

                    // antlr\\Hilo.g:210:85: (start= STRING | start= FIELD )
                    var alt12=2;
                    switch ( this.input.LA(1) ) {
                    case STRING:
                        alt12=1;
                        break;
                    case FIELD:
                        alt12=2;
                        break;
                    default:
                        if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 12, 0, this.input);

                        throw nvae;
                    }

                    switch (alt12) {
                        case 1 :
                            // antlr\\Hilo.g:210:86: start= STRING
                            start=this.match(this.input,STRING,HiloParser.FOLLOW_STRING_in_cagr1671); if (this.state.failed) return retval;
                            if ( this.state.backtracking===0 ) stream_STRING.add(start);



                            break;
                        case 2 :
                            // antlr\\Hilo.g:210:101: start= FIELD
                            start=this.match(this.input,FIELD,HiloParser.FOLLOW_FIELD_in_cagr1677); if (this.state.failed) return retval;
                            if ( this.state.backtracking===0 ) stream_FIELD.add(start);



                            break;

                    }

                    COMMA43=this.match(this.input,COMMA,HiloParser.FOLLOW_COMMA_in_cagr1680); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_COMMA.add(COMMA43);

                    // antlr\\Hilo.g:210:120: (end= STRING | end= FIELD )
                    var alt13=2;
                    switch ( this.input.LA(1) ) {
                    case STRING:
                        alt13=1;
                        break;
                    case FIELD:
                        alt13=2;
                        break;
                    default:
                        if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 13, 0, this.input);

                        throw nvae;
                    }

                    switch (alt13) {
                        case 1 :
                            // antlr\\Hilo.g:210:121: end= STRING
                            end=this.match(this.input,STRING,HiloParser.FOLLOW_STRING_in_cagr1685); if (this.state.failed) return retval;
                            if ( this.state.backtracking===0 ) stream_STRING.add(end);



                            break;
                        case 2 :
                            // antlr\\Hilo.g:210:134: end= FIELD
                            end=this.match(this.input,FIELD,HiloParser.FOLLOW_FIELD_in_cagr1691); if (this.state.failed) return retval;
                            if ( this.state.backtracking===0 ) stream_FIELD.add(end);



                            break;

                    }

                    RPAR44=this.match(this.input,RPAR,HiloParser.FOLLOW_RPAR_in_cagr1694); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_RPAR.add(RPAR44);



                    // AST REWRITE
                    // elements: start, measure, end, dimension
                    // token labels: measure, start, end, dimension
                    // rule labels: retval
                    // token list labels:
                    // rule list labels:
                    if ( this.state.backtracking===0 ) {
                    retval.tree = root_0;
                    var stream_measure=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token measure",measure);
                    var stream_start=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token start",start);
                    var stream_end=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token end",end);
                    var stream_dimension=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token dimension",dimension);
                    var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

                    root_0 = this.adaptor.nil();
                    // 210:151: -> ^( CAGR_FORMULA_WITH_DIMENSION $measure $start $end $dimension)
                    {
                        // antlr\\Hilo.g:210:155: ^( CAGR_FORMULA_WITH_DIMENSION $measure $start $end $dimension)
                        {
                        var root_1 = this.adaptor.nil();
                        root_1 = this.adaptor.becomeRoot(this.adaptor.create(CAGR_FORMULA_WITH_DIMENSION, "CAGR_FORMULA_WITH_DIMENSION"), root_1);

                        this.adaptor.addChild(root_1, stream_measure.nextNode());
                        this.adaptor.addChild(root_1, stream_start.nextNode());
                        this.adaptor.addChild(root_1, stream_end.nextNode());
                        this.adaptor.addChild(root_1, stream_dimension.nextNode());

                        this.adaptor.addChild(root_0, root_1);
                        }

                    }

                    retval.tree = root_0;}

                    break;

            }
            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    sma_return: (function() {
        HiloParser.sma_return = function(){};
        org.antlr.lang.extend(HiloParser.sma_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:213:1: sma : ( SMA LPAR (measure= FIELD | measure= MEASURE_FIELD ) COMMA timeGran= STRING COMMA period= INTEGER RPAR -> ^( SMA_FORMULA $measure $timeGran $period) | SMA LPAR (measure= FIELD | measure= MEASURE_FIELD ) COMMA dimension= FIELD COMMA timeGran= STRING COMMA period= INTEGER RPAR -> ^( SMA_FORMULA_WITH_DIMENSION $measure $timeGran $period $dimension) );
    // $ANTLR start "sma"
    sma: function() {
        var retval = new HiloParser.sma_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var measure = null;
        var timeGran = null;
        var period = null;
        var dimension = null;
        var SMA45 = null;
        var LPAR46 = null;
        var COMMA47 = null;
        var COMMA48 = null;
        var RPAR49 = null;
        var SMA50 = null;
        var LPAR51 = null;
        var COMMA52 = null;
        var COMMA53 = null;
        var COMMA54 = null;
        var RPAR55 = null;

        var measure_tree=null;
        var timeGran_tree=null;
        var period_tree=null;
        var dimension_tree=null;
        var SMA45_tree=null;
        var LPAR46_tree=null;
        var COMMA47_tree=null;
        var COMMA48_tree=null;
        var RPAR49_tree=null;
        var SMA50_tree=null;
        var LPAR51_tree=null;
        var COMMA52_tree=null;
        var COMMA53_tree=null;
        var COMMA54_tree=null;
        var RPAR55_tree=null;
        var stream_COMMA=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token COMMA");
        var stream_MEASURE_FIELD=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token MEASURE_FIELD");
        var stream_SMA=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token SMA");
        var stream_LPAR=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token LPAR");
        var stream_FIELD=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token FIELD");
        var stream_STRING=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token STRING");
        var stream_RPAR=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token RPAR");
        var stream_INTEGER=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token INTEGER");

        try {
            // antlr\\Hilo.g:214:5: ( SMA LPAR (measure= FIELD | measure= MEASURE_FIELD ) COMMA timeGran= STRING COMMA period= INTEGER RPAR -> ^( SMA_FORMULA $measure $timeGran $period) | SMA LPAR (measure= FIELD | measure= MEASURE_FIELD ) COMMA dimension= FIELD COMMA timeGran= STRING COMMA period= INTEGER RPAR -> ^( SMA_FORMULA_WITH_DIMENSION $measure $timeGran $period $dimension) )
            var alt17=2;
            switch ( this.input.LA(1) ) {
            case SMA:
                switch ( this.input.LA(2) ) {
                case LPAR:
                    switch ( this.input.LA(3) ) {
                    case FIELD:
                        switch ( this.input.LA(4) ) {
                        case COMMA:
                            switch ( this.input.LA(5) ) {
                            case STRING:
                                alt17=1;
                                break;
                            case FIELD:
                                alt17=2;
                                break;
                            default:
                                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                                var nvae =
                                    new org.antlr.runtime.NoViableAltException("", 17, 5, this.input);

                                throw nvae;
                            }

                            break;
                        default:
                            if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                            var nvae =
                                new org.antlr.runtime.NoViableAltException("", 17, 3, this.input);

                            throw nvae;
                        }

                        break;
                    case MEASURE_FIELD:
                        switch ( this.input.LA(4) ) {
                        case COMMA:
                            switch ( this.input.LA(5) ) {
                            case STRING:
                                alt17=1;
                                break;
                            case FIELD:
                                alt17=2;
                                break;
                            default:
                                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                                var nvae =
                                    new org.antlr.runtime.NoViableAltException("", 17, 5, this.input);

                                throw nvae;
                            }

                            break;
                        default:
                            if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                            var nvae =
                                new org.antlr.runtime.NoViableAltException("", 17, 4, this.input);

                            throw nvae;
                        }

                        break;
                    default:
                        if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 17, 2, this.input);

                        throw nvae;
                    }

                    break;
                default:
                    if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                    var nvae =
                        new org.antlr.runtime.NoViableAltException("", 17, 1, this.input);

                    throw nvae;
                }

                break;
            default:
                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 17, 0, this.input);

                throw nvae;
            }

            switch (alt17) {
                case 1 :
                    // antlr\\Hilo.g:214:7: SMA LPAR (measure= FIELD | measure= MEASURE_FIELD ) COMMA timeGran= STRING COMMA period= INTEGER RPAR
                    SMA45=this.match(this.input,SMA,HiloParser.FOLLOW_SMA_in_sma1731); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_SMA.add(SMA45);

                    LPAR46=this.match(this.input,LPAR,HiloParser.FOLLOW_LPAR_in_sma1733); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_LPAR.add(LPAR46);

                    // antlr\\Hilo.g:214:16: (measure= FIELD | measure= MEASURE_FIELD )
                    var alt15=2;
                    switch ( this.input.LA(1) ) {
                    case FIELD:
                        alt15=1;
                        break;
                    case MEASURE_FIELD:
                        alt15=2;
                        break;
                    default:
                        if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 15, 0, this.input);

                        throw nvae;
                    }

                    switch (alt15) {
                        case 1 :
                            // antlr\\Hilo.g:214:17: measure= FIELD
                            measure=this.match(this.input,FIELD,HiloParser.FOLLOW_FIELD_in_sma1738); if (this.state.failed) return retval;
                            if ( this.state.backtracking===0 ) stream_FIELD.add(measure);



                            break;
                        case 2 :
                            // antlr\\Hilo.g:214:33: measure= MEASURE_FIELD
                            measure=this.match(this.input,MEASURE_FIELD,HiloParser.FOLLOW_MEASURE_FIELD_in_sma1744); if (this.state.failed) return retval;
                            if ( this.state.backtracking===0 ) stream_MEASURE_FIELD.add(measure);



                            break;

                    }

                    COMMA47=this.match(this.input,COMMA,HiloParser.FOLLOW_COMMA_in_sma1747); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_COMMA.add(COMMA47);

                    timeGran=this.match(this.input,STRING,HiloParser.FOLLOW_STRING_in_sma1751); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_STRING.add(timeGran);

                    COMMA48=this.match(this.input,COMMA,HiloParser.FOLLOW_COMMA_in_sma1753); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_COMMA.add(COMMA48);

                    period=this.match(this.input,INTEGER,HiloParser.FOLLOW_INTEGER_in_sma1757); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_INTEGER.add(period);

                    RPAR49=this.match(this.input,RPAR,HiloParser.FOLLOW_RPAR_in_sma1759); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_RPAR.add(RPAR49);



                    // AST REWRITE
                    // elements: measure, timeGran, period
                    // token labels: period, measure, timeGran
                    // rule labels: retval
                    // token list labels:
                    // rule list labels:
                    if ( this.state.backtracking===0 ) {
                    retval.tree = root_0;
                    var stream_period=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token period",period);
                    var stream_measure=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token measure",measure);
                    var stream_timeGran=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token timeGran",timeGran);
                    var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

                    root_0 = this.adaptor.nil();
                    // 214:105: -> ^( SMA_FORMULA $measure $timeGran $period)
                    {
                        // antlr\\Hilo.g:214:109: ^( SMA_FORMULA $measure $timeGran $period)
                        {
                        var root_1 = this.adaptor.nil();
                        root_1 = this.adaptor.becomeRoot(this.adaptor.create(SMA_FORMULA, "SMA_FORMULA"), root_1);

                        this.adaptor.addChild(root_1, stream_measure.nextNode());
                        this.adaptor.addChild(root_1, stream_timeGran.nextNode());
                        this.adaptor.addChild(root_1, stream_period.nextNode());

                        this.adaptor.addChild(root_0, root_1);
                        }

                    }

                    retval.tree = root_0;}

                    break;
                case 2 :
                    // antlr\\Hilo.g:215:7: SMA LPAR (measure= FIELD | measure= MEASURE_FIELD ) COMMA dimension= FIELD COMMA timeGran= STRING COMMA period= INTEGER RPAR
                    SMA50=this.match(this.input,SMA,HiloParser.FOLLOW_SMA_in_sma1784); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_SMA.add(SMA50);

                    LPAR51=this.match(this.input,LPAR,HiloParser.FOLLOW_LPAR_in_sma1786); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_LPAR.add(LPAR51);

                    // antlr\\Hilo.g:215:16: (measure= FIELD | measure= MEASURE_FIELD )
                    var alt16=2;
                    switch ( this.input.LA(1) ) {
                    case FIELD:
                        alt16=1;
                        break;
                    case MEASURE_FIELD:
                        alt16=2;
                        break;
                    default:
                        if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 16, 0, this.input);

                        throw nvae;
                    }

                    switch (alt16) {
                        case 1 :
                            // antlr\\Hilo.g:215:17: measure= FIELD
                            measure=this.match(this.input,FIELD,HiloParser.FOLLOW_FIELD_in_sma1791); if (this.state.failed) return retval;
                            if ( this.state.backtracking===0 ) stream_FIELD.add(measure);



                            break;
                        case 2 :
                            // antlr\\Hilo.g:215:33: measure= MEASURE_FIELD
                            measure=this.match(this.input,MEASURE_FIELD,HiloParser.FOLLOW_MEASURE_FIELD_in_sma1797); if (this.state.failed) return retval;
                            if ( this.state.backtracking===0 ) stream_MEASURE_FIELD.add(measure);



                            break;

                    }

                    COMMA52=this.match(this.input,COMMA,HiloParser.FOLLOW_COMMA_in_sma1800); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_COMMA.add(COMMA52);

                    dimension=this.match(this.input,FIELD,HiloParser.FOLLOW_FIELD_in_sma1804); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_FIELD.add(dimension);

                    COMMA53=this.match(this.input,COMMA,HiloParser.FOLLOW_COMMA_in_sma1806); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_COMMA.add(COMMA53);

                    timeGran=this.match(this.input,STRING,HiloParser.FOLLOW_STRING_in_sma1810); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_STRING.add(timeGran);

                    COMMA54=this.match(this.input,COMMA,HiloParser.FOLLOW_COMMA_in_sma1812); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_COMMA.add(COMMA54);

                    period=this.match(this.input,INTEGER,HiloParser.FOLLOW_INTEGER_in_sma1816); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_INTEGER.add(period);

                    RPAR55=this.match(this.input,RPAR,HiloParser.FOLLOW_RPAR_in_sma1818); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_RPAR.add(RPAR55);



                    // AST REWRITE
                    // elements: timeGran, period, dimension, measure
                    // token labels: period, measure, timeGran, dimension
                    // rule labels: retval
                    // token list labels:
                    // rule list labels:
                    if ( this.state.backtracking===0 ) {
                    retval.tree = root_0;
                    var stream_period=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token period",period);
                    var stream_measure=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token measure",measure);
                    var stream_timeGran=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token timeGran",timeGran);
                    var stream_dimension=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token dimension",dimension);
                    var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

                    root_0 = this.adaptor.nil();
                    // 215:127: -> ^( SMA_FORMULA_WITH_DIMENSION $measure $timeGran $period $dimension)
                    {
                        // antlr\\Hilo.g:215:131: ^( SMA_FORMULA_WITH_DIMENSION $measure $timeGran $period $dimension)
                        {
                        var root_1 = this.adaptor.nil();
                        root_1 = this.adaptor.becomeRoot(this.adaptor.create(SMA_FORMULA_WITH_DIMENSION, "SMA_FORMULA_WITH_DIMENSION"), root_1);

                        this.adaptor.addChild(root_1, stream_measure.nextNode());
                        this.adaptor.addChild(root_1, stream_timeGran.nextNode());
                        this.adaptor.addChild(root_1, stream_period.nextNode());
                        this.adaptor.addChild(root_1, stream_dimension.nextNode());

                        this.adaptor.addChild(root_0, root_1);
                        }

                    }

                    retval.tree = root_0;}

                    break;

            }
            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    yoy_return: (function() {
        HiloParser.yoy_return = function(){};
        org.antlr.lang.extend(HiloParser.yoy_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:218:1: yoy : ( YOY LPAR (measure= FIELD | measure= MEASURE_FIELD ) RPAR -> ^( YOY_FORMULA $measure) | YOY LPAR (measure= FIELD | measure= MEASURE_FIELD ) COMMA dimension= FIELD RPAR -> ^( YOY_FORMULA_WITH_DIMENSION $measure $dimension) );
    // $ANTLR start "yoy"
    yoy: function() {
        var retval = new HiloParser.yoy_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var measure = null;
        var dimension = null;
        var YOY56 = null;
        var LPAR57 = null;
        var RPAR58 = null;
        var YOY59 = null;
        var LPAR60 = null;
        var COMMA61 = null;
        var RPAR62 = null;

        var measure_tree=null;
        var dimension_tree=null;
        var YOY56_tree=null;
        var LPAR57_tree=null;
        var RPAR58_tree=null;
        var YOY59_tree=null;
        var LPAR60_tree=null;
        var COMMA61_tree=null;
        var RPAR62_tree=null;
        var stream_COMMA=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token COMMA");
        var stream_YOY=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token YOY");
        var stream_MEASURE_FIELD=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token MEASURE_FIELD");
        var stream_LPAR=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token LPAR");
        var stream_FIELD=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token FIELD");
        var stream_RPAR=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token RPAR");

        try {
            // antlr\\Hilo.g:219:5: ( YOY LPAR (measure= FIELD | measure= MEASURE_FIELD ) RPAR -> ^( YOY_FORMULA $measure) | YOY LPAR (measure= FIELD | measure= MEASURE_FIELD ) COMMA dimension= FIELD RPAR -> ^( YOY_FORMULA_WITH_DIMENSION $measure $dimension) )
            var alt20=2;
            switch ( this.input.LA(1) ) {
            case YOY:
                switch ( this.input.LA(2) ) {
                case LPAR:
                    switch ( this.input.LA(3) ) {
                    case FIELD:
                        switch ( this.input.LA(4) ) {
                        case RPAR:
                            alt20=1;
                            break;
                        case COMMA:
                            alt20=2;
                            break;
                        default:
                            if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                            var nvae =
                                new org.antlr.runtime.NoViableAltException("", 20, 3, this.input);

                            throw nvae;
                        }

                        break;
                    case MEASURE_FIELD:
                        switch ( this.input.LA(4) ) {
                        case RPAR:
                            alt20=1;
                            break;
                        case COMMA:
                            alt20=2;
                            break;
                        default:
                            if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                            var nvae =
                                new org.antlr.runtime.NoViableAltException("", 20, 4, this.input);

                            throw nvae;
                        }

                        break;
                    default:
                        if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 20, 2, this.input);

                        throw nvae;
                    }

                    break;
                default:
                    if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                    var nvae =
                        new org.antlr.runtime.NoViableAltException("", 20, 1, this.input);

                    throw nvae;
                }

                break;
            default:
                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 20, 0, this.input);

                throw nvae;
            }

            switch (alt20) {
                case 1 :
                    // antlr\\Hilo.g:219:7: YOY LPAR (measure= FIELD | measure= MEASURE_FIELD ) RPAR
                    YOY56=this.match(this.input,YOY,HiloParser.FOLLOW_YOY_in_yoy1855); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_YOY.add(YOY56);

                    LPAR57=this.match(this.input,LPAR,HiloParser.FOLLOW_LPAR_in_yoy1857); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_LPAR.add(LPAR57);

                    // antlr\\Hilo.g:219:16: (measure= FIELD | measure= MEASURE_FIELD )
                    var alt18=2;
                    switch ( this.input.LA(1) ) {
                    case FIELD:
                        alt18=1;
                        break;
                    case MEASURE_FIELD:
                        alt18=2;
                        break;
                    default:
                        if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 18, 0, this.input);

                        throw nvae;
                    }

                    switch (alt18) {
                        case 1 :
                            // antlr\\Hilo.g:219:17: measure= FIELD
                            measure=this.match(this.input,FIELD,HiloParser.FOLLOW_FIELD_in_yoy1862); if (this.state.failed) return retval;
                            if ( this.state.backtracking===0 ) stream_FIELD.add(measure);



                            break;
                        case 2 :
                            // antlr\\Hilo.g:219:33: measure= MEASURE_FIELD
                            measure=this.match(this.input,MEASURE_FIELD,HiloParser.FOLLOW_MEASURE_FIELD_in_yoy1868); if (this.state.failed) return retval;
                            if ( this.state.backtracking===0 ) stream_MEASURE_FIELD.add(measure);



                            break;

                    }

                    RPAR58=this.match(this.input,RPAR,HiloParser.FOLLOW_RPAR_in_yoy1871); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_RPAR.add(RPAR58);



                    // AST REWRITE
                    // elements: measure
                    // token labels: measure
                    // rule labels: retval
                    // token list labels:
                    // rule list labels:
                    if ( this.state.backtracking===0 ) {
                    retval.tree = root_0;
                    var stream_measure=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token measure",measure);
                    var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

                    root_0 = this.adaptor.nil();
                    // 219:62: -> ^( YOY_FORMULA $measure)
                    {
                        // antlr\\Hilo.g:219:66: ^( YOY_FORMULA $measure)
                        {
                        var root_1 = this.adaptor.nil();
                        root_1 = this.adaptor.becomeRoot(this.adaptor.create(YOY_FORMULA, "YOY_FORMULA"), root_1);

                        this.adaptor.addChild(root_1, stream_measure.nextNode());

                        this.adaptor.addChild(root_0, root_1);
                        }

                    }

                    retval.tree = root_0;}

                    break;
                case 2 :
                    // antlr\\Hilo.g:220:7: YOY LPAR (measure= FIELD | measure= MEASURE_FIELD ) COMMA dimension= FIELD RPAR
                    YOY59=this.match(this.input,YOY,HiloParser.FOLLOW_YOY_in_yoy1890); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_YOY.add(YOY59);

                    LPAR60=this.match(this.input,LPAR,HiloParser.FOLLOW_LPAR_in_yoy1892); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_LPAR.add(LPAR60);

                    // antlr\\Hilo.g:220:16: (measure= FIELD | measure= MEASURE_FIELD )
                    var alt19=2;
                    switch ( this.input.LA(1) ) {
                    case FIELD:
                        alt19=1;
                        break;
                    case MEASURE_FIELD:
                        alt19=2;
                        break;
                    default:
                        if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 19, 0, this.input);

                        throw nvae;
                    }

                    switch (alt19) {
                        case 1 :
                            // antlr\\Hilo.g:220:17: measure= FIELD
                            measure=this.match(this.input,FIELD,HiloParser.FOLLOW_FIELD_in_yoy1897); if (this.state.failed) return retval;
                            if ( this.state.backtracking===0 ) stream_FIELD.add(measure);



                            break;
                        case 2 :
                            // antlr\\Hilo.g:220:33: measure= MEASURE_FIELD
                            measure=this.match(this.input,MEASURE_FIELD,HiloParser.FOLLOW_MEASURE_FIELD_in_yoy1903); if (this.state.failed) return retval;
                            if ( this.state.backtracking===0 ) stream_MEASURE_FIELD.add(measure);



                            break;

                    }

                    COMMA61=this.match(this.input,COMMA,HiloParser.FOLLOW_COMMA_in_yoy1906); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_COMMA.add(COMMA61);

                    dimension=this.match(this.input,FIELD,HiloParser.FOLLOW_FIELD_in_yoy1910); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_FIELD.add(dimension);

                    RPAR62=this.match(this.input,RPAR,HiloParser.FOLLOW_RPAR_in_yoy1912); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_RPAR.add(RPAR62);



                    // AST REWRITE
                    // elements: dimension, measure
                    // token labels: measure, dimension
                    // rule labels: retval
                    // token list labels:
                    // rule list labels:
                    if ( this.state.backtracking===0 ) {
                    retval.tree = root_0;
                    var stream_measure=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token measure",measure);
                    var stream_dimension=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token dimension",dimension);
                    var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

                    root_0 = this.adaptor.nil();
                    // 220:84: -> ^( YOY_FORMULA_WITH_DIMENSION $measure $dimension)
                    {
                        // antlr\\Hilo.g:220:88: ^( YOY_FORMULA_WITH_DIMENSION $measure $dimension)
                        {
                        var root_1 = this.adaptor.nil();
                        root_1 = this.adaptor.becomeRoot(this.adaptor.create(YOY_FORMULA_WITH_DIMENSION, "YOY_FORMULA_WITH_DIMENSION"), root_1);

                        this.adaptor.addChild(root_1, stream_measure.nextNode());
                        this.adaptor.addChild(root_1, stream_dimension.nextNode());

                        this.adaptor.addChild(root_0, root_1);
                        }

                    }

                    retval.tree = root_0;}

                    break;

            }
            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    link_return: (function() {
        HiloParser.link_return = function(){};
        org.antlr.lang.extend(HiloParser.link_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:223:1: link : LINK LPAR model= FIELD COMMA (measure= FIELD | measure= MEASURE_FIELD ) COMMA (pov= povExpr )? RPAR -> ^( LINK_FORMULA $model $measure ( $pov)? ) ;
    // $ANTLR start "link"
    link: function() {
        var retval = new HiloParser.link_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var model = null;
        var measure = null;
        var LINK63 = null;
        var LPAR64 = null;
        var COMMA65 = null;
        var COMMA66 = null;
        var RPAR67 = null;
         var pov = null;

        var model_tree=null;
        var measure_tree=null;
        var LINK63_tree=null;
        var LPAR64_tree=null;
        var COMMA65_tree=null;
        var COMMA66_tree=null;
        var RPAR67_tree=null;
        var stream_COMMA=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token COMMA");
        var stream_MEASURE_FIELD=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token MEASURE_FIELD");
        var stream_LPAR=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token LPAR");
        var stream_FIELD=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token FIELD");
        var stream_LINK=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token LINK");
        var stream_RPAR=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token RPAR");
        var stream_povExpr=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule povExpr");
        try {
            // antlr\\Hilo.g:224:5: ( LINK LPAR model= FIELD COMMA (measure= FIELD | measure= MEASURE_FIELD ) COMMA (pov= povExpr )? RPAR -> ^( LINK_FORMULA $model $measure ( $pov)? ) )
            // antlr\\Hilo.g:224:7: LINK LPAR model= FIELD COMMA (measure= FIELD | measure= MEASURE_FIELD ) COMMA (pov= povExpr )? RPAR
            LINK63=this.match(this.input,LINK,HiloParser.FOLLOW_LINK_in_link1943); if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_LINK.add(LINK63);

            LPAR64=this.match(this.input,LPAR,HiloParser.FOLLOW_LPAR_in_link1945); if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_LPAR.add(LPAR64);

            model=this.match(this.input,FIELD,HiloParser.FOLLOW_FIELD_in_link1949); if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_FIELD.add(model);

            COMMA65=this.match(this.input,COMMA,HiloParser.FOLLOW_COMMA_in_link1951); if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_COMMA.add(COMMA65);

            // antlr\\Hilo.g:224:35: (measure= FIELD | measure= MEASURE_FIELD )
            var alt21=2;
            switch ( this.input.LA(1) ) {
            case FIELD:
                alt21=1;
                break;
            case MEASURE_FIELD:
                alt21=2;
                break;
            default:
                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 21, 0, this.input);

                throw nvae;
            }

            switch (alt21) {
                case 1 :
                    // antlr\\Hilo.g:224:36: measure= FIELD
                    measure=this.match(this.input,FIELD,HiloParser.FOLLOW_FIELD_in_link1956); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_FIELD.add(measure);



                    break;
                case 2 :
                    // antlr\\Hilo.g:224:52: measure= MEASURE_FIELD
                    measure=this.match(this.input,MEASURE_FIELD,HiloParser.FOLLOW_MEASURE_FIELD_in_link1962); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_MEASURE_FIELD.add(measure);



                    break;

            }

            COMMA66=this.match(this.input,COMMA,HiloParser.FOLLOW_COMMA_in_link1965); if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_COMMA.add(COMMA66);

            // antlr\\Hilo.g:224:81: (pov= povExpr )?
            var alt22=2;
            switch ( this.input.LA(1) ) {
                case FIELD:
                case MEASURE_FIELD:
                    alt22=1;
                    break;
            }

            switch (alt22) {
                case 1 :
                    // antlr\\Hilo.g:224:82: pov= povExpr
                    this.pushFollow(HiloParser.FOLLOW_povExpr_in_link1970);
                    pov=this.povExpr();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_povExpr.add(pov.getTree());


                    break;

            }

            RPAR67=this.match(this.input,RPAR,HiloParser.FOLLOW_RPAR_in_link1974); if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_RPAR.add(RPAR67);



            // AST REWRITE
            // elements: measure, model, pov
            // token labels: measure, model
            // rule labels: pov, retval
            // token list labels:
            // rule list labels:
            if ( this.state.backtracking===0 ) {
            retval.tree = root_0;
            var stream_measure=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token measure",measure);
            var stream_model=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token model",model);
            var stream_pov=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token pov",pov!=null?pov.tree:null);
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 224:102: -> ^( LINK_FORMULA $model $measure ( $pov)? )
            {
                // antlr\\Hilo.g:224:106: ^( LINK_FORMULA $model $measure ( $pov)? )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(LINK_FORMULA, "LINK_FORMULA"), root_1);

                this.adaptor.addChild(root_1, stream_model.nextNode());
                this.adaptor.addChild(root_1, stream_measure.nextNode());
                // antlr\\Hilo.g:224:137: ( $pov)?
                if ( stream_pov.hasNext() ) {
                    this.adaptor.addChild(root_1, stream_pov.nextTree());

                }
                stream_pov.reset();

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;}


            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    povExpr_return: (function() {
        HiloParser.povExpr_return = function(){};
        org.antlr.lang.extend(HiloParser.povExpr_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:226:1: povExpr : povSelectExpr ( AND povSelectExpr )* ;
    // $ANTLR start "povExpr"
    povExpr: function() {
        var retval = new HiloParser.povExpr_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var AND69 = null;
         var povSelectExpr68 = null;
         var povSelectExpr70 = null;

        var AND69_tree=null;

        try {
            // antlr\\Hilo.g:227:5: ( povSelectExpr ( AND povSelectExpr )* )
            // antlr\\Hilo.g:227:7: povSelectExpr ( AND povSelectExpr )*
            root_0 = this.adaptor.nil();

            this.pushFollow(HiloParser.FOLLOW_povSelectExpr_in_povExpr2008);
            povSelectExpr68=this.povSelectExpr();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, povSelectExpr68.getTree());
            // antlr\\Hilo.g:227:21: ( AND povSelectExpr )*
            loop23:
            do {
                var alt23=2;
                switch ( this.input.LA(1) ) {
                case AND:
                    alt23=1;
                    break;

                }

                switch (alt23) {
                case 1 :
                    // antlr\\Hilo.g:227:22: AND povSelectExpr
                    AND69=this.match(this.input,AND,HiloParser.FOLLOW_AND_in_povExpr2011); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) {
                    AND69_tree = this.adaptor.create(AND69);
                    root_0 = this.adaptor.becomeRoot(AND69_tree, root_0);
                    }
                    this.pushFollow(HiloParser.FOLLOW_povSelectExpr_in_povExpr2014);
                    povSelectExpr70=this.povSelectExpr();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, povSelectExpr70.getTree());


                    break;

                default :
                    break loop23;
                }
            } while (true);




            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    povSelectExpr_return: (function() {
        HiloParser.povSelectExpr_return = function(){};
        org.antlr.lang.extend(HiloParser.povSelectExpr_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:230:1: povSelectExpr options {backtrack=true; } : ( ( FIELD | MEASURE_FIELD ) EQ stringArrayExpr | ( FIELD | MEASURE_FIELD ) EQ STRING );
    // $ANTLR start "povSelectExpr"
    povSelectExpr: function() {
        var retval = new HiloParser.povSelectExpr_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var set71 = null;
        var EQ72 = null;
        var set74 = null;
        var EQ75 = null;
        var STRING76 = null;
         var stringArrayExpr73 = null;

        var set71_tree=null;
        var EQ72_tree=null;
        var set74_tree=null;
        var EQ75_tree=null;
        var STRING76_tree=null;

        try {
            // antlr\\Hilo.g:232:5: ( ( FIELD | MEASURE_FIELD ) EQ stringArrayExpr | ( FIELD | MEASURE_FIELD ) EQ STRING )
            var alt24=2;
            switch ( this.input.LA(1) ) {
            case FIELD:
            case MEASURE_FIELD:
                switch ( this.input.LA(2) ) {
                case EQ:
                    switch ( this.input.LA(3) ) {
                    case STRING:
                        alt24=2;
                        break;
                    case LPAR:
                        alt24=1;
                        break;
                    default:
                        if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 24, 2, this.input);

                        throw nvae;
                    }

                    break;
                default:
                    if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                    var nvae =
                        new org.antlr.runtime.NoViableAltException("", 24, 1, this.input);

                    throw nvae;
                }

                break;
            default:
                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 24, 0, this.input);

                throw nvae;
            }

            switch (alt24) {
                case 1 :
                    // antlr\\Hilo.g:232:7: ( FIELD | MEASURE_FIELD ) EQ stringArrayExpr
                    root_0 = this.adaptor.nil();

                    set71=this.input.LT(1);
                    if ( (this.input.LA(1)>=FIELD && this.input.LA(1)<=MEASURE_FIELD) ) {
                        this.input.consume();
                        if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, this.adaptor.create(set71));
                        this.state.errorRecovery=false;this.state.failed=false;
                    }
                    else {
                        if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        throw mse;
                    }

                    EQ72=this.match(this.input,EQ,HiloParser.FOLLOW_EQ_in_povSelectExpr2048); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) {
                    EQ72_tree = this.adaptor.create(EQ72);
                    root_0 = this.adaptor.becomeRoot(EQ72_tree, root_0);
                    }
                    this.pushFollow(HiloParser.FOLLOW_stringArrayExpr_in_povSelectExpr2051);
                    stringArrayExpr73=this.stringArrayExpr();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, stringArrayExpr73.getTree());


                    break;
                case 2 :
                    // antlr\\Hilo.g:233:7: ( FIELD | MEASURE_FIELD ) EQ STRING
                    root_0 = this.adaptor.nil();

                    set74=this.input.LT(1);
                    if ( (this.input.LA(1)>=FIELD && this.input.LA(1)<=MEASURE_FIELD) ) {
                        this.input.consume();
                        if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, this.adaptor.create(set74));
                        this.state.errorRecovery=false;this.state.failed=false;
                    }
                    else {
                        if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        throw mse;
                    }

                    EQ75=this.match(this.input,EQ,HiloParser.FOLLOW_EQ_in_povSelectExpr2067); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) {
                    EQ75_tree = this.adaptor.create(EQ75);
                    root_0 = this.adaptor.becomeRoot(EQ75_tree, root_0);
                    }
                    STRING76=this.match(this.input,STRING,HiloParser.FOLLOW_STRING_in_povSelectExpr2070); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) {
                    STRING76_tree = this.adaptor.create(STRING76);
                    this.adaptor.addChild(root_0, STRING76_tree);
                    }


                    break;

            }
            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    lookup_return: (function() {
        HiloParser.lookup_return = function(){};
        org.antlr.lang.extend(HiloParser.lookup_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:236:1: lookup : ( LOOKUP LPAR (measure= FIELD | measure= MEASURE_FIELD ) dummy1= COMMA dummy2= COMMA dims= expr RPAR -> ^( LOOKUP_FORMULA $measure $dummy1 $dummy2 $dims) | LOOKUP LPAR (measure= FIELD | measure= MEASURE_FIELD ) COMMA pov= expr ( COMMA dims= expr )? RPAR -> ^( LOOKUP_FORMULA $measure $pov ( $dims)? ) );
    // $ANTLR start "lookup"
    lookup: function() {
        var retval = new HiloParser.lookup_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var measure = null;
        var dummy1 = null;
        var dummy2 = null;
        var LOOKUP77 = null;
        var LPAR78 = null;
        var RPAR79 = null;
        var LOOKUP80 = null;
        var LPAR81 = null;
        var COMMA82 = null;
        var COMMA83 = null;
        var RPAR84 = null;
         var dims = null;
         var pov = null;

        var measure_tree=null;
        var dummy1_tree=null;
        var dummy2_tree=null;
        var LOOKUP77_tree=null;
        var LPAR78_tree=null;
        var RPAR79_tree=null;
        var LOOKUP80_tree=null;
        var LPAR81_tree=null;
        var COMMA82_tree=null;
        var COMMA83_tree=null;
        var RPAR84_tree=null;
        var stream_COMMA=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token COMMA");
        var stream_MEASURE_FIELD=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token MEASURE_FIELD");
        var stream_LOOKUP=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token LOOKUP");
        var stream_LPAR=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token LPAR");
        var stream_FIELD=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token FIELD");
        var stream_RPAR=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token RPAR");
        var stream_expr=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule expr");
        try {
            // antlr\\Hilo.g:237:5: ( LOOKUP LPAR (measure= FIELD | measure= MEASURE_FIELD ) dummy1= COMMA dummy2= COMMA dims= expr RPAR -> ^( LOOKUP_FORMULA $measure $dummy1 $dummy2 $dims) | LOOKUP LPAR (measure= FIELD | measure= MEASURE_FIELD ) COMMA pov= expr ( COMMA dims= expr )? RPAR -> ^( LOOKUP_FORMULA $measure $pov ( $dims)? ) )
            var alt28=2;
            switch ( this.input.LA(1) ) {
            case LOOKUP:
                switch ( this.input.LA(2) ) {
                case LPAR:
                    switch ( this.input.LA(3) ) {
                    case FIELD:
                        switch ( this.input.LA(4) ) {
                        case COMMA:
                            switch ( this.input.LA(5) ) {
                            case COMMA:
                                alt28=1;
                                break;
                            case PLUS:
                            case MINUS:
                            case LPAR:
                            case NOT:
                            case ITERATE:
                            case NULL:
                            case TRUE:
                            case FALSE:
                            case YES:
                            case NO:
                            case STRING:
                            case FIELD:
                            case MEASURE_FIELD:
                            case INTEGER:
                            case DOUBLE:
                            case DATE_TIME:
                            case DOT_SEP_STRING:
                            case DQ_ALLOW_ESC_REGEX_STRING:
                            case ATTRIBUTE:
                            case OLD_ATTRIBUTE:
                            case IDENTIFIER:
                                alt28=2;
                                break;
                            default:
                                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                                var nvae =
                                    new org.antlr.runtime.NoViableAltException("", 28, 5, this.input);

                                throw nvae;
                            }

                            break;
                        default:
                            if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                            var nvae =
                                new org.antlr.runtime.NoViableAltException("", 28, 3, this.input);

                            throw nvae;
                        }

                        break;
                    case MEASURE_FIELD:
                        switch ( this.input.LA(4) ) {
                        case COMMA:
                            switch ( this.input.LA(5) ) {
                            case COMMA:
                                alt28=1;
                                break;
                            case PLUS:
                            case MINUS:
                            case LPAR:
                            case NOT:
                            case ITERATE:
                            case NULL:
                            case TRUE:
                            case FALSE:
                            case YES:
                            case NO:
                            case STRING:
                            case FIELD:
                            case MEASURE_FIELD:
                            case INTEGER:
                            case DOUBLE:
                            case DATE_TIME:
                            case DOT_SEP_STRING:
                            case DQ_ALLOW_ESC_REGEX_STRING:
                            case ATTRIBUTE:
                            case OLD_ATTRIBUTE:
                            case IDENTIFIER:
                                alt28=2;
                                break;
                            default:
                                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                                var nvae =
                                    new org.antlr.runtime.NoViableAltException("", 28, 5, this.input);

                                throw nvae;
                            }

                            break;
                        default:
                            if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                            var nvae =
                                new org.antlr.runtime.NoViableAltException("", 28, 4, this.input);

                            throw nvae;
                        }

                        break;
                    default:
                        if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 28, 2, this.input);

                        throw nvae;
                    }

                    break;
                default:
                    if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                    var nvae =
                        new org.antlr.runtime.NoViableAltException("", 28, 1, this.input);

                    throw nvae;
                }

                break;
            default:
                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 28, 0, this.input);

                throw nvae;
            }

            switch (alt28) {
                case 1 :
                    // antlr\\Hilo.g:237:7: LOOKUP LPAR (measure= FIELD | measure= MEASURE_FIELD ) dummy1= COMMA dummy2= COMMA dims= expr RPAR
                    LOOKUP77=this.match(this.input,LOOKUP,HiloParser.FOLLOW_LOOKUP_in_lookup2087); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_LOOKUP.add(LOOKUP77);

                    LPAR78=this.match(this.input,LPAR,HiloParser.FOLLOW_LPAR_in_lookup2089); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_LPAR.add(LPAR78);

                    // antlr\\Hilo.g:237:19: (measure= FIELD | measure= MEASURE_FIELD )
                    var alt25=2;
                    switch ( this.input.LA(1) ) {
                    case FIELD:
                        alt25=1;
                        break;
                    case MEASURE_FIELD:
                        alt25=2;
                        break;
                    default:
                        if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 25, 0, this.input);

                        throw nvae;
                    }

                    switch (alt25) {
                        case 1 :
                            // antlr\\Hilo.g:237:20: measure= FIELD
                            measure=this.match(this.input,FIELD,HiloParser.FOLLOW_FIELD_in_lookup2094); if (this.state.failed) return retval;
                            if ( this.state.backtracking===0 ) stream_FIELD.add(measure);



                            break;
                        case 2 :
                            // antlr\\Hilo.g:237:36: measure= MEASURE_FIELD
                            measure=this.match(this.input,MEASURE_FIELD,HiloParser.FOLLOW_MEASURE_FIELD_in_lookup2100); if (this.state.failed) return retval;
                            if ( this.state.backtracking===0 ) stream_MEASURE_FIELD.add(measure);



                            break;

                    }

                    dummy1=this.match(this.input,COMMA,HiloParser.FOLLOW_COMMA_in_lookup2105); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_COMMA.add(dummy1);

                    dummy2=this.match(this.input,COMMA,HiloParser.FOLLOW_COMMA_in_lookup2109); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_COMMA.add(dummy2);

                    this.pushFollow(HiloParser.FOLLOW_expr_in_lookup2113);
                    dims=this.expr();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_expr.add(dims.getTree());
                    RPAR79=this.match(this.input,RPAR,HiloParser.FOLLOW_RPAR_in_lookup2115); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_RPAR.add(RPAR79);



                    // AST REWRITE
                    // elements: dims, dummy1, dummy2, measure
                    // token labels: dummy1, dummy2, measure
                    // rule labels: dims, retval
                    // token list labels:
                    // rule list labels:
                    if ( this.state.backtracking===0 ) {
                    retval.tree = root_0;
                    var stream_dummy1=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token dummy1",dummy1);
                    var stream_dummy2=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token dummy2",dummy2);
                    var stream_measure=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token measure",measure);
                    var stream_dims=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token dims",dims!=null?dims.tree:null);
                    var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

                    root_0 = this.adaptor.nil();
                    // 237:103: -> ^( LOOKUP_FORMULA $measure $dummy1 $dummy2 $dims)
                    {
                        // antlr\\Hilo.g:237:106: ^( LOOKUP_FORMULA $measure $dummy1 $dummy2 $dims)
                        {
                        var root_1 = this.adaptor.nil();
                        root_1 = this.adaptor.becomeRoot(this.adaptor.create(LOOKUP_FORMULA, "LOOKUP_FORMULA"), root_1);

                        this.adaptor.addChild(root_1, stream_measure.nextNode());
                        this.adaptor.addChild(root_1, stream_dummy1.nextNode());
                        this.adaptor.addChild(root_1, stream_dummy2.nextNode());
                        this.adaptor.addChild(root_1, stream_dims.nextTree());

                        this.adaptor.addChild(root_0, root_1);
                        }

                    }

                    retval.tree = root_0;}

                    break;
                case 2 :
                    // antlr\\Hilo.g:238:7: LOOKUP LPAR (measure= FIELD | measure= MEASURE_FIELD ) COMMA pov= expr ( COMMA dims= expr )? RPAR
                    LOOKUP80=this.match(this.input,LOOKUP,HiloParser.FOLLOW_LOOKUP_in_lookup2144); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_LOOKUP.add(LOOKUP80);

                    LPAR81=this.match(this.input,LPAR,HiloParser.FOLLOW_LPAR_in_lookup2146); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_LPAR.add(LPAR81);

                    // antlr\\Hilo.g:238:19: (measure= FIELD | measure= MEASURE_FIELD )
                    var alt26=2;
                    switch ( this.input.LA(1) ) {
                    case FIELD:
                        alt26=1;
                        break;
                    case MEASURE_FIELD:
                        alt26=2;
                        break;
                    default:
                        if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 26, 0, this.input);

                        throw nvae;
                    }

                    switch (alt26) {
                        case 1 :
                            // antlr\\Hilo.g:238:20: measure= FIELD
                            measure=this.match(this.input,FIELD,HiloParser.FOLLOW_FIELD_in_lookup2151); if (this.state.failed) return retval;
                            if ( this.state.backtracking===0 ) stream_FIELD.add(measure);



                            break;
                        case 2 :
                            // antlr\\Hilo.g:238:36: measure= MEASURE_FIELD
                            measure=this.match(this.input,MEASURE_FIELD,HiloParser.FOLLOW_MEASURE_FIELD_in_lookup2157); if (this.state.failed) return retval;
                            if ( this.state.backtracking===0 ) stream_MEASURE_FIELD.add(measure);



                            break;

                    }

                    COMMA82=this.match(this.input,COMMA,HiloParser.FOLLOW_COMMA_in_lookup2160); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_COMMA.add(COMMA82);

                    this.pushFollow(HiloParser.FOLLOW_expr_in_lookup2164);
                    pov=this.expr();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_expr.add(pov.getTree());
                    // antlr\\Hilo.g:238:74: ( COMMA dims= expr )?
                    var alt27=2;
                    switch ( this.input.LA(1) ) {
                        case COMMA:
                            alt27=1;
                            break;
                    }

                    switch (alt27) {
                        case 1 :
                            // antlr\\Hilo.g:238:75: COMMA dims= expr
                            COMMA83=this.match(this.input,COMMA,HiloParser.FOLLOW_COMMA_in_lookup2167); if (this.state.failed) return retval;
                            if ( this.state.backtracking===0 ) stream_COMMA.add(COMMA83);

                            this.pushFollow(HiloParser.FOLLOW_expr_in_lookup2171);
                            dims=this.expr();

                            this.state._fsp--;
                            if (this.state.failed) return retval;
                            if ( this.state.backtracking===0 ) stream_expr.add(dims.getTree());


                            break;

                    }

                    RPAR84=this.match(this.input,RPAR,HiloParser.FOLLOW_RPAR_in_lookup2175); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_RPAR.add(RPAR84);



                    // AST REWRITE
                    // elements: measure, dims, pov
                    // token labels: measure
                    // rule labels: dims, pov, retval
                    // token list labels:
                    // rule list labels:
                    if ( this.state.backtracking===0 ) {
                    retval.tree = root_0;
                    var stream_measure=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token measure",measure);
                    var stream_dims=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token dims",dims!=null?dims.tree:null);
                    var stream_pov=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token pov",pov!=null?pov.tree:null);
                    var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

                    root_0 = this.adaptor.nil();
                    // 238:101: -> ^( LOOKUP_FORMULA $measure $pov ( $dims)? )
                    {
                        // antlr\\Hilo.g:238:104: ^( LOOKUP_FORMULA $measure $pov ( $dims)? )
                        {
                        var root_1 = this.adaptor.nil();
                        root_1 = this.adaptor.becomeRoot(this.adaptor.create(LOOKUP_FORMULA, "LOOKUP_FORMULA"), root_1);

                        this.adaptor.addChild(root_1, stream_measure.nextNode());
                        this.adaptor.addChild(root_1, stream_pov.nextTree());
                        // antlr\\Hilo.g:238:135: ( $dims)?
                        if ( stream_dims.hasNext() ) {
                            this.adaptor.addChild(root_1, stream_dims.nextTree());

                        }
                        stream_dims.reset();

                        this.adaptor.addChild(root_0, root_1);
                        }

                    }

                    retval.tree = root_0;}

                    break;

            }
            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    orExpr_return: (function() {
        HiloParser.orExpr_return = function(){};
        org.antlr.lang.extend(HiloParser.orExpr_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:241:1: orExpr : andExpr ( OR andExpr )* ;
    // $ANTLR start "orExpr"
    orExpr: function() {
        var retval = new HiloParser.orExpr_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var OR86 = null;
         var andExpr85 = null;
         var andExpr87 = null;

        var OR86_tree=null;

        try {
            // antlr\\Hilo.g:242:5: ( andExpr ( OR andExpr )* )
            // antlr\\Hilo.g:242:7: andExpr ( OR andExpr )*
            root_0 = this.adaptor.nil();

            this.pushFollow(HiloParser.FOLLOW_andExpr_in_orExpr2211);
            andExpr85=this.andExpr();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, andExpr85.getTree());
            // antlr\\Hilo.g:242:15: ( OR andExpr )*
            loop29:
            do {
                var alt29=2;
                switch ( this.input.LA(1) ) {
                case OR:
                    alt29=1;
                    break;

                }

                switch (alt29) {
                case 1 :
                    // antlr\\Hilo.g:242:16: OR andExpr
                    OR86=this.match(this.input,OR,HiloParser.FOLLOW_OR_in_orExpr2214); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) {
                    OR86_tree = this.adaptor.create(OR86);
                    root_0 = this.adaptor.becomeRoot(OR86_tree, root_0);
                    }
                    this.pushFollow(HiloParser.FOLLOW_andExpr_in_orExpr2217);
                    andExpr87=this.andExpr();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, andExpr87.getTree());


                    break;

                default :
                    break loop29;
                }
            } while (true);




            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    andExpr_return: (function() {
        HiloParser.andExpr_return = function(){};
        org.antlr.lang.extend(HiloParser.andExpr_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:245:1: andExpr : equalExpr ( AND equalExpr )* ;
    // $ANTLR start "andExpr"
    andExpr: function() {
        var retval = new HiloParser.andExpr_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var AND89 = null;
         var equalExpr88 = null;
         var equalExpr90 = null;

        var AND89_tree=null;

        try {
            // antlr\\Hilo.g:246:5: ( equalExpr ( AND equalExpr )* )
            // antlr\\Hilo.g:246:7: equalExpr ( AND equalExpr )*
            root_0 = this.adaptor.nil();

            this.pushFollow(HiloParser.FOLLOW_equalExpr_in_andExpr2236);
            equalExpr88=this.equalExpr();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, equalExpr88.getTree());
            // antlr\\Hilo.g:246:17: ( AND equalExpr )*
            loop30:
            do {
                var alt30=2;
                switch ( this.input.LA(1) ) {
                case AND:
                    alt30=1;
                    break;

                }

                switch (alt30) {
                case 1 :
                    // antlr\\Hilo.g:246:18: AND equalExpr
                    AND89=this.match(this.input,AND,HiloParser.FOLLOW_AND_in_andExpr2239); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) {
                    AND89_tree = this.adaptor.create(AND89);
                    root_0 = this.adaptor.becomeRoot(AND89_tree, root_0);
                    }
                    this.pushFollow(HiloParser.FOLLOW_equalExpr_in_andExpr2242);
                    equalExpr90=this.equalExpr();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, equalExpr90.getTree());


                    break;

                default :
                    break loop30;
                }
            } while (true);




            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    chainExpr_return: (function() {
        HiloParser.chainExpr_return = function(){};
        org.antlr.lang.extend(HiloParser.chainExpr_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:248:1: chainExpr : orExpr ( PIPE orExpr )? ;
    // $ANTLR start "chainExpr"
    chainExpr: function() {
        var retval = new HiloParser.chainExpr_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var PIPE92 = null;
         var orExpr91 = null;
         var orExpr93 = null;

        var PIPE92_tree=null;

        try {
            // antlr\\Hilo.g:249:5: ( orExpr ( PIPE orExpr )? )
            // antlr\\Hilo.g:249:7: orExpr ( PIPE orExpr )?
            root_0 = this.adaptor.nil();

            this.pushFollow(HiloParser.FOLLOW_orExpr_in_chainExpr2260);
            orExpr91=this.orExpr();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, orExpr91.getTree());
            // antlr\\Hilo.g:249:14: ( PIPE orExpr )?
            var alt31=2;
            switch ( this.input.LA(1) ) {
                case PIPE:
                    alt31=1;
                    break;
            }

            switch (alt31) {
                case 1 :
                    // antlr\\Hilo.g:249:15: PIPE orExpr
                    PIPE92=this.match(this.input,PIPE,HiloParser.FOLLOW_PIPE_in_chainExpr2263); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) {
                    PIPE92_tree = this.adaptor.create(PIPE92);
                    root_0 = this.adaptor.becomeRoot(PIPE92_tree, root_0);
                    }
                    this.pushFollow(HiloParser.FOLLOW_orExpr_in_chainExpr2266);
                    orExpr93=this.orExpr();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, orExpr93.getTree());


                    break;

            }




            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    equalOp_return: (function() {
        HiloParser.equalOp_return = function(){};
        org.antlr.lang.extend(HiloParser.equalOp_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:251:10: fragment equalOp : ( EQ | NEQ | ASSIGN );
    // $ANTLR start "equalOp"
    equalOp: function() {
        var retval = new HiloParser.equalOp_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var set94 = null;

        var set94_tree=null;

        try {
            // antlr\\Hilo.g:251:18: ( EQ | NEQ | ASSIGN )
            // antlr\\Hilo.g:
            root_0 = this.adaptor.nil();

            set94=this.input.LT(1);
            if ( (this.input.LA(1)>=EQ && this.input.LA(1)<=NEQ)||this.input.LA(1)==ASSIGN ) {
                this.input.consume();
                if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, this.adaptor.create(set94));
                this.state.errorRecovery=false;this.state.failed=false;
            }
            else {
                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                throw mse;
            }




            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    equalExpr_return: (function() {
        HiloParser.equalExpr_return = function(){};
        org.antlr.lang.extend(HiloParser.equalExpr_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:252:1: equalExpr options {backtrack=true; } : ( object equalOp arrayExpr | comparisonExpr ( equalOp comparisonExpr )? );
    // $ANTLR start "equalExpr"
    equalExpr: function() {
        var retval = new HiloParser.equalExpr_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

         var object95 = null;
         var equalOp96 = null;
         var arrayExpr97 = null;
         var comparisonExpr98 = null;
         var equalOp99 = null;
         var comparisonExpr100 = null;


        try {
            // antlr\\Hilo.g:254:5: ( object equalOp arrayExpr | comparisonExpr ( equalOp comparisonExpr )? )
            var alt33=2;
            alt33 = this.dfa33.predict(this.input);
            switch (alt33) {
                case 1 :
                    // antlr\\Hilo.g:254:7: object equalOp arrayExpr
                    root_0 = this.adaptor.nil();

                    this.pushFollow(HiloParser.FOLLOW_object_in_equalExpr2308);
                    object95=this.object();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, object95.getTree());
                    this.pushFollow(HiloParser.FOLLOW_equalOp_in_equalExpr2310);
                    equalOp96=this.equalOp();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) root_0 = this.adaptor.becomeRoot(equalOp96.getTree(), root_0);
                    this.pushFollow(HiloParser.FOLLOW_arrayExpr_in_equalExpr2313);
                    arrayExpr97=this.arrayExpr();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, arrayExpr97.getTree());


                    break;
                case 2 :
                    // antlr\\Hilo.g:255:7: comparisonExpr ( equalOp comparisonExpr )?
                    root_0 = this.adaptor.nil();

                    this.pushFollow(HiloParser.FOLLOW_comparisonExpr_in_equalExpr2321);
                    comparisonExpr98=this.comparisonExpr();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, comparisonExpr98.getTree());
                    // antlr\\Hilo.g:255:22: ( equalOp comparisonExpr )?
                    var alt32=2;
                    switch ( this.input.LA(1) ) {
                        case EQ:
                        case NEQ:
                        case ASSIGN:
                            alt32=1;
                            break;
                    }

                    switch (alt32) {
                        case 1 :
                            // antlr\\Hilo.g:255:23: equalOp comparisonExpr
                            this.pushFollow(HiloParser.FOLLOW_equalOp_in_equalExpr2324);
                            equalOp99=this.equalOp();

                            this.state._fsp--;
                            if (this.state.failed) return retval;
                            if ( this.state.backtracking===0 ) root_0 = this.adaptor.becomeRoot(equalOp99.getTree(), root_0);
                            this.pushFollow(HiloParser.FOLLOW_comparisonExpr_in_equalExpr2327);
                            comparisonExpr100=this.comparisonExpr();

                            this.state._fsp--;
                            if (this.state.failed) return retval;
                            if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, comparisonExpr100.getTree());


                            break;

                    }



                    break;

            }
            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    compOp_return: (function() {
        HiloParser.compOp_return = function(){};
        org.antlr.lang.extend(HiloParser.compOp_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:258:10: fragment compOp : ( LT | GT | GTE | LTE );
    // $ANTLR start "compOp"
    compOp: function() {
        var retval = new HiloParser.compOp_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var set101 = null;

        var set101_tree=null;

        try {
            // antlr\\Hilo.g:258:17: ( LT | GT | GTE | LTE )
            // antlr\\Hilo.g:
            root_0 = this.adaptor.nil();

            set101=this.input.LT(1);
            if ( (this.input.LA(1)>=LT && this.input.LA(1)<=LTE) ) {
                this.input.consume();
                if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, this.adaptor.create(set101));
                this.state.errorRecovery=false;this.state.failed=false;
            }
            else {
                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                throw mse;
            }




            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    comparisonExpr_return: (function() {
        HiloParser.comparisonExpr_return = function(){};
        org.antlr.lang.extend(HiloParser.comparisonExpr_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:259:1: comparisonExpr : addExpr ( compOp addExpr )? ;
    // $ANTLR start "comparisonExpr"
    comparisonExpr: function() {
        var retval = new HiloParser.comparisonExpr_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

         var addExpr102 = null;
         var compOp103 = null;
         var addExpr104 = null;


        try {
            // antlr\\Hilo.g:260:5: ( addExpr ( compOp addExpr )? )
            // antlr\\Hilo.g:260:7: addExpr ( compOp addExpr )?
            root_0 = this.adaptor.nil();

            this.pushFollow(HiloParser.FOLLOW_addExpr_in_comparisonExpr2369);
            addExpr102=this.addExpr();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, addExpr102.getTree());
            // antlr\\Hilo.g:260:15: ( compOp addExpr )?
            var alt34=2;
            switch ( this.input.LA(1) ) {
                case LT:
                case GT:
                case GTE:
                case LTE:
                    alt34=1;
                    break;
            }

            switch (alt34) {
                case 1 :
                    // antlr\\Hilo.g:260:16: compOp addExpr
                    this.pushFollow(HiloParser.FOLLOW_compOp_in_comparisonExpr2372);
                    compOp103=this.compOp();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) root_0 = this.adaptor.becomeRoot(compOp103.getTree(), root_0);
                    this.pushFollow(HiloParser.FOLLOW_addExpr_in_comparisonExpr2376);
                    addExpr104=this.addExpr();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, addExpr104.getTree());


                    break;

            }




            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    addOp_return: (function() {
        HiloParser.addOp_return = function(){};
        org.antlr.lang.extend(HiloParser.addOp_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:263:10: fragment addOp : ( PLUS | MINUS );
    // $ANTLR start "addOp"
    addOp: function() {
        var retval = new HiloParser.addOp_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var set105 = null;

        var set105_tree=null;

        try {
            // antlr\\Hilo.g:263:16: ( PLUS | MINUS )
            // antlr\\Hilo.g:
            root_0 = this.adaptor.nil();

            set105=this.input.LT(1);
            if ( (this.input.LA(1)>=PLUS && this.input.LA(1)<=MINUS) ) {
                this.input.consume();
                if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, this.adaptor.create(set105));
                this.state.errorRecovery=false;this.state.failed=false;
            }
            else {
                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                throw mse;
            }




            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    addExpr_return: (function() {
        HiloParser.addExpr_return = function(){};
        org.antlr.lang.extend(HiloParser.addExpr_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:264:1: addExpr : multiplyExpr ( addOp multiplyExpr )* ;
    // $ANTLR start "addExpr"
    addExpr: function() {
        var retval = new HiloParser.addExpr_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

         var multiplyExpr106 = null;
         var addOp107 = null;
         var multiplyExpr108 = null;


        try {
            // antlr\\Hilo.g:265:5: ( multiplyExpr ( addOp multiplyExpr )* )
            // antlr\\Hilo.g:265:7: multiplyExpr ( addOp multiplyExpr )*
            root_0 = this.adaptor.nil();

            this.pushFollow(HiloParser.FOLLOW_multiplyExpr_in_addExpr2409);
            multiplyExpr106=this.multiplyExpr();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, multiplyExpr106.getTree());
            // antlr\\Hilo.g:265:20: ( addOp multiplyExpr )*
            loop35:
            do {
                var alt35=2;
                switch ( this.input.LA(1) ) {
                case PLUS:
                case MINUS:
                    alt35=1;
                    break;

                }

                switch (alt35) {
                case 1 :
                    // antlr\\Hilo.g:265:21: addOp multiplyExpr
                    this.pushFollow(HiloParser.FOLLOW_addOp_in_addExpr2412);
                    addOp107=this.addOp();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) root_0 = this.adaptor.becomeRoot(addOp107.getTree(), root_0);
                    this.pushFollow(HiloParser.FOLLOW_multiplyExpr_in_addExpr2416);
                    multiplyExpr108=this.multiplyExpr();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, multiplyExpr108.getTree());


                    break;

                default :
                    break loop35;
                }
            } while (true);




            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    multOp_return: (function() {
        HiloParser.multOp_return = function(){};
        org.antlr.lang.extend(HiloParser.multOp_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:268:10: fragment multOp : ( MULT | DIV | REM );
    // $ANTLR start "multOp"
    multOp: function() {
        var retval = new HiloParser.multOp_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var set109 = null;

        var set109_tree=null;

        try {
            // antlr\\Hilo.g:268:17: ( MULT | DIV | REM )
            // antlr\\Hilo.g:
            root_0 = this.adaptor.nil();

            set109=this.input.LT(1);
            if ( (this.input.LA(1)>=MULT && this.input.LA(1)<=REM) ) {
                this.input.consume();
                if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, this.adaptor.create(set109));
                this.state.errorRecovery=false;this.state.failed=false;
            }
            else {
                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                throw mse;
            }




            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    multiplyExpr_return: (function() {
        HiloParser.multiplyExpr_return = function(){};
        org.antlr.lang.extend(HiloParser.multiplyExpr_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:269:1: multiplyExpr : unaryExpr ( multOp unaryExpr )* ;
    // $ANTLR start "multiplyExpr"
    multiplyExpr: function() {
        var retval = new HiloParser.multiplyExpr_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

         var unaryExpr110 = null;
         var multOp111 = null;
         var unaryExpr112 = null;


        try {
            // antlr\\Hilo.g:270:5: ( unaryExpr ( multOp unaryExpr )* )
            // antlr\\Hilo.g:270:7: unaryExpr ( multOp unaryExpr )*
            root_0 = this.adaptor.nil();

            this.pushFollow(HiloParser.FOLLOW_unaryExpr_in_multiplyExpr2453);
            unaryExpr110=this.unaryExpr();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, unaryExpr110.getTree());
            // antlr\\Hilo.g:270:17: ( multOp unaryExpr )*
            loop36:
            do {
                var alt36=2;
                switch ( this.input.LA(1) ) {
                case MULT:
                case DIV:
                case REM:
                    alt36=1;
                    break;

                }

                switch (alt36) {
                case 1 :
                    // antlr\\Hilo.g:270:18: multOp unaryExpr
                    this.pushFollow(HiloParser.FOLLOW_multOp_in_multiplyExpr2456);
                    multOp111=this.multOp();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) root_0 = this.adaptor.becomeRoot(multOp111.getTree(), root_0);
                    this.pushFollow(HiloParser.FOLLOW_unaryExpr_in_multiplyExpr2459);
                    unaryExpr112=this.unaryExpr();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, unaryExpr112.getTree());


                    break;

                default :
                    break loop36;
                }
            } while (true);




            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    unaryExpr_return: (function() {
        HiloParser.unaryExpr_return = function(){};
        org.antlr.lang.extend(HiloParser.unaryExpr_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:273:1: unaryExpr : ( ( unaryOp unaryExpr ) | powerExpr );
    // $ANTLR start "unaryExpr"
    unaryExpr: function() {
        var retval = new HiloParser.unaryExpr_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

         var unaryOp113 = null;
         var unaryExpr114 = null;
         var powerExpr115 = null;


        try {
            // antlr\\Hilo.g:274:5: ( ( unaryOp unaryExpr ) | powerExpr )
            var alt37=2;
            switch ( this.input.LA(1) ) {
            case PLUS:
            case MINUS:
            case NOT:
                alt37=1;
                break;
            case LPAR:
            case ITERATE:
            case NULL:
            case TRUE:
            case FALSE:
            case YES:
            case NO:
            case STRING:
            case FIELD:
            case MEASURE_FIELD:
            case INTEGER:
            case DOUBLE:
            case DATE_TIME:
            case DOT_SEP_STRING:
            case DQ_ALLOW_ESC_REGEX_STRING:
            case ATTRIBUTE:
            case OLD_ATTRIBUTE:
            case IDENTIFIER:
                alt37=2;
                break;
            default:
                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 37, 0, this.input);

                throw nvae;
            }

            switch (alt37) {
                case 1 :
                    // antlr\\Hilo.g:274:7: ( unaryOp unaryExpr )
                    root_0 = this.adaptor.nil();

                    // antlr\\Hilo.g:274:7: ( unaryOp unaryExpr )
                    // antlr\\Hilo.g:274:8: unaryOp unaryExpr
                    this.pushFollow(HiloParser.FOLLOW_unaryOp_in_unaryExpr2479);
                    unaryOp113=this.unaryOp();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) root_0 = this.adaptor.becomeRoot(unaryOp113.getTree(), root_0);
                    this.pushFollow(HiloParser.FOLLOW_unaryExpr_in_unaryExpr2482);
                    unaryExpr114=this.unaryExpr();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, unaryExpr114.getTree());





                    break;
                case 2 :
                    // antlr\\Hilo.g:274:30: powerExpr
                    root_0 = this.adaptor.nil();

                    this.pushFollow(HiloParser.FOLLOW_powerExpr_in_unaryExpr2487);
                    powerExpr115=this.powerExpr();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, powerExpr115.getTree());


                    break;

            }
            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    unaryOp_return: (function() {
        HiloParser.unaryOp_return = function(){};
        org.antlr.lang.extend(HiloParser.unaryOp_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:277:1: unaryOp : ( PLUS -> UNARY_PLUS | MINUS -> UNARY_MINUS | NOT );
    // $ANTLR start "unaryOp"
    unaryOp: function() {
        var retval = new HiloParser.unaryOp_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var PLUS116 = null;
        var MINUS117 = null;
        var NOT118 = null;

        var PLUS116_tree=null;
        var MINUS117_tree=null;
        var NOT118_tree=null;
        var stream_PLUS=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token PLUS");
        var stream_MINUS=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token MINUS");

        try {
            // antlr\\Hilo.g:278:5: ( PLUS -> UNARY_PLUS | MINUS -> UNARY_MINUS | NOT )
            var alt38=3;
            switch ( this.input.LA(1) ) {
            case PLUS:
                alt38=1;
                break;
            case MINUS:
                alt38=2;
                break;
            case NOT:
                alt38=3;
                break;
            default:
                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 38, 0, this.input);

                throw nvae;
            }

            switch (alt38) {
                case 1 :
                    // antlr\\Hilo.g:278:7: PLUS
                    PLUS116=this.match(this.input,PLUS,HiloParser.FOLLOW_PLUS_in_unaryOp2504); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_PLUS.add(PLUS116);



                    // AST REWRITE
                    // elements:
                    // token labels:
                    // rule labels: retval
                    // token list labels:
                    // rule list labels:
                    if ( this.state.backtracking===0 ) {
                    retval.tree = root_0;
                    var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

                    root_0 = this.adaptor.nil();
                    // 278:21: -> UNARY_PLUS
                    {
                        this.adaptor.addChild(root_0, this.adaptor.create(UNARY_PLUS, "UNARY_PLUS"));

                    }

                    retval.tree = root_0;}

                    break;
                case 2 :
                    // antlr\\Hilo.g:279:7: MINUS
                    MINUS117=this.match(this.input,MINUS,HiloParser.FOLLOW_MINUS_in_unaryOp2525); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_MINUS.add(MINUS117);



                    // AST REWRITE
                    // elements:
                    // token labels:
                    // rule labels: retval
                    // token list labels:
                    // rule list labels:
                    if ( this.state.backtracking===0 ) {
                    retval.tree = root_0;
                    var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

                    root_0 = this.adaptor.nil();
                    // 279:21: -> UNARY_MINUS
                    {
                        this.adaptor.addChild(root_0, this.adaptor.create(UNARY_MINUS, "UNARY_MINUS"));

                    }

                    retval.tree = root_0;}

                    break;
                case 3 :
                    // antlr\\Hilo.g:280:7: NOT
                    root_0 = this.adaptor.nil();

                    NOT118=this.match(this.input,NOT,HiloParser.FOLLOW_NOT_in_unaryOp2545); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) {
                    NOT118_tree = this.adaptor.create(NOT118);
                    this.adaptor.addChild(root_0, NOT118_tree);
                    }


                    break;

            }
            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    powerExpr_return: (function() {
        HiloParser.powerExpr_return = function(){};
        org.antlr.lang.extend(HiloParser.powerExpr_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:283:1: powerExpr : factor ( POW factor )* ;
    // $ANTLR start "powerExpr"
    powerExpr: function() {
        var retval = new HiloParser.powerExpr_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var POW120 = null;
         var factor119 = null;
         var factor121 = null;

        var POW120_tree=null;

        try {
            // antlr\\Hilo.g:284:5: ( factor ( POW factor )* )
            // antlr\\Hilo.g:284:7: factor ( POW factor )*
            root_0 = this.adaptor.nil();

            this.pushFollow(HiloParser.FOLLOW_factor_in_powerExpr2562);
            factor119=this.factor();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, factor119.getTree());
            // antlr\\Hilo.g:284:14: ( POW factor )*
            loop39:
            do {
                var alt39=2;
                switch ( this.input.LA(1) ) {
                case POW:
                    alt39=1;
                    break;

                }

                switch (alt39) {
                case 1 :
                    // antlr\\Hilo.g:284:15: POW factor
                    POW120=this.match(this.input,POW,HiloParser.FOLLOW_POW_in_powerExpr2565); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) {
                    POW120_tree = this.adaptor.create(POW120);
                    root_0 = this.adaptor.becomeRoot(POW120_tree, root_0);
                    }
                    this.pushFollow(HiloParser.FOLLOW_factor_in_powerExpr2568);
                    factor121=this.factor();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, factor121.getTree());


                    break;

                default :
                    break loop39;
                }
            } while (true);




            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    factor_return: (function() {
        HiloParser.factor_return = function(){};
        org.antlr.lang.extend(HiloParser.factor_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:288:1: factor : ( primitive | parenthesizedExpr | functionCall | iterate );
    // $ANTLR start "factor"
    factor: function() {
        var retval = new HiloParser.factor_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

         var primitive122 = null;
         var parenthesizedExpr123 = null;
         var functionCall124 = null;
         var iterate125 = null;


        try {
            // antlr\\Hilo.g:289:5: ( primitive | parenthesizedExpr | functionCall | iterate )
            var alt40=4;
            switch ( this.input.LA(1) ) {
            case NULL:
            case TRUE:
            case FALSE:
            case YES:
            case NO:
            case STRING:
            case FIELD:
            case MEASURE_FIELD:
            case INTEGER:
            case DOUBLE:
            case DATE_TIME:
            case DOT_SEP_STRING:
            case DQ_ALLOW_ESC_REGEX_STRING:
            case ATTRIBUTE:
            case OLD_ATTRIBUTE:
                alt40=1;
                break;
            case LPAR:
                alt40=2;
                break;
            case IDENTIFIER:
                alt40=3;
                break;
            case ITERATE:
                alt40=4;
                break;
            default:
                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 40, 0, this.input);

                throw nvae;
            }

            switch (alt40) {
                case 1 :
                    // antlr\\Hilo.g:289:7: primitive
                    root_0 = this.adaptor.nil();

                    this.pushFollow(HiloParser.FOLLOW_primitive_in_factor2588);
                    primitive122=this.primitive();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, primitive122.getTree());


                    break;
                case 2 :
                    // antlr\\Hilo.g:290:7: parenthesizedExpr
                    root_0 = this.adaptor.nil();

                    this.pushFollow(HiloParser.FOLLOW_parenthesizedExpr_in_factor2596);
                    parenthesizedExpr123=this.parenthesizedExpr();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, parenthesizedExpr123.getTree());


                    break;
                case 3 :
                    // antlr\\Hilo.g:291:7: functionCall
                    root_0 = this.adaptor.nil();

                    this.pushFollow(HiloParser.FOLLOW_functionCall_in_factor2604);
                    functionCall124=this.functionCall();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, functionCall124.getTree());


                    break;
                case 4 :
                    // antlr\\Hilo.g:292:7: iterate
                    root_0 = this.adaptor.nil();

                    this.pushFollow(HiloParser.FOLLOW_iterate_in_factor2612);
                    iterate125=this.iterate();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, iterate125.getTree());


                    break;

            }
            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    primitive_return: (function() {
        HiloParser.primitive_return = function(){};
        org.antlr.lang.extend(HiloParser.primitive_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:295:1: primitive : ( NULL | INTEGER | DOUBLE | booleanLiteral | DATE_TIME | STRING | DOT_SEP_STRING | DQ_ALLOW_ESC_REGEX_STRING | object );
    // $ANTLR start "primitive"
    primitive: function() {
        var retval = new HiloParser.primitive_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var NULL126 = null;
        var INTEGER127 = null;
        var DOUBLE128 = null;
        var DATE_TIME130 = null;
        var STRING131 = null;
        var DOT_SEP_STRING132 = null;
        var DQ_ALLOW_ESC_REGEX_STRING133 = null;
         var booleanLiteral129 = null;
         var object134 = null;

        var NULL126_tree=null;
        var INTEGER127_tree=null;
        var DOUBLE128_tree=null;
        var DATE_TIME130_tree=null;
        var STRING131_tree=null;
        var DOT_SEP_STRING132_tree=null;
        var DQ_ALLOW_ESC_REGEX_STRING133_tree=null;

        try {
            // antlr\\Hilo.g:296:5: ( NULL | INTEGER | DOUBLE | booleanLiteral | DATE_TIME | STRING | DOT_SEP_STRING | DQ_ALLOW_ESC_REGEX_STRING | object )
            var alt41=9;
            switch ( this.input.LA(1) ) {
            case NULL:
                alt41=1;
                break;
            case INTEGER:
                alt41=2;
                break;
            case DOUBLE:
                alt41=3;
                break;
            case TRUE:
            case FALSE:
            case YES:
            case NO:
                alt41=4;
                break;
            case DATE_TIME:
                alt41=5;
                break;
            case STRING:
                alt41=6;
                break;
            case DOT_SEP_STRING:
                alt41=7;
                break;
            case DQ_ALLOW_ESC_REGEX_STRING:
                alt41=8;
                break;
            case FIELD:
            case MEASURE_FIELD:
            case ATTRIBUTE:
            case OLD_ATTRIBUTE:
                alt41=9;
                break;
            default:
                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 41, 0, this.input);

                throw nvae;
            }

            switch (alt41) {
                case 1 :
                    // antlr\\Hilo.g:296:7: NULL
                    root_0 = this.adaptor.nil();

                    NULL126=this.match(this.input,NULL,HiloParser.FOLLOW_NULL_in_primitive2629); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) {
                    NULL126_tree = this.adaptor.create(NULL126);
                    this.adaptor.addChild(root_0, NULL126_tree);
                    }


                    break;
                case 2 :
                    // antlr\\Hilo.g:297:7: INTEGER
                    root_0 = this.adaptor.nil();

                    INTEGER127=this.match(this.input,INTEGER,HiloParser.FOLLOW_INTEGER_in_primitive2637); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) {
                    INTEGER127_tree = this.adaptor.create(INTEGER127);
                    this.adaptor.addChild(root_0, INTEGER127_tree);
                    }


                    break;
                case 3 :
                    // antlr\\Hilo.g:298:7: DOUBLE
                    root_0 = this.adaptor.nil();

                    DOUBLE128=this.match(this.input,DOUBLE,HiloParser.FOLLOW_DOUBLE_in_primitive2645); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) {
                    DOUBLE128_tree = this.adaptor.create(DOUBLE128);
                    this.adaptor.addChild(root_0, DOUBLE128_tree);
                    }


                    break;
                case 4 :
                    // antlr\\Hilo.g:299:7: booleanLiteral
                    root_0 = this.adaptor.nil();

                    this.pushFollow(HiloParser.FOLLOW_booleanLiteral_in_primitive2653);
                    booleanLiteral129=this.booleanLiteral();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, booleanLiteral129.getTree());


                    break;
                case 5 :
                    // antlr\\Hilo.g:300:7: DATE_TIME
                    root_0 = this.adaptor.nil();

                    DATE_TIME130=this.match(this.input,DATE_TIME,HiloParser.FOLLOW_DATE_TIME_in_primitive2661); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) {
                    DATE_TIME130_tree = this.adaptor.create(DATE_TIME130);
                    this.adaptor.addChild(root_0, DATE_TIME130_tree);
                    }


                    break;
                case 6 :
                    // antlr\\Hilo.g:301:7: STRING
                    root_0 = this.adaptor.nil();

                    STRING131=this.match(this.input,STRING,HiloParser.FOLLOW_STRING_in_primitive2669); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) {
                    STRING131_tree = this.adaptor.create(STRING131);
                    this.adaptor.addChild(root_0, STRING131_tree);
                    }


                    break;
                case 7 :
                    // antlr\\Hilo.g:302:7: DOT_SEP_STRING
                    root_0 = this.adaptor.nil();

                    DOT_SEP_STRING132=this.match(this.input,DOT_SEP_STRING,HiloParser.FOLLOW_DOT_SEP_STRING_in_primitive2677); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) {
                    DOT_SEP_STRING132_tree = this.adaptor.create(DOT_SEP_STRING132);
                    this.adaptor.addChild(root_0, DOT_SEP_STRING132_tree);
                    }


                    break;
                case 8 :
                    // antlr\\Hilo.g:303:7: DQ_ALLOW_ESC_REGEX_STRING
                    root_0 = this.adaptor.nil();

                    DQ_ALLOW_ESC_REGEX_STRING133=this.match(this.input,DQ_ALLOW_ESC_REGEX_STRING,HiloParser.FOLLOW_DQ_ALLOW_ESC_REGEX_STRING_in_primitive2685); if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) {
                    DQ_ALLOW_ESC_REGEX_STRING133_tree = this.adaptor.create(DQ_ALLOW_ESC_REGEX_STRING133);
                    this.adaptor.addChild(root_0, DQ_ALLOW_ESC_REGEX_STRING133_tree);
                    }


                    break;
                case 9 :
                    // antlr\\Hilo.g:304:7: object
                    root_0 = this.adaptor.nil();

                    this.pushFollow(HiloParser.FOLLOW_object_in_primitive2693);
                    object134=this.object();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, object134.getTree());


                    break;

            }
            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    object_return: (function() {
        HiloParser.object_return = function(){};
        org.antlr.lang.extend(HiloParser.object_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:307:1: object : ( FIELD | ATTRIBUTE | MEASURE_FIELD | OLD_ATTRIBUTE );
    // $ANTLR start "object"
    object: function() {
        var retval = new HiloParser.object_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var set135 = null;

        var set135_tree=null;

        try {
            // antlr\\Hilo.g:308:5: ( FIELD | ATTRIBUTE | MEASURE_FIELD | OLD_ATTRIBUTE )
            // antlr\\Hilo.g:
            root_0 = this.adaptor.nil();

            set135=this.input.LT(1);
            if ( (this.input.LA(1)>=FIELD && this.input.LA(1)<=MEASURE_FIELD)||(this.input.LA(1)>=ATTRIBUTE && this.input.LA(1)<=OLD_ATTRIBUTE) ) {
                this.input.consume();
                if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, this.adaptor.create(set135));
                this.state.errorRecovery=false;this.state.failed=false;
            }
            else {
                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                throw mse;
            }




            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    arrayExpr_return: (function() {
        HiloParser.arrayExpr_return = function(){};
        org.antlr.lang.extend(HiloParser.arrayExpr_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:314:1: arrayExpr : ( functionArrayExpr | commaArrayExpr | orArrayExpr | andArrayExpr );
    // $ANTLR start "arrayExpr"
    arrayExpr: function() {
        var retval = new HiloParser.arrayExpr_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

         var functionArrayExpr136 = null;
         var commaArrayExpr137 = null;
         var orArrayExpr138 = null;
         var andArrayExpr139 = null;


        try {
            // antlr\\Hilo.g:315:5: ( functionArrayExpr | commaArrayExpr | orArrayExpr | andArrayExpr )
            var alt42=4;
            alt42 = this.dfa42.predict(this.input);
            switch (alt42) {
                case 1 :
                    // antlr\\Hilo.g:315:7: functionArrayExpr
                    root_0 = this.adaptor.nil();

                    this.pushFollow(HiloParser.FOLLOW_functionArrayExpr_in_arrayExpr2751);
                    functionArrayExpr136=this.functionArrayExpr();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, functionArrayExpr136.getTree());


                    break;
                case 2 :
                    // antlr\\Hilo.g:316:7: commaArrayExpr
                    root_0 = this.adaptor.nil();

                    this.pushFollow(HiloParser.FOLLOW_commaArrayExpr_in_arrayExpr2759);
                    commaArrayExpr137=this.commaArrayExpr();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, commaArrayExpr137.getTree());


                    break;
                case 3 :
                    // antlr\\Hilo.g:317:7: orArrayExpr
                    root_0 = this.adaptor.nil();

                    this.pushFollow(HiloParser.FOLLOW_orArrayExpr_in_arrayExpr2767);
                    orArrayExpr138=this.orArrayExpr();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, orArrayExpr138.getTree());


                    break;
                case 4 :
                    // antlr\\Hilo.g:318:7: andArrayExpr
                    root_0 = this.adaptor.nil();

                    this.pushFollow(HiloParser.FOLLOW_andArrayExpr_in_arrayExpr2775);
                    andArrayExpr139=this.andArrayExpr();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, andArrayExpr139.getTree());


                    break;

            }
            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    orArrayExpr_return: (function() {
        HiloParser.orArrayExpr_return = function(){};
        org.antlr.lang.extend(HiloParser.orArrayExpr_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:322:1: orArrayExpr : LPAR lst= orList RPAR -> ^( ARRAY $lst) ;
    // $ANTLR start "orArrayExpr"
    orArrayExpr: function() {
        var retval = new HiloParser.orArrayExpr_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var LPAR140 = null;
        var RPAR141 = null;
         var lst = null;

        var LPAR140_tree=null;
        var RPAR141_tree=null;
        var stream_LPAR=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token LPAR");
        var stream_RPAR=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token RPAR");
        var stream_orList=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule orList");
        try {
            // antlr\\Hilo.g:323:5: ( LPAR lst= orList RPAR -> ^( ARRAY $lst) )
            // antlr\\Hilo.g:323:7: LPAR lst= orList RPAR
            LPAR140=this.match(this.input,LPAR,HiloParser.FOLLOW_LPAR_in_orArrayExpr2793); if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_LPAR.add(LPAR140);

            this.pushFollow(HiloParser.FOLLOW_orList_in_orArrayExpr2797);
            lst=this.orList();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_orList.add(lst.getTree());
            RPAR141=this.match(this.input,RPAR,HiloParser.FOLLOW_RPAR_in_orArrayExpr2799); if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_RPAR.add(RPAR141);



            // AST REWRITE
            // elements: lst
            // token labels:
            // rule labels: lst, retval
            // token list labels:
            // rule list labels:
            if ( this.state.backtracking===0 ) {
            retval.tree = root_0;
            var stream_lst=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token lst",lst!=null?lst.tree:null);
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 323:30: -> ^( ARRAY $lst)
            {
                // antlr\\Hilo.g:323:33: ^( ARRAY $lst)
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(ARRAY, "ARRAY"), root_1);

                this.adaptor.addChild(root_1, stream_lst.nextTree());

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;}


            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    andArrayExpr_return: (function() {
        HiloParser.andArrayExpr_return = function(){};
        org.antlr.lang.extend(HiloParser.andArrayExpr_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:327:1: andArrayExpr : LPAR lst= andList RPAR -> ^( ARRAY $lst) ;
    // $ANTLR start "andArrayExpr"
    andArrayExpr: function() {
        var retval = new HiloParser.andArrayExpr_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var LPAR142 = null;
        var RPAR143 = null;
         var lst = null;

        var LPAR142_tree=null;
        var RPAR143_tree=null;
        var stream_LPAR=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token LPAR");
        var stream_RPAR=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token RPAR");
        var stream_andList=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule andList");
        try {
            // antlr\\Hilo.g:328:5: ( LPAR lst= andList RPAR -> ^( ARRAY $lst) )
            // antlr\\Hilo.g:328:7: LPAR lst= andList RPAR
            LPAR142=this.match(this.input,LPAR,HiloParser.FOLLOW_LPAR_in_andArrayExpr2828); if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_LPAR.add(LPAR142);

            this.pushFollow(HiloParser.FOLLOW_andList_in_andArrayExpr2832);
            lst=this.andList();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_andList.add(lst.getTree());
            RPAR143=this.match(this.input,RPAR,HiloParser.FOLLOW_RPAR_in_andArrayExpr2834); if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_RPAR.add(RPAR143);



            // AST REWRITE
            // elements: lst
            // token labels:
            // rule labels: lst, retval
            // token list labels:
            // rule list labels:
            if ( this.state.backtracking===0 ) {
            retval.tree = root_0;
            var stream_lst=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token lst",lst!=null?lst.tree:null);
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 328:31: -> ^( ARRAY $lst)
            {
                // antlr\\Hilo.g:328:34: ^( ARRAY $lst)
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(ARRAY, "ARRAY"), root_1);

                this.adaptor.addChild(root_1, stream_lst.nextTree());

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;}


            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    commaArrayExpr_return: (function() {
        HiloParser.commaArrayExpr_return = function(){};
        org.antlr.lang.extend(HiloParser.commaArrayExpr_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:332:1: commaArrayExpr : LPAR lst= commaList RPAR -> ^( ARRAY $lst) ;
    // $ANTLR start "commaArrayExpr"
    commaArrayExpr: function() {
        var retval = new HiloParser.commaArrayExpr_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var LPAR144 = null;
        var RPAR145 = null;
         var lst = null;

        var LPAR144_tree=null;
        var RPAR145_tree=null;
        var stream_LPAR=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token LPAR");
        var stream_RPAR=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token RPAR");
        var stream_commaList=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule commaList");
        try {
            // antlr\\Hilo.g:333:5: ( LPAR lst= commaList RPAR -> ^( ARRAY $lst) )
            // antlr\\Hilo.g:333:7: LPAR lst= commaList RPAR
            LPAR144=this.match(this.input,LPAR,HiloParser.FOLLOW_LPAR_in_commaArrayExpr2863); if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_LPAR.add(LPAR144);

            this.pushFollow(HiloParser.FOLLOW_commaList_in_commaArrayExpr2867);
            lst=this.commaList();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_commaList.add(lst.getTree());
            RPAR145=this.match(this.input,RPAR,HiloParser.FOLLOW_RPAR_in_commaArrayExpr2869); if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_RPAR.add(RPAR145);



            // AST REWRITE
            // elements: lst
            // token labels:
            // rule labels: lst, retval
            // token list labels:
            // rule list labels:
            if ( this.state.backtracking===0 ) {
            retval.tree = root_0;
            var stream_lst=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token lst",lst!=null?lst.tree:null);
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 333:33: -> ^( ARRAY $lst)
            {
                // antlr\\Hilo.g:333:36: ^( ARRAY $lst)
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(ARRAY, "ARRAY"), root_1);

                this.adaptor.addChild(root_1, stream_lst.nextTree());

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;}


            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    stringArrayExpr_return: (function() {
        HiloParser.stringArrayExpr_return = function(){};
        org.antlr.lang.extend(HiloParser.stringArrayExpr_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:337:1: stringArrayExpr : LPAR lst= stringList RPAR -> ^( ARRAY $lst) ;
    // $ANTLR start "stringArrayExpr"
    stringArrayExpr: function() {
        var retval = new HiloParser.stringArrayExpr_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var LPAR146 = null;
        var RPAR147 = null;
         var lst = null;

        var LPAR146_tree=null;
        var RPAR147_tree=null;
        var stream_LPAR=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token LPAR");
        var stream_RPAR=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token RPAR");
        var stream_stringList=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule stringList");
        try {
            // antlr\\Hilo.g:338:5: ( LPAR lst= stringList RPAR -> ^( ARRAY $lst) )
            // antlr\\Hilo.g:338:7: LPAR lst= stringList RPAR
            LPAR146=this.match(this.input,LPAR,HiloParser.FOLLOW_LPAR_in_stringArrayExpr2898); if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_LPAR.add(LPAR146);

            this.pushFollow(HiloParser.FOLLOW_stringList_in_stringArrayExpr2902);
            lst=this.stringList();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_stringList.add(lst.getTree());
            RPAR147=this.match(this.input,RPAR,HiloParser.FOLLOW_RPAR_in_stringArrayExpr2904); if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_RPAR.add(RPAR147);



            // AST REWRITE
            // elements: lst
            // token labels:
            // rule labels: lst, retval
            // token list labels:
            // rule list labels:
            if ( this.state.backtracking===0 ) {
            retval.tree = root_0;
            var stream_lst=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token lst",lst!=null?lst.tree:null);
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 338:34: -> ^( ARRAY $lst)
            {
                // antlr\\Hilo.g:338:37: ^( ARRAY $lst)
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(ARRAY, "ARRAY"), root_1);

                this.adaptor.addChild(root_1, stream_lst.nextTree());

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;}


            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    parenthesizedExpr_return: (function() {
        HiloParser.parenthesizedExpr_return = function(){};
        org.antlr.lang.extend(HiloParser.parenthesizedExpr_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:341:1: parenthesizedExpr : LPAR expr RPAR -> ^( PARENTH_GROUP expr ) ;
    // $ANTLR start "parenthesizedExpr"
    parenthesizedExpr: function() {
        var retval = new HiloParser.parenthesizedExpr_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var LPAR148 = null;
        var RPAR150 = null;
         var expr149 = null;

        var LPAR148_tree=null;
        var RPAR150_tree=null;
        var stream_LPAR=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token LPAR");
        var stream_RPAR=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token RPAR");
        var stream_expr=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule expr");
        try {
            // antlr\\Hilo.g:342:5: ( LPAR expr RPAR -> ^( PARENTH_GROUP expr ) )
            // antlr\\Hilo.g:342:7: LPAR expr RPAR
            LPAR148=this.match(this.input,LPAR,HiloParser.FOLLOW_LPAR_in_parenthesizedExpr2932); if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_LPAR.add(LPAR148);

            this.pushFollow(HiloParser.FOLLOW_expr_in_parenthesizedExpr2934);
            expr149=this.expr();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_expr.add(expr149.getTree());
            RPAR150=this.match(this.input,RPAR,HiloParser.FOLLOW_RPAR_in_parenthesizedExpr2936); if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_RPAR.add(RPAR150);



            // AST REWRITE
            // elements: expr
            // token labels:
            // rule labels: retval
            // token list labels:
            // rule list labels:
            if ( this.state.backtracking===0 ) {
            retval.tree = root_0;
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 342:28: -> ^( PARENTH_GROUP expr )
            {
                // antlr\\Hilo.g:342:31: ^( PARENTH_GROUP expr )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(PARENTH_GROUP, "PARENTH_GROUP"), root_1);

                this.adaptor.addChild(root_1, stream_expr.nextTree());

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;}


            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    functionCall_return: (function() {
        HiloParser.functionCall_return = function(){};
        org.antlr.lang.extend(HiloParser.functionCall_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:345:1: functionCall : id= IDENTIFIER LPAR (params= exprList )? RPAR -> ^( FUNCALL $id ( $params)? ) ;
    // $ANTLR start "functionCall"
    functionCall: function() {
        var retval = new HiloParser.functionCall_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var id = null;
        var LPAR151 = null;
        var RPAR152 = null;
         var params = null;

        var id_tree=null;
        var LPAR151_tree=null;
        var RPAR152_tree=null;
        var stream_LPAR=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token LPAR");
        var stream_RPAR=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token RPAR");
        var stream_IDENTIFIER=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token IDENTIFIER");
        var stream_exprList=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule exprList");
        try {
            // antlr\\Hilo.g:346:5: (id= IDENTIFIER LPAR (params= exprList )? RPAR -> ^( FUNCALL $id ( $params)? ) )
            // antlr\\Hilo.g:346:7: id= IDENTIFIER LPAR (params= exprList )? RPAR
            id=this.match(this.input,IDENTIFIER,HiloParser.FOLLOW_IDENTIFIER_in_functionCall2969); if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_IDENTIFIER.add(id);

            LPAR151=this.match(this.input,LPAR,HiloParser.FOLLOW_LPAR_in_functionCall2971); if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_LPAR.add(LPAR151);

            // antlr\\Hilo.g:346:32: (params= exprList )?
            var alt43=2;
            switch ( this.input.LA(1) ) {
                case PLUS:
                case MINUS:
                case LPAR:
                case NOT:
                case ITERATE:
                case NULL:
                case TRUE:
                case FALSE:
                case YES:
                case NO:
                case STRING:
                case FIELD:
                case MEASURE_FIELD:
                case INTEGER:
                case DOUBLE:
                case DATE_TIME:
                case DOT_SEP_STRING:
                case DQ_ALLOW_ESC_REGEX_STRING:
                case ATTRIBUTE:
                case OLD_ATTRIBUTE:
                case IDENTIFIER:
                    alt43=1;
                    break;
            }

            switch (alt43) {
                case 1 :
                    // antlr\\Hilo.g:346:32: params= exprList
                    this.pushFollow(HiloParser.FOLLOW_exprList_in_functionCall2975);
                    params=this.exprList();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) stream_exprList.add(params.getTree());


                    break;

            }

            RPAR152=this.match(this.input,RPAR,HiloParser.FOLLOW_RPAR_in_functionCall2978); if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_RPAR.add(RPAR152);



            // AST REWRITE
            // elements: params, id
            // token labels: id
            // rule labels: params, retval
            // token list labels:
            // rule list labels:
            if ( this.state.backtracking===0 ) {
            retval.tree = root_0;
            var stream_id=new org.antlr.runtime.tree.RewriteRuleTokenStream(this.adaptor,"token id",id);
            var stream_params=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token params",params!=null?params.tree:null);
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 346:51: -> ^( FUNCALL $id ( $params)? )
            {
                // antlr\\Hilo.g:346:54: ^( FUNCALL $id ( $params)? )
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(FUNCALL, "FUNCALL"), root_1);

                this.adaptor.addChild(root_1, stream_id.nextNode());
                // antlr\\Hilo.g:346:68: ( $params)?
                if ( stream_params.hasNext() ) {
                    this.adaptor.addChild(root_1, stream_params.nextTree());

                }
                stream_params.reset();

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;}


            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    chainedFunction_return: (function() {
        HiloParser.chainedFunction_return = function(){};
        org.antlr.lang.extend(HiloParser.chainedFunction_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:349:1: chainedFunction : functionCall ( DOT functionCall )+ ;
    // $ANTLR start "chainedFunction"
    chainedFunction: function() {
        var retval = new HiloParser.chainedFunction_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var DOT154 = null;
         var functionCall153 = null;
         var functionCall155 = null;

        var DOT154_tree=null;

        try {
            // antlr\\Hilo.g:350:5: ( functionCall ( DOT functionCall )+ )
            // antlr\\Hilo.g:350:7: functionCall ( DOT functionCall )+
            root_0 = this.adaptor.nil();

            this.pushFollow(HiloParser.FOLLOW_functionCall_in_chainedFunction3011);
            functionCall153=this.functionCall();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, functionCall153.getTree());
            // antlr\\Hilo.g:350:20: ( DOT functionCall )+
            var cnt44=0;
            loop44:
            do {
                var alt44=2;
                switch ( this.input.LA(1) ) {
                case DOT:
                    alt44=1;
                    break;

                }

                switch (alt44) {
                case 1 :
                    // antlr\\Hilo.g:350:21: DOT functionCall
                    DOT154=this.match(this.input,DOT,HiloParser.FOLLOW_DOT_in_chainedFunction3014); if (this.state.failed) return retval;
                    this.pushFollow(HiloParser.FOLLOW_functionCall_in_chainedFunction3017);
                    functionCall155=this.functionCall();

                    this.state._fsp--;
                    if (this.state.failed) return retval;
                    if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, functionCall155.getTree());


                    break;

                default :
                    if ( cnt44 >= 1 ) {
                        break loop44;
                    }
                    if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                        var eee = new org.antlr.runtime.EarlyExitException(44, this.input);
                        throw eee;
                }
                cnt44++;
            } while (true);




            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    functionArrayExpr_return: (function() {
        HiloParser.functionArrayExpr_return = function(){};
        org.antlr.lang.extend(HiloParser.functionArrayExpr_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:353:1: functionArrayExpr : lst= chainedFunction -> ^( ARRAY $lst) ;
    // $ANTLR start "functionArrayExpr"
    functionArrayExpr: function() {
        var retval = new HiloParser.functionArrayExpr_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

         var lst = null;

        var stream_chainedFunction=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"rule chainedFunction");
        try {
            // antlr\\Hilo.g:354:5: (lst= chainedFunction -> ^( ARRAY $lst) )
            // antlr\\Hilo.g:354:7: lst= chainedFunction
            this.pushFollow(HiloParser.FOLLOW_chainedFunction_in_functionArrayExpr3038);
            lst=this.chainedFunction();

            this.state._fsp--;
            if (this.state.failed) return retval;
            if ( this.state.backtracking===0 ) stream_chainedFunction.add(lst.getTree());


            // AST REWRITE
            // elements: lst
            // token labels:
            // rule labels: lst, retval
            // token list labels:
            // rule list labels:
            if ( this.state.backtracking===0 ) {
            retval.tree = root_0;
            var stream_lst=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token lst",lst!=null?lst.tree:null);
            var stream_retval=new org.antlr.runtime.tree.RewriteRuleSubtreeStream(this.adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = this.adaptor.nil();
            // 354:41: -> ^( ARRAY $lst)
            {
                // antlr\\Hilo.g:354:44: ^( ARRAY $lst)
                {
                var root_1 = this.adaptor.nil();
                root_1 = this.adaptor.becomeRoot(this.adaptor.create(ARRAY, "ARRAY"), root_1);

                this.adaptor.addChild(root_1, stream_lst.nextTree());

                this.adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;}


            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    booleanLiteral_return: (function() {
        HiloParser.booleanLiteral_return = function(){};
        org.antlr.lang.extend(HiloParser.booleanLiteral_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // antlr\\Hilo.g:357:1: booleanLiteral : ( TRUE | FALSE | YES | NO );
    // $ANTLR start "booleanLiteral"
    booleanLiteral: function() {
        var retval = new HiloParser.booleanLiteral_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var set156 = null;

        var set156_tree=null;

        try {
            // antlr\\Hilo.g:357:16: ( TRUE | FALSE | YES | NO )
            // antlr\\Hilo.g:
            root_0 = this.adaptor.nil();

            set156=this.input.LT(1);
            if ( (this.input.LA(1)>=TRUE && this.input.LA(1)<=NO) ) {
                this.input.consume();
                if ( this.state.backtracking===0 ) this.adaptor.addChild(root_0, this.adaptor.create(set156));
                this.state.errorRecovery=false;this.state.failed=false;
            }
            else {
                if (this.state.backtracking>0) {this.state.failed=true; return retval;}
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                throw mse;
            }




            retval.stop = this.input.LT(-1);

            if ( this.state.backtracking===0 ) {

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // $ANTLR start "synpred2_Hilo"
    synpred2_Hilo_fragment: function() {
        // antlr\\Hilo.g:254:7: ( object equalOp arrayExpr )
        // antlr\\Hilo.g:254:7: object equalOp arrayExpr
        this.pushFollow(HiloParser.FOLLOW_object_in_synpred2_Hilo2308);
        this.object();

        this.state._fsp--;
        if (this.state.failed) return ;
        this.pushFollow(HiloParser.FOLLOW_equalOp_in_synpred2_Hilo2310);
        this.equalOp();

        this.state._fsp--;
        if (this.state.failed) return ;
        this.pushFollow(HiloParser.FOLLOW_arrayExpr_in_synpred2_Hilo2313);
        this.arrayExpr();

        this.state._fsp--;
        if (this.state.failed) return ;


    },
    // $ANTLR end "synpred2_Hilo"

    // Delegated rules



    synpred2_Hilo: function() {
        this.state.backtracking++;
        var start = this.input.mark();
        try {
            this.synpred2_Hilo_fragment(); // can never throw exception
        } catch (re) {
            alert("impossible: "+re.toString());
        }
        var success = !this.state.failed;
        this.input.rewind(start);
        this.state.backtracking--;
        this.state.failed=false;
        return success;
    }

}, true); // important to pass true to overwrite default implementations

org.antlr.lang.augmentObject(HiloParser, {
    DFA14_eotS:
        "\u000c\uffff",
    DFA14_eofS:
        "\u000c\uffff",
    DFA14_minS:
        "\u0001\u004a\u0001\u0026\u0001\u0056\u0002\u002a\u0001\u0055\u0001"+
    "\u002a\u0001\uffff\u0001\u0055\u0002\u0027\u0001\uffff",
    DFA14_maxS:
        "\u0001\u004a\u0001\u0026\u0001\u0057\u0002\u002a\u0001\u0056\u0001"+
    "\u002a\u0001\uffff\u0001\u0056\u0002\u002a\u0001\uffff",
    DFA14_acceptS:
        "\u0007\uffff\u0001\u0001\u0003\uffff\u0001\u0002",
    DFA14_specialS:
        "\u000c\uffff}>",
    DFA14_transitionS: [
            "\u0001\u0001",
            "\u0001\u0002",
            "\u0001\u0003\u0001\u0004",
            "\u0001\u0005",
            "\u0001\u0005",
            "\u0001\u0007\u0001\u0006",
            "\u0001\u0008",
            "",
            "\u0001\u0009\u0001\u000a",
            "\u0001\u0007\u0002\uffff\u0001\u000b",
            "\u0001\u0007\u0002\uffff\u0001\u000b",
            ""
    ]
});

org.antlr.lang.augmentObject(HiloParser, {
    DFA14_eot:
        org.antlr.runtime.DFA.unpackEncodedString(HiloParser.DFA14_eotS),
    DFA14_eof:
        org.antlr.runtime.DFA.unpackEncodedString(HiloParser.DFA14_eofS),
    DFA14_min:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(HiloParser.DFA14_minS),
    DFA14_max:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(HiloParser.DFA14_maxS),
    DFA14_accept:
        org.antlr.runtime.DFA.unpackEncodedString(HiloParser.DFA14_acceptS),
    DFA14_special:
        org.antlr.runtime.DFA.unpackEncodedString(HiloParser.DFA14_specialS),
    DFA14_transition: (function() {
        var a = [],
            i,
            numStates = HiloParser.DFA14_transitionS.length;
        for (i=0; i<numStates; i++) {
            a.push(org.antlr.runtime.DFA.unpackEncodedString(HiloParser.DFA14_transitionS[i]));
        }
        return a;
    })()
});

HiloParser.DFA14 = function(recognizer) {
    this.recognizer = recognizer;
    this.decisionNumber = 14;
    this.eot = HiloParser.DFA14_eot;
    this.eof = HiloParser.DFA14_eof;
    this.min = HiloParser.DFA14_min;
    this.max = HiloParser.DFA14_max;
    this.accept = HiloParser.DFA14_accept;
    this.special = HiloParser.DFA14_special;
    this.transition = HiloParser.DFA14_transition;
};

org.antlr.lang.extend(HiloParser.DFA14, org.antlr.runtime.DFA, {
    getDescription: function() {
        return "208:1: cagr : ( CAGR LPAR (measure= FIELD | measure= MEASURE_FIELD ) COMMA (start= STRING | start= FIELD ) COMMA (end= STRING | end= FIELD ) RPAR -> ^( CAGR_FORMULA $measure $start $end) | CAGR LPAR (measure= FIELD | measure= MEASURE_FIELD ) COMMA dimension= FIELD COMMA (start= STRING | start= FIELD ) COMMA (end= STRING | end= FIELD ) RPAR -> ^( CAGR_FORMULA_WITH_DIMENSION $measure $start $end $dimension) );";
    },
    dummy: null
});
org.antlr.lang.augmentObject(HiloParser, {
    DFA33_eotS:
        "\u0011\uffff",
    DFA33_eofS:
        "\u0011\uffff",
    DFA33_minS:
        "\u0001\u001e\u0001\u0000\u000f\uffff",
    DFA33_maxS:
        "\u0001\u005f\u0001\u0000\u000f\uffff",
    DFA33_acceptS:
        "\u0002\uffff\u0001\u0002\u000d\uffff\u0001\u0001",
    DFA33_specialS:
        "\u0001\uffff\u0001\u0000\u000f\uffff}>",
    DFA33_transitionS: [
            "\u0002\u0002\u0006\uffff\u0001\u0002\u0022\uffff\u0001\u0002"+
            "\u0005\uffff\u0007\u0002\u0002\u0001\u0005\u0002\u0002\u0001"+
            "\u0001\u0002",
            "\u0001\uffff",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            ""
    ]
});

org.antlr.lang.augmentObject(HiloParser, {
    DFA33_eot:
        org.antlr.runtime.DFA.unpackEncodedString(HiloParser.DFA33_eotS),
    DFA33_eof:
        org.antlr.runtime.DFA.unpackEncodedString(HiloParser.DFA33_eofS),
    DFA33_min:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(HiloParser.DFA33_minS),
    DFA33_max:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(HiloParser.DFA33_maxS),
    DFA33_accept:
        org.antlr.runtime.DFA.unpackEncodedString(HiloParser.DFA33_acceptS),
    DFA33_special:
        org.antlr.runtime.DFA.unpackEncodedString(HiloParser.DFA33_specialS),
    DFA33_transition: (function() {
        var a = [],
            i,
            numStates = HiloParser.DFA33_transitionS.length;
        for (i=0; i<numStates; i++) {
            a.push(org.antlr.runtime.DFA.unpackEncodedString(HiloParser.DFA33_transitionS[i]));
        }
        return a;
    })()
});

HiloParser.DFA33 = function(recognizer) {
    this.recognizer = recognizer;
    this.decisionNumber = 33;
    this.eot = HiloParser.DFA33_eot;
    this.eof = HiloParser.DFA33_eof;
    this.min = HiloParser.DFA33_min;
    this.max = HiloParser.DFA33_max;
    this.accept = HiloParser.DFA33_accept;
    this.special = HiloParser.DFA33_special;
    this.transition = HiloParser.DFA33_transition;
};

org.antlr.lang.extend(HiloParser.DFA33, org.antlr.runtime.DFA, {
    getDescription: function() {
        return "252:1: equalExpr options {backtrack=true; } : ( object equalOp arrayExpr | comparisonExpr ( equalOp comparisonExpr )? );";
    },
    specialStateTransition: function(s, input) {
        var _s = s;
        /* bind to recognizer so semantic predicates can be evaluated */
        var retval = (function(s, input) {
            switch ( s ) {
                        case 0 :
                            var LA33_1 = input.LA(1);


                            var index33_1 = input.index();
                            input.rewind();
                            s = -1;
                            if ( (this.synpred2_Hilo()) ) {s = 16;}

                            else if ( (true) ) {s = 2;}


                            input.seek(index33_1);
                            if ( s>=0 ) return s;
                            break;
            }
        }).call(this.recognizer, s, input);
        if (!org.antlr.lang.isUndefined(retval)) {
            return retval;
        }
        if (this.recognizer.state.backtracking>0) {this.recognizer.state.failed=true; return -1;}
        var nvae =
            new org.antlr.runtime.NoViableAltException(this.getDescription(), 33, _s, input);
        this.error(nvae);
        throw nvae;
    },
    dummy: null
});
org.antlr.lang.augmentObject(HiloParser, {
    DFA42_eotS:
        "\u000f\uffff",
    DFA42_eofS:
        "\u000f\uffff",
    DFA42_minS:
        "\u0001\u0026\u0001\uffff\u0001\u0050\u0009\u002a\u0003\uffff",
    DFA42_maxS:
        "\u0001\u005f\u0001\uffff\u0001\u005e\u0009\u0048\u0003\uffff",
    DFA42_acceptS:
        "\u0001\uffff\u0001\u0001\u000a\uffff\u0001\u0002\u0001\u0003\u0001"+
    "\u0004",
    DFA42_specialS:
        "\u000f\uffff}>",
    DFA42_transitionS: [
            "\u0001\u0002\u0038\uffff\u0001\u0001",
            "",
            "\u0001\u0003\u0004\u0006\u0001\u0008\u0002\u000b\u0001\u0004"+
            "\u0001\u0005\u0001\u0007\u0001\u0009\u0001\u000a\u0002\u000b",
            "\u0001\u000c\u001c\uffff\u0001\u000d\u0001\u000e",
            "\u0001\u000c\u001c\uffff\u0001\u000d\u0001\u000e",
            "\u0001\u000c\u001c\uffff\u0001\u000d\u0001\u000e",
            "\u0001\u000c\u001c\uffff\u0001\u000d\u0001\u000e",
            "\u0001\u000c\u001c\uffff\u0001\u000d\u0001\u000e",
            "\u0001\u000c\u001c\uffff\u0001\u000d\u0001\u000e",
            "\u0001\u000c\u001c\uffff\u0001\u000d\u0001\u000e",
            "\u0001\u000c\u001c\uffff\u0001\u000d\u0001\u000e",
            "\u0001\u000c\u001c\uffff\u0001\u000d\u0001\u000e",
            "",
            "",
            ""
    ]
});

org.antlr.lang.augmentObject(HiloParser, {
    DFA42_eot:
        org.antlr.runtime.DFA.unpackEncodedString(HiloParser.DFA42_eotS),
    DFA42_eof:
        org.antlr.runtime.DFA.unpackEncodedString(HiloParser.DFA42_eofS),
    DFA42_min:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(HiloParser.DFA42_minS),
    DFA42_max:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(HiloParser.DFA42_maxS),
    DFA42_accept:
        org.antlr.runtime.DFA.unpackEncodedString(HiloParser.DFA42_acceptS),
    DFA42_special:
        org.antlr.runtime.DFA.unpackEncodedString(HiloParser.DFA42_specialS),
    DFA42_transition: (function() {
        var a = [],
            i,
            numStates = HiloParser.DFA42_transitionS.length;
        for (i=0; i<numStates; i++) {
            a.push(org.antlr.runtime.DFA.unpackEncodedString(HiloParser.DFA42_transitionS[i]));
        }
        return a;
    })()
});

HiloParser.DFA42 = function(recognizer) {
    this.recognizer = recognizer;
    this.decisionNumber = 42;
    this.eot = HiloParser.DFA42_eot;
    this.eof = HiloParser.DFA42_eof;
    this.min = HiloParser.DFA42_min;
    this.max = HiloParser.DFA42_max;
    this.accept = HiloParser.DFA42_accept;
    this.special = HiloParser.DFA42_special;
    this.transition = HiloParser.DFA42_transition;
};

org.antlr.lang.extend(HiloParser.DFA42, org.antlr.runtime.DFA, {
    getDescription: function() {
        return "314:1: arrayExpr : ( functionArrayExpr | commaArrayExpr | orArrayExpr | andArrayExpr );";
    },
    dummy: null
});


// public class variables
org.antlr.lang.augmentObject(HiloParser, {
    tokenNames: ["<invalid>", "<EOR>", "<DOWN>", "<UP>", "PARENTH_GROUP", "FUNCALL", "VARACCESS", "ARRAY", "SUBSCRIPT", "UNARY_PLUS", "UNARY_MINUS", "RANGE_UP_TO_", "RANGE_UP_TO", "RANGE_UP_FROM_", "RANGE_UP_FROM", "CAGR_FORMULA", "CAGR_FORMULA_WITH_DIMENSION", "LOOKUP_FORMULA", "SMA_FORMULA", "SMA_FORMULA_WITH_DIMENSION", "YOY_FORMULA", "YOY_FORMULA_WITH_DIMENSION", "LINK_FORMULA", "ITERATE_FUNCTION", "EQ", "NEQ", "LT", "GT", "GTE", "LTE", "PLUS", "MINUS", "MULT", "DIV", "REM", "POW", "PIPE", "ASSIGN", "LPAR", "RPAR", "LBRA", "RBRA", "COMMA", "DOT", "SEMICOLON", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "OR", "AND", "NOT", "CAGR", "LOOKUP", "SMA", "YOY", "LINK", "ITERATE", "NULL", "TRUE", "FALSE", "YES", "NO", "STRING", "FIELD", "MEASURE_FIELD", "INTEGER", "DOUBLE", "DATE_TIME", "DOT_SEP_STRING", "DQ_ALLOW_ESC_REGEX_STRING", "ATTRIBUTE", "OLD_ATTRIBUTE", "IDENTIFIER", "WHITESPACE", "COMMENT", "DIGIT", "EXPONENT", "LETTER", "SHARP", "DQ_STRING", "SQ_STRING", "ESC_REGEX", "ESC_SEQ", "HEX_DIGIT", "VARIABLE_FIELD", "NAME_IN_QUOTE", "OLD_FIELD_STR", "DIM_MEASURE_FIELD", "CALC_FIELD"],
    FOLLOW_expr_in_formula1300: new org.antlr.runtime.BitSet([0x00000000, 0x00000000]),
    FOLLOW_EOF_in_formula1302: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_cagr_in_formula1311: new org.antlr.runtime.BitSet([0x00000000, 0x00000000]),
    FOLLOW_EOF_in_formula1313: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_lookup_in_formula1322: new org.antlr.runtime.BitSet([0x00000000, 0x00000000]),
    FOLLOW_EOF_in_formula1324: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_sma_in_formula1330: new org.antlr.runtime.BitSet([0x00000000, 0x00000000]),
    FOLLOW_EOF_in_formula1332: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_yoy_in_formula1338: new org.antlr.runtime.BitSet([0x00000000, 0x00000000]),
    FOLLOW_EOF_in_formula1340: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_link_in_formula1346: new org.antlr.runtime.BitSet([0x00000000, 0x00000000]),
    FOLLOW_EOF_in_formula1348: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_expr_in_exprList1369: new org.antlr.runtime.BitSet([0x00000002, 0x00000400]),
    FOLLOW_COMMA_in_exprList1372: new org.antlr.runtime.BitSet([0xC0000000, 0x00000040,0xFFFF8200, 0x00000000]),
    FOLLOW_expr_in_exprList1375: new org.antlr.runtime.BitSet([0x00000002, 0x00000400]),
    FOLLOW_primitive_in_orList1394: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000080, 0x00000000]),
    FOLLOW_OR_in_orList1397: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x7FFF0000, 0x00000000]),
    FOLLOW_primitive_in_orList1400: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x00000080, 0x00000000]),
    FOLLOW_primitive_in_andList1419: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00000100, 0x00000000]),
    FOLLOW_AND_in_andList1422: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x7FFF0000, 0x00000000]),
    FOLLOW_primitive_in_andList1425: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x00000100, 0x00000000]),
    FOLLOW_primitive_in_commaList1444: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_COMMA_in_commaList1447: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x7FFF0000, 0x00000000]),
    FOLLOW_primitive_in_commaList1450: new org.antlr.runtime.BitSet([0x00000002, 0x00000400]),
    FOLLOW_STRING_in_stringList1469: new org.antlr.runtime.BitSet([0x00000002, 0x00000400]),
    FOLLOW_COMMA_in_stringList1472: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00200000, 0x00000000]),
    FOLLOW_STRING_in_stringList1475: new org.antlr.runtime.BitSet([0x00000002, 0x00000400]),
    FOLLOW_chainExpr_in_expr1494: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_ITERATE_in_iterate1511: new org.antlr.runtime.BitSet([0x00000000, 0x00000040]),
    FOLLOW_LPAR_in_iterate1513: new org.antlr.runtime.BitSet([0xC0000000, 0x00000040,0xFFFF8200, 0x00000000]),
    FOLLOW_expr_in_iterate1518: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_COMMA_in_iterate1520: new org.antlr.runtime.BitSet([0x00000000, 0x00000400,0x00C00000, 0x00000000]),
    FOLLOW_FIELD_in_iterate1525: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_MEASURE_FIELD_in_iterate1531: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_COMMA_in_iterate1535: new org.antlr.runtime.BitSet([0xC0000000, 0x00000040,0xFFFF8200, 0x00000000]),
    FOLLOW_expr_in_iterate1539: new org.antlr.runtime.BitSet([0x00000000, 0x00000080]),
    FOLLOW_RPAR_in_iterate1542: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_CAGR_in_cagr1575: new org.antlr.runtime.BitSet([0x00000000, 0x00000040]),
    FOLLOW_LPAR_in_cagr1577: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00C00000, 0x00000000]),
    FOLLOW_FIELD_in_cagr1582: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_MEASURE_FIELD_in_cagr1588: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_COMMA_in_cagr1591: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00600000, 0x00000000]),
    FOLLOW_STRING_in_cagr1596: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_FIELD_in_cagr1602: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_COMMA_in_cagr1605: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00600000, 0x00000000]),
    FOLLOW_STRING_in_cagr1610: new org.antlr.runtime.BitSet([0x00000000, 0x00000080]),
    FOLLOW_FIELD_in_cagr1616: new org.antlr.runtime.BitSet([0x00000000, 0x00000080]),
    FOLLOW_RPAR_in_cagr1619: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_CAGR_in_cagr1644: new org.antlr.runtime.BitSet([0x00000000, 0x00000040]),
    FOLLOW_LPAR_in_cagr1646: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00C00000, 0x00000000]),
    FOLLOW_FIELD_in_cagr1651: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_MEASURE_FIELD_in_cagr1657: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_COMMA_in_cagr1660: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00400000, 0x00000000]),
    FOLLOW_FIELD_in_cagr1664: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_COMMA_in_cagr1666: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00600000, 0x00000000]),
    FOLLOW_STRING_in_cagr1671: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_FIELD_in_cagr1677: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_COMMA_in_cagr1680: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00600000, 0x00000000]),
    FOLLOW_STRING_in_cagr1685: new org.antlr.runtime.BitSet([0x00000000, 0x00000080]),
    FOLLOW_FIELD_in_cagr1691: new org.antlr.runtime.BitSet([0x00000000, 0x00000080]),
    FOLLOW_RPAR_in_cagr1694: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_SMA_in_sma1731: new org.antlr.runtime.BitSet([0x00000000, 0x00000040]),
    FOLLOW_LPAR_in_sma1733: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00C00000, 0x00000000]),
    FOLLOW_FIELD_in_sma1738: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_MEASURE_FIELD_in_sma1744: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_COMMA_in_sma1747: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00200000, 0x00000000]),
    FOLLOW_STRING_in_sma1751: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_COMMA_in_sma1753: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x01000000, 0x00000000]),
    FOLLOW_INTEGER_in_sma1757: new org.antlr.runtime.BitSet([0x00000000, 0x00000080]),
    FOLLOW_RPAR_in_sma1759: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_SMA_in_sma1784: new org.antlr.runtime.BitSet([0x00000000, 0x00000040]),
    FOLLOW_LPAR_in_sma1786: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00C00000, 0x00000000]),
    FOLLOW_FIELD_in_sma1791: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_MEASURE_FIELD_in_sma1797: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_COMMA_in_sma1800: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00400000, 0x00000000]),
    FOLLOW_FIELD_in_sma1804: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_COMMA_in_sma1806: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00200000, 0x00000000]),
    FOLLOW_STRING_in_sma1810: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_COMMA_in_sma1812: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x01000000, 0x00000000]),
    FOLLOW_INTEGER_in_sma1816: new org.antlr.runtime.BitSet([0x00000000, 0x00000080]),
    FOLLOW_RPAR_in_sma1818: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_YOY_in_yoy1855: new org.antlr.runtime.BitSet([0x00000000, 0x00000040]),
    FOLLOW_LPAR_in_yoy1857: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00C00000, 0x00000000]),
    FOLLOW_FIELD_in_yoy1862: new org.antlr.runtime.BitSet([0x00000000, 0x00000080]),
    FOLLOW_MEASURE_FIELD_in_yoy1868: new org.antlr.runtime.BitSet([0x00000000, 0x00000080]),
    FOLLOW_RPAR_in_yoy1871: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_YOY_in_yoy1890: new org.antlr.runtime.BitSet([0x00000000, 0x00000040]),
    FOLLOW_LPAR_in_yoy1892: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00C00000, 0x00000000]),
    FOLLOW_FIELD_in_yoy1897: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_MEASURE_FIELD_in_yoy1903: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_COMMA_in_yoy1906: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00400000, 0x00000000]),
    FOLLOW_FIELD_in_yoy1910: new org.antlr.runtime.BitSet([0x00000000, 0x00000080]),
    FOLLOW_RPAR_in_yoy1912: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_LINK_in_link1943: new org.antlr.runtime.BitSet([0x00000000, 0x00000040]),
    FOLLOW_LPAR_in_link1945: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00400000, 0x00000000]),
    FOLLOW_FIELD_in_link1949: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_COMMA_in_link1951: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00C00000, 0x00000000]),
    FOLLOW_FIELD_in_link1956: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_MEASURE_FIELD_in_link1962: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_COMMA_in_link1965: new org.antlr.runtime.BitSet([0x00000000, 0x00000080,0x00C00000, 0x00000000]),
    FOLLOW_povExpr_in_link1970: new org.antlr.runtime.BitSet([0x00000000, 0x00000080]),
    FOLLOW_RPAR_in_link1974: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_povSelectExpr_in_povExpr2008: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x00000100, 0x00000000]),
    FOLLOW_AND_in_povExpr2011: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00C00000, 0x00000000]),
    FOLLOW_povSelectExpr_in_povExpr2014: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x00000100, 0x00000000]),
    FOLLOW_set_in_povSelectExpr2040: new org.antlr.runtime.BitSet([0x01000000, 0x00000000]),
    FOLLOW_EQ_in_povSelectExpr2048: new org.antlr.runtime.BitSet([0x00000000, 0x00000040]),
    FOLLOW_stringArrayExpr_in_povSelectExpr2051: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_set_in_povSelectExpr2059: new org.antlr.runtime.BitSet([0x01000000, 0x00000000]),
    FOLLOW_EQ_in_povSelectExpr2067: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00200000, 0x00000000]),
    FOLLOW_STRING_in_povSelectExpr2070: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_LOOKUP_in_lookup2087: new org.antlr.runtime.BitSet([0x00000000, 0x00000040]),
    FOLLOW_LPAR_in_lookup2089: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00C00000, 0x00000000]),
    FOLLOW_FIELD_in_lookup2094: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_MEASURE_FIELD_in_lookup2100: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_COMMA_in_lookup2105: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_COMMA_in_lookup2109: new org.antlr.runtime.BitSet([0xC0000000, 0x00000040,0xFFFF8200, 0x00000000]),
    FOLLOW_expr_in_lookup2113: new org.antlr.runtime.BitSet([0x00000000, 0x00000080]),
    FOLLOW_RPAR_in_lookup2115: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_LOOKUP_in_lookup2144: new org.antlr.runtime.BitSet([0x00000000, 0x00000040]),
    FOLLOW_LPAR_in_lookup2146: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00C00000, 0x00000000]),
    FOLLOW_FIELD_in_lookup2151: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_MEASURE_FIELD_in_lookup2157: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_COMMA_in_lookup2160: new org.antlr.runtime.BitSet([0xC0000000, 0x00000040,0xFFFF8200, 0x00000000]),
    FOLLOW_expr_in_lookup2164: new org.antlr.runtime.BitSet([0x00000000, 0x00000480]),
    FOLLOW_COMMA_in_lookup2167: new org.antlr.runtime.BitSet([0xC0000000, 0x00000040,0xFFFF8200, 0x00000000]),
    FOLLOW_expr_in_lookup2171: new org.antlr.runtime.BitSet([0x00000000, 0x00000080]),
    FOLLOW_RPAR_in_lookup2175: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_andExpr_in_orExpr2211: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x00000080, 0x00000000]),
    FOLLOW_OR_in_orExpr2214: new org.antlr.runtime.BitSet([0xC0000000, 0x00000040,0xFFFF8200, 0x00000000]),
    FOLLOW_andExpr_in_orExpr2217: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x00000080, 0x00000000]),
    FOLLOW_equalExpr_in_andExpr2236: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x00000100, 0x00000000]),
    FOLLOW_AND_in_andExpr2239: new org.antlr.runtime.BitSet([0xC0000000, 0x00000040,0xFFFF8200, 0x00000000]),
    FOLLOW_equalExpr_in_andExpr2242: new org.antlr.runtime.BitSet([0x00000002, 0x00000000,0x00000100, 0x00000000]),
    FOLLOW_orExpr_in_chainExpr2260: new org.antlr.runtime.BitSet([0x00000002, 0x00000010]),
    FOLLOW_PIPE_in_chainExpr2263: new org.antlr.runtime.BitSet([0xC0000000, 0x00000040,0xFFFF8200, 0x00000000]),
    FOLLOW_orExpr_in_chainExpr2266: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_set_in_equalOp0: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_object_in_equalExpr2308: new org.antlr.runtime.BitSet([0x03000000, 0x00000020]),
    FOLLOW_equalOp_in_equalExpr2310: new org.antlr.runtime.BitSet([0x00000000, 0x00000040,0x80000000, 0x00000000]),
    FOLLOW_arrayExpr_in_equalExpr2313: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_comparisonExpr_in_equalExpr2321: new org.antlr.runtime.BitSet([0x03000002, 0x00000020]),
    FOLLOW_equalOp_in_equalExpr2324: new org.antlr.runtime.BitSet([0xC0000000, 0x00000040,0xFFFF8200, 0x00000000]),
    FOLLOW_comparisonExpr_in_equalExpr2327: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_set_in_compOp0: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_addExpr_in_comparisonExpr2369: new org.antlr.runtime.BitSet([0x3C000002, 0x00000000]),
    FOLLOW_compOp_in_comparisonExpr2372: new org.antlr.runtime.BitSet([0xC0000000, 0x00000040,0xFFFF8200, 0x00000000]),
    FOLLOW_addExpr_in_comparisonExpr2376: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_set_in_addOp0: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_multiplyExpr_in_addExpr2409: new org.antlr.runtime.BitSet([0xC0000002, 0x00000000]),
    FOLLOW_addOp_in_addExpr2412: new org.antlr.runtime.BitSet([0xC0000000, 0x00000040,0xFFFF8200, 0x00000000]),
    FOLLOW_multiplyExpr_in_addExpr2416: new org.antlr.runtime.BitSet([0xC0000002, 0x00000000]),
    FOLLOW_set_in_multOp0: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_unaryExpr_in_multiplyExpr2453: new org.antlr.runtime.BitSet([0x00000002, 0x00000007]),
    FOLLOW_multOp_in_multiplyExpr2456: new org.antlr.runtime.BitSet([0xC0000000, 0x00000040,0xFFFF8200, 0x00000000]),
    FOLLOW_unaryExpr_in_multiplyExpr2459: new org.antlr.runtime.BitSet([0x00000002, 0x00000007]),
    FOLLOW_unaryOp_in_unaryExpr2479: new org.antlr.runtime.BitSet([0xC0000000, 0x00000040,0xFFFF8200, 0x00000000]),
    FOLLOW_unaryExpr_in_unaryExpr2482: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_powerExpr_in_unaryExpr2487: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_PLUS_in_unaryOp2504: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_MINUS_in_unaryOp2525: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_NOT_in_unaryOp2545: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_factor_in_powerExpr2562: new org.antlr.runtime.BitSet([0x00000002, 0x00000008]),
    FOLLOW_POW_in_powerExpr2565: new org.antlr.runtime.BitSet([0xC0000000, 0x00000040,0xFFFF8200, 0x00000000]),
    FOLLOW_factor_in_powerExpr2568: new org.antlr.runtime.BitSet([0x00000002, 0x00000008]),
    FOLLOW_primitive_in_factor2588: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_parenthesizedExpr_in_factor2596: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_functionCall_in_factor2604: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_iterate_in_factor2612: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_NULL_in_primitive2629: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_INTEGER_in_primitive2637: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_DOUBLE_in_primitive2645: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_booleanLiteral_in_primitive2653: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_DATE_TIME_in_primitive2661: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_STRING_in_primitive2669: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_DOT_SEP_STRING_in_primitive2677: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_DQ_ALLOW_ESC_REGEX_STRING_in_primitive2685: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_object_in_primitive2693: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_set_in_object0: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_functionArrayExpr_in_arrayExpr2751: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_commaArrayExpr_in_arrayExpr2759: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_orArrayExpr_in_arrayExpr2767: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_andArrayExpr_in_arrayExpr2775: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_LPAR_in_orArrayExpr2793: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x7FFF0000, 0x00000000]),
    FOLLOW_orList_in_orArrayExpr2797: new org.antlr.runtime.BitSet([0x00000000, 0x00000080]),
    FOLLOW_RPAR_in_orArrayExpr2799: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_LPAR_in_andArrayExpr2828: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x7FFF0000, 0x00000000]),
    FOLLOW_andList_in_andArrayExpr2832: new org.antlr.runtime.BitSet([0x00000000, 0x00000080]),
    FOLLOW_RPAR_in_andArrayExpr2834: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_LPAR_in_commaArrayExpr2863: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x7FFF0000, 0x00000000]),
    FOLLOW_commaList_in_commaArrayExpr2867: new org.antlr.runtime.BitSet([0x00000000, 0x00000080]),
    FOLLOW_RPAR_in_commaArrayExpr2869: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_LPAR_in_stringArrayExpr2898: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00200000, 0x00000000]),
    FOLLOW_stringList_in_stringArrayExpr2902: new org.antlr.runtime.BitSet([0x00000000, 0x00000080]),
    FOLLOW_RPAR_in_stringArrayExpr2904: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_LPAR_in_parenthesizedExpr2932: new org.antlr.runtime.BitSet([0xC0000000, 0x00000040,0xFFFF8200, 0x00000000]),
    FOLLOW_expr_in_parenthesizedExpr2934: new org.antlr.runtime.BitSet([0x00000000, 0x00000080]),
    FOLLOW_RPAR_in_parenthesizedExpr2936: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_IDENTIFIER_in_functionCall2969: new org.antlr.runtime.BitSet([0x00000000, 0x00000040]),
    FOLLOW_LPAR_in_functionCall2971: new org.antlr.runtime.BitSet([0xC0000000, 0x000000C0,0xFFFF8200, 0x00000000]),
    FOLLOW_exprList_in_functionCall2975: new org.antlr.runtime.BitSet([0x00000000, 0x00000080]),
    FOLLOW_RPAR_in_functionCall2978: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_functionCall_in_chainedFunction3011: new org.antlr.runtime.BitSet([0x00000000, 0x00000800]),
    FOLLOW_DOT_in_chainedFunction3014: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x80000000, 0x00000000]),
    FOLLOW_functionCall_in_chainedFunction3017: new org.antlr.runtime.BitSet([0x00000002, 0x00000800]),
    FOLLOW_chainedFunction_in_functionArrayExpr3038: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_set_in_booleanLiteral0: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_object_in_synpred2_Hilo2308: new org.antlr.runtime.BitSet([0x03000000, 0x00000020]),
    FOLLOW_equalOp_in_synpred2_Hilo2310: new org.antlr.runtime.BitSet([0x00000000, 0x00000040,0x80000000, 0x00000000]),
    FOLLOW_arrayExpr_in_synpred2_Hilo2313: new org.antlr.runtime.BitSet([0x00000002, 0x00000000])
});

})();

oFF.HiloParser = HiloParser;
}
oFF.loadHiloTreeParser = function () {

// $ANTLR 3.3 Nov 30, 2010 12:46:29 antlr\\HiloTreeParser.g 2023-11-03 14:50:44

var HiloTreeParser = function(input, state) {
    if (!state) {
        state = new org.antlr.runtime.RecognizerSharedState();
    }

    (function(){

            //-------------------------------
            // Error management
            //-------------------------------
            this.emitErrorMessage = function(message) {
                throw new Error(message);
            };

            this.reportUnsupportedCrystalConstruct = function(operator) {
                throw new Error("Unsupported construct: " + operator);
            };

            this.setBuilder = function(builder) {
                this._builder = builder;
            };

    }).call(this);

    HiloTreeParser.superclass.constructor.call(this, input, state);




    /* @todo only create adaptor if output=AST */
    this.adaptor = new org.antlr.runtime.tree.CommonTreeAdaptor();

};

org.antlr.lang.augmentObject(HiloTreeParser, {
    EOF: -1,
    PARENTH_GROUP: 4,
    FUNCALL: 5,
    VARACCESS: 6,
    ARRAY: 7,
    SUBSCRIPT: 8,
    UNARY_PLUS: 9,
    UNARY_MINUS: 10,
    RANGE_UP_TO_: 11,
    RANGE_UP_TO: 12,
    RANGE_UP_FROM_: 13,
    RANGE_UP_FROM: 14,
    CAGR_FORMULA: 15,
    CAGR_FORMULA_WITH_DIMENSION: 16,
    LOOKUP_FORMULA: 17,
    SMA_FORMULA: 18,
    SMA_FORMULA_WITH_DIMENSION: 19,
    YOY_FORMULA: 20,
    YOY_FORMULA_WITH_DIMENSION: 21,
    LINK_FORMULA: 22,
    ITERATE_FUNCTION: 23,
    EQ: 24,
    NEQ: 25,
    LT: 26,
    GT: 27,
    GTE: 28,
    LTE: 29,
    PLUS: 30,
    MINUS: 31,
    MULT: 32,
    DIV: 33,
    REM: 34,
    POW: 35,
    PIPE: 36,
    ASSIGN: 37,
    LPAR: 38,
    RPAR: 39,
    LBRA: 40,
    RBRA: 41,
    COMMA: 42,
    DOT: 43,
    SEMICOLON: 44,
    A: 45,
    B: 46,
    C: 47,
    D: 48,
    E: 49,
    F: 50,
    G: 51,
    H: 52,
    I: 53,
    J: 54,
    K: 55,
    L: 56,
    M: 57,
    N: 58,
    O: 59,
    P: 60,
    Q: 61,
    R: 62,
    S: 63,
    T: 64,
    U: 65,
    V: 66,
    W: 67,
    X: 68,
    Y: 69,
    Z: 70,
    OR: 71,
    AND: 72,
    NOT: 73,
    CAGR: 74,
    LOOKUP: 75,
    SMA: 76,
    YOY: 77,
    LINK: 78,
    ITERATE: 79,
    NULL: 80,
    TRUE: 81,
    FALSE: 82,
    YES: 83,
    NO: 84,
    STRING: 85,
    FIELD: 86,
    MEASURE_FIELD: 87,
    INTEGER: 88,
    DOUBLE: 89,
    DATE_TIME: 90,
    DOT_SEP_STRING: 91,
    DQ_ALLOW_ESC_REGEX_STRING: 92,
    ATTRIBUTE: 93,
    OLD_ATTRIBUTE: 94,
    IDENTIFIER: 95,
    WHITESPACE: 96,
    COMMENT: 97,
    DIGIT: 98,
    EXPONENT: 99,
    LETTER: 100,
    SHARP: 101,
    DQ_STRING: 102,
    SQ_STRING: 103,
    ESC_REGEX: 104,
    ESC_SEQ: 105,
    HEX_DIGIT: 106,
    VARIABLE_FIELD: 107,
    NAME_IN_QUOTE: 108,
    OLD_FIELD_STR: 109,
    DIM_MEASURE_FIELD: 110,
    CALC_FIELD: 111,
    IN: 112,
    MOD: 113
});

(function(){
// public class variables
var EOF= -1,
    PARENTH_GROUP= 4,
    FUNCALL= 5,
    VARACCESS= 6,
    ARRAY= 7,
    SUBSCRIPT= 8,
    UNARY_PLUS= 9,
    UNARY_MINUS= 10,
    RANGE_UP_TO_= 11,
    RANGE_UP_TO= 12,
    RANGE_UP_FROM_= 13,
    RANGE_UP_FROM= 14,
    CAGR_FORMULA= 15,
    CAGR_FORMULA_WITH_DIMENSION= 16,
    LOOKUP_FORMULA= 17,
    SMA_FORMULA= 18,
    SMA_FORMULA_WITH_DIMENSION= 19,
    YOY_FORMULA= 20,
    YOY_FORMULA_WITH_DIMENSION= 21,
    LINK_FORMULA= 22,
    ITERATE_FUNCTION= 23,
    EQ= 24,
    NEQ= 25,
    LT= 26,
    GT= 27,
    GTE= 28,
    LTE= 29,
    PLUS= 30,
    MINUS= 31,
    MULT= 32,
    DIV= 33,
    REM= 34,
    POW= 35,
    PIPE= 36,
    ASSIGN= 37,
    LPAR= 38,
    RPAR= 39,
    LBRA= 40,
    RBRA= 41,
    COMMA= 42,
    DOT= 43,
    SEMICOLON= 44,
    A= 45,
    B= 46,
    C= 47,
    D= 48,
    E= 49,
    F= 50,
    G= 51,
    H= 52,
    I= 53,
    J= 54,
    K= 55,
    L= 56,
    M= 57,
    N= 58,
    O= 59,
    P= 60,
    Q= 61,
    R= 62,
    S= 63,
    T= 64,
    U= 65,
    V= 66,
    W= 67,
    X= 68,
    Y= 69,
    Z= 70,
    OR= 71,
    AND= 72,
    NOT= 73,
    CAGR= 74,
    LOOKUP= 75,
    SMA= 76,
    YOY= 77,
    LINK= 78,
    ITERATE= 79,
    NULL= 80,
    TRUE= 81,
    FALSE= 82,
    YES= 83,
    NO= 84,
    STRING= 85,
    FIELD= 86,
    MEASURE_FIELD= 87,
    INTEGER= 88,
    DOUBLE= 89,
    DATE_TIME= 90,
    DOT_SEP_STRING= 91,
    DQ_ALLOW_ESC_REGEX_STRING= 92,
    ATTRIBUTE= 93,
    OLD_ATTRIBUTE= 94,
    IDENTIFIER= 95,
    WHITESPACE= 96,
    COMMENT= 97,
    DIGIT= 98,
    EXPONENT= 99,
    LETTER= 100,
    SHARP= 101,
    DQ_STRING= 102,
    SQ_STRING= 103,
    ESC_REGEX= 104,
    ESC_SEQ= 105,
    HEX_DIGIT= 106,
    VARIABLE_FIELD= 107,
    NAME_IN_QUOTE= 108,
    OLD_FIELD_STR= 109,
    DIM_MEASURE_FIELD= 110,
    CALC_FIELD= 111,
    IN= 112,
    MOD= 113;
var UP = org.antlr.runtime.Token.UP,
    DOWN = org.antlr.runtime.Token.DOWN;

// public instance methods/vars
org.antlr.lang.extend(HiloTreeParser, org.antlr.runtime.tree.TreeParser, {


    getTokenNames: function() { return HiloTreeParser.tokenNames; },
    getGrammarFileName: function() { return "antlr\\HiloTreeParser.g"; }
});
org.antlr.lang.augmentObject(HiloTreeParser.prototype, {


    // antlr\\HiloTreeParser.g:34:1: formula returns [ISymbolicFormula result] : (e= expr | c= cagr | l= lookup | s= sma | y= yoy | l= link );
    // $ANTLR start "formula"
    formula: function() {
        var result = null;

         var e = null;
         var c = null;
         var l = null;
         var s = null;
         var y = null;

        try {
            // antlr\\HiloTreeParser.g:35:5: (e= expr | c= cagr | l= lookup | s= sma | y= yoy | l= link )
            var alt1=6;
            switch ( this.input.LA(1) ) {
            case PARENTH_GROUP:
            case FUNCALL:
            case VARACCESS:
            case ARRAY:
            case UNARY_MINUS:
            case ITERATE_FUNCTION:
            case EQ:
            case NEQ:
            case LT:
            case GT:
            case GTE:
            case LTE:
            case PLUS:
            case MINUS:
            case MULT:
            case DIV:
            case POW:
            case PIPE:
            case ASSIGN:
            case OR:
            case AND:
            case NOT:
            case NULL:
            case TRUE:
            case FALSE:
            case YES:
            case NO:
            case STRING:
            case FIELD:
            case MEASURE_FIELD:
            case INTEGER:
            case DOUBLE:
            case DATE_TIME:
            case DOT_SEP_STRING:
            case DQ_ALLOW_ESC_REGEX_STRING:
            case ATTRIBUTE:
            case OLD_ATTRIBUTE:
            case IN:
            case MOD:
                alt1=1;
                break;
            case CAGR_FORMULA:
            case CAGR_FORMULA_WITH_DIMENSION:
                alt1=2;
                break;
            case LOOKUP_FORMULA:
                alt1=3;
                break;
            case SMA_FORMULA:
            case SMA_FORMULA_WITH_DIMENSION:
                alt1=4;
                break;
            case YOY_FORMULA:
            case YOY_FORMULA_WITH_DIMENSION:
                alt1=5;
                break;
            case LINK_FORMULA:
                alt1=6;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 1, 0, this.input);

                throw nvae;
            }

            switch (alt1) {
                case 1 :
                    // antlr\\HiloTreeParser.g:35:7: e= expr
                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_formula72);
                    e=this.expr();

                    this.state._fsp--;

                    result = this._builder.makeRootFormula(e);


                    break;
                case 2 :
                    // antlr\\HiloTreeParser.g:36:7: c= cagr
                    this.pushFollow(HiloTreeParser.FOLLOW_cagr_in_formula120);
                    c=this.cagr();

                    this.state._fsp--;

                    result = this._builder.makeRootFormula(c);


                    break;
                case 3 :
                    // antlr\\HiloTreeParser.g:37:7: l= lookup
                    this.pushFollow(HiloTreeParser.FOLLOW_lookup_in_formula168);
                    l=this.lookup();

                    this.state._fsp--;

                    result = this._builder.makeRootFormula(l);


                    break;
                case 4 :
                    // antlr\\HiloTreeParser.g:38:7: s= sma
                    this.pushFollow(HiloTreeParser.FOLLOW_sma_in_formula214);
                    s=this.sma();

                    this.state._fsp--;

                    result = this._builder.makeRootFormula(s);


                    break;
                case 5 :
                    // antlr\\HiloTreeParser.g:39:7: y= yoy
                    this.pushFollow(HiloTreeParser.FOLLOW_yoy_in_formula263);
                    y=this.yoy();

                    this.state._fsp--;

                    result = this._builder.makeRootFormula(y);


                    break;
                case 6 :
                    // antlr\\HiloTreeParser.g:40:7: l= link
                    this.pushFollow(HiloTreeParser.FOLLOW_link_in_formula312);
                    l=this.link();

                    this.state._fsp--;

                    result = this._builder.makeRootFormula(l);


                    break;

            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return result;
    },


    // antlr\\HiloTreeParser.g:44:1: expr returns [IFormulaItem result] : ( ^( PARENTH_GROUP e= expr ) | ^(op= PIPE e1= expr e2= expr ) | ^(op= OR e1= expr e2= expr ) | ^(op= AND e1= expr e2= expr ) | ^(op= EQ e1= expr e2= expr ) | ^(op= ASSIGN e1= expr e2= expr ) | ^(op= NEQ e1= expr e2= expr ) | ^(op= IN e1= expr e2= expr ) | ^(op= LT e1= expr e2= expr ) | ^(op= GT e1= expr e2= expr ) | ^(op= GTE e1= expr e2= expr ) | ^(op= LTE e1= expr e2= expr ) | ^(op= PLUS e1= expr e2= expr ) | ^(op= MINUS e1= expr e2= expr ) | ^(op= MOD e1= expr e2= expr ) | ^(op= MULT e1= expr e2= expr ) | ^(op= DIV e1= expr e2= expr ) | ^(op= POW e1= expr e2= expr ) | ^(op= UNARY_MINUS exl= exprList ) | ^(op= NOT exl= exprList ) | ^(op= ARRAY exl= exprList ) | ^( VARACCESS IDENTIFIER ) | ^( FUNCALL IDENTIFIER (exl= exprList )? ) | ^( ITERATE_FUNCTION func= expr (base= FIELD | base= MEASURE_FIELD )? dims= expr ) | INTEGER | DOUBLE | ( TRUE | YES ) | ( FALSE | NO ) | DATE_TIME | STRING | DOT_SEP_STRING | DQ_ALLOW_ESC_REGEX_STRING | FIELD | ATTRIBUTE | MEASURE_FIELD | OLD_ATTRIBUTE | NULL );
    // $ANTLR start "expr"
    expr: function() {
        var result = null;

        var op = null;
        var base = null;
        var IDENTIFIER1 = null;
        var IDENTIFIER2 = null;
        var INTEGER3 = null;
        var DOUBLE4 = null;
        var DATE_TIME5 = null;
        var STRING6 = null;
        var DOT_SEP_STRING7 = null;
        var DQ_ALLOW_ESC_REGEX_STRING8 = null;
        var FIELD9 = null;
        var ATTRIBUTE10 = null;
        var MEASURE_FIELD11 = null;
        var OLD_ATTRIBUTE12 = null;
         var e = null;
         var e1 = null;
         var e2 = null;
         var exl = null;
         var func = null;
         var dims = null;

        try {
            // antlr\\HiloTreeParser.g:45:5: ( ^( PARENTH_GROUP e= expr ) | ^(op= PIPE e1= expr e2= expr ) | ^(op= OR e1= expr e2= expr ) | ^(op= AND e1= expr e2= expr ) | ^(op= EQ e1= expr e2= expr ) | ^(op= ASSIGN e1= expr e2= expr ) | ^(op= NEQ e1= expr e2= expr ) | ^(op= IN e1= expr e2= expr ) | ^(op= LT e1= expr e2= expr ) | ^(op= GT e1= expr e2= expr ) | ^(op= GTE e1= expr e2= expr ) | ^(op= LTE e1= expr e2= expr ) | ^(op= PLUS e1= expr e2= expr ) | ^(op= MINUS e1= expr e2= expr ) | ^(op= MOD e1= expr e2= expr ) | ^(op= MULT e1= expr e2= expr ) | ^(op= DIV e1= expr e2= expr ) | ^(op= POW e1= expr e2= expr ) | ^(op= UNARY_MINUS exl= exprList ) | ^(op= NOT exl= exprList ) | ^(op= ARRAY exl= exprList ) | ^( VARACCESS IDENTIFIER ) | ^( FUNCALL IDENTIFIER (exl= exprList )? ) | ^( ITERATE_FUNCTION func= expr (base= FIELD | base= MEASURE_FIELD )? dims= expr ) | INTEGER | DOUBLE | ( TRUE | YES ) | ( FALSE | NO ) | DATE_TIME | STRING | DOT_SEP_STRING | DQ_ALLOW_ESC_REGEX_STRING | FIELD | ATTRIBUTE | MEASURE_FIELD | OLD_ATTRIBUTE | NULL )
            var alt4=37;
            switch ( this.input.LA(1) ) {
            case PARENTH_GROUP:
                alt4=1;
                break;
            case PIPE:
                alt4=2;
                break;
            case OR:
                alt4=3;
                break;
            case AND:
                alt4=4;
                break;
            case EQ:
                alt4=5;
                break;
            case ASSIGN:
                alt4=6;
                break;
            case NEQ:
                alt4=7;
                break;
            case IN:
                alt4=8;
                break;
            case LT:
                alt4=9;
                break;
            case GT:
                alt4=10;
                break;
            case GTE:
                alt4=11;
                break;
            case LTE:
                alt4=12;
                break;
            case PLUS:
                alt4=13;
                break;
            case MINUS:
                alt4=14;
                break;
            case MOD:
                alt4=15;
                break;
            case MULT:
                alt4=16;
                break;
            case DIV:
                alt4=17;
                break;
            case POW:
                alt4=18;
                break;
            case UNARY_MINUS:
                alt4=19;
                break;
            case NOT:
                alt4=20;
                break;
            case ARRAY:
                alt4=21;
                break;
            case VARACCESS:
                alt4=22;
                break;
            case FUNCALL:
                alt4=23;
                break;
            case ITERATE_FUNCTION:
                alt4=24;
                break;
            case INTEGER:
                alt4=25;
                break;
            case DOUBLE:
                alt4=26;
                break;
            case TRUE:
            case YES:
                alt4=27;
                break;
            case FALSE:
            case NO:
                alt4=28;
                break;
            case DATE_TIME:
                alt4=29;
                break;
            case STRING:
                alt4=30;
                break;
            case DOT_SEP_STRING:
                alt4=31;
                break;
            case DQ_ALLOW_ESC_REGEX_STRING:
                alt4=32;
                break;
            case FIELD:
                alt4=33;
                break;
            case ATTRIBUTE:
                alt4=34;
                break;
            case MEASURE_FIELD:
                alt4=35;
                break;
            case OLD_ATTRIBUTE:
                alt4=36;
                break;
            case NULL:
                alt4=37;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 4, 0, this.input);

                throw nvae;
            }

            switch (alt4) {
                case 1 :
                    // antlr\\HiloTreeParser.g:45:7: ^( PARENTH_GROUP e= expr )
                    this.match(this.input,PARENTH_GROUP,HiloTreeParser.FOLLOW_PARENTH_GROUP_in_expr376);

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null);
                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_expr380);
                    e=this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null);
                     result = this._builder.makeParenthesizedGroup(e);


                    break;
                case 2 :
                    // antlr\\HiloTreeParser.g:46:7: ^(op= PIPE e1= expr e2= expr )
                    op=this.match(this.input,PIPE,HiloTreeParser.FOLLOW_PIPE_in_expr416);

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null);
                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_expr424);
                    e1=this.expr();

                    this.state._fsp--;

                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_expr428);
                    e2=this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null);
                     result = this._builder.makeFunctionCall(op, e1, e2);


                    break;
                case 3 :
                    // antlr\\HiloTreeParser.g:47:7: ^(op= OR e1= expr e2= expr )
                    op=this.match(this.input,OR,HiloTreeParser.FOLLOW_OR_in_expr457);

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null);
                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_expr467);
                    e1=this.expr();

                    this.state._fsp--;

                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_expr471);
                    e2=this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null);
                     result = this._builder.makeFunctionCall(op, e1, e2);


                    break;
                case 4 :
                    // antlr\\HiloTreeParser.g:48:7: ^(op= AND e1= expr e2= expr )
                    op=this.match(this.input,AND,HiloTreeParser.FOLLOW_AND_in_expr500);

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null);
                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_expr509);
                    e1=this.expr();

                    this.state._fsp--;

                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_expr513);
                    e2=this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null);
                     result = this._builder.makeFunctionCall(op, e1, e2);


                    break;
                case 5 :
                    // antlr\\HiloTreeParser.g:49:7: ^(op= EQ e1= expr e2= expr )
                    op=this.match(this.input,EQ,HiloTreeParser.FOLLOW_EQ_in_expr542);

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null);
                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_expr552);
                    e1=this.expr();

                    this.state._fsp--;

                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_expr556);
                    e2=this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null);
                     result = this._builder.makeFunctionCall(op, e1, e2);


                    break;
                case 6 :
                    // antlr\\HiloTreeParser.g:50:7: ^(op= ASSIGN e1= expr e2= expr )
                    op=this.match(this.input,ASSIGN,HiloTreeParser.FOLLOW_ASSIGN_in_expr585);

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null);
                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_expr591);
                    e1=this.expr();

                    this.state._fsp--;

                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_expr595);
                    e2=this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null);
                     result = this._builder.makeFunctionCall(op, e1, e2);


                    break;
                case 7 :
                    // antlr\\HiloTreeParser.g:51:7: ^(op= NEQ e1= expr e2= expr )
                    op=this.match(this.input,NEQ,HiloTreeParser.FOLLOW_NEQ_in_expr624);

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null);
                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_expr633);
                    e1=this.expr();

                    this.state._fsp--;

                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_expr637);
                    e2=this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null);
                     result = this._builder.makeFunctionCall(op, e1, e2);


                    break;
                case 8 :
                    // antlr\\HiloTreeParser.g:52:7: ^(op= IN e1= expr e2= expr )
                    op=this.match(this.input,IN,HiloTreeParser.FOLLOW_IN_in_expr666);

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null);
                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_expr676);
                    e1=this.expr();

                    this.state._fsp--;

                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_expr680);
                    e2=this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null);
                     result = this._builder.makeFunctionCall(op, e1, e2);


                    break;
                case 9 :
                    // antlr\\HiloTreeParser.g:53:7: ^(op= LT e1= expr e2= expr )
                    op=this.match(this.input,LT,HiloTreeParser.FOLLOW_LT_in_expr709);

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null);
                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_expr719);
                    e1=this.expr();

                    this.state._fsp--;

                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_expr723);
                    e2=this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null);
                     result = this._builder.makeFunctionCall(op, e1, e2);


                    break;
                case 10 :
                    // antlr\\HiloTreeParser.g:54:7: ^(op= GT e1= expr e2= expr )
                    op=this.match(this.input,GT,HiloTreeParser.FOLLOW_GT_in_expr752);

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null);
                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_expr762);
                    e1=this.expr();

                    this.state._fsp--;

                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_expr766);
                    e2=this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null);
                     result = this._builder.makeFunctionCall(op, e1, e2);


                    break;
                case 11 :
                    // antlr\\HiloTreeParser.g:55:7: ^(op= GTE e1= expr e2= expr )
                    op=this.match(this.input,GTE,HiloTreeParser.FOLLOW_GTE_in_expr795);

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null);
                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_expr804);
                    e1=this.expr();

                    this.state._fsp--;

                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_expr808);
                    e2=this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null);
                     result = this._builder.makeFunctionCall(op, e1, e2);


                    break;
                case 12 :
                    // antlr\\HiloTreeParser.g:56:7: ^(op= LTE e1= expr e2= expr )
                    op=this.match(this.input,LTE,HiloTreeParser.FOLLOW_LTE_in_expr837);

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null);
                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_expr846);
                    e1=this.expr();

                    this.state._fsp--;

                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_expr850);
                    e2=this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null);
                     result = this._builder.makeFunctionCall(op, e1, e2);


                    break;
                case 13 :
                    // antlr\\HiloTreeParser.g:57:7: ^(op= PLUS e1= expr e2= expr )
                    op=this.match(this.input,PLUS,HiloTreeParser.FOLLOW_PLUS_in_expr879);

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null);
                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_expr887);
                    e1=this.expr();

                    this.state._fsp--;

                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_expr891);
                    e2=this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null);
                     result = this._builder.makeFunctionCall(op, e1, e2);


                    break;
                case 14 :
                    // antlr\\HiloTreeParser.g:58:7: ^(op= MINUS e1= expr e2= expr )
                    op=this.match(this.input,MINUS,HiloTreeParser.FOLLOW_MINUS_in_expr920);

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null);
                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_expr927);
                    e1=this.expr();

                    this.state._fsp--;

                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_expr931);
                    e2=this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null);
                     result = this._builder.makeFunctionCall(op, e1, e2);


                    break;
                case 15 :
                    // antlr\\HiloTreeParser.g:59:7: ^(op= MOD e1= expr e2= expr )
                    op=this.match(this.input,MOD,HiloTreeParser.FOLLOW_MOD_in_expr960);

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null);
                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_expr969);
                    e1=this.expr();

                    this.state._fsp--;

                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_expr973);
                    e2=this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null);
                     result = this._builder.makeFunctionCall(op, e1, e2);


                    break;
                case 16 :
                    // antlr\\HiloTreeParser.g:60:7: ^(op= MULT e1= expr e2= expr )
                    op=this.match(this.input,MULT,HiloTreeParser.FOLLOW_MULT_in_expr1002);

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null);
                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_expr1010);
                    e1=this.expr();

                    this.state._fsp--;

                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_expr1014);
                    e2=this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null);
                     result = this._builder.makeFunctionCall(op, e1, e2);


                    break;
                case 17 :
                    // antlr\\HiloTreeParser.g:61:7: ^(op= DIV e1= expr e2= expr )
                    op=this.match(this.input,DIV,HiloTreeParser.FOLLOW_DIV_in_expr1043);

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null);
                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_expr1052);
                    e1=this.expr();

                    this.state._fsp--;

                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_expr1056);
                    e2=this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null);
                     result = this._builder.makeFunctionCall(op, e1, e2);


                    break;
                case 18 :
                    // antlr\\HiloTreeParser.g:62:7: ^(op= POW e1= expr e2= expr )
                    op=this.match(this.input,POW,HiloTreeParser.FOLLOW_POW_in_expr1085);

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null);
                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_expr1094);
                    e1=this.expr();

                    this.state._fsp--;

                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_expr1098);
                    e2=this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null);
                     result = this._builder.makeFunctionCall(op, e1, e2);


                    break;
                case 19 :
                    // antlr\\HiloTreeParser.g:63:7: ^(op= UNARY_MINUS exl= exprList )
                    op=this.match(this.input,UNARY_MINUS,HiloTreeParser.FOLLOW_UNARY_MINUS_in_expr1127);

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null);
                    this.pushFollow(HiloTreeParser.FOLLOW_exprList_in_expr1131);
                    exl=this.exprList();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null);
                     result = this._builder.makeFunctionCall2(op, exl);


                    break;
                case 20 :
                    // antlr\\HiloTreeParser.g:64:7: ^(op= NOT exl= exprList )
                    op=this.match(this.input,NOT,HiloTreeParser.FOLLOW_NOT_in_expr1160);

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null);
                    this.pushFollow(HiloTreeParser.FOLLOW_exprList_in_expr1164);
                    exl=this.exprList();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null);
                     result = this._builder.makeFunctionCall2(op, exl);


                    break;
                case 21 :
                    // antlr\\HiloTreeParser.g:65:7: ^(op= ARRAY exl= exprList )
                    op=this.match(this.input,ARRAY,HiloTreeParser.FOLLOW_ARRAY_in_expr1201);

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null);
                    this.pushFollow(HiloTreeParser.FOLLOW_exprList_in_expr1205);
                    exl=this.exprList();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null);
                     result = this._builder.makeArray(op, exl);


                    break;
                case 22 :
                    // antlr\\HiloTreeParser.g:66:7: ^( VARACCESS IDENTIFIER )
                    this.match(this.input,VARACCESS,HiloTreeParser.FOLLOW_VARACCESS_in_expr1238);

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null);
                    IDENTIFIER1=this.match(this.input,IDENTIFIER,HiloTreeParser.FOLLOW_IDENTIFIER_in_expr1240);

                    this.match(this.input, org.antlr.runtime.Token.UP, null);
                     result = this._builder.makeVariableAccess(IDENTIFIER1);


                    break;
                case 23 :
                    // antlr\\HiloTreeParser.g:67:7: ^( FUNCALL IDENTIFIER (exl= exprList )? )
                    this.match(this.input,FUNCALL,HiloTreeParser.FOLLOW_FUNCALL_in_expr1274);

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null);
                    IDENTIFIER2=this.match(this.input,IDENTIFIER,HiloTreeParser.FOLLOW_IDENTIFIER_in_expr1276);
                    // antlr\\HiloTreeParser.g:67:31: (exl= exprList )?
                    var alt2=2;
                    switch ( this.input.LA(1) ) {
                        case PARENTH_GROUP:
                        case FUNCALL:
                        case VARACCESS:
                        case ARRAY:
                        case UNARY_MINUS:
                        case ITERATE_FUNCTION:
                        case EQ:
                        case NEQ:
                        case LT:
                        case GT:
                        case GTE:
                        case LTE:
                        case PLUS:
                        case MINUS:
                        case MULT:
                        case DIV:
                        case POW:
                        case PIPE:
                        case ASSIGN:
                        case OR:
                        case AND:
                        case NOT:
                        case NULL:
                        case TRUE:
                        case FALSE:
                        case YES:
                        case NO:
                        case STRING:
                        case FIELD:
                        case MEASURE_FIELD:
                        case INTEGER:
                        case DOUBLE:
                        case DATE_TIME:
                        case DOT_SEP_STRING:
                        case DQ_ALLOW_ESC_REGEX_STRING:
                        case ATTRIBUTE:
                        case OLD_ATTRIBUTE:
                        case IN:
                        case MOD:
                            alt2=1;
                            break;
                    }

                    switch (alt2) {
                        case 1 :
                            // antlr\\HiloTreeParser.g:67:31: exl= exprList
                            this.pushFollow(HiloTreeParser.FOLLOW_exprList_in_expr1280);
                            exl=this.exprList();

                            this.state._fsp--;



                            break;

                    }


                    this.match(this.input, org.antlr.runtime.Token.UP, null);
                     result = this._builder.makeFunctionCall2(IDENTIFIER2, exl);


                    break;
                case 24 :
                    // antlr\\HiloTreeParser.g:68:7: ^( ITERATE_FUNCTION func= expr (base= FIELD | base= MEASURE_FIELD )? dims= expr )
                    this.match(this.input,ITERATE_FUNCTION,HiloTreeParser.FOLLOW_ITERATE_FUNCTION_in_expr1303);

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null);
                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_expr1307);
                    func=this.expr();

                    this.state._fsp--;

                    // antlr\\HiloTreeParser.g:68:36: (base= FIELD | base= MEASURE_FIELD )?
                    var alt3=3;
                    switch ( this.input.LA(1) ) {
                        case FIELD:
                            switch ( this.input.LA(2) ) {
                                case PARENTH_GROUP:
                                case FUNCALL:
                                case VARACCESS:
                                case ARRAY:
                                case UNARY_MINUS:
                                case ITERATE_FUNCTION:
                                case EQ:
                                case NEQ:
                                case LT:
                                case GT:
                                case GTE:
                                case LTE:
                                case PLUS:
                                case MINUS:
                                case MULT:
                                case DIV:
                                case POW:
                                case PIPE:
                                case ASSIGN:
                                case OR:
                                case AND:
                                case NOT:
                                case NULL:
                                case TRUE:
                                case FALSE:
                                case YES:
                                case NO:
                                case STRING:
                                case FIELD:
                                case MEASURE_FIELD:
                                case INTEGER:
                                case DOUBLE:
                                case DATE_TIME:
                                case DOT_SEP_STRING:
                                case DQ_ALLOW_ESC_REGEX_STRING:
                                case ATTRIBUTE:
                                case OLD_ATTRIBUTE:
                                case IN:
                                case MOD:
                                    alt3=1;
                                    break;
                            }

                            break;
                        case MEASURE_FIELD:
                            switch ( this.input.LA(2) ) {
                                case PARENTH_GROUP:
                                case FUNCALL:
                                case VARACCESS:
                                case ARRAY:
                                case UNARY_MINUS:
                                case ITERATE_FUNCTION:
                                case EQ:
                                case NEQ:
                                case LT:
                                case GT:
                                case GTE:
                                case LTE:
                                case PLUS:
                                case MINUS:
                                case MULT:
                                case DIV:
                                case POW:
                                case PIPE:
                                case ASSIGN:
                                case OR:
                                case AND:
                                case NOT:
                                case NULL:
                                case TRUE:
                                case FALSE:
                                case YES:
                                case NO:
                                case STRING:
                                case FIELD:
                                case MEASURE_FIELD:
                                case INTEGER:
                                case DOUBLE:
                                case DATE_TIME:
                                case DOT_SEP_STRING:
                                case DQ_ALLOW_ESC_REGEX_STRING:
                                case ATTRIBUTE:
                                case OLD_ATTRIBUTE:
                                case IN:
                                case MOD:
                                    alt3=2;
                                    break;
                            }

                            break;
                    }

                    switch (alt3) {
                        case 1 :
                            // antlr\\HiloTreeParser.g:68:37: base= FIELD
                            base=this.match(this.input,FIELD,HiloTreeParser.FOLLOW_FIELD_in_expr1312);


                            break;
                        case 2 :
                            // antlr\\HiloTreeParser.g:68:50: base= MEASURE_FIELD
                            base=this.match(this.input,MEASURE_FIELD,HiloTreeParser.FOLLOW_MEASURE_FIELD_in_expr1318);


                            break;

                    }

                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_expr1324);
                    dims=this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null);

                            result = this._builder.makeIterate(func, this._builder.makeOptionalMeasureField(base), dims);



                    break;
                case 25 :
                    // antlr\\HiloTreeParser.g:71:7: INTEGER
                    INTEGER3=this.match(this.input,INTEGER,HiloTreeParser.FOLLOW_INTEGER_in_expr1335);
                     result = this._builder.makeInteger (INTEGER3);


                    break;
                case 26 :
                    // antlr\\HiloTreeParser.g:72:7: DOUBLE
                    DOUBLE4=this.match(this.input,DOUBLE,HiloTreeParser.FOLLOW_DOUBLE_in_expr1383);
                     result = this._builder.makeDouble  (DOUBLE4);


                    break;
                case 27 :
                    // antlr\\HiloTreeParser.g:73:7: ( TRUE | YES )
                    if ( this.input.LA(1)==TRUE||this.input.LA(1)==YES ) {
                        this.input.consume();
                        this.state.errorRecovery=false;
                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        throw mse;
                    }

                     result = this._builder.makeBoolean (true);


                    break;
                case 28 :
                    // antlr\\HiloTreeParser.g:74:7: ( FALSE | NO )
                    if ( this.input.LA(1)==FALSE||this.input.LA(1)==NO ) {
                        this.input.consume();
                        this.state.errorRecovery=false;
                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        throw mse;
                    }

                     result = this._builder.makeBoolean (false);


                    break;
                case 29 :
                    // antlr\\HiloTreeParser.g:75:7: DATE_TIME
                    DATE_TIME5=this.match(this.input,DATE_TIME,HiloTreeParser.FOLLOW_DATE_TIME_in_expr1530);
                     result = this._builder.makeDateTime(DATE_TIME5);


                    break;
                case 30 :
                    // antlr\\HiloTreeParser.g:76:7: STRING
                    STRING6=this.match(this.input,STRING,HiloTreeParser.FOLLOW_STRING_in_expr1576);
                     result = this._builder.makeString  ((STRING6?STRING6.getText():null));


                    break;
                case 31 :
                    // antlr\\HiloTreeParser.g:77:7: DOT_SEP_STRING
                    DOT_SEP_STRING7=this.match(this.input,DOT_SEP_STRING,HiloTreeParser.FOLLOW_DOT_SEP_STRING_in_expr1625);
                     result = this._builder.makeDotSeparatedString  (DOT_SEP_STRING7);


                    break;
                case 32 :
                    // antlr\\HiloTreeParser.g:78:7: DQ_ALLOW_ESC_REGEX_STRING
                    DQ_ALLOW_ESC_REGEX_STRING8=this.match(this.input,DQ_ALLOW_ESC_REGEX_STRING,HiloTreeParser.FOLLOW_DQ_ALLOW_ESC_REGEX_STRING_in_expr1666);
                     result = this._builder.makeAllowEscapeRegexString  (DQ_ALLOW_ESC_REGEX_STRING8);


                    break;
                case 33 :
                    // antlr\\HiloTreeParser.g:79:7: FIELD
                    FIELD9=this.match(this.input,FIELD,HiloTreeParser.FOLLOW_FIELD_in_expr1696);
                     result = this._builder.makeField   (FIELD9);


                    break;
                case 34 :
                    // antlr\\HiloTreeParser.g:80:7: ATTRIBUTE
                    ATTRIBUTE10=this.match(this.input,ATTRIBUTE,HiloTreeParser.FOLLOW_ATTRIBUTE_in_expr1746);
                     result = this._builder.makeAttribute(ATTRIBUTE10);


                    break;
                case 35 :
                    // antlr\\HiloTreeParser.g:81:7: MEASURE_FIELD
                    MEASURE_FIELD11=this.match(this.input,MEASURE_FIELD,HiloTreeParser.FOLLOW_MEASURE_FIELD_in_expr1792);
                     result = this._builder.makeMeasureField(MEASURE_FIELD11);


                    break;
                case 36 :
                    // antlr\\HiloTreeParser.g:82:7: OLD_ATTRIBUTE
                    OLD_ATTRIBUTE12=this.match(this.input,OLD_ATTRIBUTE,HiloTreeParser.FOLLOW_OLD_ATTRIBUTE_in_expr1834);
                     result = this._builder.makeAttribute(OLD_ATTRIBUTE12);


                    break;
                case 37 :
                    // antlr\\HiloTreeParser.g:83:7: NULL
                    this.match(this.input,NULL,HiloTreeParser.FOLLOW_NULL_in_expr1876);
                     result = this._builder.makeNull    ();


                    break;

            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return result;
    },


    // antlr\\HiloTreeParser.g:86:1: exprList returns [expressions] : (item= expr )+ ;
    // $ANTLR start "exprList"
    exprList: function() {
        var expressions = null;

         var item = null;

        try {
            // antlr\\HiloTreeParser.g:87:5: ( (item= expr )+ )
            // antlr\\HiloTreeParser.g:87:50: (item= expr )+
            expressions = oFF.XList.create();
            // antlr\\HiloTreeParser.g:88:5: (item= expr )+
            var cnt5=0;
            loop5:
            do {
                var alt5=2;
                switch ( this.input.LA(1) ) {
                case PARENTH_GROUP:
                case FUNCALL:
                case VARACCESS:
                case ARRAY:
                case UNARY_MINUS:
                case ITERATE_FUNCTION:
                case EQ:
                case NEQ:
                case LT:
                case GT:
                case GTE:
                case LTE:
                case PLUS:
                case MINUS:
                case MULT:
                case DIV:
                case POW:
                case PIPE:
                case ASSIGN:
                case OR:
                case AND:
                case NOT:
                case NULL:
                case TRUE:
                case FALSE:
                case YES:
                case NO:
                case STRING:
                case FIELD:
                case MEASURE_FIELD:
                case INTEGER:
                case DOUBLE:
                case DATE_TIME:
                case DOT_SEP_STRING:
                case DQ_ALLOW_ESC_REGEX_STRING:
                case ATTRIBUTE:
                case OLD_ATTRIBUTE:
                case IN:
                case MOD:
                    alt5=1;
                    break;

                }

                switch (alt5) {
                case 1 :
                    // antlr\\HiloTreeParser.g:88:6: item= expr
                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_exprList1996);
                    item=this.expr();

                    this.state._fsp--;

                    expressions.add(item);


                    break;

                default :
                    if ( cnt5 >= 1 ) {
                        break loop5;
                    }
                        var eee = new org.antlr.runtime.EarlyExitException(5, this.input);
                        throw eee;
                }
                cnt5++;
            } while (true);




        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return expressions;
    },


    // antlr\\HiloTreeParser.g:92:1: cagr returns [result] : ( ^( CAGR_FORMULA (measure= FIELD | measure= MEASURE_FIELD ) (start= STRING | start= FIELD ) (end= STRING | end= FIELD ) ) | ^( CAGR_FORMULA_WITH_DIMENSION (measure= FIELD | measure= MEASURE_FIELD ) (start= STRING | start= FIELD ) (end= STRING | end= FIELD ) dimension= FIELD ) );
    // $ANTLR start "cagr"
    cagr: function() {
        var result = null;

        var measure = null;
        var start = null;
        var end = null;
        var dimension = null;

        try {
            // antlr\\HiloTreeParser.g:93:5: ( ^( CAGR_FORMULA (measure= FIELD | measure= MEASURE_FIELD ) (start= STRING | start= FIELD ) (end= STRING | end= FIELD ) ) | ^( CAGR_FORMULA_WITH_DIMENSION (measure= FIELD | measure= MEASURE_FIELD ) (start= STRING | start= FIELD ) (end= STRING | end= FIELD ) dimension= FIELD ) )
            var alt12=2;
            switch ( this.input.LA(1) ) {
            case CAGR_FORMULA:
                alt12=1;
                break;
            case CAGR_FORMULA_WITH_DIMENSION:
                alt12=2;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 12, 0, this.input);

                throw nvae;
            }

            switch (alt12) {
                case 1 :
                    // antlr\\HiloTreeParser.g:93:7: ^( CAGR_FORMULA (measure= FIELD | measure= MEASURE_FIELD ) (start= STRING | start= FIELD ) (end= STRING | end= FIELD ) )
                    this.match(this.input,CAGR_FORMULA,HiloTreeParser.FOLLOW_CAGR_FORMULA_in_cagr2060);

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null);
                    // antlr\\HiloTreeParser.g:93:22: (measure= FIELD | measure= MEASURE_FIELD )
                    var alt6=2;
                    switch ( this.input.LA(1) ) {
                    case FIELD:
                        alt6=1;
                        break;
                    case MEASURE_FIELD:
                        alt6=2;
                        break;
                    default:
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 6, 0, this.input);

                        throw nvae;
                    }

                    switch (alt6) {
                        case 1 :
                            // antlr\\HiloTreeParser.g:93:23: measure= FIELD
                            measure=this.match(this.input,FIELD,HiloTreeParser.FOLLOW_FIELD_in_cagr2065);


                            break;
                        case 2 :
                            // antlr\\HiloTreeParser.g:93:39: measure= MEASURE_FIELD
                            measure=this.match(this.input,MEASURE_FIELD,HiloTreeParser.FOLLOW_MEASURE_FIELD_in_cagr2071);


                            break;

                    }

                    // antlr\\HiloTreeParser.g:93:62: (start= STRING | start= FIELD )
                    var alt7=2;
                    switch ( this.input.LA(1) ) {
                    case STRING:
                        alt7=1;
                        break;
                    case FIELD:
                        alt7=2;
                        break;
                    default:
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 7, 0, this.input);

                        throw nvae;
                    }

                    switch (alt7) {
                        case 1 :
                            // antlr\\HiloTreeParser.g:93:63: start= STRING
                            start=this.match(this.input,STRING,HiloTreeParser.FOLLOW_STRING_in_cagr2077);


                            break;
                        case 2 :
                            // antlr\\HiloTreeParser.g:93:78: start= FIELD
                            start=this.match(this.input,FIELD,HiloTreeParser.FOLLOW_FIELD_in_cagr2083);


                            break;

                    }

                    // antlr\\HiloTreeParser.g:93:91: (end= STRING | end= FIELD )
                    var alt8=2;
                    switch ( this.input.LA(1) ) {
                    case STRING:
                        alt8=1;
                        break;
                    case FIELD:
                        alt8=2;
                        break;
                    default:
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 8, 0, this.input);

                        throw nvae;
                    }

                    switch (alt8) {
                        case 1 :
                            // antlr\\HiloTreeParser.g:93:92: end= STRING
                            end=this.match(this.input,STRING,HiloTreeParser.FOLLOW_STRING_in_cagr2089);


                            break;
                        case 2 :
                            // antlr\\HiloTreeParser.g:93:105: end= FIELD
                            end=this.match(this.input,FIELD,HiloTreeParser.FOLLOW_FIELD_in_cagr2095);


                            break;

                    }


                    this.match(this.input, org.antlr.runtime.Token.UP, null);
                     result = this._builder.makeCAGR(this._builder.makeMeasureField(measure), start, end);


                    break;
                case 2 :
                    // antlr\\HiloTreeParser.g:94:7: ^( CAGR_FORMULA_WITH_DIMENSION (measure= FIELD | measure= MEASURE_FIELD ) (start= STRING | start= FIELD ) (end= STRING | end= FIELD ) dimension= FIELD )
                    this.match(this.input,CAGR_FORMULA_WITH_DIMENSION,HiloTreeParser.FOLLOW_CAGR_FORMULA_WITH_DIMENSION_in_cagr2109);

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null);
                    // antlr\\HiloTreeParser.g:94:37: (measure= FIELD | measure= MEASURE_FIELD )
                    var alt9=2;
                    switch ( this.input.LA(1) ) {
                    case FIELD:
                        alt9=1;
                        break;
                    case MEASURE_FIELD:
                        alt9=2;
                        break;
                    default:
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 9, 0, this.input);

                        throw nvae;
                    }

                    switch (alt9) {
                        case 1 :
                            // antlr\\HiloTreeParser.g:94:38: measure= FIELD
                            measure=this.match(this.input,FIELD,HiloTreeParser.FOLLOW_FIELD_in_cagr2114);


                            break;
                        case 2 :
                            // antlr\\HiloTreeParser.g:94:54: measure= MEASURE_FIELD
                            measure=this.match(this.input,MEASURE_FIELD,HiloTreeParser.FOLLOW_MEASURE_FIELD_in_cagr2120);


                            break;

                    }

                    // antlr\\HiloTreeParser.g:94:77: (start= STRING | start= FIELD )
                    var alt10=2;
                    switch ( this.input.LA(1) ) {
                    case STRING:
                        alt10=1;
                        break;
                    case FIELD:
                        alt10=2;
                        break;
                    default:
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 10, 0, this.input);

                        throw nvae;
                    }

                    switch (alt10) {
                        case 1 :
                            // antlr\\HiloTreeParser.g:94:78: start= STRING
                            start=this.match(this.input,STRING,HiloTreeParser.FOLLOW_STRING_in_cagr2126);


                            break;
                        case 2 :
                            // antlr\\HiloTreeParser.g:94:93: start= FIELD
                            start=this.match(this.input,FIELD,HiloTreeParser.FOLLOW_FIELD_in_cagr2132);


                            break;

                    }

                    // antlr\\HiloTreeParser.g:94:106: (end= STRING | end= FIELD )
                    var alt11=2;
                    switch ( this.input.LA(1) ) {
                    case STRING:
                        alt11=1;
                        break;
                    case FIELD:
                        alt11=2;
                        break;
                    default:
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 11, 0, this.input);

                        throw nvae;
                    }

                    switch (alt11) {
                        case 1 :
                            // antlr\\HiloTreeParser.g:94:107: end= STRING
                            end=this.match(this.input,STRING,HiloTreeParser.FOLLOW_STRING_in_cagr2138);


                            break;
                        case 2 :
                            // antlr\\HiloTreeParser.g:94:120: end= FIELD
                            end=this.match(this.input,FIELD,HiloTreeParser.FOLLOW_FIELD_in_cagr2144);


                            break;

                    }

                    dimension=this.match(this.input,FIELD,HiloTreeParser.FOLLOW_FIELD_in_cagr2149);

                    this.match(this.input, org.antlr.runtime.Token.UP, null);
                     result = this._builder.makeCAGR(this._builder.makeMeasureField(measure), start, end, this._builder.makeField(dimension));


                    break;

            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return result;
    },


    // antlr\\HiloTreeParser.g:97:1: sma returns [result] : ( ^( SMA_FORMULA (measure= FIELD | measure= MEASURE_FIELD ) timeGran= STRING period= INTEGER ) | ^( SMA_FORMULA_WITH_DIMENSION (measure= FIELD | measure= MEASURE_FIELD ) timeGran= STRING period= INTEGER dimension= FIELD ) );
    // $ANTLR start "sma"
    sma: function() {
        var result = null;

        var measure = null;
        var timeGran = null;
        var period = null;
        var dimension = null;

        try {
            // antlr\\HiloTreeParser.g:98:5: ( ^( SMA_FORMULA (measure= FIELD | measure= MEASURE_FIELD ) timeGran= STRING period= INTEGER ) | ^( SMA_FORMULA_WITH_DIMENSION (measure= FIELD | measure= MEASURE_FIELD ) timeGran= STRING period= INTEGER dimension= FIELD ) )
            var alt15=2;
            switch ( this.input.LA(1) ) {
            case SMA_FORMULA:
                alt15=1;
                break;
            case SMA_FORMULA_WITH_DIMENSION:
                alt15=2;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 15, 0, this.input);

                throw nvae;
            }

            switch (alt15) {
                case 1 :
                    // antlr\\HiloTreeParser.g:98:7: ^( SMA_FORMULA (measure= FIELD | measure= MEASURE_FIELD ) timeGran= STRING period= INTEGER )
                    this.match(this.input,SMA_FORMULA,HiloTreeParser.FOLLOW_SMA_FORMULA_in_sma2176);

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null);
                    // antlr\\HiloTreeParser.g:98:21: (measure= FIELD | measure= MEASURE_FIELD )
                    var alt13=2;
                    switch ( this.input.LA(1) ) {
                    case FIELD:
                        alt13=1;
                        break;
                    case MEASURE_FIELD:
                        alt13=2;
                        break;
                    default:
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 13, 0, this.input);

                        throw nvae;
                    }

                    switch (alt13) {
                        case 1 :
                            // antlr\\HiloTreeParser.g:98:22: measure= FIELD
                            measure=this.match(this.input,FIELD,HiloTreeParser.FOLLOW_FIELD_in_sma2181);


                            break;
                        case 2 :
                            // antlr\\HiloTreeParser.g:98:38: measure= MEASURE_FIELD
                            measure=this.match(this.input,MEASURE_FIELD,HiloTreeParser.FOLLOW_MEASURE_FIELD_in_sma2187);


                            break;

                    }

                    timeGran=this.match(this.input,STRING,HiloTreeParser.FOLLOW_STRING_in_sma2192);
                    period=this.match(this.input,INTEGER,HiloTreeParser.FOLLOW_INTEGER_in_sma2196);

                    this.match(this.input, org.antlr.runtime.Token.UP, null);
                     result = this._builder.makeSMA(this._builder.makeMeasureField(measure), timeGran, period);


                    break;
                case 2 :
                    // antlr\\HiloTreeParser.g:99:7: ^( SMA_FORMULA_WITH_DIMENSION (measure= FIELD | measure= MEASURE_FIELD ) timeGran= STRING period= INTEGER dimension= FIELD )
                    this.match(this.input,SMA_FORMULA_WITH_DIMENSION,HiloTreeParser.FOLLOW_SMA_FORMULA_WITH_DIMENSION_in_sma2209);

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null);
                    // antlr\\HiloTreeParser.g:99:36: (measure= FIELD | measure= MEASURE_FIELD )
                    var alt14=2;
                    switch ( this.input.LA(1) ) {
                    case FIELD:
                        alt14=1;
                        break;
                    case MEASURE_FIELD:
                        alt14=2;
                        break;
                    default:
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 14, 0, this.input);

                        throw nvae;
                    }

                    switch (alt14) {
                        case 1 :
                            // antlr\\HiloTreeParser.g:99:37: measure= FIELD
                            measure=this.match(this.input,FIELD,HiloTreeParser.FOLLOW_FIELD_in_sma2214);


                            break;
                        case 2 :
                            // antlr\\HiloTreeParser.g:99:53: measure= MEASURE_FIELD
                            measure=this.match(this.input,MEASURE_FIELD,HiloTreeParser.FOLLOW_MEASURE_FIELD_in_sma2220);


                            break;

                    }

                    timeGran=this.match(this.input,STRING,HiloTreeParser.FOLLOW_STRING_in_sma2225);
                    period=this.match(this.input,INTEGER,HiloTreeParser.FOLLOW_INTEGER_in_sma2229);
                    dimension=this.match(this.input,FIELD,HiloTreeParser.FOLLOW_FIELD_in_sma2233);

                    this.match(this.input, org.antlr.runtime.Token.UP, null);
                     result = this._builder.makeSMA(this._builder.makeMeasureField(measure), timeGran, period, this._builder.makeField(dimension));


                    break;

            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return result;
    },


    // antlr\\HiloTreeParser.g:102:1: yoy returns [result] : ( ^( YOY_FORMULA (measure= FIELD | measure= MEASURE_FIELD ) ) | ^( YOY_FORMULA_WITH_DIMENSION (measure= FIELD | measure= MEASURE_FIELD ) dimension= FIELD ) );
    // $ANTLR start "yoy"
    yoy: function() {
        var result = null;

        var measure = null;
        var dimension = null;

        try {
            // antlr\\HiloTreeParser.g:103:5: ( ^( YOY_FORMULA (measure= FIELD | measure= MEASURE_FIELD ) ) | ^( YOY_FORMULA_WITH_DIMENSION (measure= FIELD | measure= MEASURE_FIELD ) dimension= FIELD ) )
            var alt18=2;
            switch ( this.input.LA(1) ) {
            case YOY_FORMULA:
                alt18=1;
                break;
            case YOY_FORMULA_WITH_DIMENSION:
                alt18=2;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 18, 0, this.input);

                throw nvae;
            }

            switch (alt18) {
                case 1 :
                    // antlr\\HiloTreeParser.g:103:7: ^( YOY_FORMULA (measure= FIELD | measure= MEASURE_FIELD ) )
                    this.match(this.input,YOY_FORMULA,HiloTreeParser.FOLLOW_YOY_FORMULA_in_yoy2260);

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null);
                    // antlr\\HiloTreeParser.g:103:21: (measure= FIELD | measure= MEASURE_FIELD )
                    var alt16=2;
                    switch ( this.input.LA(1) ) {
                    case FIELD:
                        alt16=1;
                        break;
                    case MEASURE_FIELD:
                        alt16=2;
                        break;
                    default:
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 16, 0, this.input);

                        throw nvae;
                    }

                    switch (alt16) {
                        case 1 :
                            // antlr\\HiloTreeParser.g:103:22: measure= FIELD
                            measure=this.match(this.input,FIELD,HiloTreeParser.FOLLOW_FIELD_in_yoy2265);


                            break;
                        case 2 :
                            // antlr\\HiloTreeParser.g:103:38: measure= MEASURE_FIELD
                            measure=this.match(this.input,MEASURE_FIELD,HiloTreeParser.FOLLOW_MEASURE_FIELD_in_yoy2271);


                            break;

                    }


                    this.match(this.input, org.antlr.runtime.Token.UP, null);
                     result = this._builder.makeYOY(this._builder.makeMeasureField(measure));


                    break;
                case 2 :
                    // antlr\\HiloTreeParser.g:104:7: ^( YOY_FORMULA_WITH_DIMENSION (measure= FIELD | measure= MEASURE_FIELD ) dimension= FIELD )
                    this.match(this.input,YOY_FORMULA_WITH_DIMENSION,HiloTreeParser.FOLLOW_YOY_FORMULA_WITH_DIMENSION_in_yoy2285);

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null);
                    // antlr\\HiloTreeParser.g:104:36: (measure= FIELD | measure= MEASURE_FIELD )
                    var alt17=2;
                    switch ( this.input.LA(1) ) {
                    case FIELD:
                        alt17=1;
                        break;
                    case MEASURE_FIELD:
                        alt17=2;
                        break;
                    default:
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 17, 0, this.input);

                        throw nvae;
                    }

                    switch (alt17) {
                        case 1 :
                            // antlr\\HiloTreeParser.g:104:37: measure= FIELD
                            measure=this.match(this.input,FIELD,HiloTreeParser.FOLLOW_FIELD_in_yoy2290);


                            break;
                        case 2 :
                            // antlr\\HiloTreeParser.g:104:53: measure= MEASURE_FIELD
                            measure=this.match(this.input,MEASURE_FIELD,HiloTreeParser.FOLLOW_MEASURE_FIELD_in_yoy2296);


                            break;

                    }

                    dimension=this.match(this.input,FIELD,HiloTreeParser.FOLLOW_FIELD_in_yoy2301);

                    this.match(this.input, org.antlr.runtime.Token.UP, null);
                     result = this._builder.makeYOY(this._builder.makeMeasureField(measure), this._builder.makeField(dimension));


                    break;

            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return result;
    },


    // antlr\\HiloTreeParser.g:107:1: link returns [result] : ^( LINK_FORMULA model= FIELD (measure= FIELD | measure= MEASURE_FIELD ) (pov= expr )? ) ;
    // $ANTLR start "link"
    link: function() {
        var result = null;

        var model = null;
        var measure = null;
         var pov = null;

        try {
            // antlr\\HiloTreeParser.g:108:5: ( ^( LINK_FORMULA model= FIELD (measure= FIELD | measure= MEASURE_FIELD ) (pov= expr )? ) )
            // antlr\\HiloTreeParser.g:108:7: ^( LINK_FORMULA model= FIELD (measure= FIELD | measure= MEASURE_FIELD ) (pov= expr )? )
            this.match(this.input,LINK_FORMULA,HiloTreeParser.FOLLOW_LINK_FORMULA_in_link2328);

            this.match(this.input, org.antlr.runtime.Token.DOWN, null);
            model=this.match(this.input,FIELD,HiloTreeParser.FOLLOW_FIELD_in_link2332);
            // antlr\\HiloTreeParser.g:108:34: (measure= FIELD | measure= MEASURE_FIELD )
            var alt19=2;
            switch ( this.input.LA(1) ) {
            case FIELD:
                alt19=1;
                break;
            case MEASURE_FIELD:
                alt19=2;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 19, 0, this.input);

                throw nvae;
            }

            switch (alt19) {
                case 1 :
                    // antlr\\HiloTreeParser.g:108:35: measure= FIELD
                    measure=this.match(this.input,FIELD,HiloTreeParser.FOLLOW_FIELD_in_link2337);


                    break;
                case 2 :
                    // antlr\\HiloTreeParser.g:108:51: measure= MEASURE_FIELD
                    measure=this.match(this.input,MEASURE_FIELD,HiloTreeParser.FOLLOW_MEASURE_FIELD_in_link2343);


                    break;

            }

            // antlr\\HiloTreeParser.g:108:77: (pov= expr )?
            var alt20=2;
            switch ( this.input.LA(1) ) {
                case PARENTH_GROUP:
                case FUNCALL:
                case VARACCESS:
                case ARRAY:
                case UNARY_MINUS:
                case ITERATE_FUNCTION:
                case EQ:
                case NEQ:
                case LT:
                case GT:
                case GTE:
                case LTE:
                case PLUS:
                case MINUS:
                case MULT:
                case DIV:
                case POW:
                case PIPE:
                case ASSIGN:
                case OR:
                case AND:
                case NOT:
                case NULL:
                case TRUE:
                case FALSE:
                case YES:
                case NO:
                case STRING:
                case FIELD:
                case MEASURE_FIELD:
                case INTEGER:
                case DOUBLE:
                case DATE_TIME:
                case DOT_SEP_STRING:
                case DQ_ALLOW_ESC_REGEX_STRING:
                case ATTRIBUTE:
                case OLD_ATTRIBUTE:
                case IN:
                case MOD:
                    alt20=1;
                    break;
            }

            switch (alt20) {
                case 1 :
                    // antlr\\HiloTreeParser.g:108:77: pov= expr
                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_link2348);
                    pov=this.expr();

                    this.state._fsp--;



                    break;

            }


            this.match(this.input, org.antlr.runtime.Token.UP, null);
             result = this._builder.makeLink(model, measure, pov);



        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return result;
    },


    // antlr\\HiloTreeParser.g:111:1: lookup returns [result] : ( ^( LOOKUP_FORMULA (measure= FIELD | measure= MEASURE_FIELD ) dummy1= COMMA dummy2= COMMA dims= expr ) | ^( LOOKUP_FORMULA (measure= FIELD | measure= MEASURE_FIELD ) pov= expr (dims= expr )? ) );
    // $ANTLR start "lookup"
    lookup: function() {
        var result = null;

        var measure = null;
        var dummy1 = null;
        var dummy2 = null;
         var dims = null;
         var pov = null;

        try {
            // antlr\\HiloTreeParser.g:112:5: ( ^( LOOKUP_FORMULA (measure= FIELD | measure= MEASURE_FIELD ) dummy1= COMMA dummy2= COMMA dims= expr ) | ^( LOOKUP_FORMULA (measure= FIELD | measure= MEASURE_FIELD ) pov= expr (dims= expr )? ) )
            var alt24=2;
            switch ( this.input.LA(1) ) {
            case LOOKUP_FORMULA:
                switch ( this.input.LA(2) ) {
                case DOWN:
                    switch ( this.input.LA(3) ) {
                    case FIELD:
                        switch ( this.input.LA(4) ) {
                        case COMMA:
                            alt24=1;
                            break;
                        case PARENTH_GROUP:
                        case FUNCALL:
                        case VARACCESS:
                        case ARRAY:
                        case UNARY_MINUS:
                        case ITERATE_FUNCTION:
                        case EQ:
                        case NEQ:
                        case LT:
                        case GT:
                        case GTE:
                        case LTE:
                        case PLUS:
                        case MINUS:
                        case MULT:
                        case DIV:
                        case POW:
                        case PIPE:
                        case ASSIGN:
                        case OR:
                        case AND:
                        case NOT:
                        case NULL:
                        case TRUE:
                        case FALSE:
                        case YES:
                        case NO:
                        case STRING:
                        case FIELD:
                        case MEASURE_FIELD:
                        case INTEGER:
                        case DOUBLE:
                        case DATE_TIME:
                        case DOT_SEP_STRING:
                        case DQ_ALLOW_ESC_REGEX_STRING:
                        case ATTRIBUTE:
                        case OLD_ATTRIBUTE:
                        case IN:
                        case MOD:
                            alt24=2;
                            break;
                        default:
                            var nvae =
                                new org.antlr.runtime.NoViableAltException("", 24, 3, this.input);

                            throw nvae;
                        }

                        break;
                    case MEASURE_FIELD:
                        switch ( this.input.LA(4) ) {
                        case COMMA:
                            alt24=1;
                            break;
                        case PARENTH_GROUP:
                        case FUNCALL:
                        case VARACCESS:
                        case ARRAY:
                        case UNARY_MINUS:
                        case ITERATE_FUNCTION:
                        case EQ:
                        case NEQ:
                        case LT:
                        case GT:
                        case GTE:
                        case LTE:
                        case PLUS:
                        case MINUS:
                        case MULT:
                        case DIV:
                        case POW:
                        case PIPE:
                        case ASSIGN:
                        case OR:
                        case AND:
                        case NOT:
                        case NULL:
                        case TRUE:
                        case FALSE:
                        case YES:
                        case NO:
                        case STRING:
                        case FIELD:
                        case MEASURE_FIELD:
                        case INTEGER:
                        case DOUBLE:
                        case DATE_TIME:
                        case DOT_SEP_STRING:
                        case DQ_ALLOW_ESC_REGEX_STRING:
                        case ATTRIBUTE:
                        case OLD_ATTRIBUTE:
                        case IN:
                        case MOD:
                            alt24=2;
                            break;
                        default:
                            var nvae =
                                new org.antlr.runtime.NoViableAltException("", 24, 4, this.input);

                            throw nvae;
                        }

                        break;
                    default:
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 24, 2, this.input);

                        throw nvae;
                    }

                    break;
                default:
                    var nvae =
                        new org.antlr.runtime.NoViableAltException("", 24, 1, this.input);

                    throw nvae;
                }

                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 24, 0, this.input);

                throw nvae;
            }

            switch (alt24) {
                case 1 :
                    // antlr\\HiloTreeParser.g:112:7: ^( LOOKUP_FORMULA (measure= FIELD | measure= MEASURE_FIELD ) dummy1= COMMA dummy2= COMMA dims= expr )
                    this.match(this.input,LOOKUP_FORMULA,HiloTreeParser.FOLLOW_LOOKUP_FORMULA_in_lookup2376);

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null);
                    // antlr\\HiloTreeParser.g:112:24: (measure= FIELD | measure= MEASURE_FIELD )
                    var alt21=2;
                    switch ( this.input.LA(1) ) {
                    case FIELD:
                        alt21=1;
                        break;
                    case MEASURE_FIELD:
                        alt21=2;
                        break;
                    default:
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 21, 0, this.input);

                        throw nvae;
                    }

                    switch (alt21) {
                        case 1 :
                            // antlr\\HiloTreeParser.g:112:25: measure= FIELD
                            measure=this.match(this.input,FIELD,HiloTreeParser.FOLLOW_FIELD_in_lookup2381);


                            break;
                        case 2 :
                            // antlr\\HiloTreeParser.g:112:41: measure= MEASURE_FIELD
                            measure=this.match(this.input,MEASURE_FIELD,HiloTreeParser.FOLLOW_MEASURE_FIELD_in_lookup2387);


                            break;

                    }

                    dummy1=this.match(this.input,COMMA,HiloTreeParser.FOLLOW_COMMA_in_lookup2392);
                    dummy2=this.match(this.input,COMMA,HiloTreeParser.FOLLOW_COMMA_in_lookup2396);
                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_lookup2400);
                    dims=this.expr();

                    this.state._fsp--;


                    this.match(this.input, org.antlr.runtime.Token.UP, null);
                     result = this._builder.makeLookup(this._builder.makeMeasureField(measure), null, dims);


                    break;
                case 2 :
                    // antlr\\HiloTreeParser.g:113:7: ^( LOOKUP_FORMULA (measure= FIELD | measure= MEASURE_FIELD ) pov= expr (dims= expr )? )
                    this.match(this.input,LOOKUP_FORMULA,HiloTreeParser.FOLLOW_LOOKUP_FORMULA_in_lookup2412);

                    this.match(this.input, org.antlr.runtime.Token.DOWN, null);
                    // antlr\\HiloTreeParser.g:113:24: (measure= FIELD | measure= MEASURE_FIELD )
                    var alt22=2;
                    switch ( this.input.LA(1) ) {
                    case FIELD:
                        alt22=1;
                        break;
                    case MEASURE_FIELD:
                        alt22=2;
                        break;
                    default:
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 22, 0, this.input);

                        throw nvae;
                    }

                    switch (alt22) {
                        case 1 :
                            // antlr\\HiloTreeParser.g:113:25: measure= FIELD
                            measure=this.match(this.input,FIELD,HiloTreeParser.FOLLOW_FIELD_in_lookup2417);


                            break;
                        case 2 :
                            // antlr\\HiloTreeParser.g:113:41: measure= MEASURE_FIELD
                            measure=this.match(this.input,MEASURE_FIELD,HiloTreeParser.FOLLOW_MEASURE_FIELD_in_lookup2423);


                            break;

                    }

                    this.pushFollow(HiloTreeParser.FOLLOW_expr_in_lookup2428);
                    pov=this.expr();

                    this.state._fsp--;

                    // antlr\\HiloTreeParser.g:113:77: (dims= expr )?
                    var alt23=2;
                    switch ( this.input.LA(1) ) {
                        case PARENTH_GROUP:
                        case FUNCALL:
                        case VARACCESS:
                        case ARRAY:
                        case UNARY_MINUS:
                        case ITERATE_FUNCTION:
                        case EQ:
                        case NEQ:
                        case LT:
                        case GT:
                        case GTE:
                        case LTE:
                        case PLUS:
                        case MINUS:
                        case MULT:
                        case DIV:
                        case POW:
                        case PIPE:
                        case ASSIGN:
                        case OR:
                        case AND:
                        case NOT:
                        case NULL:
                        case TRUE:
                        case FALSE:
                        case YES:
                        case NO:
                        case STRING:
                        case FIELD:
                        case MEASURE_FIELD:
                        case INTEGER:
                        case DOUBLE:
                        case DATE_TIME:
                        case DOT_SEP_STRING:
                        case DQ_ALLOW_ESC_REGEX_STRING:
                        case ATTRIBUTE:
                        case OLD_ATTRIBUTE:
                        case IN:
                        case MOD:
                            alt23=1;
                            break;
                    }

                    switch (alt23) {
                        case 1 :
                            // antlr\\HiloTreeParser.g:113:77: dims= expr
                            this.pushFollow(HiloTreeParser.FOLLOW_expr_in_lookup2432);
                            dims=this.expr();

                            this.state._fsp--;



                            break;

                    }


                    this.match(this.input, org.antlr.runtime.Token.UP, null);
                    result = this._builder.makeLookup(this._builder.makeMeasureField(measure), pov, dims);


                    break;

            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return result;
    }

    // Delegated rules




}, true); // important to pass true to overwrite default implementations



// public class variables
org.antlr.lang.augmentObject(HiloTreeParser, {
    tokenNames: ["<invalid>", "<EOR>", "<DOWN>", "<UP>", "PARENTH_GROUP", "FUNCALL", "VARACCESS", "ARRAY", "SUBSCRIPT", "UNARY_PLUS", "UNARY_MINUS", "RANGE_UP_TO_", "RANGE_UP_TO", "RANGE_UP_FROM_", "RANGE_UP_FROM", "CAGR_FORMULA", "CAGR_FORMULA_WITH_DIMENSION", "LOOKUP_FORMULA", "SMA_FORMULA", "SMA_FORMULA_WITH_DIMENSION", "YOY_FORMULA", "YOY_FORMULA_WITH_DIMENSION", "LINK_FORMULA", "ITERATE_FUNCTION", "EQ", "NEQ", "LT", "GT", "GTE", "LTE", "PLUS", "MINUS", "MULT", "DIV", "REM", "POW", "PIPE", "ASSIGN", "LPAR", "RPAR", "LBRA", "RBRA", "COMMA", "DOT", "SEMICOLON", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "OR", "AND", "NOT", "CAGR", "LOOKUP", "SMA", "YOY", "LINK", "ITERATE", "NULL", "TRUE", "FALSE", "YES", "NO", "STRING", "FIELD", "MEASURE_FIELD", "INTEGER", "DOUBLE", "DATE_TIME", "DOT_SEP_STRING", "DQ_ALLOW_ESC_REGEX_STRING", "ATTRIBUTE", "OLD_ATTRIBUTE", "IDENTIFIER", "WHITESPACE", "COMMENT", "DIGIT", "EXPONENT", "LETTER", "SHARP", "DQ_STRING", "SQ_STRING", "ESC_REGEX", "ESC_SEQ", "HEX_DIGIT", "VARIABLE_FIELD", "NAME_IN_QUOTE", "OLD_FIELD_STR", "DIM_MEASURE_FIELD", "CALC_FIELD", "IN", "MOD"],
    FOLLOW_expr_in_formula72: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_cagr_in_formula120: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_lookup_in_formula168: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_sma_in_formula214: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_yoy_in_formula263: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_link_in_formula312: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_PARENTH_GROUP_in_expr376: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr380: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_PIPE_in_expr416: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr424: new org.antlr.runtime.BitSet([0xFF8004F0, 0x0000003B,0x7FFF0380, 0x00030000]),
    FOLLOW_expr_in_expr428: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_OR_in_expr457: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr467: new org.antlr.runtime.BitSet([0xFF8004F0, 0x0000003B,0x7FFF0380, 0x00030000]),
    FOLLOW_expr_in_expr471: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_AND_in_expr500: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr509: new org.antlr.runtime.BitSet([0xFF8004F0, 0x0000003B,0x7FFF0380, 0x00030000]),
    FOLLOW_expr_in_expr513: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_EQ_in_expr542: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr552: new org.antlr.runtime.BitSet([0xFF8004F0, 0x0000003B,0x7FFF0380, 0x00030000]),
    FOLLOW_expr_in_expr556: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_ASSIGN_in_expr585: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr591: new org.antlr.runtime.BitSet([0xFF8004F0, 0x0000003B,0x7FFF0380, 0x00030000]),
    FOLLOW_expr_in_expr595: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_NEQ_in_expr624: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr633: new org.antlr.runtime.BitSet([0xFF8004F0, 0x0000003B,0x7FFF0380, 0x00030000]),
    FOLLOW_expr_in_expr637: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_IN_in_expr666: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr676: new org.antlr.runtime.BitSet([0xFF8004F0, 0x0000003B,0x7FFF0380, 0x00030000]),
    FOLLOW_expr_in_expr680: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_LT_in_expr709: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr719: new org.antlr.runtime.BitSet([0xFF8004F0, 0x0000003B,0x7FFF0380, 0x00030000]),
    FOLLOW_expr_in_expr723: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_GT_in_expr752: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr762: new org.antlr.runtime.BitSet([0xFF8004F0, 0x0000003B,0x7FFF0380, 0x00030000]),
    FOLLOW_expr_in_expr766: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_GTE_in_expr795: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr804: new org.antlr.runtime.BitSet([0xFF8004F0, 0x0000003B,0x7FFF0380, 0x00030000]),
    FOLLOW_expr_in_expr808: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_LTE_in_expr837: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr846: new org.antlr.runtime.BitSet([0xFF8004F0, 0x0000003B,0x7FFF0380, 0x00030000]),
    FOLLOW_expr_in_expr850: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_PLUS_in_expr879: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr887: new org.antlr.runtime.BitSet([0xFF8004F0, 0x0000003B,0x7FFF0380, 0x00030000]),
    FOLLOW_expr_in_expr891: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_MINUS_in_expr920: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr927: new org.antlr.runtime.BitSet([0xFF8004F0, 0x0000003B,0x7FFF0380, 0x00030000]),
    FOLLOW_expr_in_expr931: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_MOD_in_expr960: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr969: new org.antlr.runtime.BitSet([0xFF8004F0, 0x0000003B,0x7FFF0380, 0x00030000]),
    FOLLOW_expr_in_expr973: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_MULT_in_expr1002: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr1010: new org.antlr.runtime.BitSet([0xFF8004F0, 0x0000003B,0x7FFF0380, 0x00030000]),
    FOLLOW_expr_in_expr1014: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_DIV_in_expr1043: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr1052: new org.antlr.runtime.BitSet([0xFF8004F0, 0x0000003B,0x7FFF0380, 0x00030000]),
    FOLLOW_expr_in_expr1056: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_POW_in_expr1085: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr1094: new org.antlr.runtime.BitSet([0xFF8004F0, 0x0000003B,0x7FFF0380, 0x00030000]),
    FOLLOW_expr_in_expr1098: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_UNARY_MINUS_in_expr1127: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_exprList_in_expr1131: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_NOT_in_expr1160: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_exprList_in_expr1164: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_ARRAY_in_expr1201: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_exprList_in_expr1205: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_VARACCESS_in_expr1238: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_IDENTIFIER_in_expr1240: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_FUNCALL_in_expr1274: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_IDENTIFIER_in_expr1276: new org.antlr.runtime.BitSet([0xFF8004F8, 0x0000003B,0x7FFF0380, 0x00030000]),
    FOLLOW_exprList_in_expr1280: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_ITERATE_FUNCTION_in_expr1303: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_expr_in_expr1307: new org.antlr.runtime.BitSet([0xFF8004F0, 0x0000003B,0x7FFF0380, 0x00030000]),
    FOLLOW_FIELD_in_expr1312: new org.antlr.runtime.BitSet([0xFF8004F0, 0x0000003B,0x7FFF0380, 0x00030000]),
    FOLLOW_MEASURE_FIELD_in_expr1318: new org.antlr.runtime.BitSet([0xFF8004F0, 0x0000003B,0x7FFF0380, 0x00030000]),
    FOLLOW_expr_in_expr1324: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_INTEGER_in_expr1335: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_DOUBLE_in_expr1383: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_set_in_expr1432: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_set_in_expr1481: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_DATE_TIME_in_expr1530: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_STRING_in_expr1576: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_DOT_SEP_STRING_in_expr1625: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_DQ_ALLOW_ESC_REGEX_STRING_in_expr1666: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_FIELD_in_expr1696: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_ATTRIBUTE_in_expr1746: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_MEASURE_FIELD_in_expr1792: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_OLD_ATTRIBUTE_in_expr1834: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_NULL_in_expr1876: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_expr_in_exprList1996: new org.antlr.runtime.BitSet([0xFF8004F2, 0x0000003B,0x7FFF0380, 0x00030000]),
    FOLLOW_CAGR_FORMULA_in_cagr2060: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_FIELD_in_cagr2065: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00600000, 0x00000000]),
    FOLLOW_MEASURE_FIELD_in_cagr2071: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00600000, 0x00000000]),
    FOLLOW_STRING_in_cagr2077: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00600000, 0x00000000]),
    FOLLOW_FIELD_in_cagr2083: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00600000, 0x00000000]),
    FOLLOW_STRING_in_cagr2089: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_FIELD_in_cagr2095: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_CAGR_FORMULA_WITH_DIMENSION_in_cagr2109: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_FIELD_in_cagr2114: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00600000, 0x00000000]),
    FOLLOW_MEASURE_FIELD_in_cagr2120: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00600000, 0x00000000]),
    FOLLOW_STRING_in_cagr2126: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00600000, 0x00000000]),
    FOLLOW_FIELD_in_cagr2132: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00600000, 0x00000000]),
    FOLLOW_STRING_in_cagr2138: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00400000, 0x00000000]),
    FOLLOW_FIELD_in_cagr2144: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00400000, 0x00000000]),
    FOLLOW_FIELD_in_cagr2149: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_SMA_FORMULA_in_sma2176: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_FIELD_in_sma2181: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00200000, 0x00000000]),
    FOLLOW_MEASURE_FIELD_in_sma2187: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00200000, 0x00000000]),
    FOLLOW_STRING_in_sma2192: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x01000000, 0x00000000]),
    FOLLOW_INTEGER_in_sma2196: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_SMA_FORMULA_WITH_DIMENSION_in_sma2209: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_FIELD_in_sma2214: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00200000, 0x00000000]),
    FOLLOW_MEASURE_FIELD_in_sma2220: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00200000, 0x00000000]),
    FOLLOW_STRING_in_sma2225: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x01000000, 0x00000000]),
    FOLLOW_INTEGER_in_sma2229: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00400000, 0x00000000]),
    FOLLOW_FIELD_in_sma2233: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_YOY_FORMULA_in_yoy2260: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_FIELD_in_yoy2265: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_MEASURE_FIELD_in_yoy2271: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_YOY_FORMULA_WITH_DIMENSION_in_yoy2285: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_FIELD_in_yoy2290: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00400000, 0x00000000]),
    FOLLOW_MEASURE_FIELD_in_yoy2296: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00400000, 0x00000000]),
    FOLLOW_FIELD_in_yoy2301: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_LINK_FORMULA_in_link2328: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_FIELD_in_link2332: new org.antlr.runtime.BitSet([0x00000000, 0x00000000,0x00C00000, 0x00000000]),
    FOLLOW_FIELD_in_link2337: new org.antlr.runtime.BitSet([0xFF8004F8, 0x0000003B,0x7FFF0380, 0x00030000]),
    FOLLOW_MEASURE_FIELD_in_link2343: new org.antlr.runtime.BitSet([0xFF8004F8, 0x0000003B,0x7FFF0380, 0x00030000]),
    FOLLOW_expr_in_link2348: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_LOOKUP_FORMULA_in_lookup2376: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_FIELD_in_lookup2381: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_MEASURE_FIELD_in_lookup2387: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_COMMA_in_lookup2392: new org.antlr.runtime.BitSet([0x00000000, 0x00000400]),
    FOLLOW_COMMA_in_lookup2396: new org.antlr.runtime.BitSet([0xFF8004F0, 0x0000003B,0x7FFF0380, 0x00030000]),
    FOLLOW_expr_in_lookup2400: new org.antlr.runtime.BitSet([0x00000008, 0x00000000]),
    FOLLOW_LOOKUP_FORMULA_in_lookup2412: new org.antlr.runtime.BitSet([0x00000004, 0x00000000]),
    FOLLOW_FIELD_in_lookup2417: new org.antlr.runtime.BitSet([0xFF8004F0, 0x0000003B,0x7FFF0380, 0x00030000]),
    FOLLOW_MEASURE_FIELD_in_lookup2423: new org.antlr.runtime.BitSet([0xFF8004F0, 0x0000003B,0x7FFF0380, 0x00030000]),
    FOLLOW_expr_in_lookup2428: new org.antlr.runtime.BitSet([0xFF8004F8, 0x0000003B,0x7FFF0380, 0x00030000]),
    FOLLOW_expr_in_lookup2432: new org.antlr.runtime.BitSet([0x00000008, 0x00000000])
});

})();

oFF.HiloTreeParser = HiloTreeParser;
}

oFF.loadAntlr3Internal = function (extlibsPath) {
    if (typeof org === 'undefined' || !org.antlr) {
        org = require(extlibsPath + "/js/antlr3/antlr3-all-min-node.js");
    }
}

oFF.loadAntlrGen = function () {
    if (!oFF.HiloLexer || !oFF.HiloParser || !oFF.HiloTreeParser) {

        // When run in browser need to get antlr from window here
        // as antlr is loaded async and not available when creating
        // the org file at the top of this file
        if ((typeof org === 'undefined' || !org.antlr) && !!window && !!window.org) {
            org = window.org;
        }

        oFF.loadHiloLexer();
        oFF.loadHiloParser();
        oFF.loadHiloTreeParser();
    }
}

var NativeFeTreeBuilder = function (treeBuilder) {
    this._treeBuilder = treeBuilder;
};

NativeFeTreeBuilder.prototype.makeRootFormula = function (root) {
    return this._treeBuilder.makeRootFormula(root);
};

NativeFeTreeBuilder.prototype.makeString = function (txt) {
    return this._treeBuilder.makeString(txt);
};

NativeFeTreeBuilder.prototype.makeNull = function () {
    return this._treeBuilder.makeNull();
};

NativeFeTreeBuilder.prototype.makeInteger = function (node) {
    return this._treeBuilder.makeInteger(node.getText());
};

NativeFeTreeBuilder.prototype.makeDouble = function (node) {
    return this._treeBuilder.makeDouble(node.getText());
};

NativeFeTreeBuilder.prototype.makeBoolean = function (isTrue) {
    return this._treeBuilder.makeBoolean(isTrue);
};

NativeFeTreeBuilder.prototype.makeDateTime = function (node) {
};

NativeFeTreeBuilder.prototype.makeField = function (node) {
    return this._treeBuilder.makeField(node.getText());
};

NativeFeTreeBuilder.prototype.makeMeasureField = function (node) {
    return this._treeBuilder.makeField(node.getText());
};

NativeFeTreeBuilder.prototype.makeOptionalMeasureField = function (node) {
};

NativeFeTreeBuilder.prototype.makeDotSeparatedString = function (node) {
};

NativeFeTreeBuilder.prototype.makeAllowEscapeRegexString = function (node) {
};

NativeFeTreeBuilder.prototype.makeAttribute = function (node) {
    return this._treeBuilder.makeField(node.getText());
};

NativeFeTreeBuilder.prototype.makeArray = function (node, expressions) {
    return this._treeBuilder.makeArray(expressions);
};

NativeFeTreeBuilder.prototype.makeVariableAccess = function (node) {
};

NativeFeTreeBuilder.prototype.makeFunctionCall = function (node, arg1, arg2) {
    var args = oFF.XList.create();
    args.add(arg1);
    args.add(arg2);

    return this._treeBuilder.makeFunctionCall(node.getText(), args);
};

NativeFeTreeBuilder.prototype.makeFunctionCall2 = function (node, args) {
    return this._treeBuilder.makeFunctionCall(node.getText(), args);
};

NativeFeTreeBuilder.prototype.makeParenthesizedGroup = function (item) {
    var args = oFF.XList.create();
    args.add( item );
    return this._treeBuilder.makeFunctionCall( oFF.FeParenthesis.NAME, args );
};

NativeFeTreeBuilder.prototype.makeCAGR = function (measure, start, end, dimension) {
};


NativeFeTreeBuilder.prototype.makeSMA = function (measure, timeGran, period, dimension) {
};

NativeFeTreeBuilder.prototype.makeYOY = function (measure, dimension) {
};


NativeFeTreeBuilder.prototype.makeLink = function(model, measure, pov) {
};

NativeFeTreeBuilder.prototype.makeLookup = function (measure, pov, dims) {
};

NativeFeTreeBuilder.prototype.makeIterate = function (func, expr, dims) {
};

oFF.NativeFeTreeBuilder = NativeFeTreeBuilder;
oFF.NativeFeParser = function () {
       oFF.FeParser.call(this);
    this._ff_c = "NativeFeParser";
}

oFF.NativeFeParser.staticSetup = function () {
       oFF.FeParser.setInstance(new oFF.NativeFeParser())
}

oFF.NativeFeParser.prototype = new oFF.FeParser();
oFF.NativeFeParser.prototype._tokenStream = null;
oFF.NativeFeParser.prototype._treeBuilder = null;
oFF.NativeFeParser.prototype._antlrTree = null;

//================================================
// Interface methods
//================================================

oFF.NativeFeParser.prototype.parseNative = function (text) {
    try {
        oFF.loadAntlrGen();
        this._parseStringToTree(text);
        return this._parseTreeToFormula();
    } catch (e) {
        throw e;
    }
};

oFF.NativeFeParser.prototype.setTreeBuilder = function (treeBuilder) {
    this._treeBuilder = treeBuilder;
}

//================================================
// Private methods
//================================================

oFF.NativeFeParser.prototype._reset = function () {
    this._tokenStream = null;
};

oFF.NativeFeParser.prototype._parseStringToTree = function (input) {
    this._reset();

    var stream = new org.antlr.runtime.ANTLRStringStream(input);
    this._parseStream(stream);
    // Throw exception if the tree is not constructed properly
    if (this._antlrTree.getTree() instanceof org.antlr.runtime.tree.CommonErrorNode) {
        throw new Error("HDB_00358_PARSE_TO_TREE_FAIL: " + this._antlrTree.getTree().toString());
    }
};

oFF.NativeFeParser.prototype._parseStream = function (stream) {
    var lexer = new oFF.HiloLexer(stream);
    this._tokenStream = new org.antlr.runtime.CommonTokenStream(lexer);

    var parser = new oFF.HiloParser(this._tokenStream);
    this._antlrTree = parser.formula();
};

oFF.NativeFeParser.prototype._parseTreeToFormula = function () {
    var tree = this._antlrTree.getTree();

    var nodeStream = new org.antlr.runtime.tree.CommonTreeNodeStream(tree);
    nodeStream.setTokenStream(this._tokenStream);

    var walker = new oFF.HiloTreeParser(nodeStream);
    walker.setBuilder(new oFF.NativeFeTreeBuilder(this._treeBuilder));

    return walker.formula();
};

oFF.NativeFeCustomHighlighter = function () {
       oFF.FeCustomHighlighter.call(this);
    this._ff_c = "NativeFeCustomHighlighter";
}

oFF.NativeFeCustomHighlighter.staticSetup = function () {
       oFF.FeCustomHighlighter.setInstance(new oFF.NativeFeCustomHighlighter())
}

oFF.NativeFeCustomHighlighter.prototype = new oFF.FeCustomHighlighter();

//================================================
// Interface methods
//================================================
// We need to make sure that rules and mode are unique for a system type. Reinitialising the mode with new set of rules
// but with the same name will not cause the mode override as ace will already have the mode and rules with the same name.
// If we switch between systems and want different set of rules we need to make the mode and rule names unique. This
// code handles such cases. However, if a consumer of the calculation editor wants to support different set of rules
// for same system types is not handled here. To support such case we need to pass in some consumer identifier and add
// it to the rules and mode names.
oFF.NativeFeCustomHighlighter.prototype.registerCustomHighlighterNative = function (modeName, rules) {
    try {
        const ruleName = 'ace/mode/fe_custom_highlight_rules_'+modeName;
        // Define custom text highlight rules
        this._registerCustomHighlightRules(rules, ruleName);
        // Register the custom mode that will use the custom text highlight rules.
        this._registerCustomMode(modeName, ruleName);
    } catch (e) {
        throw e;
    }
}

//================================================
// Private methods
//================================================

// Register the custom highlight rules with ACE
oFF.NativeFeCustomHighlighter.prototype._registerCustomHighlightRules = function (rules, ruleName) {
    window.ace?.define?.(ruleName, function (require, exports, module) {
        var oop = require("ace/lib/oop");
        let nativeModeRulesJson = rules?.convertToNative?.();
        // Get ace editor text highlighting rules
        var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;
        var customRules = function () {
            this.$rules = nativeModeRulesJson;
            this.normalizeRules()
        };
        // Inherit from the base TextHighlightRules.
        oop.inherits(customRules, TextHighlightRules);
        // Export the rules so that it can be accessed from the custom mode.
        exports.customRules = customRules;
    });
}

// Register custom mode.
oFF.NativeFeCustomHighlighter.prototype._registerCustomMode = function (modeName, ruleName) {
    const fullModeName = 'ace/mode/'+modeName;
    window.ace?.define?.(fullModeName, function (require, exports, module) {
        // This is the way ace uses inheritance
        var oop = require("ace/lib/oop");
        // We will extend text mode.
        var TextMode = require("ace/mode/text").Mode;
        // Get the new highlight rules derived from the config.
        var feCustomHighlightRules = require(ruleName).customRules;
        // create a new mode.
        var mode = function () {
            // Set Ace highlight rules
            this.HighlightRules = feCustomHighlightRules;
        };
        // The new mode will inherit text mode
        oop.inherits(mode, TextMode);
        // Register the mode with ACE.
        (function () {
        }).call(mode.prototype);
        exports.Mode = mode;
    });
}





oFF.NativeFeCustomAceOverrides = function () {
       oFF.FeCustomAceOverrides.call(this);
    this._ff_c = "NativeFeCustomAceOverrides";
    this.FilteredList = null;
    this._originalSetFilter = null;
}

oFF.NativeFeCustomAceOverrides.staticSetup = function () {
       oFF.FeCustomAceOverrides.setInstance(new oFF.NativeFeCustomAceOverrides())
}

oFF.NativeFeCustomAceOverrides.prototype = new oFF.FeCustomAceOverrides();

//================================================
// Interface methods
//================================================
oFF.NativeFeCustomAceOverrides.prototype.overrideFilteredListSetFilter = function () {
    this.FilteredList = window.ace?.require("ace/autocomplete")?.FilteredList;

    if (this.FilteredList) {
        this._originalSetFilter = this.FilteredList.prototype.setFilter;
        const filterCompletions = function (items, needle, ignoreCaption) {
            const results = [];
            const lower = needle.toLowerCase();
            for (var i = 0, item; item = items[i]; i++) {
                var caption = (!ignoreCaption && item.caption) || item.value || item.snippet;
                if (!caption) {
                    continue;
                }
                const captionLower = caption.toLowerCase();
                if (captionLower.indexOf(lower) === -1) {
                    continue;
                }
                if (lower === captionLower) {
                    item.exactMatch = 1;
                } else if (captionLower.indexOf(lower) > -1) {
                    item.exactMatch = 0;
                }
                item.$score = (item.score || 0);
                results.push(item);
            }
            return results;
        }
        this.FilteredList.prototype.setFilter = function(str) {
          let matches = str.length > this.filterText && str.lastIndexOf(this.filterText, 0) === 0 ? this.filtered : this.all;
          this.filterText = str;
          matches = filterCompletions(matches, this.filterText, this.ignoreCaption);
          this.filtered = matches;
        };
    }
}


oFF.NativeFeCustomAceOverrides.prototype.resetFilteredListSetFilter = function () {
    if (this._originalSetFilter) {
        this.FilteredList.prototype.setFilter = this._originalSetFilter;
    }
}

oFF.NativeFeKeyboardHandler = function () {
       oFF.FeKeyboardHandler.call(this);
    this._ff_c = "NativeFeKeyboardHandler";
}

oFF.NativeFeKeyboardHandler.staticSetup = function () {
       oFF.FeKeyboardHandler.setInstance(new oFF.NativeFeKeyboardHandler())
}

oFF.NativeFeKeyboardHandler.prototype = new oFF.FeKeyboardHandler();

//================================================
// Interface methods
//================================================

oFF.NativeFeKeyboardHandler.prototype.registerKeyboardHandlerNative = function () {
    try {
        this._registerKeyboardHandler();
    } catch (e) {
        throw e;
    }
}

//================================================
// Private methods
//================================================

oFF.NativeFeKeyboardHandler.prototype._registerKeyboardHandler = function () {
    const moduleFunction = function (require, exports, module) {
        const _isTokenInPosition = (keyString, cursorXYPosition, tokenStartPosition, tokenEndPosition) => {
            const isBackspaceAtTokenEnd = keyString === "backspace" && //
                cursorXYPosition.row === tokenEndPosition.getRow() && //
                cursorXYPosition.column === tokenEndPosition.getColumn();
            const isDeleteAtTokenStart = keyString === "delete" && //
                cursorXYPosition.row === tokenStartPosition.getRow() && //
                cursorXYPosition.column === tokenStartPosition.getColumn();
            return isBackspaceAtTokenEnd || isDeleteAtTokenStart;
        };

        const _deleteToken = (editor, start, end) => {
            editor.selection?.setSelectionRange({
                start: {row: start.getRow(), column: start.getColumn()},
                end: {row: end.getRow(), column: end.getColumn()}
            });
            editor.remove();
        };

        const handleKeyboardFunction = function (data, hash, keyString, keyCode, event) {
            // data.editor is the native editor
            // hash - if a modifier (ctrl/alt/shift/meta) this is a number > 0, otherwise 0. Part of key normalisation process
            // keyString checked against passed
            // keyCode not needed as keyString used
            // event is browser keydown event, again not used

            // Check supported keys for handler and direction of delete
            let directionIsForward = null;
            if (keyString === "backspace") {
                directionIsForward = false; // Backspace deletes from right to left
            } else if (keyString === "delete") {
                directionIsForward = true; // Delete deletes from left to right
            } else {
                return false; // Unsupported key
            }

            // Check editor objects exist
            const editor = data?.editor;
            const codeEditorValue = editor?.getValue();
            const cursorXYPosition = editor?.getCursorPosition();
            if (!codeEditorValue || !cursorXYPosition) {
                return false;
            }

            // Check external apis exist
            if (!this.getContext?.() || !oFF.FeCursorHelper) {
                return false;
            }

            // If any text is selected, use the default deletion behaviour
            if (editor.getSelectedText()?.length > 0) {
                return false;
            }

            const cursorPosition = oFF.FeCursorHelper.getCursorIndex(codeEditorValue, cursorXYPosition.row, cursorXYPosition.column);
            const currentTokenOptional = this.getContext().getEntityTokenAtPosition(cursorPosition, directionIsForward);
            if (currentTokenOptional && currentTokenOptional.isPresent()) {
                const currentToken = currentTokenOptional.get();
                const tokenStartPosition = oFF.FeCursorHelper.getCursorPosition(codeEditorValue, currentToken.getStart());
                const tokenEndPosition = oFF.FeCursorHelper.getCursorPosition(codeEditorValue, currentToken.getEnd());

                if (_isTokenInPosition(keyString, cursorXYPosition, tokenStartPosition, tokenEndPosition)) {
                    _deleteToken(editor, tokenStartPosition, tokenEndPosition);
                    return {
                        passEvent: false,
                        command: "null"
                    };
                }
            }

            return false; // Event passed to default implementation
        };

        const boundKeyboardFunction = handleKeyboardFunction.bind(this);

        exports.runModule = editor => {
            editor?.getNativeControl()?._oEditor?.keyBinding?.addKeyboardHandler?.({
                handleKeyboard: boundKeyboardFunction
            });
        };
    };

    // Register module with Ace
    if (!!window.ace?.define && !!oFF.FeKeyboardHandler) {
        window.ace.define(oFF.FeKeyboardHandler.getModuleName(), moduleFunction.bind(this));
    }
};

/// <summary>Initializer for static constants.</summary>
oFF.FormulaEditorNativeModule = function () {
       oFF.DfModule.call(this);
    this._ff_c = "FormulaEditorNativeModule";
};

oFF.FormulaEditorNativeModule.prototype = new oFF.DfModule();
oFF.FormulaEditorNativeModule.s_module = null;

oFF.FormulaEditorNativeModule.getInstance = function () {
       var oNativeModule = oFF.FormulaEditorNativeModule;

    if (oNativeModule.s_module === null) {
        if (oFF.FormulaEditorModule.getInstance() === null) {
            throw new Error("Initialization Exception");
        }

        oNativeModule.s_module = oFF.DfModule.startExt(new oFF.FormulaEditorNativeModule());

        oFF.NativeFeParser.staticSetup();
        oFF.NativeFeCustomHighlighter.staticSetup();
        oFF.NativeFeCustomAceOverrides.staticSetup();
        oFF.NativeFeKeyboardHandler.staticSetup();

        oFF.DfModule.stopExt(oNativeModule.s_module);
    }

    return oNativeModule.s_module;
};

oFF.FormulaEditorNativeModule.prototype.getName = function () {
       return "ff5410.formula.editor.native";
};

oFF.FormulaEditorNativeModule.getInstance();


return oFF;
} );