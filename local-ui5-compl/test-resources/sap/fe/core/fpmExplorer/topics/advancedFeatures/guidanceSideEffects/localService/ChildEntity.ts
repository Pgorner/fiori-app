import type { MockDataContributor } from "@sap-ux/ui5-middleware-fe-mockserver";
import type { ChildEntityType, RootEntityType } from "./types";
const ChildEntity: MockDataContributor<object> = {
	//fun calculateTotalAmount = function(parentID: number): void {
	async onAfterUpdateEntry(keyValues, updatedData: ChildEntityType, odataRequest: any) {
		const entries: Array<ChildEntityType> = (await this.base?.getAllEntries(odataRequest)) as Array<ChildEntityType>;
		const parentKey: any = { ID: updatedData.Parent_ID };

		// fetch parent
		const parent = await this.base?.getParentEntityInterface();
		if (parent) {
			const parentRoot = (await parent.fetchEntries(parentKey, odataRequest))[0] as RootEntityType;
			//side effect sample 4: filter on parent entries and calculate total amount
			parentRoot.totalAmount = entries
				.filter((x) => x.Parent_ID === updatedData.Parent_ID)
				.reduce((sum, current) => sum + parseFloat(current.price.toString()), 0);
			//update parent item
			await parent.updateEntry?.(parentKey, parentRoot, parentRoot, odataRequest);
		}
	},
	async removeEntry(keyValues, odataRequest) {
		//get parent before child item is deleted
		const currentEntry = (await this.base!.fetchEntries(keyValues, odataRequest))[0] as ChildEntityType;
		const parentID = currentEntry.Parent_ID;
		const parentKey: any = { ID: parentID };
		await this.base?.removeEntry(keyValues, odataRequest);
		const entries: Array<ChildEntityType> = (await this.base!.getAllEntries(odataRequest)) as Array<ChildEntityType>;
		const parent = await this.base?.getParentEntityInterface();
		// fetch parent
		if (parent) {
			const parentRoot = (await parent.fetchEntries(parentKey, odataRequest))[0] as RootEntityType;
			if (entries.length > 0) {
				//side effect sample 4: filter on parent entries and calculate total amount
				parentRoot.totalAmount = entries
					.filter((x) => x.Parent_ID === parentID)
					.reduce((sum, current) => sum + parseFloat(current.price.toString()), 0);
				//update parent item
			} else {
				parentRoot.totalAmount = 0;
			}
			await parent.updateEntry(parentKey, parentRoot, parentRoot, odataRequest);
		}
	}
};
export default ChildEntity;
