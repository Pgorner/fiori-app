sap.ui.define([
	"sap/apf/modeler/ui/controller/overwriteExistingConfiguration",
	"sap/apf/modeler/ui/utils/nullObjectChecker",
	"sap/apf/modeler/ui/utils/optionsValueModelBuilder",
	"sap/ui/core/CustomData",
	"sap/ui/core/Fragment",
	"sap/ui/core/library",
	"sap/ui/thirdparty/jquery"
], function(BaseController, nullObjectChecker, optionsValueModelBuilder, CustomData, Fragment, coreLibrary, jQuery) {
	"use strict";
	var ValueState = coreLibrary.ValueState;
	var oCoreApi, oParentControl, overwriteConfirmationDialog;

	function _setDisplayText(oController) {
		var oTextReader = oCoreApi.getText;
		oController.byId("idImportDeliveredContentDialog").setTitle(oTextReader("importDeliveredContent"));
		oController.byId("idConfigLabel").setText(oTextReader("configuration"));
		oController.byId("idAppConfigCombobox").setPlaceholder(oTextReader("configFileInputPlaceHolder"));
		oController.byId("idImportOfConfig").setText(oTextReader("import"));
		oController.byId("idCancelImportOfConfig").setText(oTextReader("cancel"));
	}
	function _setAppConfigDataFromVendorLayer(oController) {
		var oModel, promise, oHeaderobj;
		promise = oCoreApi.readAllConfigurationsFromVendorLayer();
		promise.then(function(configurations) {
			oHeaderobj = {
				applicationText : oCoreApi.getText("application"),
				configurationText : oCoreApi.getText("configuration")
			};
			configurations = [oHeaderobj].concat(configurations);
			oModel = optionsValueModelBuilder.prepareModel(configurations);
			var oAppConfigCombobox = oController.byId("idAppConfigCombobox");
			oAppConfigCombobox.setModel(oModel);
			oAppConfigCombobox.getItems()[0].setEnabled(false);
			oController.byId("idImportDeliveredContentDialog").open();
		});
	}
	async function _openOverwriteConfirmationDialog(oController, callbackOverwrite, callbackCreateNew, configurationName) {
		var customData = new CustomData({
			value : {
				callbackOverwrite : callbackOverwrite,
				callbackCreateNew : callbackCreateNew
			}
		});
		overwriteConfirmationDialog = await Fragment.load({
			type: "XML",
			id: "idOverwriteConfirmationFragment",
			name: "sap.apf.modeler.ui.fragment.overwriteConfirmation",
			controller: oController
		});
		oController.getView().addDependent(overwriteConfirmationDialog);
		oController.setOverwriteConfirmationDialogText(oCoreApi.getText);
		overwriteConfirmationDialog.removeAllCustomData();
		overwriteConfirmationDialog.addCustomData(customData);
		Fragment.byId("idOverwriteConfirmationFragment", "idNewConfigTitleInput").setValue(configurationName);
		overwriteConfirmationDialog.open();
	}
	function _closeAllOpenDialogs(oController) {
		var importDeliveredContentDialog = oController.byId("idImportDeliveredContentDialog");
		if (overwriteConfirmationDialog && overwriteConfirmationDialog.isOpen()) {
			oController.handleCancelOfOverwriteDialog();
		}
		if (importDeliveredContentDialog && importDeliveredContentDialog.isOpen()) {
			oController.handleCancelOfImportDialog();
		}
	}
	function _callbackImportDeliveredContent(configuration, metadata, messageObject) {
		var oController = this;
		if (!nullObjectChecker.checkIsNotUndefined(messageObject)) {
			oParentControl.fireEvent("updateAppListEvent");
			var oMessageObject = oCoreApi.createMessageObject({
				code : "11515"
			});
			oCoreApi.putMessage(oMessageObject);
		} else {
			var oMessageObject = oCoreApi.createMessageObject({
				code : "11502"
			});
			oMessageObject.setPrevious(messageObject);
			oCoreApi.putMessage(oMessageObject);
		}
		_closeAllOpenDialogs(oController);
	}
	return BaseController.extend("sap.apf.modeler.ui.controller.importDeliveredContent", {
		onInit : function() {
			var oController = this;
			oCoreApi = oController.getView().getViewData().oCoreApi;
			oParentControl = oController.getView().getViewData().oParentControl;
			_setDisplayText(oController);
			_setAppConfigDataFromVendorLayer(oController);
		},
		handleChangeOfAppConfigTextField : function() {
			var oController = this, aMatchingDataRows, oAppConfigCombobox;
			oAppConfigCombobox = oController.byId("idAppConfigCombobox");
			aMatchingDataRows = oAppConfigCombobox.getItems().filter(function(oItem) {
				return oItem.getText() === oAppConfigCombobox.getValue();
			});
			if (!aMatchingDataRows.length) {
				jQuery(oAppConfigCombobox).focus();
				jQuery(".appCofigCombo").find('input').focus();
				oAppConfigCombobox.setValueState(ValueState.Error);
			}
		},
		handleSelectionChangeOfAppConfigTextField : function() {
			var oController = this;
			oController.byId("idAppConfigCombobox").setValueState(ValueState.None);
		},
		handleImportPress : function() {
			var oController = this;
			var oAppConfigCombobox = oController.byId("idAppConfigCombobox");
			oController.handleChangeOfAppConfigTextField();
			if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(oAppConfigCombobox.getSelectedItem())) {
				var aValues = oAppConfigCombobox.getSelectedItem().data("value").split(".");
				var appId = aValues[0];
				var configId = aValues[1];
				oCoreApi.importConfigurationFromVendorLayer(appId, configId, function(callbackOverwrite, callbackCreateNew, configurationName) {
					_openOverwriteConfirmationDialog(oController, callbackOverwrite, callbackCreateNew, configurationName);
				}, _callbackImportDeliveredContent.bind(oController));
			}
		},
		handleCancelOfImportDialog : function() {
			var oController = this;
			oController.getView().destroy();
		}
	});
});