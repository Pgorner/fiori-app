// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/demo/AppDirtyStateProvider/controller/BaseController",
    "sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("sap.ushell.demo.AppDirtyStateProvider.controller.employee.EmployeeList", {
        onInit: function () {
            var oRouter = this.getRouter();
            oRouter.getRoute("employeeList").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            var oModel = new JSONModel();
            oModel.loadData("../../demoapps/AppDirtyStateProvider/localService/mockdata/Employees.json").then(function () {
                this.getView().setModel(oModel);
            }.bind(this));
        }
    });
});
