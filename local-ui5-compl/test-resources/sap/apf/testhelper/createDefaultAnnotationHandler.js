sap.ui.define([
	"sap/apf/core/utils/annotationHandler",
	"sap/apf/core/utils/fileExists",
	"sap/apf/core/utils/uriGenerator",
	"sap/apf/utils/exportToGlobal",
	"sap/apf/utils/utils"
], function(
	AnnotationHandler,
	FileExists,
	uriGenerator,
	exportToGlobal,
	utils
) {
	'use strict';
	/**
	 * @alias sap.apf.testhelper.createDefaultAnnotationHandler
	 */
	function createDefaultAnnotationHandler() {
		var injectAnnotationHandler = {
				functions : {
					getSapSystem : function() { return undefined; },
					getComponentNameFromManifest : utils.getComponentNameFromManifest,
					getODataPath : uriGenerator.getODataPath,
					getBaseURLOfComponent : uriGenerator.getBaseURLOfComponent,
					addRelativeToAbsoluteURL : uriGenerator.addRelativeToAbsoluteURL
				},
				instances : {
					fileExists : new FileExists()
				}
		};
		return new AnnotationHandler.constructor(injectAnnotationHandler);
	}

	exportToGlobal("sap.apf.testhelper.createDefaultAnnotationHandler", createDefaultAnnotationHandler);

	return createDefaultAnnotationHandler;
});
