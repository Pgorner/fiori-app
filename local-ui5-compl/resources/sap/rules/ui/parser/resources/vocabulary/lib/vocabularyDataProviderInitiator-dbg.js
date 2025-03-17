sap.ui.define([
	"sap/rules/ui/parser/resources/vocabulary/lib/vocabularyDataProviderContextFactory",
	"sap/rules/ui/parser/resources/vocabulary/lib/vocabularyDataProviderFactory"
], function(rtsContextFactory, vocaRuntimeServicesFactory) {
    "use strict";
    
    var vocaDataProviderContextFactoryLib = new  rtsContextFactory.vocaDataProviderContextFactoryLib();
    var runtimeServicesLib = new vocaRuntimeServicesFactory.vocaDataProviderFactoryLib();
    function vocaDataProviderInitiatorLib() {
		//Constructor to enable usage of public method on the client side.
		//This mechanism was used in HRF to enable association to corresponding namespace in the client side.
	}

	
	
	/*
	 * This method will create and init an instance of Vocabulary Runtime Services object and return it to the caller.
	 * input params: 
	 * 		inputParamObj - object like: 
	 *          { “connection” : “<optional>”, “resourceID” : “<optional>”, “vocaLoadingType” : “<str=hana/hybrid/json>”, “resourceContent” : “<JsonObject>”}.
	 * returns: instance of Vocabulary Runtime Services object.
	 */
	vocaDataProviderInitiatorLib.prototype.init = function(inputParamObj){
		
		var context;
		//Init corresponding context Object
		context = vocaDataProviderContextFactoryLib.getRTSContext(inputParamObj);
		//Init core object
		return runtimeServicesLib.getVocabularyDataProvider(context);
		
	};
	
	return {
		vocaDataProviderInitiatorLib: vocaDataProviderInitiatorLib
	};
}, true);