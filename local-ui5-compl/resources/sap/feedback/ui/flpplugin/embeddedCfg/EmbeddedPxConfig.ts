export default class EmbeddedPxConfig {
	public static pushConfig() {
		const pushConfig = {
			appPush: {
				configs: [
					{
						areaId: 'POC',
						triggerName: 'featureTest',
						validFrom: '2022-01-01T00:00:01Z',
						validTo: '2099-12-31T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '001',
						triggerName: 'manageStockPoC',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '001',
						triggerName: 'stockMultipleMaterials',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '001',
						triggerName: 'postGoodsReceiptPurchDoc',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '001',
						triggerName: 'analyzeStockInDateRange',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '001',
						triggerName: 'managePhysicalInventoryDoc',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: 'Inno',
						triggerName: 'serialNumberHistory_Inno_1',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '001',
						triggerName: 'manageStock',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '001',
						triggerName: 'manageStock_2',
						validFrom: '2023-04-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '001',
						triggerName: 'transferStockInPlant',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '001',
						triggerName: 'transferStockInPlant_2',
						validFrom: '2023-04-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '001',
						triggerName: 'tempTrigger1',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '001',
						triggerName: 'tempTrigger2',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '001',
						triggerName: 'tempTrigger3',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '001',
						triggerName: 'manageInboundDeliveries',
						validFrom: '2023-04-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '001',
						triggerName: 'manageInboundDeliveryOrders',
						validFrom: '2023-04-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '002',
						triggerName: 'soCreatePoC',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '002',
						triggerName: 'processSO',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '002',
						triggerName: 'manageBillingDocuments',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '002',
						triggerName: 'createBillingDocuments',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '002',
						triggerName: 'managePricesSales',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '002',
						triggerName: 'tempTrigger1',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '002',
						triggerName: 'tempTrigger2',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '002',
						triggerName: 'tempTrigger3',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '004',
						triggerName: 'clearOutgoingPayments',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '004',
						triggerName: 'makeBankTransfer',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '004',
						triggerName: 'shortTermCashPositioning',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '004',
						triggerName: 'projectProfitabilityOverview',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '004',
						triggerName: 'manageSubstitutionsAndValidations',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '004',
						triggerName: 'manageAllocations',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 30, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '004',
						triggerName: 'projectWIPDetails_2',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '004',
						triggerName: 'processReceivables',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '004',
						triggerName: 'allocationResults',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '004',
						triggerName: 'allocationResults_2',
						validFrom: '2023-04-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '004',
						triggerName: 'manageJournalEntries',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '004',
						triggerName: 'postGeneralJournalEntries',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '004',
						triggerName: 'displayLineItemsGL',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '004',
						triggerName: 'displayGLAccountBalances',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '004',
						triggerName: 'balanceSheetIncomeStatement',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '004',
						triggerName: 'reprocessBankStatementItems',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '004',
						triggerName: 'manageBankStatementReprocessingRules',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '004',
						triggerName: 'productProfitabilityWProdVariants',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '004',
						triggerName: 'tempTrigger1',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '004',
						triggerName: 'tempTrigger2',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '004',
						triggerName: 'tempTrigger3',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '004',
						triggerName: 'assignProfitabilitySegment_1',
						validFrom: '2023-04-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '004',
						triggerName: 'assignProfitabilitySegment_2',
						validFrom: '2023-04-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '004',
						triggerName: 'manageAutomaticPayments',
						validFrom: '2023-04-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '004',
						triggerName: 'revisePaymentProposals',
						validFrom: '2023-04-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '004',
						triggerName: 'groupViewAccounting',
						validFrom: '2023-04-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '004',
						triggerName: 'consolidationMonitor',
						validFrom: '2023-04-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '004',
						triggerName: 'postGroupJournalEntries',
						validFrom: '2023-04-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '004',
						triggerName: 'displayGroupJournalEntries',
						validFrom: '2023-04-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '004',
						triggerName: 'groupFinancialStatementReviewBooklet',
						validFrom: '2023-04-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '004',
						triggerName: 'taskLogs',
						validFrom: '2023-04-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '004',
						triggerName: 'importConsolidationMasterData',
						validFrom: '2023-04-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '004',
						triggerName: 'displayGroupJournalEntries_wReporting',
						validFrom: '2023-04-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '004',
						triggerName: 'manageJournalEntries_v2',
						validFrom: '2023-04-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '005',
						triggerName: 'managePO_v2',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '005',
						triggerName: 'createPurchaseRequisitions',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '005',
						triggerName: 'myPurchaseRequisitions',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '005',
						triggerName: 'purchaseOrderV2',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '005',
						triggerName: 'managePurchaseReqProf',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '005',
						triggerName: 'manageServiceEntrySheetsLean',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '005',
						triggerName: 'processPurchaseRequisitions',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '005',
						triggerName: 'tempTrigger1',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '005',
						triggerName: 'tempTrigger2',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '005',
						triggerName: 'tempTrigger3',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '006',
						triggerName: 'planCustomerProjects',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '006',
						triggerName: 'manageProjectBilligRequest',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '006',
						triggerName: 'manageMyTimesheet',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '006',
						triggerName: 'reviewCustomerProjects',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '006',
						triggerName: 'notifyMissingTimes',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '006',
						triggerName: 'releaseBillingProposals',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '006',
						triggerName: 'manageProjectBilling',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '006',
						triggerName: 'projectControl',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '006',
						triggerName: 'projectFinControllerOverview',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '006',
						triggerName: 'projectPlanningApp',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '006',
						triggerName: 'projectBrief',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '006',
						triggerName: 'tempTrigger1',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '006',
						triggerName: 'tempTrigger2',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '006',
						triggerName: 'tempTrigger3',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '007',
						triggerName: 'runComplianceReports',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '007',
						triggerName: 'documentReportCompliance',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '007',
						triggerName: 'tempTrigger1',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '007',
						triggerName: 'tempTrigger2',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '007',
						triggerName: 'tempTrigger3',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '008',
						triggerName: 'manageMaintenancePlans',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '008',
						triggerName: 'manageMaintenanceItems',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '008',
						triggerName: 'manageServiceOrdersV2',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '008',
						triggerName: 'tempTrigger1',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '008',
						triggerName: 'tempTrigger2',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '008',
						triggerName: 'tempTrigger3',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '008',
						triggerName: 'createMaintenanceRequest',
						validFrom: '2023-04-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '009',
						triggerName: 'manageProductionOrders',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '009',
						triggerName: 'manageProductionOperations',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '009',
						triggerName: 'manageMaterialCoverage',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '009',
						triggerName: 'manageMaterialCoverageNetIndSegments',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '009',
						triggerName: 'manageMaterialCoverageNetIndSegmentsV2',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '009',
						triggerName: 'manageMaterialCoverageV2',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '009',
						triggerName: 'manageMaterialCoverageNetSegments',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '009',
						triggerName: 'tempTrigger1',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '009',
						triggerName: 'tempTrigger2',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '009',
						triggerName: 'tempTrigger3',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '010',
						triggerName: 'gitEnabledCTS',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '011',
						triggerName: 'tempTrigger1',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '011',
						triggerName: 'tempTrigger2',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '011',
						triggerName: 'tempTrigger3',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '011',
						triggerName: 'smartBusiness',
						validFrom: '2023-04-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '011',
						triggerName: 'customCdsViews',
						validFrom: '2023-04-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '012',
						triggerName: 'tempTrigger1',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '012',
						triggerName: 'tempTrigger2',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					},
					{
						areaId: '012',
						triggerName: 'tempTrigger3',
						validFrom: '2022-05-01T00:00:01Z',
						validTo: '2024-12-01T00:00:01Z',
						isEnabled: true,
						trigger: { type: 'recurring', interval: 1, maxLimit: 2, startThreshold: 0 }
					}
				]
			},
			instantPush: {
				dailyLimit: 2,
				configs: [
					{
						areaId: 'POC',
						triggerName: 'instantPush1',
						validFrom: '2022-01-01T00:00:01Z',
						validTo: '2099-12-31T00:00:01Z',
						isEnabled: true,
						maxLimit: 2,
						quietPeriodInHrs: 2,
						showInvitation: true
					},
					{
						areaId: 'POC',
						triggerName: 'instantPush2',
						validFrom: '2022-01-01T00:00:01Z',
						validTo: '2099-12-31T00:00:01Z',
						isEnabled: true,
						maxLimit: 4,
						quietPeriodInHrs: 6,
						showInvitation: false
					}
				]
			}
		};
		return pushConfig;
	}
}
