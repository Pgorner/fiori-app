sap.ui.define([
	"sap/rules/ui/parser/businessLanguage/lib/constants",
	"sap/rules/ui/parser/businessLanguage/lib/parseUtils",
	"sap/rules/ui/parser/businessLanguage/lib/parseModel",
	"sap/rules/ui/parser/businessLanguage/lib/utils",
	"sap/rules/ui/parser/businessLanguage/lib/parserTokens",
	"sap/rules/ui/parser/businessLanguage/lib/vocabularyUtils",
	"sap/base/Log"
], function(constantsLib, parseUtils, parseModel, utils, parserTokens, vocabularyUtil, Logger) {
    "use strict";
    
    var parseUtilsLib = new parseUtils.parseUtilsLib();
    var parseModelLib = new parseModel.parseModelLib();
    var vocabularyUtilLib = new vocabularyUtil.vocabularyUtilsLib();
    var utilsLib = new utils;
function termsUtils() {
    	
    }
    /**********************************************************************
     * TermInfo Class
     *********************************************************************/

    termsUtils.prototype.TermInfo = function() {
        try {

            this.init = function() {
                this.start = null; // start index 0
                this.end = null; // end index 15
                this.type = parserTokens.NAVIGATION; // number - 11
                this.key = null; // 'age    of player'
                this.term = null; // 'age of player'
                this.expression = null; // 'player.age'
                this.isCalculatedType = false;
                this.isSet = function() {
                    return this.isCalculatedType;
                };

            };


            this.init();

            this.setKey = function() {
                var modelManager = parseModelLib.getModelManger();
                this.key = modelManager.expression.substring(this.start, this.end);
//                this.key = utilsLib.removeInvertedCommas(this.key);
            };

            this.calculateTermType = function() {
                var modelManager = parseModelLib.getModelManger();
                if (!modelManager.vocaRTServ) { //For isReservedWord
                    return;
                }
                
//                this.term = utilsLib.removeInvertedCommas(this.term);
                this.isCalculatedType = true;
                this.setKey();
                //this.setExpression();
                
                var returneNavdObj = modelManager.getCurrentNavigationObject(this.key);
                if (returneNavdObj === null) {
                     returneNavdObj = parseUtilsLib.getNavigationObjectFromPath(this.term, this.key, modelManager);    
                }
                var type = parseUtilsLib.getNavigationObjectType(returneNavdObj);
                if (type !== null) {
                     this.type = type;
                } else {
                    if (modelManager[constantsLib.propertiesEnum.unknownTokens].hasOwnProperty(this.key)) {
                            modelManager[constantsLib.propertiesEnum.unknownTokens][this.key] ++;
                    } else {
                        modelManager[constantsLib.propertiesEnum.unknownTokens][this.key] = 1;
                    }
                }   
            };
            
        } catch (error) {
            Logger.error("TermnInfo failure - \n" + error);
        }
    };



    /****************************************************************
     * Set term
     ****************************************************************/
    termsUtils.prototype.setTerm = function() {
        var modelManager = parseModelLib.getModelManger();
        var terms = modelManager.terms;
        terms[terms.length - 1].calculateTermType();
        modelManager.clearCurrentTerm();
    };

    /****************************************************************
     * Create term
     ****************************************************************/
    termsUtils.prototype.createTerm = function(start, end, term) {
    	this.getTermMode();
    	var modelManager = parseModelLib.getModelManger();
        modelManager.setCurrentTerm(term);

        var termInfo = new this.TermInfo();
        termInfo.start = start;
        termInfo.end = end;
        termInfo.term = term;

        modelManager.terms.push(termInfo);
    };

    /****************************************************************
     * Update term
     ****************************************************************/
    termsUtils.prototype.updateTerm = function(end, term) {
       var modelManager = parseModelLib.getModelManger();
        modelManager.setCurrentTerm(term);
        var terms = modelManager.terms;
        terms[terms.length - 1].term = term;
        terms[terms.length - 1].end = end;
    };


    /****************************************************************
     * Get navigation object
     ****************************************************************/
    termsUtils.prototype.updateTermsTokenType = function(tokens) {

        var modelManager = parseModelLib.getModelManger();
        var terms = modelManager.terms;

        if (utilsLib.isEmptyArray(terms)) {
            return;
        }

        if (!terms[terms.length - 1].isSet()) {
            this.setTerm();
            parseUtilsLib.updateTokenType(terms[terms.length-1], modelManager);
        }

    var i,j = 0;
    for (i = 0; i < tokens.length && j < terms.length; i++) {
        if (tokens[i].start === terms[j].start) {
            tokens[i].type = terms[j].type;
            tokens[i].setText(terms[j].key);
            j++;
        }
    }


        modelManager.clearTermsArray();

    };
    
    
    /**
     * Calculate the term mode and hang it on the Parser Model Manager singleton
     */
    termsUtils.prototype.getTermMode = function(){
    	
    	var givenFlagTermMode = null;
    	var modelManager = parseModelLib.getModelManger();
    	var vocaRTSTermModesArr = null;
    	
    	if(!modelManager[constantsLib.propertiesEnum.termMode] && modelManager.vocaRTServ){
        	vocaRTSTermModesArr = modelManager.vocaRTServ.getTermModes();
	        if(modelManager.hasOwnProperty(constantsLib.propertiesEnum.flags) &&
	        		modelManager[constantsLib.propertiesEnum.flags].hasOwnProperty(constantsLib.propertiesEnum.termMode)){
	        	if( modelManager[constantsLib.propertiesEnum.flags][constantsLib.propertiesEnum.termMode].hasOwnProperty(constantsLib.propertiesEnum.convert) &&
	        			modelManager[constantsLib.propertiesEnum.flags][constantsLib.propertiesEnum.termMode][constantsLib.propertiesEnum.convert].hasOwnProperty(constantsLib.propertiesEnum.source)){
	        		givenFlagTermMode = modelManager[constantsLib.propertiesEnum.flags][constantsLib.propertiesEnum.termMode][constantsLib.propertiesEnum.convert];
	        	}
	        }
	        //If the termMode.convert exists in the given flags ==> the mode is equal to flags.termMode.convert.source
			if(givenFlagTermMode){
				modelManager[constantsLib.propertiesEnum.termMode] = givenFlagTermMode[constantsLib.propertiesEnum.source];
			}
			//Else modelManager.termMode equals to DISPLAY_TEXT if the voca holds terms byDescription:
			else if(vocaRTSTermModesArr.indexOf("byDescription") > -1){
				modelManager[constantsLib.propertiesEnum.termMode] = constantsLib.DISPLAY_TEXT;
			}
			//Else modelManager.termMode equals to CODE_TEXT
			else{
				modelManager[constantsLib.propertiesEnum.termMode] = constantsLib.CODE_TEXT;
			}
        }
    	if(modelManager[constantsLib.propertiesEnum.termMode]){
    		return modelManager[constantsLib.propertiesEnum.termMode];
    	}
    	
    	return null;
    };
   
    
    /****************************************************************
     * Update term
     ****************************************************************/
    termsUtils.prototype.isTermPrefix = function(term) {
        var modelManager = parseModelLib.getModelManger();
        return vocabularyUtilLib.isTermPrefix(term, modelManager.vocaRTServ, modelManager.vocabulary, this.getTermMode());
    };
    return {termsUtilsLib:termsUtils};
}, true);