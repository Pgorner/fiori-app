sap.ui.define(["sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/core/library"], function (Filter, FilterOperator, library) {
	"use strict";

	var ValueState = library.ValueState;

	return {
		onReset: function (oEvent) {
			this.setFilterValues("Rating");
		},

		ratingLevels: function (sValue) {
			switch (sValue) {
				case "Low":
					return new Filter({ path: "Rating", operator: FilterOperator.LT, value1: 2 });
				case "Medium":
					return new Filter({
						filters: [
							new Filter({ path: "Rating", operator: FilterOperator.GT, value1: 1 }),
							new Filter({ path: "Rating", operator: FilterOperator.LT, value1: 5 })
						],
						and: true
					});
				case "High":
					return new Filter({ path: "Rating", operator: FilterOperator.EQ, value1: 5 });
				default:
					return new Filter({ path: "Rating", operator: FilterOperator.GT, value1: 0 });
			}
		},

		multiValueRatingLevels: function (values) {
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
});
