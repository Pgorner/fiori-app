import Log from "sap/base/Log";
import type ViewState from "sap/fe/core/controllerextensions/ViewState";
import type { NavigationParameter } from "sap/fe/core/controllerextensions/ViewState";
import { getInvolvedDataModelObjects } from "sap/fe/core/converters/MetaModelConverter";
import KeepAliveHelper from "sap/fe/core/helpers/KeepAliveHelper";
import type { InternalModelContext } from "sap/fe/core/helpers/ModelHelper";
import CoreLibrary from "sap/fe/core/library";
import type { PropertyInfo } from "sap/fe/macros/DelegateUtil";
import type FilterBarAPI from "sap/fe/macros/filterBar/FilterBarAPI";
import SelectionVariant from "sap/fe/navigation/SelectionVariant";
import NavLibrary from "sap/fe/navigation/library";
import type {
	default as ListReportController,
	default as ListReportControllerController
} from "sap/fe/templates/ListReport/ListReportController.controller";
import Device from "sap/ui/Device";
import type Control from "sap/ui/core/Control";
import type UI5Element from "sap/ui/core/Element";
import type View from "sap/ui/core/mvc/View";
import ControlVariantApplyAPI from "sap/ui/fl/apply/api/ControlVariantApplyAPI";
import type VariantManagement from "sap/ui/fl/variants/VariantManagement";
import type Chart from "sap/ui/mdc/Chart";
import type FilterBar from "sap/ui/mdc/FilterBar";
import type Table from "sap/ui/mdc/Table";
import StateUtil from "sap/ui/mdc/p13n/StateUtil";
import type ODataMetaModel from "sap/ui/model/odata/v4/ODataMetaModel";

type VariantObject = {
	author: string;
	change: boolean;
	contexts: object;
	executeOnSelect: boolean;
	favorite: boolean;
	key: string;
	originalContexts: object;
	originalExecuteOnSelect: boolean;
	originalFavorite: boolean;
	originalTitle: string;
	originalVisible: boolean;
	remove: boolean;
	rename: boolean;
	sharing: string;
	title: string;
	visible: boolean;
};

type NavHandlerNavParams = NavigationParameter & {
	bNavSelVarHasDefaultsOnly?: boolean;
};

type LRViewData = {
	controlConfiguration?: Record<string, Record<string, unknown>>;
	entitySet?: string;
	contextPath?: string;
	variantManagement?: boolean;
};

type VariantIDs = {
	sPageVariantId: string;
	sFilterBarVariantId: string;
	sTableVariantId: string;
	sChartVariantId: string;
};

const NavType = NavLibrary.NavType,
	VariantManagementType = CoreLibrary.VariantManagement,
	TemplateContentView = CoreLibrary.TemplateContentView,
	InitialLoadMode = CoreLibrary.InitialLoadMode,
	DISPLAY_CURRENCY_PROPERTY_NAME = "DisplayCurrency";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const ViewStateOverride = {
	_bSearchTriggered: false,
	applyInitialStateOnly: function (): boolean {
		return true;
	},
	onBeforeStateApplied: function (
		this: ViewState & typeof ViewStateOverride,
		aPromises: Promise<unknown>[],
		navigationType?: string
	): void {
		const oView = this.getView(),
			oController = oView.getController() as ListReportController,
			oFilterBar = oController._getFilterBarControl(),
			aTables = oController._getControls("table") as Table[];
		if (oFilterBar) {
			oFilterBar.setSuspendSelection(true);
			aPromises.push(oFilterBar.waitForInitialization());
			//This is required to remove any existing or default filter conditions before restoring the filter bar state in hybrid navigation mode.
			if (navigationType === NavType.hybrid) {
				this._clearFilterConditions(oFilterBar);
			}
		}
		aTables.forEach(function (oTable: Table): void {
			aPromises.push((oTable as unknown as { initialized: () => Promise<unknown> }).initialized());
		});

		delete this._bSearchTriggered;
	},
	adaptBindingRefreshControls: function (this: ViewState, aControls: Control[]): void {
		const oView = this.base.getView(),
			oController = oView.getController() as ListReportController,
			aViewControls = oController._getControls(),
			aControlsToRefresh = KeepAliveHelper.getControlsForRefresh(oView, aViewControls);

		Array.prototype.push.apply(aControls, aControlsToRefresh);
	},
	adaptStateControls: function (this: ViewState & typeof ViewStateOverride, aStateControls: UI5Element[]): void {
		const oView = this.base.getView(),
			oController = oView.getController() as ListReportController;
		const oFilterBarVM = this._getFilterBarVM(oView);
		if (oFilterBarVM) {
			aStateControls.push(oFilterBarVM);
		}
		if (oController._isMultiMode()) {
			aStateControls.push(oController._getMultiModeControl());
		}
		if (oController._hasMultiVisualizations()) {
			aStateControls.push(oController._getSegmentedButton(TemplateContentView.Chart)!);
			aStateControls.push(oController._getSegmentedButton(TemplateContentView.Table)!);
		}
		aStateControls.push(oView.byId("fe::ListReport")!);
	},
	retrieveAdditionalStates: function (
		this: ViewState & typeof ViewStateOverride,
		mAdditionalStates: { dataLoaded: boolean; alpContentView: string }
	): void {
		const oView = this.getView(),
			oController = oView.getController() as ListReportController,
			bPendingFilter = (oView.getBindingContext("internal") as InternalModelContext).getProperty("hasPendingFilters");

		mAdditionalStates.dataLoaded = !bPendingFilter || !!this._bSearchTriggered;
		if (oController._hasMultiVisualizations()) {
			const sAlpContentView = oView.getBindingContext("internal")!.getProperty("alpContentView");
			mAdditionalStates.alpContentView = sAlpContentView;
		}

		delete this._bSearchTriggered;
	},
	applyAdditionalStates: function (
		this: ViewState & typeof ViewStateOverride,
		oAdditionalStates?: { dataLoaded: boolean; alpContentView?: string }
	): void {
		const oView = this.getView(),
			oController = oView.getController() as ListReportController,
			oFilterBar = oController._getFilterBarControl();

		if (oAdditionalStates) {
			// explicit check for boolean values - 'undefined' should not alter the triggered search property
			if (oAdditionalStates.dataLoaded === false && oFilterBar) {
				// without this, the data is loaded on navigating back
				(oFilterBar as { _bSearchTriggered?: boolean })._bSearchTriggered = false;
			} else if (oAdditionalStates.dataLoaded === true) {
				if (oFilterBar) {
					const filterBarAPI = oFilterBar.getParent() as FilterBarAPI;
					filterBarAPI.triggerSearch();
				}
				this._bSearchTriggered = true;
			}
			if (oController._hasMultiVisualizations()) {
				const oInternalModelContext = oView.getBindingContext("internal") as InternalModelContext;
				if (!Device.system.desktop && oAdditionalStates.alpContentView == TemplateContentView.Hybrid) {
					oAdditionalStates.alpContentView = TemplateContentView.Chart;
				}
				oInternalModelContext
					.getModel()
					.setProperty(`${oInternalModelContext.getPath()}/alpContentView`, oAdditionalStates.alpContentView);
			}
		}
	},

	/**
	 * Determines whether Search can be triggered at initial load of the application or not.
	 * @param navigationType Navigation Type during the load of the application
	 * @returns A Boolean determining whether Search can be triggered or not
	 */
	isSearchTriggeredByInitialLoad(this: ViewState & typeof ViewStateOverride, navigationType: string): boolean {
		const view = this.base.getView(),
			controller = view.getController() as ListReportController,
			viewData = view.getViewData();
		let isSearchTriggeredByInitialLoad = false,
			variantManagement;
		// Determining whether it's Control variantManagement or Page variantManagement
		if (viewData.variantManagement === CoreLibrary.VariantManagement.Control) {
			variantManagement = controller._getFilterBarVariantControl();
		} else {
			variantManagement = view.byId("fe::PageVariantManagement") as VariantManagement;
		}
		const currentVariantKey = variantManagement?.getCurrentVariantKey();
		//The check shall happen for 'intial load' and 'Apply Automatically' for collapsing the header or
		// always be collapsed if navType is xAppState
		// initialLoad Auto or Disabled
		if (navigationType === NavType.xAppState) {
			return true;
		} else if (variantManagement && viewData.initialLoad !== InitialLoadMode.Enabled) {
			// Header is collapsed if preset filters are set for initial load Auto, Header shall remain expanded if initial load is Auto without preset filters or intial load is disabled
			if (controller._shouldAutoTriggerSearch(this._getFilterBarVM(view))) {
				isSearchTriggeredByInitialLoad = true;
			}
		}
		// initialLoad Enabled
		else if (
			variantManagement &&
			viewData.initialLoad === InitialLoadMode.Enabled &&
			controller._getApplyAutomaticallyOnVariant(variantManagement, currentVariantKey)
		) {
			isSearchTriggeredByInitialLoad = true;
		}
		return isSearchTriggeredByInitialLoad;
	},

	_enableFilterBar: function (filterBarControl: FilterBar, preventInitialSearch: boolean): void {
		const filterBarAPI = filterBarControl.getParent() as FilterBarAPI;
		const fnOnSearch = (): void => {
			this._bSearchTriggered = !preventInitialSearch;
		};

		// reset the suspend selection on filter bar to allow loading of data when needed (was set on LR Init)
		if (filterBarControl.getSuspendSelection()) {
			// Only if search is fired we set _bSearchTriggered.
			// If there was an error due to required filterfields empty or other issues we skip setting _bSearchTriggered.
			filterBarAPI.attachEventOnce("search", fnOnSearch);
			filterBarControl.setSuspendSelection(false);
		} else {
			// search might already be triggered.
			fnOnSearch();
		}
	},

	_applyNavigationParametersToFilterbar: function (
		this: ViewState & typeof ViewStateOverride,
		oNavigationParameter: NavigationParameter,
		aResults: unknown[]
	): void {
		const oView = this.base.getView();
		const oController = oView.getController() as ListReportController;
		const oAppComponent = oController.getAppComponent();
		const oComponentData = oAppComponent.getComponentData();
		const oStartupParameters = (oComponentData && oComponentData.startupParameters) || {};
		const oVariantPromise = this.handleVariantIdPassedViaURLParams(oStartupParameters);
		let bFilterVariantApplied: boolean;
		aResults.push(
			oVariantPromise
				.then((aVariants: unknown[]) => {
					if (aVariants && aVariants.length > 0) {
						if (aVariants[0] === true || aVariants[1] === true) {
							bFilterVariantApplied = true;
						}
					}
					return this._applySelectionVariant(oView, oNavigationParameter, bFilterVariantApplied);
				})
				.then(() => {
					let bPreventInitialSearch = false;
					const oFilterBarVM = this._getFilterBarVM(oView);
					const oFilterBarControl = oController._getFilterBarControl();
					if (oFilterBarControl) {
						if (
							(oNavigationParameter.navigationType !== NavType.initial && oNavigationParameter.requiresStandardVariant) ||
							(!oFilterBarVM && oView.getViewData().initialLoad === InitialLoadMode.Enabled) ||
							oController._shouldAutoTriggerSearch(oFilterBarVM)
						) {
							const filterBarAPI = oFilterBarControl.getParent() as FilterBarAPI;
							filterBarAPI.triggerSearch();
						} else {
							bPreventInitialSearch = this._preventInitialSearch(oFilterBarVM);
						}
						//collapse or expand shall be available only for non-desktop systems
						if (!Device.system.desktop) {
							const internalModelContext = oView.getBindingContext("internal") as InternalModelContext;
							const searchTriggeredByInitialLoad = this.isSearchTriggeredByInitialLoad(oNavigationParameter.navigationType);
							internalModelContext.setProperty("searchTriggeredByInitialLoad", searchTriggeredByInitialLoad);
						}
						this._enableFilterBar(oFilterBarControl, bPreventInitialSearch);
					}
					return;
				})
				.catch(function () {
					Log.error("Variant ID cannot be applied");
				})
		);
	},

	// eslint-disable-next-line @typescript-eslint/require-await
	handleVariantIdPassedViaURLParams: async function (
		this: ViewState & typeof ViewStateOverride,
		oUrlParams: Record<string, string>
	): Promise<VariantManagement[]> {
		const aPageVariantId = oUrlParams["sap-ui-fe-variant-id"],
			aFilterBarVariantId = oUrlParams["sap-ui-fe-filterbar-variant-id"],
			aTableVariantId = oUrlParams["sap-ui-fe-table-variant-id"],
			aChartVariantId = oUrlParams["sap-ui-fe-chart-variant-id"];
		let oVariantIDs: VariantIDs | undefined;
		if (aPageVariantId || aFilterBarVariantId || aTableVariantId || aChartVariantId) {
			oVariantIDs = {
				sPageVariantId: aPageVariantId && aPageVariantId[0],
				sFilterBarVariantId: aFilterBarVariantId && aFilterBarVariantId[0],
				sTableVariantId: aTableVariantId && aTableVariantId[0],
				sChartVariantId: aChartVariantId && aChartVariantId[0]
			};
		}
		return this._handleControlVariantId(oVariantIDs);
	},

	_handleControlVariantId: async function (
		this: ViewState & typeof ViewStateOverride,
		oVariantIDs: VariantIDs | undefined
	): Promise<unknown> {
		let oVM: VariantManagement;
		const oView = this.base.getView(),
			aPromises: Promise<boolean>[] = [];
		const sVariantManagement = oView.getViewData().variantManagement;
		if (oVariantIDs && oVariantIDs.sPageVariantId && sVariantManagement === "Page") {
			oVM = oView.byId("fe::PageVariantManagement") as VariantManagement;
			this._handlePageVariantId(oVariantIDs, oVM, aPromises);
		} else if (oVariantIDs && sVariantManagement === "Control") {
			if (oVariantIDs.sFilterBarVariantId) {
				oVM = (oView.getController() as ListReportControllerController)._getFilterBarVariantControl()!;
				this._handleFilterBarVariantControlId(oVariantIDs, oVM, aPromises);
			}
			if (oVariantIDs.sTableVariantId) {
				const oController = oView.getController() as ListReportController;
				this._handleTableControlVariantId(oVariantIDs, oController, aPromises);
			}

			if (oVariantIDs.sChartVariantId) {
				const oController = oView.getController() as ListReportController;
				this._handleChartControlVariantId(oVariantIDs, oController, aPromises);
			}
		}
		return Promise.all(aPromises);
	},
	/*
	 * Handles page level variant and passes the variant to the function that pushes the promise to the promise array
	 *
	 * @param oVarinatIDs contains an object of all variant IDs
	 * @param oVM contains the vairant management object for the page variant
	 * @param aPromises is an array of all promises
	 * @private
	 */
	_handlePageVariantId: function (
		this: ViewState & typeof ViewStateOverride,
		oVariantIDs: VariantIDs,
		oVM: VariantManagement,
		aPromises: VariantManagement[]
	): void {
		oVM.getVariants()?.forEach((oVariant: VariantObject) => {
			this._findAndPushVariantToPromise(oVariant, oVariantIDs.sPageVariantId, oVM, aPromises, true);
		});
	},

	/*
	 * Handles control level variant for filter bar and passes the variant to the function that pushes the promise to the promise array
	 *
	 * @param oVarinatIDs contains an object of all variant IDs
	 * @param oVM contains the vairant management object for the filter bar
	 * @param aPromises is an array of all promises
	 * @private
	 */

	_handleFilterBarVariantControlId: function (
		this: ViewState & typeof ViewStateOverride,
		oVariantIDs: VariantIDs,
		oVM: VariantManagement,
		aPromises: VariantManagement[]
	): void {
		if (oVM) {
			oVM.getVariants().forEach((oVariant: VariantObject) => {
				this._findAndPushVariantToPromise(oVariant, oVariantIDs.sFilterBarVariantId, oVM, aPromises, true);
			});
		}
	},

	/*
	 * Handles control level variant for table and passes the variant to the function that pushes the promise to the promise array
	 *
	 * @param oVarinatIDs contains an object of all variant IDs
	 * @param oController has the list report controller object
	 * @param aPromises is an array of all promises
	 * @private
	 */
	_handleTableControlVariantId: function (
		this: ViewState & typeof ViewStateOverride,
		oVariantIDs: VariantIDs,
		oController: ListReportController,
		aPromises: VariantManagement[]
	): void {
		const aTables = oController._getControls("table") as Table[];
		aTables.forEach((oTable: Table) => {
			const oTableVariant = oTable.getVariant();
			if (oTable && oTableVariant) {
				oTableVariant.getVariants().forEach((oVariant: VariantObject) => {
					this._findAndPushVariantToPromise(oVariant, oVariantIDs.sTableVariantId, oTableVariant, aPromises);
				});
			}
		});
	},

	/*
	 * Handles control level variant for chart and passes the variant to the function that pushes the promise to the promise array
	 *
	 * @param oVarinatIDs contains an object of all variant IDs
	 * @param oController has the list report controller object
	 * @param aPromises is an array of all promises
	 * @private
	 */
	_handleChartControlVariantId: function (
		this: ViewState & typeof ViewStateOverride,
		oVariantIDs: VariantIDs,
		oController: ListReportController,
		aPromises: VariantManagement[]
	): void {
		const aCharts = oController._getControls("Chart") as Chart[];
		aCharts.forEach((oChart: Chart) => {
			const oChartVariant = oChart.getVariant();
			const aVariants = oChartVariant.getVariants();
			if (aVariants) {
				aVariants.forEach((oVariant: VariantObject) => {
					this._findAndPushVariantToPromise(oVariant, oVariantIDs.sChartVariantId, oChartVariant, aPromises);
				});
			}
		});
	},
	/*
	 * Matches the variant ID provided in the url to the available vairant IDs and pushes the appropriate promise to the promise array
	 *
	 * @param oVariant is an object for a specific variant
	 * @param sVariantId is the variant ID provided in the url
	 * @param oVM is the variant management object for the specfic variant
	 * @param aPromises is an array of promises
	 * @param bFilterVariantApplied is an optional parameter which is set to ture in case the filter variant is applied
	 * @private
	 */
	_findAndPushVariantToPromise: function (
		//This function finds the suitable variant for the variantID provided in the url and pushes them to the promise array
		this: ViewState & typeof ViewStateOverride,
		oVariant: VariantObject,
		sVariantId: string,
		oVM: VariantManagement,
		aPromises: Promise<boolean>[],
		bFilterVariantApplied?: boolean
	): void {
		if (oVariant.key === sVariantId) {
			aPromises.push(this._applyControlVariant(oVM, sVariantId, bFilterVariantApplied));
		}
	},

	_applyControlVariant: async function (
		this: ViewState & typeof ViewStateOverride,
		oVariant: VariantManagement,
		sVariantID: string,
		bFilterVariantApplied: boolean
	): Promise<boolean> {
		const sVariantReference = this._checkIfVariantIdIsAvailable(oVariant, sVariantID) ? sVariantID : oVariant.getStandardVariantKey();
		const oVM = ControlVariantApplyAPI.activateVariant({
			element: oVariant,
			variantReference: sVariantReference
		});
		return oVM.then(function () {
			return bFilterVariantApplied;
		});
	},
	/************************************* private helper *****************************************/

	/**
	 * Variant management used by filter bar.
	 * @param view View of the LR filter bar
	 * @returns VariantManagement if used
	 */
	_getFilterBarVM: (view: View): VariantManagement | undefined => {
		let variantManagement;
		const viewData = view.getViewData() as LRViewData;
		switch (viewData.variantManagement) {
			case VariantManagementType.Page:
				variantManagement = view.byId("fe::PageVariantManagement");
				break;
			case VariantManagementType.Control:
				variantManagement = (view.getController() as ListReportController)._getFilterBarVariantControl();
				break;
			case VariantManagementType.None:
			default:
				break;
		}
		return variantManagement as VariantManagement | undefined;
	},

	_preventInitialSearch: function (oVariantManagement: VariantManagement): boolean {
		if (!oVariantManagement) {
			return true;
		}
		const aVariants = oVariantManagement.getVariants();
		const oCurrentVariant = aVariants.find(function (oItem): boolean {
			return oItem.getKey() === oVariantManagement.getCurrentVariantKey();
		});
		return !oCurrentVariant.executeOnSelect;
	},

	/**
	 * Checks if DisplayCurrency is mandatory for filtering.
	 * @param metaModel OdataV4 MetaModel
	 * @param contextPath List Report context path.
	 * @returns Boolean
	 */
	_checkIfDisplayCurrencyIsRequired: function (metaModel: ODataMetaModel, contextPath: string): boolean {
		const metaContext = metaModel.getMetaContext(contextPath),
			dataModelObjectPath = getInvolvedDataModelObjects(metaContext),
			entitySet = dataModelObjectPath.startingEntitySet._type === "EntitySet" ? dataModelObjectPath.startingEntitySet : undefined,
			requiredProperties = entitySet?.annotations.Capabilities?.FilterRestrictions?.RequiredProperties ?? [],
			displayCurrencyIsMandatory = requiredProperties.some(
				(requiredProperty) => requiredProperty.value === DISPLAY_CURRENCY_PROPERTY_NAME
			);

		return displayCurrencyIsMandatory;
	},

	/**
	 * Add DisplayCurrency to SV if it is mandatory and exists in SV defaults.
	 * @param view View of the LR filter bar
	 * @param sv Selection Variant to apply
	 * @param svDefaults Selection Variant defaults
	 */
	_addDefaultDisplayCurrencyToSV: function (view: View, sv: SelectionVariant, svDefaults?: SelectionVariant): void {
		if (!svDefaults || svDefaults?.isEmpty()) {
			return;
		}

		const viewData = view.getViewData() as LRViewData,
			metaModel = view.getModel()?.getMetaModel() as ODataMetaModel,
			contextPath = viewData.contextPath || `/${viewData.entitySet}`,
			displayCurrencyIsMandatory = this._checkIfDisplayCurrencyIsRequired(metaModel, contextPath);

		if (!displayCurrencyIsMandatory) {
			return;
		}

		const svOptions = sv.getSelectOption(DISPLAY_CURRENCY_PROPERTY_NAME),
			defaultSVOptions = svDefaults.getSelectOption(DISPLAY_CURRENCY_PROPERTY_NAME),
			displayCurrencyDefaultExists = !!defaultSVOptions && defaultSVOptions.length > 0,
			noSVDisplayCurrencyExists = !svOptions || !svOptions.length;

		if (noSVDisplayCurrencyExists && displayCurrencyDefaultExists) {
			const displayCurrencySelectOption = defaultSVOptions[0],
				sign = displayCurrencySelectOption["Sign"],
				option = displayCurrencySelectOption["Option"],
				low = displayCurrencySelectOption["Low"],
				high = displayCurrencySelectOption["High"];

			sv.addSelectOption(DISPLAY_CURRENCY_PROPERTY_NAME, sign, option, low, high);
		}
	},

	/**
	 * Get adjusted Selection Variant based on 'useFLPDefaultValues' and 'already applied SV'.
	 *
	 * If useFLPDefaultValues is :
	 * 1. FALSE, combine 'appSate SV' and 'already applied SV'.
	 * 2. TRUE, 'appSate SV' is same as 'default SV'. Select Options of 'default SV' takes priority over 'already applied SV'.
	 * @param filterBarAPI FilterBarAPI to fetch the applied SV
	 * @param appStateSV Selection Variant to apply from appState
	 * @param useFLPDefaultValues Should FLP defaults be used
	 * @returns Adjusted SV
	 */
	_getAdjustedSV: async (
		filterBarAPI: FilterBarAPI,
		appStateSV: SelectionVariant,
		useFLPDefaultValues: boolean
	): Promise<SelectionVariant> => {
		let adjustedSV = new SelectionVariant(appStateSV.toJSONObject());
		const alreadyAppliedSV = await filterBarAPI.getSelectionVariant();
		const appliedSelOptNames = alreadyAppliedSV?.getSelectOptionsPropertyNames() || [];
		if (appliedSelOptNames.length > 0) {
			// We merge 'applied SV' and 'appState SV' based on 'useFLPDefaultValues'.
			adjustedSV = appliedSelOptNames.reduce((svCopy: SelectionVariant, selOptionName) => {
				// (appStateSV = adjustedSV = svCopy)
				const svSelOpts = svCopy.getSelectOption(selOptionName);
				// If useFLPDefaultValues = true, means (appStateSV = svDefaults)
				if ((useFLPDefaultValues && !svSelOpts?.length) || !useFLPDefaultValues) {
					// if default SV needs to be used, then select options from default select options take priority.
					// else we merge both: already applied SV and SV from navParams.
					const selectOptions = alreadyAppliedSV.getSelectOption(selOptionName);
					svCopy.massAddSelectOption(selOptionName, selectOptions || []);
				}
				return svCopy;
			}, adjustedSV);
		}

		return adjustedSV;
	},

	/**
	 * Apply Selection Variant from Navigation Parameter.
	 * @param view View of the LR filter bar
	 * @param navigationParameter Selection Variant to apply from appState
	 * @param filterVariantApplied Is a filter variant alaready applied
	 * @returns Promise for asynchronous handling
	 */
	_applySelectionVariant: async function (
		view: View,
		navigationParameter: NavHandlerNavParams,
		filterVariantApplied: boolean
	): Promise<unknown> {
		const filterBar = (view.getController() as ListReportController)._getFilterBarControl();
		const {
			selectionVariant: sv,
			selectionVariantDefaults: svDefaults,
			requiresStandardVariant: reqStdVariant = false,
			bNavSelVarHasDefaultsOnly: svDefaultsOnly = false
		} = navigationParameter;

		if (!filterBar || !sv) {
			return Promise.resolve();
		}

		const variantManagement = this._getFilterBarVM(view) as VariantManagement;
		const clearFiltersAndReplaceWithAppState = await this._activeVariantAndGetAppStateOverride(
			variantManagement,
			reqStdVariant,
			filterVariantApplied
		);

		if (clearFiltersAndReplaceWithAppState) {
			this._addDefaultDisplayCurrencyToSV(view, sv, svDefaults);

			// check if FLP default values are there and is it standard variant
			const svDefaultsArePresent = svDefaults ? svDefaults.getSelectOptionsPropertyNames().length > 0 : false;
			const stdVariantIsDefaultVariant =
				variantManagement && variantManagement.getDefaultVariantKey() === variantManagement.getStandardVariantKey();
			const useFLPDefaultValues: boolean =
				svDefaultsArePresent && (stdVariantIsDefaultVariant || !variantManagement) && svDefaultsOnly;

			const filterBarAPI = filterBar.getParent() as FilterBarAPI;
			let svToSet: SelectionVariant = sv;
			if (filterVariantApplied || useFLPDefaultValues) {
				svToSet = await this._getAdjustedSV(filterBarAPI, sv, useFLPDefaultValues);
			}

			return filterBarAPI.setSelectionVariant(svToSet, true);
		}
	},

	/**
	 * Activate variant from variant management and return if appState needs to be applied.
	 * @param variantManagement VariantManagement used by filter bar
	 * @param reqStdVariant If standard variant is required to be used
	 * @param filterVariantApplied Is a filter variant already applied
	 * @returns Promise for asynchronous handling
	 */
	_activeVariantAndGetAppStateOverride: async function (
		variantManagement: VariantManagement | undefined,
		reqStdVariant: boolean,
		filterVariantApplied: boolean
	): Promise<boolean> {
		if (variantManagement && !filterVariantApplied) {
			let variantKey = reqStdVariant ? variantManagement.getStandardVariantKey() : variantManagement.getDefaultVariantKey();
			if (variantKey === null) {
				variantKey = variantManagement.getId();
			}
			await ControlVariantApplyAPI.activateVariant({
				element: variantManagement,
				variantReference: variantKey
			});
			return reqStdVariant || variantManagement.getDefaultVariantKey() === variantManagement.getStandardVariantKey();
		}

		return true;
	},

	/*
	 * Sets filtered: false flag to every field so that it can be cleared out
	 *
	 * @param oFilterBar filterbar control is used to display filter properties in a user-friendly manner to populate values for a query
	 * @returns promise which will be resolved to object
	 * @private
	 */
	_fnClearStateBeforexAppNav: async function (oFilterBar: FilterBar): Promise<unknown> {
		return StateUtil.retrieveExternalState(oFilterBar)
			.then((oExternalState: { filter: Record<string, Record<string, boolean>[]> }) => {
				const oCondition = oExternalState.filter;
				for (const field in oCondition) {
					if (field !== "$editState" && field !== "$search" && oCondition[field]) {
						oCondition[field].forEach((condition: Record<string, boolean>) => {
							condition["filtered"] = false;
						});
					}
				}
				return oCondition;
			})
			.catch(function (oError: unknown): void {
				Log.error("Error while retrieving the external state", oError as string);
			});
	},

	_clearFilterConditions: async function (oFilterBar: FilterBar): Promise<unknown> {
		const aItems: PropertyInfo[] = [];
		return oFilterBar.waitForInitialization().then(async () => {
			const oClearConditions = await this._fnClearStateBeforexAppNav(oFilterBar);
			return StateUtil.applyExternalState(oFilterBar, {
				filter: oClearConditions,
				items: aItems
			});
		});
	}
};

export default ViewStateOverride;
