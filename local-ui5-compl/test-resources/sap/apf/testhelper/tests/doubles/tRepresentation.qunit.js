sap.ui.define([
	"sap/apf/core/constants",
	"sap/apf/testhelper/doubles/apfApi",
	"sap/apf/testhelper/doubles/coreApi",
	"sap/apf/testhelper/doubles/messageHandler",
	"sap/apf/testhelper/doubles/Representation"
], function(
	CoreConstants,
	ApfApiDouble,
	CoreApiDouble,
	MessageHandlerDouble,
	RepresentationDouble
) {
	"use strict";

	const { SelectionStrategy } = RepresentationDouble;

	QUnit.module('Representation Double', {
		beforeEach : function(assert) {
			var oMessageHandler = new MessageHandlerDouble().doubleCheckAndMessaging();
			var oCoreApi =  new CoreApiDouble({
				instances: {
					messageHandler : oMessageHandler
				}
			}).doubleMessaging();
			this.oApi = new ApfApiDouble({
				instances: {
					coreApi : oCoreApi,
					messageHandler : oMessageHandler
				}
			}).doubleStandardMethods();
		},
		createThreeSelections : function() {
			var data = [ 'data1', 'data2', 'data3' ];
			var representation = new RepresentationDouble(this.oApi , {
				id : 'threeSelections',
				sRepresentationType : 'RepresentationTestDouble'
			});
			representation.setData(data);
			representation.emulateSelectionStrategy(SelectionStrategy.all);
			return representation;
		},
		createFiveSelections : function() {
			var data = [ 'data1', 'data2', 'data3', 'data4', 'data5' ];
			var representation = new RepresentationDouble(this.oApi, {
				id : 'threeSelections',
				sRepresentationType : 'RepresentationTestDouble'
			});
			representation.setData(data);
			representation.emulateSelectionStrategy(SelectionStrategy.all);
			return representation;
		}
	});
	QUnit.test('Get objects that have been set by setData()-method', function(assert) {
		var oDouble = new RepresentationDouble(this.oApi, {
			id : 'double1',
			sRepresentationType : 'RepresentationTestDouble'
		});
		oDouble.setData({}, {
			metadataDouble : 'metadatadouble'
		});
		assert.equal(oDouble.getParametersOfSetData().metadata.metadataDouble, 'metadatadouble', 'Metadata instance expected');
	});
	QUnit.test('Emulate filter method type start filter', function(assert) {
		var oDouble = new RepresentationDouble(this.oApi, {
			id : 'double1',
			sRepresentationType : 'RepresentationTestDouble'
		});
		oDouble.emulateFilterMethodType(CoreConstants.filterMethodTypes.selectionAsArray);
		assert.equal(oDouble.getFilterMethodType(), 'saa', 'Emulated filter method type expected');
	});
	QUnit.test('Selection adoption in target representation succeeds', function(assert) {
		var oSource = this.createThreeSelections();
		var oTarget = this.createFiveSelections();	

		oTarget.emulateSelectionAdoptionSuccessful();
		oTarget.adoptSelection(oSource);

		assert.deepEqual(oTarget.getSelectionAsArray().length, 3, 'Adoption of selection from source representation expected');
	});
	QUnit.test('Selection adoption in target representation fails', function(assert) {
		var oSource = this.createThreeSelections();
		var oTarget = this.createFiveSelections();	

		oTarget.emulateSelectionAdoptionFailed();
		oTarget.adoptSelection(oSource);

		assert.deepEqual(oTarget.getSelectionAsArray().length, 5, 'No adoption of selection from source representation expected');
	});
	QUnit.test('Serialize / deserialize of Representation', function(assert) {
		var oRepresentation = this.createThreeSelections();
		var aSelections = oRepresentation.getSelectionAsArray();
		var oSerializableRepresentation = oRepresentation.serialize();
		assert.ok(oSerializableRepresentation.indicesOfSelectedData.length === 3, "Serializable representation object has three selections"); 

		var oNewRepresentation = new RepresentationDouble(this.oApi, {
			id : 'threeSelections',
			sRepresentationType : 'RepresentationTestDouble'
		});
		oNewRepresentation.deserialize(oSerializableRepresentation);
		assert.deepEqual(aSelections, oNewRepresentation.getSelectionAsArray(), "Representation has same selection after deserialization");
	});
});
