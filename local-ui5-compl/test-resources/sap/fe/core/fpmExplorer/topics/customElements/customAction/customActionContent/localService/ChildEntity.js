module.exports = {
	executeAction: async function (actionDefinition, actionData, keys, odataRequest) {
		const entries = await this.base?.fetchEntries(keys, odataRequest);
		if (actionDefinition.name === "Table1MenuAction1") {
			odataRequest.addMessage(0, "Table Menu Item 1 clicked for row " + entries[0].TextProperty, 2, "");
		} else if (actionDefinition.name === "Table1MenuAction2") {
			odataRequest.addMessage(0, "Table Menu Item 2 clicked for row " + entries[0].TextProperty, 2, "");
		} else if (actionDefinition.name === "Table2MenuAction1") {
			odataRequest.addMessage(0, "Table Action Enabled Overriden clicked for row " + entries[0].TextProperty, 2, "");
		} else if (actionDefinition.name === "Table2MenuAction2") {
			odataRequest.addMessage(0, "Table Menu Item 2 clicked for row " + entries[0].TextProperty, 2, "");
		} else if (actionDefinition.name === "TableAnnotationAction") {
			odataRequest.addMessage(0, "Table Annotation Action in Menu clicked for row " + entries[0].TextProperty, 2, "");
		}
		return undefined;
	}
};
