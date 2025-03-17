import Log from "sap/base/Log";
import type { BindingToolkitExpression } from "sap/fe/base/BindingToolkit";
import {
	compileConstant,
	compileExpression,
	isBindingToolkitExpression,
	isConstant,
	isPathInModelExpression
} from "sap/fe/base/BindingToolkit";
import type { BindingInfoHolder, NonAbstractClass } from "sap/fe/base/ClassSupport";
import type { ControlProperties, JSXContext, NonControlProperties, Ref } from "sap/fe/base/jsx-runtime/jsx";
import type BuildingBlockTemplatingBase from "sap/fe/core/buildingBlocks/templating/BuildingBlockTemplatingBase";
import type RuntimeBuildingBlock from "sap/fe/core/buildingBlocks/templating/RuntimeBuildingBlock";
import Text from "sap/m/Text";
import DataType from "sap/ui/base/DataType";
import { bindingParser } from "sap/ui/base/ManagedObject";
import type ManagedObjectMetadata from "sap/ui/base/ManagedObjectMetadata";
import type Control from "sap/ui/core/Control";
import type { $ControlSettings } from "sap/ui/core/Control";
import type { default as Element, default as UI5Element } from "sap/ui/core/Element";
import EventHandlerResolver from "sap/ui/core/mvc/EventHandlerResolver";

const FL_DELEGATE = "fl:delegate";
const CORE_REQUIRE = "core:require";
const DT_DESIGNTIME = "dt:designtime";
const addChildAggregation = function (
	aggregationChildren: Record<string, (string | UI5Element)[]>,
	aggregationName: string,
	child?: string | UI5Element | UI5Element[]
): void {
	if (child === null || child === undefined || typeof child === "string") {
		return;
	}
	if (!aggregationChildren[aggregationName]) {
		aggregationChildren[aggregationName] = [];
	}
	if (isChildAnElement(child)) {
		aggregationChildren[aggregationName].push(child);
	} else if (Array.isArray(child)) {
		child.forEach((subChild) => {
			addChildAggregation(aggregationChildren, aggregationName, subChild);
		});
	} else if (typeof child === "function") {
		aggregationChildren[aggregationName] = child;
	} else {
		Object.keys(child).forEach((childKey) => {
			addChildAggregation(aggregationChildren, childKey, child[childKey]);
		});
	}
};
const isChildAnElement = function (children?: unknown): children is Element {
	return (children as Element)?.isA?.("sap.ui.core.Element");
};
const isAControl = function (children?: typeof Control | Function): children is NonAbstractClass<Control> {
	return !!(children as typeof Control)?.getMetadata;
};

function processAggregations(metadata: ManagedObjectMetadata, mSettings: Record<string, unknown>): void {
	const metadataAggregations = metadata.getAllAggregations();
	const defaultAggregationName = metadata.getDefaultAggregationName();
	const aggregationChildren: Record<string, (string | UI5Element)[]> = {};
	addChildAggregation(aggregationChildren, defaultAggregationName, mSettings.children as string | UI5Element | UI5Element[]);
	delete mSettings.children;
	// find out which aggregation are bound (both in children and directly under it)
	Object.keys(metadataAggregations).forEach((aggregationName) => {
		if (aggregationChildren[aggregationName] !== undefined) {
			if (mSettings.hasOwnProperty(aggregationName)) {
				if (typeof mSettings[aggregationName] === "string") {
					mSettings[aggregationName] = {
						path: mSettings[aggregationName]
					};
				}
				if (typeof aggregationChildren[aggregationName] === "function") {
					(mSettings[aggregationName] as { factory: Function }).factory = aggregationChildren[
						aggregationName
					] as unknown as Function;
				} else {
					(mSettings[aggregationName] as { template: string | UI5Element }).template = aggregationChildren[aggregationName][0];
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
function processProperties(metadata: ManagedObjectMetadata, settings: Record<string, unknown>): Record<string, Promise<unknown>> {
	let settingsKey: keyof typeof settings;
	const lateProperties: Record<string, Promise<unknown>> = {};
	const allEvents = metadata.getAllEvents();
	const allProperties = metadata.getAllProperties();
	for (settingsKey in settings) {
		const value = settings[settingsKey];
		if (isBindingToolkitExpression(value)) {
			const bindingToolkitExpression: BindingToolkitExpression<unknown> = value;
			if (isConstant(bindingToolkitExpression)) {
				settings[settingsKey] = compileConstant(bindingToolkitExpression, false, true, true);
			} else if (!Object.hasOwnProperty.call(allProperties, settingsKey)) {
				// Aggregation case - we need to compile the expression but as an object
				if (isPathInModelExpression(bindingToolkitExpression)) {
					settings[settingsKey] = { path: bindingToolkitExpression.path, model: bindingToolkitExpression.modelName };
				}
			} else {
				settings[settingsKey] = compileExpression(bindingToolkitExpression);
			}
		} else if (value !== null && typeof value === "object" && (value as Promise<unknown>).then) {
			lateProperties[settingsKey] = value as Promise<unknown>;
			delete settings[settingsKey];
		} else if (typeof value === "string" && !value.startsWith("{")) {
			const propertyType = (allProperties[settingsKey] as { getType?: Function })?.getType?.();
			if (propertyType && propertyType instanceof DataType && ["boolean", "int", "float"].includes(propertyType.getName())) {
				settings[settingsKey] = propertyType.parseValue(value);
			}
		} else if (typeof value === "object" && (value as BindingInfoHolder<unknown>).__bindingInfo) {
			settings[settingsKey] = (value as BindingInfoHolder<unknown>).__bindingInfo;
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
function processCommand(metadata: ManagedObjectMetadata, settings: Record<string, unknown>): void {
	const commandProperty = settings["jsx:command"];
	if (commandProperty) {
		const [command, eventName] = (commandProperty as string).split("|");
		const event = metadata.getAllEvents()[eventName];
		if (event && command.startsWith("cmd:")) {
			settings[event.name] = EventHandlerResolver.resolveEventHandler(command);
		}
	}
	delete settings["jsx:command"];
}

const jsxControl = function <T extends Element>(
	ControlType: NonAbstractClass<Control> | Function,
	settings: NonControlProperties<T> & {
		key: string;
		children?: Element | ControlProperties<T>;
		ref?: Ref<T>;
		binding?: string;
		class?: string;
		[FL_DELEGATE]?: string;
		[DT_DESIGNTIME]?: string;
		[CORE_REQUIRE]?: string;
	},
	key: string,
	jsxContext: JSXContext
): Control | Control[] | undefined {
	let targetControl: Control | Control[] | undefined;

	if ((ControlType as { isFragment?: boolean })?.isFragment) {
		targetControl = settings.children as Control | Control[];
	} else if ((ControlType as typeof BuildingBlockTemplatingBase)?.isRuntime) {
		const runtimeBuildingBlock = new (ControlType as typeof RuntimeBuildingBlock)(settings as unknown as $ControlSettings);
		targetControl = runtimeBuildingBlock.getContent?.(jsxContext.view!, jsxContext.appComponent!);
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
		const targetControlInstance = new ControlType(settings as $ControlSettings);
		if (classDef) {
			targetControlInstance.addStyleClass(classDef);
		}
		if (refDef) {
			refDef.setCurrent(targetControlInstance as unknown as T);
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
					targetControlInstance.bindElement({ model: bindingInfo.model ?? undefined, path: bindingInfo.path });
				}
				targetControlInstance.bindElement(bindingDef);
			} else {
				// We consider it's an object
				Object.keys(bindingDef).forEach((bindingDefKey) => {
					targetControlInstance.bindElement({ model: bindingDefKey, path: bindingDef[bindingDefKey] });
				});
			}
		}
		for (const latePropertiesKey in lateProperties) {
			lateProperties[latePropertiesKey]
				.then((value) => {
					return targetControlInstance.setProperty(latePropertiesKey, value);
				})
				.catch((error) => {
					Log.error(`Couldn't set property ${latePropertiesKey} on ${ControlType.getMetadata().getName()}`, error, "jsxControl");
				});
		}
		targetControl = targetControlInstance;
	} else if (typeof ControlType === "function") {
		const controlTypeFn = ControlType;
		targetControl = controlTypeFn(settings as $ControlSettings);
	} else {
		targetControl = new Text({ text: "Missing component " + (ControlType as string) });
	}

	return targetControl;
};

export default jsxControl;
