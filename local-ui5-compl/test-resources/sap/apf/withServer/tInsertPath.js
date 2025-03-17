/* 
 * This test is executed manually against a server. The manual steps are described in the internal
 * document proxySettings.txt. Thus, it is not part of a testsuite. 
 */
sap.ui.define([
	"sap/apf/withServer/helper",
	"sap/apf/core/odataRequest",
], function(
	Helper,
	odataRequestWrapper
) {
	'use strict';

	QUnit.module('Insert/Create Path(s)', {
		beforeEach : function(assert) {
			var done = assert.async();
			if (new URLSearchParams(window.location.search).get("systemType") === "abap") {
				this.config = {
						serviceRoot : "/sap/opu/odata/sap/BSANLY_APF_RUNTIME_SRV/",
						entitySet : "AnalysisPathQueryResults",
						systemType : "abap"
				};
			} else {
				this.config = {
						serviceRoot : "/sap/hba/r/apf/core/odata/apf.xsodata/",
						entitySet : 'AnalysisPathQueryResults',
						systemType : "xs"
				};
			}
			this.helper = new Helper(this.config);
			this.oPostObject = this.helper.createPostObject();
			this.oAuthTestHelper = this.helper.createAuthTestHelper(done, function() {
				done();
			});
		}
	});
	QUnit.test("Insert path", function(assert) {
		assert.expect(1);
		var done = assert.async();
		this.oAuthTestHelper.getXsrfToken().done(function(sXsrfToken){
			var sUrl = this.config.serviceRoot + this.config.entitySet;
			var oRequest = {
					requestUri : sUrl,
					method : "POST",
					headers : {
						"x-csrf-token" : sXsrfToken
					},
					data : this.oPostObject
			};
			var fnSuccess = function(oData, oResponse) {
				if (oData && oData.AnalysisPath && oResponse.statusText === "Created") {
					assert.ok(true, "Request succeeded.");
				} else {
					assert.ok(false, "Request failed.");
				}
				done();
			};
			var fnError = function(oError) {
				assert.ok(false, "Request failed.");
				done();
			};
			var oInject = {
					instances: {
						datajs: OData
					},
					functions : {
						getSapSystem : function() {}
					}
			};
			odataRequestWrapper(oInject, oRequest, fnSuccess, fnError);
		}.bind(this));
	});
});