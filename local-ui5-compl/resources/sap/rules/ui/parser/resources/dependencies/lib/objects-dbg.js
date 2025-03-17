sap.ui.define([
	"sap/rules/ui/parser/resources/dependencies/lib/constants"
], function(dependenciesConstantsLib) {
    "use strict";
    
    function VocaDOInfo(DOName, vocabulary) {
		this.category = dependenciesConstantsLib.CATEGORY_VOCA_DO;
		this.DOName = DOName;
		this.vocaName = vocabulary;
	}

	function VocaDOAttributes(DOName, attribute, vocabulary) {
		this.category = dependenciesConstantsLib.CATEGORY_VOCA_DO_ATTRIBUTE;
		this.DOName = DOName;
		this.attribute = attribute;
		this.vocaName = vocabulary;
	}

	function VocaDOAssociation(DOName, association, vocabulary) {
		this.category = dependenciesConstantsLib.CATEGORY_VOCA_DO_ASSOC;
		this.DOName = DOName;
		this.association = association;
		this.vocaName = vocabulary;
	}


	function VocaAction(actionName, vocabulary) {
		this.category = dependenciesConstantsLib.CATEGORY_VOCA_ACTIONS;
		this.actionName = actionName;

		if (vocabulary) {
			this.vocaName = vocabulary;
		}
	}

	function VocaAlias(aliasName, vocaName) {
		this.category = dependenciesConstantsLib.CATEGORY_VOCA_ALIASES;
		this.aliasName = aliasName;
		this.vocaName = vocaName;
	}
	return {
		VocaDOInfo: VocaDOInfo,
		VocaDOAttributes: VocaDOAttributes,
		VocaDOAssociation: VocaDOAssociation,
		VocaAction: VocaAction,
		VocaAlias: VocaAlias
	};
}, true);