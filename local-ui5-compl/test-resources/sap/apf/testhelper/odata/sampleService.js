/*
 * Copyright (C) 2009-2013 SAP AG or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare('sap.apf.testhelper.odata.getSampleService');
sap.ui.define([
	"sap/apf/utils/exportToGlobal",
	"require"
], function(
	exportToGlobal,
	require
){
	"use strict";

	function syncFetchSampleData(sRequestId) {
		var aReturn = [];
		var serviceUrl = "";
		switch (sRequestId) {
			case 'sampleData':
				serviceUrl = "./sampleData.json";
				break;
			case 'sampleDataRevenue':
				serviceUrl = "./sampleDataRevenue.json";
				break;
			case 'sampleDataForCharts':
				serviceUrl = "./sampleDataForCharts.json";
				break;
			case 'smallSampleData':
				serviceUrl = "./smallSampleData.json";
				break;
			default:
				break;
		}
		var onDataError = function(oJqXHR, sStatus, sErrorThrown) {
		};
		var onDataFetchResponse = function(data, textStatus, XMLHttpRequest) {
			aReturn = data.d.results;
		};
		if (serviceUrl) {
			jQuery.ajax({
				url : require.toUrl(serviceUrl),
				type : "GET",
				//			beforeSend : function() {
				//				//xhr.setRequestHeader("X-CSRF-Token", "Fetch");
				//			},
				async : false,
				dataType : "json",
				success : onDataFetchResponse,
				error : onDataError
			});
		}
		return aReturn;
	}

	/**
	 * @alias sap.apf.testhelper.odata.getSampleService
	 */
	function getSampleService(oApi, sRequestId) {
		return syncFetchSampleData(sRequestId);
	}
	getSampleService.get = syncFetchSampleData;

	exportToGlobal("sap.apf.testhelper.odata.getSampleService", getSampleService);

	return getSampleService;
});
