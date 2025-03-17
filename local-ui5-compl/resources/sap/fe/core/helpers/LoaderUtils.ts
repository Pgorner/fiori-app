export async function requireDependencies(dependencyNames: string[]): Promise<unknown[]> {
	let resolveFn!: Function;
	const awaiter = new Promise((resolve) => {
		resolveFn = resolve;
	});
	if (dependencyNames.length > 0) {
		sap.ui.require(dependencyNames, (...dependencies: unknown[]) => {
			resolveFn(dependencies);
		});
	} else {
		resolveFn([]);
	}
	return awaiter as Promise<unknown[]>;
}
