sap.ui.define(
	["sap/suite/ui/generic/template/lib/CRUDManager"],
	function (CRUDManager) {
		"use strict";

		QUnit.module("CRUD Manager deleteEntities", {
			beforeEach : function () {

				this.aPathToBeDeleted = [];

				// Mock objects necessary for the class under test
				var oController = {
				};
				var oComponentUtils = {
					getCRUDActionHandler: function() {}
				};
				var oBusyHelper = {
					isBusy: function(){
						return bIsBusy;
					},
					setBusyReason: function() {
						
					},
					setBusy: function() {

					}
				};
				var oServices = {
					oTransactionController: {
						deleteEntities: function (aEntities) {
							var aDeleteResults = [];
							aEntities.forEach(function(path) {
								var fakeResponse =  {
									response:{}
								}
								if (path.indexOf('success') > -1) {
									fakeResponse.response.statusCode = "201"
								} else {
									fakeResponse.response.statusCode = "500"
								}
								aDeleteResults.push(fakeResponse)
							})
							return new Promise(function (resolve, reject) {
								resolve(aDeleteResults);
							});
						}
					},
					oApplication: {
						prepareDeletion: Function.prototype,
						markCurrentDraftAsModified: function() {
						
						}
					},
					
				};
				var oCommonUtils = {};

				// Stubs
				this.stubMessageModelGetData = sinon.stub(sap.ui.model.message.MessageModel.prototype, "getData", function () {
					var aODataMessages = [];
					for (var i=0; i < this.aPathToBeDeleted.length; i++) {
						if (this.aPathToBeDeleted[i].indexOf("error") > -1) {
							aODataMessages.push({
								path: this.aPathToBeDeleted[i],
								getTarget: function () {
									return this.path;
								},
								getType: function () {
									return this.type;
								},
								getPersistent: function () {
									return false;
								}
							});
						}
					}
					return aODataMessages;

				}.bind(this));

				this.cut_CRUDManager = new CRUDManager(oController, oComponentUtils, oServices, oCommonUtils, oBusyHelper);

			},
			afterEach : function() {
				this.stubMessageModelGetData.restore();
			}
		});


		// Tests for opening the Delete dialog
		QUnit.test("deleteEnties with all success -> returns []", function (assert) {
			var done = assert.async();

			this.aPathToBeDeleted = ["/success/01"];
			var oSetting = {pathes: this.aPathToBeDeleted}

			// execute test
			this.cut_CRUDManager.deleteEntities(oSetting).then(function (aFailedPath) {
				assert.equal(aFailedPath.length, 0, "All delete operations are successful; deleteEntities returned an empty array");
				done();
			}.bind(this));
		});

		QUnit.test("deleteEnties with all error -> returns [paths]", function (assert) {
			var done = assert.async();

			this.aPathToBeDeleted = ["/error/01"];
			var oSetting = {pathes: this.aPathToBeDeleted}

			// execute test
			this.cut_CRUDManager.deleteEntities(oSetting).then(function (aFailedPath) {

				assert.equal(aFailedPath.length, 1, "All delete operations have failed; deleteEntities returned an array with one item");
				assert.equal(aFailedPath[0].sPath, "/error/01", "The correct path is returned");
				done();
			}.bind(this));
		});

		QUnit.test("deleteEnties with 1 success and 1 error -> returns [01,02]", function (assert) {
			var done = assert.async();

			this.aPathToBeDeleted = ["/success/01", "/error/01", "/error/02"];
			var oSetting = {pathes: this.aPathToBeDeleted}

			// execute test
			this.cut_CRUDManager.deleteEntities(oSetting).then(function (aFailedPath) {

				assert.equal(aFailedPath.length, 2, "2 delete operations have failed; deleteEntities returned an array with 2 item");
				assert.equal(aFailedPath[0].sPath, "/error/01", "The correct path is returned");
				assert.equal(aFailedPath[1].sPath, "/error/02", "The correct path is returned");
				done();
			}.bind(this));
		});

});
