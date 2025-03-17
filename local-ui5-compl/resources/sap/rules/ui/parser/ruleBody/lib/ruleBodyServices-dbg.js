sap.ui.define([
	"sap/rules/ui/parser/ruleBody/lib/ruleBodyValidator",
	"sap/rules/ui/parser/ruleBody/lib/ruleBodyConvertor",
	"sap/rules/ui/parser/ruleBody/lib/constants"
], function(ruleBodyValidatorLib, ruleBodyConvertorLib, ruleBodyConstants) {
    "use strict";
    
function RuleBodyServicesLib() {}
	
	/**
	 * rule body conversion
	 * @param ruleBody
	 * @param vocabulary
	 * @param vocaRTServ
	 * @param flags
	 * @param output
	 * @param pathPrefixMap
	 */
	RuleBodyServicesLib.prototype.convert = function convert(ruleBody, vocabulary, vocaRTServ, flags, output, pathPrefixMap) {

		//Creating the rule convertor instance
		var ruleBodyConvertor = new ruleBodyConvertorLib.RuleBodyConvertor();

		return ruleBodyConvertor.convert(ruleBody,
										 vocabulary,
										 vocaRTServ,
										 flags,	
										 output,
										 pathPrefixMap,
										 null);
	};

	/**
	 * rule body validation
	 * @param ruleBody
	 * @param vocabulary
	 * @param vocaRTServ
	 * @param flags
	 * @param output
	 * @param pathPrefixMap
	 * @returns
	 */
	RuleBodyServicesLib.prototype.validate = function validate(ruleBody, vocabulary, vocaRTServ, flags, output, pathPrefixMap) {

		//Creating the rule validator instance
		var ruleBodyValidator = new ruleBodyValidatorLib.RuleBodyValidator();

		return ruleBodyValidator.validateBusinessRule(ruleBody,
													  vocabulary,
													  vocaRTServ,
													  flags,
													  output,
													  pathPrefixMap,
													  null);
	};

  
	/**
	 * rule body process like: validate, convert etc.
	 * @param ruleBody
	 * @param vocabulary
	 * @param vocaRTServ
	 * @param flags
	 * @param output
	 * @param pathPrefixMap
	 * @returns
	 */
	RuleBodyServicesLib.prototype.process = function process(ruleBody, vocabulary, vocaRTServ, flags, output, pathPrefixMap, oDataRule) {
		var result = null;
		
		function isConversionNeeded(flags) {	
			if(flags && (flags.hasOwnProperty(ruleBodyConstants.outputFlagsEnum.ASTOutput)|| 
						  flags.hasOwnProperty(ruleBodyConstants.outputFlagsEnum.conversionOutput) || 
			             (flags.hasOwnProperty(ruleBodyConstants.outputFlagsEnum.locale) && 
			              flags[ruleBodyConstants.outputFlagsEnum.locale].hasOwnProperty(ruleBodyConstants.localeEnum.convert) &&
			              flags[ruleBodyConstants.outputFlagsEnum.locale][ruleBodyConstants.localeEnum.convert]))){
				return true;
			}	
			return false;
		}
		
		if(isConversionNeeded(flags)){
			
			//Creating the rule convertor instance
			var ruleBodyConvertor = new ruleBodyConvertorLib.RuleBodyConvertor(oDataRule);

			result = ruleBodyConvertor.convert(ruleBody,
											 vocabulary,
											 vocaRTServ,
											 flags,	
											 output,
											 pathPrefixMap,
											 null);
		}
		else{
			
			//Creating the rule validator instance
			var ruleBodyValidator = new ruleBodyValidatorLib.RuleBodyValidator();
	
			result = ruleBodyValidator.validateBusinessRule(ruleBody,
														  vocabulary,
														  vocaRTServ,
														  flags,
														  output,
														  pathPrefixMap,
														  null);
		}

		return result;	
	};
	
	/**
	 * 
	 * @param ruleId
	 * @param ruleBody
	 * @param output
	 * @param vocabulary
	 * @param vocaRTServ
	 * @returns
	 */
	RuleBodyServicesLib.prototype.parseRootObjectContext = function parseRootObjectContext(ruleId, ruleBody, output, vocabulary, vocaDataProvider, vocaRuleNameToRootObjectMap){
		var flags = {};
		
		flags.vocaRules = {};
		flags.vocaRules.rootObjectMap = vocaRuleNameToRootObjectMap;
		flags[ruleBodyConstants.ODATA_FORMAT_PAYLOAD] = {};
		flags[ruleBodyConstants.ODATA_FORMAT_PAYLOAD][ruleBodyConstants.RULE_ID] = ruleId;
		flags[ruleBodyConstants.outputFlagsEnum.validationOutput] = false; 
		flags[ruleBodyConstants.outputFlagsEnum.rootObjectContextOutput] = true;
		flags[ruleBodyConstants.outputFlagsEnum.dependenciesOutput] = true;
		
		return this.process(ruleBody, vocabulary, vocaDataProvider, flags, output, null, null);
	};
	
	
	
	return {
		RuleBodyServicesLib: RuleBodyServicesLib
	};
}, true);