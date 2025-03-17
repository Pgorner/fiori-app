import type { ExtensionOverrideExecution } from "sap/fe/base/ClassSupport";
import type Controller from "sap/ui/core/mvc/Controller";
import type XMLView from "sap/ui/core/mvc/XMLView";

/**
 * This type is to be extended with all controller extensions and methods that are hookable.
 */
type HookableControllerExtensions = {
	editFlow: {
		onAfterSave: true;
		onBeforeSave: true;
	};
	collaborationManager: {
		collectAvailableCards: true;
	};
	paginator: {
		initialize: true;
	};
	routing: {
		onAfterBinding: true;
	};
};

type HandlerConfiguration<CExtName extends keyof HookableControllerExtensions> = {
	name: CExtName;
	method: keyof HookableControllerExtensions[CExtName];
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HandlerRegistration = HandlerConfiguration<any> & { targetMethod: string };

type FunctionMap = {
	[key: string]: Function;
};
type DeepFunctionMap = {
	[key: string]: FunctionMap;
};
type HookMap = {
	hookedHandlers: {
		[key: string]: Function[];
	};
};

// Use two arrays as we cannot index a map through an arbitrary object instance
const registeredInstances: Function[] = [];
const registeredHandlers: HandlerRegistration[][] = [];

/**
 * Marks a controller extension method to be hookable by generating additional methods that can be used to attach and detach handlers at runtime.
 * @param execution
 * @returns A method decorator
 */
export function hookable(execution: ExtensionOverrideExecution): MethodDecorator {
	return function (target: unknown, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
		const indexableTarget = target as FunctionMap;

		indexableTarget[`attach${propertyKey.toString()}`] = function (fn: Function): void {
			const cExTInstanceHookMap = this as unknown as HookMap;
			if (!cExTInstanceHookMap.hookedHandlers) {
				cExTInstanceHookMap.hookedHandlers = {};
			}
			if (!cExTInstanceHookMap.hookedHandlers[propertyKey.toString()]) {
				cExTInstanceHookMap.hookedHandlers[propertyKey.toString()] = [];
			}
			cExTInstanceHookMap.hookedHandlers[propertyKey.toString()].push(fn);
		};
		indexableTarget[`detach${propertyKey.toString()}`] = function (fn: Function): void {
			const cExTInstanceHookMap = this as unknown as HookMap;
			const handlers = cExTInstanceHookMap.hookedHandlers[propertyKey.toString()];
			const index = handlers.indexOf(fn);
			if (index !== -1) {
				handlers.splice(index, 1);
			}
		};

		const oldValue = descriptor.value;
		if (execution === "BeforeAsync" || execution === "AfterAsync") {
			descriptor.value = async function (...args: unknown[]): Promise<unknown> {
				const cExTInstanceHookMap = this as unknown as HookMap;
				const handlers = (cExTInstanceHookMap?.hookedHandlers && cExTInstanceHookMap?.hookedHandlers[propertyKey.toString()]) || [];
				let returnValue: unknown;
				if (execution === "AfterAsync") {
					returnValue = await oldValue.bind(this)(...args);
				}
				for (const handler of handlers) {
					await handler.bind(this)(...args);
				}
				if (execution === "BeforeAsync") {
					returnValue = await oldValue.bind(this)(...args);
				}
				return returnValue;
			};
		} else {
			descriptor.value = function (...args: unknown[]): unknown {
				const cExTInstanceHookMap = this as unknown as HookMap;
				const handlers = (cExTInstanceHookMap?.hookedHandlers && cExTInstanceHookMap?.hookedHandlers[propertyKey.toString()]) || [];
				let returnValue: unknown;
				if (execution === "After") {
					returnValue = oldValue.bind(this)(...args);
				}
				for (const handler of handlers) {
					handler.bind(this)(...args);
				}
				if (execution === "Before") {
					returnValue = oldValue.bind(this)(...args);
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
function isAlreadyRegistered(existingRegistrations: HandlerRegistration[], newRegistration: HandlerRegistration): boolean {
	return !!existingRegistrations.find(
		(r) => r.name === newRegistration.name && r.method === newRegistration.method && r.targetMethod === newRegistration.targetMethod
	);
}

/**
 * Registers a method as controller extension hook handler.
 *
 * Currently, only methods of runtime building blocks are supported.
 * @param name Controller extension to hook into
 * @param method Method to hook into
 * @returns A method decorator
 */
export function controllerExtensionHandler<CExtName extends keyof HookableControllerExtensions>(
	name: CExtName,
	method: keyof HookableControllerExtensions[CExtName]
): MethodDecorator {
	return function (target: { constructor: Function }, propertyKey: string) {
		const newRegistration = { name, method: String(method), targetMethod: propertyKey };
		const index = registeredInstances.indexOf(target.constructor);

		// We need to check if this exact handler is already registered as handlers are registered statically (on the constructor)
		if (index !== -1 && !isAlreadyRegistered(registeredHandlers[index], newRegistration)) {
			registeredHandlers[index].push(newRegistration);
		} else {
			registeredInstances.push(target.constructor);
			registeredHandlers.push([newRegistration]);
		}
	} as MethodDecorator;
}

/**
 * Initializes all controller extension handlers registered for a given target.
 * @param target Target class to initialize the handlers for
 * @param target.constructor
 * @param controller PageController instance to get the controller extensions instances from
 */
export function initControllerExtensionHookHandlers(target: { constructor: Function }, controller: Controller): void {
	const index = registeredInstances.indexOf(target.constructor);
	if (index !== -1) {
		const indexableController = controller as unknown as DeepFunctionMap;
		const indexableTarget = target as unknown as FunctionMap;

		for (const registeredHandler of registeredHandlers[index]) {
			const handlerFunction = indexableTarget[registeredHandler.targetMethod].bind(target);

			indexableController[registeredHandler.name][`attach${String(registeredHandler.method)}`](handlerFunction);
			controller.getView()?.attachBeforeExit(() => {
				indexableController[registeredHandler.name][`detach${String(registeredHandler.method)}`](handlerFunction);
			});
		}
	}
}

export function xmlViewPreprocessor(source: object, _caller?: unknown, _settings?: object): void {
	const sourceView = source as XMLView;
	const controller = sourceView.getController() as Controller | undefined;
	if (controller) {
		const macroAPIChild = sourceView.findAggregatedObjects(true, (s) => s.isA("sap.fe.macros.MacroAPI"));
		for (const managedObject of macroAPIChild) {
			initControllerExtensionHookHandlers(managedObject, controller);
		}
	}
}
