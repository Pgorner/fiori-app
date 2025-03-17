sap.ui.define([
	"sap/m/Input",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/mvc/View",
	"sap/ui/core/mvc/ViewType",
	"sap/ui/core/util/MockServer",
	"sap/ui/model/odata/v2/ODataModel"
], function(Input, Controller, View, ViewType, MockServer, ODataModel) {
	'use strict';
	sinon.config = {
		useFakeServer : false
	};

	QUnit.module("For a catalog service", {
		beforeEach : async function(assert) {
			this.mockServer = new MockServer({
				rootUri : "/sap/opu/odata/iwfnd/catalogservice/"
			});

			// start and return
			var url = sap.ui.require.toUrl("sap/apf/testhelper/mockServer/metadata/catalogDummy.xml");
			this.mockServer.simulate(url, {
				'sMockdataBaseUrl' : sap.ui.require.toUrl("sap/apf/testhelper/mockServer/metadata/"),
				'bGenerateMissingMockData' : true
			});
			this.mockServer.start();
			var oCatalogServiceController = await Controller.create({
				name : "sap.apf.modeler.ui.controller.catalogService"
			});
			var spyOnInit = sinon.spy(oCatalogServiceController, "onInit");
			this.spyOnHandleFormatter = sinon.spy(oCatalogServiceController, "handleFormatting");
			this.spyOnHandleSearch = sinon.spy(oCatalogServiceController, "handleSearch");

			var requiredParentControl = new Input({});

			this.catalogServiceView = await View.create({
				viewName : "sap.apf.modeler.ui.view.catalogService",
				type : ViewType.XML,
				controller : oCatalogServiceController,
				viewData : {
					oTextReader : function(key) {
						return key;
					},
					parentControl : requiredParentControl,
					getCalatogServiceUri : function getCalatogServiceUri() {
						return "/sap/opu/odata/iwfnd/catalogservice/";
					}
				},
				async : true
			})
			assert.strictEqual(spyOnInit.calledOnce, true, "then catalog onInit function is called and view is initialized");
		},
		afterEach : function() {
			this.mockServer.stop();
			this.mockServer.destroy();
			this.catalogServiceView.destroy();
		}
	});
	QUnit.test("When Catalog Service view is initialized", function(assert) {
		var done = assert.async();
		var model = this.catalogServiceView.byId("idGatewayCatalogListDialog").getModel();
		assert.strictEqual(model instanceof ODataModel, true, "THEN model instance of v2 odata model");
		var binding = this.catalogServiceView.byId("idGatewayCatalogListDialog").getBinding("items");
		var assertsForReceivedData = function(){
			binding.detachDataReceived(assertsForReceivedData);
			var oDialog = this.catalogServiceView.byId("idGatewayCatalogListDialog");

			assert.ok(this.catalogServiceView, "then catalog service view exists");
			assert.ok(oDialog, "Gateway select dialog exists");
			assert.strictEqual(oDialog.getTitle(), this.catalogServiceView.getViewData().oTextReader("selectService"), "Title is set for select dialog");
			assert.strictEqual(oDialog.getNoDataText(), this.catalogServiceView.getViewData().oTextReader("noDataText"), "No data text is set for select dialog");
			assert.strictEqual(this.spyOnHandleFormatter.called, true, "handleFormatter is called to format the service");
			assert.ok(oDialog.getItems().length > 0, "List of service Items exists in dialog");
			var assertsForSearch = function(){
				binding.detachDataReceived(assertsForSearch);
				assert.strictEqual(this.spyOnHandleSearch.calledOnce, true, "then, handleSearch is called to search the given string in the list the service");
				assert.strictEqual(oDialog.getItems().length, 2, "List was filtered to 2 items");
				this.catalogServiceView.byId("idGatewayCatalogListDialog")._dialog.close();
				done();
			}.bind(this);
			binding.attachDataReceived(assertsForSearch);
			oDialog.fireSearch({ value: "MR01"});
		}.bind(this);
		binding.attachDataReceived(assertsForReceivedData);
	});
});
