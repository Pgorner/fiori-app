/* 
 * This test is executed manually against a server. The manual steps are described in the internal
 * document proxySettings.txt. Thus, it is not part of a testsuite. 
 */
/*global sinon */
sap.ui.define([
	"sap/apf/core/messageHandler",
	"sap/apf/core/sessionHandler",
	"sap/apf/core/utils/uriGenerator",
	"sap/apf/testhelper/authTestHelperAbap",
	"sap/apf/testhelper/authTestHelper",
	"sap/apf/testhelper/doubles/coreApi"
], function(
	MessageHandler,
	SessionHandler,
	uriGenerator,
	AuthTestHelperAbap,
	oAuthTestHelper,
	CoreApiDouble
) {
	'use strict';

	const AuthTestHelper = oAuthTestHelper.constructor;

	function commonIsolatedSetup(oContext, assert) {
		var done = assert.async();
		oContext.oMessageHandler = new MessageHandler();
		var oMessageHandler = oContext.oMessageHandler;
		oContext.oCoreApi = new CoreApiDouble({
			instances : {
				messageHandler : oContext.oMessageHandler
			}
		});
		oContext.oCoreApi.getUriGenerator = function() {
			return uriGenerator;
		};
		var oInject = {
				instances : {
					messageHandler : oMessageHandler,
					coreApi : oContext.oCoreApi
				}
		};
		if (new URLSearchParams(window.location.search).get("systemType") === "abap") {
			oContext.config = {
					serviceRoot : "/sap/opu/odata/sap/Z_ANALYSIS_PATH_SRV/",
					entitySet : "AnalysisPathQSet",
					systemType : "abap"
			};
			oContext.oAuthTestHelper = new AuthTestHelperAbap(done, function() {
				this.oSessionHandler = new SessionHandler(oInject);
				done();
			}.bind(oContext), oContext.config);
			oContext.expectedXSRFTokenLength = 24;
		} else {
			oContext.config = {
					serviceRoot : "/sap/hba/r/apf/core/odata/apf.xsodata/",
					entitySet : 'AnalysisPathQueryResults',
					systemType : "xs"
			};
			oContext.oAuthTestHelper = new AuthTestHelper(done, function() {
				this.oSessionHandler = new SessionHandler(oInject);
				QUnit.start();
			}.bind(oContext));
			oContext.expectedXSRFTokenLength = 32;
		}
	}

	QUnit.module('Xsrf Token Test', {
		beforeEach : function(assert) {
			commonIsolatedSetup(this, assert);
			sinon.spy(jQuery, "ajax");
		},
		afterEach : function() {
			jQuery.ajax.restore();
		}
	});
	QUnit.test('Create SessionHandler Instance for XSRF Token check', function(assert) {
		var done = assert.async();
		this.oSessionHandler.getXsrfToken(this.config.serviceRoot).done(function(sXsrfToken){
			var callCountAfterFirstGetXsrfToken = jQuery.ajax.callCount;
			assert.ok(typeof sXsrfToken === "string", 'XSRF token expected');
			assert.equal(sXsrfToken.length, this.expectedXSRFTokenLength, 'XSRF token of length ' + this.expectedXSRFTokenLength + ' expected');
			this.oSessionHandler.getXsrfToken(this.config.serviceRoot).done(function(sXsrfToken1){
				assert.equal(sXsrfToken, sXsrfToken1, 'Second call for XSRF token returns same token as on first call');
				assert.equal(jQuery.ajax.callCount, callCountAfterFirstGetXsrfToken, 'Second call for XSRF token returns token from hashtable and does not trigger another ajax request');
				done();
			});
		}.bind(this));
	});
});
