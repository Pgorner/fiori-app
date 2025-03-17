import Log from "sap/base/Log";
import merge from "sap/base/util/merge";
import type { PropertiesOf } from "sap/fe/base/ClassSupport";
import { aggregation, defineUI5Class, event, implementInterface, property, xmlEventHandler } from "sap/fe/base/ClassSupport";
import type { ControlState, LegacyFilterBarState, NavigationParameter } from "sap/fe/core/controllerextensions/ViewState";
import type IViewStateContributor from "sap/fe/core/controllerextensions/viewState/IViewStateContributor";
import PromiseKeeper from "sap/fe/core/helpers/PromiseKeeper";
import MacroAPI from "sap/fe/macros/MacroAPI";
import type { IFilterControl } from "sap/fe/macros/filter/FilterUtils";
import FilterUtils from "sap/fe/macros/filter/FilterUtils";
import type FilterField from "sap/fe/macros/filterBar/FilterField";
import SemanticDateOperators from "sap/fe/macros/filterBar/SemanticDateOperators";
import type { ControlPropertyInfo } from "sap/fe/macros/mdc/adapter/StateHelper";
import stateHelper from "sap/fe/macros/mdc/adapter/StateHelper";
import type { InternalBindingInfo } from "sap/fe/macros/table/Utils";
import type { ExternalStateType } from "sap/fe/macros/valuehelp/ValueHelpDelegate";
import type SelectionVariant from "sap/fe/navigation/SelectionVariant";
import { NavType } from "sap/fe/navigation/library";
import type Input from "sap/m/Input";
import type { Input$ValueHelpRequestEventParameters } from "sap/m/Input";
import type { default as Event, default as UI5Event } from "sap/ui/base/Event";
import type ManagedObject from "sap/ui/base/ManagedObject";
import type { $ControlSettings } from "sap/ui/core/Control";
import UI5Element from "sap/ui/core/Element";
import type VariantManagement from "sap/ui/fl/variants/VariantManagement";
import type VariantModel from "sap/ui/fl/variants/VariantModel";
import type { VariantData } from "sap/ui/fl/variants/VariantModel";
import type Control from "sap/ui/mdc/Control";
import type FilterBar from "sap/ui/mdc/FilterBar";
import type ValueHelp from "sap/ui/mdc/ValueHelp";
import type { ValueHelp$SelectEvent } from "sap/ui/mdc/ValueHelp";
import type { ConditionObject } from "sap/ui/mdc/condition/Condition";
import FieldEditMode from "sap/ui/mdc/enums/FieldEditMode";
import type { FilterBarBase$SearchEvent } from "sap/ui/mdc/filterbar/FilterBarBase";
import type { Filter as StateUtilFilter } from "sap/ui/mdc/p13n/StateUtil";
import StateUtil from "sap/ui/mdc/p13n/StateUtil";
import type { PropertyInfo } from "sap/ui/mdc/util/PropertyHelper";
import type JSONModel from "sap/ui/model/json/JSONModel";

// Track telemetry content for the filterBar
class FilterBarTelemetry {
	private countFilterActions = 0;

	private countVariantFilters = 0;

	constructor(private readonly filterBarAPI: FilterBarAPI) {}

	onFiltersChanged(reason?: string): void {
		if (reason === "Variant") {
			this.countVariantFilters++;
		} else {
			this.countFilterActions++;
		}
	}

	onSearch(eventParameters: { reason?: string }, conditions: Record<string, ConditionObject[]>): void {
		const filterNames = this.getFilterNamesFromConditions(conditions);
		this.filterBarAPI.getController().telemetry.storeAction({
			type: "FE.FilterBarSearch",
			parameters: {
				countFilterActions: this.countFilterActions, //  How many filterChanged actions are performed
				countFilters: Object.keys(conditions).length, // How many different filters are applied
				countVariantFilters: this.countVariantFilters, // How many filter belong to a variant
				variantLayer: this.filterBarAPI.getVariant()?.layer ?? "None", // | "SAP" | "Custom"; // Type of variant
				autoLoad: eventParameters.reason === "Variant", // Is the filter automatically executed
				searchUsed: conditions.$search ? !!Object.keys(conditions.$search).length : false, // Was the search field in the filterbar used?
				filterNames: filterNames // Property names of the filters
			}
		});
		// Reset the count
		this.countFilterActions = 0;
		this.countVariantFilters = 0;
	}

	getFilterNamesFromConditions(conditions: Record<string, ConditionObject[]>): string {
		let filterNames = "";
		Object.keys(conditions).forEach((condition) => {
			if (condition != "$search") {
				filterNames += condition + ";";
			}
		});
		return filterNames;
	}
}

type FilterBarState = {
	innerState?: {
		filter?: Record<string, ConditionObject[]>;
		initialState?: LegacyFilterBarState;
		fullState?: LegacyFilterBarState;
	};
};

/**
 * Building block for creating a FilterBar based on the metadata provided by OData V4.
 * <br>
 * Usually, a SelectionFields annotation is expected.
 *
 *
 * Usage example:
 * <pre>
 * &lt;macros:FilterBar id="MyFilterBar" metaPath="@com.sap.vocabularies.UI.v1.SelectionFields" /&gt;
 * </pre>
 * @alias sap.fe.macros.FilterBar
 * @public
 */
@defineUI5Class("sap.fe.macros.filterBar.FilterBarAPI", {
	returnTypes: ["sap.ui.core.Control"]
})
class FilterBarAPI extends MacroAPI implements IViewStateContributor<FilterBarState> {
	@implementInterface("sap.fe.core.controllerextensions.viewState.IViewStateContributor")
	__implements__sap_fe_core_controllerextensions_viewState_IViewStateContributor = true;

	private initialControlState: Record<string, unknown> = {};

	private _initialStatePromise: PromiseKeeper<void> = new PromiseKeeper();

	async applyLegacyState(
		getControlState: (control: ManagedObject) => ControlState,
		_navParameters?: NavigationParameter,
		shouldApplyDiffState?: boolean,
		skipMerge?: boolean
	): Promise<void> {
		const filterBar = this.content;
		const filterBarState = getControlState(filterBar) as { initialState?: LegacyFilterBarState; fullState?: LegacyFilterBarState };
		const controlState: FilterBarState = {};

		if (filterBarState) {
			controlState.innerState = {
				...filterBarState,
				fullState: {
					...controlState.innerState?.fullState,
					...filterBarState.fullState
				},
				initialState: {
					...controlState.innerState?.initialState,
					...filterBarState.initialState
				}
			};
		}
		if (controlState && Object.keys(controlState).length > 0) {
			await this.applyState(controlState as object, _navParameters, shouldApplyDiffState, skipMerge);
		}
	}

	async applyState(
		controlState: FilterBarState,
		navParameter?: NavigationParameter,
		shouldApplyDiffState?: boolean,
		skipMerge?: boolean
	): Promise<void> {
		try {
			if (controlState && navParameter) {
				const navigationType = navParameter.navigationType;
				//When navigation type is hybrid, we override the filter conditions in IAppState with SV received from XappState
				if (navigationType === NavType.hybrid && controlState.innerState?.fullState !== undefined) {
					const xAppStateFilters = await this.convertSelectionVariantToStateFilters(
						navParameter.selectionVariant as SelectionVariant,
						true
					);

					const mergedFullState = {
						...controlState.innerState?.fullState,
						filter: {
							...controlState.innerState?.fullState.filter,
							...xAppStateFilters
						}
					};
					//when navigating from card, remove all existing filters values (default or otherwise) and then apply the state
					await this._clearFilterValuesWithOptions(this.content, { clearEditFilter: true });
					return await StateUtil.applyExternalState(this.content, mergedFullState);
				}

				if (shouldApplyDiffState) {
					const diffState: object = await StateUtil.diffState(
						this.content,
						controlState.innerState?.initialState as object,
						controlState.innerState?.fullState as object
					);
					return await StateUtil.applyExternalState(this.content, diffState);
				} else if (skipMerge) {
					//skipMerge is true when coming from the dynamic tile, in this case, remove all existing filters values (default or otherwise)
					await this._clearFilterValuesWithOptions(this.content, { clearEditFilter: true });
				}
				return await StateUtil.applyExternalState(this.content, controlState?.innerState?.fullState ?? controlState);
			}
		} catch (error: unknown) {
			Log.error(error as string);
		} finally {
			this._initialStatePromise.resolve();
		}
	}

	async waitForInitialState(): Promise<void> {
		return this._initialStatePromise.promise;
	}

	getControlState(controlState: ControlState): ControlState {
		const initialControlState: Record<string, unknown> = this.initialControlState;
		if (controlState) {
			return {
				fullState: controlState as object,
				initialState: initialControlState as object
			};
		}
		return controlState;
	}

	async retrieveState(): Promise<FilterBarState | null> {
		const filterBarState: FilterBarState = {};
		//const controlStateKey = this.getStateKey(filterBar);
		filterBarState.innerState = this.getControlState(await StateUtil.retrieveExternalState(this.content)) as {
			initialState?: LegacyFilterBarState;
			fullState?: LegacyFilterBarState;
		};
		// remove sensitive or view state irrelevant fields
		const propertiesInfo = this.content.getPropertyInfoSet();
		const filter = filterBarState.innerState?.filter || {};
		propertiesInfo
			.filter(function (propertyInfo: PropertyInfo & { removeFromAppState?: boolean }) {
				return (
					Object.keys(filter).length > 0 &&
					propertyInfo.path &&
					filter[propertyInfo.path] &&
					(propertyInfo.removeFromAppState || filter[propertyInfo.path].length === 0)
				);
			})
			.forEach(function (PropertyInfo: PropertyInfo) {
				if (PropertyInfo.path) {
					delete filter[PropertyInfo.path];
				}
			});
		return filterBarState;
	}

	async setInitialState(): Promise<void> {
		try {
			const initialControlState = await StateUtil.retrieveExternalState(this.content);
			this.initialControlState = initialControlState;
		} catch (e: unknown) {
			Log.error(e as string);
		}
	}

	/**
	 * The identifier of the FilterBar control.
	 */
	@property({ type: "string" })
	id!: string;

	/**
	 * Defines the relative path of the property in the metamodel, based on the current contextPath.
	 * @public
	 */
	@property({
		type: "string",
		expectedAnnotations: ["com.sap.vocabularies.UI.v1.SelectionFields"],
		expectedTypes: ["EntitySet", "EntityType"]
	})
	metaPath!: string;

	/**
	 * Defines the path of the context used in the current page or block.
	 * This setting is defined by the framework.
	 * @public
	 */
	@property({
		type: "string",
		expectedTypes: ["EntitySet", "EntityType", "NavigationProperty"]
	})
	contextPath!: string;

	/**
	 * If true, the search is triggered automatically when a filter value is changed.
	 * @public
	 */
	@property({ type: "boolean", defaultValue: false })
	liveMode?: boolean;

	/**
	 * Parameter which sets the visibility of the FilterBar building block
	 * @public
	 */
	@property({ type: "boolean", defaultValue: true })
	visible?: boolean;

	/**
	 * Displays possible errors during the search in a message box
	 * @public
	 */
	@property({ type: "boolean", defaultValue: true })
	showMessages?: boolean;

	/**
	 * Handles the visibility of the 'Clear' button on the FilterBar.
	 * @public
	 */
	@property({ type: "boolean", defaultValue: false })
	showClearButton?: boolean;

	/**
	 * Aggregate filter fields of the FilterBar building block
	 * @public
	 */
	@aggregation({ type: "sap.fe.macros.filterBar.FilterField", multiple: true })
	filterFields?: FilterField[];

	content!: FilterBar;

	/**
	 * This event is fired when the 'Go' button is pressed or after a condition change.
	 * @public
	 */
	@event()
	search!: string;

	/**
	 * This event is fired when the 'Go' button is pressed or after a condition change. This is only internally used by sap.fe (Fiori elements) and
	 * exposes parameters from internal MDC-FilterBar search event
	 * @private
	 */
	@event()
	internalSearch!: string;

	/**
	 * This event is fired after either a filter value or the visibility of a filter item has been changed. The event contains conditions that will be used as filters.
	 * @public
	 */
	@event()
	filterChanged!: string;

	/**
	 * This event is fired when the 'Clear' button is pressed. This is only possible when the 'Clear' button is enabled.
	 * @public
	 */
	@event()
	afterClear!: string;

	/**
	 * This event is fired after either a filter value or the visibility of a filter item has been changed. The event contains conditions that will be used as filters.
	 * This is used internally only by sap.fe (Fiori Elements). This exposes parameters from the MDC-FilterBar filterChanged event that is used by sap.fe in some cases.
	 * @private
	 */
	@event()
	internalFilterChanged!: string;

	private telemetry?: FilterBarTelemetry;

	constructor(props?: $ControlSettings & PropertiesOf<FilterBarAPI>, others?: $ControlSettings) {
		super(props, others);
		this.telemetry = new FilterBarTelemetry(this);
		this.attachStateChangeHandler();
	}

	private attachStateChangeHandler(): void {
		StateUtil.detachStateChange(this.stateChangeHandler);
		StateUtil.attachStateChange(this.stateChangeHandler);
	}

	stateChangeHandler(oEvent: Event<{ control: Control }>): void {
		const control = oEvent.getParameter("control");
		if (control.isA<FilterBar>("sap.ui.mdc.FilterBar")) {
			const filterBarAPI = control.getParent() as unknown as { handleStateChange?: Function };
			if (filterBarAPI?.handleStateChange) {
				filterBarAPI.handleStateChange();
			}
		}
	}

	@xmlEventHandler()
	handleSearch(oEvent: FilterBarBase$SearchEvent): void {
		const oFilterBar = oEvent.getSource() as FilterBar | undefined;
		const eventParameters = oEvent.getParameters();
		if (oFilterBar) {
			const conditions = (oFilterBar.getFilterConditions() ?? {}) as Record<string, ConditionObject[]>;
			const preparedEventParameters = this._prepareEventParameters(oFilterBar);
			this.telemetry?.onSearch(eventParameters, conditions);
			this.fireEvent("internalSearch", merge({ conditions: conditions }, eventParameters));
			this.fireEvent("search", merge({ reason: eventParameters.reason }, preparedEventParameters));
		}
	}

	@xmlEventHandler()
	handleFilterChanged(oEvent: UI5Event): void {
		const filterBar = oEvent.getSource() as FilterBar | undefined;
		const oEventParameters = oEvent.getParameters();
		if (filterBar) {
			const oConditions = filterBar.getFilterConditions();
			const eventParameters: object = this._prepareEventParameters(filterBar);
			this.telemetry?.onFiltersChanged(this._getFilterBarReason(filterBar));
			this.fireEvent("internalFilterChanged", merge({ conditions: oConditions }, oEventParameters));
			this.fireEvent("filterChanged", eventParameters);
		}
	}

	_getFilterBarReason(filterBar: FilterBar & { _sReason?: string }): string {
		return filterBar?._sReason ?? "";
	}

	_prepareEventParameters(oFilterBar: FilterBar): Partial<InternalBindingInfo> {
		const { parameters, filters, search } = FilterUtils.getFilters(oFilterBar as unknown as IFilterControl) || {};

		return { parameters, filters, search };
	}

	/**
	 * Set the filter values for the given property in the filter bar.
	 * The filter values can be either a single value or an array of values.
	 * Each filter value must be represented as a primitive value.
	 * @param sConditionPath The path to the property as a condition path
	 * @param [sOperator] The operator to be used (optional) - if not set, the default operator (EQ) will be used
	 * @param vValues The values to be applied
	 * @returns A promise for asynchronous handling
	 * @public
	 */
	async setFilterValues(
		sConditionPath: string,
		sOperator: string | undefined,
		vValues?: undefined | string | number | boolean | string[] | number[] | boolean[]
	): Promise<void> {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		if (arguments.length === 2) {
			vValues = sOperator;
			return FilterUtils.setFilterValues(this.content, sConditionPath, vValues);
		}
		return FilterUtils.setFilterValues(this.content, sConditionPath, sOperator, vValues);
	}

	/**
	 * Get the Active Filters Text Summary for the filter bar.
	 * @returns Active filters summary as text
	 * @public
	 */
	getActiveFiltersText(): string {
		return this.content?.getAssignedFiltersText()?.filtersText || "";
	}

	/**
	 * Provides all the filters that are currently active
	 * along with the search expression.
	 * @returns An array of active filters and the search expression.
	 * @public
	 */
	getFilters(): object {
		return FilterUtils.getFilters(this.content as IFilterControl) || {};
	}

	/**
	 * Triggers the API search on the filter bar.
	 * @returns Returns a promise which resolves if filter go is triggered successfully; otherwise gets rejected.
	 * @public
	 */
	async triggerSearch(): Promise<object | undefined> {
		const filterBar = this.content;
		try {
			if (filterBar) {
				await filterBar.waitForInitialization();
				return await filterBar.triggerSearch();
			}
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : String(err);
			Log.error(`FE : Buildingblock : FilterBar : ${message}`);
			throw Error(message);
		}
	}

	isSemanticDateFilterApplied(): boolean {
		return SemanticDateOperators.hasSemanticDateOperations(this.content.getConditions(), false);
	}

	/**
	 * Get the selection variant from the filter bar.
	 * @returns A promise which resolves with a {@link sap.fe.navigation.SelectionVariant}
	 * @public
	 */
	async getSelectionVariant(): Promise<SelectionVariant> {
		return stateHelper.getSelectionVariant(this.getContent());
	}

	/**
	 * Get the list of mandatory filter property names.
	 * @returns The list of mandatory filter property names
	 */
	getMandatoryFilterPropertyNames(): string[] {
		return (this.content.getPropertyInfoSet() as ControlPropertyInfo[])
			.filter(function (filterProp) {
				return filterProp.required;
			})
			.map(function (requiredProp) {
				return requiredProp.conditionPath;
			});
	}

	/**
	 * Get the filter bar parameters for a parameterized service.
	 * @returns Array of parameters configured in a parameterized service
	 */

	getParameters(): string[] {
		const filterBar = this.content;
		const parameters = filterBar.data("parameters");
		if (parameters) {
			return Array.isArray(parameters) ? parameters : JSON.parse(parameters);
		}
		return [];
	}

	getVariant(): VariantData | undefined {
		let currentVariant;
		try {
			const variantModel = this.getModel("$FlexVariants") as VariantModel | undefined;
			const variantBackReference = this.content.getVariantBackreference();

			if (variantModel && variantBackReference) {
				currentVariant = variantModel.getVariant(variantModel.getCurrentVariantReference(variantBackReference));
			}
		} catch (e) {
			Log.debug("Couldn't fetch variant ", e as string);
		}
		return currentVariant;
	}

	/**
	 * Shows or hides any filter field from the filter bar.
	 * The property will not be hidden inside the adaptation dialog and may be re-added.
	 * @param conditionPath The path to the property as a condition path
	 * @param visible Whether it should be shown or hidden
	 * @returns A {@link Promise} resolving once the change in visibility was applied
	 * @public
	 */
	async setFilterFieldVisible(conditionPath: string, visible: boolean): Promise<void> {
		await StateUtil.applyExternalState(this.content, { items: [{ name: conditionPath, visible }] });
	}

	/**
	 * Gets the visibility of a filter field.
	 * @param conditionPath The path to the property as a condition path
	 * @returns A {@link Promise} that resolves to check whether the filter field is visible or not.
	 * @public
	 */
	async getFilterFieldVisible(conditionPath: string): Promise<boolean> {
		const state: ExternalStateType = await StateUtil.retrieveExternalState(this.content);
		return !!state.items.find((item) => item.name === conditionPath);
	}

	/**
	 * Gets the associated variant management.
	 * @returns The {@link sap.ui.fl.variants.VariantManagement} control associated with the filter bar.
	 */
	getVariantManagement(): VariantManagement {
		const variantBackreference = this.content.getVariantBackreference();
		if (variantBackreference) {
			return UI5Element.getElementById(variantBackreference) as VariantManagement;
		} else {
			throw new Error(`Variant back reference not defined on the filter bar ${this.id}`);
		}
	}

	/**
	 * Sets the variant back reference association for this instance.
	 * @param variant The `VariantManagement` instance to set as the back reference.
	 */
	setVariantBackReference(variant: VariantManagement): void {
		if (!this.liveMode) {
			this.content.setVariantBackreference(variant);
		}
	}

	/**
	 * Gets the key of the current variant in the associated variant management.
	 * @returns Key of the currently selected variant. In case the model is not yet set, `null` will be returned.
	 * @public
	 */
	getCurrentVariantKey(): string | null {
		return this.getVariantManagement().getCurrentVariantKey();
	}

	/**
	 * Sets the new selected variant in the associated variant management.
	 * @param key Key of the variant that should be selected. If the passed key doesn't identify a variant, it will be ignored.
	 * @public
	 */
	setCurrentVariantKey(key: string): void {
		const variantManagement = this.getVariantManagement();
		variantManagement.setCurrentVariantKey(key);
	}

	/**
	 * Sets the enablement of the field.
	 * @param name Name of the field that should be enabled or disabled.
	 * @param enabled Whether the field should be enabled or disabled.
	 * @public
	 */
	setFilterFieldEnabled(name: string, enabled: boolean): void {
		(this.getModel("internal") as JSONModel).setData(
			{
				[this.content.data("localId")]: {
					filterFields: { [name]: { editMode: enabled ? FieldEditMode.Editable : FieldEditMode.Disabled } }
				}
			},
			true
		);
	}

	/**
	 * Determines whether the field is enabled or disabled.
	 * @param name Name of the field.
	 * @returns Whether the filterField is enabled or disabled.
	 * @public
	 */
	getFilterFieldEnabled(name: string): boolean {
		return (this.getModel("internal") as JSONModel).getProperty(`/${this.content.data("localId")}/filterFields/${name}/editMode`) ===
			FieldEditMode.Disabled
			? false
			: true;
	}

	/**
	 * Convert {@link sap.fe.navigation.SelectionVariant} to conditions.
	 * @param selectionVariant The selection variant to apply to the filter bar.
	 * @param prefillDescriptions If true, we try to find the associated Text value for each property in the selectionVariant (to avoid fetching it from the server)
	 * @returns A promise resolving to conditions
	 */
	async convertSelectionVariantToStateFilters(
		selectionVariant: SelectionVariant,
		prefillDescriptions: boolean
	): Promise<StateUtilFilter> {
		return stateHelper.convertSelectionVariantToStateFilters(
			this.content,
			selectionVariant,
			prefillDescriptions,
			this.content?.getModel()
		);
	}

	/**
	 * Clears all input values of visible filter fields in the filter bar with flag to indicate whether to clear Edit Filter or not.
	 * @param filterBar The filter bar that contains the filter field
	 * @param options Options for filtering on the filter bar
	 * @param options.clearEditFilter Whether to clear the edit filter or let it be default value 'All' instead
	 */
	async _clearFilterValuesWithOptions(filterBar: FilterBar, options?: { clearEditFilter: boolean }): Promise<void> {
		await stateHelper._clearFilterValuesWithOptions(filterBar, options);
	}

	/**
	 * Sets {@link sap.fe.navigation.SelectionVariant} to the filter bar. Note: setSelectionVariant will clear existing filters and then apply the SelectionVariant values.
	 * @param selectionVariant The {@link sap.fe.navigation.SelectionVariant} to apply to the filter bar
	 * @param prefillDescriptions Optional. If true, we will use the associated text property values (if they're available in the selectionVariant) to display the filter value descriptions, instead of loading them from the backend
	 * @returns A promise for asynchronous handling
	 * @public
	 */
	async setSelectionVariant(selectionVariant: SelectionVariant, prefillDescriptions = false): Promise<unknown> {
		return stateHelper.setSelectionVariantToMdcControl(this.getContent(), selectionVariant, prefillDescriptions);
	}

	/**
	 * Called by the MDC state util when the state for this control's child has changed.
	 */
	handleStateChange(): void {
		this.getPageController()?.getExtensionAPI().updateAppState();
	}

	async showFilterField(name: string): Promise<void> {
		const state: ExternalStateType = await StateUtil.retrieveExternalState(this.content);
		const targetFilterField = !!state.items.find((item) => item.name === name);
		if (!targetFilterField) {
			state.items.push({ name });
		}
		await StateUtil.applyExternalState(this.content, state);
	}

	openValueHelpForFilterField(name: string, inputValue?: string, fnCallback?: Function): void {
		const filterField = this.content.getFilterItems().find((item) => item.getPropertyKey() === name);
		if (filterField) {
			const valueHelp = UI5Element.getElementById(filterField.getValueHelp()) as ValueHelp;
			if (valueHelp) {
				let selectedItems: ConditionObject[] = [];
				const handleItemSelected = (oEvent: ValueHelp$SelectEvent): void => {
					selectedItems = oEvent.getParameter("conditions") as ConditionObject[];
				};
				valueHelp.attachClosed(() => {
					valueHelp.detachSelect(handleItemSelected, this);
					fnCallback?.(selectedItems);
				});
				valueHelp.attachSelect(handleItemSelected, this);
			}
			(filterField as unknown as { _oFocusInfo: object })._oFocusInfo = { targetInfo: { silent: true } };
			(filterField as unknown as { onfocusin?: Function }).onfocusin?.();
			setTimeout(() => {
				(filterField.getAggregation("_content") as Input[])[0].fireValueHelpRequest({
					fromKeyboard: true,
					_userInputValue: inputValue
				} as unknown as Input$ValueHelpRequestEventParameters);
			}, 200);
		}
	}

	getCollapsedFiltersText(): string {
		return this.content?.getAssignedFiltersText()?.filtersText;
	}
}
export default FilterBarAPI;
