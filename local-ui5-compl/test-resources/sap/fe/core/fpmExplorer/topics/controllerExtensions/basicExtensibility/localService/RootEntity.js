module.exports = {
	executeAction: async function (actionDefinition, actionData, keys, odataRequest) {
		switch (actionDefinition.name) {
			case "boundAction": {
				const entries = await this.base?.fetchEntries(keys, odataRequest);
				entries[0].BooleanProperty = !entries[0].BooleanProperty;
				await this.base.updateEntry(keys, entries[0], odataRequest);
				break;
			}
		}
	}
};
