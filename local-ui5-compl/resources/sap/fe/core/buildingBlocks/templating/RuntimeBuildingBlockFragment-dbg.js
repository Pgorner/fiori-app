/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/base/BindingToolkit", "sap/fe/base/ClassSupport", "sap/fe/base/HookSupport", "sap/fe/base/jsx-runtime/jsx", "sap/fe/core/CommonUtils", "sap/m/Label", "sap/ui/base/ManagedObject", "sap/ui/core/Component", "sap/ui/core/Fragment", "sap/ui/model/json/JSONModel"], function (BindingToolkit, ClassSupport, HookSupport, jsx, CommonUtils, Label, ManagedObject, Component, Fragment, JSONModel) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5;
  var _exports = {};
  var initControllerExtensionHookHandlers = HookSupport.initControllerExtensionHookHandlers;
  var event = ClassSupport.event;
  var defineUI5Class = ClassSupport.defineUI5Class;
  var aggregation = ClassSupport.aggregation;
  var resolveBindingString = BindingToolkit.resolveBindingString;
  function _initializerDefineProperty(e, i, r, l) { r && Object.defineProperty(e, i, { enumerable: r.enumerable, configurable: r.configurable, writable: r.writable, value: r.initializer ? r.initializer.call(l) : void 0 }); }
  function _inheritsLoose(t, o) { t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o); }
  function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
  function _applyDecoratedDescriptor(i, e, r, n, l) { var a = {}; return Object.keys(n).forEach(function (i) { a[i] = n[i]; }), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = !0), a = r.slice().reverse().reduce(function (r, n) { return n(i, e, r) || r; }, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a; }
  function _initializerWarningHelper(r, e) { throw Error("Decorating class property failed. Please ensure that transform-class-properties is enabled and runs after the decorators transform."); }
  /**
   * Internal extension to the Fragment class in order to add some place to hold functions for runtime building blocks
   */
  let RuntimeBuildingBlockFragment = (_dec = defineUI5Class("sap.fe.core.buildingBlocks.templating.RuntimeBuildingBlockFragment"), _dec2 = event(), _dec3 = aggregation({
    type: "sap.ui.core.Control"
  }), _dec4 = aggregation({
    type: "sap.ui.core.Control[]",
    multiple: true
  }), _dec5 = aggregation({
    type: "sap.ui.core.CustomData[]",
    multiple: true
  }), _dec6 = aggregation({
    type: "sap.ui.core.LayoutData"
  }), _dec(_class = (_class2 = /*#__PURE__*/function (_Fragment) {
    function RuntimeBuildingBlockFragment() {
      var _this;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      _this = _Fragment.call(this, ...args) || this;
      /*
       * Event to hold and resolve functions for runtime building blocks
       */
      _initializerDefineProperty(_this, "functionHolder", _descriptor, _this);
      _initializerDefineProperty(_this, "fragmentXML", _descriptor2, _this);
      _initializerDefineProperty(_this, "dependents", _descriptor3, _this);
      _initializerDefineProperty(_this, "customDataHolder", _descriptor4, _this);
      _initializerDefineProperty(_this, "layoutData", _descriptor5, _this);
      return _this;
    }
    _exports = RuntimeBuildingBlockFragment;
    _inheritsLoose(RuntimeBuildingBlockFragment, _Fragment);
    return RuntimeBuildingBlockFragment;
  }(Fragment), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "functionHolder", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "fragmentXML", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "dependents", [_dec4], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "customDataHolder", [_dec5], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "layoutData", [_dec6], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _class2)) || _class);
  _exports = RuntimeBuildingBlockFragment;
  const RUNTIME_BLOCKS = {};
  /**
   * Stores the class of a runtime building block to be loaded whenever the building block is used at runtime.
   * @param BuildingBlockClass
   */
  function storeRuntimeBlock(BuildingBlockClass) {
    RUNTIME_BLOCKS[`${BuildingBlockClass.metadata.namespace ?? BuildingBlockClass.metadata.publicNamespace}.${BuildingBlockClass.metadata.name}`] = BuildingBlockClass;
  }
  _exports.storeRuntimeBlock = storeRuntimeBlock;
  RuntimeBuildingBlockFragment.registerType("FE_COMPONENTS", {
    load: async function (mSettings) {
      let buildingBlockDetail;
      try {
        buildingBlockDetail = await RUNTIME_BLOCKS[mSettings.fragmentName].load();
      } catch (e) {
        mSettings.loadErrorMessage = e;
      }
      return buildingBlockDetail;
    },
    init: function (mSettings) {
      // In case there was an error during the load process, exit early
      if (mSettings.loadErrorMessage) {
        return new Label({
          text: mSettings.loadErrorMessage
        });
      }
      let BuildingBlockClass = mSettings.fragmentContent;
      if (BuildingBlockClass === undefined) {
        // In some case we might have been called here synchronously (unstash case for instance), which means we didn't go through the load function
        BuildingBlockClass = RUNTIME_BLOCKS[mSettings.fragmentName];
      }
      if (BuildingBlockClass === undefined) {
        throw new Error(`No building block class for runtime building block ${mSettings.fragmentName} found`);
      }
      const classSettings = {};
      const feCustomData = mSettings.customData?.[0]?.mProperties?.value?.["sap.fe.core.buildingBlocks.templating"] || {};
      delete mSettings.customData;
      const functionHolder = mSettings.functionHolder ?? [];
      delete mSettings.functionHolder;

      // containingView can also be a fragment, so we have to use the controller (which could also be an ExtensionAPI) get the actual view
      const containingView = mSettings.containingView.getController?.()?.getView?.() ?? mSettings.containingView.getController?.()?.["_view"] ?? mSettings.containingView;
      const pageComponent = Component.getOwnerComponentFor(containingView);
      const appComponent = CommonUtils.getAppComponent(containingView);
      const metaModel = appComponent.getMetaModel();
      const pageModel = pageComponent.getModel("_pageModel");
      const functionStringInOrder = feCustomData.functionStringInOrder?.split(",");
      const propertiesAssignedToFunction = feCustomData.propertiesAssignedToFunction?.split(",") ?? [];
      for (const propertyName in BuildingBlockClass.metadata.properties) {
        const propertyMetadata = BuildingBlockClass.metadata.properties[propertyName];
        const pageModelContext = pageModel.createBindingContext(feCustomData[propertyName]);
        if (pageModelContext === null) {
          // value cannot be resolved, so it is either a runtime binding or a constant
          let value = feCustomData[propertyName];
          if (typeof value === "string") {
            if (propertyMetadata.bindable !== true) {
              // runtime bindings are not allowed, so convert strings into actual primitive types
              switch (propertyMetadata.type) {
                case "boolean":
                  value = value === "true";
                  break;
                case "number":
                  value = Number(value);
                  break;
              }
            } else {
              // runtime bindings are allowed, so resolve the values as BindingToolkit expressions
              value = resolveBindingString(value, propertyMetadata.type);
            }
          } else if (propertyMetadata.type === "function") {
            const functionIndex = propertiesAssignedToFunction.indexOf(propertyName);
            if (functionIndex > -1) {
              const functionString = functionStringInOrder[functionIndex];
              const targetFunction = functionHolder?.find(functionDef => functionDef[0]?._sapui_handlerName === functionString);
              // We use the _sapui_handlerName to identify which function is the one we want to bind here
              if (targetFunction && targetFunction.length > 1) {
                value = targetFunction[0].bind(targetFunction[1]);
              }
            }
          }
          classSettings[propertyName] = value;
        } else if (pageModelContext.getObject() !== undefined && propertyName !== "contextPath" && propertyName !== "metaPath") {
          // get value from page model
          classSettings[propertyName] = pageModelContext.getObject();
        } else {
          // bind to metamodel
          classSettings[propertyName] = metaModel.createBindingContext(feCustomData[propertyName]);
        }
      }
      return ManagedObject.runWithPreprocessors(() => {
        const renderedControl = jsx.withContext({
          view: containingView,
          appComponent: appComponent
        }, () => {
          const templateProcessingSettings = {
            models: {
              "sap.fe.i18n": containingView.getModel("sap.fe.i18n"),
              converterContext: containingView.getModel("_pageModel") ?? new JSONModel()
            },
            appComponent: appComponent,
            isRuntimeInstantiation: true
          };
          const buildingBlockInstance = new BuildingBlockClass(classSettings, {}, templateProcessingSettings);
          initControllerExtensionHookHandlers(buildingBlockInstance, containingView.getController());
          if (mSettings.fragmentXML) {
            if (mSettings.dependents) {
              for (const dependent of mSettings.dependents) {
                mSettings.fragmentXML.addDependent(dependent);
              }
              delete mSettings.dependents;
            }
            if (mSettings.customDataHolder) {
              for (const customDataHolder of mSettings.customDataHolder) {
                mSettings.fragmentXML.addCustomData(customDataHolder);
              }
              delete mSettings.customDataHolder;
            }
            if (mSettings.layoutData) {
              mSettings.fragmentXML.setAggregation("layoutData", mSettings.layoutData);
              delete mSettings.layoutData;
            }
          }
          return buildingBlockInstance.getContent?.(containingView, appComponent, mSettings.fragmentXML);
        });
        if (!this._bAsync) {
          this._aContent = renderedControl;
        }
        return renderedControl;
      }, {
        id: function (sId) {
          return mSettings.containingView.createId(sId);
        },
        settings: function (controlSettings) {
          const allAssociations = this.getMetadata().getAllAssociations();
          for (const associationDetailName of Object.keys(allAssociations)) {
            if (controlSettings[associationDetailName] !== undefined) {
              if (allAssociations[associationDetailName].multiple) {
                // Multiple association
                // The associated elements are indicated via local IDs; we need to change the references to global ones
                const associations = Array.isArray(controlSettings[associationDetailName]) ? controlSettings[associationDetailName] : [controlSettings[associationDetailName]];

                // Create global IDs for associations given as strings, not for already resolved ManagedObjects
                controlSettings[associationDetailName] = associations.map(association => typeof association === "string" ? mSettings.containingView.createId(association) : association);
              } else {
                // Single association
                const singleAssociationValue = controlSettings[associationDetailName];
                controlSettings[associationDetailName] = typeof singleAssociationValue === "string" ? mSettings.containingView.createId(singleAssociationValue) : singleAssociationValue;
              }
            }
          }
          return controlSettings;
        }
      });
    }
  });
  return _exports;
}, false);
//# sourceMappingURL=RuntimeBuildingBlockFragment-dbg.js.map
