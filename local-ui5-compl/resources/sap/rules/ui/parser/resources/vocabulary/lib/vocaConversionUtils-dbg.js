sap.ui.define([
], function() {
    "use strict";
    
    var vocaConversionUtils = {
    		getVocaConversionUtils : function() {
    		        return { convertOutput : function(a,b,output,d){
    		            return output;}
    		        };
    		}
    }
    return vocaConversionUtils;
}, true);
// DUMMY FILE - SHOULD NOT CONTAIN CONTENT
// CLIENT DON'T NEED IT
// USED FOR COMPATABILITY WITH BACKEND CODE
/*
sap.hrf.ui.uilib.js.parser.resources.vocabulary.lib.vocaConversionUtils.convertOutput =

    function(a,b,output,d){return output;};
sap.hrf.ui.uilib.js.parser.resources.vocabulary.lib.vocaConversionUtils.lib
    = sap.hrf.ui.uilib.js.parser.resources.vocabulary.lib.vocaConversionUtils.lib  ||{};*/
