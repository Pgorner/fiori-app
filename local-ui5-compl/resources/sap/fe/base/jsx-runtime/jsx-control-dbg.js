/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/base/BindingToolkit", "sap/m/Text", "sap/ui/base/DataType", "sap/ui/base/ManagedObject", "sap/ui/core/mvc/EventHandlerResolver"], function (Log, BindingToolkit, Text, DataType, ManagedObject, EventHandlerResolver) {
  "use strict";

  var bindingParser = ManagedObject.bindingParser;
  var isPathInModelExpression = BindingToolkit.isPathInModelExpression;
  var isConstant = BindingToolkit.isConstant;
  var isBindingToolkitExpression = BindingToolkit.isBindingToolkitExpression;
  var compileExpression = BindingToolkit.compileExpression;
  var compileConstant = BindingToolkit.compileConstant;
  const FL_DELEGATE = "fl:delegate";
  const CORE_REQUIRE = "core:require";
  const DT_DESIGNTIME = "dt:designtime";
  const addChildAggregation = function (aggregationChildren, aggregationName, child) {
    if (child === null || child === undefined || typeof child === "string") {
      return;
    }
    if (!aggregationChildren[aggregationName]) {
      aggregationChildren[aggregationName] = [];
    }
    if (isChildAnElement(child)) {
      aggregationChildren[aggregationName].push(child);
    } else if (Array.isArray(child)) {
      child.forEach(subChild => {
        addChildAggregation(aggregationChildren, aggregationName, subChild);
      });
    } else if (typeof child === "function") {
      aggregationChildren[aggregationName] = child;
    } else {
      Object.keys(child).forEach(childKey => {
        addChildAggregation(aggregationChildren, childKey, child[childKey]);
      });
    }
  };
  const isChildAnElement = function (children) {
    return children?.isA?.("sap.ui.core.Element");
  };
  const isAControl = function (children) {
    return !!children?.getMetadata;
  };
  function processAggregations(metadata, mSettings) {
    const metadataAggregations = metadata.getAllAggregations();
    const defaultAggregationName = metadata.getDefaultAggregationName();
    const aggregationChildren = {};
    addChildAggregation(aggregationChildren, defaultAggregationName, mSettings.children);
    delete mSettings.children;
    // find out which aggregation are bound (both in children and directly under it)
    Object.keys(metadataAggregations).forEach(aggregationName => {
      if (aggregationChildren[aggregationName] !== undefined) {
        if (mSettings.hasOwnProperty(aggregationName)) {
          if (typeof mSettings[aggregationName] === "string") {
            mSettings[aggregationName] = {
              path: mSettings[aggregationName]
            };
          }
          if (typeof aggregationChildren[aggregationName] === "function") {
            mSettings[aggregationName].factory = aggregationChildren[aggregationName];
          } else {
            mSettings[aggregationName].template = aggregationChildren[aggregationName][0];
          }
        } else {
          mSettings[aggregationName] = aggregationChildren[aggregationName];
        }
      }
    });
  }

  /**
   * Processes the properties.
   *
   * If the property is a bindingToolkit expression we need to compile it.
   * Else if the property is set as string (compiled binding expression returns string by default even if it's a boolean, int, etc.) and it doesn't match with expected
   * format the value is parsed to provide expected format.
   * @param metadata Metadata of the control
   * @param settings Settings of the control
   * @returns A map of late properties that need to be awaited after the control is created
   */
  function processProperties(metadata, settings) {
    let settingsKey;
    const lateProperties = {};
    const allEvents = metadata.getAllEvents();
    const allProperties = metadata.getAllProperties();
    for (settingsKey in settings) {
      const value = settings[settingsKey];
      if (isBindingToolkitExpression(value)) {
        const bindingToolkitExpression = value;
        if (isConstant(bindingToolkitExpression)) {
          settings[settingsKey] = compileConstant(bindingToolkitExpression, false, true, true);
        } else if (!Object.hasOwnProperty.call(allProperties, settingsKey)) {
          // Aggregation case - we need to compile the expression but as an object
          if (isPathInModelExpression(bindingToolkitExpression)) {
            settings[settingsKey] = {
              path: bindingToolkitExpression.path,
              model: bindingToolkitExpression.modelName
            };
          }
        } else {
          settings[settingsKey] = compileExpression(bindingToolkitExpression);
        }
      } else if (value !== null && typeof value === "object" && value.then) {
        lateProperties[settingsKey] = value;
        delete settings[settingsKey];
      } else if (typeof value === "string" && !value.startsWith("{")) {
        const propertyType = allProperties[settingsKey]?.getType?.();
        if (propertyType && propertyType instanceof DataType && ["boolean", "int", "float"].includes(propertyType.getName())) {
          settings[settingsKey] = propertyType.parseValue(value);
        }
      } else if (typeof value === "object" && value.__bindingInfo) {
        settings[settingsKey] = value.__bindingInfo;
      } else if (value === undefined) {
        if (Object.hasOwnProperty.call(allEvents, settingsKey)) {
          delete settings[settingsKey];
        }
      }
    }
    return lateProperties;
  }

  /**
   * Processes the command.
   *
   * Resolves the command set on the control via the intrinsic class attribute "jsx:command".
   * If no command has been set or the targeted event doesn't exist, no configuration is set.
   * @param metadata Metadata of the control
   * @param settings Settings of the control
   */
  function processCommand(metadata, settings) {
    const commandProperty = settings["jsx:command"];
    if (commandProperty) {
      const [command, eventName] = commandProperty.split("|");
      const event = metadata.getAllEvents()[eventName];
      if (event && command.startsWith("cmd:")) {
        settings[event.name] = EventHandlerResolver.resolveEventHandler(command);
      }
    }
    delete settings["jsx:command"];
  }
  const jsxControl = function (ControlType, settings, key, jsxContext) {
    let targetControl;
    if (ControlType?.isFragment) {
      targetControl = settings.children;
    } else if (ControlType?.isRuntime) {
      const runtimeBuildingBlock = new ControlType(settings);
      targetControl = runtimeBuildingBlock.getContent?.(jsxContext.view, jsxContext.appComponent);
    } else if (isAControl(ControlType)) {
      const metadata = ControlType.getMetadata();
      if (key !== undefined) {
        settings["key"] = key;
      }
      const lateProperties = processProperties(metadata, settings);
      processCommand(metadata, settings);
      processAggregations(metadata, settings);
      const classDef = settings.class;
      const refDef = settings.ref;
      const bindingDef = settings.binding;
      const flDelegate = settings[FL_DELEGATE];
      const dtDesigntime = settings[DT_DESIGNTIME];
      delete settings.ref;
      delete settings.class;
      delete settings.binding;
      delete settings[FL_DELEGATE];
      delete settings[DT_DESIGNTIME];
      delete settings[CORE_REQUIRE]; // Core require is not useful in control mode
      const targetControlInstance = new ControlType(settings);
      if (classDef) {
        targetControlInstance.addStyleClass(classDef);
      }
      if (refDef) {
        refDef.setCurrent(targetControlInstance);
      }
      const customSettings = targetControlInstance.data("sap-ui-custom-settings") ?? {};
      if (flDelegate) {
        customSettings["sap.ui.fl"] ??= {};
        customSettings["sap.ui.fl"].delegate = flDelegate;
      }
      if (dtDesigntime) {
        customSettings["sap.ui.dt"] ??= {};
        customSettings["sap.ui.dt"].designtime = dtDesigntime;
      }
      if (Object.keys(customSettings).length > 0) {
        targetControlInstance.data("sap-ui-custom-settings", customSettings);
      }
      if (bindingDef) {
        if (typeof bindingDef === "string") {
          const bindingInfo = bindingParser(bindingDef);
          if (bindingInfo) {
            targetControlInstance.bindElement({
              model: bindingInfo.model ?? undefined,
              path: bindingInfo.path
            });
          }
          targetControlInstance.bindElement(bindingDef);
        } else {
          // We consider it's an object
          Object.keys(bindingDef).forEach(bindingDefKey => {
            targetControlInstance.bindElement({
              model: bindingDefKey,
              path: bindingDef[bindingDefKey]
            });
          });
        }
      }
      for (const latePropertiesKey in lateProperties) {
        lateProperties[latePropertiesKey].then(value => {
          return targetControlInstance.setProperty(latePropertiesKey, value);
        }).catch(error => {
          Log.error(`Couldn't set property ${latePropertiesKey} on ${ControlType.getMetadata().getName()}`, error, "jsxControl");
        });
      }
      targetControl = targetControlInstance;
    } else if (typeof ControlType === "function") {
      const controlTypeFn = ControlType;
      targetControl = controlTypeFn(settings);
    } else {
      targetControl = new Text({
        text: "Missing component " + ControlType
      });
    }
    return targetControl;
  };
  return jsxControl;
}, false);
//# sourceMappingURL=jsx-control-dbg.js.map
