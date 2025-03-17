/* global QUnit */
sap.ui.define([
	"sap/ui/comp/util/SharedUtil",
	"sap/m/Link",
	"sap/ui/model/odata/v2/Context",
	"sap/ui/core/mvc/View"
], function(SharedUtil, Link, Context, View) {
	"use strict";

	QUnit.test("applyFieldGroupIDs should set an unique field group id on sap.m control based on a metadata SideEffects annotation", function (assert) {
		var oControl = new Link(),
			oView = new View(),
			aFieldGroupIds,
			oMetadata = {
				"path": "Name",
				"entitySet": {
					"name": "Employees",
					"entityType": "EmployeesNamespace.Employee",
					"sap:creatable": "false",
					"sap:updatable": "true",
					"sap:deletable": "true",
					"sap:content-version": "1"
				},
				"entityType": {
					"name": "Employee",
					"key": {
						"propertyRef": [
							{
								"name": "Id"
							}
						]
					},
					"property": [
						{
							"name": "Id",
							"type": "Edm.String",
							"nullable": "false",
							"maxLength": "4",
							"sap:visible": "false",
							"sap:label": "Employee Id",
							"com.sap.vocabularies.Common.v1.Label": {
								"String": "Employee Id"
							},
							"sap:creatable": "false"
						},
						{
							"name": "Name",
							"type": "Edm.String",
							"nullable": "false",
							"sap:creatable": "false",
							"sap:updatable": "true",
							"sap:label": "Name (Have applied field group id on the inner control)",
							"com.sap.vocabularies.Common.v1.Label": {
								"String": "Name (Have applied field group id on the inner control)"
							}
						},
						{
							"name": "Surname",
							"type": "Edm.String",
							"nullable": "false",
							"sap:creatable": "false",
							"sap:updatable": "true",
							"sap:label": "Surname",
							"com.sap.vocabularies.Common.v1.Label": {
								"String": "Surname"
							}
						}
					],
					"sap:label": "Employees",
					"com.sap.vocabularies.Common.v1.Label": {
						"String": "Employees"
					},
					"sap:content-version": "1",
					"namespace": "EmployeesNamespace",
					"$path": "/dataServices/schema/0/entityType/0",
					"com.sap.vocabularies.Common.v1.SideEffects": {
						"SourceProperties": [
							{
								"PropertyPath": "Name"
							}
						],
						"TargetProperties": [
							{
								"PropertyPath": "Surname"
							}
						]
					}
				},
				"navigationPath": "",
				"property": {
					"property": {
						"name": "Name",
						"type": "Edm.String",
						"nullable": "false",
						"sap:creatable": "false",
						"sap:updatable": "true",
						"sap:label": "Name (Have applied field group id on the inner control)",
						"com.sap.vocabularies.Common.v1.Label": {
							"String": "Name (Have applied field group id on the inner control)"
						}
					},
					"typePath": "Name",
					"valueListAnnotation": null,
					"valueListKeyProperty": null,
					"valueListEntitySet": null,
					"valueListEntityType": null
				},
				"_isNumber": false
			};

		oControl.setBindingContext({getPath: function() { return "/Employees('0001')"; }});

		assert.deepEqual(oControl.getFieldGroupIds(), [], "The sap.m.Link control does not have any fieldGroupIds.");

		aFieldGroupIds = SharedUtil.applyFieldGroupIDs(oControl, oMetadata, oView);

		assert.deepEqual(oControl.getFieldGroupIds(), aFieldGroupIds, "The sap.m.Link control now have set field group id.");
		assert.deepEqual(oControl.getFieldGroupIds()[0], aFieldGroupIds[0], "The applied field group id is same as the returned one from applyFieldGroupIDs.");
	});

	QUnit.test("applyFieldGroupIDs should set an unique field group id on sap.m control based on a metadata SideEffects annotation and provided context", function (assert) {
		var oFirstControl = new Link(),
			oSecondControl = new Link(),
			oView = new View(),
			oBindingContext = new Context(null, "/Employees('0001')"),
			oMetadata = {
				"path": "Name",
				"entitySet": {
					"name": "Employees",
					"entityType": "EmployeesNamespace.Employee",
					"sap:creatable": "false",
					"sap:updatable": "true",
					"sap:deletable": "true",
					"sap:content-version": "1"
				},
				"entityType": {
					"name": "Employee",
					"key": {
						"propertyRef": [
							{
								"name": "Id"
							}
						]
					},
					"property": [
						{
							"name": "Id",
							"type": "Edm.String",
							"nullable": "false",
							"maxLength": "4",
							"sap:visible": "false",
							"sap:label": "Employee Id",
							"com.sap.vocabularies.Common.v1.Label": {
								"String": "Employee Id"
							},
							"sap:creatable": "false"
						},
						{
							"name": "Name",
							"type": "Edm.String",
							"nullable": "false",
							"sap:creatable": "false",
							"sap:updatable": "true",
							"sap:label": "Name (Have applied field group id on the inner control)",
							"com.sap.vocabularies.Common.v1.Label": {
								"String": "Name (Have applied field group id on the inner control)"
							}
						},
						{
							"name": "Surname",
							"type": "Edm.String",
							"nullable": "false",
							"sap:creatable": "false",
							"sap:updatable": "true",
							"sap:label": "Surname",
							"com.sap.vocabularies.Common.v1.Label": {
								"String": "Surname"
							}
						}
					],
					"sap:label": "Employees",
					"com.sap.vocabularies.Common.v1.Label": {
						"String": "Employees"
					},
					"sap:content-version": "1",
					"namespace": "EmployeesNamespace",
					"$path": "/dataServices/schema/0/entityType/0",
					"com.sap.vocabularies.Common.v1.SideEffects": {
						"SourceProperties": [
							{
								"PropertyPath": "Name"
							}
						],
						"TargetProperties": [
							{
								"PropertyPath": "Surname"
							}
						]
					}
				},
				"navigationPath": "",
				"property": {
					"property": {
						"name": "Name",
						"type": "Edm.String",
						"nullable": "false",
						"sap:creatable": "false",
						"sap:updatable": "true",
						"sap:label": "Name (Have applied field group id on the inner control)",
						"com.sap.vocabularies.Common.v1.Label": {
							"String": "Name (Have applied field group id on the inner control)"
						}
					},
					"typePath": "Name",
					"valueListAnnotation": null,
					"valueListKeyProperty": null,
					"valueListEntitySet": null,
					"valueListEntityType": null
				},
				"_isNumber": false
			};

		oFirstControl.setBindingContext({getPath: function() { return "/Employees('0001')"; }});

		SharedUtil.applyFieldGroupIDs(oFirstControl, oMetadata, oView);
		SharedUtil.applyFieldGroupIDs(oSecondControl, oMetadata, oView, oBindingContext);

		assert.deepEqual(oFirstControl.getFieldGroupIds(), oSecondControl.getFieldGroupIds(), "The sap.m.Link control now have set field group id.");
		assert.deepEqual(oFirstControl.getFieldGroupIds()[0], oSecondControl.getFieldGroupIds()[0], "The applied field group id is same as the returned one from applyFieldGroupIDs.");
	});
});
