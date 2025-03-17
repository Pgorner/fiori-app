/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["@sap-ux/jest-mock-ui5/dist/generic", "sap/fe/core/PageController", "sap/fe/core/controllerextensions/EditFlow", "sap/ui/mdc/FilterBar"], function (generic, PageController, EditFlow, FilterBar) {
  "use strict";

  var _exports = {};
  var mock = generic.mock;
  function mockListReportController() {
    // manually add ListReportController.controller functions since I am unable to import the prototype
    const listReport = {
      _getApplyAutomaticallyOnVariant: jest.fn(),
      _getFilterBarControl: jest.fn(),
      _getControls: jest.fn(),
      _isFilterBarHidden: jest.fn(),
      _isFilterBarHiddenUsed: jest.fn(),
      _isMultiMode: jest.fn(),
      _getMultiModeControl: jest.fn(),
      _getFilterBarVariantControl: jest.fn(),
      _hasMultiVisualizations: jest.fn(),
      _shouldAutoTriggerSearch: jest.fn(),
      _getTable: jest.fn(),
      getExtensionAPI: jest.fn(),
      getFilterBarSelectionVariant: jest.fn(),
      _getControlFromPageModelProperty: jest.fn(),
      getChartControl: jest.fn(),
      editFlow: mock(EditFlow)
    };
    return Object.assign(mock(PageController), listReport);
  }
  _exports.mockListReportController = mockListReportController;
  function mockObjectPageController() {
    // manually add ListReportController.controller functions since I am unable to import the prototype
    const objectPage = {
      getStickyEditMode: jest.fn(),
      getExtensionAPI: jest.fn(),
      editFlow: mock(EditFlow),
      _getObjectPageLayoutControl: jest.fn()
    };
    return Object.assign(mock(PageController), objectPage);
  }
  _exports.mockObjectPageController = mockObjectPageController;
  function mockContextForExtension(extension, controller, base) {
    const view = controller.getView();
    extension.getView = () => view;
    const mockedBase = mock(base || {});
    return Object.assign(mockedBase, extension);
  }
  _exports.mockContextForExtension = mockContextForExtension;
  function mockFilterBar() {
    const filterBar = mock(FilterBar);
    filterBar.mock.waitForInitialization = jest.fn();
    return filterBar;
  }
  _exports.mockFilterBar = mockFilterBar;
  return _exports;
}, false);
//# sourceMappingURL=FeMocks-dbg.js.map
