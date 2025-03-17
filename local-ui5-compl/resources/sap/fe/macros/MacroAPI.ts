import merge from "sap/base/util/merge";
import uid from "sap/base/util/uid";
import type { PropertiesOf } from "sap/fe/base/ClassSupport";
import { aggregation, defineUI5Class, implementInterface, property } from "sap/fe/base/ClassSupport";
import type PageController from "sap/fe/core/PageController";
import BuildingBlock from "sap/fe/core/buildingBlocks/BuildingBlock";
import type { TemplateProcessorSettings } from "sap/fe/core/buildingBlocks/templating/BuildingBlockTemplateProcessor";
import ConverterContext from "sap/fe/core/converters/ConverterContext";
import type { InternalModelContext } from "sap/fe/core/helpers/ModelHelper";
import type { DataModelObjectPath } from "sap/fe/core/templating/DataModelPathHelper";
import type { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import Component from "sap/ui/core/Component";
import type Control from "sap/ui/core/Control";
import type { $ControlSettings } from "sap/ui/core/Control";
import UIArea from "sap/ui/core/UIArea";
import type { IFormContent } from "sap/ui/core/library";
import type ClientContextBinding from "sap/ui/model/ClientContextBinding";
import type Context from "sap/ui/model/Context";
import type JSONModel from "sap/ui/model/json/JSONModel";

/**
 * Base API control for building blocks.
 * @hideconstructor
 * @public
 */
@defineUI5Class("sap.fe.macros.MacroAPI")
class MacroAPI extends BuildingBlock implements IFormContent {
	@implementInterface("sap.ui.core.IFormContent")
	__implements__sap_ui_core_IFormContent = true;

	static namespace = "sap.fe.macros";

	static macroName = "Macro";

	static fragment = "sap.fe.macros.Macro";

	static hasValidation = true;

	@aggregation({ type: "sap.ui.core.Control", multiple: false, isDefault: true })
	content!: Control;

	constructor(mSettings?: $ControlSettings & PropertiesOf<MacroAPI>, others?: $ControlSettings) {
		super(mSettings, others);
	}

	applySettings(mSettings: $ManagedObjectSettings, oScope?: object): this {
		// Cleanup events
		if (mSettings) {
			const eventsKeys = Object.keys(this.getMetadata().getEvents());
			for (const eventsKey of eventsKeys) {
				if (mSettings[eventsKey as keyof $ManagedObjectSettings] === undefined) {
					delete mSettings[eventsKey as keyof $ManagedObjectSettings];
				}
			}
		}

		return super.applySettings(mSettings, oScope);
	}

	init(): void {
		super.init();
		if (!this.getModel("_pageModel")) {
			const oPageModel = Component.getOwnerComponentFor(this)?.getModel("_pageModel");
			if (oPageModel) {
				this.setModel(oPageModel, "_pageModel");
			}
		}
	}

	/**
	 * Defines the path of the context used in the current page or block.
	 * This setting is defined by the framework.
	 * @public
	 */
	@property({ type: "string" })
	contextPath!: string;

	/**
	 * Defines the relative path of the property in the metamodel, based on the current contextPath.
	 * @public
	 */
	@property({ type: "string" })
	metaPath!: string;

	rerender(): void {
		(UIArea as unknown as { rerenderControl(control: Control): void }).rerenderControl(this.content);
	}

	getController(): PageController {
		return (this.getModel("$view") as JSONModel)?.getObject("/").getController() as PageController;
	}

	/**
	 * Retrieve a Converter Context.
	 * @param oDataModelPath
	 * @param contextPath
	 * @param mSettings
	 * @returns A Converter Context
	 */
	static getConverterContext = function (
		oDataModelPath: DataModelObjectPath<unknown>,
		contextPath: string,
		mSettings: TemplateProcessorSettings
	): ConverterContext {
		const oAppComponent = mSettings.appComponent;
		const viewData = mSettings.models.viewData && mSettings.models.viewData.getData();
		return ConverterContext.createConverterContextForMacro(
			oDataModelPath.startingEntitySet.name,
			mSettings.models.metaModel,
			oAppComponent && oAppComponent.getDiagnostics(),
			merge,
			oDataModelPath.contextLocation,
			viewData
		);
	};

	/**
	 * Create a Binding Context.
	 * @param oData
	 * @param mSettings
	 * @returns The binding context
	 */
	static createBindingContext = function (oData: object, mSettings: TemplateProcessorSettings): Context {
		const sContextPath = `/uid--${uid()}`;
		mSettings.models.converterContext.setProperty(sContextPath, oData);
		return mSettings.models.converterContext.createBindingContext(sContextPath)!;
	};

	parentContextToBind: Record<string, string> = {};

	/**
	 * Keep track of a binding context that should be assigned to the parent of that control.
	 * @param modelName The model name that the context will relate to
	 * @param path The path of the binding context
	 */
	setParentBindingContext(modelName: string, path: string): void {
		this.parentContextToBind[modelName] = path;
	}

	setParent(...args: unknown[]): void {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		super.setParent(...args);
		Object.keys(this.parentContextToBind).forEach((modelName) => {
			this.getParent()!.bindObject({
				path: this.parentContextToBind[modelName],
				model: modelName,
				events: {
					change: function (this: ClientContextBinding) {
						const oBoundContext = this.getBoundContext() as InternalModelContext;
						if (oBoundContext && !oBoundContext.getObject()) {
							oBoundContext.setProperty("", {});
						}
					}
				}
			});
		});
	}
}

export default MacroAPI;
