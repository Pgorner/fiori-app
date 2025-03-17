module.exports = {
	executeAction: async function (actionDefinition, actionData, keys, odataRequest) {
		const entries = await this.base?.fetchEntries(keys, odataRequest);
		if (actionDefinition.name === "toggleBoolean") {
			entries[0].BooleanProperty = entries[0].BooleanProperty !== true;
			await this.base?.updateEntry(keys, entries[0], odataRequest);
			return undefined;
		} else if (actionDefinition.name === "MenuAction1") {
			odataRequest.addMessage(0, "Menu Item 1 clicked for row " + entries[0].ID, 2, "");
		} else if (actionDefinition.name === "MenuAction2") {
			odataRequest.addMessage(0, "Menu Item 2 clicked for row " + entries[0].ID, 4, "");
		}
		return undefined;
	}
};
