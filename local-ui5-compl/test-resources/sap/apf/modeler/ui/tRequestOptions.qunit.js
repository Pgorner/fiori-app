/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define([
	'sap/apf/cloudFoundry/uiHandler',
	'sap/apf/modeler/ui/controller/requestOptions',
	'sap/ui/core/mvc/View'
], function(uiHandler, RequestOptionsController, View) {
	'use strict';

	function createRequestOptionsController() {
		return Promise.resolve(new RequestOptionsController());
	}

	QUnit.module("test cloud foundry value help: on cf", {
		beforeEach : async function() {
			var that = this;
			this.oTextReader = {};
			this.getCalatogServiceUri = function() {};
			this.oCoreApi = {
				isUsingCloudFoundryProxy: function() {
					return true;
				}
			};
			this.spyIsUsingCloudFoundryProxy = sinon.spy(this.oCoreApi, "isUsingCloudFoundryProxy");
			this.oController = await createRequestOptionsController();
			this.oController.getView = function() {
				return {
					getViewData : function() {
						return {
							oTextReader : that.oTextReader,
							getCalatogServiceUri : that.getCalatogServiceUri,
							oCoreApi : that.oCoreApi
						};
					}
				};
			};
			this.stubShowValueHelp = sinon.stub(uiHandler, "showValueHelp");
		},
		afterEach : function() {
			this.stubShowValueHelp.restore();
		}
	});
	QUnit.test("handle show value help request", function(assert) {
		var parent = {};
		this.oController.handleShowValueHelpRequest({
			getSource : function() {
				return parent;
			}
		});
		assert.ok(this.spyIsUsingCloudFoundryProxy.calledOnce, "isUsingCloudFoundryProxy is called once");
		assert.strictEqual(this.stubShowValueHelp.firstCall.args[0].oTextReader, this.oTextReader, "showValueHelp is called with the text reader");
		assert.strictEqual(this.stubShowValueHelp.firstCall.args[0].parentControl, parent, "showValueHelp is called with the parent control");
		assert.strictEqual(this.stubShowValueHelp.firstCall.args[0].getCalatogServiceUri, this.getCalatogServiceUri, "showValueHelp is called with the catalog service uri");
		assert.strictEqual(this.stubShowValueHelp.firstCall.args[1], this.oCoreApi, "showValueHelp is called with the core api");
		assert.strictEqual(this.stubShowValueHelp.firstCall.args[2], this.oController, "showValueHelp is called with the controller");
	});

	QUnit.module("test cloud foundry value help: not on cf", {
		beforeEach : async function() {
			var that = this;
			sinon.spy(View, "create");
			this.oTextReader = {};
			this.getCalatogServiceUri = function() {};
			this.oCoreApi = {
				isUsingCloudFoundryProxy: function() {
					return false;
				}
			};
			this.spyIsUsingCloudFoundryProxy = sinon.spy(this.oCoreApi, "isUsingCloudFoundryProxy");
			this.oController = await createRequestOptionsController();
			this.oController.getView = function() {
				return {
					getViewData : function() {
						return {
							oTextReader : that.oTextReader,
							getCalatogServiceUri : that.getCalatogServiceUri,
							oCoreApi : that.oCoreApi
						};
					}
				};
			};
		},
		afterEach : function() {
			View.create.restore();
		}
	});
	QUnit.test("handle show value help request", async function(assert) {
		var parent = {};
		this.oController.handleShowValueHelpRequest({
			getSource : function() {
				return parent;
			}
		});
		assert.ok(this.spyIsUsingCloudFoundryProxy.calledOnce, "isUsingCloudFoundryProxy is called once");
		assert.ok(View.create.calledOnce, "View.create is called once");
		assert.strictEqual(View.create.firstCall.args[0].viewData.oTextReader, this.oTextReader, "View.create is called with the text reader in the view data");
		assert.strictEqual(View.create.firstCall.args[0].viewData.parentControl, parent, "View.create is called with the parent control in the view data");
		assert.strictEqual(View.create.firstCall.args[0].viewData.getCalatogServiceUri, this.getCalatogServiceUri, "View.create is called with the catalog service uri in the view data");
		assert.strictEqual(View.create.firstCall.args[0].viewName, "sap.apf.modeler.ui.view.catalogService", "View.create is called to show the catalog service view");
	});
});
