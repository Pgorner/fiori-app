sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/core/util/MockServer",
	"sap/ui/export/test/util/FetchToXHRBridge"
], function(BaseObject, MockServer, FetchToXHRBridge) {
	"use strict";

	/* Export requires an absolute path */
	const SERVICE_URL = "https://fake.host.com/local/service/";

	const DemoMockServer = BaseObject.extend("sap.ui.comp.sample.smarttable.refAppMockServer.DemoMockServer", {
		constructor : function() {
			BaseObject.apply(this);

			const oMockServer = new MockServer({
				rootUri: SERVICE_URL
			});

			this._oMockServer = oMockServer;
			this._sMockdataUrl = sap.ui.require.toUrl("sap/ui/comp/sample/smarttable/refAppMockServer");

			oMockServer.simulate(this._sMockdataUrl + "/metadata.xml", this._sMockdataUrl);
			oMockServer.simulate(this._sMockdataUrl + "/metadata.xml", {
				sMockdataBaseUrl: this._sMockdataUrl,
				bGenerateMissingMockData: true
			});
			this.start();
		}

	});

	DemoMockServer.prototype.getServiceUrl = function() {
		return SERVICE_URL;
	};

	DemoMockServer.prototype.getAnnotationUrl = function() {
		return this._sMockdataUrl + "/STTA_PROD_MAN_ANNO_MDL.xml";
	};

	DemoMockServer.prototype.start = function() {
		this._oMockServer.start();
		FetchToXHRBridge.activate();
	};

	DemoMockServer.prototype.stop = function() {
		this._oMockServer.stop();
		FetchToXHRBridge.deactivate();
	};

	DemoMockServer.prototype.destroy = function() {
		this.stop();
		this._oMockServer.destroy();
	};

	return DemoMockServer;
});