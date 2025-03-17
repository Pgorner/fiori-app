/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define([], function () {
  "use strict";

  var _exports = {};
  /**
   * This type is to be extended with all controller extensions and methods that are hookable.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // Use two arrays as we cannot index a map through an arbitrary object instance
  const registeredInstances = [];
  const registeredHandlers = [];

  /**
   * Marks a controller extension method to be hookable by generating additional methods that can be used to attach and detach handlers at runtime.
   * @param execution
   * @returns A method decorator
   */
  function hookable(execution) {
    return function (target, propertyKey, descriptor) {
      const indexableTarget = target;
      indexableTarget[`attach${propertyKey.toString()}`] = function (fn) {
        const cExTInstanceHookMap = this;
        if (!cExTInstanceHookMap.hookedHandlers) {
          cExTInstanceHookMap.hookedHandlers = {};
        }
        if (!cExTInstanceHookMap.hookedHandlers[propertyKey.toString()]) {
          cExTInstanceHookMap.hookedHandlers[propertyKey.toString()] = [];
        }
        cExTInstanceHookMap.hookedHandlers[propertyKey.toString()].push(fn);
      };
      indexableTarget[`detach${propertyKey.toString()}`] = function (fn) {
        const cExTInstanceHookMap = this;
        const handlers = cExTInstanceHookMap.hookedHandlers[propertyKey.toString()];
        const index = handlers.indexOf(fn);
        if (index !== -1) {
          handlers.splice(index, 1);
        }
      };
      const oldValue = descriptor.value;
      if (execution === "BeforeAsync" || execution === "AfterAsync") {
        descriptor.value = async function () {
          const cExTInstanceHookMap = this;
          const handlers = cExTInstanceHookMap?.hookedHandlers && cExTInstanceHookMap?.hookedHandlers[propertyKey.toString()] || [];
          let returnValue;
          if (execution === "AfterAsync") {
            returnValue = await oldValue.bind(this)(...arguments);
          }
          for (const handler of handlers) {
            await handler.bind(this)(...arguments);
          }
          if (execution === "BeforeAsync") {
            returnValue = await oldValue.bind(this)(...arguments);
          }
          return returnValue;
        };
      } else {
        descriptor.value = function () {
          const cExTInstanceHookMap = this;
          const handlers = cExTInstanceHookMap?.hookedHandlers && cExTInstanceHookMap?.hookedHandlers[propertyKey.toString()] || [];
          let returnValue;
          if (execution === "After") {
            returnValue = oldValue.bind(this)(...arguments);
          }
          for (const handler of handlers) {
            handler.bind(this)(...arguments);
          }
          if (execution === "Before") {
            returnValue = oldValue.bind(this)(...arguments);
          }
          return returnValue;
        };
      }
    };
  }

  /**
   * Checks whether a newRegistration is already included in some existingRegistrations by comparing all relevant attributes.
   * @param existingRegistrations
   * @param newRegistration
   * @returns Result of the check
   */
  _exports.hookable = hookable;
  function isAlreadyRegistered(existingRegistrations, newRegistration) {
    return !!existingRegistrations.find(r => r.name === newRegistration.name && r.method === newRegistration.method && r.targetMethod === newRegistration.targetMethod);
  }

  /**
   * Registers a method as controller extension hook handler.
   *
   * Currently, only methods of runtime building blocks are supported.
   * @param name Controller extension to hook into
   * @param method Method to hook into
   * @returns A method decorator
   */
  function controllerExtensionHandler(name, method) {
    return function (target, propertyKey) {
      const newRegistration = {
        name,
        method: String(method),
        targetMethod: propertyKey
      };
      const index = registeredInstances.indexOf(target.constructor);

      // We need to check if this exact handler is already registered as handlers are registered statically (on the constructor)
      if (index !== -1 && !isAlreadyRegistered(registeredHandlers[index], newRegistration)) {
        registeredHandlers[index].push(newRegistration);
      } else {
        registeredInstances.push(target.constructor);
        registeredHandlers.push([newRegistration]);
      }
    };
  }

  /**
   * Initializes all controller extension handlers registered for a given target.
   * @param target Target class to initialize the handlers for
   * @param target.constructor
   * @param controller PageController instance to get the controller extensions instances from
   */
  _exports.controllerExtensionHandler = controllerExtensionHandler;
  function initControllerExtensionHookHandlers(target, controller) {
    const index = registeredInstances.indexOf(target.constructor);
    if (index !== -1) {
      const indexableController = controller;
      const indexableTarget = target;
      for (const registeredHandler of registeredHandlers[index]) {
        const handlerFunction = indexableTarget[registeredHandler.targetMethod].bind(target);
        indexableController[registeredHandler.name][`attach${String(registeredHandler.method)}`](handlerFunction);
        controller.getView()?.attachBeforeExit(() => {
          indexableController[registeredHandler.name][`detach${String(registeredHandler.method)}`](handlerFunction);
        });
      }
    }
  }
  _exports.initControllerExtensionHookHandlers = initControllerExtensionHookHandlers;
  function xmlViewPreprocessor(source, _caller, _settings) {
    const sourceView = source;
    const controller = sourceView.getController();
    if (controller) {
      const macroAPIChild = sourceView.findAggregatedObjects(true, s => s.isA("sap.fe.macros.MacroAPI"));
      for (const managedObject of macroAPIChild) {
        initControllerExtensionHookHandlers(managedObject, controller);
      }
    }
  }
  _exports.xmlViewPreprocessor = xmlViewPreprocessor;
  return _exports;
}, false);
//# sourceMappingURL=HookSupport-dbg.js.map
