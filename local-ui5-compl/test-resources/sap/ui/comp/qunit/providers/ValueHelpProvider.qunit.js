/* global QUnit, sinon */
sap.ui.define([
	"sap/ui/comp/valuehelpdialog/ValueHelpDialog",
	"sap/ui/comp/providers/ValueHelpProvider",
	"sap/ui/comp/smartfilterbar/SmartFilterBar",
	"sap/ui/comp/odata/MetadataAnalyser",
	"sap/m/MultiInput",
	"sap/m/Input",
	"sap/m/Text",
	"sap/m/Button",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/odata/ODataMetaModel",
	"sap/m/Table",
	"sap/ui/table/Table",
	"sap/ui/model/json/JSONModel",
	"sap/m/Token",
	"sap/ui/mdc/valuehelp/CollectiveSearchSelect"
], function(ValueHelpDialog, ValueHelpProvider, SmartFilterBar, MetadataAnalyser, MultiInput, Input, Text, Button, ODataModel, ODataMetaModel, MTable, Table, JSONModel, Token, CollectiveSearchSelect) {
	"use strict";

	var oValueHelpDialog = sinon.createStubInstance(ValueHelpDialog),
		o = sinon.stub(),
		oCollectiveSearchSelect = sinon.createStubInstance(CollectiveSearchSelect),
		oC = sinon.stub(),
		aValueHelpDialogRequiredClasses = [ValueHelpDialog, CollectiveSearchSelect];

	// redirect "isA" to the original implementation because it's needed by
	// ManagedObject.prototype.validateAggregation
	oValueHelpDialog.isA.callsFake(function() {
		return ValueHelpDialog.prototype.isA.apply(this, arguments);
	});

	// redirect "getMetadata" to the original implementation because it's needed by "isA"
	oValueHelpDialog.getMetadata.returns(ValueHelpDialog.getMetadata());

	o.returns(oValueHelpDialog);
	oC.returns(oCollectiveSearchSelect);

	QUnit.module("sap.ui.comp.providers.ValueHelpProvider", {
		beforeEach: function() {
			this.sTitle = "foo";
			this.oAnnotation = {
				valueListEntitySetName:"Chuck",
				keyField:"TheKey",
				descriptionField:"Desc",
				keys:["TheKey"],
				valueListFields:[{name:"TheKey"},
				{name:"Desc"}]
			};
			this.oModel = sinon.createStubInstance(ODataModel);
			this.oMetaModel = sinon.createStubInstance(ODataMetaModel);
			this.oMetaModel.loaded.returns(Promise.resolve());
			this.oModel.getMetaModel.returns(this.oMetaModel);

			var oMetadataAnalyserMock = {};
			oMetadataAnalyserMock.getFieldsByEntitySetName = function() {
				return [{name:"TheKey", sortable: true}];
			};
			this.oValueHelpProvider = new ValueHelpProvider({
					title: this.sTitle,
					control: sinon.createStubInstance(MultiInput),
					aggregation: "suggestionItems",
					annotation: this.oAnnotation,
					model:this.oModel,
					filterBarClass: SmartFilterBar
			});
			this.oValueHelpProvider._oValueHelpDialogClass = o;
			this.oValueHelpProvider._oCollectiveSearchSelectClass = oC;
		},
		afterEach: function() {
			this.oValueHelpProvider.destroy();
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oValueHelpProvider);
	});

	QUnit.test("Shall call attachValueHelpRequest once on instantiation", function(assert) {
		assert.strictEqual(this.oValueHelpProvider.oControl.attachValueHelpRequest.calledOnce,true);
		assert.strictEqual(this.oValueHelpProvider.sTitle,this.sTitle);
	});

	QUnit.test("Shall create an instance of ValueHelpDialog and on _createValueHelpDialog", function(assert) {
		var fnSpyOnValueHelpDialogRequired = sinon.spy(this.oValueHelpProvider, "_onValueHelpDialogRequired");

		this.oValueHelpProvider._createValueHelpDialog();
		assert.strictEqual(fnSpyOnValueHelpDialogRequired.calledOnce, true);
	});

	QUnit.test("Shall call _getEntitiesLazy if ValueHelp class is not already loaded", function(assert) {
		// Arrange
		var fnSpyGetEntitiesLazy = sinon.spy(this.oValueHelpProvider, "_getEntitiesLazy");
		this.oValueHelpProvider._oValueHelpDialogClass = null;

		// Act
		this.oValueHelpProvider._createValueHelpDialog();

		// Assert
		assert.strictEqual(fnSpyGetEntitiesLazy.called, true);
	});
	QUnit.test("Shall call _getEntitiesLazy if mdc CollectiveSearch class is not already loaded", function(assert) {
		// Arrange
		var fnSpyGetEntitiesLazy = sinon.spy(this.oValueHelpProvider, "_getEntitiesLazy");
		this.oValueHelpProvider._oCollectiveSearchSelectClass = null;

		// Act
		this.oValueHelpProvider._createValueHelpDialog();

		// Assert
		assert.strictEqual(fnSpyGetEntitiesLazy.called, true);
	});

	QUnit.test("Shall create an instance of ValueHelpDialog and Open it on _onValueHelpDialogRequired", function (assert) {
		var fnDone = assert.async();

		this.oValueHelpProvider._onValueHelpDialogRequired(aValueHelpDialogRequiredClasses).then(function () {
			assert.ok(this.oValueHelpProvider.oValueHelpDialog);
			// TODO Add a check if open is invoked
			// assert.strictEqual(oValueHelpDialog.open.calledOnce,true);
			fnDone();
		}.bind(this));
	});

	QUnit.test("If VHD is Context Dependent, we shall pass binding context path to evaluate ValueList annotation", function (assert) {
		var fnDone = assert.async(),
			sFullyQualifiedFieldName = "fakeQualifiedFieldName",
			sBindingContextPath = "fakeBindingContextPath";

		sinon.stub(this.oValueHelpProvider, "_isContextDependent").returns(true);
		this.oValueHelpProvider._oMetadataAnalyser = sinon.createStubInstance(MetadataAnalyser);
		this.oValueHelpProvider._oMetadataAnalyser.getValueListAnnotationLazy.returns(Promise.resolve());
		this.oValueHelpProvider._sFullyQualifiedFieldName = sFullyQualifiedFieldName;
		this.oValueHelpProvider.oControl.getBindingContext.returns({getPath: function(){return sBindingContextPath;}});

		this.oValueHelpProvider.getValueListAnnotation().then(function () {
			var fnGetValueListAnnotationLazy = this.oValueHelpProvider._oMetadataAnalyser.getValueListAnnotationLazy;

			assert.strictEqual(fnGetValueListAnnotationLazy.calledOnceWith(sFullyQualifiedFieldName, sBindingContextPath), true);

			this.oValueHelpProvider._isContextDependent.restore();
			fnDone();
		}.bind(this));
	});

	QUnit.test("If VHD is Context Dependent, we shall reevaluate ValueList annotation and then create an instance of ValueHelpDialog", function (assert) {
		var fnDone = assert.async(),
			sFullyQualifiedFieldName = "fakeQualifiedFieldName",
			sBindingContextPath = "fakeBindingContextPath",
			fnLoadAnnotation = sinon.spy(this.oValueHelpProvider, "_loadAnnotation"),
			fnOnInitValueHelpDialog = sinon.spy(this.oValueHelpProvider, "_onInitValueHelpDialog");

		this.oValueHelpProvider.bIsContextDependent = true;
		this.oValueHelpProvider._oMetadataAnalyser = sinon.createStubInstance(MetadataAnalyser);
		this.oValueHelpProvider._oMetadataAnalyser.getValueListAnnotationLazy.withArgs(sFullyQualifiedFieldName, sBindingContextPath).returns(Promise.resolve({"primaryValueListAnnotation": this.oAnnotation}));
		this.oValueHelpProvider._sFullyQualifiedFieldName = sFullyQualifiedFieldName;
		this.oValueHelpProvider.oControl.getBindingContext.returns({getPath: function(){return sBindingContextPath;}});

		this.oValueHelpProvider._onValueHelpDialogRequired(aValueHelpDialogRequiredClasses).then(function () {
			assert.ok(this.oValueHelpProvider.oValueHelpDialog);
			assert.strictEqual(fnLoadAnnotation.calledOnce, true);
			assert.strictEqual(fnOnInitValueHelpDialog.calledOnce, true);
			fnDone();
		}.bind(this));
	});

	QUnit.test("If VHD is Context Dependent, we shall set bIsContextDependent to true on Metadata evaluation", function (assert) {
		this.oValueHelpProvider._oMetadataAnalyser = sinon.createStubInstance(MetadataAnalyser);
		this.oValueHelpProvider._oMetadataAnalyser.getPropertyContextByPath.returns({getObject: function(){return {"com.sap.vocabularies.Common.v1.ValueListRelevantQualifiers": {}};}});

		assert.ok(this.oValueHelpProvider._isContextDependent());
	});

	QUnit.test("Shall call setModel on the table on creation of VHDialog", function(assert) {
		this.oValueHelpProvider._createValueHelpDialog();
		assert.strictEqual(oValueHelpDialog.setModel.called,true);
		assert.strictEqual(oValueHelpDialog.setModel.calledWith(this.oModel),true);
	});

	QUnit.test("Shall not fill the table initially, if preventInitialDataFetchInValueHelpDialog is true", function(assert) {
		this.oValueHelpProvider.preventInitialDataFetchInValueHelpDialog = true;
		sinon.spy(this.oValueHelpProvider, "_rebindTable");
		oValueHelpDialog._oTable = sinon.createStubInstance(Table);
		/**
		 * @deprecated As of version 1.60.0, replaced by {@link sap.ui.comp.valuehelpdialog.ValueHelpDialog#getTableAsync} to prevent synchronous calls.
		 * @private
		 */
		(function() {
			oValueHelpDialog.getTable.returns(oValueHelpDialog._oTable);
		})();
		oValueHelpDialog.getTableAsync.returns(new Promise(function(fResolve) {fResolve(oValueHelpDialog._oTable);}));
		this.oValueHelpProvider.bSupportBasicSearch = true;
		this.oValueHelpProvider._createValueHelpDialog();

		this.oValueHelpProvider._onFilterBarInitialise();

		assert.ok(this.oValueHelpProvider._rebindTable.notCalled);
	});

	QUnit.test("FilterBar should be expanded when there is no basic search", function(assert) {
		// Arrange
		this.oValueHelpProvider.bSupportBasicSearch = false;
		sinon.spy(this.oValueHelpProvider, "_expandFilterBar");
		sinon.spy(this.oValueHelpProvider, "_rebindTable");
		oValueHelpDialog._oTable = sinon.createStubInstance(Table);
		/**
		 * @deprecated As of version 1.60.0, replaced by {@link sap.ui.comp.valuehelpdialog.ValueHelpDialog#getTableAsync} to prevent synchronous calls.
		 * @private
		 */
		(function() {
			oValueHelpDialog.getTable.returns(oValueHelpDialog._oTable);
		})();
		oValueHelpDialog.getTableAsync.returns(new Promise(function(fResolve) {fResolve(oValueHelpDialog._oTable);}));
		this.oValueHelpProvider._createValueHelpDialog();

		// Act
		this.oValueHelpProvider._onFilterBarInitialise();

		// Assert
		assert.equal(this.oValueHelpProvider._expandFilterBar.calledOnce, true, "_expandFilterBar is called");
		assert.equal(this.oValueHelpProvider.oSmartFilterBar.getFilterBarExpanded(), true, "FilterBar is expanded when there is no basic search");
	});

	QUnit.test("FilterBar should be expanded when there is a mandatory field", function(assert) {
		// Arrange
		this.oValueHelpProvider.bSupportBasicSearch = true;
		sinon.spy(this.oValueHelpProvider, "_rebindTable");
		oValueHelpDialog._oTable = sinon.createStubInstance(Table);
		/**
		 * @deprecated As of version 1.60.0, replaced by {@link sap.ui.comp.valuehelpdialog.ValueHelpDialog#getTableAsync} to prevent synchronous calls.
		 * @private
		 */
		(function() {
			oValueHelpDialog.getTable.returns(oValueHelpDialog._oTable);
		})();
		oValueHelpDialog.getTableAsync.returns(new Promise(function(fResolve) {fResolve(oValueHelpDialog._oTable);}));
		this.oValueHelpProvider._createValueHelpDialog();
		sinon.stub(this.oValueHelpProvider.oSmartFilterBar, "_hasMandatoryFields").returns(true);


		// Act
		this.oValueHelpProvider._onFilterBarInitialise();

		// Assert
		assert.equal(this.oValueHelpProvider.oSmartFilterBar.getFilterBarExpanded(), true, "FilterBar is expanded when there is no basic search");
	});

	QUnit.test("FilterBar should be expanded when preventInitialDataFetchInValueHelpDialog is set to true", function(assert) {
		// Arrange
		this.oValueHelpProvider.oFilterProvider = {
			_getPreventInitialDataFetchInValueHelpDialog: function() {
				return true;
			}
		};
		this.oValueHelpProvider.bSupportBasicSearch = true;
		sinon.spy(this.oValueHelpProvider, "_rebindTable");
		oValueHelpDialog._oTable = sinon.createStubInstance(Table);
		/**
		 * @deprecated As of version 1.60.0, replaced by {@link sap.ui.comp.valuehelpdialog.ValueHelpDialog#getTableAsync} to prevent synchronous calls.
		 * @private
		 */
		(function() {
			oValueHelpDialog.getTable.returns(oValueHelpDialog._oTable);
		})();
		oValueHelpDialog.getTableAsync.returns(new Promise(function(fResolve) {fResolve(oValueHelpDialog._oTable);}));
		this.oValueHelpProvider._createValueHelpDialog();

		// Act
		this.oValueHelpProvider._onFilterBarInitialise();

		// Assert
		assert.equal(this.oValueHelpProvider.oSmartFilterBar.getFilterBarExpanded(), true, "FilterBar is expanded when there is no basic search");
	});

	QUnit.test("Shall fill the table initially, if preventInitialDataFetchInValueHelpDialog is false", function(assert) {
		this.oValueHelpProvider.preventInitialDataFetchInValueHelpDialog = false;
		sinon.spy(this.oValueHelpProvider, "_rebindTable");
		oValueHelpDialog._oTable = sinon.createStubInstance(Table);
		/**
		 * @deprecated As of version 1.60.0, replaced by {@link sap.ui.comp.valuehelpdialog.ValueHelpDialog#getTableAsync} to prevent synchronous calls.
		 * @private
		 */
		(function() {
			oValueHelpDialog.getTable.returns(oValueHelpDialog._oTable);
		})();
		oValueHelpDialog.getTableAsync.returns(new Promise(function(fResolve) {fResolve(oValueHelpDialog._oTable);}));
		this.oValueHelpProvider._createValueHelpDialog();

		this.oValueHelpProvider._onFilterBarInitialise();

		assert.ok(this.oValueHelpProvider._rebindTable.calledOnce);
	});

	QUnit.test("Shall fill the table initially, if bForceTriggerDataRetreival is true", function(assert) {
		this.oValueHelpProvider.preventInitialDataFetchInValueHelpDialog = true;
		this.oValueHelpProvider.bForceTriggerDataRetreival = true;
		sinon.stub(this.oValueHelpProvider, "_rebindTable");

		this.oValueHelpProvider._createValueHelpDialog();
		this.oValueHelpProvider._onFilterBarInitialise();

		assert.ok(this.oValueHelpProvider._rebindTable.calledOnce);
	});

	QUnit.test("Shall not fill the table initially, if bForceTriggerDataRetreival is false", function(assert) {
		this.oValueHelpProvider.preventInitialDataFetchInValueHelpDialog = true;
		this.oValueHelpProvider.bForceTriggerDataRetreival = false;
		sinon.stub(this.oValueHelpProvider, "_rebindTable");

		this.oValueHelpProvider._createValueHelpDialog();
		this.oValueHelpProvider._onFilterBarInitialise();

		assert.ok(this.oValueHelpProvider._rebindTable.notCalled);
	});

	QUnit.test("Shall pass the filterModel from ValueHelpProvider to ValueListProvider", function (assert) {
		var fnDone = assert.async(),
			oInput = new Input();

		this.oValueHelpProvider.oFilterModel = {};
		this.oValueHelpProvider._onValueHelpDialogRequired(aValueHelpDialogRequiredClasses).then(function () {
			this.oValueHelpProvider.oValueHelpDialog._fSuggestCallback(oInput, "sFieldName");

			assert.ok(oInput._oSuggestProvider.oFilterModel, "ValueListProvider has filterModel");
			assert.equal(oInput._oSuggestProvider.oFilterModel, this.oValueHelpProvider.oFilterModel, "ValueListProvider has" +
				"the same filterModel as ValueHelpProvider");
			fnDone();
		}.bind(this));
	});

	QUnit.test("_createCollectiveSearchControls: Shall create collective search controls if additional annotations are present!", function(assert) {
		// Arrange
		this.oValueHelpProvider.additionalAnnotations = [{}];
		this.oValueHelpProvider.oValueHelpDialog = oValueHelpDialog;
		this.oValueHelpProvider.oValueHelpDialog._oColSearchBox = oCollectiveSearchSelect;

		// Act
		this.oValueHelpProvider._createCollectiveSearchControls();

		// Assert
		assert.strictEqual(oValueHelpDialog._oColSearchBox.setVisible.calledOnce, true);
	});

	QUnit.test("_triggerAnnotationChange shall call _resolveAnnotationData & _createAdditionalValueHelpControls & _setDefaultSFBSmartTableConfig & _recreateTable", function(assert) {
		// Arrange
		var oAnnotation = {};
		this.oValueHelpProvider.additionalAnnotations = [oAnnotation];
		oValueHelpDialog.oSelectionTitle = sinon.createStubInstance(Text);
		this.oValueHelpProvider.oValueHelpDialog = oValueHelpDialog;
		this.oValueHelpProvider.oValueHelpDialog._oColSearchBox = oCollectiveSearchSelect;

		sinon.spy(this.oValueHelpProvider,"_resolveAnnotationData");
		sinon.spy(this.oValueHelpProvider,"_createAdditionalValueHelpControls");
		sinon.spy(this.oValueHelpProvider,"_setDefaultSFBSmartTableConfig");

		// Act
		this.oValueHelpProvider._triggerAnnotationChange(oAnnotation);

		// Assert
		assert.strictEqual(this.oValueHelpProvider._resolveAnnotationData.calledOnce, true);
		assert.strictEqual(this.oValueHelpProvider._resolveAnnotationData.calledWith(oAnnotation), true);
		assert.strictEqual(this.oValueHelpProvider._createAdditionalValueHelpControls.calledOnce, true);
		assert.strictEqual(this.oValueHelpProvider._setDefaultSFBSmartTableConfig.callCount, 1);
		assert.strictEqual(oValueHelpDialog._recreateTable.callCount, 1);
	});

	QUnit.test("_createCollectiveSearchControls: successfully sets the items of the CollectiveSearchSelect", function(assert) {
		// Arrange
		var	oCollectiveSearchSelect,
			done = assert.async(),
			oPrimaryValueListAnnotation = {
				keyField: "CompanyCode",
				valueListTitle: "CompanyCode Title"
			},
			additionalAnnotations = [{}];

		sinon.stub(this.oValueHelpProvider, 'oPrimaryValueListAnnotation').value(oPrimaryValueListAnnotation);
		sinon.stub(this.oValueHelpProvider, 'additionalAnnotations').value(additionalAnnotations);

		this.oValueHelpProvider.oValueHelpDialog = oValueHelpDialog;
		this.oValueHelpProvider.oValueHelpDialog._oColSearchBox = new CollectiveSearchSelect();
		oCollectiveSearchSelect = oValueHelpDialog._oColSearchBox;

		// Act
		this.oValueHelpProvider._createCollectiveSearchControls();

		setTimeout(function () {
			// Assert
			assert.equal(oCollectiveSearchSelect.getSelectedItemKey(), oPrimaryValueListAnnotation.keyField, "selectedItemKey is correctly set");
			assert.ok(oCollectiveSearchSelect.getItems());
			assert.equal(oCollectiveSearchSelect.getItems().length, 2, "Items should be 2 - 1 from primary annotation and 1 from additional");

			// Cleanup
			oCollectiveSearchSelect.destroy();
			oCollectiveSearchSelect = null;
			done();
		});
	});

	QUnit.test("_createCollectiveSearchControls: successfully triggers annotation change", function(assert) {
		// Arrange
		var	oCollectiveSearchSelect,
			done = assert.async(),
			oPrimaryValueListAnnotation = {
				keyField: "CompanyCode",
				valueListTitle: "CompanyCode Title"
			},
			additionalAnnotations = [
				{
					qualifier: "Qualifier1",
					valueListTitle: "Title 1"
				},
				{
					qualifier: "Qualifier2",
					valueListTitle: "Title 2"
				}
			];

		sinon.stub(this.oValueHelpProvider, 'oPrimaryValueListAnnotation').value(oPrimaryValueListAnnotation);
		sinon.stub(this.oValueHelpProvider, 'additionalAnnotations').value(additionalAnnotations);

		this.oValueHelpProvider.oValueHelpDialog = new ValueHelpDialog();
		this.oValueHelpProvider.oValueHelpDialog._oColSearchBox = new CollectiveSearchSelect();
		oCollectiveSearchSelect = this.oValueHelpProvider.oValueHelpDialog._oColSearchBox;
		sinon.spy(this.oValueHelpProvider, "_triggerAnnotationChange");
		this.oValueHelpProvider._createCollectiveSearchControls();

		// Act
		oCollectiveSearchSelect.fireSelect({
			key: additionalAnnotations[1].qualifier
		});

		this.oValueHelpProvider.oValueHelpDialog._oTablePromise.then(function () {
			var oTable = this.oValueHelpProvider.oValueHelpDialog._oTable;
			// Assert
			assert.equal(this.oValueHelpProvider._triggerAnnotationChange.calledOnce, true,
				"Selecting from the collective search calls _triggerAnnotationChange");
			assert.equal(this.oValueHelpProvider._triggerAnnotationChange.calledWith(additionalAnnotations[1]), true,
				"_triggerAnnotationChange is called with the correct annotation");

			/**
			 * @deprecated As of version 1.119
			 */
			if (oTable.setVisibleRowCountMode) {
				assert.equal(oTable.getVisibleRowCountMode(), "Auto", "Table visibleRowCountMode is set to Auto");
				// Cleanup
				oCollectiveSearchSelect.destroy();
				oCollectiveSearchSelect = null;
				done();
				return;
			}

			assert.equal(oTable.getRowMode().getMetadata().getName(), "sap.ui.table.rowmodes.Auto", "Table rowMode is set to Auto");

			// Cleanup
			oCollectiveSearchSelect.destroy();
			oCollectiveSearchSelect = null;
			done();
		}.bind(this));
	});

	QUnit.test("_getEntitiedLazy shall load the comp.ValueHelpdialog and mdc.CollectiveSearchSelect classes", function (assert) {
		// Arrange
		var fnDone = assert.async();

		// Act
		this.oValueHelpProvider._getEntitiesLazy().then(function (aResult) {

			// Assert
			assert.equal(Array.isArray(aResult), true, "the _getEntitiesLazy promise returns an array");
			assert.equal(aResult.length, 2, "The array contains 2 elements");
			assert.equal(aResult[0].getMetadata().getName(), "sap.ui.comp.valuehelpdialog.ValueHelpDialog", "First element is the comp.ValueHelpDialog class");
			assert.equal(aResult[1].getMetadata().getName(), "sap.ui.mdc.valuehelp.CollectiveSearchSelect", "Second element is the mdc.CollectiveSearchSelect class");
			fnDone();
		});
	});
	QUnit.test("TokenUpdate event shell not be fired, if the tokens returned by the ValueHelpDialog are the same as the passed ones", function (assert) {
		// Arrange
		var fnDone = assert.async(),
			oRange = {
				"exclude": true,
				"operation": "BT",
				"keyField": "CompanyCode",
				"value1": "aaaaa",
				"value2": "z"
			},
			oNewRange = {
				"exclude": true,
				"operation": "BT",
				"keyField": "CompanyCode",
				"value1": "bbbbbb",
				"value2": "z"
			},
			oToken = new Token({
				key: "i1",
				text: "CompanyCode a..z"
			}).data("range", oRange);

		this.oValueHelpProvider.oControl.getTokens.returns(oToken);
		this.oValueHelpProvider.oControl.isA.withArgs("sap.m.MultiInput").returns(true);
		this.oValueHelpProvider._onValueHelpDialogRequired(aValueHelpDialogRequiredClasses).then(function () {
			// Assert
			assert.ok(this.oValueHelpProvider.oControl.setTokens.notCalled, "Tokens are not updated and the TokenUpdate event is not fired");

			// Act
			this.oValueHelpProvider.oValueHelpDialog._addToken2Tokenizer("__token0-1", "", this.oValueHelpProvider.oValueHelpDialog._getTokenizer(), null, oNewRange);
			this.oValueHelpProvider.oValueHelpDialog._onCloseAndTakeOverValues();

			// Assert
			assert.ok(this.oValueHelpProvider.oControl.setTokens.calledOnce, "Tokens are updated and the TokenUpdate event is fired");

			// Clean Up
			fnDone();
			oToken.destroy();
		}.bind(this));
	});

	QUnit.test("The CollectiveSearch of the ValueHelpDialog is replaced with the mdc.CollectiveSearchSelect", function (assert) {
		// Arrange
		var fnDone = assert.async();
		this.oValueHelpProvider._onValueHelpDialogRequired(aValueHelpDialogRequiredClasses).then(function () {
			var oCollectiveSearchSelect = this.oValueHelpProvider.oValueHelpDialog._oColSearchBox;

			// Assert
			assert.ok(oCollectiveSearchSelect);
			assert.ok(oCollectiveSearchSelect.isA("sap.ui.mdc.valuehelp.CollectiveSearchSelect"));
			assert.equal(oCollectiveSearchSelect.getVisible(), false, "CollectiveSearchSelect is initially not visible");

			// Clean Up
			fnDone();
		}.bind(this));
	});

	QUnit.module("sap.ui.comp.providers.ValueHelpProvider", {
		beforeEach: function() {
			this.sTitle = "foo";
			this.oAnnotation = {valueListEntitySetName:"Chuck",keyField:"TheKey",descriptionField:"Desc",keys:["TheKey"],valueListFields:[{name:"TheKey"},{name:"Desc"}]};
			this.oModel = sinon.createStubInstance(ODataModel);
			//Set single interval
			this.isSingleIntervalRange = true;
			this.oValueHelpProvider = new ValueHelpProvider({title:this.sTitle,control: sinon.createStubInstance(Input), aggregation:"suggestionItems",annotation:this.oAnnotation,model:this.oModel,fieldName:"foo",isSingleIntervalRange:this.isSingleIntervalRange,filterBarClass: SmartFilterBar});
			this.oValueHelpProvider._oValueHelpDialogClass = o;
			this.oValueHelpProvider._oCollectiveSearchSelectClass = oC;
		},
		afterEach: function() {
			this.oValueHelpProvider.destroy();
			this.oValueHelpProvider = null;
		}
	});

	/**
	 * @deprecated Since version 1.84.1
	 */
	QUnit.test("maxConditions shall be set to 1 for single Interval dialog", function(assert) {

		// Arrange
		assert.ok(this.oValueHelpProvider.bIsSingleIntervalRange);

		// Act
		this.oValueHelpProvider._createValueHelpDialog();

		// Assert
		assert.strictEqual(this.oValueHelpProvider.oValueHelpDialog.setMaxConditions.calledOnceWith(1), true, "maxConditions are correctly set");
	});

	QUnit.test("Shall create an instance of ValueHelpDialog and Open it on _createValueHelpDialog", function(assert) {
		// Act
		this.oValueHelpProvider._oValueHelpDialogClass = ValueHelpDialog;
		this.oValueHelpProvider._oCollectiveSearchSelectClass = CollectiveSearchSelect;
		this.oValueHelpProvider._createValueHelpDialog();

		// Assert
		assert.ok(this.oValueHelpProvider.oValueHelpDialog.getProperty("_enhancedExcludeOperations"));
	});

	QUnit.test("_updateInitialInterval shall be called for single Interval dialog", function(assert) {

		assert.ok(this.oValueHelpProvider.bIsSingleIntervalRange);

		sinon.spy(this.oValueHelpProvider,"_updateInitialInterval");
		this.oValueHelpProvider._createValueHelpDialog();


		assert.strictEqual(this.oValueHelpProvider._updateInitialInterval.calledOnce,true);
	});

	QUnit.test("_updateInitialInterval: Check for single Interval with equals token", function(assert) {
		var oToken = null, oData = null, sControlValue = "foo";

		assert.ok(this.oValueHelpProvider.bIsSingleIntervalRange);

		this.oValueHelpProvider._createValueHelpDialog();

		this.oValueHelpProvider.oControl.getValue.returns(sControlValue);
		this.oValueHelpProvider.oValueHelpDialog.setTokens = sinon.stub();


		this.oValueHelpProvider._updateInitialInterval();


		assert.strictEqual(this.oValueHelpProvider.oValueHelpDialog.setTokens.calledOnce,true);

		oToken = this.oValueHelpProvider.oValueHelpDialog.setTokens.args[0][0][0];
		oData = oToken.data("range");
		assert.strictEqual(oData.operation,"EQ");
		assert.strictEqual(oData.value1,sControlValue);
	});

	QUnit.test("_updateInitialInterval: Check for single Interval with an interval token", function(assert) {
		var oToken = null, oData = null, sControlValue1 = "1999", sControlValue2 = "2014";

		assert.ok(this.oValueHelpProvider.bIsSingleIntervalRange);

		this.oValueHelpProvider._createValueHelpDialog();

		this.oValueHelpProvider.oControl.getValue.returns(sControlValue1 + "-" + sControlValue2);
		this.oValueHelpProvider.oValueHelpDialog.setTokens = sinon.stub();


		this.oValueHelpProvider._updateInitialInterval();

		assert.strictEqual(this.oValueHelpProvider.oValueHelpDialog.setTokens.calledOnce,true);

		oToken = this.oValueHelpProvider.oValueHelpDialog.setTokens.args[0][0][0];
		oData = oToken.data("range");
		assert.strictEqual(oData.operation,"BT");
		assert.strictEqual(oData.value1,sControlValue1);
		assert.strictEqual(oData.value2,sControlValue2);
	});

	QUnit.test("_createAdditionalValueHelpControls: Check ", function(assert) {
		// Arrange
		var constParams = {},
			sConstKey = "constKey";

		constParams[sConstKey] = "ConstValue";
		sinon.stub(this.oValueHelpProvider, 'oPrimaryValueListAnnotation').value({
			constParams: constParams
		});
		this.oValueHelpProvider.oValueHelpDialog = {};
		this.oValueHelpProvider.oValueHelpDialog = sinon.createStubInstance(ValueHelpDialog);

		// Act
		this.oValueHelpProvider._createAdditionalValueHelpControls();

		// Assert
		assert.strictEqual(this.oValueHelpProvider.oSmartFilterBar.data("hiddenFields")[0], sConstKey);
	});

	QUnit.module("sap.ui.comp.providers.ValueHelpProvider", {
		beforeEach: function() {
			this.sTitle = "foo";
			this.oAnnotation = {valueListEntitySetName:"Chuck",keyField:"TheKey",descriptionField:"Desc",keys:["TheKey"],valueListFields:[{name:"TheKey"},{name:"Desc"}]};
			this.oModel = sinon.createStubInstance(ODataModel);
			//Set single interval
			this.isSingleIntervalRange = true;
			this.oValueHelpProvider = new ValueHelpProvider(
				{
					title:this.sTitle,
					control: new Input(),
					aggregation:"suggestionItems",
					annotation:this.oAnnotation,
					model:this.oModel,
					fieldName:"foo",
					isSingleIntervalRange:this.isSingleIntervalRange,
					filterBarClass: SmartFilterBar
				});
			this.oValueHelpProvider._oValueHelpDialogClass = o;
			this.oValueHelpProvider._oCollectiveSearchSelectClass = oC;
			this.oValueHelpProvider.bSupportBasicSearch = true;
		},
		afterEach: function() {
			this.oValueHelpProvider.destroy();
		}
	});

	QUnit.test("Check value on fireValueHelpRequest of sBasicSearchText and preventInitialDataFetchInValueHelpDialog", function(assert) {
		this.oValueHelpProvider.oControl.fireValueHelpRequest({
			fromSuggestions: false,
			_userInputValue: "test _userInputValue"
		});

		assert.equal(this.oValueHelpProvider.sBasicSearchText, "test _userInputValue");
		assert.equal(this.oValueHelpProvider.preventInitialDataFetchInValueHelpDialog, false);
	});

	QUnit.test("Check value on fireValueHelpRequest of sBasicSearchText and preventInitialDataFetchInValueHelpDialog and preventInitialDataFetchInValueHelpDialog is false", function(assert) {
		this.oValueHelpProvider.preventInitialDataFetchInValueHelpDialog = false;
		this.oValueHelpProvider.oControl.fireValueHelpRequest({
			fromSuggestions: false,
			_userInputValue: ""
		});


		assert.equal(this.oValueHelpProvider.sBasicSearchText, "");
		assert.equal(this.oValueHelpProvider.preventInitialDataFetchInValueHelpDialog, false);
	});

	QUnit.test("Check value on fireValueHelpRequest of sBasicSearchText and preventInitialDataFetchInValueHelpDialog and preventInitialDataFetchInValueHelpDialog is true", function(assert) {
		this.oValueHelpProvider.preventInitialDataFetchInValueHelpDialog = true;
		this.oValueHelpProvider.oControl.fireValueHelpRequest({
			fromSuggestions: false,
			_userInputValue: ""
		});


		assert.equal(this.oValueHelpProvider.sBasicSearchText, "");
		assert.equal(this.oValueHelpProvider.preventInitialDataFetchInValueHelpDialog, true);
	});

	QUnit.test("Check value on fireValueHelpRequest of sBasicSearchText and preventInitialDataFetchInValueHelpDialog and preventInitialDataFetchInValueHelpDialog is true", function(assert) {
		this.oValueHelpProvider.preventInitialDataFetchInValueHelpDialog = true;
		this.oValueHelpProvider.oControl.fireValueHelpRequest({
			fromSuggestions: false,
			_userInputValue: ""
		});


		assert.equal(this.oValueHelpProvider.sBasicSearchText, "");
		assert.equal(this.oValueHelpProvider.preventInitialDataFetchInValueHelpDialog, true);
	});

	QUnit.module("Internal methods", {
		beforeEach: function () {
			this.oControl = new Input();
			this.oVHP = new ValueHelpProvider({
				title: "test",
				control: this.oControl,
				fieldName: "foo",
				isSingleIntervalRange: true,
				filterBarClass: SmartFilterBar
			});
		},
		afterEach: function () {
			this.oVHP.destroy();
		}
	});

	QUnit.test("_onOK methods called in expected order",
		function () {
			// Arrange
			var oMockEvent = {
					getParameter: function (sParameter) {
						return sParameter === "_tokensHaveChanged";
					}
				},
				oCalculateSpy = this.spy(this.oVHP, "_calculateAndSetFilterOutputData"),
				oInputSetterSpy = this.spy(this.oControl, "setValue"),
				oChangeSpy = sinon.spy();

			this.oControl.attachChange(oChangeSpy);

			// Mock _onCancel as the dialog is never open and this throws an error
			this.oVHP._onCancel = function () {};

			// Act
			this.oVHP._onOK(oMockEvent);

			// Assert - all expected events happened in order
			sinon.assert.callOrder(oInputSetterSpy, oChangeSpy, oCalculateSpy);

			// Cleanup
			oCalculateSpy.restore();
			oInputSetterSpy.restore();
		}
	);

	QUnit.test("_selectedODataRowHandler method should receive encoded parameters",
		function (assert) {
			// Arrange
			var oRowData = {"ProductId": "TestProduct", "CategoryDescription": "TestDescription"},
				oMockEvent = {
					mParameters: {
						_tokensHaveChanged: true,
						tokens: [new Token({
									key: "%",
									text: "Percentage (%)"
								})
								.data("row", oRowData)
								.data("longKey", "TestPath('%')")]
					},
					getParameter: function (sParameter) {
						return this.mParameters[sParameter];
					}
				},
				oSelectedRowSpy;

			this.oVHP.bIsSingleIntervalRange = false;
			this.oVHP._onCancel = function () {};
			this.oVHP.sContext = "SmartField";
			this.oVHP._selectedODataRowHandler = function () {};
			oSelectedRowSpy = this.spy(this.oVHP, "_selectedODataRowHandler");

			// Act
			this.oVHP._onOK(oMockEvent);

			// Assert
			assert.ok(oSelectedRowSpy.calledWith("%", oRowData ,"/TestPath('%25')"));

			// Cleanup
			oSelectedRowSpy.restore();
		}
	);

	QUnit.test("_onOk should call HistoryValuesProvider -> setFieldData when SmartField is used",
		function (assert) {
			// Arrange
			var oRowData = { "ProductId": "TestProduct", "CategoryDescription": "TestDescription" },
				oToken = new Token({
					key: "%",
					text: "Percentage (%)"
				}).data("row", oRowData).data("longKey", "TestPath('%')"),
				oMockEvent = {
					mParameters: {
						_tokensHaveChanged: true,
						tokens: [oToken]
					},
					getParameter: function (sParameter) {
						return this.mParameters[sParameter];
					}
				},
				oSetFieldDataStub = this.stub();

			this.oVHP.bIsSingleIntervalRange = false;
			this.oVHP._onCancel = function () {};
			this.oVHP.sContext = "SmartField";
			this.oVHP._selectedODataRowHandler = function () {};
			this.oVHP.oControl.getParent = this.stub().returns({
				invalidate: this.stub(),
				isInvalidateSuppressed: this.stub(),
				getControlFactory: this.stub().returns({
					getValueListProvider: this.stub().returns({
						_oHistoryValuesProvider: {
							setFieldData: oSetFieldDataStub
						}
					})
				})
			});

			// Act
			this.oVHP._onOK(oMockEvent);

			// Assert
			assert.equal(oSetFieldDataStub.callCount, 1, "HistoryValuesProvider -> setFieldData should be called once");
			assert.deepEqual(oSetFieldDataStub.getCall(0).args[0][0], oRowData, "HistoryValuesProvider -> setFieldData should be called with row data");

			// Cleanup
			oToken.destroy();
		}
	);

	QUnit.test("If no filterbar call is provided, the ValueHelpProvider should fallback to sap.ui.comp.smartfilterbar.SmartFilterBar",
		function (assert) {
			// Arrange
			var oValueHelpDialog = sinon.createStubInstance(ValueHelpDialog);

			this.oVHP.filterBarClass = null;
			this.oVHP.oValueHelpDialog = oValueHelpDialog;

			// Act
			this.oVHP._createAdditionalValueHelpControls();

			// Assert
			assert.ok(this.oVHP.oSmartFilterBar && this.oVHP.oSmartFilterBar.isA("sap.ui.comp.smartfilterbar.SmartFilterBar"));
		}
	);
});
