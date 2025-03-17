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
	"sap/ui/core/Lib"
], function (
    Button,
    Dialog,
    SmartForm,
    Group,
    GroupElement,
    RadioButtonGroup,
    RadioButton,
    Lib
) {
	"use strict";

	/**
	 * Change handler for sap.gantt.simple.GanttChartContainer
	 *
	 * @constructor
	 *
	 * @alias sap.gantt.changeHandlers.simple.GanttChartContainer
	 *
	 * @author SAP SE
	 *
	 * @version 1.132.0
	 *
	 * @since 1.90
	 */

    var oResourceBundle = Lib.getResourceBundleFor("sap.gantt");
	var GanttChartContainer = {
        getDialogBox : function(oContainer) {
            return new Promise(function (resolve, reject) {
                var oSF = new SmartForm({
                    editable: true,
                    useHorizontalLayout: false,
                    groups: [
                        new Group({
                            groupElements: [
                                new GroupElement({
                                    label: oResourceBundle.getText("TXT_CH_GC_DISPLAY_TYPE"),
                                    elements: [
                                        new RadioButtonGroup({columns: 3, selectedIndex: this.setSelectedIndex(oContainer, "displayType"),
                                            buttons:[
                                                new RadioButton({text: "Both"}),
                                                new RadioButton({text: "Chart"}),
                                                new RadioButton({text: "Table"})
                                            ]
                                        })
                                    ]
                                }),
                                new GroupElement({
                                    label: oResourceBundle.getText("TXT_CH_GC_VERTICAL_LINE"),
                                    elements: [
                                        new RadioButtonGroup({columns: 2, selectedIndex: this.setSelectedIndex(oContainer, "enableVerticalLine"),
                                            buttons:[
                                                new RadioButton({text: oResourceBundle.getText("TXT_CH_GC_TRUE")}),
                                                new RadioButton({text: oResourceBundle.getText("TXT_CH_GC_FALSE")})
                                            ]
                                        })
                                    ]
                                }),
                                new GroupElement({
                                    label: oResourceBundle.getText("TXT_CH_GC_CURSOR_LINE"),
                                    elements: [
                                        new RadioButtonGroup({columns: 2, selectedIndex: this.setSelectedIndex(oContainer, "enableCursorLine"),
                                            buttons:[
                                                new RadioButton({text: oResourceBundle.getText("TXT_CH_GC_TRUE")}),
                                                new RadioButton({text: oResourceBundle.getText("TXT_CH_GC_FALSE")})
                                            ]
                                        })
                                    ]
                                }),
                                new GroupElement({
                                    label: oResourceBundle.getText("TXT_CH_GC_ADHOC_LINE"),
                                    elements: [
                                        new RadioButtonGroup({columns: 2, selectedIndex: this.setSelectedIndex(oContainer, "enableAdhocLine"),
                                            buttons:[
                                                new RadioButton({text: oResourceBundle.getText("TXT_CH_GC_TRUE")}),
                                                new RadioButton({text: oResourceBundle.getText("TXT_CH_GC_FALSE")})
                                            ]
                                        })
                                    ]
                                }),
                                new GroupElement({
                                    label: oResourceBundle.getText("TXT_CH_GC_DELTA_LINE"),
                                    elements: [
                                        new RadioButtonGroup({columns: 2, selectedIndex: this.setSelectedIndex(oContainer, "enableDeltaLine"),
                                            buttons:[
                                                new RadioButton({text: oResourceBundle.getText("TXT_CH_GC_TRUE")}),
                                                new RadioButton({text: oResourceBundle.getText("TXT_CH_GC_FALSE")})
                                            ]
                                        })
                                    ]
                                }),
                                new GroupElement({
                                    label: oResourceBundle.getText("TXT_CH_GC_NOW_LINE"),
                                    elements: [
                                        new RadioButtonGroup({columns: 2, selectedIndex: this.setSelectedIndex(oContainer, "enableNowLine"),
                                            buttons:[
                                                new RadioButton({text: oResourceBundle.getText("TXT_CH_GC_TRUE")}),
                                                new RadioButton({text: oResourceBundle.getText("TXT_CH_GC_FALSE")})
                                            ]
                                        })
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
                    title: oResourceBundle.getText("TXT_CH_GC_DIALOG_TITLE"),
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
                            displayType: aDialogContent[0].getElements()[0].getSelectedButton().getText(),
                            enableVerticalLine: aDialogContent[1].getElements()[0].getSelectedButton().getText() === oResourceBundle.getText("TXT_CH_GC_TRUE") ? true : false,
                            enableCursorLine: aDialogContent[2].getElements()[0].getSelectedButton().getText() === oResourceBundle.getText("TXT_CH_GC_TRUE") ? true : false,
                            enableAdhocLine: aDialogContent[3].getElements()[0].getSelectedButton().getText() === oResourceBundle.getText("TXT_CH_GC_TRUE") ? true : false,
                            enableDeltaLine: aDialogContent[4].getElements()[0].getSelectedButton().getText() === oResourceBundle.getText("TXT_CH_GC_TRUE") ? true : false,
                            enableNowLine: aDialogContent[5].getElements()[0].getSelectedButton().getText() === oResourceBundle.getText("TXT_CH_GC_TRUE") ? true : false
                        },
                        oldChange: {
                            displayType: oContainer.getDisplayType(),
                            enableVerticalLine: oContainer.getEnableVerticalLine(),
                            enableCursorLine: oContainer.getEnableCursorLine(),
                            enableAdhocLine: oContainer.getEnableAdhocLine(),
                            enableDeltaLine: oContainer.getEnableDeltaLine(),
                            enableNowLine: oContainer.getEnableNowLine()
                        }
                    };
                    this.dialogBox.close();
                    resolve(mChangeContent);
                }.bind(this));
                this.dialogBox.open();
            }.bind(this));
        }
    };

    GanttChartContainer.setSelectedIndex = function(oContainer, sPropertyName) {
        var val = oContainer.getProperty(sPropertyName);
        if (sPropertyName !== "displayType") {
            if (val === true) {
                return 0;
            } else {
                return 1;
            }
        } else if (val === "Both") {
            return 0;
        } else if (val === "Chart") {
            return 1;
        } else {
            return 2;
        }
    };

	GanttChartContainer.fnConfigureContainerSettings = function(oSelectedElement) {
        return GanttChartContainer.getDialogBox(oSelectedElement).then(function (mChangeContent) {
            return [
                {
                    selectorControl: oSelectedElement,
                    changeSpecificData: {
                        changeType: "ganttChartContainerSettings",
                        content: mChangeContent
                    }
                }
            ];
        });
	};

	return GanttChartContainer;
},
/* bExport= */true);