import type { MockDataContributor } from "@sap-ux/ui5-middleware-fe-mockserver";

const RootEntity: MockDataContributor<object> = {
	async onAfterAction(actionDefinition, actionData, keys, responseData, odataRequest) {
		if (actionDefinition.name === "draftPrepare") {
			responseData["SAP_Message"] = [
				{
					code: "xxxx",
					longtextUrl: "",
					message: "PrepareAction on RootEntity has been triggered",
					numericSeverity: 2,
					target: "/RootEntity(ID=1,IsActiveEntity=false)/TitleProperty",
					transition: true
				}
			];
		}
		return responseData;
	}
};
export default RootEntity;
