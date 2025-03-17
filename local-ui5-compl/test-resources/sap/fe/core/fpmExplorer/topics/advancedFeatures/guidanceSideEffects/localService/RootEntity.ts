import type { MockDataContributor } from "@sap-ux/ui5-middleware-fe-mockserver";
import type { AbsoluteEntityType, EntitiesSingletonType, RootEntityType } from "./types";

const RootEntity: MockDataContributor<object> = {
	async executeAction(actionDefinition, actionData, keys, odataRequest) {
		function isPrime(n: number): boolean {
			if (n <= 1) {
				return false;
			}
			for (let i = 2; i < n; i++) {
				if (n % i === 0) {
					return false;
				}
			}
			return true;
		}
		switch (actionDefinition.name) {
			case "increaseAndCheckPrime": {
				const entries: Array<RootEntityType> = (await this.base?.fetchEntries(keys, odataRequest)) as Array<RootEntityType>;
				const clickCount: number = entries[0].complexProperty_number + 1;
				entries[0].complexProperty_number = clickCount;
				entries[0].complexProperty_prime = isPrime(clickCount);
				await this.base?.updateEntry(keys, entries[0], odataRequest);
				break;
			}
			case "sideEffectTriggerAction": {
				const entries: Array<RootEntityType> = (await this.base?.fetchEntries(keys, odataRequest)) as Array<RootEntityType>;
				//Side effect sample 2
				entries[0].targetProperty2 = "Source Property Value: " + entries[0].sourceProperty2;
				await this.base?.updateEntry(actionData, entries[0], odataRequest);
				break;
			}
			case "sideEffectTriggerActionMultiSources": {
				const entries: Array<RootEntityType> = (await this.base?.fetchEntries(keys, odataRequest)) as Array<RootEntityType>;
				//Side effect sample 3
				entries[0].targetProperty3 =
					"Source Properties Values: " + entries[0].sourceProperty3a + " & " + entries[0].sourceProperty3b;
				await this.base?.updateEntry(actionData, entries[0], odataRequest);
				break;
			}
			case "addRound":
			case "stopRound": {
				const singletonEntity = await this.base?.getEntityInterface("EntitiesSingleton");
				const absoluteEntity = await this.base?.getEntityInterface("AbsoluteEntity");
				if (absoluteEntity) {
					const entries = (await absoluteEntity.getAllEntries?.(odataRequest)) as Array<AbsoluteEntityType>;
					const now = new Date();
					if (singletonEntity) {
						const singletonEntry = (await singletonEntity.getAllEntries?.(odataRequest)) as Array<EntitiesSingletonType>;
						if (entries.length > 0) {
							const latestEntry: AbsoluteEntityType = entries[entries.length - 1];
							const distance = now.getTime() - latestEntry.TimeStamp.getTime();
							const distDate = new Date(distance);
							const duration =
								distDate.toTimeString().replace(/.*(\d{2}:\d{2}).*/, "$1") +
								"." +
								distDate.getMilliseconds().toString().substring(0, 2);
							latestEntry.TimeStamp = now;
							latestEntry.Duration = duration;
							await absoluteEntity.updateEntry?.({ ID: latestEntry.ID }, latestEntry, {}, odataRequest);
							if (actionDefinition.name === "addRound") {
								await absoluteEntity.addEntry?.(
									{ ID: entries.length + 1, TimeStamp: now, Duration: "Started" },
									odataRequest
								);
								singletonEntry[0].BooleanProperty = true;
							} else {
								singletonEntry[0].BooleanProperty = false;
							}
						} else {
							await absoluteEntity.addEntry?.({ ID: 1, TimeStamp: now, Duration: "Started" }, odataRequest);
							singletonEntry[0].BooleanProperty = true;
						}
						await singletonEntity.updateEntry?.({ ID: singletonEntry[0].ID }, singletonEntry[0], {}, odataRequest);
					}
				}
				break;
			}
			case "clearRounds": {
				const absoluteEntity = await this.base?.getEntityInterface("AbsoluteEntity");
				if (absoluteEntity) {
					const entries = (await absoluteEntity.getAllEntries?.(odataRequest)) as Array<AbsoluteEntityType>;
					entries.forEach(function (oEntry) {
						absoluteEntity.removeEntry?.({ ID: oEntry.ID }, odataRequest);
					});
				}
				break;
			}
			case "deleteBusinessPartner": {
				const businessPartnerEntity = await this.base?.getEntityInterface("BusinessPartnerAddress");
				if (businessPartnerEntity) {
					const entries: Array<RootEntityType> = (await this.base?.fetchEntries(keys, odataRequest)) as Array<RootEntityType>;
					await businessPartnerEntity.removeEntry?.({ BusinessPartner: entries[0].BusinessPartnerID }, odataRequest);
					entries[0].BusinessPartnerID = "";
					await this.base?.updateEntry?.(keys, entries[0], odataRequest);
				}
				break;
			}
		}
		return {};
	},
	async onAfterUpdateEntry(keyValues, updatedData: RootEntityType, odataRequest) {
		const entries: Array<RootEntityType> = (await this.base?.fetchEntries(keyValues, odataRequest)) as Array<RootEntityType>;
		//Side effect sample 1
		entries[0].targetProperty1a = "Source Property Value: " + updatedData.sourceProperty1;
		if (updatedData.sourceProperty1 != "") {
			entries[0].fieldControlProperty1 = 3;
		} else {
			entries[0].fieldControlProperty1 = 1;
		}

		//Side effect sample 4
		if (updatedData.sourceProperty4) {
			entries[0].fieldControlProperty2 = 3;
		} else {
			entries[0].fieldControlProperty2 = 1;
		}
		await this.base?.updateEntry(keyValues, entries[0], odataRequest);
	}
};
export default RootEntity;
