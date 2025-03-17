import type { WithMock } from "@sap-ux/jest-mock-ui5/dist/generic";
import { mock } from "@sap-ux/jest-mock-ui5/dist/generic";
import AppComponent from "sap/fe/core/AppComponent";
import type { FEView } from "sap/fe/core/BaseController";
import ResourceModel from "sap/fe/core/ResourceModel";
import CollaborativeDraft from "sap/fe/core/controllerextensions/CollaborativeDraft";
import EditFlow from "sap/fe/core/controllerextensions/EditFlow";
import InternalIntentBasedNavigation from "sap/fe/core/controllerextensions/InternalIntentBasedNavigation";
import InternalRouting from "sap/fe/core/controllerextensions/InternalRouting";
import MessageHandler from "sap/fe/core/controllerextensions/MessageHandler";
import Recommendations from "sap/fe/core/controllerextensions/Recommendations";
import Share from "sap/fe/core/controllerextensions/Share";
import SideEffects from "sap/fe/core/controllerextensions/SideEffects";
import Event from "sap/ui/base/Event";
import type EventProvider from "sap/ui/base/EventProvider";
import Controller from "sap/ui/core/mvc/Controller";
import View from "sap/ui/core/mvc/View";
import CompositeBinding from "sap/ui/model/CompositeBinding";
import Context from "sap/ui/model/odata/v4/Context";
import ODataContextBinding from "sap/ui/model/odata/v4/ODataContextBinding";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import ODataMetaModel from "sap/ui/model/odata/v4/ODataMetaModel";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import ODataPropertyBinding from "sap/ui/model/odata/v4/ODataPropertyBinding";

/**
 * Utility type to mock a sap.ui.model.odata.v4.Context
 */
export type MockContext = WithMock<Context> & {
	_isKeptAlive: boolean;
	_contextData: any;
	_oBinding: any;
	_isInactive: boolean;
};
/**
 * Factory function to create a new MockContext.
 * @param oContextData A map of the different properties of the context. The value for the key '$path' will be returned by the 'getPath' method
 * @param oBinding The binding of the context
 * @param isInactive Is the context iniactive or not
 * @returns A new MockContext
 */
export function createMockContext(oContextData?: any, oBinding?: any, isInactive?: boolean): MockContext {
	// Ugly workaround to get a proper mock pbject, as Context isn't properly exported from UI5
	const mocked = mock(Object.getPrototypeOf((Context as any).createNewContext(null, null, "/e"))) as MockContext;
	mocked._isKeptAlive = false;
	mocked._contextData = oContextData || {};
	mocked._oBinding = oBinding;
	mocked._isInactive = !!isInactive;

	// Default behavior
	mocked.mock.isA.mockImplementation((sClassName: string) => {
		return sClassName === "sap.ui.model.odata.v4.Context";
	});
	mocked.mock.getProperty.mockImplementation((key: string) => {
		return mocked._contextData[key];
	});
	mocked.mock.requestProperty.mockImplementation((keyOrKeys: string | string[]) => {
		if (Array.isArray(keyOrKeys)) {
			return Promise.resolve(keyOrKeys.map((key) => mocked._contextData[key]));
		}
		return Promise.resolve(mocked._contextData[keyOrKeys]);
	});
	mocked.mock.requestObject.mockImplementation((key: string | undefined) => {
		return key ? Promise.resolve(mocked._contextData[key]) : mocked._contextData;
	});
	mocked.mock.setProperty.mockImplementation((key: string, value: any) => {
		mocked._contextData[key] = value;
		return mocked._contextData[key];
	});

	mocked.mock.getObject.mockImplementation((path: string) => {
		let result = path ? mocked._contextData[path] : mocked._contextData;

		if (!result && path && path.includes("/")) {
			const parts = path.split("/");
			result = parts.reduce((sum, part: any) => {
				sum = part ? sum[part] : sum;
				return sum;
			}, mocked._contextData);
		}

		return result;
	});

	mocked.mock.getPath.mockImplementation(() => mocked._contextData["$path"]);
	mocked.mock.getBinding.mockImplementation(() => mocked._oBinding);
	mocked.mock.getModel.mockImplementation(() => mocked._oBinding?.getModel());
	mocked.mock.setKeepAlive.mockImplementation((bool: boolean, _fnOnBeforeDestroy?: any, _bRequestMessages?: boolean) => {
		mocked._isKeptAlive = bool;
	});
	mocked.mock.isKeepAlive.mockImplementation(() => mocked._isKeptAlive);
	mocked.mock.isInactive.mockImplementation(() => mocked._isInactive);

	return mocked;
}
/**
 * For compatibility reasons, we keep a new operator. Use the factory function createMockContext instead.
 */
export const MockContext: new (oValues?: any, oBinding?: any, isInactive?: boolean) => MockContext = createMockContext as any;

/**
 * Utility type to mock a sap.ui.base.Event
 */
export type MockEvent = WithMock<Event> & {
	_params: { [key: string]: any };
};
/**
 * Factory function to create a new MockEvent.
 * @param params The parameters of the event
 * @param source
 * @returns A new MockEvent
 */
export function createMockEvent(params?: { [key: string]: unknown }, source?: EventProvider): MockEvent {
	const mocked = mock(Event) as MockEvent;
	mocked._params = params || {};

	if (source) {
		mocked.mock.getSource.mockReturnValue(source);
	}

	// Default behavior
	mocked.mock.getParameter.mockImplementation((name) => mocked._params[name]);
	mocked.mock.getParameters.mockImplementation(() => {
		return mocked._params;
	});

	return mocked;
}
/**
 * For compatibility reasons, we keep a new operator. Use the factory function createMockEvent instead.
 */
export const MockEvent: new (params?: { [key: string]: any }) => MockEvent = createMockEvent as any;

/**
 * Utility type to mock a sap.ui.model.odata.v4.ODataListBinding
 */
export type MockListBinding = WithMock<ODataListBinding> & {
	_aMockContexts: MockContext[];
	_mockModel?: MockModel;

	/**
	 * Utility method to set the model of the ListBinding
	 */
	setModel: (model: MockModel) => void;
};
/**
 * Factory function to create a new MockListBinding.
 * @param aContextData An array of objects holding the different properties of the contexts referenced by the ListBinding
 * @param oMockModel The model of the ListBinding
 * @returns A new MockListBinding
 */
export function createMockListBinding(aContextData?: any[], oMockModel?: MockModel): MockListBinding {
	const mocked = mock(ODataListBinding) as MockListBinding;
	aContextData = aContextData || [];
	mocked._aMockContexts = aContextData.map((contextData) => {
		return createMockContext(contextData, mocked);
	});
	mocked._mockModel = oMockModel;

	// Utility API
	mocked.setModel = (model: MockModel) => {
		mocked._mockModel = model;
	};

	// Default behavior
	mocked.mock.isA.mockImplementation((sClassName: string) => {
		return sClassName === "sap.ui.model.odata.v4.ODataListBinding";
	});
	mocked.mock.requestContexts.mockImplementation(() => {
		return Promise.resolve(mocked._aMockContexts);
	});
	mocked.mock.getCurrentContexts.mockImplementation(() => {
		return mocked._aMockContexts;
	});
	mocked.mock.getAllCurrentContexts.mockImplementation(() => {
		return mocked._aMockContexts;
	});
	mocked.mock.getLength.mockImplementation(() => {
		return mocked._aMockContexts.length;
	});
	mocked.mock.getContexts.mockImplementation(() => {
		return mocked._aMockContexts;
	});
	mocked.mock.getModel.mockImplementation(() => {
		return mocked._mockModel;
	});
	mocked.mock.getUpdateGroupId.mockReturnValue("auto");

	return mocked;
}
/**
 * For compatibility reasons, we keep a new operator. Use the factory function createMockListBinding instead.
 */
export const MockListBinding: new (aContexts?: any[], mockModel?: MockModel) => MockListBinding = createMockListBinding as any;

/**
 * Utility type to mock a sap.ui.model.odata.v4.ODataPropertyBinding
 */
export type MockPropertyBinding = WithMock<ODataPropertyBinding> & {
	_value?: any;
	_path?: string;
	_mockModel?: MockModel;
};
/**
 * Factory function to create a new MockPropertyBinding.
 * @param value The value returnd by the PropertyBinding
 * @param path The path of the PropertyBinding
 * @param oMockModel The model of the PropertyBinding
 * @returns A new MockPropertyBinding
 */
export function createMockPropertyBinding(value: any, path?: string, oMockModel?: MockModel): MockPropertyBinding {
	const mocked = mock(ODataPropertyBinding) as MockPropertyBinding;
	mocked._mockModel = oMockModel;
	mocked._value = value;
	mocked._path = path;

	// Default behavior
	mocked.mock.isA.mockImplementation((sClassName: string) => {
		return sClassName === "sap.ui.model.odata.v4.ODataPropertyBinding";
	});
	mocked.mock.getModel.mockImplementation(() => {
		return mocked._mockModel;
	});
	mocked.mock.getValue.mockImplementation(() => {
		return mocked._value;
	});
	mocked.mock.getPath.mockImplementation(() => {
		return mocked._path;
	});

	return mocked;
}
/**
 * For compatibility reasons, we keep a new operator. Use the factory function createMockPropertyBinding instead.
 */
export const MockPropertyBinding: new (value: any, oMockModel?: MockModel) => MockPropertyBinding = createMockPropertyBinding as any;

/**
 * Utility type to mock a sap.ui.model.CompositeBinding
 */
export type MockCompositeBinding = WithMock<CompositeBinding> & {
	_aBindings: MockPropertyBinding[];
};
/**
 * Factory function to create a new MockCompositeBinding.
 * @param aBindings The bindings of the CompositeBinding
 * @returns A new MockCompositeBinding
 */
export function createMockCompositeBinding(aBindings: MockPropertyBinding[]): MockCompositeBinding {
	const mocked = mock(CompositeBinding) as MockCompositeBinding;
	mocked._aBindings = aBindings;

	// Default behavior
	mocked.mock.isA.mockImplementation((sClassName: string) => {
		return sClassName === "sap.ui.model.CompositeBinding";
	});
	mocked.mock.getBindings.mockImplementation(() => {
		return mocked._aBindings;
	});
	mocked.mock.getValue.mockImplementation(() => {
		return mocked._aBindings.map((binding) => binding.getValue());
	});

	return mocked;
}
/**
 * For compatibility reasons, we keep a new operator. Use the factory function createMockCompositeBinding instead.
 */
export const MockCompositeBinding: new (aBindings: MockPropertyBinding[]) => MockCompositeBinding = createMockCompositeBinding as any;

/**
 * Utility type to mock a sap.ui.model.odata.v4.ODataContextBinding
 */
export type MockContextBinding = WithMock<ODataContextBinding> & {
	oMockContext: MockContext;
	isKeptAlive: boolean;
	mockModel?: MockModel;

	/**
	 * Utility method to access the internal MockContext of the ContextBinding
	 */
	getInternalMockContext: () => MockContext;
	/**
	 * Utility method to set the model of the ContextBinding
	 */
	setModel: (oModel: MockModel) => void;
};
/**
 * Factory function to create a new MockContextBinding.
 * @param oContext The context of the ContextBinding
 * @param oMockModel The model of the ContextBinding
 * @returns A new MockContextBinding
 */
export function createMockContextBinding(oContext?: any, oMockModel?: MockModel): MockContextBinding {
	const mocked = mock(ODataContextBinding) as MockContextBinding;
	mocked.mockModel = oMockModel;
	mocked.oMockContext = createMockContext(oContext || {}, mocked);

	// Utility API
	mocked.getInternalMockContext = () => {
		return mocked.oMockContext;
	};
	mocked.setModel = (oModel: MockModel) => {
		mocked.mockModel = oModel;
	};

	// Default behavior
	mocked.mock.isA.mockImplementation((sClassName: string) => {
		return sClassName === "sap.ui.model.odata.v4.ODataContextBinding";
	});
	mocked.mock.getBoundContext.mockImplementation(() => {
		return mocked.oMockContext;
	});
	mocked.mock.getModel.mockImplementation(() => {
		return mocked.mockModel;
	});
	mocked.mock.execute.mockResolvedValue(true);

	return mocked;
}
/**
 * For compatibility reasons, we keep a new operator. Use the factory function createMockContextBinding instead.
 */
export const MockContextBinding: new (oContext?: any, oMockModel?: MockModel) => MockContextBinding = createMockContextBinding as any;

/**
 * Utility type to mock a sap.ui.model.odata.v4.ODataMetaModel
 */
export type MockMetaModel = WithMock<ODataMetaModel> & {
	oMetaContext: MockContext;
};
/**
 * Factory function to create a new MockMetaModel.
 * @param oMetaData A map of the different metadata properties of the MetaModel (path -> value).
 * @returns A new MockMetaModel
 */
export function createMockMetaModel(oMetaData?: any): MockMetaModel {
	const mocked = mock(ODataMetaModel) as MockMetaModel;
	mocked.oMetaContext = createMockContext(oMetaData || {});

	// Default behavior
	mocked.mock.getMetaContext.mockImplementation((sPath: string) => {
		return createMockContext({ $path: sPath });
	});
	mocked.mock.getObject.mockImplementation((sPath: string) => {
		return mocked.oMetaContext.getProperty(sPath);
	});
	mocked.mock.createBindingContext.mockImplementation((sPath: string) => {
		return createMockContext({ $path: sPath });
	});
	mocked.mock.getMetaPath.mockImplementation((sPath: string) => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const metamodel = new ODataMetaModel();
		return sPath ? metamodel.getMetaPath(sPath) : sPath;
	});
	mocked.mock.isA.mockImplementation((sClassName: string) => {
		return sClassName === "sap.ui.model.odata.v4.ODataMetaModel";
	});

	return mocked;
}
/**
 * For compatibility reasons, we keep a new operator. Use the factory function createMockMetaModel instead.
 */
export const MockMetaModel: new (oMetaData?: any) => MockMetaModel = createMockMetaModel as any;

/**
 * Utility type to mock a sap.ui.model.odata.v4.ODataModel
 */
export type MockModel = WithMock<ODataModel> & {
	oMetaModel?: MockMetaModel;
	mockListBinding?: MockListBinding;
	mockContextBinding?: MockContextBinding;

	/**
	 * Utility method to set the metamodel of the MockModel
	 */
	setMetaModel: (oMetaModel: MockMetaModel) => void;
};
/**
 * Factory function to create a new MockModel.
 * @param oMockListBinding A list binding that will be returned when calling bindList.
 * @param oMockContextBinding A context binding that will be returned when calling bindContext.
 * @returns A new MockModel
 */
export function createMockModel(oMockListBinding?: MockListBinding, oMockContextBinding?: MockContextBinding): MockModel {
	const mocked = mock(ODataModel) as MockModel;
	mocked.fnOptimisticBatchEnabler = null;
	mocked.mockListBinding = oMockListBinding;
	mocked.mockContextBinding = oMockContextBinding;
	if (oMockListBinding) {
		oMockListBinding.setModel(mocked);
	}
	if (oMockContextBinding) {
		oMockContextBinding.setModel(mocked);
	}

	// Utility API
	mocked.setMetaModel = (oMetaModel: MockMetaModel) => {
		mocked.oMetaModel = oMetaModel;
	};

	// Default behavior
	mocked.mock.bindList.mockImplementation(() => {
		return mocked.mockListBinding;
	});
	mocked.mock.bindContext.mockImplementation(() => {
		return mocked.mockContextBinding;
	});
	mocked.mock.getMetaModel.mockImplementation(() => {
		return mocked.oMetaModel;
	});
	mocked.mock.isA.mockImplementation((sClassName: string) => {
		return sClassName === "sap.ui.model.odata.v4.ODataModel";
	});

	return mocked;
}
/**
 * For compatibility reasons, we keep a new operator. Use the factory function createMockModel instead.
 */
export const MockModel: new (oMockListBinding?: MockListBinding, oMockContextBinding?: MockContextBinding) => MockModel =
	createMockModel as any;
/**
 * Factory function to create a new MockModel used with a listBinding.
 * @param oMockListBinding A list binding that will be returned when calling bindList.
 * @returns A new MockModel
 */
export function createMockModelFromListBinding(oMockListBinding: MockListBinding): MockModel {
	return createMockModel(oMockListBinding);
}
/**
 *  Factory function to create a new MockModel used with a contextBinding.
 * @param oMockContextBinding A context binding that will be returned when calling bindContext.
 * @returns A new MockModel
 */
export function createMockModelFromContextBinding(oMockContextBinding: MockContextBinding): MockModel {
	return createMockModel(undefined, oMockContextBinding);
}

/**
 * Utility type to mock a sap.ui.core.mvc.View
 */
export type MockView = WithMock<FEView>;
/**
 * Factory function to create a new MockView.
 * @returns A new MockView
 */
export function createMockView(): MockView {
	const mocked = mock(View);

	// Default behavior
	mocked.mock.isA.mockImplementation((sClassName: string) => {
		return sClassName === "sap.ui.core.mvc.View";
	});

	return mocked as MockView;
}
/**
 * For compatibility reasons, we keep a new operator. Use the factory function createMockView instead.
 */
export const MockView: new () => MockView = createMockView as any;

/**
 * Utility type to mock a sap.fe.core.PageController
 */
export type MockController = WithMock<Controller> & {
	_routing: WithMock<InternalRouting>;
	_sideEffects: WithMock<SideEffects>;
	_intentBasedNavigation: WithMock<InternalIntentBasedNavigation>;
	editFlow: WithMock<EditFlow>;
	share: WithMock<Share>;
	recommendations: WithMock<Recommendations>;
	collaborativeDraft: WithMock<CollaborativeDraft>;
	messageHandler: WithMock<MessageHandler>;
	getAppComponent: () => WithMock<AppComponent>;
	getModel: () => MockModel;
};

/**
 * Factory function to create a new MockController.
 * @param model Optional model that should be returned by the getModel method
 * @returns A new MockController
 */
export function createMockController(model?: MockModel): MockController {
	const mocked = mock(Controller) as MockController;
	mocked._routing = mock(InternalRouting);
	mocked._sideEffects = mock(SideEffects);
	mocked._intentBasedNavigation = mock(InternalIntentBasedNavigation);
	mocked.editFlow = mock(EditFlow);
	mocked.share = mock(Share);
	mocked.collaborativeDraft = mock(CollaborativeDraft);
	mocked.recommendations = mock(Recommendations);
	mocked.messageHandler = mock(MessageHandler);
	mocked.getAppComponent = jest.fn().mockReturnValue(mock(AppComponent));
	// Default Behavior
	mocked.mock.getView.mockReturnValue(createMockView());
	mocked.mock.isA.mockReturnValue(false);
	mocked.getModel = jest.fn().mockReturnValue(model);

	return mocked;
}
/**
 * For compatibility reasons, we keep a new operator. Use the factory function mockController instead.
 */
export const MockController: new () => MockController = createMockController as any;

export interface MVCMock {
	model: MockModel;
	view: MockView;
	controller: MockController;
}
/**
 * Generate model, view and controller mocks that refer to each other.
 * @param existing Optional existing mocked instances that should be used
 * @returns Mocked model, view and controller instances
 */
export function mockMVC(existing?: Partial<MVCMock>): MVCMock {
	const model = existing?.model || createMockModel();
	const view = existing?.view || createMockView();
	const controller = existing?.controller || createMockController(model);

	view.mock.getController.mockReturnValue(controller);
	view.mock.getModel.mockReturnValue(model);
	controller.mock.getView.mockReturnValue(view);

	return { model, view, controller };
}

/**
 * To be used to load messages bundles for tests without app/page component.
 * @param textID ID of the Text
 * @param parameters Array of parameters that are used to create the text
 * @param metaPath Entity set name or action name to overload a text
 * @returns Determined text
 */
export function getText(textID: string, parameters?: any[], metaPath?: string) {
	const resourceModel = new ResourceModel({
		bundleName: "sap.fe.core.messagebundle",
		enhanceWith: [{ bundleName: "sap.fe.macros.messagebundle" }, { bundleName: "sap.fe.templates.messagebundle" }],
		async: false
	});
	return resourceModel.getText(textID, parameters, metaPath);
}

/**
 * Utility type to mock ResourceModel
 */
export type MockResourceModel = WithMock<ResourceModel>;
/**
 * Factory function to create a new MockView.
 * @returns A new MockView
 */
export function createMockResourceModel(): MockResourceModel {
	const mocked = mock(ResourceModel);
	mocked.getText = jest.fn().mockImplementation(getText);
	return mocked;
}
