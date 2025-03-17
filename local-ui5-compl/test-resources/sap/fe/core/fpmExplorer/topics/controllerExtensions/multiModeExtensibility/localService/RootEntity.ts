import type { MockDataContributor } from "@sap-ux/ui5-middleware-fe-mockserver";
import type Integer from "sap/ui/model/type/Integer";
import type { OverallSDProcessStatusType, RootEntityType } from "./types";

const RootEntity: MockDataContributor<object> = {
	async executeAction(actionDefinition, actionData, keys, odataRequest) {
		if (actionDefinition.name === "updateRating") {
			const entries: Array<RootEntityType> = (await this.base?.fetchEntries(keys, odataRequest)) as Array<RootEntityType>;
			entries.forEach((entry) => {
				if (entry.Rating === (1.0 as any)) {
					entry.Rating = 5.0 as any;
				} else {
					entry.Rating = 1.0 as any;
				}
			});
			await this.base?.updateEntry(keys, entries[0], odataRequest);
			return {}; // this action does not return anything
		} else if (actionDefinition.name === "updateStatus") {
			const entries: Array<OverallSDProcessStatusType> = (await this.base?.fetchEntries(
				keys,
				odataRequest
			)) as Array<OverallSDProcessStatusType>;
			entries.forEach((entry) => {
				if (entry.OverallSDProcessStatus === "A") {
					entry.OverallSDProcessStatus = "D";
					entry.StatusCriticality = 3 as unknown as Integer;
				} else if (entry.OverallSDProcessStatus === "D") {
					entry.OverallSDProcessStatus = "A";
					entry.StatusCriticality = 1 as unknown as Integer;
				}
			});
			await this.base?.updateEntry(keys, entries[0], odataRequest);
			return {}; // this action does not return anything
		}
	}
};
export default RootEntity;
