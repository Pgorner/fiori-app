import type { MockedInstance, UI5InstanceType, WithMock } from "@sap-ux/jest-mock-ui5/dist/generic";
import { mock } from "@sap-ux/jest-mock-ui5/dist/generic";
import PageController from "sap/fe/core/PageController";
import EditFlow from "sap/fe/core/controllerextensions/EditFlow";
import type SelectionVariant from "sap/fe/navigation/SelectionVariant";
import type UI5Element from "sap/ui/core/Element";
import type Controller from "sap/ui/core/mvc/Controller";
import FilterBar from "sap/ui/mdc/FilterBar";
import type ObjectPageLayout from "sap/uxap/ObjectPageLayout";

interface CommonControllerType {
	getExtensionAPI: any;
	editFlow: WithMock<EditFlow>;
}

export interface ListReportControllerType {
	_getFilterBarControl: any;
	_getControls: any;
	_isFilterBarHidden: boolean;
	_isFilterBarHiddenUsed: boolean;
	_isMultiMode: any;
	_getMultiModeControl: any;
	_getFilterBarVariantControl: any;
	_hasMultiVisualizations: any;
	_shouldAutoTriggerSearch: any;
	_getTable: any;
	_getControlFromPageModelProperty: (sPath: string) => UI5Element | undefined;
	getChartControl: any;
	_getApplyAutomaticallyOnVariant: Boolean;
	getFilterBarSelectionVariant: () => SelectionVariant;
}

export interface ObjectPageControllerType {
	getStickyEditMode: any;
	_getObjectPageLayoutControl: () => ObjectPageLayout;
}

export function mockListReportController(): WithMock<Controller & PageController & ListReportControllerType & CommonControllerType> {
	// manually add ListReportController.controller functions since I am unable to import the prototype
	const listReport: MockedInstance<ListReportControllerType & CommonControllerType> = {
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
		editFlow: mock(EditFlow) as any
	};
	return Object.assign(mock(PageController) as any, listReport) as WithMock<
		Controller & PageController & ListReportControllerType & CommonControllerType
	>;
}

export function mockObjectPageController(): WithMock<Controller & PageController & ObjectPageControllerType & CommonControllerType> {
	// manually add ListReportController.controller functions since I am unable to import the prototype
	const objectPage: MockedInstance<ObjectPageControllerType & CommonControllerType> = {
		getStickyEditMode: jest.fn(),
		getExtensionAPI: jest.fn(),
		editFlow: mock(EditFlow) as any,
		_getObjectPageLayoutControl: jest.fn()
	};
	return Object.assign(mock(PageController) as any, objectPage) as WithMock<
		Controller & PageController & ObjectPageControllerType & CommonControllerType
	>;
}

export function mockContextForExtension<EXT extends object, BASE extends object>(
	extension: EXT,
	controller: WithMock<Controller>,
	base?: BASE
): WithMock<EXT & UI5InstanceType<BASE>> {
	const view = controller.getView();
	(extension as any).getView = () => view;
	const mockedBase = mock(base || {});
	return Object.assign(mockedBase, extension) as WithMock<EXT & UI5InstanceType<BASE>>;
}

export function mockFilterBar(): WithMock<
	FilterBar & { waitForInitialization: Function; _bSearchTriggered: Boolean; _getConditionModel: Function }
> {
	const filterBar = mock(FilterBar) as WithMock<
		FilterBar & { waitForInitialization: Function; _bSearchTriggered: Boolean; _getConditionModel: Function }
	>;
	filterBar.mock.waitForInitialization = jest.fn();
	return filterBar;
}
