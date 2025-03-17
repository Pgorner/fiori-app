sap.ui.define(
	["sap/fe/core/PageController", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/core/library"],
	function (PageController, Filter, FilterOperator, library) {
		"use strict";

		var ValueState = library.ValueState;

		return {
			ratingOperator: function (sValue) {
				switch (sValue) {
					case "Low":
						return new Filter({ path: "RatingOperator", operator: FilterOperator.LT, value1: 2 });
					case "Medium":
						return new Filter({
							filters: [
								new Filter({ path: "RatingOperator", operator: FilterOperator.GT, value1: 1 }),
								new Filter({ path: "RatingOperator", operator: FilterOperator.LT, value1: 5 })
							],
							and: true
						});
					case "High":
						return new Filter({ path: "RatingOperator", operator: FilterOperator.EQ, value1: 5 });
					default:
						return new Filter({ path: "RatingOperator", operator: FilterOperator.GT, value1: 0 });
				}
			},

			onRatingIndicatorValueChanged: function (oEvent) {
				this.getView().byId("FilterBar").setFilterValues("RatingIndicator", oEvent.getParameter("value"));
			},

			onRatingIndicatorReset: function (oEvent) {
				this.getView().byId("FilterBar").setFilterValues("RatingIndicator");
			},

			onRatingRangeReset: function (oEvent) {
				this.getView().byId("FilterBar").setFilterValues("RatingRange");
			},

			onRatingChoicesSelectionChange: function (oEvent) {
				const key = oEvent.getParameter("item").getKey();

				switch (key) {
					case "none":
						return this.getView().byId("FilterBar").setFilterValues("RatingChoices");
					case "bad":
						return this.getView().byId("FilterBar").setFilterValues("RatingChoices", "EQ", "1");
					case "okay":
						return this.getView().byId("FilterBar").setFilterValues("RatingChoices", "EQ", ["2", "3", "4"]);
					case "good":
						return this.getView().byId("FilterBar").setFilterValues("RatingChoices", "EQ", "5");
					default:
						return Promise.reject("Invalid segmented button key");
				}
			},

			onMultiValueRatingLevels: function (values) {
				const filters = [];

				values.forEach((value) => {
					switch (value) {
						case "low":
							filters.push(new Filter({ path: "Rating", operator: FilterOperator.EQ, value1: 1 }));
							break;
						case "medium":
							filters.push(new Filter({ path: "Rating", operator: FilterOperator.EQ, value1: 2 }));
							filters.push(new Filter({ path: "Rating", operator: FilterOperator.EQ, value1: 3 }));
							filters.push(new Filter({ path: "Rating", operator: FilterOperator.EQ, value1: 4 }));
							break;
						case "high":
							filters.push(new Filter({ path: "Rating", operator: FilterOperator.EQ, value1: 5 }));
							break;
						default:
							return null;
					}
				});

				return new Filter({
					filters: filters
				});
			},

			onStringFilterFormatValue: function (sValue) {
				if (!sValue) {
					return ValueState.Error;
				} else {
					return ValueState.None;
				}
			}
		};
	}
);
