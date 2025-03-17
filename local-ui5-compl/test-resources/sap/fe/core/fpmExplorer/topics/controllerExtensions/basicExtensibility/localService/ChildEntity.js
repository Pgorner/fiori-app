module.exports = {
	executeAction: async function (actionDefinition, actionData, keys, odataRequest) {
		switch (actionDefinition.name) {
			case "boundActionSetTitle": {
				const entries = await this.base?.fetchEntries(keys, odataRequest);
				entries.map((entry) => {
					entry.ChildTitleProperty = actionData.Title;
				});

				await this.base.updateEntry(keys, entries, odataRequest);
				break;
			}
		}
	}
};
