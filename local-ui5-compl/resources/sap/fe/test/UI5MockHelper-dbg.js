/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["@sap-ux/jest-mock-ui5/dist/generic", "sap/fe/core/AppComponent", "sap/fe/core/ResourceModel", "sap/fe/core/controllerextensions/CollaborativeDraft", "sap/fe/core/controllerextensions/EditFlow", "sap/fe/core/controllerextensions/InternalIntentBasedNavigation", "sap/fe/core/controllerextensions/InternalRouting", "sap/fe/core/controllerextensions/MessageHandler", "sap/fe/core/controllerextensions/Recommendations", "sap/fe/core/controllerextensions/Share", "sap/fe/core/controllerextensions/SideEffects", "sap/ui/base/Event", "sap/ui/core/mvc/Controller", "sap/ui/core/mvc/View", "sap/ui/model/CompositeBinding", "sap/ui/model/odata/v4/Context", "sap/ui/model/odata/v4/ODataContextBinding", "sap/ui/model/odata/v4/ODataListBinding", "sap/ui/model/odata/v4/ODataMetaModel", "sap/ui/model/odata/v4/ODataModel", "sap/ui/model/odata/v4/ODataPropertyBinding"], function (generic, AppComponent, ResourceModel, CollaborativeDraft, EditFlow, InternalIntentBasedNavigation, InternalRouting, MessageHandler, Recommendations, Share, SideEffects, Event, Controller, View, CompositeBinding, Context, ODataContextBinding, ODataListBinding, ODataMetaModel, ODataModel, ODataPropertyBinding) {
  "use strict";

  var _exports = {};
  var mock = generic.mock;
  /**
   * Utility type to mock a sap.ui.model.odata.v4.Context
   */

  /**
   * Factory function to create a new MockContext.
   * @param oContextData A map of the different properties of the context. The value for the key '$path' will be returned by the 'getPath' method
   * @param oBinding The binding of the context
   * @param isInactive Is the context iniactive or not
   * @returns A new MockContext
   */
  function createMockContext(oContextData, oBinding, isInactive) {
    // Ugly workaround to get a proper mock pbject, as Context isn't properly exported from UI5
    const mocked = mock(Object.getPrototypeOf(Context.createNewContext(null, null, "/e")));
    mocked._isKeptAlive = false;
    mocked._contextData = oContextData || {};
    mocked._oBinding = oBinding;
    mocked._isInactive = !!isInactive;

    // Default behavior
    mocked.mock.isA.mockImplementation(sClassName => {
      return sClassName === "sap.ui.model.odata.v4.Context";
    });
    mocked.mock.getProperty.mockImplementation(key => {
      return mocked._contextData[key];
    });
    mocked.mock.requestProperty.mockImplementation(keyOrKeys => {
      if (Array.isArray(keyOrKeys)) {
        return Promise.resolve(keyOrKeys.map(key => mocked._contextData[key]));
      }
      return Promise.resolve(mocked._contextData[keyOrKeys]);
    });
    mocked.mock.requestObject.mockImplementation(key => {
      return key ? Promise.resolve(mocked._contextData[key]) : mocked._contextData;
    });
    mocked.mock.setProperty.mockImplementation((key, value) => {
      mocked._contextData[key] = value;
      return mocked._contextData[key];
    });
    mocked.mock.getObject.mockImplementation(path => {
      let result = path ? mocked._contextData[path] : mocked._contextData;
      if (!result && path && path.includes("/")) {
        const parts = path.split("/");
        result = parts.reduce((sum, part) => {
          sum = part ? sum[part] : sum;
          return sum;
        }, mocked._contextData);
      }
      return result;
    });
    mocked.mock.getPath.mockImplementation(() => mocked._contextData["$path"]);
    mocked.mock.getBinding.mockImplementation(() => mocked._oBinding);
    mocked.mock.getModel.mockImplementation(() => mocked._oBinding?.getModel());
    mocked.mock.setKeepAlive.mockImplementation((bool, _fnOnBeforeDestroy, _bRequestMessages) => {
      mocked._isKeptAlive = bool;
    });
    mocked.mock.isKeepAlive.mockImplementation(() => mocked._isKeptAlive);
    mocked.mock.isInactive.mockImplementation(() => mocked._isInactive);
    return mocked;
  }
  /**
   * For compatibility reasons, we keep a new operator. Use the factory function createMockContext instead.
   */
  _exports.createMockContext = createMockContext;
  const MockContext = createMockContext;

  /**
   * Utility type to mock a sap.ui.base.Event
   */
  _exports.MockContext = MockContext;
  /**
   * Factory function to create a new MockEvent.
   * @param params The parameters of the event
   * @param source
   * @returns A new MockEvent
   */
  function createMockEvent(params, source) {
    const mocked = mock(Event);
    mocked._params = params || {};
    if (source) {
      mocked.mock.getSource.mockReturnValue(source);
    }

    // Default behavior
    mocked.mock.getParameter.mockImplementation(name => mocked._params[name]);
    mocked.mock.getParameters.mockImplementation(() => {
      return mocked._params;
    });
    return mocked;
  }
  /**
   * For compatibility reasons, we keep a new operator. Use the factory function createMockEvent instead.
   */
  _exports.createMockEvent = createMockEvent;
  const MockEvent = createMockEvent;

  /**
   * Utility type to mock a sap.ui.model.odata.v4.ODataListBinding
   */
  _exports.MockEvent = MockEvent;
  /**
   * Factory function to create a new MockListBinding.
   * @param aContextData An array of objects holding the different properties of the contexts referenced by the ListBinding
   * @param oMockModel The model of the ListBinding
   * @returns A new MockListBinding
   */
  function createMockListBinding(aContextData, oMockModel) {
    const mocked = mock(ODataListBinding);
    aContextData = aContextData || [];
    mocked._aMockContexts = aContextData.map(contextData => {
      return createMockContext(contextData, mocked);
    });
    mocked._mockModel = oMockModel;

    // Utility API
    mocked.setModel = model => {
      mocked._mockModel = model;
    };

    // Default behavior
    mocked.mock.isA.mockImplementation(sClassName => {
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
  _exports.createMockListBinding = createMockListBinding;
  const MockListBinding = createMockListBinding;

  /**
   * Utility type to mock a sap.ui.model.odata.v4.ODataPropertyBinding
   */
  _exports.MockListBinding = MockListBinding;
  /**
   * Factory function to create a new MockPropertyBinding.
   * @param value The value returnd by the PropertyBinding
   * @param path The path of the PropertyBinding
   * @param oMockModel The model of the PropertyBinding
   * @returns A new MockPropertyBinding
   */
  function createMockPropertyBinding(value, path, oMockModel) {
    const mocked = mock(ODataPropertyBinding);
    mocked._mockModel = oMockModel;
    mocked._value = value;
    mocked._path = path;

    // Default behavior
    mocked.mock.isA.mockImplementation(sClassName => {
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
  _exports.createMockPropertyBinding = createMockPropertyBinding;
  const MockPropertyBinding = createMockPropertyBinding;

  /**
   * Utility type to mock a sap.ui.model.CompositeBinding
   */
  _exports.MockPropertyBinding = MockPropertyBinding;
  /**
   * Factory function to create a new MockCompositeBinding.
   * @param aBindings The bindings of the CompositeBinding
   * @returns A new MockCompositeBinding
   */
  function createMockCompositeBinding(aBindings) {
    const mocked = mock(CompositeBinding);
    mocked._aBindings = aBindings;

    // Default behavior
    mocked.mock.isA.mockImplementation(sClassName => {
      return sClassName === "sap.ui.model.CompositeBinding";
    });
    mocked.mock.getBindings.mockImplementation(() => {
      return mocked._aBindings;
    });
    mocked.mock.getValue.mockImplementation(() => {
      return mocked._aBindings.map(binding => binding.getValue());
    });
    return mocked;
  }
  /**
   * For compatibility reasons, we keep a new operator. Use the factory function createMockCompositeBinding instead.
   */
  _exports.createMockCompositeBinding = createMockCompositeBinding;
  const MockCompositeBinding = createMockCompositeBinding;

  /**
   * Utility type to mock a sap.ui.model.odata.v4.ODataContextBinding
   */
  _exports.MockCompositeBinding = MockCompositeBinding;
  /**
   * Factory function to create a new MockContextBinding.
   * @param oContext The context of the ContextBinding
   * @param oMockModel The model of the ContextBinding
   * @returns A new MockContextBinding
   */
  function createMockContextBinding(oContext, oMockModel) {
    const mocked = mock(ODataContextBinding);
    mocked.mockModel = oMockModel;
    mocked.oMockContext = createMockContext(oContext || {}, mocked);

    // Utility API
    mocked.getInternalMockContext = () => {
      return mocked.oMockContext;
    };
    mocked.setModel = oModel => {
      mocked.mockModel = oModel;
    };

    // Default behavior
    mocked.mock.isA.mockImplementation(sClassName => {
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
  _exports.createMockContextBinding = createMockContextBinding;
  const MockContextBinding = createMockContextBinding;

  /**
   * Utility type to mock a sap.ui.model.odata.v4.ODataMetaModel
   */
  _exports.MockContextBinding = MockContextBinding;
  /**
   * Factory function to create a new MockMetaModel.
   * @param oMetaData A map of the different metadata properties of the MetaModel (path -> value).
   * @returns A new MockMetaModel
   */
  function createMockMetaModel(oMetaData) {
    const mocked = mock(ODataMetaModel);
    mocked.oMetaContext = createMockContext(oMetaData || {});

    // Default behavior
    mocked.mock.getMetaContext.mockImplementation(sPath => {
      return createMockContext({
        $path: sPath
      });
    });
    mocked.mock.getObject.mockImplementation(sPath => {
      return mocked.oMetaContext.getProperty(sPath);
    });
    mocked.mock.createBindingContext.mockImplementation(sPath => {
      return createMockContext({
        $path: sPath
      });
    });
    mocked.mock.getMetaPath.mockImplementation(sPath => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const metamodel = new ODataMetaModel();
      return sPath ? metamodel.getMetaPath(sPath) : sPath;
    });
    mocked.mock.isA.mockImplementation(sClassName => {
      return sClassName === "sap.ui.model.odata.v4.ODataMetaModel";
    });
    return mocked;
  }
  /**
   * For compatibility reasons, we keep a new operator. Use the factory function createMockMetaModel instead.
   */
  _exports.createMockMetaModel = createMockMetaModel;
  const MockMetaModel = createMockMetaModel;

  /**
   * Utility type to mock a sap.ui.model.odata.v4.ODataModel
   */
  _exports.MockMetaModel = MockMetaModel;
  /**
   * Factory function to create a new MockModel.
   * @param oMockListBinding A list binding that will be returned when calling bindList.
   * @param oMockContextBinding A context binding that will be returned when calling bindContext.
   * @returns A new MockModel
   */
  function createMockModel(oMockListBinding, oMockContextBinding) {
    const mocked = mock(ODataModel);
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
    mocked.setMetaModel = oMetaModel => {
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
    mocked.mock.isA.mockImplementation(sClassName => {
      return sClassName === "sap.ui.model.odata.v4.ODataModel";
    });
    return mocked;
  }
  /**
   * For compatibility reasons, we keep a new operator. Use the factory function createMockModel instead.
   */
  _exports.createMockModel = createMockModel;
  const MockModel = createMockModel;
  /**
   * Factory function to create a new MockModel used with a listBinding.
   * @param oMockListBinding A list binding that will be returned when calling bindList.
   * @returns A new MockModel
   */
  _exports.MockModel = MockModel;
  function createMockModelFromListBinding(oMockListBinding) {
    return createMockModel(oMockListBinding);
  }
  /**
   *  Factory function to create a new MockModel used with a contextBinding.
   * @param oMockContextBinding A context binding that will be returned when calling bindContext.
   * @returns A new MockModel
   */
  _exports.createMockModelFromListBinding = createMockModelFromListBinding;
  function createMockModelFromContextBinding(oMockContextBinding) {
    return createMockModel(undefined, oMockContextBinding);
  }

  /**
   * Utility type to mock a sap.ui.core.mvc.View
   */
  _exports.createMockModelFromContextBinding = createMockModelFromContextBinding;
  /**
   * Factory function to create a new MockView.
   * @returns A new MockView
   */
  function createMockView() {
    const mocked = mock(View);

    // Default behavior
    mocked.mock.isA.mockImplementation(sClassName => {
      return sClassName === "sap.ui.core.mvc.View";
    });
    return mocked;
  }
  /**
   * For compatibility reasons, we keep a new operator. Use the factory function createMockView instead.
   */
  _exports.createMockView = createMockView;
  const MockView = createMockView;

  /**
   * Utility type to mock a sap.fe.core.PageController
   */
  _exports.MockView = MockView;
  /**
   * Factory function to create a new MockController.
   * @param model Optional model that should be returned by the getModel method
   * @returns A new MockController
   */
  function createMockController(model) {
    const mocked = mock(Controller);
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
  _exports.createMockController = createMockController;
  const MockController = createMockController;
  _exports.MockController = MockController;
  /**
   * Generate model, view and controller mocks that refer to each other.
   * @param existing Optional existing mocked instances that should be used
   * @returns Mocked model, view and controller instances
   */
  function mockMVC(existing) {
    const model = existing?.model || createMockModel();
    const view = existing?.view || createMockView();
    const controller = existing?.controller || createMockController(model);
    view.mock.getController.mockReturnValue(controller);
    view.mock.getModel.mockReturnValue(model);
    controller.mock.getView.mockReturnValue(view);
    return {
      model,
      view,
      controller
    };
  }

  /**
   * To be used to load messages bundles for tests without app/page component.
   * @param textID ID of the Text
   * @param parameters Array of parameters that are used to create the text
   * @param metaPath Entity set name or action name to overload a text
   * @returns Determined text
   */
  _exports.mockMVC = mockMVC;
  function getText(textID, parameters, metaPath) {
    const resourceModel = new ResourceModel({
      bundleName: "sap.fe.core.messagebundle",
      enhanceWith: [{
        bundleName: "sap.fe.macros.messagebundle"
      }, {
        bundleName: "sap.fe.templates.messagebundle"
      }],
      async: false
    });
    return resourceModel.getText(textID, parameters, metaPath);
  }

  /**
   * Utility type to mock ResourceModel
   */
  _exports.getText = getText;
  /**
   * Factory function to create a new MockView.
   * @returns A new MockView
   */
  function createMockResourceModel() {
    const mocked = mock(ResourceModel);
    mocked.getText = jest.fn().mockImplementation(getText);
    return mocked;
  }
  _exports.createMockResourceModel = createMockResourceModel;
  return _exports;
}, false);
//# sourceMappingURL=UI5MockHelper-dbg.js.map
