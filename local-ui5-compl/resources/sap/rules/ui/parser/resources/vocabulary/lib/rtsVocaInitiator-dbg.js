sap.ui.define([
	"sap/rules/ui/parser/resources/vocabulary/lib/rtsVocaContextFactory",
	"sap/rules/ui/parser/resources/vocabulary/lib/rtsVocaCoreFactory"
], function(rtsContextFactory, vocaRuntimeServicesFactory) {
    "use strict";
    
    var rtsContextFactoryLib = new  rtsContextFactory.rtsContextFactoryLib();
    var runtimeServicesLib = new vocaRuntimeServicesFactory.rtsVocaCoreFactoryLib();
    function rtsVocaInitiatorLib() {
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
	rtsVocaInitiatorLib.prototype.init = function(inputParamObj){
		
		var context;
		//Init corresponding context Object
		context = rtsContextFactoryLib.getRTSContext(inputParamObj);
		//Init core object
		return runtimeServicesLib.getVocabularyRuntimeServices(context);
		
	};
	
	return {
		rtsVocaInitiatorLib: rtsVocaInitiatorLib
	}; 
}, true);