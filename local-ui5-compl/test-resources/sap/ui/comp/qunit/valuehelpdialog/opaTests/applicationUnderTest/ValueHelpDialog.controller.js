sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/ui/comp/valuehelpdialog/ValueHelpDialog",
		"sap/ui/comp/smarttable/SmartTable",
		"sap/ui/comp/library"
	],
	function (
		Controller,
		ValueHelpDialog,
		SmartTable,
		compLib
	) {
		"use strict";

		return Controller.extend(
			"test.sap.ui.comp.valuehelpdialog.ValueHelpDialog",
			{
				onInit: function () {
					this.byId("smartForm").bindElement("/Employees('0001')");
				},
				openWithSmartTable: function () {
					var oST;
					if (!this.oValueHelp) {
						this.oValueHelp = new ValueHelpDialog();

						this.oValueHelp.attachCancel(this.oValueHelp.close.bind(this.oValueHelp));
						this.oValueHelp.attachOk(this.oValueHelp.close.bind(this.oValueHelp));

						this.getView().addDependent(this.oValueHelp);

						oST = new SmartTable({
							entitySet: "AuthorsVH",
							tableType: compLib.smarttable.TableType.Table,
							enableAutoBinding: true
						});

						this.oValueHelp.setTable(oST);
					}
					this.oValueHelp.open();
				}
			}
		);
	}
);
