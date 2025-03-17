/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(
	[
		"./HeaderAPI",
		"sap/fe/test/Utils",
		"sap/ui/test/OpaBuilder",
		"sap/fe/test/builder/FEBuilder",
		"sap/fe/test/builder/MacroFieldBuilder",
		"./APIHelper"
	],
	function (HeaderAPI, Utils, OpaBuilder, FEBuilder, FieldBuilder, APIHelper) {
		"use strict";

		/**
		 * Constructs a new HeaderAssertions instance.
		 * @param {sap.fe.test.builder.FEBuilder} oHeaderBuilder The {@link sap.fe.test.builder.FEBuilder} instance used to interact with the UI
		 * @param {string} [vHeaderDescription] Description (optional) of the header to be used for logging messages
		 * @returns {sap.fe.test.api.HeaderAssertions} The new instance
		 * @alias sap.fe.test.api.HeaderAssertions
		 * @class
		 * @hideconstructor
		 * @public
		 */
		var HeaderAssertions = function (oHeaderBuilder, vHeaderDescription) {
			this._sObjectPageLayoutId = vHeaderDescription.id;
			this._sHeaderId = vHeaderDescription.headerId;
			this._sHeaderContentId = vHeaderDescription.headerContentId;
			this._sHeaderContentContainerId = vHeaderDescription.headerContentContainerId;
			this._sViewId = vHeaderDescription.viewId;
			this._sPaginatorId = vHeaderDescription.paginatorId;
			this._sBreadCrumbId = vHeaderDescription.breadCrumbId;
			return HeaderAPI.call(this, oHeaderBuilder, vHeaderDescription);
		};
		HeaderAssertions.prototype = Object.create(HeaderAPI.prototype);
		HeaderAssertions.prototype.constructor = HeaderAssertions;
		HeaderAssertions.prototype.isAction = false;

		/**
		 * Checks an action in the header toolbar.
		 * @param {string | sap.fe.test.api.ActionIdentifier} vActionIdentifier The identifier of the action
		 * @param {object} [mState] Defines the expected state of the button
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		HeaderAssertions.prototype.iCheckAction = function (vActionIdentifier, mState) {
			var oOverflowToolbarBuilder = this.createOverflowToolbarBuilder(this._sObjectPageLayoutId);
			return this.prepareResult(
				oOverflowToolbarBuilder
					.hasContent(this.createActionMatcher(vActionIdentifier), mState)
					.description(Utils.formatMessage("Checking header action '{0}' in state '{1}'", vActionIdentifier, mState))
					.execute()
			);
		};

		/**
		 * Checks the <code>Edit</code> action in the header toolbar.
		 * @param {object} [mState] Defines the expected state of the button
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		HeaderAssertions.prototype.iCheckEdit = function (mState) {
			return this.iCheckAction({ service: "StandardAction", action: "Edit", unbound: true }, mState);
		};

		/**
		 * Checks if a specific header action is in focus.
		 * @param {string | sap.fe.test.api.ActionIdentifier} vActionIdentifier The identifier of the action
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @ui5-restricted
		 */
		HeaderAssertions.prototype.iCheckActionHasFocus = function (vActionIdentifier) {
			var oFEBuilder = FEBuilder.create(this.getOpaInstance());
			return this.prepareResult(
				oFEBuilder
					.hasId(this.createActionMatcher(vActionIdentifier))
					.hasState({ focused: true })
					.description(Utils.formatMessage("Checking focus on header action '{0}'", vActionIdentifier))
					.execute()
			);
		};

		/**
		 * Checks the <code>Delete</code> action in the header toolbar.
		 * @param {object} [mState] Defines the expected state of the button
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		HeaderAssertions.prototype.iCheckDelete = function (mState) {
			return this.iCheckAction({ service: "StandardAction", action: "Delete", unbound: true }, mState);
		};

		/**
		 * Checks the <code>Related Apps</code> action in the header toolbar.
		 * @param {object} [mState] Defines the expected state of the button
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		HeaderAssertions.prototype.iCheckRelatedApps = function (mState) {
			return this.iCheckAction({ service: "fe", action: "RelatedApps", unbound: true }, mState);
		};

		/**
		 * Checks an action in the popover that is currently open.
		 * @param {object | string} vAction The state map or label of the action
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		HeaderAssertions.prototype.iCheckMenuAction = function (vAction) {
			return this.prepareResult(APIHelper.createMenuActionCheckBuilder(vAction).execute());
		};

		/**
		 * Checks the number of items available in the Object Page header.
		 * @param {number} iNumberOfItems The expected number of items
		 * @param {boolean} [bIncludeHidden] Defines whether non-visible items should be counted
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @ui5-restricted
		 */
		HeaderAssertions.prototype.iCheckNumberOfHeaderContentItems = function (iNumberOfItems, bIncludeHidden) {
			var oHeaderContentBuilder = this.getObjectPageDynamicHeaderContentBuilder(this._sHeaderContentId);

			return this.prepareResult(
				oHeaderContentBuilder
					.has(function (oOPHeaderContent) {
						var aItems = oOPHeaderContent.getContent()[0].getItems();
						if (!bIncludeHidden) {
							aItems = aItems.filter(function (oControl) {
								return oControl.getVisible();
							});
						}
						return aItems.length === iNumberOfItems;
					})
					.description(Utils.formatMessage("Checking number of header content with '{0}' items", iNumberOfItems))
					.execute()
			);
		};

		/**
		 * Checks a field within a field group in the object page header.
		 * @param {sap.fe.test.api.FieldIdentifier | string} vFieldIdentifier The identifier of the field
		 * @param {string|Array|object} [vValue] The value to check. If it is an array, the first entry is considered as
		 * the value and the second as the description. If it is an object it must follow this pattern:
		 * <code><pre>
		 * 	{
		 * 		value: <string>, 		// optional
		 * 		description: <string> 	// optional
		 * 	}
		 * </pre></code>
		 * @param {object} [mState] Defines the expected state of the field
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		HeaderAssertions.prototype.iCheckFieldInFieldGroup = function (vFieldIdentifier, vValue, mState) {
			var aArguments = Utils.parseArguments([Object, [Array, String], Object], arguments),
				sFieldId =
					(vFieldIdentifier.targetAnnotation
						? this.getDataFieldForAnnotationId(vFieldIdentifier, this._sViewId)
						: this.getFieldGroupFieldId(vFieldIdentifier, this._sViewId)) + "-content";

			return this.prepareResult(
				FieldBuilder.create(this)
					.hasId(sFieldId)
					.hasValue(aArguments[1])
					.hasState(aArguments[2])
					.description(
						Utils.formatMessage(
							"Seeing field '{0}' with value '{1}' and state='{2}'",
							aArguments[0],
							aArguments[1],
							aArguments[2]
						)
					)
					.execute()
			);
		};

		/**
		 * Checks a data point in the object page header.
		 * @param {string} sTitle The title of the data point
		 * @param {string} sValue The expected value of the data point
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @ui5-restricted
		 */
		HeaderAssertions.prototype.iCheckDataPoint = function (sTitle, sValue) {
			var oHeaderContentBuilder = this.getObjectPageDynamicHeaderContentBuilder(this._sHeaderContentId);

			return this.prepareResult(
				oHeaderContentBuilder
					.has(
						OpaBuilder.Matchers.childrenMatcher(
							OpaBuilder.Matchers.some([
								OpaBuilder.create(this)
									.hasType("sap.m.ObjectNumber")
									.hasProperties({ number: sValue })
									.has(function (oObjectNumber) {
										return oObjectNumber.getParent();
									})
									.hasAggregationProperties("items", { text: sTitle }),
								OpaBuilder.create(this)
									.hasType("sap.m.ObjectStatus")
									.hasProperties({ text: sValue })
									.has(function (oObjectNumber) {
										return oObjectNumber.getParent();
									})
									.hasAggregationProperties("items", { text: sTitle })
							])
						)
					)
					.description(Utils.formatMessage("Seeing header data point '{0}' with value '{1}'", sTitle, sValue))
					.execute()
			);
		};

		/**
		 * Checks the title and description of the object page.
		 *
		 * If either title or description is <code>undefined</code>, it will not be checked.
		 * @param {string} [sTitle] Title of the object page header
		 * @param {string} [sDescription] Description of the object page header
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		HeaderAssertions.prototype.iCheckTitle = function (sTitle, sDescription) {
			var oHeaderTitleBuilder = this.getObjectPageDynamicHeaderTitleBuilder(this._sObjectPageLayoutId);
			return this.prepareResult(
				oHeaderTitleBuilder
					.hasConditional(
						sTitle !== undefined,
						OpaBuilder.Matchers.childrenMatcher(OpaBuilder.create(this).hasType("sap.m.Title").hasProperties({ text: sTitle }))
					)
					.hasConditional(
						sDescription !== undefined,
						OpaBuilder.Matchers.childrenMatcher(
							OpaBuilder.create(this).hasType("sap.m.Label").hasProperties({ text: sDescription })
						)
					)
					.description(
						!sDescription
							? "Seeing Object Page header title '" + sTitle + "'"
							: "Seeing Object Page header title '" + sTitle + "' and subtitle '" + sDescription + "'"
					)
					.execute()
			);
		};

		/**
		 * Checks the paginator down button.
		 * @param {object} mState Defines the expected state of the button
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		HeaderAssertions.prototype.iCheckPaginatorDown = function (mState) {
			return this.prepareResult(
				this.createPaginatorBuilder(
					OpaBuilder.Matchers.properties({ icon: "sap-icon://navigation-down-arrow" }),
					this._sViewId + "--" + this._sPaginatorId,
					mState
				)
					.description(Utils.formatMessage("Checking paginator down action with state='{0}'", mState))
					.execute()
			);
		};

		/**
		 * Checks the paginator up button.
		 * @param {object} mState Defines the expected state of the button
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		HeaderAssertions.prototype.iCheckPaginatorUp = function (mState) {
			return this.prepareResult(
				this.createPaginatorBuilder(
					OpaBuilder.Matchers.properties({ icon: "sap-icon://navigation-up-arrow" }),
					this._sViewId + "--" + this._sPaginatorId,
					mState
				)
					.description(Utils.formatMessage("Checking paginator up action with state='{0}'", mState))
					.execute()
			);
		};

		/**
		 * Checks a MicroChart shown in the header of an object page.
		 *
		 * TODO this function will not be public yet: Its signature doesn't fit the framework.
		 * @param {object|string} vMicroChartIdentifier Id/Type or Title of MicroChart
		 * @param {string} sUoMLabel UoM label of the MicroChart
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @ui5-restricted
		 */
		HeaderAssertions.prototype.iCheckMicroChart = function (vMicroChartIdentifier, sUoMLabel) {
			var oOpaBuilder = OpaBuilder.create(this.getOpaInstance());

			if (!Utils.isOfType(vMicroChartIdentifier, String)) {
				oOpaBuilder.hasId(
					this._sViewId +
						"--" +
						this._sHeaderId +
						"::MicroChart::" +
						vMicroChartIdentifier.chartId +
						"::" +
						vMicroChartIdentifier.chartType
				);
				if (sUoMLabel !== undefined) {
					oOpaBuilder.hasAggregationProperties("_uomLabel", { text: sUoMLabel });
					oOpaBuilder.description(
						Utils.formatMessage(
							"Seeing Micro Chart of type '{0}' with identifier '{1}' and UoM Label '{2}'",
							vMicroChartIdentifier.chartType,
							vMicroChartIdentifier.chartId,
							sUoMLabel
						)
					);
				} else {
					oOpaBuilder.description(
						Utils.formatMessage(
							"Seeing Micro Chart of type '{0}' with identifier '{1}'",
							vMicroChartIdentifier.chartType,
							vMicroChartIdentifier.chartId
						)
					);
				}
			} else {
				oOpaBuilder.hasProperties({ chartTitle: vMicroChartIdentifier });
				if (sUoMLabel !== undefined) {
					oOpaBuilder.hasAggregationProperties("_uomLabel", { text: sUoMLabel });
					oOpaBuilder.description(
						Utils.formatMessage("Seeing Micro Chart with title '{0}' and UoM Label '{1}'", vMicroChartIdentifier, sUoMLabel)
					);
				} else {
					oOpaBuilder.description(Utils.formatMessage("Seeing Micro Chart with title '{0}'", vMicroChartIdentifier));
				}
			}
			return this.prepareResult(oOpaBuilder.execute());
		};

		/**
		 * Checks the custom facet in the object page header.
		 * @param {sap.fe.test.api.HeaderFacetIdentifier} vFacetIdentifier The Identifier of the header facet
		 * @param {object} [mState] Defines the expected state
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		HeaderAssertions.prototype.iCheckHeaderFacet = function (vFacetIdentifier, mState) {
			var aArguments = Utils.parseArguments([[Object, String], Object], arguments),
				oHeaderContentBuilder = this.getObjectPageHeaderContentContainerBuilder(this._sHeaderContentContainerId),
				sId = new RegExp("fe::HeaderFacetContainer::" + vFacetIdentifier.facetId + "$");

			if (vFacetIdentifier.custom) {
				sId = new RegExp("fe::HeaderFacetCustomContainer::" + vFacetIdentifier.facetId + "$");
			} else if (vFacetIdentifier.collection) {
				sId = new RegExp("fe::HeaderCollectionFacetContainer::" + vFacetIdentifier.facetId + "$");
			}

			return this.prepareResult(
				oHeaderContentBuilder
					.has(OpaBuilder.Matchers.childrenMatcher(FEBuilder.create(this.getOpaInstance()).hasId(sId).hasState(mState)))
					.description(Utils.formatMessage("Checking Header Facet '{0}' with state='{1}'", aArguments[0], aArguments[1]))
					.execute()
			);
		};

		/**
		 * Checks a specific breadcrumb link on the object page.
		 *
		 * TODO this function will not be public yet: Its signature doesn't fit the framework.
		 * @param {string} [sLink] The text property of the link to be tested.
		 * The <code>links</code> aggregation of the breadcrumb control is checked for the availability of the given text.
		 * If <code>sLink</code> is provided as an empty string, a check is executed to see whether the breadcrumb control exists and has an empty <code>links</code> aggregation.
		 * This is the case for the main object page, which does not show breadcrumb links.
		 * If <code>sLink</code> is not provided, a check is executed to ensure the breadcrumb control does not exist at all. This is the case for the flexible column layout
		 * showing multiple floorplans at the same time.
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @ui5-restricted
		 */
		HeaderAssertions.prototype.iCheckBreadCrumb = function (sLink) {
			var oFEBuilder = FEBuilder.create(this.getOpaInstance()).hasId(this._sBreadCrumbId);

			if (sLink !== undefined && sLink.length > 0) {
				oFEBuilder.hasAggregationProperties("links", { text: sLink });
				oFEBuilder.description(Utils.formatMessage("Checking breadcrumb link '{0}'", sLink));
			} else if (sLink !== undefined && sLink.length === 0) {
				oFEBuilder.hasAggregationLength("links", 0);
				oFEBuilder.hasState({ visible: true });
				oFEBuilder.description("Checking for existing but empty breadcrumbs");
			} else if (sLink === undefined) {
				oFEBuilder.hasState({ visible: false });
				oFEBuilder.description("Checking for non-existent breadcrumbs");
			}

			return this.prepareResult(oFEBuilder.execute());
		};

		/**
		 * Checks the <code>Save as Tile</code> action.
		 * @param {object} [mState] Defines the expected state of the button
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		HeaderAssertions.prototype.iCheckSaveAsTile = function (mState) {
			var oShareButtonProperties = {
				icon: "sap-icon://action"
			};
			var oShareBuilder = FEBuilder.create(this.getOpaInstance());

			return this.prepareResult(
				oShareBuilder
					.hasProperties(oShareButtonProperties)
					.do(OpaBuilder.Actions.press())
					.description(Utils.formatMessage("Open share menu"))
					.success(APIHelper.createSaveAsTileCheckBuilder(mState))
					.execute()
			);
		};

		/**
		 * Checks <code>Send Email</code> action.
		 * @param {object} [mState] Defines the expected state of the button
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @public
		 */
		HeaderAssertions.prototype.iCheckSendEmail = function (mState) {
			var oShareButtonProperties = {
				icon: "sap-icon://action"
			};
			var oShareBuilder = FEBuilder.create(this.getOpaInstance());

			return this.prepareResult(
				oShareBuilder
					.hasProperties(oShareButtonProperties)
					.do(OpaBuilder.Actions.press())
					.description(Utils.formatMessage("Open share menu"))
					.success(APIHelper.createSendEmailCheckBuilder(mState))
					.execute()
			);
		};

		/**
		 * Checks the state of a link located in the Object Page header.
		 *
		 * TODO this function will not be public yet: It needs some refactoring to behave similar to the FormAssertions#iCheckLink function.
		 * @param {object | string} vLinkIdentifier The identifier of the field
		 * @param {object} [mState] Defines the expected state of the link
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @private
		 */
		HeaderAssertions.prototype.iCheckLink = function (vLinkIdentifier, mState) {
			// TODO this function needs to aligned with onForm().iCheckLink - for now vLinkIdentifier must be the link text!
			var aArguments = Utils.parseArguments([String, Object], arguments),
				oHeaderContentBuilder = this.getObjectPageHeaderContentContainerBuilder(this._sHeaderContentContainerId);
			return this.prepareResult(
				oHeaderContentBuilder
					.has(
						OpaBuilder.Matchers.childrenMatcher(
							FEBuilder.create().hasType("sap.m.Link").hasProperties({ text: vLinkIdentifier }).hasState(aArguments[1])
						)
					)
					.description(Utils.formatMessage("Checking link '{0}' with state='{1}'", aArguments[0], aArguments[1]))
					.execute()
			);
		};

		/**
		 * Checks the number of users collaborating in the draft.
		 * @param {number} iExpectedNumber The expected number of users
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @ui5-restricted
		 */
		HeaderAssertions.prototype.iCheckNumberOfCollaboratingUsers = function (iExpectedNumber) {
			var objectPageBuilder = FEBuilder.create(this.getOpaInstance()).hasId(this._sObjectPageLayoutId);

			return this.prepareResult(
				objectPageBuilder
					.hasChildren(
						FEBuilder.create(this)
							.hasType("sap.uxap.ObjectPageDynamicHeaderTitle")
							.has(OpaBuilder.Matchers.children(FEBuilder.create(this).hasType("sap.m.Avatar")))
							.has(function (aAvatars) {
								return aAvatars && aAvatars.length == iExpectedNumber + 1; // +1 because of avatar to add a user
							})
						// .hasChildren(
						// 	FEBuilder.create(this)
						// 		.hasType("sap.m.Avatar")
						// 		.has(function(oControl) {
						// 			return true;
						// 		})
						// 		//.checkNumberOfMatches(iExpectedNumber + 1) // +1 because of avatar to add a user
						// )
					)
					.description(Utils.formatMessage("Checking number of collaborating user: {0}", iExpectedNumber))
					.execute()
			);
		};

		/**
		 * Checks if a collaborating user is present.
		 * @param {string} sInitials The initials of the user (displayed in the avatar)
		 * @returns {object} The result of the {@link sap.ui.test.Opa5#waitFor} function, to be used for chained statements
		 * @ui5-restricted
		 */
		HeaderAssertions.prototype.iCheckCollaboratingUser = function (sInitials) {
			var objectPageBuilder = FEBuilder.create(this.getOpaInstance()).hasId(this._sObjectPageLayoutId);

			return this.prepareResult(
				objectPageBuilder
					.hasChildren(
						FEBuilder.create(this)
							.hasType("sap.uxap.ObjectPageDynamicHeaderTitle")
							.hasChildren(FEBuilder.create(this).hasType("sap.m.Avatar").hasProperties({ initials: sInitials }))
					)
					.description(Utils.formatMessage("Checking collaborating user with initials '{0}'", sInitials))
					.execute()
			);
		};

		return HeaderAssertions;
	}
);
