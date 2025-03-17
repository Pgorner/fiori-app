/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/ui/documentation/sdk/controller/util/ResourceDownloadUtil",
	"sap/ui/documentation/sdk/controller/util/XML2JSONUtils"], function(ResourceDownloadUtil, XML2JSONUtils) {
		"use strict";

		var _fetchPromises = {};
		var _oAppConfig;

		var Loader = {
			fetch: function (sUrl) {

				if (!(sUrl in _fetchPromises)) {
					_fetchPromises[sUrl] = this._fetch(sUrl);
				}
				return _fetchPromises[sUrl];
			},

			_fetch: function(sUrl) {
				return ResourceDownloadUtil.fetch(sUrl).then(function(sContent) {
					return XML2JSONUtils.XML2JSON(sContent, _oAppConfig);
				});
			}
		};

		return {
			getInstance: function(oAppConfig) {
				_oAppConfig = oAppConfig;
				return Loader;
			}
		};
	}, /* bExport= */ true);