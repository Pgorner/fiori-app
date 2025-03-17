/*
 * This test is executed manually against a server. The manual steps are described in the internal
 * document proxySettings.txt. Thus, it is not part of a testsuite. 
 */

sap.ui.define([
	"sap/apf/core/entityTypeMetadata",
	"sap/apf/core/metadata",
	"sap/apf/core/metadataFactory",
	"sap/apf/core/odataRequest",
	"sap/apf/core/utils/uriGenerator",
	"sap/apf/testhelper/authTestHelper",
	"sap/apf/testhelper/createDefaultAnnotationHandler",
	"sap/apf/testhelper/doubles/coreApi",
	"sap/apf/testhelper/doubles/messageHandler",
	"sap/apf/utils/hashtable"
], function(
	EntityTypeMetadata,
	Metadata,
	MetadataFactory,
	odataRequestWrapper,
	uriGenerator,
	oAuthTestHelper,
	createDefaultAnnotationHandler,
	CoreApiDouble,
	MessageHandlerDouble,
	Hashtable
) {
	'use strict';

	const AuthTestHelper = oAuthTestHelper.constructor;

	QUnit.module('Metadata', {
		beforeEach : function(assert) {
			var done = assert.async();
			this.oMessageHandler = new MessageHandlerDouble().doubleCheckAndMessaging();
			this.oCoreApi = new CoreApiDouble({
				instances : {
					messageHandler : this.oMessageHandler
				}
			});
			this.oCoreApi.getUriGenerator = function() {
				return uriGenerator;
			};
			this.oCoreApi.odataRequest = function(oRequest, fnSuccess, fnError, oBatchHandler) {
				var oInject = {
					instances: {
						datajs: OData
					},
					functions : {
						getSapSystem : function() {}
					}
				};
				odataRequestWrapper(oInject, oRequest, fnSuccess, fnError, oBatchHandler);
			};
			this.oCoreApi.getXsrfToken = function(sServiceRootPath) {
				return this.oAuthTestHelper.getXsrfToken();
			}.bind(this);
			this.oMetadataInject = {};
			this.oMetadataInject.instances = {};
			this.oMetadataInject.constructors = {};
			this.oMetadataInject.instances.coreApi = this.oCoreApi;
			this.oMetadataInject.instances.messageHandler = this.oMessageHandler;
			this.oMetadataInject.instances.annotationHandler = createDefaultAnnotationHandler();
			this.oMetadataInject.constructors.Hashtable = Hashtable;
			this.oMetadataInject.constructors.EntityTypeMetadata = EntityTypeMetadata;
			this.oMetadataInject.constructors.Metadata = Metadata;
			this.oMetadataInject.functions = {
					getSapSystem : function() {}
			}
			this.oAuthTestHelper = new AuthTestHelper(done, function() {
				this.oMetadataFactory = new MetadataFactory(this.oMetadataInject);
				done();
			}.bind(this));
		}
	});
	QUnit.test('Same metadata instance returned if retrieved twice for service root', function(assert) {
		assert.expect(2);
		var done = assert.async();
		var firstRetrieval = this.oMetadataFactory.getMetadata('/sap/hba/apps/wca/dso/s/odata/wca.xsodata');
		firstRetrieval.done(function(metadataFirst) {
			var secondRetrieval = this.oMetadataFactory.getMetadata('/sap/hba/apps/wca/dso/s/odata/wca.xsodata');
			assert.equal(metadataFirst.type, 'metadata', 'Metadata instance expected');
			secondRetrieval.done(function(metadataSecond) {
				assert.equal(metadataFirst, metadataSecond, 'Same metadata instance expected');
				done();
			});
		}.bind(this));
	});
	QUnit.test('Same entity type metadata instance returned if retrieved twice for service root and entity type', function(assert) {
		assert.expect(2);
		var done = assert.async();
		var firstRetrieval = this.oMetadataFactory.getEntityTypeMetadata('/sap/hba/apps/wca/dso/s/odata/wca.xsodata', 'WCADaysSalesOutstandingQuery');
		firstRetrieval.done(function(entityTypeMetadataFirst) {
			var secondRetrieval = this.oMetadataFactory.getEntityTypeMetadata('/sap/hba/apps/wca/dso/s/odata/wca.xsodata', 'WCADaysSalesOutstandingQuery');
			assert.equal(entityTypeMetadataFirst.type, 'entityTypeMetadata', 'Entity type metadata instance expected');
			secondRetrieval.done(function(entityTypeMetadataSecond) {
				assert.equal(entityTypeMetadataFirst, entityTypeMetadataSecond, 'Same entity type metadata instance expected');
				done();
			});
		}.bind(this));
	});
});
