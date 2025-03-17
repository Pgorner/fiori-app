import type { MockDataContributor } from "@sap-ux/ui5-middleware-fe-mockserver";

const RootEntity: MockDataContributor<object> = {
	async executeAction(actionDefinition, actionData, keys, odataRequest) {
		const entries: Array<any> = (await this.base?.fetchEntries(keys, odataRequest)) as Array<any>;
		const actionValue = `Action executed: random value is ${Math.floor(1 + Math.random() * 20)}`;
		entries[0].ActionValue = actionValue;
		return {};
	}
};
export default RootEntity;
