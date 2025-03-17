/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/*global QUnit */
/*eslint no-warning-comments: 0 */

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"util/V4ServerHelper",
	"sap/ui/model/odata/v4/ODataModel",
	"sap/ui/model/odata/v2/ODataModel"
], function(jQuery, V4ServerHelper, ODataModel, V2ODataModel) {
	"use strict";

	//*********************************************************************************************
	QUnit.module("sap.ui.mdc OData V4 Server Test", {
		beforeEach: function() {
		},

		afterEach: function() {
		}
	});
	QUnit.config.reorder = false;


	V4ServerHelper.requestFreshServerURL(true).then(function(SERVER_URL) { // try only the catalog service, even though there are some others
		var SERVICE_URL = SERVER_URL + "catalog/";
		var SERVICE_URL_V2 = SERVER_URL + "v2/catalog/";

		//*********************************************************************************************
		QUnit.test("V4 Server is Alive", function(assert) {
			var done = assert.async();

			// first check whether the service responds at all
			jQuery.get({
				url: SERVICE_URL,
				success: function(data) {
					assert.ok(data, "Server should be alive, it is at: " + SERVICE_URL);
					assert.equal(data["@odata.context"], "$metadata", "Server should respond with OData stuff");
					done();
				},
				error: function(xhr, textStatus, error) {
					assert.ok(false, "Error when contacting V4 server: " + textStatus);
					done();
				}
			});
		});



		QUnit.module("sap.ui.mdc OData V4 Server Test and V4 Model", {
			beforeEach: function() {
				this.oModel = new ODataModel({
					serviceUrl: SERVICE_URL,
					groupId: "$direct"
				});
			},

			afterEach: function() {
				this.oModel.destroy();
			}
		});
		QUnit.config.reorder = false;


		QUnit.test("Can access server data via V4 model", function(assert) {
			var done = assert.async();

			// need a binding in V4 to access data
			var oBinding = this.oModel.bindList("/Authors");
			oBinding.requestContexts(0, 10).then(function(aContexts) { // request the first 10 authors
				assert.equal(aContexts.length, 10, "There should be at least 10 authors initially");
				var authorOne = aContexts[0].getObject();
				assert.equal(authorOne.name, "Austen, Jane", "The expected data should exist in the server");

				oBinding.requestContexts(0, 1000).then(function(aContexts) { // request all books
					var length = oBinding.getLength();
					assert.equal(length, 555, "There should be 555 authors");
					assert.ok(oBinding.isLengthFinal(), "The binding length should be final");
					done();
				});
			});
		});


		QUnit.test("Can create data", function(assert) {
			var done = assert.async();

			var oBinding = this.oModel.bindList("/Authors");
			var randomId = Math.round(Math.random() * 10000000);
			var randomName = "Name " + Math.round(Math.random() * 10000);

			// Request all authors; this is needed before creation because otherwise the V4 model uses a $filter with "not" operator for the next such call,
			// and the "not" operator is not understood by the CAP server right now (11/2019).
			oBinding.requestContexts(0, 1000).then(function(aContexts) {
				assert.equal(oBinding.getLength(), 555, "There should be 555 authors before creation");

				var oNewContext = oBinding.create({ID: randomId, name: randomName});
				oNewContext.created().then(function() {
					oBinding.requestContexts(0, 1000).then(function(aContexts) { // request the first 1000 authors again
						assert.equal(oBinding.getLength(), 556, "There should be 556 authors now");
						var authorOne = aContexts[0].getObject();
						assert.equal(authorOne.name, randomName, "New author should have the correct title '" + randomName + "'");
						done();
					});
				});
			});

		});


		QUnit.test("Can reset data with tenantBaseUrl", function(assert) { // this test repeats the creation from the test above to be independently executable, even though this is lengthy and causes deep nesting
			var done = assert.async();

			var oBinding = this.oModel.bindList("/Authors");

			// Request all authors; this is needed before creation because otherwise the V4 model uses a $filter with "not" operator for the next such call,
			// and the "not" operator is not understood by the CAP server right now (11/2019).
			oBinding.requestContexts(0, 1000).then(function(aContexts) {
				var randomId = Math.round(Math.random() * 10000000);
				var randomName = "Name " + Math.round(Math.random() * 10000);
				var oNewContext = oBinding.create({ID: randomId, name: randomName});

				oNewContext.created().then(function() {
					oBinding.requestContexts(0, 1000).then(function(aContexts) { // request the first 1000 authors again
						assert.ok(oBinding.getLength() > 555, "There should be more than 555 authors now");

						// NOW reset
						V4ServerHelper.requestReset(SERVER_URL).then(function() {
							this.oModel.destroy();
							this.oModel = new ODataModel({ // create a new model to avoid caching problems
								serviceUrl: SERVICE_URL,
								groupId: "$direct"
							});
							oBinding = this.oModel.bindList("/Authors");

							oBinding.requestContexts(0, 1000).then(function(aContexts) { // request all authors
								assert.equal(oBinding.getLength(), 555, "There should be 555 authors after reset");
								var authorOne = aContexts[0].getObject();
								assert.equal(authorOne.name, "Austen, Jane", "First author should have the correct name.");
								done();
							});
						}.bind(this));
					}.bind(this));
				}.bind(this));
			}.bind(this));
		});




		QUnit.module("sap.ui.mdc OData V4 Server with V2 Adapter", {
			beforeEach: function() {
			},

			afterEach: function() {
			}
		});
		QUnit.config.reorder = false;


		QUnit.test("V2 Adapter is Alive", function(assert) {
			var done = assert.async();

			// first check whether the service responds at all
			jQuery.get({
				url: SERVICE_URL_V2,
				success: function(data) {
					assert.ok(data, "V2 adapter should be alive, it is at: " + SERVICE_URL_V2);
					assert.ok(data.d && data.d.EntitySets && data.d.EntitySets.length > 0, "Server should respond with OData V2 stuff");
					done();
				},
				error: function(xhr, textStatus, error) {
					assert.ok(false, "Error when contacting V2 adapter: " + textStatus);
					done();
				}
			});
		});



		QUnit.module("sap.ui.mdc OData V4 Server with V2 Adapter and V2 Model", {
			beforeEach: function() {
				this.oModel = new V2ODataModel({
					serviceUrl: SERVICE_URL_V2
				});
			},

			afterEach: function() {
				this.oModel.destroy();
			}
		});
		QUnit.config.reorder = false;


		QUnit.test("Can access server data via V2 model", function(assert) {
			var done = assert.async();

			// need a binding in V4 to access data
			this.oModel.read("/Authors", {
				success: function(oData, oResponse) {
					assert.equal(oResponse.statusCode, "200", "Theresponse code should be 200");
					assert.equal(oData.results.length, 555, "There should be 555 authors");
					assert.equal(oData.results[0].name, "Austen, Jane", "The first Author should be Jane Austen");
					done();
				},
				error: function(err) {
					assert.ok(false, "OData V2 read error: " + err);
					done();
				}
			});
		});


		QUnit.start(); // start tests once server helper is ready and has the needed information


	}).catch(function() { // V4 server not available => do not run the tests, as we are in some other layer or environment (e.g. dist layer)
		QUnit.test("V4 Server Test SKIPPED", function(assert) {
			assert.ok(true, "V4 Server tests are not run because no such server is available"); // TODO: detect and fail when the tests SHOULD be run in the current environment (i.e. when we are in sapui5.runtime)
		});

		QUnit.start();
	});

});
