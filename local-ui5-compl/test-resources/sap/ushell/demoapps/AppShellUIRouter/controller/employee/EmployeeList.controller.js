// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/demo/AppShellUIRouter/controller/BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("sap.ushell.demo.AppShellUIRouter.controller.employee.EmployeeList", {
        onListItemPressed: function (oEvent) {
            var oItem, oCtx;

            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext();

            this.getRouter().navTo("employee", {
                employeeId: oCtx.getProperty("EmployeeID")
            });
        }
    });
});
