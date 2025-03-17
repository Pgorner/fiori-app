// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @file Functionality to register the Fiori font icons
 */
sap.ui.define([
    "sap/ui/core/IconPool"
], (IconPool) => {
    "use strict";

    const iconfonts = {};

    /**
     * Loads SAP Fiori launch icon font and font icons needed in the FLP.
     *
     * Note: Used in many test pages.
     *
     * @ui5-restricted cp.client.flp.runtime
     */
    iconfonts.registerFiori2IconFont = function () {
        // register TNT icon font
        IconPool.registerFont({
            fontFamily: "SAP-icons-TNT",
            collectionName: "SAP-icons-TNT",
            fontURI: sap.ui.require.toUrl("sap/tnt/themes/base/fonts/"),
            lazy: true
        });

        // register TNT icon font under its legacy name (as it had been removed before and this was incompatible)
        IconPool.registerFont({
            fontFamily: "SAP-icons-TNT",
            collectionName: "TNTIcons", // legacy name
            fontURI: sap.ui.require.toUrl("sap/tnt/themes/base/fonts/"),
            lazy: true
        });

        // register BusinessSuiteInAppSymbols icon font (requires "BusinessSuiteInAppSymbols.json", don't delete it :)
        IconPool.registerFont({
            fontFamily: "BusinessSuiteInAppSymbols",
            collectionName: "BusinessSuiteInAppSymbols",
            fontURI: sap.ui.require.toUrl("sap/ushell/themes/base/fonts/"),
            lazy: true
        });

        // "SAP-icons" - old Fiori1 app icons
        const oFiori1Icons = {
            fontFamily: "SAP-icons",
            collectionName: "Fiori2",
            icons: [
                ["F0017", "e05e"],
                ["F0020", "e0c3"],
                ["F0021", "e10d"],
                ["F0392", "e04f"],
                ["F0394", "e044"],
                ["F0395", "e132"],
                ["F0396", "e064"],
                ["F0397", "e0a4"],
                ["F0398", "e0a4"],
                ["F0399", "e044"],
                ["F0401", "e08d"],
                ["F0402", "e13e"],
                ["F0403", "e13e"],
                ["F0404", "e033"],
                ["F0405", "e0b3"],
                ["F0406", "e043"],
                ["F0407", "e043"],
                ["F0408", "e043"],
                ["F0409", "e075"],
                ["F0410", "e007"],
                ["F0411", "e075"]
            ]
        };

        // "sap-launch-icons" - SAP Fiori launch icons: Wave2
        const oAppIcons = {
            fontFamily: "Fiori2", // Maps to sap-launch-icons in IconFonts.less
            collectionName: "Fiori2",
            icons: [
                // Transactional App Icons
                ["F0002", "E236"], // My Accounts
                ["F0003", "E202"], // Manage Tasks
                ["F0004", "E203"], // My Contacts
                ["F0005", "E204"], // My Appointments
                ["F0006", "E205"], // My Notes
                ["F0009", "E206"], // Reusable Component for Collaboration
                ["F0010", "E207"], // Reusable Component for Documents
                ["F0012", "E208"], // My Opportunities
                ["F0014", "E209"], // My Leads
                ["F0018", "E200"], // Enhanced Version Create Sales Order
                ["F0019", "E201"], // Enhanced Version Edit Sales Order
                ["F0023", "E20A"], // Create Customer (View,  Create)
                ["F0024", "E20B"], // My Contacts
                ["F0025", "E20C"], // My Quotations
                ["F0026", "E20D"], // My Quotations
                ["F0072", "E23A"], // Process Payment Proposal
                ["F0100", "E23B"], // Cash Position
                ["F0101", "E23C"], // Liquidity Forecast
                ["F0102", "E23D"], // Cash Flow
                ["F0106", "E20F"], // Process Collections Worklist
                ["F0144", "E210"], // Manage Document Issues
                ["F0190", "E23E"], // Bank Statement
                ["F0194", "E23F"], // Margin Dashboard
                ["F0210", "E242"], // Bank Risk
                ["F0211", "E243"], // Liquidity Structure
                ["F0212", "E244"], // Cash Pool Deficit
                ["F0217", "E211"], // My Supplier Invoices
                ["F0220", "E213"], // Request Access
                ["F0243", "E215"], // Release Production Order
                ["F0244", "E216"], // Confirm Production Order
                ["F0245", "E217"], // Confirm Production Operation
                // F0246 // Monitor Uncovered Sales Orders
                // F0247 // Monitor Material Shortages
                ["F0248", "E21A"], // Monitor Late Purchase Orders
                ["F0249", "E21B"], // Monitor Purchase Order Delays
                // F0250 // Manage Uncovered Sales Orders
                // F0251 // Manage Material Shortages
                ["F0252", "E21E"], // Manage Late Purchase Orders
                ["F0257", "E21F"], // Monitor Service Levels
                ["F0281", "E220"], // Approve Decision Points
                ["F0282", "E221"], // Change Portfolio Items
                ["F0283", "E222"], // Create Portfolio Item Proposals
                ["F0284", "E223"], // Confirm Project Tasks
                ["F0292", "E224"], // Change WBS Element Status
                ["F0295", "E225"], // Confirm Project Milestones
                ["F0296", "E226"], // Confirm Network Activities
                ["F0316", "E227"], // Report Quality Issues
                ["F0317", "E228"], // My Quality Tasks
                ["F0321", "E229"], // Confirm Purchase Orders
                ["F0339", "E22A"], // Reschedule Purchase Orders
                ["F0340", "E22B"], // Reschedule Purchase Requisitions
                ["F0341", "E22C"], // Create Purchase Orders
                ["F0342", "E22D"], // Generate Purchase Requisition
                ["F0365", "E212"], // My Expense Report
                ["F0366", "E22F"], // My Spend
                ["F0367", "E230"], // My Overdue Receivables
                ["F0368", "E231"], // My Exceptions
                ["F0369", "E235"], // Mobile Persona
                ["F0370", "E22E"], // My Customers Collection Details
                ["F0372", "E232"], // Approve Purchase Orders
                ["F0380", "E233"], // Process Receivables
                ["F0381", "E234"], // Track Document Issues
                ["F0382", "E246"], // Financial Statement Analysis
                ["F0390", "E20E"], // My Quotations
                ["F0412", "E214"], // Check Request Status
                ["F0429", "E2A6"], // Display Confirmed Purchase Orders

                // Analytic App Icons
                ["F0013", "E237"], // Simulate Sales Pipeline
                ["F0016", "E238"], // Track Sales Pipeline
                ["F0028", "E239"], // My Quotation Pipeline
                ["F0029", "E283"], // Order Fulfillment Issues
                ["F0030", "E284"], // Resolve Delivery Issues for Orders
                ["F0031", "E285"], // Resolve Incomplete Data in Orders
                ["F0032", "E286"], // Resolve Billing Block in Orders
                ["F0033", "E287"], // Resolve Credit Block in Orders
                ["F0034", "E288"], // Resolve Unconfirmed Quantities in Orders
                ["F0036", "E289"], // Resolve Shipping Block in Delivery
                ["F0038", "E28A"], // Resolve incomplete sales orders in delivery
                ["F0039", "E28B"], // Resolve Credit Block in Delivery
                ["F0041", "E28C"], // Resolve Shipping Issue in Delivery
                ["F0044", "E28D"], // Resolve Accounting Issue for Invoice
                ["F0293", "E28E"], // WBS Element Cost Variance
                ["F0294", "E28F"], // WBS Element Costs at Risk
                ["F0297", "E290"], // Due Project Milestones
                ["F0298", "E291"], // Overdue Project Milestones
                ["F0299", "E292"], // Overdue Project PO Items
                ["F0300", "E293"], // Due Project PO Items
                ["F0301", "E294"], // Due Network Activities
                ["F0302", "E295"], // Overdue Network Activities
                ["F0303", "E296"], // Due WBS Elements
                ["F0304", "E297"], // Overdue WBS Elements
                ["F0305", "E298"], // Missing Parts for Project
                ["F0306", "E299"], // Open Reservations for Project
                ["F0323", "E29A"], // Projected Service Level
                ["F0324", "E29B"], // Days of Supply
                ["F0326", "E29C"], // Stock Deficits
                ["F0327", "E29D"], // Stock Overages
                ["F0328", "E29E"], // Supply Shortages
                ["F0329", "E29F"], // Projected Stock Value
                ["F0331", "E2A1"], // Uncovered Sales Orders
                ["F0332", "E2A2"], // Supply Network
                ["F0343", "E2A3"], // Open Purchase Orders
                ["F0344", "E2A4"], // View Stock on Hand
                ["F0345", "E2A5"], // View Average Inventory
                ["F0388", "E2A7"], // Analyze Sentiments
                ["F0391", "E2A0"], // Network Inventory
                ["F0260", "E2B4"], // Release Production Order Operations
                ["FD10n", "E2B5"], // Customer Balance Display
                ["FK10n", "E2B6"], // Vendor Balance Display
                ["FS10n", "E2B7"], // Balance Display
                ["FBL5n", "E2B8"], // Accounts Receivable Items
                ["FBL1n", "E2B9"], // AP Line Items Display
                ["FFS01", "E2BA"], // Financial Statement
                ["FBL3n", "E2BB"], // General Ledger Line Items Display
                ["FCOA1", "E2BC"] // Chart of Accounts
            ]
        };

        // "sap-launch-icons" - SAP Fiori launch icons: Wave 3
        const oFiori3Icons = {
            fontFamily: "Fiori2", // Maps to sap-launch-icons in IconFonts.less
            collectionName: "Fiori3",
            icons: [
                ["F0246", "E218"], // Monitor External Requirements
                ["F0247", "E219"], // Monitor Material Shortages
                ["F0250", "E21C"], // Manage External Requirements
                ["F0251", "E21D"], // Manage Material Shortages
                ["F0263", "E2A8"], // Monitor Production Requirements
                ["F0508", "E2A9"], // Marketing Effectiveness – Release Target Groups
                ["F0509", "E2AA"], // Marketing Effectiveness – Initiative Search / Fact Sheet
                ["F0510", "E2AB"], // Monitor & Tracking of Archiving Jobs
                ["F0533", "E2AC"], // Location
                ["F0534", "E2AD"], // Location Product
                ["F0535", "E2AE"], // Product
                ["F0536", "E2AF"], // PPM (Production Process Model)
                ["F0537", "E2B0"], // PDS (production Data Structure)
                ["F0538", "E2B1"], // Transportation Lane
                ["Lumira001", "E2B2"] // Lumira
            ]
        };

        // "sap-launch-icons" - SAP Fiori launch icons: Wave 4
        const oFiori4Icons = {
            fontFamily: "Fiori2", // Maps to sap-launch-icons in IconFonts.less
            collectionName: "Fiori4",
            icons: [
                ["F0194", "E2BD"], // Net Margin Results
                ["F0260", "E2B4"], // Release Production Order Operations
                ["F0433", "E2BE"], // Workload Management - Claims
                ["F0499", "E2BF"], // Request New Supplier in MDG
                ["F0500", "E2C0"], // Request New Customer in MDG
                ["F0501", "E2C1"], // Request new Business Partner in MDG
                ["F0502", "E2C2"], // Request Material
                ["F0503", "E2C3"], // Request New Cost Center in MDG
                ["F0504", "E2C4"], // Request New Profit Center in MDG
                ["F0507", "E2C5"], // Marketing Generated Revenue
                ["F0530", "E2C6"], // EHS Control Inspection
                ["F0531", "E2C7"], // EHS Safety Information
                ["F0539", "E2C8"], // Change Activity Status
                ["F0544", "E2C9"], // Approve Service Entry Sheet
                ["F0545", "E2CA"], // Approve Supplier Invoice
                ["F0547", "E2CB"], // View Purchasing Document List
                ["F0576", "E2CC"], // Recipe Finder
                ["F0578", "E2CD"], // Demand Waterfall
                ["F0579", "E2CE"], // ATP Overview
                ["F0580", "E2CF"], // Explore Supply Shortage - longterm
                ["F0581", "E2D0"], // Explore Uncovered Demand - longterm
                ["F0582", "E2D1"], // Explore Stock deficits - longterm
                ["F0583", "E2D2"], // Explore Stock overage - longterm
                ["F0584", "E2D3"], // My Travel and Expenses
                ["F0586", "E2D4"], // Adjust Stock
                ["F0587", "E2D5"], // Approve Trading Contract
                ["F0588", "E2D6"], // Order Allocation Status - Open Orders
                ["F0589", "E2D7"], // Order Allocation Status - Top Articles
                ["F0590", "E2D8"], // Order Allocation Status - Order Status
                ["F0591", "E2D9"], // SPL Blocked Documents
                ["F0593", "E2DA"], // Manage Payment Blocks
                ["F0594", "E2DB"], // Future Payable Analysis
                ["F0597", "E2DC"], // Overdue Analysis
                ["F0603", "E2DD"], // DSO Analysis
                ["F0604", "E2DE"], // Future Receivables
                ["F0605", "E2DF"], // Days Beyond Term
                ["F0606", "E2E0"], // Disputed Amounts
                ["F0607", "E2E1"], // Dunning Analysis
                ["F0608", "E2E2"], // Credit Limit Utilization
                ["F0609", "E2E3"], // Promised Amounts
                ["F0615", "E2E4"], // ATP Analysis
                ["F0616", "E2E5"], // Analyze Substitutions
                ["F0618", "E2E6"], // Manage Data Aging Objects
                ["F0617", "E2E7"], // Manage Data Aging Groups
                ["F0622", "E2E8"], // Publish Data (For Global Market Research)
                ["F0623", "E2E9"], // Manage Publishing Groups (For Global Market Research)
                ["F0624", "E2EA"], // Global Release (For Global Market Research)
                ["F0625", "E2EB"], // Plan Data Deliveries
                ["F0626", "E2EC"], // Data Delivery Overview
                ["F0627", "E2ED"], // ILM – Data Archiving Distribution and Optimization Analysis
                ["F0629", "E2EE"], // Analyze Requirements
                ["F0630", "E2EF"], // WBS-Element revenue variance
                ["F0632", "E2F0"], // WBS-Element exceeding planned work
                ["F0633", "E2F1"], // WBS-Element Pending Work
                ["F0634", "E2F2"], // Milestone Trend Analysis
                ["F0635", "E2F3"], // Project Report
                ["F0636", "E2F4"], // Tracking the status of raised MDG request
                ["F0638", "E2F5"], // Marketing Generated Leads by Quarter
                ["F0639", "E2F6"], // Average Goods Issue Delay Time
                ["F0643", "E2F7"], // Overdue Delivery Items
                ["F0644", "E2F8"], // Weight of Delivery Items
                ["F0645", "E2F9"], // Volume of Delivery Items
                ["F0646", "E2FA"], // No. of Delivery Items
                ["F0648", "E2FB"], // No. of Deliveries
                ["F0649", "E2FC"], // Access Request on behalf of
                ["F0650", "E2FD"], // Compliance Approval
                ["F0654", "E2FE"], // DSiM Event Monitor
                ["F0655", "E2FF"], // Overdue Deliveries
                ["F0659", "E300"], // Dangerous Goods (shipper´s view)
                ["F0660", "E301"], // Utilizations
                ["F0661", "E302"], // Discrepancy handling
                ["F0665", "E303"], // OTR,  DTR (shipper´s view)
                ["F0666", "E304"], // Freight Order,  Booking Analysis
                ["F0667", "E305"], // Project Progress
                ["F0671", "E306"], // Workload Management - Tasks
                ["F0672", "E307"], // My CRM Hana Live Reports
                ["F0673", "E308"], // Bank Payment Approval
                ["F0675", "E309"], // Board Risk Report
                ["F0676", "E30A"], // Embargo Blocked Documents
                ["F0677", "E30B"], // License Blocked Documents
                ["F0678", "E30C"], // Technically Incomplete Documents
                ["F0679", "E30D"], // SPL Blocked Addresses
                ["F0680", "E30E"], // SPL Blocked Addresses in HCM
                ["F0682", "E30F"], // Invoice Price Change
                ["F0683", "E310"], // Purchasing Spend
                ["F0684", "E240"], // Profit Analysis
                ["F0685", "E312"], // Cash Discount Forecast
                ["F0686", "E313"], // Cash Discount Utilization
                ["F0687", "E314"], // Overdue Analysis
                ["F0690", "E315"], // Manage Dunning Block
                ["F0691", "E316"], // Cash Transfer
                ["F0692", "E317"], // Track Cash Transfer
                ["F0693", "E318"], // Payment Statistics
                ["F0694", "E319"], // Aging Analysis
                ["F0695", "E31A"], // Financial Close History
                ["F0700", "E31B"], // Correction Request
                ["F0598", "E31C"] // My Projects
            ]
        };

        // "sap-launch-icons" - SAP Fiori launch icons: Wave 5
        const oFiori5Icons = {
            fontFamily: "Fiori2", // Maps to sap-launch-icons in IconFonts.less
            collectionName: "Fiori5",
            icons: [
                ["F2001", "E31E"], // My Control Implementations
                ["F0839", "E320"], // Margin Analysis (Simple Finance)
                ["F0263", "E321"], // Monitor Production Requirements
                ["F0266", "E322"], // Monitor Production Orders
                ["F0270", "E323"], // Manage Production Requirements
                ["F0273", "E324"], // Manage Production Orders
                ["F0439", "E325"], // Net Position
                ["F0443", "E326"], // Net Position Change to Previous Day
                ["F0549", "E327"], // My Assortment Lists
                ["F0550", "E328"], // Manage Location Clusters
                ["F0551", "E329"], // Refine Assortment
                ["F0577", "E32A"], // Recipe Change Simulation
                ["F0585", "E32B"], // My Supplier Portfolio
                ["F0637", "E32C"], // Marketing-Generated Sales Pipeline
                ["F0668", "E32D"], // SAP Working Capital Analytics - DSO
                ["F0669", "E32E"], // SAP Working Capital Analytics - DPO
                ["F0670", "E330"], // Manage Change Requests
                ["F0688", "E331"], // Mark-to-Market Valuation
                ["F0689", "E332"], // Mark-to-Market Change to Previous Day
                ["F0701", "E333"], // Display Vendor Balances
                ["F0702", "E334"], // Manage Dispute Cases
                ["F0703", "E335"], // Display Customer Balances
                ["F0706", "E336"], // Display GL Account Line Items
                ["F0707", "E337"], // Display GL Account Balances
                ["F0708", "E338"], // Display Financial Statement
                ["F0711", "E339"], // Display Customer Line Items
                ["F0712", "E33A"], // Display Vendor Line Items
                ["F0731", "E33B"], // Master Data for GL Account
                ["F0732", "E33C"], // Master Data for Profit Center
                ["F0733", "E33D"], // Master Data for Functional Area (setup)
                ["F0735", "E33E"], // Analyze Payment Details
                ["F0736", "E340"], // My Bank Account Worklist
                ["F0737", "E341"], // Cash Position Details
                ["F0742", "E342"], // Post Vendor Invoice w/o Purchase Order
                ["F0743", "E343"], // Create Manual Payment
                ["F0744", "E344"], // Create Customer Correspondence
                ["F0745", "E345"], // Collection Progress
                ["F0746", "E346"], // Total Receivables
                ["F0747", "E347"], // Days Payable Outstanding Analysis
                ["F0748", "E348"], // Invoice Processing Times Analysis
                ["F0749", "E349"], // Promotion Execution Cockpit - All Promotion Preparation Issues
                ["F0750", "E34A"], // Promotion Execution Cockpit - Promotion Overdue Issues
                ["F0751", "E34B"], // Promotion Execution Cockpit - Promotion Errors
                ["F0755", "E34C"], // Agile Marketing Planning
                ["F0756", "E34D"], // Database Table Growth
                ["F0757", "E34E"], // Percentage On time Freight Orders (Proof of Delivery)
                ["F0758", "E350"], // Percentage On time Freight Orders (Departure)
                ["F0759", "E351"], // Percentage On time Freight Orders (Arrival)
                ["F0760", "E352"], // Percentage On time Freight Orders (Overall)
                ["F0761", "E353"], // Percentage On time Freight Orders (in Transit)
                ["F0763", "E354"], // Display Chart of Accounts
                ["F0764", "E355"], // Manage Profit Center Hierarchy
                ["F0765", "E356"], // Configure Company Codes
                ["F0768", "E357"], // House Banks Settings (setup)
                ["F0770", "E358"], // Create Payment Proposal
                ["F0771", "E359"], // Revise Payment Proposal/p>
                ["F0772", "E35A"], // Vendor Payment Analysis
                ["F0774", "E35B"], // Marketing Spend Analysis
                ["F0776", "E35C"], // My Courses
                ["F0777", "E35D"], // Inspect Marketing Orchestration
                ["F0778", "E35E"], // Dashboard Overview
                ["F0788", "E360"], // Import External Template
                ["F0789", "E361"], // My Results
                ["F0790", "E362"], // Manage Marketing Orchestration
                ["F0791", "E363"], // Marketing-Generated Opportunities
                ["F0792", "E364"], // Contact Conversions
                ["F0793", "E365"], // Sentiment Media Mix
                ["F0794", "E366"], // Manage TDMS Execution
                ["F0806", "E367"], // Open & Close Fiscal Periods
                ["F0807", "E368"], // Sales Analysis - Net Sales
                ["F0808", "E369"], // Sales Analysis - Gross Margin
                ["F0809", "E36A"], // Sales Analysis - Average Basket Value
                ["F0810", "E36B"], // Sales Analysis - Number of Transactions
                ["F0811", "E36C"], // Sales Analysis - Inventory Turnover
                ["F0812", "E36D"], // Sales Analysis - Actual vs Forecasted
                ["F0813", "E36E"], // Sales Analysis - Average Basket Size
                ["F0814", "E370"], // Sales Analysis - Return Net Sales
                ["F0815", "E371"], // Drill Down App
                ["F0816", "E372"], // Manage Authorizations
                ["F0817", "E373"], // Define New KPI
                ["F0818", "E374"], // KPI Workspace
                ["F0819", "E375"], // Edit Drill Down Configurations
                ["F0820", "E376"], // Edit Tiles
                ["F0821", "E377"], // Edit KPI Relationships
                ["F0822", "E378"], // Create Evaluation
                ["F0823", "E379"], // CFO Net Margin KPI
                ["F0824", "E37A"], // CFO Gross Margin KPI
                ["F0825", "E37B"], // CFO Net Sales KPI
                ["F0826", "E37C"], // CFO Revenue KPI
                ["F0827", "E37D"], // SAP Entity Dashboard
                ["F0828", "E37E"], // CFO GTN KPI
                ["F0829", "E380"], // Manage Product Attributes
                ["F0830", "E381"], // My Option Plans
                ["F0831", "E382"], // Match Placeholder
                ["F0717", "E384"], // Manage GL Doc
                ["F0718", "E383"], // Post GL Doc
                ["F0241", "E385"], // Manage Financial Statement Structure
                ["F0246", "E386"], // Monitor External Requirements
                ["F0250", "E387"], // Manage External Requirements
                ["F0248", "E388"], // Monitor External Receipts
                ["F0252", "E389"], // Manage External Receipts
                ["F0600", "E38A"], // Manage Budget
                ["F0674", "E38B"], // News App
                ["F0247", "E38E"], // Monitor Material Shortages
                ["F0251", "E390"] // Manage Material Shortages
            ]
        };

        // "sap-launch-icons" - SAP Fiori launch icons: Wave 6
        const oFiori6Icons = {
            fontFamily: "Fiori2", // Maps to sap-launch-icons in IconFonts.less
            collectionName: "Fiori6",
            icons: [
                ["F0670-1", "E393"], // Answered Change Requests
                ["F0670-2", "E394"], // Collected Change Requests
                ["F0670-3", "E395"], // Completed Change Requests
                ["F0670-4", "E396"], // Requested Change Requests
                ["F0795", "E397"], // Account Closure
                ["F0866", "E3A0"], // My Shops
                ["F0865", "E3A1"], // Manage Products
                ["F0867", "E3A2"], // List Of Outbound Deliveries
                ["F0868", "E3A3"], // Pick Delivery
                ["F0869", "E3A4"], // Create Delivery
                ["F0870", "E3A5"], // Analyze Delivery Log
                ["F0138", "E3A6"], // Manage Purchase Order
                ["F0752", "E3A7"], // Order Products
                ["F0753", "E3A8"], // Transfer Stock
                ["F0773", "E3A9"], // Manual Clearing Incoming Payments
                ["F0891", "E3AA"], // My Timetable
                ["F0892", "E3AB"], // Track Degree Requirement
                ["F1023", "E3AC"], // Manage Cost Center Master Data
                ["F0767", "E3AD"], // Analyze Liquidity Plans
                ["F0849", "E3AE"] // Manage Depreciation Runs
            ]
        };

        // "sap-launch-icons" - SAP Fiori launch icons: Wave 7
        const oFiori7Icons = {
            fontFamily: "Fiori2", // Maps to sap-launch-icons in IconFonts.less
            collectionName: "Fiori7",
            icons: [
                ["F1079", "E3B0"], // Manage Forecast Demand
                ["F0738", "E3B1"], // Make Liquidity Plans
                ["F1301", "E3B2"], // Display Technical Users
                ["F1302", "E3B3"], // Maintain Catalog Roles
                ["F1303", "E3B4"], // Maintain Business Users
                ["F1338", "E3B5"], // Maintain Communication Users
                ["F1263", "E3B6"], // Student File
                ["F1373", "E3B7"], // Approve Purchase Orders
                ["F0863", "E3B8"], // Define Subjects
                ["F0955", "E3B9"], // Trial Balance
                ["F1068", "E3BA"], // Virtual Data Model View Browser
                ["F1242", "E3BB"], // Manage Forecast Models
                ["F1405", "E3BC"], // Roles
                ["F1406", "E3BD"], // Dashboards
                ["F1407", "E3BE"], // Analytics
                ["F1408", "E3BF"], // Change History
                ["F1409", "E3C0"], // Cases
                ["F1410", "E3C1"], // Tasks
                ["F1411", "E3C2"], // Data Integration
                ["F1412", "E3C3"], // Configuration
                ["F1413", "E3C4"], // Visibility Filter
                ["F1414", "E3C5"], // User Profile
                ["F1415", "E3C6"], // User Management
                ["F1476", "E3C7"], // Process Modeling
                ["F0797", "E3C8"], // Manage Customer Invoice
                ["F0798", "E3C9"], // Create Customer Invoice
                ["F0800", "E3CA"], // Manage Sales Order For Materials
                ["F0801", "E3CB"], // Create Sales Order For Materials
                ["F0804", "E3CC"], // Manage Sales For Services
                ["F0850", "E3CD"], // Manage Customer Master Data
                ["F0890", "E3CE"], // Set Sales Prices For Materials
                ["F1075", "E3CF"], // Sales Order Fulfillment Monitor
                ["F1394", "E3D0"], // Set Sales Prices For Services
                ["F1061", "E3D1"], // Transfer Stock
                ["F1062", "E3D2"], // Manage Stock
                ["F1255", "E3D3"], // Open Web-GUI Transaction-MMPV
                ["F1077", "E3D4"], // Manage Material Documents
                ["F0843", "E3D5"], // Post Goods Receipt For PO
                ["F1076", "E3D6"], // Stock Overview
                ["F0859", "E3D7"], // Manage Supplier Invoice
                ["F1060", "E3D8"], // Supplie Invoice List
                ["F1053", "E3D9"], // Manage Supplier Master Data
                ["F0900", "E3DA"], // Monitoring Purchasing Document
                ["F0840", "E3DB"], // Manage Sources Of Supply
                ["F0842-1", "E3A6"], // Manage PO
                ["F0842-2", "E22C"] // Create PO
            ]
        };

        // "sap-launch-icons" - SAP Fiori launch icons: Wave 8
        const oFiori8Icons = {
            fontFamily: "Fiori2", // Maps to sap-launch-icons in IconFonts.less
            collectionName: "Fiori8",
            icons: [
                ["F1317", "E3DC"], // Subscribe Alerts
                ["F1318", "E3DD"], // Define Alerts
                ["F1319", "E3DE"], // Monitor Alerts
                ["F1369", "E3DF"], // Manage House Banks
                ["F1475", "E3E0"], // Enter Grades
                ["F1345", "E3E1"], // Post Incoming Payments
                ["F1248", "E3E2"], // Receive Products
                ["F1067", "E3E3"], // Manage Demand Sensing Issues
                ["F1332", "E3E4"], // Define Credentials & End Points
                ["F1333", "E3E5"], // Assign Network ID to Company Codes
                ["F1334", "E3E6"], // Map Tax Codes for Logistics Invoice Verification
                ["F1335", "E3E7"], // Map Company Codes for Logistics Invoice Verification
                ["F1520", "E3E8"], // Reprocess Bank Statement Items
                ["F1457", "E3E9"], // Search Form Bundles
                ["F1504", "E3EA"], // IBP Collaborations
                ["F1505", "E3EB"] // IBP Favorites
            ]
        };

        // "sap-launch-icons" - SAP Fiori launch icons: Wave 9
        const oFiori9Icons = {
            fontFamily: "Fiori2", // Maps to sap-launch-icons in IconFonts.less
            collectionName: "Fiori9",
            icons: [
                ["F1094", "E3EC"], // Manage Check Books
                ["F1096", "E3ED"], // Manage Outgoing Checks
                ["F1353", "E3EE"], // My Incidents
                ["F1354", "E3EF"], // My SAP Notes
                ["F1428", "E3F0"], // My Business Requirements
                ["F1492", "E3F1"], // Maintain Business Roles
                ["F1515", "E3F2"], // Run Statutory Reports
                ["F1516", "E3F3"], // IBP Manage Planning Run Definition
                ["F0997", "E400"], // Audit Journals
                ["F1512", "E401"], // Count Stock
                ["F1562", "E402"], // Print Labels
                ["F1564", "E403"], // Manage Bank Statements
                ["F1599", "E404"], // Assign Forecast Models
                ["F1596", "E405"], // Carry Forward Balance
                ["F1254", "E406"], // Support Package Packet
                ["F1618", "E407"], // Maintain Deletion Rules
                ["F1561", "E408"], // Define Operation Customizing
                ["learning-compass", "E409"], // Learning Compass
                ["partner-enablement", "E40A"] // SAP Partner Enablement
            ]
        };

        // "sap-launch-icons" - S/4 Hana Generic Icons
        const oS4HanaIcons = {
            fontFamily: "Fiori2", // Maps to sap-launch-icons in IconFonts.less
            collectionName: "S4Hana",
            icons: [
                ["S0001", "E3F4"], // Financials
                ["S0002", "E3F5"], // Procurement
                ["S0003", "E3F6"], // Production Planning
                ["S0004", "E3F7"], // Logistics Execution
                ["S0005", "E3F8"], // Product Lifecycle Management
                ["S0006", "E3F9"], // Project System
                ["S0007", "E3FA"], // Sales & Distribution
                ["S0008", "E3FB"], // Inventory Management
                ["S0009", "E3FC"], // Quality Management
                ["S0010", "E3FD"], // Cross App
                ["S0011", "E3FE"], // Customer Service
                ["S0012", "E3FF"] // Plant Maintenance
            ]
        };

        // "sap-fiori-inapp-icons"
        const oFioriInApp = {
            fontFamily: "FioriInAppIcons",
            collectionName: "FioriInAppIcons",
            icons: [
                ["Hierarchal Tree", "e700"],
                ["Open", "e701"],
                ["Blocked", "e702"],
                ["Partially Blocked", "e703"],
                ["Open1", "e704"],
                ["Partially Adopted", "e705"],
                ["Due", "e706"],
                ["Overdue", "e707"],
                ["Sort", "e708"],
                ["Missing Parts", "e709"],
                ["Fire", "e70a"],
                ["Dangerous Chemicals", "e70b"],
                ["Share", "e70c"],
                ["Entertainment", "e70d"],
                ["Gift", "e70e"],
                ["QR Code", "e70f"],
                ["Wifi-Online", "e710"],
                ["Wifi-Offline", "e711"],
                ["Sunrise", "e712"],
                ["Sunset", "e713"],
                ["Afternoon", "e714"],
                ["Night", "e715"],
                ["Loading Date", "e715"],
                ["Cloudy", "e717"],
                ["Rain", "e718"],
                ["Storm", "e719"],
                ["Partly Sunny", "e71a"],
                ["Heavy Rain", "e71b"],
                ["Foggy", "e71c"],
                ["Snow", "e71d"],
                ["Risk Assessment", "e71e"],
                ["Database", "e71f"],
                ["Marine", "e720"],
                ["Blister", "e721"],
                ["Pills", "e722"],
                ["Main-Sequence", "e723"],
                ["Parallel Sequence", "e724"],
                ["Alternative Sequence", "e725"],
                ["3D", "e726"],
                ["Presentation", "e727"],
                ["Mute", "e728"],
                ["Windy", "e729"],
                ["Oil Tank", "e72a"],
                ["Location Assets", "e72b"],
                ["Transport Systems", "e72c"],
                ["Field", "e72d"],
                ["Field Group", "e72e"],
                ["Record", "e730"],
                ["Record Group", "e731"]
            ]
        };

        // "sap-launch-icons" - SAP Fiori Non-Native launch icons
        const oFioriNonNative = {
            fontFamily: "Fiori2", // Maps to sap-launch-icons in IconFonts.less
            collectionName: "FioriNonNative",
            icons: [
                ["FN0001", "E392"], // Product Recommendation Intelligence
                ["FN0002", "E398"], // Manage Users
                ["FN0003", "E399"], // Manage Trucks
                ["FN0004", "E39A"], // Manage Incidents
                ["FN0005", "E39B"], // Manage Tours
                ["FN0006", "E39C"], // Monitor Port Status
                ["FN0007", "E39D"], // My Business Partners
                ["FN0008", "E39E"], // Monitor Tour Status
                ["FN0009", "E39F"] // Monitor Roadhouse Status
            ]
        };

        this.registerFonts(
            oAppIcons,
            oFiori1Icons,
            oFiori3Icons,
            oFiori4Icons,
            oFiori5Icons,
            oFiori6Icons,
            oFiori7Icons,
            oFiori8Icons,
            oFiori9Icons,
            oFioriInApp,
            oFioriNonNative,
            oS4HanaIcons
        );
    };

    /**
     * Loads icon font characters (i.e. icons).
     * Note that the icon font has to be previously registered via CSS (i.e. via "@font-face").
     *
     * @param {...object} oIconCollection Icon font definition:
     *   <pre>
     *     oIconCollection = {
     *       fontFamily: "FontFamilyName",        // from "@font-face" CSS definition
     *       collectionName: "collectionName",    // collection name, e.g. "Fiori2"
     *       icons: [                             // list of ["icon name", "unicode codepoint"] tuples
     *         ["icon-name", "E001"],
     *         ["...", "..."],
     *         ...
     *       ]
     *     }
     *   </pre>
     *
     * @private
     */
    iconfonts.registerFonts = function (...oIconCollection) {
        oIconCollection.forEach((oEachIconCollection) => {
            oEachIconCollection.icons.forEach((aIcon) => {
                IconPool.addIcon(aIcon[0], oEachIconCollection.collectionName, {
                    fontFamily: oEachIconCollection.fontFamily,
                    content: aIcon[1],
                    overWrite: false,
                    suppressMirroring: true
                });
            });
        });
    };

    return iconfonts;
}, /* bExport= */ true);
