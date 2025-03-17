/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
sap.ui.define([
	"sap/apf/modeler/core/elementContainer",
	"sap/apf/modeler/core/hierarchicalStep",
	"sap/apf/modeler/core/representation",
	"sap/apf/modeler/core/step",
	"sap/apf/testhelper/doubles/messageHandler",
	"sap/apf/utils/hashtable",
	"sap/ui/thirdparty/jquery"
], function (
	ElementContainer,
	HierarchicalStep,
	Representation,
	Step,
	MessageHandlerDouble,
	Hashtable,
	jQuery
) {
	"use strict";

	function commonSetup() {
		this.messageHandler = new MessageHandlerDouble().raiseOnCheck().spyPutMessage();
		this.inject = {
			instances: {
				messageHandler: this.messageHandler,
				metadataFactory: {
					getMetadata: function (service) {
						if (service === "service") {
							return jQuery.Deferred().resolve({
								getPropertyMetadata: function (entitySet, property) {
									if (entitySet) {
										if (property === "MeasureInMetadataAndAsSelectProperty" || property === "MeasureNotSelected") {
											return {
												"aggregation-role": "measure"
											};
										}
										return {};
									}
								},
								getAllPropertiesOfEntitySet: function (entitySet) {
									if (entitySet) {
										return ["PropertyNotSelected", "MeasureNotSelected", "MeasureInMetadataAndAsSelectProperty",
											"PropertyInMetadataAndAsSelectProperty"
										];
									}
								}
							});
						}
						return jQuery.Deferred().reject();
					}
				}
			},
			constructors: {
				Hashtable: Hashtable,
				Step: Step,
				ElementContainer: ElementContainer,
				Representation: Representation
			}
		};
		this.hStep = new HierarchicalStep('xyz', this.inject);
	}
	QUnit.module('Hierarchical Step Class', {
		beforeEach: function () {
			commonSetup.call(this);
		}
	});
	QUnit.test('getType', function (assert) {
		assert.strictEqual(this.hStep.getType(), "hierarchicalStep", "Correct type returned");
	});
	QUnit.test('Extends sap.apf.modeler.step', function (assert) {
		assert.strictEqual(this.hStep.getId(), 'xyz', "Correct Id returned via extended object");
	});
	QUnit.test('Set hierarchyProperty to representation', function (assert) {
		this.hStep.setHierarchyProperty("hierarchyProeprty");
		var representation = this.hStep.createRepresentation();
		assert.strictEqual(representation.getHierarchyProperty(), this.hStep.getHierarchyProperty(),
			"HierarchyProperty written to representation while creating representation");
		this.hStep.setHierarchyProperty("hierarchyProeprty2");
		assert.strictEqual(representation.getHierarchyProperty(), this.hStep.getHierarchyProperty(),
			"HierarchyProperty written to representation when changed on step level");
	});
	QUnit.test('Copy Hierarchical step', function (assert) {
		this.hStep.setTitleId("123");
		this.hStep.createRepresentation();
		this.hStep.setHierarchyProperty("hierarchyProperty");
		var hStep2 = this.hStep.copy();
		assert.strictEqual(hStep2.getType(), 'hierarchicalStep', "Copied step is also a hierarchical step");
		assert.strictEqual(hStep2.getId(), this.hStep.getId(), "New hierarchical step gets the same Id");
		assert.strictEqual(hStep2.getTitleId(), this.hStep.getTitleId(), "Normal step property is copied");
		assert.strictEqual(hStep2.getRepresentations().length, 1, "Representation copied");
		assert.strictEqual(hStep2.getHierarchyProperty(), this.hStep.getHierarchyProperty(), "Representation copied");
	});
	QUnit.module('Get consumable properties for representation sort properties', {
		beforeEach: function () {
			commonSetup.call(this);
			this.hStep.setService("service");
			this.hStep.setEntitySet("entitySet");
			this.hStep.addSelectProperty("PropertyNotInMetadata");
			this.hStep.addSelectProperty("PropertyInMetadataAndAsSelectProperty");
			this.hStep.addSelectProperty("MeasureNotInMetadata");
			this.hStep.addSelectProperty("MeasureInMetadataAndAsSelectProperty");
			this.representation = this.hStep.createRepresentation();
			this.representation.setRepresentationType("TreeTableRepresentation");
		}
	});
	QUnit.test("No Service entered", function (assert) {
		const done = assert.async();

		this.hStep.setService("");
		this.hStep.setEntitySet("");
		var expected = {
			available: [],
			consumable: []
		};
		this.hStep.getConsumableSortPropertiesForRepresentation(this.representation.getId()).done(function (result) {
			assert.deepEqual(result, expected, "Expected available and consumable properties returned");
			done();
		});
	});
	QUnit.test("Service not available", function (assert) {
		const done = assert.async();

		this.hStep.setService("ServiceNotAvailable");
		var expected = {
			available: [],
			consumable: []
		};
		this.hStep.getConsumableSortPropertiesForRepresentation(this.representation.getId()).done(function (result) {
			assert.deepEqual(result, expected, "Expected available and consumable properties returned");
			done();
		});
	});
	QUnit.test("No Properties already used", function (assert) {
		const done = assert.async();

		var expected = {
			available: ["MeasureInMetadataAndAsSelectProperty"],
			consumable: ["MeasureInMetadataAndAsSelectProperty"]
		};
		this.hStep.getConsumableSortPropertiesForRepresentation(this.representation.getId()).done(function (result) {
			assert.deepEqual(result, expected, "Expected available and consumable properties returned");
			done();
		});
	});
	QUnit.test("Already used measure", function (assert) {
		const done = assert.async();

		this.representation.addOrderbySpec("MeasureInMetadataAndAsSelectProperty", true);
		var expected = {
			available: ["MeasureInMetadataAndAsSelectProperty"],
			consumable: []
		};
		this.hStep.getConsumableSortPropertiesForRepresentation(this.representation.getId()).done(function (result) {
			assert.deepEqual(result, expected, "Expected available and consumable properties returned");
			done();
		});
	});
	QUnit.test("Already used measure is not in Metadata", function (assert) {
		const done = assert.async();

		this.representation.addOrderbySpec("MeasureNotInMetadata", true);
		var expected = {
			available: ["MeasureInMetadataAndAsSelectProperty"],
			consumable: ["MeasureInMetadataAndAsSelectProperty"]
		};
		this.hStep.getConsumableSortPropertiesForRepresentation(this.representation.getId()).done(function (result) {
			assert.deepEqual(result, expected, "Expected available and consumable properties returned");
			done();
		});
	});
	QUnit.test("Already used measure is not a selected property", function (assert) {
		const done = assert.async();

		this.representation.addOrderbySpec("MeasureNotSelected", true);
		var expected = {
			available: ["MeasureInMetadataAndAsSelectProperty"],
			consumable: ["MeasureInMetadataAndAsSelectProperty"]
		};
		this.hStep.getConsumableSortPropertiesForRepresentation(this.representation.getId()).done(function (result) {
			assert.deepEqual(result, expected, "Expected available and consumable properties returned");
			done();
		});
	});
});
