/* This test is executed manually against a server. The manual steps are described in the internal
 * document proxySettings.txt. Thus, it is not part of a testsuite. */
sap.ui.define([
	"sap/apf/core/instance",
	"sap/apf/core/messageHandler",
	"sap/apf/core/metadata",
	"sap/apf/core/utils/uriGenerator",
	"sap/apf/utils/hashtable",
	"sap/apf/utils/startParameter",
	"sap/apf/internal/server/userData",
	"sap/apf/testhelper/authTestHelper",
	"sap/apf/testhelper/createDefaultAnnotationHandler"
], function(
	oCoreInstance,
	MessageHandler,
	Metadata,
	_uriGenerator,
	Hashtable,
	StartParameter,
	_userData,
	oAuthTestHelper,
	createDefaultAnnotationHandler
) {
	'use strict';

	const AuthTestHelper = oAuthTestHelper.constructor;
	const CoreInstance = oCoreInstance.constructor;

	QUnit.module('Metadata: Entity sets', {
		beforeEach : function(assert) {
			var done = assert.async();
			this.messageHandler = new MessageHandler();
			this.oAuthTestHelper = new AuthTestHelper(done, function() {
				var coreApi = new CoreInstance({
					instances: {
						messageHandler : this.messageHandler,
						startParameter : new StartParameter({})
					}
				});
				this.metadata = new Metadata({
					constructors : {
						Hashtable : Hashtable
					},
					instances : {
						messageHandler : this.messageHandler,
						coreApi : coreApi,
						annotationHandler : createDefaultAnnotationHandler()
					},
					functions : {
						getSapSystem : function() {}
					}
				}, '/sap/hba/apps/wca/dso/s/odata/wca.xsodata/');
				done();
			}.bind(this));
		}
	});
	QUnit.test('Get correct entity sets considering parameter entity sets', function(assert) {

		assert.expect(1);
		var done = assert.async();
		var expectedEntitySets = [ "WCAClearedReceivableQuery", "WCADaysSalesOutstandingQuery", "WCADSORevenueQuery", "WCAIndirectDSOQuery", "WCAIndirectDSOHistoryQuery", "WCAReceivableHistoryQuery", "WCARevenueQuery", "WCAOpenReceivableQuery",
		                           "WCAReceivableQuery", "CompanyCodeQueryResults", //this and following are no parameter entity sets
		                           "CurrencyQueryResults", "YearMonthQueryResults", "ExchangeRateQueryResults", "SAPClientQueryResults" ];

		this.metadata.isInitialized().done(function(metadata){
			assert.deepEqual(metadata.getEntitySets(), expectedEntitySets, "Correct entity sets of '/sap/hba/apps/wca/dso/s/odata/wca.xsodata/' received");
			done();
		});
	});
});
