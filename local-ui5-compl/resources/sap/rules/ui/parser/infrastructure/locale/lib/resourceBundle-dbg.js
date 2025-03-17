sap.ui.define([
	"sap/rules/ui/parser/infrastructure/locale/lib/resourceBundleContext"
], function(ResourceBundleContext) {
    "use strict";
    
    var instance = null;
	// Singletone
	function ResourceBundle(){
		//var ResourceBundleContext = sap.rules.ui.parser.infrastructure.locale.lib.resourceBundleContext.lib;
		return {
			getString : function(messageKey, bindArray, fileEnum){
				var str = ResourceBundleContext.lib.getString(messageKey, bindArray, fileEnum);
				return str;
			}
		};
	}
	
	return {
		getInstance : function() {
			if (!instance) {
				instance = new ResourceBundle();
				instance.constructor = null;
			}
			return instance;
		}
	};
}, true);