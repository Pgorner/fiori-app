sap.ui.define(
	[
		"sap/ui/model/json/JSONModel",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/m/library",
		"./BaseController",
		"sap/ui/Device",
		"sap/base/Log",
		"sap/ui/core/routing/History",
		"sap/ui/core/Fragment",
		"../model/CustomElementNavigationModel",
		"../model/MacroNavigationModel",
		"../model/ControllerExtensionNavigationModel",
		"../model/OverviewNavigationModel",
		"../model/AdvancedFeaturesNavigationModel",
		"../model/ExploreSettingsModel",
		"../model/AppSettingsModel",
		"sap/base/i18n/Localization",
		"sap/ui/core/Theming"
	],
	function (
		JSONModel,
		Filter,
		FilterOperator,
		mLibrary,
		BaseController,
		Device,
		Log,
		History,
		Fragment,
		CustomElementNavigationModel,
		MacroNavigationModel,
		ControllerExtensionNavigationModel,
		OverviewNavigationModel,
		AdvancedFeaturesNavigationModel,
		ExploreSettingsModel,
		AppSettingsModel,
		Localization,
		Theming
	) {
		"use strict";

		const LEGAL_LINKS = {
			legal: "https://www.sap.com/corporate/en/legal/impressum.html",
			privacy: "https://www.sap.com/corporate/en/legal/privacy.html",
			terms_of_use: "https://www.sap.com/corporate/en/legal/terms-of-use.html"
		};

		return BaseController.extend("sap.fe.core.fpmExplorer.controller.App", {
			/**
			 * Called when the app is started.
			 */
			onInit: async function () {
				const component = this.getOwnerComponent();
				component.getEventBus().subscribe("navEntryChanged", this.onNavEntryRouteChange, this);
				this._setToggleButtonTooltip(!Device.system.desktop);

				this.getView().addStyleClass(component.getContentDensityClass());

				this.getRouter().attachBypassed(function () {
					this.navToRoute("overview/introduction");
				}, this);
				var uriParams = new URLSearchParams(window.location.search);
				const jsonModel = new JSONModel({ showInternal: false });

				if (uriParams.has("showInternalFPM")) {
					jsonModel.setProperty("/showInternal", true);
				}
				this.getView().setModel(jsonModel, "ui");
				this.getView().setModel(ExploreSettingsModel, "settings");
				this.getView().setModel(AppSettingsModel, "appSettings");
				this.searchField = this.getView().byId("searchField");

				const _fnflattenModel = function (member, model, parent) {
					//consider non-grouping nav model entries
					if (!member.items) {
						const newMember = Object.assign({}, member);
						//enhance search model key for direct navigation usage
						newMember.key = model.oData.target + "/" + newMember.key;
						//joined topic - group - sample title for better searchability
						newMember.title = parent
							? model.oData.topic + " - " + parent.title + " - " + newMember.title
							: model.oData.topic + " - " + newMember.title;
						//add sample title to tags to improve tag matches
						newMember.tags = newMember.title + ", " + newMember.tags;
						if (!newMember.icon) {
							newMember.icon = parent ? parent.icon : model.oData.navigation[0].icon;
						}
						newMember.topic = model.oData.navigation[0].title;
						return newMember;
					} else {
						//process child samples of grouping nav model entries
						const oGroupItems = Object.assign([], member.items);
						const subArray = oGroupItems.map((itemMember) => _fnflattenModel(itemMember, model, member));
						return Object.assign([], subArray);
					}
				};

				const customElementNavigationModel = await CustomElementNavigationModel.init();
				const macroNavigationModel = await MacroNavigationModel.init();

				//create "flattened" search model
				const searchModel = [
					...OverviewNavigationModel.oData.navigation.map((member) => _fnflattenModel(member, OverviewNavigationModel)),
					...customElementNavigationModel.oData.navigation.map((member) => _fnflattenModel(member, customElementNavigationModel)),
					...macroNavigationModel.oData.navigation.map((member) => _fnflattenModel(member, macroNavigationModel)),
					...ControllerExtensionNavigationModel.oData.navigation.map((member) =>
						_fnflattenModel(member, ControllerExtensionNavigationModel)
					),
					...AdvancedFeaturesNavigationModel.oData.navigation.map((member) =>
						_fnflattenModel(member, AdvancedFeaturesNavigationModel)
					)
				]
					.flat()
					.filter(function (element) {
						return element !== undefined;
					});

				this.getView().setModel(new JSONModel(searchModel), "sampleSearch");

				Device.media.attachHandler(this.onDeviceSizeChange, this);
				this.onDeviceSizeChange();
			},

			onExit: function () {
				Device.media.detachHandler(this.onDeviceSizeChange, this);
			},

			onSearch: function (event) {
				var item = event.getParameter("suggestionItem");
				if (item) {
					this.navToRoute(item.getKey());
					this.searchField.getBinding("suggestionItems").filter();
					this.searchField.clear();
				} else {
					this.searchField.suggest(true);
				}
			},

			createFilters: function (sPropertyPath, sValue) {
				return Object.assign(
					[],
					//separate filter on each search sub string
					sValue
						.trim()
						.split(" ")
						.map(function (substr) {
							return new Filter({
								path: sPropertyPath,
								operator: FilterOperator.Contains,
								value1: substr
							});
						})
				);
			},

			onSuggest: function (event) {
				var suggestValue = event.getParameter("suggestValue");
				var filters = [];
				if (suggestValue) {
					//Combined filter on nav model title and tags
					//search on each sub string combined with logical AND
					var filterTitle = new Filter({
						filters: this.createFilters("title", suggestValue),
						and: true
					});
					var oFilterTags = new Filter({
						filters: this.createFilters("tags", suggestValue),
						and: true
					});
					//substring search filter arrays combined with logical or (search results in sample title or tags)
					filters = new Filter({
						filters: [filterTitle, oFilterTags],
						and: false
					});
				}
				//filter search field suggestion items
				this.searchField.getBinding("suggestionItems").filter(filters);
				//add tag hits for each filtered item to the suggestion description
				this.searchField.getSuggestionItems().map((item) => {
					//get tag array for each sample from search model
					const sample = this.getModel("sampleSearch")
						.getData()
						.filter((obj) => {
							return obj.key === item.getProperty("key") ? obj : undefined;
						})[0];
					var tagHits = [];
					if (suggestValue.length > 0 && sample && sample.tags) {
						//process each tag separately
						tagHits = sample.tags
							.split(",")
							.map((tag) => {
								//check whether any search substring matches tag
								var match = false;
								suggestValue
									.trim()
									.split(" ")
									.map((substr) => {
										//exlude sample title from tags to avoid duplicate display in suggestion list
										if (
											tag.toLowerCase().includes(substr.toLowerCase()) &&
											!sample.title.toLowerCase().includes(tag.toLowerCase())
										) {
											match = true;
										}
									});
								return match ? tag : undefined;
								//filter out undefined elements returned by .map()
							})
							.filter(function (element) {
								return element !== undefined;
							});
					}
					//set hit tag to search model sample
					sample.tagHit = tagHits.length > 0 ? tagHits.toString() : "";
				});
				this.getModel("sampleSearch").refresh();
				this.searchField.suggest(true);
			},

			/**
			 * @param {Array|string} vKey The key or keys to be checked in the history.
			 * @returns {string} The first URL hash found in the history.
			 */
			_findPreviousRouteHash: function (vKey) {
				var aKeys = [];
				var oHistory = History.getInstance();
				if (typeof vKey === "string") {
					aKeys[0] = vKey;
				} else {
					aKeys = vKey;
				}

				if (!oHistory.aHistory) {
					return "";
				}
				for (var i = oHistory.aHistory.length - 1; i >= 0; i--) {
					var sHistory = oHistory.aHistory[i];

					for (var k = 0; k < aKeys.length; k++) {
						var sKey = aKeys[k];

						if (sHistory.startsWith(sKey + "/")) {
							return sHistory;
						}
					}
				}

				return "";
			},

			onTabSelect: function (oEvent) {
				var oItem = oEvent.getParameter("item"),
					sTabKey = oItem.getKey(),
					sRouteHash;

				switch (sTabKey) {
					case "overview":
						sRouteHash = this._findPreviousRouteHash("overview") || "overview/introduction";
						break;
					case "customElements":
						sRouteHash = this._findPreviousRouteHash("customElements") || "customElements/customElementsOverview";
						break;
					case "buildingBlocks":
						sRouteHash = this._findPreviousRouteHash("buildingBlocks") || "buildingBlocks/buildingBlockOverview";
						break;
					case "controllerExtensions":
						sRouteHash =
							this._findPreviousRouteHash("controllerExtensions") || "controllerExtensions/controllerExtensionsOverview";
						break;
					case "advancedFeatures":
						sRouteHash = this._findPreviousRouteHash("advancedFeatures") || "advancedFeatures/advancedFeaturesOverview";
						break;

					case "internalExperiments":
						sRouteHash =
							this._findPreviousRouteHash("internalExperiments") || "internalExperiments/internalExperimentsOverview";
						break;
					default:
						sRouteHash = null;
						Log.error("Tab was not recognized.");
						return;
				}

				this.navToRoute(sRouteHash);
			},

			/**
			 * Finds the target by the route's hash and navigates to it.
			 * @param {string} sRouteHash For example: 'explore/list/numeric'.
			 */
			navToRoute: function (sRouteHash) {
				var aParts = sRouteHash.split("/");
				if (aParts) {
					this._removePreviousPage(aParts[0]);
					switch (aParts[0]) {
						case "overview":
							this.getRouter().navTo("overview", {
								topic: aParts[1],
								subTopic: aParts[2]
							});
							break;
						case "customElements":
							this.getRouter().navTo("customElements", {
								sample: aParts[1],
								subSample: aParts[2]
							});
							break;
						case "controllerExtensions":
							this.getRouter().navTo("controllerExtensions", {
								sample: aParts[1],
								subSample: aParts[2]
							});
							break;
						case "buildingBlocks":
							this.getRouter().navTo("buildingBlocks", {
								sample: aParts[1],
								subSample: aParts[2]
							});
							break;
						case "advancedFeatures":
							this.getRouter().navTo("advancedFeatures", {
								sample: aParts[1],
								subSample: aParts[2]
							});
							break;

						case "internalExperiments":
							this.getRouter().navTo("internalExperiments", {
								sample: aParts[1],
								subSample: aParts[2]
							});
							break;
						default:
							this.getRouter().navTo(aParts[0]);
					}
				}
			},

			onSideNavigationItemSelect: function (oEvent) {
				var oItem = oEvent.getParameter("item"),
					oItemConfig = this.getView().getModel().getProperty(oItem.getBindingContext().getPath()),
					sRootKey,
					sChildKey;

				var sTarget = this.getView().getModel().getProperty("/target");
				if (oItem.data("type") === "root") {
					sRootKey = oItemConfig.key;
				} else {
					// child
					sRootKey = oItem.getParent().getKey();
					sChildKey = oItemConfig.key;
				}

				if (sTarget === "overview") {
					this.getRouter().navTo(sTarget, {
						topic: sRootKey,
						subTopic: sChildKey
					});
				} else {
					this.getRouter().navTo(sTarget, {
						sample: sRootKey,
						subSample: sChildKey
					});
				}
			},

			onSideNavButtonPress: function () {
				var toolPage = this.byId("toolPage");
				var sideExpanded = toolPage.getSideExpanded();

				this._setToggleButtonTooltip(sideExpanded);

				toolPage.setSideExpanded(!toolPage.getSideExpanded());
			},

			onNavEntryRouteChange: function (sChannelId, sEventId, oPayload) {
				this.switchCurrentModelAndTab(oPayload.routeName).then(() => {
					//consider sample opened via deep link
					const sideNavigation = this.getView().byId("sideNavigation");
					sideNavigation.setSelectedKey(oPayload.navigationItemKey);
					var item = sideNavigation.getAggregation("item").getSelectedItem();
					//always expand parent of selected item (parent is either a grouping list item of the navigation list itself)
					if (item) {
						item.setExpanded(true);
						item.getParent().setExpanded(true);
					}
				});
			},

			onDeviceSizeChange: function () {
				var toolPage = this.byId("toolPage"),
					sRangeName = Device.media.getCurrentRange("StdExt").name;

				switch (sRangeName) {
					case "Phone":
					case "Tablet":
						toolPage.setSideExpanded(false);
						break;
					case "Desktop":
						toolPage.setSideExpanded(true);
						break;
				}
			},

			_setToggleButtonTooltip: function (bLarge) {
				var toggleButton = this.byId("sideNavigationToggleButton");
				if (bLarge) {
					toggleButton.setTooltip("Large Size Navigation");
				} else {
					toggleButton.setTooltip("Small Size Navigation");
				}
			},

			navToHome: function () {
				mLibrary.URLHelper.redirect("../index.html");
			},

			switchCurrentModelAndTab: async function (sRouteName) {
				var oIconTabHeader = this.getView().byId("iconTabHeader");
				var oModel;

				if (sRouteName.startsWith("customElements")) {
					oModel = await CustomElementNavigationModel.init();
					oIconTabHeader.setSelectedKey("customElements");
				} else if (sRouteName.startsWith("buildingBlocks")) {
					oModel = await MacroNavigationModel.init();
					oIconTabHeader.setSelectedKey("buildingBlocks");
				} else if (sRouteName.startsWith("controllerExtensions")) {
					oModel = ControllerExtensionNavigationModel;
					oIconTabHeader.setSelectedKey("controllerExtensions");
				} else if (sRouteName.startsWith("advancedFeatures")) {
					oModel = AdvancedFeaturesNavigationModel;
					oIconTabHeader.setSelectedKey("advancedFeatures");
				} else if (sRouteName.startsWith("internalExperiments")) {
					sap.ui.require(
						["sap/fe/core/internal/fpmExplorer/model/InternalExperimentsModel"],
						async (InternalExperimentsModel) => {
							oModel = await InternalExperimentsModel.init();
							this.setModel(oModel);
						}
					);
					oIconTabHeader.setSelectedKey("internalExperiments");
				} else {
					// default
					oModel = OverviewNavigationModel;
					oIconTabHeader.setSelectedKey("overview");
				}

				this.setModel(oModel);
			},

			_appSettingsDialog: null,

			handleAppSettings: function (sAction) {
				switch (sAction) {
					case "open": {
						if (!this._appSettingsDialog) {
							Fragment.load({
								name: "sap.fe.core.fpmExplorer.view.AppSettingsDialog",
								controller: this
							}).then(
								function (oDialog) {
									// connect dialog to the root view of this component (models, lifecycle)
									this.getView().addDependent(oDialog);
									this._appSettingsDialog = oDialog;
									this._appSettingsDialog.open();
								}.bind(this)
							);
						} else {
							this._appSettingsDialog.open();
						}
						break;
					}
					case "reset": {
						AppSettingsModel.resetValues();
						break;
					}
					case "close": {
						this._appSettingsDialog.close();
						break;
					}
					case "apply": {
						AppSettingsModel.saveValues();
						AppSettingsModel.applyValues();
						Theming.setTheme(AppSettingsModel.getTheme());
						Localization.setRTL(AppSettingsModel.getRTL());
						this._appSettingsDialog.close();
						break;
					}
					default:
						break;
				}
			},

			onChapterClick: function (oEvent) {
				var oChapter = oEvent.getSource();
				oChapter.setExpanded(!oChapter.getExpanded());
			},

			onSideNavigationFixedItemPress: function (oEvent) {
				var sTargetText = oEvent.getParameter("item").getKey(),
					sTarget = LEGAL_LINKS[sTargetText];
				mLibrary.URLHelper.redirect(sTarget, true);
			}
		});
	}
);
