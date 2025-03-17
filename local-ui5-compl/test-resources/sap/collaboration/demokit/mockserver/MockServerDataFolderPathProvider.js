sap.ui.define([], function() {
	"use strict";

	var MockServerDataFolderPathProvider = function(){};
	MockServerDataFolderPathProvider.getMockServerDataFolderPath = function() {
		return "test-resources/sap/collaboration/demokit/mockserver/";
	};

	return MockServerDataFolderPathProvider;
}, /* bExport= */ true);
