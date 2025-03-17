/* global QUnit, sinon */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/navpopover/flexibility/LinkFlex",
	"sap/ui/comp/navpopover/NavigationContainer",
	"sap/ui/comp/navpopover/LinkData",
	"sap/ui/core/util/reflection/JsControlTreeModifier",
	"sap/ui/core/UIComponent",
	"sap/ui/fl/Utils",
	"sap/ui/fl/write/api/ChangesWriteAPI",
	"sap/ui/fl/library" // needed to create the changes
], function(
	LinkFlex,
	NavigationContainer,
	LinkData,
	JsControlTreeModifier,
	UIComponent,
	FlUtils,
	ChangesWriteAPI
) {
	"use strict";
	var sandbox = sinon.sandbox.create();

	QUnit.module("sap.ui.comp.navpopover.NavigationContainer - addLink", {
		beforeEach: function() {
			this._aLinksInvisible = [
				{
					key: "action1",
					href: "?TestObject#/dummyLink1",
					text: "Link1",
					visible: false
				}, {
					key: "action2",
					href: "?TestObject#/dummyLink2",
					text: "Link2",
					visible: false
				}, {
					key: "action3",
					href: "?TestObject#/dummyLink3",
					text: "Link3",
					visible: false
				}
			];
			this._aLinksVisible = [
				{
					key: "action4",
					href: "?TestObject#/dummyLink1",
					text: "Link1",
					visible: true
				}, {
					key: "action5",
					href: "?TestObject#/dummyLink2",
					text: "Link2",
					visible: true
				}, {
					key: "action6",
					href: "?TestObject#/dummyLink3",
					text: "Link3",
					visible: true
				}
			];
			this.oNavigationContainerInvisible = new NavigationContainer("IDNavigationContainer1", {
				availableActions: this._aLinksInvisible.map(function(oMLink) {
					return new LinkData({
						key: oMLink.key,
						href: oMLink.href,
						text: oMLink.text,
						visible: oMLink.visible
					});
				})
			});
			this.oNavigationContainerVisible = new NavigationContainer("IDNavigationContainer2", {
				availableActions: this._aLinksVisible.map(function(oMLink) {
					return new LinkData({
						key: oMLink.key,
						href: oMLink.href,
						text: oMLink.text,
						visible: oMLink.visible
					});
				})
			});
			sandbox.stub(FlUtils, "getAppComponentForControl").returns(new UIComponent());
		},
		afterEach: function() {
			sandbox.restore();
			this.oNavigationContainerVisible.destroy();
			this.oNavigationContainerInvisible.destroy();
		}
	});

	QUnit.test("applyChange: all invisible -> apply corrupt change", function(assert) {
		var done = assert.async();
		return ChangesWriteAPI.create({
			changeSpecificData: {
				changeType: "addLink",
				content: {
					key: "dummy",
					visible: true
				}
			},
			selector: this.oNavigationContainerInvisible
		}).then(function(oChange) {
			delete oChange.setContent({});
			LinkFlex.applyChange(oChange, this.oNavigationContainerInvisible, {
				modifier: JsControlTreeModifier
			}).catch(function(sError) {
				assert.equal(sError, "Change does not contain sufficient information to be applied", "Correct rejection message returned for corrupt change.");
				assert.equal(this.oNavigationContainerInvisible.getAvailableActions().length, 3);
				assert.equal(this.oNavigationContainerInvisible.getAvailableActions()[0].getText(), this._aLinksInvisible[0].text);
				assert.equal(this.oNavigationContainerInvisible.getAvailableActions()[0].getVisible(), false);
				assert.equal(this.oNavigationContainerInvisible.getAvailableActions()[1].getText(), this._aLinksInvisible[1].text);
				assert.equal(this.oNavigationContainerInvisible.getAvailableActions()[1].getVisible(), false);
				assert.equal(this.oNavigationContainerInvisible.getAvailableActions()[2].getText(), this._aLinksInvisible[2].text);
				assert.equal(this.oNavigationContainerInvisible.getAvailableActions()[2].getVisible(), false);

				assert.equal(this.oNavigationContainerInvisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions").length, 3);
				assert.equal(this.oNavigationContainerInvisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/text"), this._aLinksInvisible[0].text);
				assert.equal(this.oNavigationContainerInvisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/visible"), false);
				assert.equal(this.oNavigationContainerInvisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/text"), this._aLinksInvisible[1].text);
				assert.equal(this.oNavigationContainerInvisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/visible"), false);
				assert.equal(this.oNavigationContainerInvisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/text"), this._aLinksInvisible[2].text);
				assert.equal(this.oNavigationContainerInvisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/visible"), false);
				done();
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("applyChange: all invisible -> set 'dummy' visible", function(assert) {
		var done = assert.async();
		return ChangesWriteAPI.create({
			changeSpecificData: {
				changeType: "addLink",
				content: {
					key: "dummy",
					visible: true
				}
			},
			selector: this.oNavigationContainerInvisible
		}).then(function(oChange) {
			LinkFlex.applyChange(oChange, this.oNavigationContainerInvisible, {
				modifier: JsControlTreeModifier
			}).catch(function(sError) {
				assert.equal(sError, "Item with key dummy not found in the availableAction aggregation", "Correct rejection message returned for wrong key");
				assert.equal(this.oNavigationContainerInvisible.getAvailableActions().length, 3);
				assert.equal(this.oNavigationContainerInvisible.getAvailableActions()[0].getText(), this._aLinksInvisible[0].text);
				assert.equal(this.oNavigationContainerInvisible.getAvailableActions()[0].getVisible(), false);
				assert.equal(this.oNavigationContainerInvisible.getAvailableActions()[1].getText(), this._aLinksInvisible[1].text);
				assert.equal(this.oNavigationContainerInvisible.getAvailableActions()[1].getVisible(), false);
				assert.equal(this.oNavigationContainerInvisible.getAvailableActions()[2].getText(), this._aLinksInvisible[2].text);
				assert.equal(this.oNavigationContainerInvisible.getAvailableActions()[2].getVisible(), false);

				assert.equal(this.oNavigationContainerInvisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions").length, 3);
				assert.equal(this.oNavigationContainerInvisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/text"), this._aLinksInvisible[0].text);
				assert.equal(this.oNavigationContainerInvisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/visible"), false);
				assert.equal(this.oNavigationContainerInvisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/text"), this._aLinksInvisible[1].text);
				assert.equal(this.oNavigationContainerInvisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/visible"), false);
				assert.equal(this.oNavigationContainerInvisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/text"), this._aLinksInvisible[2].text);
				assert.equal(this.oNavigationContainerInvisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/visible"), false);
				done();
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("applyChange: all invisible -> set first visible", function(assert) {
		var done = assert.async();
		return ChangesWriteAPI.create({
			changeSpecificData: {
				changeType: "addLink",
				content: {
					key: this._aLinksInvisible[0].key,
					visible: true
				}
			},
			selector: this.oNavigationContainerInvisible
		}).then(function(oChange) {
			LinkFlex.applyChange(oChange, this.oNavigationContainerInvisible, {
				modifier: JsControlTreeModifier
			}).then(function() {
				assert.equal(this.oNavigationContainerInvisible.getAvailableActions().length, 3, "Correct amount of available actions");
				assert.equal(this.oNavigationContainerInvisible.getAvailableActions()[0].getText(), this._aLinksInvisible[0].text);
				assert.equal(this.oNavigationContainerInvisible.getAvailableActions()[0].getVisible(), true);
				assert.equal(this.oNavigationContainerInvisible.getAvailableActions()[1].getText(), this._aLinksInvisible[1].text);
				assert.equal(this.oNavigationContainerInvisible.getAvailableActions()[1].getVisible(), false);
				assert.equal(this.oNavigationContainerInvisible.getAvailableActions()[2].getText(), this._aLinksInvisible[2].text);
				assert.equal(this.oNavigationContainerInvisible.getAvailableActions()[2].getVisible(), false);

				assert.equal(this.oNavigationContainerInvisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions").length, 3);
				assert.equal(this.oNavigationContainerInvisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/text"), this._aLinksInvisible[0].text);
				assert.equal(this.oNavigationContainerInvisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/visible"), true);
				assert.equal(this.oNavigationContainerInvisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/text"), this._aLinksInvisible[1].text);
				assert.equal(this.oNavigationContainerInvisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/visible"), false);
				assert.equal(this.oNavigationContainerInvisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/text"), this._aLinksInvisible[2].text);
				assert.equal(this.oNavigationContainerInvisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/visible"), false);
				done();
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("applyChange: all visible -> set first visible", function(assert) {
		var done = assert.async();
		return ChangesWriteAPI.create({
			changeSpecificData: {
				changeType: "addLink",
				content: {
					key: this._aLinksVisible[0].key,
					visible: true
				}
			},
			selector: this.oNavigationContainerVisible
		}).then(function(oChange) {
			LinkFlex.applyChange(oChange, this.oNavigationContainerVisible, {
				modifier: JsControlTreeModifier
			}).then(function() {
				assert.equal(this.oNavigationContainerVisible.getAvailableActions().length, 3);
				assert.equal(this.oNavigationContainerVisible.getAvailableActions()[0].getText(), this._aLinksVisible[0].text);
				assert.equal(this.oNavigationContainerVisible.getAvailableActions()[0].getVisible(), true);
				assert.equal(this.oNavigationContainerVisible.getAvailableActions()[1].getText(), this._aLinksVisible[1].text);
				assert.equal(this.oNavigationContainerVisible.getAvailableActions()[1].getVisible(), true);
				assert.equal(this.oNavigationContainerVisible.getAvailableActions()[2].getText(), this._aLinksVisible[2].text);
				assert.equal(this.oNavigationContainerVisible.getAvailableActions()[2].getVisible(), true);

				assert.equal(this.oNavigationContainerVisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions").length, 3);
				assert.equal(this.oNavigationContainerVisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/text"), this._aLinksVisible[0].text);
				assert.equal(this.oNavigationContainerVisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/visible"), true);
				assert.equal(this.oNavigationContainerVisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/text"), this._aLinksVisible[1].text);
				assert.equal(this.oNavigationContainerVisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/visible"), true);
				assert.equal(this.oNavigationContainerVisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/text"), this._aLinksVisible[2].text);
				assert.equal(this.oNavigationContainerVisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/visible"), true);
				done();
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("completeChangeContent: positive case", function(assert) {
		return ChangesWriteAPI.create({
			changeSpecificData: {
				changeType: "addLink",
				content: {
					key: "key01",
					visible: true
				}
			},
			selector: this.oNavigationContainerVisible
		}).then(function(oChange) {
			assert.equal(oChange.getContent().key, "key01");
			assert.equal(oChange.getContent().visible, true);
		});
	});

	QUnit.test("completeChangeContent: negative cases", function(assert) {
		return ChangesWriteAPI.create({
			changeSpecificData: {
				changeType: "addLink",
				content: {
					dummy: {}
				}
			},
			selector: this.oNavigationContainerVisible
		})
		.catch(function(oError) {
			assert.equal(oError.message, "In oSpecificChangeInfo.content.key attribute is required", "an error was thrown");

			return ChangesWriteAPI.create({
				changeSpecificData: {
					changeType: "addLink",
					content: {
						key: "key01",
						value: undefined
					}
				},
				selector: this.oNavigationContainerVisible
			});
		}.bind(this))
		.catch(function(oError) {
			assert.equal(oError.message, "In oSpecificChangeInfo.content.visible attribute should be 'true'", "an error was thrown");

			return ChangesWriteAPI.create({
				changeSpecificData: {
					changeType: "addLink",
					content: {
						key: "key01",
						visible: false
					}
				},
				selector: this.oNavigationContainerVisible
			});
		}.bind(this))
		.catch(function(oError) {
			assert.equal(oError.message, "In oSpecificChangeInfo.content.visible attribute should be 'true'", "an error was thrown");

			return ChangesWriteAPI.create({
				changeSpecificData: {
					changeType: "addLink",
					content: {}
				},
				selector: this.oNavigationContainerVisible
			});
		}.bind(this))
		.catch(function(oError) {
			assert.equal(oError.message, "oSpecificChangeInfo.content should be filled", "an error was thrown");
		});
	});

	QUnit.module("sap.ui.comp.navpopover.NavigationContainer - removeLink", {
		beforeEach: function() {
			this._aLinksInvisible = [
				{
					key: "action1",
					href: "?TestObject#/dummyLink1",
					text: "Link1",
					visible: false
				}, {
					key: "action2",
					href: "?TestObject#/dummyLink2",
					text: "Link2",
					visible: false
				}, {
					key: "action3",
					href: "?TestObject#/dummyLink3",
					text: "Link3",
					visible: false
				}
			];
			this._aLinksVisible = [
				{
					key: "action1",
					href: "?TestObject#/dummyLink1",
					text: "Link1",
					visible: true
				}, {
					key: "action2",
					href: "?TestObject#/dummyLink2",
					text: "Link2",
					visible: true
				}, {
					key: "action3",
					href: "?TestObject#/dummyLink3",
					text: "Link3",
					visible: true
				}
			];
			this.oNavigationContainerInvisible = new NavigationContainer("IDNavigationContainer1", {
				availableActions: this._aLinksInvisible.map(function(oMLink) {
					return new LinkData({
						key: oMLink.key,
						href: oMLink.href,
						text: oMLink.text,
						visible: oMLink.visible
					});
				})
			});
			this.oNavigationContainerVisible = new NavigationContainer("IDNavigationContainer2", {
				availableActions: this._aLinksVisible.map(function(oMLink) {
					return new LinkData({
						key: oMLink.key,
						href: oMLink.href,
						text: oMLink.text,
						visible: oMLink.visible
					});
				})
			});
			sandbox.stub(FlUtils, "getAppComponentForControl").returns(new UIComponent());
		},
		afterEach: function() {
			sandbox.restore();
			this.oNavigationContainerVisible.destroy();
			this.oNavigationContainerInvisible.destroy();
		}
	});

	QUnit.test("applyChange: all visible -> apply corrupt change", function(assert) {
		var done = assert.async();
		return ChangesWriteAPI.create({
			changeSpecificData: {
				changeType: "removeLink",
				content: {
					key: "dummy",
					visible: false
				}
			},
			selector: this.oNavigationContainerVisible
		}).then(function(oChange) {
			delete oChange.setContent({});
			LinkFlex.applyChange(oChange, this.oNavigationContainerVisible, {
				modifier: JsControlTreeModifier
			}).catch(function(sError) {
				assert.equal(sError, "Change does not contain sufficient information to be applied", "Correct rejection message returned for corrupt change.");
				assert.equal(this.oNavigationContainerVisible.getAvailableActions().length, 3);
				assert.equal(this.oNavigationContainerVisible.getAvailableActions()[0].getText(), this._aLinksVisible[0].text);
				assert.equal(this.oNavigationContainerVisible.getAvailableActions()[0].getVisible(), true);
				assert.equal(this.oNavigationContainerVisible.getAvailableActions()[1].getText(), this._aLinksVisible[1].text);
				assert.equal(this.oNavigationContainerVisible.getAvailableActions()[1].getVisible(), true);
				assert.equal(this.oNavigationContainerVisible.getAvailableActions()[2].getText(), this._aLinksVisible[2].text);
				assert.equal(this.oNavigationContainerVisible.getAvailableActions()[2].getVisible(), true);

				assert.equal(this.oNavigationContainerVisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions").length, 3);
				assert.equal(this.oNavigationContainerVisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/text"), this._aLinksVisible[0].text);
				assert.equal(this.oNavigationContainerVisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/visible"), true);
				assert.equal(this.oNavigationContainerVisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/text"), this._aLinksVisible[1].text);
				assert.equal(this.oNavigationContainerVisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/visible"), true);
				assert.equal(this.oNavigationContainerVisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/text"), this._aLinksVisible[2].text);
				assert.equal(this.oNavigationContainerVisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/visible"), true);
				done();
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("applyChange: all visible -> set 'dummy' invisible", function(assert) {
		var done = assert.async();
		return ChangesWriteAPI.create({
			changeSpecificData: {
				changeType: "removeLink",
				content: {
					key: "dummy",
					visible: false
				}
			},
			selector: this.oNavigationContainerVisible
		}).then(function(oChange) {
			LinkFlex.applyChange(oChange, this.oNavigationContainerVisible, {
				modifier: JsControlTreeModifier
			}).catch(function(sError) {
				assert.equal(sError, "Item with key dummy not found in the availableAction aggregation", "Correct rejection message returned for wrong key");
				assert.equal(this.oNavigationContainerVisible.getAvailableActions().length, 3);
				assert.equal(this.oNavigationContainerVisible.getAvailableActions()[0].getText(), this._aLinksVisible[0].text);
				assert.equal(this.oNavigationContainerVisible.getAvailableActions()[0].getVisible(), true);
				assert.equal(this.oNavigationContainerVisible.getAvailableActions()[1].getText(), this._aLinksVisible[1].text);
				assert.equal(this.oNavigationContainerVisible.getAvailableActions()[1].getVisible(), true);
				assert.equal(this.oNavigationContainerVisible.getAvailableActions()[2].getText(), this._aLinksVisible[2].text);
				assert.equal(this.oNavigationContainerVisible.getAvailableActions()[2].getVisible(), true);

				assert.equal(this.oNavigationContainerVisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions").length, 3);
				assert.equal(this.oNavigationContainerVisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/text"), this._aLinksVisible[0].text);
				assert.equal(this.oNavigationContainerVisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/visible"), true);
				assert.equal(this.oNavigationContainerVisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/text"), this._aLinksVisible[1].text);
				assert.equal(this.oNavigationContainerVisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/visible"), true);
				assert.equal(this.oNavigationContainerVisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/text"), this._aLinksVisible[2].text);
				assert.equal(this.oNavigationContainerVisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/visible"), true);
				done();
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("applyChange: all visible -> set first invisible", function(assert) {
		var done = assert.async();
		return ChangesWriteAPI.create({
			changeSpecificData: {
				changeType: "removeLink",
				content: {
					key: this._aLinksVisible[0].key,
					visible: false
				}
			},
			selector: this.oNavigationContainerVisible
		}).then(function(oChange) {
			LinkFlex.applyChange(oChange, this.oNavigationContainerVisible, {
				modifier: JsControlTreeModifier
			}).then(function() {
				assert.equal(this.oNavigationContainerVisible.getAvailableActions().length, 3);
				assert.equal(this.oNavigationContainerVisible.getAvailableActions()[0].getText(), this._aLinksVisible[0].text);
				assert.equal(this.oNavigationContainerVisible.getAvailableActions()[0].getVisible(), false);
				assert.equal(this.oNavigationContainerVisible.getAvailableActions()[1].getText(), this._aLinksVisible[1].text);
				assert.equal(this.oNavigationContainerVisible.getAvailableActions()[1].getVisible(), true);
				assert.equal(this.oNavigationContainerVisible.getAvailableActions()[2].getText(), this._aLinksVisible[2].text);
				assert.equal(this.oNavigationContainerVisible.getAvailableActions()[2].getVisible(), true);

				assert.equal(this.oNavigationContainerVisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions").length, 3);
				assert.equal(this.oNavigationContainerVisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/text"), this._aLinksVisible[0].text);
				assert.equal(this.oNavigationContainerVisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/visible"), false);
				assert.equal(this.oNavigationContainerVisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/text"), this._aLinksVisible[1].text);
				assert.equal(this.oNavigationContainerVisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/visible"), true);
				assert.equal(this.oNavigationContainerVisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/text"), this._aLinksVisible[2].text);
				assert.equal(this.oNavigationContainerVisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/visible"), true);
				done();
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("applyChange: all invisible -> set all invisible", function(assert) {
		var done = assert.async();
		return ChangesWriteAPI.create({
			changeSpecificData: {
				changeType: "removeLink",
				content: {
					key: this._aLinksInvisible[0].key,
					visible: false
				}
			},
			selector: this.oNavigationContainerInvisible
		}).then(function(oChange) {
			LinkFlex.applyChange(oChange, this.oNavigationContainerInvisible, {
				modifier: JsControlTreeModifier
			}).then(function() {
				assert.equal(this.oNavigationContainerInvisible.getAvailableActions().length, 3);
				assert.equal(this.oNavigationContainerInvisible.getAvailableActions()[0].getText(), this._aLinksInvisible[0].text);
				assert.equal(this.oNavigationContainerInvisible.getAvailableActions()[0].getVisible(), false);
				assert.equal(this.oNavigationContainerInvisible.getAvailableActions()[1].getText(), this._aLinksInvisible[1].text);
				assert.equal(this.oNavigationContainerInvisible.getAvailableActions()[1].getVisible(), false);
				assert.equal(this.oNavigationContainerInvisible.getAvailableActions()[2].getText(), this._aLinksInvisible[2].text);
				assert.equal(this.oNavigationContainerInvisible.getAvailableActions()[2].getVisible(), false);

				assert.equal(this.oNavigationContainerInvisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions").length, 3);
				assert.equal(this.oNavigationContainerInvisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/text"), this._aLinksInvisible[0].text);
				assert.equal(this.oNavigationContainerInvisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/visible"), false);
				assert.equal(this.oNavigationContainerInvisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/text"), this._aLinksInvisible[1].text);
				assert.equal(this.oNavigationContainerInvisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/visible"), false);
				assert.equal(this.oNavigationContainerInvisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/text"), this._aLinksInvisible[2].text);
				assert.equal(this.oNavigationContainerInvisible.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/visible"), false);
				done();
			}.bind(this));
		}.bind(this));
	});

	QUnit.test("completeChangeContent: positive case", function(assert) {
		return ChangesWriteAPI.create({
			changeSpecificData: {
				changeType: "removeLink",
				content: {
					key: "key01",
					visible: false
				}
			},
			selector: this.oNavigationContainerVisible
		}).then(function(oChange) {
			assert.equal(oChange.getContent().key, "key01");
			assert.equal(oChange.getContent().visible, false);
		});
	});

	QUnit.test("completeChangeContent: negative cases", function(assert) {
		return ChangesWriteAPI.create({
			changeSpecificData: {
				changeType: "removeLink",
				content: {
					dummy: {}
				}
			},
			selector: this.oNavigationContainerVisible
		})
		.catch(function(oError) {
			assert.equal(oError.message, "In oSpecificChangeInfo.content.key attribute is required", "an error was thrown");

			return ChangesWriteAPI.create({
				changeSpecificData: {
					changeType: "removeLink",
					content: {
						key: "key01",
						value: undefined
					}
				},
				selector: this.oNavigationContainerVisible
			});
		}.bind(this))
		.catch(function(oError) {
			assert.equal(oError.message, "In oSpecificChangeInfo.content.visible attribute should be 'false'", "an error was thrown");

			return ChangesWriteAPI.create({
				changeSpecificData: {
					changeType: "removeLink",
					content: {
						key: "key01",
						visible: true
					}
				},
				selector: this.oNavigationContainerVisible
			});
		}.bind(this))
		.catch(function(oError) {
			assert.equal(oError.message, "In oSpecificChangeInfo.content.visible attribute should be 'false'", "an error was thrown");

			return ChangesWriteAPI.create({
				changeSpecificData: {
					changeType: "removeLink",
					content: {}
				},
				selector: this.oNavigationContainerVisible
			});
		}.bind(this))
		.catch(function(oError) {
			assert.equal(oError.message, "oSpecificChangeInfo.content should be filled", "an error was thrown");
		});
	});

	QUnit.module("sap.ui.comp.navpopover.NavigationContainer - mixed addLink and removeLink", {
		beforeEach: function() {
			// âêûîô
			sandbox.stub(FlUtils, "getAppComponentForControl").returns(new UIComponent());
		},
		afterEach: function() {
			sandbox.restore();
		}
	});

	QUnit.test("applyChange: Â, E, Û, O -> A, Ê, U, Ô", function(assert) {
		var done = assert.async();
		var aLinks = [
			{
				key: "actionA",
				href: "?TestObject#/A",
				text: "A",
				visible: false
			}, {
				key: "actionE",
				href: "?TestObject#/E",
				text: "E",
				visible: true
			}, {
				key: "actionU",
				href: "?TestObject#/U",
				text: "U",
				visible: false
			}, {
				key: "actionO",
				href: "?TestObject#/O",
				text: "O",
				visible: true
			}
		];
		var oNavigationContainer = new NavigationContainer("IDNavigationContainer", {
			availableActions: aLinks.map(function(oMLink) {
				//Â, Ê, Û, Ô
				return new LinkData({
					key: oMLink.key,
					href: oMLink.href,
					text: oMLink.text,
					visible: oMLink.visible
				});
			})
		});

		return Promise.all([
			ChangesWriteAPI.create({
				changeSpecificData: {
					changeType: "addLink",
					content: {
						key: aLinks[0].key,
						visible: true
					}
				},
				selector: oNavigationContainer
			}),
			ChangesWriteAPI.create({
				changeSpecificData: {
					changeType: "addLink",
					content: {
						key: aLinks[2].key,
						visible: true
					}
				},
				selector: oNavigationContainer
			}),
			ChangesWriteAPI.create({
				changeSpecificData: {
					changeType: "removeLink",
					content: {
						key: aLinks[1].key,
						visible: false
					}
				},
				selector: oNavigationContainer
			}),
			ChangesWriteAPI.create({
				changeSpecificData: {
					changeType: "removeLink",
					content: {
						key: aLinks[3].key,
						visible: false
					}
				},
				selector: oNavigationContainer
			})
		]).then(function(aChanges) {
			Promise.all([
				LinkFlex.applyChange(aChanges[0], oNavigationContainer, {
					modifier: JsControlTreeModifier
				}),
				LinkFlex.applyChange(aChanges[2], oNavigationContainer, {
					modifier: JsControlTreeModifier
				}),
				LinkFlex.applyChange(aChanges[1], oNavigationContainer, {
					modifier: JsControlTreeModifier
				}),
				LinkFlex.applyChange(aChanges[3], oNavigationContainer, {
					modifier: JsControlTreeModifier
				})
			]).then(function() {
				assert.equal(oNavigationContainer.getAvailableActions().length, 4);
				assert.equal(oNavigationContainer.getAvailableActions()[0].getText(), aLinks[0].text);
				assert.equal(oNavigationContainer.getAvailableActions()[0].getVisible(), true);
				assert.equal(oNavigationContainer.getAvailableActions()[1].getText(), aLinks[1].text);
				assert.equal(oNavigationContainer.getAvailableActions()[1].getVisible(), false);
				assert.equal(oNavigationContainer.getAvailableActions()[2].getText(), aLinks[2].text);
				assert.equal(oNavigationContainer.getAvailableActions()[2].getVisible(), true);
				assert.equal(oNavigationContainer.getAvailableActions()[3].getText(), aLinks[3].text);
				assert.equal(oNavigationContainer.getAvailableActions()[3].getVisible(), false);

				assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions").length, 4);
				assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/text"), aLinks[0].text);
				assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/visible"), true);
				assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/text"), aLinks[1].text);
				assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/visible"), false);
				assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/text"), aLinks[2].text);
				assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/visible"), true);
				assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/3/text"), aLinks[3].text);
				assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/3/visible"), false);

				oNavigationContainer.destroy();
				done();
			});
		});
	});

	QUnit.test("applyChange: Â, Ê, Û, Ô -> Â, E, Û, O -> A, Ê, U, Ô", function(assert) {
		var done = assert.async();
		var aLinks = [
			{
				key: "actionA",
				href: "?TestObject#/A",
				text: "A",
				visible: false
			}, {
				key: "actionE",
				href: "?TestObject#/E",
				text: "E",
				visible: false
			}, {
				key: "actionU",
				href: "?TestObject#/U",
				text: "U",
				visible: false
			}, {
				key: "actionO",
				href: "?TestObject#/O",
				text: "O",
				visible: false
			}
		];
		var oNavigationContainer = new NavigationContainer("IDNavigationContainer", {
			availableActions: aLinks.map(function(oMLink) {
				//Â, Ê, Û, Ô
				return new LinkData({
					key: oMLink.key,
					href: oMLink.href,
					text: oMLink.text,
					visible: oMLink.visible
				});
			})
		});

		return Promise.all([
			ChangesWriteAPI.create({
				changeSpecificData: {
					changeType: "addLink",
					content: {
						key: aLinks[1].key,
						visible: true
					}
				},
				selector: oNavigationContainer
			}),
			ChangesWriteAPI.create({
				changeSpecificData: {
					changeType: "addLink",
					content: {
						key: aLinks[3].key,
						visible: true
					}
				},
				selector: oNavigationContainer
			}),
			ChangesWriteAPI.create({
				changeSpecificData: {
					changeType: "addLink",
					content: {
						key: aLinks[0].key,
						visible: true
					}
				},
				selector: oNavigationContainer
			}),
			ChangesWriteAPI.create({
				changeSpecificData: {
					changeType: "removeLink",
					content: {
						key: aLinks[1].key,
						visible: false
					}
				},
				selector: oNavigationContainer
			}),
			ChangesWriteAPI.create({
				changeSpecificData: {
					changeType: "addLink",
					content: {
						key: aLinks[2].key,
						visible: true
					}
				},
				selector: oNavigationContainer
			}),
			ChangesWriteAPI.create({
				changeSpecificData: {
					changeType: "removeLink",
					content: {
						key: aLinks[3].key,
						visible: false
					}
				},
				selector: oNavigationContainer
			})
		]).then(function(aChanges) {
			Promise.all([
				LinkFlex.applyChange(aChanges[0], oNavigationContainer, {
					modifier: JsControlTreeModifier
				}),
				LinkFlex.applyChange(aChanges[1], oNavigationContainer, {
					modifier: JsControlTreeModifier
				}),
				LinkFlex.applyChange(aChanges[2], oNavigationContainer, {
					modifier: JsControlTreeModifier
				}),
				LinkFlex.applyChange(aChanges[3], oNavigationContainer, {
					modifier: JsControlTreeModifier
				}),
				LinkFlex.applyChange(aChanges[4], oNavigationContainer, {
					modifier: JsControlTreeModifier
				}),
				LinkFlex.applyChange(aChanges[5], oNavigationContainer, {
					modifier: JsControlTreeModifier
				})
			]).then(function() {
				assert.equal(oNavigationContainer.getAvailableActions().length, 4);
				assert.equal(oNavigationContainer.getAvailableActions()[0].getText(), aLinks[0].text);
				assert.equal(oNavigationContainer.getAvailableActions()[0].getVisible(), true);
				assert.equal(oNavigationContainer.getAvailableActions()[1].getText(), aLinks[1].text);
				assert.equal(oNavigationContainer.getAvailableActions()[1].getVisible(), false);
				assert.equal(oNavigationContainer.getAvailableActions()[2].getText(), aLinks[2].text);
				assert.equal(oNavigationContainer.getAvailableActions()[2].getVisible(), true);
				assert.equal(oNavigationContainer.getAvailableActions()[3].getText(), aLinks[3].text);
				assert.equal(oNavigationContainer.getAvailableActions()[3].getVisible(), false);

				assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions").length, 4);
				assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/text"), aLinks[0].text);
				assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/visible"), true);
				assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/text"), aLinks[1].text);
				assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/visible"), false);
				assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/text"), aLinks[2].text);
				assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/visible"), true);
				assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/3/text"), aLinks[3].text);
				assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/3/visible"), false);

				oNavigationContainer.destroy();
				done();
			});
		});
	});

	QUnit.start();
});
