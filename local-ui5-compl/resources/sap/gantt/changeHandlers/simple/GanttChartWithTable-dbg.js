/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
    "sap/m/Button",
    "sap/m/Dialog",
    "sap/ui/comp/smartform/SmartForm",
    "sap/ui/comp/smartform/Group",
    "sap/ui/comp/smartform/GroupElement",
    "sap/m/RadioButtonGroup",
    "sap/m/RadioButton",
    "sap/m/Slider",
	"sap/ui/core/Lib"
], function (
    Button,
    Dialog,
    SmartForm,
    Group,
    GroupElement,
    RadioButtonGroup,
    RadioButton,
    Slider,
    Lib
) {
	"use strict";
	/**
	 * Change handler for sap.gantt.simple.GanttChartWithTable
	 *
	 * @constructor
	 *
	 * @alias sap.gantt.changeHandlers.simple.GanttChartWithTable
	 *
	 * @author SAP SE
	 *
	 * @version 1.132.0
	 *
	 * @since 1.90
	 */


    var oResourceBundle = Lib.getResourceBundleFor("sap.gantt");
	var GanttChartWithTable = {
        getDialogBox : function(oTable) {
            return new Promise(function (resolve, reject) {
                var oSF = new SmartForm({
                    editable: true,
                    useHorizontalLayout: false,
                    groups: [
                        new Group({
                            groupElements: [
                                new GroupElement({
                                    label: oResourceBundle.getText("TXT_CH_GCT_ORIENATION"),
                                    elements: [
                                        new RadioButtonGroup({columns: 3, selectedIndex: this.setSelectedIndex(oTable, "dragOrientation"),
                                            buttons:[
                                                new RadioButton({text: oResourceBundle.getText("TXT_CH_GCT_FREE")}),
                                                new RadioButton({text: oResourceBundle.getText("TXT_CH_GCT_HORIZONTAL")}),
                                                new RadioButton({text: oResourceBundle.getText("TXT_CH_GCT_VERTICAL")})
                                            ]
                                        })
                                    ]
                                }),
                                new GroupElement({
                                    label: oResourceBundle.getText("TXT_CH_GCT_HEIGHT"),
                                    elements: [
                                        new Slider({value: parseInt(oTable.getHeight().split("%")[0])})
                                    ]
                                })
                            ]
                        })
                    ]
                });
                var oSaveButton = new Button({
                    text: oResourceBundle.getText("SAVE_BUTTON"),
                    type: "Emphasized"
                }),
                // settings dialog close button
                oCancelButton = new Button({
                    text: oResourceBundle.getText("CANCEL_BUTTON")
                });
                this.dialogBox = new Dialog({
                    title: oResourceBundle.getText("TXT_CH_GCT_DIALOG_TITLE"),
                    buttons: [oSaveButton, oCancelButton],
                    content: [oSF]
                });
                oCancelButton.attachPress(function(oEvent) {
                    this.dialogBox.close();
                }.bind(this));
                oSaveButton.attachPress(function (oEvent) {
                    var aDialogContent = this.dialogBox.getContent()[0].getGroups()[0].getGroupElements(),
                    mChangeContent = {
                        newChange: {
                            dragOrientation: aDialogContent[0].getElements()[0].getSelectedButton().getText(),
                            height: aDialogContent[1].getElements()[0].getValue() + "%"
                        },
                        oldChange: {
                            dragOrientation: oTable.getDragOrientation(),
                            height: oTable.getHeight()
                        }
                    };
                    this.dialogBox.close();
                    resolve(mChangeContent);
                }.bind(this));
                this.dialogBox.open();
            }.bind(this));
        }
    };

    GanttChartWithTable.setSelectedIndex = function(oContainer, sPropertyName) {
        var val = oContainer.getProperty(sPropertyName);
        if (sPropertyName === "dragOrientation") {
            if (val === "Free") {
                return 0;
            } else if (val === "Horizontal") {
                return 1;
            } else {
                return 2;
            }
        }
    };

	GanttChartWithTable.fnConfigureContainerSettings = function(oTable) {
        return GanttChartWithTable.getDialogBox(oTable).then(function (mChangeContent) {
            return [
                {
                    selectorControl: oTable,
                    changeSpecificData: {
                        changeType: "ganttChartWithTableSettings",
                        content: mChangeContent
                    }
                }
            ];
        });
	};

	return GanttChartWithTable;
},
/* bExport= */true);