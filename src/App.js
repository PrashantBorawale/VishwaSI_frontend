import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Footer from "./Footer/Footer";
import FullScreenLoader from "./components/FullScreenLoader.jsx";
const InprocessInspectionDetails = React.lazy(() => import("./Quality/InprocessQC/InprocessInspection/InprocessInspectionDetails"));
const RejectionMaterialQC = React.lazy(() => import("./Quality/SalesReturnQC/RejectionMaterialQC"));

const Dashboard = React.lazy(() => import("./Dashboard/Dashboard.jsx"));
// import Home from "./Home/Home";
// import MainPage from "./MainPage/MainPage";
const VendorPage = React.lazy(() => import("./VendorPage/VendorPage"));
const Login = React.lazy(() => import("./Login/Login.jsx"));

/////////////////////////// Masters ///////////////////////////////

const MasterState = React.lazy(() => import("./components/Master/MasterState"));
const MasterCustomers = React.lazy(() => import("./components/Master1/MasterCustomers"));
const CustomerState = React.lazy(() => import("./components/Master2/CustomerState"));
const ItemMaster = React.lazy(() => import("./components/ItemMasterr/ItemMaster/ItemMaster"));
const AddNewItem = React.lazy(() => import("./components/ItemMasterr/AddNewItem/AddNewItem"));
const ItemMasterGernal = React.lazy(() => import("./components/ItemMasterr/ItemMasterGernal/ItemMasterGernal"));
// import ItemMasterQuery from "./components/ItemMasterr/ItemMasterQuery/ItemMasterQuery.jsx";
const WorkCenterMaster = React.lazy(() => import("./components/WorkCenterMaster/WorkCenterMaster"));
const BusinessPartner = React.lazy(() => import("./components/BusinessPartner/BusinessPartner"));
const CustomerItemWise = React.lazy(() => import("./components/CustomerItemWise/CustomerItemWise.jsx"));
const CustomerSupplierLink = React.lazy(() => import("./components/CustomerSupplierLink/CustomerSupplierLink.jsx"));
const ItemCrossReference = React.lazy(() => import("./components/ItemCrossReference.js/ItemCrossReference"));
const GstMaster = React.lazy(() => import("./components/GstMaster/GstMaster"));
const CustomerItemGst = React.lazy(() => import("./components/GstMaster/CustomerItem/CustomerItem"));
const TaskMaster = React.lazy(() => import("./components/GstMaster/TaskMaster/TaskMaster"));
const Cutwise = React.lazy(() => import("./components/GstMaster/Cutwise/Cutwise"));
const SupplierCustomerMaster = React.lazy(() => import("./components/SupplierCustomerMaster/SupplierCustomerMaster"));
const VenderListSupplier = React.lazy(() => import("./components/SupplierCustomerMaster/VenderList/VenderList"));
const BomRouting = React.lazy(() => import("./components/BOMRouting/BomRouting"));
const BillMaterial = React.lazy(() => import("./components/BOMRouting/BillMaterial/BillMaterial"));
const OperatorSupervisor = React.lazy(() => import("./components/Operator-Supervisor/OperatorSupervisor"));
const Supervisor = React.lazy(() => import("./components/Operator-Supervisor/Supervisor/Supervisor"));
const DepartmentHead = React.lazy(() => import("./components/Operator-Supervisor/DepartmentHead/DepartmentHead"));
const ContractorMaster = React.lazy(() => import("./components/ContractorMaster/ContractorMaster"));
const AddContractorMAster = React.lazy(() => import("./components/ContractorMaster/AddContractor/AddContractor"));
const ShiftMaster = React.lazy(() => import("./components/ShiftMaster/ShiftMaster"));
const UnitConversion = React.lazy(() => import("./components/UnitConversion/UnitConversion"));
const PriceListMaster = React.lazy(() => import("./components/PriceListMaster/PriceListMaster"));
const PriceEntry = React.lazy(() => import("./components/PriceListMaster/PeiceEntry/PriceEntry"));
const CycleTime = React.lazy(() => import("./components/CycleTimeMaster/CycleTime"));
const AddCycleTime = React.lazy(() => import("./components/CycleTimeMaster/AddCycleTime/AddCycleTime"));
const CommodityMaster = React.lazy(() => import("./components/CommodityMaster/CommodityMaster"));
const CostCenterMaster = React.lazy(() => import("./components/CostCenterMaster/CostCenterMaster"));
const WorkCenterSchedule = React.lazy(() => import("./components/WorkSchedule/WorkSchedule"));
const ProjectManagement = React.lazy(() => import("./components/ProjectManagement/ProjectManagement"));
const ProjectInventory = React.lazy(() => import("./components/ProjectManagement/ProjectInventory/ProjectInventory"));
const DocumentManagement = React.lazy(() => import("./components/DocumentManagement/DocumentManagement"));
const MasterReport = React.lazy(() => import("./components/MasterReport/MasterReport"));

const ItemMasterQuery = React.lazy(() => import("./components/ItemMasterr/ItemMasterQuery/ItemMasterQuery.jsx"));
const QueryPages = React.lazy(() => import("./components/ItemMasterr/ItemMasterQuery/QueryPages.jsx"));
const CustomerQuery = React.lazy(() => import("./components/SupplierCustomerMaster/VenderList/CustomerQuery.jsx"));
const BOMQuery = React.lazy(() => import("./components/BOMRouting/BOMQuery.jsx"));
const PriceListQueryMaster = React.lazy(() => import("./components/PriceListMaster/PriceListQueryMaster.jsx"));
const PriceListQuery = React.lazy(() => import("./components/PriceListMaster/PriceListQuery.jsx"));
const CustomerQueryMaster = React.lazy(() => import("./components/SupplierCustomerMaster/VenderList/CustomerQueryMaster.jsx"));
const BOMMasterQuery = React.lazy(() => import("./components/BOMRouting/BOMMasterQuery.jsx"));
const UploadWIPvalue = React.lazy(() => import("./components/BOMRouting/BOMReport/UploadWIPvalue.jsx"));
const UploadOperationSpeci = React.lazy(() => import("./components/BOMRouting/BOMReport/UploadOperationSpeci.jsx"));



// /////////////////////////////// Erp Setting /////////////////////////////////////////

const UserConfiguration = React.lazy(() => import("./ERPSetting/UserConfiguration/UserConfiguration.jsx"));
const DisableUserList = React.lazy(() => import("./ERPSetting/UserConfiguration/DisableUserList/DisableUserList.jsx"));
const ErpSetting = React.lazy(() => import("./ERPSetting/ErpSetting/ErpSetting.jsx"));
const UserPermission = React.lazy(() => import("./ERPSetting/UserPermission/UserPermission.jsx"));
const UserPermit = React.lazy(() => import("./ERPSetting/UserConfiguration/UserPermit/UserPermit.jsx"));
const DashboardPermission = React.lazy(() => import("./ERPSetting/UserConfiguration/DashboardPermission/DashboardPermission.jsx"));
const BackDated = React.lazy(() => import("./ERPSetting/UserConfiguration/BackDated/BackDated.jsx"));
const UserWiseSeries = React.lazy(() => import("./ERPSetting/UserConfiguration/UserWiseSeries/UserWiseSeries.jsx"));
const ChangePassword = React.lazy(() => import("./ERPSetting/ChangePassword/ChangePassword.jsx"));
const UserwiseProduction = React.lazy(() => import("./ERPSetting/UserConfiguration/UserwiseProduction/UserwiseProduction.jsx"));
const LoginHistory = React.lazy(() => import("./ERPSetting/LoginHistoryReport/LoginHistory.jsx"));
const USerwiseAuth = React.lazy(() => import("./ERPSetting/UserConfiguration/UserwiseAuth/USerwiseAuth.jsx"));
const DeleteMangement = React.lazy(() => import("./ERPSetting/DeleteMangement/DeleteMangement.jsx"));
const OrderList = React.lazy(() => import("./ERPSetting/DeleteMangement/OrderList.jsx"));
const ViewStock = React.lazy(() => import("./ERPSetting/DeleteMangement/ViewStock.jsx"));
const USerList = React.lazy(() => import("./ERPSetting/DeleteMangement/USerList.jsx"));
const DashboardBackup = React.lazy(() => import("./ERPSetting/DashboardBackup/DashboardBackup.jsx"));
const DeleteRecord = React.lazy(() => import("./ERPSetting/DeleteRecord/DeleteRecord.jsx"));
const ItemDelete = React.lazy(() => import("./ERPSetting/DeleteRecord/ItemDelete/ItemDelete.jsx"));
const DeleteReport = React.lazy(() => import("./ERPSetting/DeleteRecord/DeleteReport/DeleteReport.jsx"));
const Userplant = React.lazy(() => import("./ERPSetting/UserConfiguration/UserPlant/Userplant.jsx"));
const Plantwiseseries = React.lazy(() => import("./ERPSetting/UserConfiguration/PlantwiseSeries/Plantwiseseries.jsx"));
const AlertSetting = React.lazy(() => import("./ERPSetting/UserConfiguration/AlertSetting/AlertSetting.jsx"));
const Userwisepermission = React.lazy(() => import("./ERPSetting/UserConfiguration/Userwisepermissiom/Userwisepermission.jsx"));
const Companysetup = React.lazy(() => import("./ERPSetting/ErpSetting/Companysetup/Companysetup.jsx"));
const ErpWebConfig = React.lazy(() => import("./ERPSetting/ErpSetting/ErpWebconfig/ErpWebConfig.jsx"));
const ErpFinancialYear = React.lazy(() => import("./ERPSetting/ErpSetting/ErpFinancialYear/ErpFinancialYear.jsx"));
const DocumentStart = React.lazy(() => import("./ERPSetting/ErpSetting/ErpFinancialYear/DocumentStart/DocumentStart.jsx"));
const FinancialMonth = React.lazy(() => import("./ERPSetting/ErpSetting/FinancialMonth/FinancialMonth.jsx"));
const ScheduleMonth = React.lazy(() => import("./ERPSetting/ErpSetting/SeheduleMonth/ScheduleMonth.jsx"));
const Weekoff = React.lazy(() => import("./ERPSetting/ErpSetting/Weeklyoff/Weekoff.jsx"));
const Settingerp = React.lazy(() => import("./ERPSetting/ErpSetting/Setting/Settingerp.jsx"));
const Docseriesgroup = React.lazy(() => import("./ERPSetting/ErpSetting/Docseriesgroup/Docseriesgroup.jsx"));
const DocprintFormat = React.lazy(() => import("./ERPSetting/ErpSetting/Docprintformat/DocprintFormat.jsx"));
const Docnoeditable = React.lazy(() => import("./ERPSetting/ErpSetting/DocNoEditable/Docnoeditable.jsx"));
const Qcisoformat = React.lazy(() => import("./ERPSetting/ErpSetting/Qcisoformat/Qcisoformat.jsx"));
const Roundofsetting = React.lazy(() => import("./ERPSetting/ErpSetting/Roundofsetting/Roundofsetting.jsx"));
const Customersupplier = React.lazy(() => import("./ERPSetting/ErpSetting/Customersupplier/Customersupplier.jsx"));
const Itemmastersetup = React.lazy(() => import("./ERPSetting/ErpSetting/ItemMasterSetup/Itemmastersetup.jsx"));
const Emailsms = React.lazy(() => import("./ERPSetting/ErpSetting/Emailsms/Emailsms.jsx"));
const Emailsetup = React.lazy(() => import("./ERPSetting/ErpSetting/Emailsetup/Emailsetup.jsx"));
const Emailtemplate = React.lazy(() => import("./ERPSetting/ErpSetting/Emailtemplate/Emailtemplate.jsx"));
const AddQuater = React.lazy(() => import("./ERPSetting/ErpSetting/FinancialMonth/AddQuater/AddQuater.jsx"));
const WeekMaster = React.lazy(() => import("./ERPSetting/ErpSetting/SeheduleMonth/WeekMaster/WeekMaster.jsx"));
const MasterData = React.lazy(() => import("./ERPSetting/ErpSetting/Docseriesgroup/MasterData/MasterData.jsx"));
const PurchaseErp = React.lazy(() => import("./ERPSetting/ErpSetting/Docseriesgroup/PurchaseOrder/PurchaseErp.jsx"));
const PurchaseERPGRN = React.lazy(() => import("./ERPSetting/ErpSetting/Docseriesgroup/PurchaseERPGRN/PurchaseERPGRN.jsx"));
const OutwardInward = React.lazy(() => import("./ERPSetting/ErpSetting/Docseriesgroup/OutwardInward/OutwardInward.jsx"));
const DebitcreditNote = React.lazy(() => import("./ERPSetting/ErpSetting/Docseriesgroup/Debitcredit/DebitcreditNote.jsx"));
const DocAccount = React.lazy(() => import("./ERPSetting/ErpSetting/Docseriesgroup/DocAccount/DocAccount.jsx"));
const Docddelivery = React.lazy(() => import("./ERPSetting/ErpSetting/Docseriesgroup/Docdelivery/Docddelivery.jsx"));
const DocProduction = React.lazy(() => import("./ERPSetting/ErpSetting/Docseriesgroup/DocProduction/DocProduction.jsx"));
const GSTsales = React.lazy(() => import("./ERPSetting/ErpSetting/Docseriesgroup/GSTSales/GSTsales.jsx"));
const GstsalesReturn = React.lazy(() => import("./ERPSetting/ErpSetting/Docseriesgroup/GStsalesReturn/GstsalesReturn.jsx"));
const Quotation = React.lazy(() => import("./ERPSetting/ErpSetting/Docseriesgroup/Quotation/Quotation.jsx"));
const DocCompanySetting = React.lazy(() => import("./ERPSetting/ErpSetting/Docprintformat/CompanySetting/DocCompanySetting.jsx"));
const ViewItemMaster = React.lazy(() => import("./ERPSetting/ErpSetting/ItemMasterSetup/ViewItemMaster/ViewItemMaster.jsx"));

const SettingHistory = React.lazy(() => import("./ERPSetting/UserPermission/SettingHistory.jsx"));
const DefaultSettingsModal = React.lazy(() => import("./ERPSetting/ErpSetting/Emailsetup/DefaultSettingModel/DefaultSettingsModal.jsx"));



///////////////////////////////Purchase////////////////////////////////////

const Newindent = React.lazy(() => import("./PurchaseMaster/Newindent/Newindent"));
const PoList = React.lazy(() => import("./PurchaseMaster/NewPurchaseOrder/PoList/PoList.jsx"));
const NewPurchaseOrder = React.lazy(() => import("./PurchaseMaster/NewPurchaseOrder/NewPurchaseOrder.jsx"));
const NewJobworkPurchase = React.lazy(() => import("./PurchaseMaster/NewJobworkPurchase/NewJobworkPurchase.jsx"));
const PendingPo = React.lazy(() => import("./PurchaseMaster/PendingPo/PendingPo.jsx"));
const PendingJobworkPORelease = React.lazy(() => import("./PurchaseMaster/PendingJobworkPORelease/PendingJobworkPORelease.jsx"));
const PendingIndent = React.lazy(() => import("./PurchaseMaster/PendingIndent/PendingIndent.jsx"));
const PurchaseMrn = React.lazy(() => import("./PurchaseMaster/PurchaseMRN/PurchaseMrn.jsx"));
const PurchseOrderStatus = React.lazy(() => import("./PurchaseMaster/PurchseOrderStatus/PurchseOrderStatus.jsx"));
const Rfo = React.lazy(() => import("./PurchaseMaster/QuotoComparison/RFo/Rfo.jsx"));
const QuotoComparisonStatement = React.lazy(() => import("./PurchaseMaster/QuotoComparison/QuotoComparisonStatement/QuotoComparisonStatement.jsx"));
const QuotoComparisonPending = React.lazy(() => import("./PurchaseMaster/QuotoComparison/QuotoComparisonPending/QuotoComparisonPending.jsx"));
const JobWorkPurchseOrderList = React.lazy(() => import("./PurchaseMaster/Report/JobWorkPurchaseOrderList1/JobWorkPurchseOrderList.jsx"));
const PurchseOderList = React.lazy(() => import("./PurchaseMaster/Report/PurchaseOrderList1/PurchseOderList.jsx"));
const PurchaseReport = React.lazy(() => import("./PurchaseMaster/Report/PurchaseReport1/PurchaseReport.jsx"));
const SupplierWiseList = React.lazy(() => import("./PurchaseMaster/Report/SupplierWiseList1/SupplierWiseList.jsx"));
const POEdit = React.lazy(() => import("./PurchaseMaster/NewPurchaseOrder/POEdit/POEdit.jsx"));
const PurchaseOrderPDF = React.lazy(() => import("./PurchaseMaster/NewPurchaseOrder/PurcheseOrderPDF/PurchaseOrderPDF.jsx"));

const ListIndent = React.lazy(() => import("./PurchaseMaster/Newindent/Indent/ListIndent.jsx"));
const IndentStutasReport = React.lazy(() => import("./PurchaseMaster/Newindent/Indent/IndentStutasReport.jsx"));
const RecentlyPoApprovalList = React.lazy(() => import("./PurchaseMaster/NewPurchaseOrder/PoList/RecentApprovalPO.jsx"));
const AMCPurchaseOrderList = React.lazy(() => import("./PurchaseMaster/NewPurchaseOrder/PoList/AMCPurchaseOrderList.jsx"));
const PurchaseQuerySummary = React.lazy(() => import("./PurchaseMaster/NewPurchaseOrder/PoList/QueryList/PurchaseQuerySummary.jsx"));
const PurchaseQuery = React.lazy(() => import("./PurchaseMaster/NewPurchaseOrder/PoList/QueryList/PurchaseQuery.jsx"));
const RFONew = React.lazy(() => import("./PurchaseMaster/QuotoComparison/RFo/RFONew.jsx"));
const QuoteStatementList = React.lazy(() => import("./PurchaseMaster/QuotoComparison/QuotoComparisonStatement/QuoteStatementList.jsx"));
const JobworkPOSummary = React.lazy(() => import('./PurchaseMaster/Report/JobWorkPurchaseOrderList1/QueryJobworkList/JobworkPOSummary.jsx'));
const JobworkQuery = React.lazy(() => import("./PurchaseMaster/Report/JobWorkPurchaseOrderList1/QueryJobworkList/JobworkQuery.jsx"));
const RecenlyApproveJobworkList = React.lazy(() => import("./PurchaseMaster/NewJobworkPurchase/JobworkList/RecenlyApproveJobworkList.jsx"));

const Importfile = React.lazy(() => import("./PurchaseMaster/Import/Importfile.jsx"));
const ImportPO = React.lazy(() => import("./PurchaseMaster/Import/Transaction/ImportPO/ImportPO.jsx"));
const ImportPOList = React.lazy(() => import("./PurchaseMaster/Import/Transaction/ImportPO/ImportPOList.jsx"));
const POConsignment = React.lazy(() => import("./PurchaseMaster/Import/Transaction/POConsignment/POConsignment.jsx"));
const POConsignmentList = React.lazy(() => import("./PurchaseMaster/Import/Transaction/POConsignment/POConsignmentList.jsx"));
const ImportGRN = React.lazy(() => import("./PurchaseMaster/Import/Transaction/ImportGRN/ImportGRN.jsx"));
const ImportGRNList = React.lazy(() => import("./PurchaseMaster/Import/Transaction/ImportGRN/ImportGRNList.jsx"));


////////////////////////////////Store//////////////////////////////////////////////////////

const GateInwardEntry = React.lazy(() => import("./StoreMaster/GateInwardEntry/GateInwardEntry.jsx"));
const NewGateInward = React.lazy(() => import("./StoreMaster/GateInwardEntry/NewGateInward/NewGateInward.jsx"));
const PendingAsnList = React.lazy(() => import("./StoreMaster/PendingASNList/PendingAsnList.jsx"));
const PDL = React.lazy(() => import("./StoreMaster/PendingASNList/PDL/PDL.jsx"));
const VendorBillList = React.lazy(() => import("./StoreMaster/PendingASNList/VendorBillList/VendorBillList.jsx"));
const VendorASN = React.lazy(() => import("./StoreMaster/PendingASNList/VendorASN/VendorASN.jsx"));
const ASNReport = React.lazy(() => import("./StoreMaster/PendingASNList/ASNReport/ASNReport.jsx"));
const NewMrn = React.lazy(() => import("./StoreMaster/NewMRN/NewMrn.jsx"));
const ToolMrn = React.lazy(() => import("./StoreMaster/NewMRN/ToolMrn/ToolMrn.jsx"));
const PurchaseGrn = React.lazy(() => import("./StoreMaster/PurchseGRN/PurchaseGrn.jsx"));
const GrnList = React.lazy(() => import("./StoreMaster/PurchseGRN/GRNList/GrnList.jsx"));
const InwardChallan1 = React.lazy(() => import("./StoreMaster/SubconGRN/InwardChallan/InwardChallan1.jsx"));
const JobworkInwardChallan = React.lazy(() => import("./StoreMaster/SubconGRN/JobworkInwardChallan/JobworkInwardChallan.jsx"));
const VendorScrapInward = React.lazy(() => import("./StoreMaster/SubconGRN/VendorScrapInward/VendorScrapInward.jsx"));
const SubconGrn = React.lazy(() => import("./StoreMaster/SubconGRN/SubconGrn.jsx"));
const MaterialIssueChallan = React.lazy(() => import("./StoreMaster/MaterialIssueChallan/MaterialIssueChallan.jsx"));
const WorkOrderMaterial = React.lazy(() => import("./StoreMaster/MaterialIssueChallan/WorkOrderMaterial/WorkOrderMaterial.jsx"));
const MaterialIssue = React.lazy(() => import("./StoreMaster/MaterialIssueChallan/MaterialIssue/MaterialIssue.jsx"));
const WorkIssueRepost = React.lazy(() => import("./StoreMaster/MaterialIssueChallan/MaterialIssue/WorkIssueRepost.jsx"));
const MaterialIssueGernal = React.lazy(() => import("./StoreMaster/MaterialIssueGernal/MaterialIssueGernal.jsx"));
const DeliveryChallan = React.lazy(() => import("./StoreMaster/DeliveryChallan/DeliveryChallan.jsx"));
const Dcgrn = React.lazy(() => import("./StoreMaster/DCGRN/Dcgrn.jsx"));
const Dcgrnlist = React.lazy(() => import("./StoreMaster/DCGRN/DcgrnLsit/Dcgrnlist.jsx"));
const StoreNewindent = React.lazy(() => import("./StoreMaster/Newindent/Newindent.jsx"));
const IndentList = React.lazy(() => import("./StoreMaster/Newindent/IndentList/IndentList.jsx"));
const StockTransaction = React.lazy(() => import("./StoreMaster/StockTransaction/StockTransaction.jsx"));
const OpeningStock = React.lazy(() => import('./StoreMaster/StockTransaction/OpeningStock/OpeningStock.jsx'));
const AddWipStock = React.lazy(() => import('./StoreMaster/StockTransaction/OpeningStock/AddWipStock.jsx'));
const OpeningWIPReport = React.lazy(() => import('./StoreMaster/StockTransaction/OpeningStock/OpeningWIPReport.jsx'));
const AddRM_CONStock = React.lazy(() => import('./StoreMaster/StockTransaction/OpeningStock/AddRM_CONStock.jsx'));
const FGMovement = React.lazy(() => import("./StoreMaster/StockTransaction/FGMovement/FGMovement.jsx"));
const AddNewFGMovent = React.lazy(() => import("./StoreMaster/StockTransaction/FGMovement/AddNewFGMovement/AddNewFGMovent.jsx"));
const FGTOFGMovement = React.lazy(() => import("./StoreMaster/StockTransaction/FGMovement/FGTOFGMovement/FGTOFGMovement.jsx"));
const FGToFGStock = React.lazy(() => import("./StoreMaster/StockTransaction/FGMovement/FGTOFGStock/FGToFGStock.jsx"));
const ScrapMovement = React.lazy(() => import("./StoreMaster/StockTransaction/FGMovement/ScrapMovement/ScrapMovement.jsx"));
const RMStockTransaction = React.lazy(() => import("./StoreMaster/StockTransaction/RMStockTransaction/RMStockTransaction.jsx"));
const ScrapToFg = React.lazy(() => import("./StoreMaster/StockTransaction/FGMovement/ScrapMovement/ScrapToFg/ScrapToFg.jsx"));
const RMToTransaction = React.lazy(() => import("./StoreMaster/StockTransaction/RMStockTransaction/RmToRmTransaction/RMToTransaction.jsx"));
const RMTOtherGroup = React.lazy(() => import("./StoreMaster/StockTransaction/RMStockTransaction/RMTOtherGroup/RMTOtherGroup.jsx"));
const ShopFloor = React.lazy(() => import("./StoreMaster/StockTransaction/ShopFloor/ShopFloor.jsx"));
const ShopFloorStock = React.lazy(() => import("./StoreMaster/StockTransaction/ShopFloorStock/ShopFloorStock.jsx"));
const ReportStore = React.lazy(() => import("./StoreMaster/Report/Report.jsx"));
const StockReport = React.lazy(() => import("./StoreMaster/StockReport/StorckReport.jsx"));
const InwardChallanList = React.lazy(() => import("./StoreMaster/SubconGRN/InwardChallanList/InwardChallanList.jsx"));
const JobworkInwardChallanList = React.lazy(() => import("./StoreMaster/SubconGRN/JobworkInwardChallanList/JobworkInwardChallanList.jsx"));

const GEIQuery = React.lazy(() => import("./StoreMaster/GateInwardEntry/Query/GEIQuery.jsx"));
const QueryGate = React.lazy(() => import("./StoreMaster/GateInwardEntry/Query/QueryGate.jsx"));
const InwardChallanQuery = React.lazy(() => import("./StoreMaster/SubconGRN/InwardChallanList/InwardChallanQuery.jsx"));
const QueryInward = React.lazy(() => import("./StoreMaster/SubconGRN/InwardChallanList/QueryInward.jsx"));
const StockTransferQuery = React.lazy(() => import("./StoreMaster/StockTransaction/StockTransferQuery.jsx"));
const QueryStock = React.lazy(() => import("./StoreMaster/StockTransaction/QueryStock.jsx"));
const DCGRNQuery = React.lazy(() => import("./StoreMaster/DCGRN/DcgrnLsit/DCGRNQuery.jsx"));
const QueryDCgrn = React.lazy(() => import("./StoreMaster/DCGRN/DcgrnLsit/QueryDCgrn.jsx"));
const PurchaseGRNQuery = React.lazy(() => import("./StoreMaster/PurchseGRN/GRNList/PurchaseGRNQuery.jsx"));
const QueryPurchase = React.lazy(() => import("./StoreMaster/PurchseGRN/GRNList/QueryPurchase.jsx"));
const ReportQuery = React.lazy(() => import("./StoreMaster/Report/ReportQuery.jsx"));
const QueryRep = React.lazy(() => import("./StoreMaster/Report/QueryRep.jsx"));
const MRNList = React.lazy(() => import("./StoreMaster/Report/MRNList/MRNList.jsx"));
const MRNQuery = React.lazy(() => import("./StoreMaster/Report/MRNList/MRNQuery.jsx"));
const QueryMrn = React.lazy(() => import("./StoreMaster/Report/MRNList/QueryMrn.jsx"));
const Challaninward = React.lazy(() => import("./StoreMaster/Report/Challan/Challaninward.jsx"));
const ChallanQuery = React.lazy(() => import("./StoreMaster/Report/Challan/ChallanQuery.jsx"));
const QueryChall = React.lazy(() => import("./StoreMaster/Report/Challan/QueryChall.jsx"));
const IssueMaterial = React.lazy(() => import("./StoreMaster/Report/Material/IssueMaterial.jsx"));
const MaterialQuery = React.lazy(() => import("./StoreMaster/Report/Material/MaterialQuery.jsx"));
const QueryMtrlIssue = React.lazy(() => import("./StoreMaster/Report/Material/QueryMtrlIssue.jsx"));
const GeneralMtrlIssue = React.lazy(() => import("./StoreMaster/Report/GeneralMtrl/GeneralMtrlIssue.jsx"));
const GeneralQuery = React.lazy(() => import("./StoreMaster/Report/GeneralMtrl/GeneralQuery.jsx"));
const QueryGnrl = React.lazy(() => import("./StoreMaster/Report/GeneralMtrl/QueryGnrl.jsx"));
const DeliveryChlln = React.lazy(() => import("./StoreMaster/Report/DeliveryChallan/DeliveryChlln.jsx"));
const DeliveryQuery = React.lazy(() => import("./StoreMaster/Report/DeliveryChallan/DeliveryQuery.jsx"));
const QueryDlvrchln = React.lazy(() => import("./StoreMaster/Report/DeliveryChallan/QueryDlvrchln.jsx"));
const GRNDCReport = React.lazy(() => import("./StoreMaster/Report/GRNDCReport/GRNDCReport.jsx"));
const DCQuery = React.lazy(() => import("./StoreMaster/Report/GRNDCReport/DCQuery.jsx"));
const QueryDC = React.lazy(() => import("./StoreMaster/Report/GRNDCReport/QueryDC.jsx"));
const IndentReport = React.lazy(() => import("./StoreMaster/Report/IndentReport/IndentReport.jsx"));
const IndentQuery = React.lazy(() => import("./StoreMaster/Report/IndentReport/IndentQuery.jsx"));
const QueryIndt = React.lazy(() => import("./StoreMaster/Report/IndentReport/QueryIndt.jsx"));
const IndentStatus = React.lazy(() => import("./StoreMaster/Report/IndentStatus/IndentStatus.jsx"));
const WIPStock = React.lazy(() => import("./StoreMaster/StockReport/WIPStockReport/WIPStock.jsx"));
const BalanceSheet = React.lazy(() => import("./StoreMaster/StockReport/BalanceSheet/BalanceSheet.jsx"));
const RMStock = React.lazy(() => import("./StoreMaster/StockReport/RMStockReport/RMStock.jsx"));
const ConsumableStock = React.lazy(() => import("./StoreMaster/StockReport/ConsumableStockReport/ConsumableStock.jsx"));
const FGStock = React.lazy(() => import("./StoreMaster/StockReport/FGStockReport/FGStock.jsx"));
const JobworkStockReport = React.lazy(() => import("./StoreMaster/StockReport/JobworkStockReport/JobworkStockReport.jsx"));

const SubcontractStock = React.lazy(() => import("./StoreMaster/SubconGRN/SubcontractStock/SubcontractStock.jsx"));
const OurVendorStock = React.lazy(() => import("./StoreMaster/SubconGRN/SubcontractStock/OurVendorStock.jsx"));

////////////////////////////// Production /////////////////////////////////

const WorkOrderEntry = React.lazy(() => import("./ProductionMaster/WorkOrderEntry/WorkOrderEntry.jsx"));
const WorkOrderList = React.lazy(() => import("./ProductionMaster/WorkOrderList/WorkOrderList.jsx"));
const ProductionEntryAss = React.lazy(() => import("./ProductionMaster/ProductionEntryAss/ProductionEntryAss.jsx"));
const ProductionPlanList = React.lazy(() => import("./ProductionMaster/ProductionPlanList/ProductionPlanList.jsx"));
const ProductionEntry = React.lazy(() => import("./ProductionMaster/ProductionEntry/ProductionEntry.jsx"));
const ProductionReport = React.lazy(() => import("./ProductionMaster/ProductionReport/ProductionReport.jsx"));
const ReworkProduction = React.lazy(() => import("./ProductionMaster/ReworkProduction/ReworkProduction.jsx"));
const ReworkProductionEntry = React.lazy(() => import("./ProductionMaster/ReworkProduction/ReworkProductionEntry/ReworkProductionEntry.jsx"));
const ReworkEntry = React.lazy(() => import("./ProductionMaster/ReworkEntry/ReworkEntry.jsx"));
const ReworkProductionReport = React.lazy(() => import("./ProductionMaster/ReworkProduction/ReworkProductionReport/ReworkProductionReport.jsx"));
const ScrapRejection = React.lazy(() => import("./ProductionMaster/ScrapRejection/ScrapRejection.jsx"));
const ScrapRejectionReport = React.lazy(() => import("./ProductionMaster/ScrapRejection/ScrapRejectionReport/ScrapRejectionReport.jsx"));
const ScrapRejectionEntry = React.lazy(() => import("./ProductionMaster/ScrapRejection/ScrapRejectionEntry/ScrapRejectionEntry.jsx"));
const FGScrapRejectionReport = React.lazy(() => import("./ProductionMaster/ScrapRejection/FGScrapRejectionReport/FGScrapRejectionReport.jsx"));
const MachineIdleTime = React.lazy(() => import("./ProductionMaster/MachineIdleTime/MachineIdleTime.jsx"));
const NewIdleMaster = React.lazy(() => import("./ProductionMaster/MachineIdleTime/NewIdleMaster/NewIdleMaster.jsx"));
const BreakdownTimeEntry = React.lazy(() => import("./ProductionMaster/BreakdownTimeEntry/BreakdownTimeEntry.jsx"));
const BreakdownTimeReport = React.lazy(() => import("./ProductionMaster/BreakdownTimeReport/BreakdownTimeReport.jsx"));
const ContractorReport = React.lazy(() => import("./ProductionMaster/ContractorReport/ContractorReport.jsx"));
const ContractirList = React.lazy(() => import("./ProductionMaster/ContractorReport/ContractorList/ContractirList.jsx"));
const OperatorReport = React.lazy(() => import("./ProductionMaster/Report/OperatorReport/OperatorReport.jsx"));
const ProReport = React.lazy(() => import("./ProductionMaster/Report/ProReport.jsx"));
const JobworkList = React.lazy(() => import("./PurchaseMaster/NewJobworkPurchase/JobworkList/JobworkList.jsx"));
const CycleTime1 = React.lazy(() => import("./ProductionMaster/Report/CycleTime/CycleTime.jsx"));
const BreakdownAnalysis = React.lazy(() => import("./ProductionMaster/Report/BreakdownAnalysis/BreakdownAnalysis.jsx"));
const ReworkReport = React.lazy(() => import("./ProductionMaster/Report/ReworkReport/ReworkReport.jsx"));
const ProductionEntryList = React.lazy(() => import("./ProductionMaster/ProductionEntry/ProductionEntryList/ProductionEntryList.jsx"));
const MachineDefaultidle = React.lazy(() => import("./ProductionMaster/Report/MachineDefaultIdle/MachineDefaultIdle.jsx"));

const MaterialIssueReport = React.lazy(() => import("./ProductionMaster/WorkOrderList/WordOrderReport/MaterialIssueReport.jsx"));
const WorkOrderSummaryReport = React.lazy(() => import("./ProductionMaster/WorkOrderList/WordOrderReport/WorkOrderSummaryReport.jsx"));
const QueryWorkOrder = React.lazy(() => import("./ProductionMaster/WorkOrderList/WorkOrderListQuery/QueryWorkOrder.jsx"));
const QueryMasterWO = React.lazy(() => import("./ProductionMaster/WorkOrderList/WorkOrderListQuery/QueryMasterWO.jsx"));
const PlanListWOStatus = React.lazy(() => import("./ProductionMaster/ProductionPlanList/PlanListWOStatus.jsx"));
const QueryProdPlanList = React.lazy(() => import("./ProductionMaster/ProductionPlanList/PlanListQuery/QueryProdPlanList.jsx"));
const QueryMasterPL = React.lazy(() => import("./ProductionMaster/ProductionPlanList/PlanListQuery/QueryMasterPL.jsx"));
const DailyProductionReport = React.lazy(() => import("./ProductionMaster/ProductionEntry/ProductionEntryList/ProductionReport/DailyProductionReport.jsx"));
const MonthlyProductionReport = React.lazy(() => import("./ProductionMaster/ProductionEntry/ProductionEntryList/ProductionReport/MonthlyProductionReport.jsx"));
const ConsumptionReport = React.lazy(() => import("./ProductionMaster/ProductionEntry/ProductionEntryList/ProductionReport/ConsumptionReport.jsx"));
const ProductionSummaryReport = React.lazy(() => import("./ProductionMaster/ProductionEntry/ProductionEntryList/ProductionReport/ProductionSummaryReport.jsx"));
const ToolConsumptionReport = React.lazy(() => import("./ProductionMaster/ProductionEntry/ProductionEntryList/ProductionReport/ToolConsumptionReport.jsx"));
const QueryProdEL = React.lazy(() => import("./ProductionMaster/ProductionEntry/ProductionEntryList/ProductionQuery/QueryProdEL.jsx"));
const QueryMasterProdEL = React.lazy(() => import("./ProductionMaster/ProductionEntry/ProductionEntryList/ProductionQuery/QueryMasterProdEL.jsx"));
const QueryScrap = React.lazy(() => import("./ProductionMaster/ScrapRejection/ScrapRejectionReport/ScrapRejQuery/QueryScrap.jsx"));
const QueryMasterScrap = React.lazy(() => import("./ProductionMaster/ScrapRejection/ScrapRejectionReport/ScrapRejQuery/QueryMasterScrap.jsx"));
const RejectionReport = React.lazy(() => import("./ProductionMaster/ScrapRejection/ScrapRejectionReport/RejectionReport.jsx"));
// import ItemWiseCR from "./ProductionMaster/ContractorReport/ContractorList/ItemWIseCR.jsx";
const OperationRejectionSummary = React.lazy(() => import("./ProductionMaster/Report/OperationRejectionSummary.jsx"));
const QueryReportPro = React.lazy(() => import("./ProductionMaster/Report/QueryReportPro.jsx"));
const MachineDefaultBook = React.lazy(() => import("./ProductionMaster/Report/MachineDefaultIdle/MachineDefaultBook.jsx"));


/////////////////////////////  Planning  ////////////////////////////////////

const ProductionSchedule = React.lazy(() => import("./Planning/ProductionSchedule/ProductionSchedule.jsx"));
const MinMaxPlanning = React.lazy(() => import("./Planning/MinMaxPlanning/MinMaxPlanning.jsx"));
const DailyDispatchPlan = React.lazy(() => import("./Planning/DailyDispatchPlan/DailyDispatchPlan.jsx"));
const DispatchPlanSetup = React.lazy(() => import("./Planning/DispatchPlanSetup/DispatchPlanSetup.jsx"));
const ManufacturingOrder = React.lazy(() => import("./Planning/ManufacturingOrder/ManufacturingOrder.jsx"));
const BusinessPlan = React.lazy(() => import("./Planning/BusinessPlan/BusinessPlan.jsx"));
const UpcomingDispatchList = React.lazy(() => import("./Planning/UpcomingDispatchList/UpcomingDispatchList.jsx"));
const ScheduleSetup = React.lazy(() => import("./Planning/VendorSchedule/ScheduleSetup.jsx"));
const ScheduleStatusGenerate = React.lazy(() => import("./Planning/VendorSchedule/ScheduleStatusGenerate.jsx"));
const CapacityPlanning = React.lazy(() => import("./Planning/CapacityPlanning/CapacityPlanning.jsx"));
const CostingList = React.lazy(() => import("./Planning/CostingList/CostingList.jsx"));



///////////////////////////////////////// Quality ////////////////////////////////////////////////

const QualityPlan = React.lazy(() => import("./Quality/QualityPlan/QualityPlan.jsx"));
const PandingQCList = React.lazy(() => import("./Quality/Purchase/PandingQCList/PandingQCList.jsx"));
const InwardTestCertificate = React.lazy(() => import("./Quality/Purchase/InwardTestCertificate/InwardTestCertificate.jsx"));
const PaddingQCInward = React.lazy(() => import("./Quality/SubconJobwork/PaddingQCInward/PaddingQCInward.jsx"));
const InwardQCList = React.lazy(() => import("./Quality/SubconJobwork/InwardQCList/InwardQCList.jsx"));
const InprocessInspection = React.lazy(() => import("./Quality/InprocessQC/InprocessInspection/InprocessInspection.jsx"));
const InprocessInspectionList = React.lazy(() => import("./Quality/InprocessQC/InprocessInspectionList/InprocessInspectionList.jsx"));
const PaddingSalesQC = React.lazy(() => import("./Quality/SalesReturnQC/PaddingSalesQC/PaddingSalesQC.jsx"));
const SalesQCList = React.lazy(() => import("./Quality/SalesReturnQC/SalesQCList/SalesQCList.jsx"));
const HeatCodeRegister = React.lazy(() => import("./Quality/HeatCodeRegister/HeatCodeRegister.jsx"));
const TestCertificateList = React.lazy(() => import("./Quality/TestCertificateList/TestCertificateList.jsx"));
const PDIList = React.lazy(() => import("./Quality/PDIList/PDIList.jsx"));
const PenddingInvoiceListPDI = React.lazy(() => import("./Quality/PDIList/PenddingInvoiceListPDI.jsx"));
const NewListPDI = React.lazy(() => import("./Quality/PDIList/NewListPDI.jsx"));
const FirstPieceApporval = React.lazy(() => import("./Quality/FirstPieceApporval/FirstPieceApporval.jsx"));
const SetUpApproval = React.lazy(() => import("./Quality/FirstPieceApporval/SetUpApproval.jsx"));
const NewSetupApproval = React.lazy(() => import("./Quality/NewSetupApproval/NewSetupApproval.jsx"));
const SetupList = React.lazy(() => import("./Quality/NewSetupApproval/SetupList/SetupList.jsx"));
const HotInspectionList = React.lazy(() => import("./Quality/HotInspectionList/HotInspectionList.jsx"));
const NewHotInspection = React.lazy(() => import("./Quality/HotInspectionList/NewHotInspection/NewHotInspection.jsx"));
const SamplingPlan = React.lazy(() => import("./Quality/SamplingPlan/SamplingPlan.jsx"));
const CustomerComplaintEntry = React.lazy(() => import("./Quality/CustomerComplaint/CustomerComplaintEntry/CustomerComplaintEntry.jsx"));
const CustomerComplaintList = React.lazy(() => import("./Quality/CustomerComplaint/CustomerComplaintList/CustomerComplaintList.jsx"));
const CustomerComplaintAuth = React.lazy(() => import("./Quality/CustomerComplaint/CustomerComplaintAuth/CustomerComplaintAuth.jsx"));
const TestReportList = React.lazy(() => import("./Quality/TestMaster/TestReportList/TestReportList.jsx"));
const TestReportNew = React.lazy(() => import("./Quality/TestMaster/TestReportList/TestReportNew.jsx"));
const TestMasterNew = React.lazy(() => import("./Quality/TestMaster/TestMasterNew/TestMasterNew.jsx"));
const TestMasterList = React.lazy(() => import("./Quality/TestMaster/TestMasterList/TestMasterList.jsx"));
const SubconJobworkInwardQC = React.lazy(() => import("./Quality/SubconJobwork/PaddingQCInward/SubconJobworkInwardQC/SubconJobworkInwardQC.jsx"));


const ContractorWorkOrderList = React.lazy(() => import("./ProductionV2/ContractorWorkOrder/ContractorWorkOrderList/ContractorWorkOrderList.jsx"));
const ContractorWorkOrder = React.lazy(() => import("./ProductionV2/ContractorWorkOrder/ContractorWorkOrder.jsx"));
const WorkOrderEntryV2 = React.lazy(() => import("./ProductionV2/WorkOrderEntryV2/WorkOrderEntryV2.jsx"));
const WorkOrderReportV2 = React.lazy(() => import("./ProductionV2/WorkOrderReportV2/WorkOrderReportV2.jsx"));

const PunchingLaserSchedule = React.lazy(() => import("./ProductionV2/PunchingLaserSchedule/PunchingLaserSchedule.jsx"));
const PunchingProgram = React.lazy(() => import("./ProductionV2/PunchingProgram/PunchingProgram.jsx"));
const PunchingLaserScheduleNew = React.lazy(() => import("./ProductionV2/PunchingLaserSchedule/PunchingLaserScheduleNew.jsx"));
const WorkOrderStatusEntry = React.lazy(() => import("./ProductionV2/WorkOrderStatusEntry/WorkOrderStatusEntry.jsx"));

/////////////////////////////////////     Sales       ////////////////////////////////////

const NewProformaInvoice = React.lazy(() => import("./Sales/NewProformaInvoice/NewProformaInvoice.jsx"));
const GSTsales1 = React.lazy(() => import("./Sales/EInvoicing/GSTsales/GSTsales1.jsx"));
const JobWorkSales = React.lazy(() => import("./Sales/EInvoicing/JobWorkSales/JobWorkSales.jsx"));
const DebitNote = React.lazy(() => import("./Sales/EInvoicing/DebitNote/DebitNote.jsx"));
const CreditNote = React.lazy(() => import("./Sales/EInvoicing/CreditNote/CreditNote.jsx"));
const NewSalesOrder = React.lazy(() => import("./Sales/CustomerSalesOrder/NewSalesOrder.jsx"));
const OrderLiast = React.lazy(() => import("./Sales/CustomerSalesOrder/OrderLiast/OrderLiast.jsx"));
const SalesOrderAmendList = React.lazy(() => import("./Sales/CustomerSalesOrderAmendment/SalesOrderAmendList/SalesOrderAmendList.jsx"));
const CustPOAmend = React.lazy(() => import("./Sales/CustomerSalesOrderAmendment/SalesOrderAmendList/SOAmendment/CustPOAmend.jsx"));
const SalesOrderItemAdd = React.lazy(() => import("./Sales/CustomerSalesOrderAmendment/SalesOrderAmendList/SalesOrderItemAdd/SalesOrderItemAdd.jsx"));
const SacheduleSalesNew = React.lazy(() => import("./Sales/SacheduleSalesNew/SacheduleSalesNew.jsx"));
const SalesOrderStatus = React.lazy(() => import("./Sales/SalesOrderStatus/SalesOrderStatus.jsx"));
const NewInvoice = React.lazy(() => import("./Sales/GSTInvoice/NewInvoice.jsx"));
const InvoiceList = React.lazy(() => import("./Sales/GSTInvoice/InvoiceList/InvoiceList.jsx"));
const NewinvoiceGST = React.lazy(() => import("./Sales/GSTInvoice/NewinvoiceGST/NewinvoiceGST.jsx"));
const GSTJobworkInvoice = React.lazy(() => import("./Sales/GSTJobwork/GSTJobworkInvoice/GSTJobworkInvoice.jsx"));
const DChallan = React.lazy(() => import("./Sales/GSTJobwork/DC/DChallan.jsx"));
const GSTJobworkDCreturn = React.lazy(() => import("./Sales/GSTJobwork/GSTJobworkDCreturn/GSTJobworkDCreturn.jsx"));
const OutwardChallan = React.lazy(() => import("./Sales/OutwardChallan/OutwardChallan.jsx"));
const PurchaseDabitNote = React.lazy(() => import("./Sales/CraditDabitNote/PurchaseDabitNote/PurchaseDabitNote.jsx"));
const DabitNoteList = React.lazy(() => import("./Sales/CraditDabitNote/PurchaseDabitNote/DabitNoteList/DabitNoteList.jsx"));
const DN574Fout = React.lazy(() => import("./Sales/CraditDabitNote/PurchaseDabitNote/DN574Fout/DN574Fout.jsx"));
const NewDabitNote = React.lazy(() => import("./Sales/CraditDabitNote/SalesDabitNote/NewDabitNote.jsx"));
const JobWorkRateDiff = React.lazy(() => import("./Sales/CraditDabitNote/JobWorkRateDiffDebitNote/JobWorkRateDiff.jsx"));
const CreditNotie = React.lazy(() => import("./Sales/CraditDabitNote/CreditNotie/CreditNotie.jsx"));
const Creditnoteto = React.lazy(() => import("./Sales/CraditDabitNote/CreditNotie/Creditnoteto/Creditnoteto.jsx"));
const CreditNoteList = React.lazy(() => import("./Accounts/ACRegister/CreditNoteList/CreditNoteList.jsx"));
const GSTSalesReturn = React.lazy(() => import("./Sales/GSTSalesReturn/GSTSalesReturn.jsx"));
const GSTSalesReturnList = React.lazy(() => import("./Accounts/ACRegister/GSTSalesReturnList/GSTSalesReturnList.jsx"));
const SalesCreditNoteList = React.lazy(() => import("./Sales/CraditDabitNote/CreditNotie/CreditNoteList/CreditNoteList.jsx"));
const MaterialGatepassNew = React.lazy(() => import("./Sales/MaterialGatepass/MaterialGatepassNew/MaterialGatepassNew.jsx"));
const PendingMaterialGatepassList = React.lazy(() => import("./Sales/MaterialGatepass/PendingMaterialGatepassList/PendingMaterialGatepassList.jsx"));
const MaterialGatepassList = React.lazy(() => import("./Sales/MaterialGatepass/MaterialGatepassList/MaterialGatepassList.jsx"));
const CustSalesOrderList = React.lazy(() => import("./Sales/Reports/CustSalesOrderList/CustSalesOrderList.jsx"));
const CustomerSalesOrderList = React.lazy(() => import("./Sales/Reports/CustomerSalesOrderList/CustomerSalesOrderList.jsx"));
const TaxInvoiceList = React.lazy(() => import("./Accounts/ACRegister/TaxInvoiceList/TaxInvoiceList.jsx"));
const JobworkInvoiceList = React.lazy(() => import("./Accounts/ACRegister/JobworkInvoiceList/JobworkInvoiceList.jsx"));
const BajajTaxInvoiceList = React.lazy(() => import("./Sales/Reports/BajajTaxInvoiceList/BajajTaxInvoiceList.jsx"));
const JobworkInvList = React.lazy(() => import("./Sales/Reports/JobworkInvList/JobworkInvList.jsx"));
const JobworkDCList = React.lazy(() => import("./Sales/Reports/JobworkDCList/JobworkDCList.jsx"));
const GSTJobworkDCReturnList = React.lazy(() => import("./Sales/Reports/GSTJobworkDCReturnList/GSTJobworkDCReturnList.jsx"));
const OutwardChallanList = React.lazy(() => import("./Sales/Reports/OutwardChallanList/OutwardChallanList.jsx"));
const DebitNoteList = React.lazy(() => import("./Accounts/ACRegister/DebitNoteList/DebitNoteList.jsx"));
const CreditListNote = React.lazy(() => import("./Sales/Reports/CreditNoteList/CreditListNote.jsx"));
const RG1Register = React.lazy(() => import("./Sales/Reports/RG1Register/RG1Register.jsx"));
const TransportList = React.lazy(() => import("./Sales/Reports/TransportList/TransportList.jsx"));
const ProformaInvoiceList = React.lazy(() => import("./Sales/Reports/ProformaInvoiceList/ProformaInvoiceList.jsx"));


const ViewStockList = React.lazy(() => import("./Sales/CustomerSalesOrder/OrderLiast/ViewStockList.jsx"));
const UserSubList = React.lazy(() => import("./Sales/CustomerSalesOrder/OrderLiast/UserSubList.jsx"));

const SalesOrderItemAddTwo = React.lazy(() => import("./Sales/CustomerSalesOrderAmendment/SalesOrderAmendList/SalesOrderItemAdd/SalesOrderItemAddTwo.jsx"));
const QueryDebit = React.lazy(() => import("./Sales/CraditDabitNote/PurchaseDabitNote/DabitNoteList/QueryDebit.jsx"));
const QueryMasterDebit = React.lazy(() => import("./Sales/CraditDabitNote/PurchaseDabitNote/DabitNoteList/QueryMasterDebit.jsx"));
const QueryCreditList = React.lazy(() => import("./Sales/CraditDabitNote/CreditNotie/CreditNoteList/QueryCreditList.jsx"));
const QueryMasterCrebitList = React.lazy(() => import("./Sales/CraditDabitNote/CreditNotie/CreditNoteList/QueryMasterCrebitList.jsx"));
const QueryMasterGSTSales = React.lazy(() => import("./Sales/GSTSalesReturn/QueryGST/QueryMasterGSTSales.jsx"));
const QueryGSTSales = React.lazy(() => import("./Sales/GSTSalesReturn/QueryGST/QueryGSTSales.jsx"));
const QuerySales = React.lazy(() => import("./Sales/Reports/CustSalesOrderList/QuerySalesOrder/QuerySales.jsx"));
const QueryMasterSales = React.lazy(() => import("./Sales/Reports/CustSalesOrderList/QuerySalesOrder/QueryMasterSales.jsx"));
const InvoiceEmailSend = React.lazy(() => import("./Sales/Reports/TaxInvoiceList/QueryTexx/InvoiceEmailSend.jsx"));
const VendarFile = React.lazy(() => import("./Sales/Reports/TaxInvoiceList/QueryTexx/VendarFile.jsx"));
const InvoiceTransporterReport = React.lazy(() => import("./Sales/Reports/TaxInvoiceList/QueryTexx/InvoiceTransporterReport.jsx"));
const SalesPurchaseFile = React.lazy(() => import("./Sales/Reports/TaxInvoiceList/QueryTexx/SalesPurchaseFile.jsx"));
const QuerySalesTax = React.lazy(() => import("./Sales/Reports/TaxInvoiceList/QueryTexx/QuerySalesTax.jsx"));
const QueryMasterSalesTax = React.lazy(() => import("./Sales/Reports/TaxInvoiceList/QueryTexx/QueryMasterSalesTax.jsx"));
const ColumnSetup = React.lazy(() => import("./Sales/Reports/TaxInvoiceList/QueryTexx/ColumnSetup.jsx"));
const VendorFileBajaj = React.lazy(() => import("./Sales/Reports/BajajTaxInvoiceList/VendorFileBajaj.jsx"));
const JobWorkSalesRegister = React.lazy(() => import("./Sales/Reports/JobworkInvList/JobworkInvReport/JobWorkSalesRegister.jsx"));
const QueryJobwork = React.lazy(() => import("./Sales/Reports/JobworkInvList/QueryJobwork/QueryJobwork.jsx"));
const QueryMasterJobwork = React.lazy(() => import("./Sales/Reports/JobworkInvList/QueryJobwork/QueryMasterJobwork.jsx"));
const QueryOutwardClln = React.lazy(() => import("./Sales/Reports/OutwardChallanList/QueryOutward/QueryOutwardClln.jsx"));
const QueryMasterOutwardClln = React.lazy(() => import("./Sales/Reports/OutwardChallanList/QueryOutward/QueryMasterOutwardClln.jsx"));
const NewTransportEntry = React.lazy(() => import("./Sales/Reports/TransportList/Transport/NewTransportEntry.jsx"));
const TransportReport = React.lazy(() => import("./Sales/Reports/TransportList/Transport/TransportReport.jsx"));

/////////////////////////////// Accounts ///////////////////////////////////

const PurchaseBill = React.lazy(() => import("./Accounts/BillPassing/PurchaseBill.jsx"));
const JobworkBill = React.lazy(() => import("./Accounts/BillPassing/JobworkBill.jsx"));
const DirectBill = React.lazy(() => import("./Accounts/BillPassing/DirectBill.jsx"));
const GLMaster = React.lazy(() => import("./Accounts/GLMaster/GLMaster.jsx"));
const ConfirmGSTBill = React.lazy(() => import("./Accounts/BillPassing/ConfirmGSTBill.jsx"));
const GSTR1 = React.lazy(() => import("./Accounts/GSTReport/GSTR1.jsx"));
const HSNSACSummary = React.lazy(() => import("./Accounts/GSTReport/HSNSACSummary.jsx"));
const GSTR2 = React.lazy(() => import("./Accounts/GSTReport/GSTR2.jsx"));
const GSTR3B = React.lazy(() => import("./Accounts/GSTReport/GSTR3B.jsx"));
const GSTITC04 = React.lazy(() => import("./Accounts/GSTReport/GSTITC04.jsx"));
const PurchaseRegister = React.lazy(() => import("./Accounts/PurchaseRegister/PurchaseRegister.jsx"));
const TDSRegister = React.lazy(() => import("./Accounts/TDSRegister/TDSRegister.jsx"));
const TCSRegister = React.lazy(() => import("./Accounts/TCSRegister/TCSRegister.jsx"));
const GLLedger = React.lazy(() => import("./Accounts/GLLedger/GLLedger.jsx"));
const ACPurchaseRegister = React.lazy(() => import("./Accounts/ACRegister/ACPurchaseRegister.jsx"));

/////////////////////////////// Maintenance ////////////////////////////////

const AssetList = React.lazy(() => import("./Maintenance/AssetList/AssetList.jsx"));
const ItemAssetMaster = React.lazy(() => import("./Maintenance/ItemAssetMaster/ItemAssetMaster.jsx"));
const BreakdownList = React.lazy(() => import("./Maintenance/MachineBreakdown/BreakdownList.jsx"));
const BreakdownAuthorisation = React.lazy(() => import("./Maintenance/MachineBreakdown/BreakdownAuthorisation.jsx"));
const BreakdownReport = React.lazy(() => import("./Maintenance/MachineBreakdown/BreakdownReport.jsx"));
const BreakdownSlip = React.lazy(() => import("./Maintenance/MachineBreakdown/BreakdownSlip.jsx"));
const RepairEntry = React.lazy(() => import("./Maintenance/MachineBreakdown/RepairEntry.jsx"));
const RepairList = React.lazy(() => import("./Maintenance/MachineBreakdown/RepairList.jsx"));
const MachinePreventiveEntry = React.lazy(() => import("./Maintenance/MachinePreventive/MachinePreventiveEntry.jsx"));
const MachinePreventiveReport = React.lazy(() => import("./Maintenance/MachinePreventive/MachinePreventiveReport.jsx"));
const MachinePreventiveSchedule = React.lazy(() => import("./Maintenance/MachinePreventive/MachinePreventiveSchedule.jsx"));
const MachinePreventiveSetUp = React.lazy(() => import("./Maintenance/MachinePreventive/MachinePreventiveSetUp.jsx"));
const ToolManagement = React.lazy(() => import("./Maintenance/ToolManagement/ToolManagement.jsx"));


/////////////////////////////////////////////////////////////////////////////////////////////////////////////

function App() {
  return (
    <div className="App">
      <React.Suspense fallback={<FullScreenLoader />}>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<Login />} />
        <Route path="/mainpage" element={<VendorPage />} />
        <Route path="/dashboard" element={<Dashboard />} />


        {/* /////////////////////////////////// Master ////////////////////////////////////// */}

        <Route path="/masterState" element={<MasterState />} />
        <Route path="/masterCustomer" element={<MasterCustomers />} />
        <Route path="/CustomerState" element={<CustomerState />} />
        <Route path="/item-master" element={<ItemMaster />} />
        <Route path="/add-new-item" element={<AddNewItem />} />
        <Route path="/item-master-gernal" element={<ItemMasterGernal />} />
        <Route
          path="/item-master-gernal/:id"
          element={<ItemMasterGernal />}
        />
        {/* <Route path="/item-master-query" element={<ItemMasterQuery />} />  */}
        <Route path="/Work-center-master" element={<WorkCenterMaster />} />
        <Route path="/business-partner" element={<BusinessPartner />} />
        <Route path="/Customer-Item-Wise" element={<CustomerItemWise />} />
        <Route path="/Customer-Supplier-Item-Link" element={<CustomerSupplierLink />} />
        <Route path="/Item-Cross-Reference" element={<ItemCrossReference />} />
        <Route path="/gst-rate-master" element={<GstMaster />} />
        <Route path="/Customer-Item-Wise-Gst" element={<CustomerItemGst />} />
        <Route path="/task-master" element={<TaskMaster />} />
        <Route path="/Cut-wise" element={<Cutwise />} />
        <Route path="/Supplier-Customer-Master" element={<SupplierCustomerMaster />} />
        <Route
          path="/Supplier-Customer-Master/:id"
          element={<SupplierCustomerMaster />}
        />
        <Route path="/vender-list" element={<VenderListSupplier />} />
        <Route path="/bom-routing" element={<BomRouting />} />
        <Route path="/bill-material" element={<BillMaterial />} />
        <Route path="/operator-supervisor-master" element={<OperatorSupervisor />} />
        <Route path="/Supervisor" element={<Supervisor />} />
        <Route path="/Department-Head" element={<DepartmentHead />} />
        <Route path="/contractor-master" element={<ContractorMaster />} />
        <Route path="/Addcontractor-master" element={<AddContractorMAster />} />
        <Route path="/shift-master" element={<ShiftMaster />} />
        <Route path="/unit-conversion" element={<UnitConversion />} />
        <Route path="/price-list-master" element={<PriceListMaster />} />
        <Route path="/price-entry-master" element={<PriceEntry />} />
        <Route path="/cycle-time-master" element={<CycleTime />} />
        <Route path="/add-cycle-time" element={<AddCycleTime />} />
        <Route path="/commodity-master" element={<CommodityMaster />} />
        <Route path="/cost-center-master" element={<CostCenterMaster />} />
        <Route path="/work-center-schedule" element={<WorkCenterSchedule />} />
        <Route path="/project-management" element={<ProjectManagement />} />
        <Route path="/project-inventory-status" element={<ProjectInventory />} />
        <Route path="/document-management" element={<DocumentManagement />} />
        <Route path="/master-report" element={<MasterReport />} />

        <Route path="/item-master-query" element={<ItemMasterQuery />} />
        <Route path="/QueryPages" element={<QueryPages />} />
        <Route path="/CustomerQuery" element={<CustomerQuery />} />
        <Route path="/BOMQuery" element={<BOMQuery />} />
        <Route path="/PriceListQuery" element={<PriceListQuery />} />
        <Route path="/PriceListQueryMaster" element={<PriceListQueryMaster />} />
        <Route path="/CustomerQueryMaster" element={<CustomerQueryMaster />} />
        <Route path="/BOMMasterQuery" element={<BOMMasterQuery />} />
        <Route path="/UploadWIPvalue" element={<UploadWIPvalue />} />
        <Route path="/UploadOperationSpeci" element={<UploadOperationSpeci />} />


        {/* ///////////////////////////////////Erp Setting////////////////////////////////////// */}

        <Route path="UserConfiguration" element={<UserConfiguration />} />
        <Route path="/" element={<Navigate replace to="/UserConfiguration" />} />
        <Route path="ErpSetting" element={<ErpSetting />} />
        <Route path="DisableUserList" element={<DisableUserList />} />
        <Route path="UserPermission" element={<UserPermission />} />
        <Route path="/User-Permit" element={<UserPermit />} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route path="login-history" element={<LoginHistory />} />
        <Route path="delete-management" element={<DeleteMangement />} />
        <Route path="dashboard-backup" element={<DashboardBackup />} />
        <Route path="delete-record" element={<DeleteRecord />} />
        <Route path="/order-list" element={<OrderList />} />
        <Route path="/view-stack" element={<ViewStock />} />
        <Route path="/user-List" element={<USerList />} />
        <Route path="/Item-delete" element={<ItemDelete />} />
        <Route path="/delete-report" element={<DeleteReport />} />
        <Route path="/DashboardPermission" element={<DashboardPermission />} />
        <Route path="/BackDated" element={<BackDated />} />
        <Route path="/User-Wise-Series" element={<UserWiseSeries />} />
        <Route path="/UserwiseProduction" element={<UserwiseProduction />} />
        <Route path="/USerwiseAuth" element={<USerwiseAuth />} />
        <Route path="/User-plant" element={<Userplant />} />
        <Route path="/Plantwiseseries" element={<Plantwiseseries />} />
        <Route path="/AlertSetting" element={<AlertSetting />} />
        <Route path="/Userwisepermission" element={<Userwisepermission />} />
        <Route path="/Companysetup" element={<Companysetup />} />
        <Route path="/WebconfigFile" element={<ErpWebConfig />} />{" "}
        <Route path="/ErpFinancialYear" element={<ErpFinancialYear />} />{" "}
        <Route path="/FinancialMonth" element={<FinancialMonth />} />{" "}
        <Route path="/ScheduleMonth" element={<ScheduleMonth />} />{" "}
        <Route path="/Weekoff" element={<Weekoff />} />{" "}
        <Route path="/Settingerp" element={<Settingerp />} />{" "}
        <Route path="/Docseriesgroup" element={<Docseriesgroup />} />{" "}
        <Route path="/DocprintFormat" element={<DocprintFormat />} />{" "}
        <Route path="/Docnoeditable" element={<Docnoeditable />} />{" "}
        <Route path="/Qcisoformat" element={<Qcisoformat />} />{" "}
        <Route path="/Roundofsetting" element={<Roundofsetting />} />{" "}
        <Route path="/Customersupplier" element={<Customersupplier />} />{" "}
        <Route path="/Itemmastersetup" element={<Itemmastersetup />} />{" "}
        <Route path="/Emailsms" element={<Emailsms />} />{" "}
        <Route path="/Emailsetup" element={<Emailsetup />} />
        <Route path="/AddQuater" element={<AddQuater />} />
        <Route path="/WeekMaster" element={<WeekMaster />} />
        <Route path="/MasterData" element={<MasterData />} />
        <Route path="/PurchaseErp" element={<PurchaseErp />} />
        <Route path="/PurchaseERPGRN" element={<PurchaseERPGRN />} />
        <Route path="/OutwardInward" element={<OutwardInward />} />
        <Route path="/Companysetup" element={<Companysetup />} />
        <Route path="/WebconfigFile" element={<ErpWebConfig />} />{" "}
        <Route path="/ErpFinancialYear" element={<ErpFinancialYear />} />{" "}
        <Route path="/Document-start" element={<DocumentStart />} />{" "}
        <Route path="/FinancialMonth" element={<FinancialMonth />} />{" "}
        <Route path="/ScheduleMonth" element={<ScheduleMonth />} />{" "}
        <Route path="/Weekoff" element={<Weekoff />} />{" "}
        <Route path="/Settingerp" element={<Settingerp />} />{" "}
        <Route path="/Docseriesgroup" element={<Docseriesgroup />} />{" "}
        <Route path="/DocprintFormat" element={<DocprintFormat />} />{" "}
        <Route path="/Docnoeditable" element={<Docnoeditable />} />{" "}
        <Route path="/Qcisoformat" element={<Qcisoformat />} />{" "}
        <Route path="/Roundofsetting" element={<Roundofsetting />} />{" "}
        <Route path="/Customersupplier" element={<Customersupplier />} />{" "}
        <Route path="/Itemmastersetup" element={<Itemmastersetup />} />{" "}
        <Route path="/Emailsms" element={<Emailsms />} />{" "}
        <Route path="/Emailsetup" element={<Emailsetup />} />
        <Route path="/Emailtemplate" element={<Emailtemplate />} />
        <Route path="/Quotation" element={<Quotation />} />
        <Route path="/DebitcreditNote" element={<DebitcreditNote />} />
        <Route path="/DocAccount" element={<DocAccount />} />
        <Route path="/Docddelivery" element={<Docddelivery />} />
        <Route path="/DocProduction" element={<DocProduction />} />
        <Route path="/GSTsales" element={<GSTsales />} />
        <Route path="/GstsalesReturn" element={<GstsalesReturn />} />
        <Route path="/DocCompanySetting" element={<DocCompanySetting />} />
        <Route path="/ViewItemMaster" element={<ViewItemMaster />} />

        <Route path="/SettingHistory" element={<SettingHistory />} />
        <Route path="/DefaultSettingsModal" element={<DefaultSettingsModal />} />


        {/* ////////////////////////////////Purchase///////////////////////////// */}

        <Route path="/new-indent" element={<Newindent />} />
        <Route path="/new-purchase-order" element={<NewPurchaseOrder />} />
        <Route
          path="/new-purchase-order/:id"
          element={<NewPurchaseOrder />}
        />
        <Route path="/new-jobwork-order" element={<NewJobworkPurchase />} />
        <Route
          path="/new-jobwork-order/:id"
          element={<NewJobworkPurchase />}
        />
        <Route path="/pendingpo" element={<PendingPo />} />
        <Route path="/pending-jobwork-po-release" element={<PendingJobworkPORelease />} />
        <Route path="/pendingindent" element={<PendingIndent />} />
        <Route path="/Purchse-Mrn" element={<PurchaseMrn />} />
        <Route path="/Purchse-order-status" element={<PurchseOrderStatus />} />
        <Route path="/Rfo" element={<Rfo />} />
        <Route path="/Rfo" element={<Rfo />} />
        <Route path="/Quoto-Comparison-Statement" element={<QuotoComparisonStatement />} />
        <Route path="/Quoto-Comparison-Pending" element={<QuotoComparisonPending />} />
        {/* <Route path="purchase-order-list" element={<PurchseOderList />} /> */}
        <Route path="purchase-order-list" element={<PoList />} />
        {/* <Route path="jobwork-purchase-order-list" element={<JobWorkPurchseOrderList />} /> */}
        <Route path="jobwork-purchase-order-list" element={<JobworkList />} />
        <Route path="/RecenlyApproveJobworkList" element={<RecenlyApproveJobworkList />} />
        <Route path="supplier-wise-list" element={<SupplierWiseList />} />
        <Route path="purchase-report" element={<PurchaseReport />} />
        <Route path="/EditPo/:id" element={<POEdit />} />
        <Route path="/POpdf/:id" element={<PurchaseOrderPDF />} />

        <Route path="/ListIndent" element={<ListIndent />} />
        <Route path="/IndentStutasReport" element={<IndentStutasReport />} />
        <Route path="/RecentlyPoApprovalList" element={<RecentlyPoApprovalList />} />
        <Route path="/AMCPurchaseOrderList" element={<AMCPurchaseOrderList />} />
        <Route path="/PurchaseQuerySummary" element={<PurchaseQuerySummary />} />
        <Route path="/PurchaseQuery" element={<PurchaseQuery />} />
        <Route path="/RFONew" element={<RFONew />} />
        <Route path="/QuoteStatementList" element={<QuoteStatementList />} />
        <Route path="/JobworkPOSummary" element={<JobworkPOSummary />} />
        <Route path="/JobworkQuery" element={<JobworkQuery />} />

        <Route path="/Importfile" element={<Importfile />} />
        <Route path="/ImportPO" element={<ImportPO />} />
        <Route path="/ImportPOList" element={<ImportPOList />} />
        <Route path="/POConsignment" element={<POConsignment />} />
        <Route path="/POConsignmentList" element={<POConsignmentList />} />
        <Route path="/ImportGRN" element={<ImportGRN />} />
        <Route path="/ImportGRNList" element={<ImportGRNList />} />




        {/* ///////////////////////////////////////Store//////////////////////////////////////// */}

        <Route path="Gate-Inward-Entry" element={<GateInwardEntry />} />
        <Route path="New-Gate-Entry" element={<NewGateInward />} />
        <Route
          path="/New-Gate-Entry/:id"
          element={<NewGateInward />}
        />
        <Route path="Pending-Asn-List" element={<PendingAsnList />} />
        <Route path="PDL-List" element={<PDL />} />
        <Route path="Vendor-Bill-List" element={<VendorBillList />} />
        <Route path="Vendor-Asn-List" element={<VendorASN />} />
        <Route path="ASN-Report" element={<ASNReport />} />
        <Route path="New-Mrn" element={<NewMrn />} />
        <Route path="Tool-MRN" element={<ToolMrn />} />
        <Route path="Purchase-Grn" element={<PurchaseGrn />} />
        <Route
          path="/Purchase-Grn/:id"
          element={<PurchaseGrn />}
        />

        <Route path="Grn-List" element={<GrnList />} />
        <Route path="Inward-challan" element={<InwardChallan1 />} />
        <Route path="Jobwork-Inward-Challan" element={<JobworkInwardChallan />} />
        <Route path="Vendor-Scrap-Inward" element={<VendorScrapInward />} />
        <Route path="Subcon-Grn" element={<SubconGrn />} />
        <Route path="Material-Issue-Challan" element={<MaterialIssueChallan />} />
        <Route path="Work-Order-Material" element={<WorkOrderMaterial />} />
        <Route path="Material-Issue" element={<MaterialIssue />} />
        <Route path="Work-Issue-Report" element={<WorkIssueRepost />} />
        <Route path="Material-Issue-Gernal" element={<MaterialIssueGernal />} />
        <Route path="Delivery-Challan" element={<DeliveryChallan />} />
        <Route path="Dcgrn" element={<Dcgrn />} />
        <Route path="Dcgrnlist" element={<Dcgrnlist />} />
        <Route path="Store-New-indent" element={<StoreNewindent />} />
        <Route path="IndentList" element={<IndentList />} />
        <Route path="Stock-Transaction" element={<StockTransaction />} />
        <Route path="Opening-Stock" element={<OpeningStock />} />
        <Route path="/AddWipStock" element={<AddWipStock />} />
        <Route path="/AddRM_CONStock" element={<AddRM_CONStock />} />
        <Route path="/OpeningWIPReport" element={<OpeningWIPReport />} />
        <Route path="RM-Stock-Transaction" element={<RMStockTransaction />} />
        <Route path="FG-Movement" element={<FGMovement />} />
        <Route path="AddNewFGMovent" element={<AddNewFGMovent />} />
        <Route path="FGToFGStock" element={<FGToFGStock />} />
        <Route path="FGTOFGMovement" element={<FGTOFGMovement />} />
        <Route path="ScrapMovement" element={<ScrapMovement />} />
        <Route path="ScrapToFg" element={<ScrapToFg />} />
        <Route path="RMToTransaction" element={<RMToTransaction />} />
        <Route path="RMTOtherGroup" element={<RMTOtherGroup />} />
        <Route path="ShopFloor" element={<ShopFloor />} />
        <Route path="ShopFloorStock" element={<ShopFloorStock />} />
        {/* <Route path="Report-Store" element={<ReportStore />} /> */}
        <Route path="Stock-Report" element={<StockReport />} />
        {/* Inward Challan List */}
        <Route path="Inward-challan-list" element={<InwardChallanList />} />
        <Route path="Jobwork-Inward-Challan-List" element={<JobworkInwardChallanList />} />

        <Route path="GEIQuery" element={<GEIQuery />} />
        <Route path="QueryGate" element={<QueryGate />} />
        <Route path="InwardChallanQuery" element={<InwardChallanQuery />} />
        <Route path="QueryInward" element={<QueryInward />} />
        <Route path="StockTransferQuery" element={<StockTransferQuery />} />
        <Route path="QueryStock" element={<QueryStock />} />
        <Route path="DCGRNQuery" element={<DCGRNQuery />} />
        <Route path="QueryDCgrn" element={<QueryDCgrn />} />
        <Route path="PurchaseGRNQuery" element={<PurchaseGRNQuery />} />
        <Route path="QueryPurchase" element={<QueryPurchase />} />

        <Route path="ReportQuery" element={<ReportQuery />} />
        <Route path="QueryRep" element={<QueryRep />} />
        <Route path="MRNList" element={<MRNList />} />
        <Route path="MRNQuery" element={<MRNQuery />} />
        <Route path="QueryMrn" element={<QueryMrn />} />
        <Route path="Challaninward" element={<Challaninward />} />
        <Route path="ChallanQuery" element={<ChallanQuery />} />
        <Route path="QueryChall" element={<QueryChall />} />
        <Route path="IssueMaterial" element={<IssueMaterial />} />
        <Route path="MaterialQuery" element={<MaterialQuery />} />
        <Route path="QueryMtrlIssue" element={<QueryMtrlIssue />} />
        <Route path="GeneralMtrlIssue" element={<GeneralMtrlIssue />} />
        <Route path="GeneralQuery" element={<GeneralQuery />} />
        <Route path="QueryGnrl" element={<QueryGnrl />} />
        <Route path="DeliveryChlln" element={<DeliveryChlln />} />
        <Route path="DeliveryQuery" element={<DeliveryQuery />} />
        <Route path="QueryDlvrchln" element={<QueryDlvrchln />} />
        <Route path="GRNDCReport" element={<GRNDCReport />} />
        <Route path="DCQuery" element={<DCQuery />} />
        <Route path="QueryDC" element={<QueryDC />} />
        <Route path="IndentReport" element={<IndentReport />} />
        <Route path="IndentQuery" element={<IndentQuery />} />
        <Route path="QueryIndt" element={<QueryIndt />} />
        <Route path="IndentStatus" element={<IndentStatus />} />
        <Route path="WIPStock" element={<WIPStock />} />
        <Route path="BalanceSheet" element={<BalanceSheet />} />
        <Route path="RMStock" element={<RMStock />} />
        <Route path="JobworkStockReport" element={<JobworkStockReport />} />
        <Route path="ConsumableStock" element={<ConsumableStock />} />
        <Route path="FGStock" element={<FGStock />} />

        <Route path="SubcontractStock" element={<SubcontractStock />} />
        <Route path="OurVendorStock" element={<OurVendorStock />} />




        {/* /////////////////////////////////////Production////////////////////////////////////// */}

        <Route path="/WorkOrderEntry" element={<WorkOrderEntry />} />
        <Route path="/WorkOrderList" element={<WorkOrderList />} />
        <Route path="/ProductionEntry" element={<ProductionEntry />} />
        <Route path="/ProductionEntryAss" element={<ProductionEntryAss />} />
        <Route path="/ProductionPlanList" element={<ProductionPlanList />} />
        <Route path="/ProductionReport" element={<ProductionReport />} />
        <Route path="/MachineIdleTime" element={<MachineIdleTime />} />
        <Route path="/NewIdleMaster" element={<NewIdleMaster />} />
        <Route path="/ReworkProduction" element={<ReworkProduction />} />
        <Route path="/ReworkProductionEntry" element={<ReworkProductionEntry />} />
        <Route path="/ReworkEntry" element={<ReworkEntry />} />
        <Route path="/ReworkProductionReport" element={<ReworkProductionReport />} />
        <Route path="/ScrapRejection" element={<ScrapRejection />} />
        <Route path="/ScrapRejectionReport" element={<ScrapRejectionReport />} />
        <Route path="/ScrapRejectionEntry" element={<ScrapRejectionEntry />} />
        <Route path="/FGScrapRejectionReport" element={<FGScrapRejectionReport />} />
        <Route path="/PoList" element={<PoList />} />

        <Route path="/JobworkList" element={<JobworkList />} />
        <Route path="/BreakdownTimeEntry" element={<BreakdownTimeEntry />} />
        <Route path="/BreakdownTimeReport" element={<BreakdownTimeReport />} />
        <Route path="/WorkOrderReportV2" element={<WorkOrderReportV2 />} />
        <Route path="/WorkOrderEntryV2" element={<WorkOrderEntryV2 />} />
        <Route path="/WorkOrderStatusEntry" element={<WorkOrderStatusEntry />} />
        <Route path="/PunchingLaserSchedule" element={<PunchingLaserSchedule />} />
        <Route path="/PunchingLaserScheduleNew" element={<PunchingLaserScheduleNew />} />
        <Route path="/PunchingProgram" element={<PunchingProgram />} />
        <Route path="/ContractorWorkOrder" element={<ContractorWorkOrder />} />
        <Route path="/ContractorWorkOrderList" element={<ContractorWorkOrderList />} />
        <Route path="/ContractorReport" element={<ContractorReport />} />
        <Route path="/ContractirList" element={<ContractirList />} />
        <Route path="/ProReport" element={<ProReport />} />
        <Route path="/OperatorReport" element={<OperatorReport />} />
        <Route path="/CycleTime1" element={<CycleTime1 />} />
        <Route path="/ReworkReport" element={<ReworkReport />} />
        <Route path="/BreakdownAnalysis" element={<BreakdownAnalysis />} />
        <Route path="/MachineDefaultidle" element={<MachineDefaultidle />} />
        <Route path="/ProductionEntryList" element={<ProductionEntryList />} />

        <Route path="/MaterialIssueReport" element={<MaterialIssueReport />} />
        <Route path="/WorkOrderSummaryReport" element={<WorkOrderSummaryReport />} />
        <Route path="/QueryWorkOrder" element={<QueryWorkOrder />} />
        <Route path="/QueryMasterWO" element={<QueryMasterWO />} />
        <Route path="/PlanListWOStatus" element={<PlanListWOStatus />} />
        <Route path="/QueryProdPlanList" element={<QueryProdPlanList />} />
        <Route path="/QueryMasterPL" element={<QueryMasterPL />} />
        <Route path="/DailyProductionReport" element={<DailyProductionReport />} />
        <Route path="/MonthlyProductionReport" element={<MonthlyProductionReport />} />
        <Route path="/ConsumptionReport" element={<ConsumptionReport />} />
        <Route path="/ProductionSummaryReport" element={<ProductionSummaryReport />} />
        <Route path="/ToolConsumptionReport" element={<ToolConsumptionReport />} />
        <Route path="/QueryProdEL" element={<QueryProdEL />} />
        <Route path="/QueryMasterProdEL" element={<QueryMasterProdEL />} />
        <Route path="/QueryScrap" element={<QueryScrap />} />
        <Route path="/QueryMasterScrap" element={<QueryMasterScrap />} />
        {console.log("RejectionReport type:", typeof RejectionReport, RejectionReport)}
        <Route path="/RejectionReport" element={RejectionReport ? <RejectionReport /> : <div>RejectionReport missing</div>} />
        {/* <Route path="/ItemWiseCR" element={<ItemWiseCR />} /> */}
        <Route path="/OperationRejectionSummary" element={<OperationRejectionSummary />} />
        <Route path="/QueryReportPro" element={<QueryReportPro />} />
        <Route path="/MachineDefaultBook" element={<MachineDefaultBook />} />





        {/* ////////////////////////////////// Planning //////////////////////////////////////////// */}

        <Route path="/ProductionSchedule" element={<ProductionSchedule />} />
        <Route path="/ManufacturingOrder" element={<ManufacturingOrder />} />
        <Route path="/MinMaxPlanning" element={<MinMaxPlanning />} />
        <Route path="/DailyDispatchPlan" element={<DailyDispatchPlan />} />
        <Route path="/DispatchPlanSetup" element={<DispatchPlanSetup />} />
        <Route path="/BusinessPlan" element={<BusinessPlan />} />
        <Route path="/UpcomingDispatchList" element={<UpcomingDispatchList />} />
        <Route path="/CapacityPlanning" element={<CapacityPlanning />} />
        <Route path="/ScheduleSetup" element={<ScheduleSetup />} />
        <Route path="/ScheduleStatusGenerate" element={<ScheduleStatusGenerate />} />
        <Route path="/Costing" element={<CostingList />} />



        {/* //////////////////////////////////  Quality Plan ///////////////////////////////////// */}

        <Route path="QualityPlan" element={<QualityPlan />} />
        <Route path="PandingQCList" element={<PandingQCList />} />
        <Route path="InwardTestCertificate" element={<InwardTestCertificate />} />
        <Route path="PaddingQCInward" element={<PaddingQCInward />} />
        <Route path="InwardQCList" element={<InwardQCList />} />
        <Route path="InprocessInspection" element={<InprocessInspection />} />
        <Route path="/InprocessInspectionDetails" element={<InprocessInspectionDetails />} />
        <Route path="InprocessInspectionList" element={<InprocessInspectionList />} />
        <Route path="PaddingSalesQC" element={<PaddingSalesQC />} />
        <Route path="RejectionMaterialQC" element={<RejectionMaterialQC />} />
        <Route path="SalesQCList" element={<SalesQCList />} />
        <Route path="HeatCodeRegister" element={<HeatCodeRegister />} />
        <Route path="TestCertificateList" element={<TestCertificateList />} />
        <Route path="PDIList" element={<PDIList />} />
        <Route path="PenddingInvoiceListPDI" element={<PenddingInvoiceListPDI />} />
        <Route path="NewListPDI" element={<NewListPDI />} />
        <Route path="FirstPieceApporval" element={<FirstPieceApporval />} />
        <Route path="SetUpApproval" element={<SetUpApproval />} />
        <Route path="NewSetupApproval" element={<NewSetupApproval />} />
        <Route path="SetupList" element={<SetupList />} />
        <Route path="HotInspectionList" element={<HotInspectionList />} />
        <Route path="NewHotInspection" element={<NewHotInspection />} />
        <Route path="SamplingPlan" element={<SamplingPlan />} />
        <Route path="CustomerComplaintEntry" element={<CustomerComplaintEntry />} />
        <Route path="CustomerComplaintList" element={<CustomerComplaintList />} />
        <Route path="CustomerComplaintAuth" element={<CustomerComplaintAuth />} />
        <Route path="TestReportList" element={<TestReportList />} />
        <Route path="TestReportNew" element={<TestReportNew />} />
        <Route path="TestMasterNew" element={<TestMasterNew />} />
        <Route path="TestMasterList" element={<TestMasterList />} />
        <Route path="SubconJobworkInwardQC" element={<SubconJobworkInwardQC />} />


        {/* //////////////////////////////     Sales       /////////////////////////// */}

        <Route path="NewProformaInvoice" element={<NewProformaInvoice />} />
        <Route path="GSTsales1" element={<GSTsales1 />} />
        <Route path="JobWorkSales" element={<JobWorkSales />} />
        <Route path="DebitNote" element={<DebitNote />} />
        <Route path="CreditNote" element={<CreditNote />} />
        <Route path="NewSalesOrder" element={<NewSalesOrder />} />
        <Route path="OrderLiast" element={<OrderLiast />} />
        <Route path="SalesOrderAmendList" element={<SalesOrderAmendList />} />
        <Route path="CustPOAmend" element={<CustPOAmend />} />
        <Route path="SalesOrderItemAdd" element={<SalesOrderItemAdd />} />
        <Route path="SacheduleSalesNew" element={<SacheduleSalesNew />} />
        <Route path="SalesOrderStatus" element={<SalesOrderStatus />} />
        <Route path="NewInvoice" element={<NewInvoice />} />
        <Route path="InvoiceList" element={<InvoiceList />} />
        <Route path="NewinvoiceGST" element={<NewinvoiceGST />} />
        <Route path="GSTJobworkInvoice" element={<GSTJobworkInvoice />} />
        <Route path="DChallan" element={<DChallan />} />
        <Route path="GSTJobworkDCreturn" element={<GSTJobworkDCreturn />} />
        <Route path="OutwardChallan" element={<OutwardChallan />} />
        <Route path="PurchaseDabitNote" element={<PurchaseDabitNote />} />
        <Route path="DabitNoteList" element={<DabitNoteList />} />
        <Route path="NewDabitNote" element={<NewDabitNote />} />
        <Route path="DN574Fout" element={<DN574Fout />} />
        <Route path="/NewDabitNote" element={<NewDabitNote />} />
        <Route path="/JobWorkRateDiff" element={<JobWorkRateDiff />} />
        <Route path="/CreditNotie" element={<CreditNotie />} />
        <Route path="/Creditnoteto" element={<Creditnoteto />} />
        <Route path="/CreditNoteList" element={<SalesCreditNoteList />} />
        <Route path="GSTSalesReturn1" element={<GSTSalesReturn />} />
        <Route path="/gst-sales-return-list" element={<GSTSalesReturnList />} />
        <Route path="/GSTSalesReturnList" element={<GSTSalesReturnList />} /> {/* Alias */}
        <Route path="MaterialGatepassNew" element={<MaterialGatepassNew />} />
        <Route path="PendingMaterialGatepassList" element={<PendingMaterialGatepassList />} />
        <Route path="MaterialGatepassList" element={<MaterialGatepassList />} />
        <Route path="CustSalesOrderList" element={<CustSalesOrderList />} />
        <Route path="CustomerSalesOrderList" element={<CustomerSalesOrderList />} />
        <Route path="/tax-invoice-list" element={<TaxInvoiceList />} />
        <Route path="/TaxInvoiceList" element={<TaxInvoiceList />} /> {/* Alias for backward compatibility */}
        <Route path="/ProformaInvoiceList" element={<ProformaInvoiceList />} />
        <Route path="/jobwork-invoice-list" element={<JobworkInvoiceList />} />
        <Route path="BajajTaxInvoiceList" element={<BajajTaxInvoiceList />} />
        <Route path="JobworkInvList" element={<JobworkInvList />} />
        <Route path="JobworkDCList" element={<JobworkDCList />} />
        <Route path="GSTJobworkDCReturnList" element={<GSTJobworkDCReturnList />} />
        <Route path="OutwardChallanList" element={<OutwardChallanList />} />
        <Route path="/debit-note-list" element={<DebitNoteList />} />
        <Route path="/credit-note-list" element={<CreditNoteList />} />
        <Route path="RG1Register" element={<RG1Register />} />
        <Route path="TransportList" element={<TransportList />} />

        <Route path="ViewStockList" element={<ViewStockList />} />
        <Route path="UserSubList" element={<UserSubList />} />

        <Route path="SalesOrderItemAddTwo" element={<SalesOrderItemAddTwo />} />
        <Route path="QueryDebit" element={<QueryDebit />} />
        <Route path="QueryMasterDebit" element={<QueryMasterDebit />} />
        <Route path="QueryCreditList" element={<QueryCreditList />} />
        <Route path="QueryMasterCrebitList" element={<QueryMasterCrebitList />} />
        <Route path="QueryGSTSales" element={<QueryGSTSales />} />
        <Route path="QueryMasterGSTSales" element={<QueryMasterGSTSales />} />
        <Route path="QuerySales" element={<QuerySales />} />
        <Route path="QueryMasterSales" element={<QueryMasterSales />} />

        <Route path="InvoiceEmailSend" element={<InvoiceEmailSend />} />
        <Route path="VendarFile" element={<VendarFile />} />
        <Route path="InvoiceTransporterReport" element={<InvoiceTransporterReport />} />
        <Route path="SalesPurchaseFile" element={<SalesPurchaseFile />} />
        <Route path="QuerySalesTax" element={<QuerySalesTax />} />
        <Route path="QueryMasterSalesTax" element={<QueryMasterSalesTax />} />
        <Route path="ColumnSetup" element={<ColumnSetup />} />
        <Route path="VendorFileBajaj" element={<VendorFileBajaj />} />
        <Route path="JobWorkSalesRegister" element={<JobWorkSalesRegister />} />
        <Route path="QueryJobwork" element={<QueryJobwork />} />
        <Route path="QueryMasterJobwork" element={<QueryMasterJobwork />} />
        <Route path="QueryOutwardClln" element={<QueryOutwardClln />} />
        <Route path="QueryMasterOutwardClln" element={<QueryMasterOutwardClln />} />
        <Route path="NewTransportEntry" element={<NewTransportEntry />} />
        <Route path="TransportReport" element={<TransportReport />} />

        {/* ////////////////////////////////// Accounts /////////////////////////////////// */}

        <Route path="/purchase-bill" element={<PurchaseBill />} />
        <Route path="/jobwork-bill" element={<JobworkBill />} />
        <Route path="/direct-bill" element={<DirectBill />} />
        <Route path="/accounts/bill-passing/confirm-gst-bill" element={<ConfirmGSTBill />} />
        <Route path="/gl-master" element={<GLMaster />} />
        <Route path="/gst-report" element={<GSTR1 />} />
        <Route path="/hsn-sac-summary" element={<HSNSACSummary />} />
        <Route path="/gstr-2" element={<GSTR2 />} />
        <Route path="/gstr-3b" element={<GSTR3B />} />
        <Route path="/gst-itc-04" element={<GSTITC04 />} />
        <Route path="/purchase-register" element={<PurchaseRegister />} />
        <Route path="/tds-register" element={<TDSRegister />} />
        <Route path="/tcs-register" element={<TCSRegister />} />
        <Route path="/gl-ledger" element={<GLLedger />} />
        <Route path="/ac-purchase-register" element={<ACPurchaseRegister />} />

        {/* ////////////////////////////////// Maintenance /////////////////////////////////// */}

        <Route path="/asset-list" element={<AssetList />} />
        <Route path="/item-asset-master" element={<ItemAssetMaster />} />
        <Route path="/breakdown-list" element={<BreakdownList />} />
        <Route path="/breakdown-authorisation" element={<BreakdownAuthorisation />} />
        <Route path="/breakdown-report" element={<BreakdownReport />} />
        <Route path="/breakdown-slip" element={<BreakdownSlip />} />
        <Route path="/repair-entry" element={<RepairEntry />} />
        <Route path="/repair-list" element={<RepairList />} />
        <Route path="/machine-preventive-entry" element={<MachinePreventiveEntry />} />
        <Route path="/machine-preventive-report" element={<MachinePreventiveReport />} />
        <Route path="/machine-preventive-schedule" element={<MachinePreventiveSchedule />} />
        <Route path="/machine-preventive-setup" element={<MachinePreventiveSetUp />} />
        <Route path="/tool-management" element={<ToolManagement />} />
      </Routes>
    </React.Suspense>
      <Footer />
    </div>
  );
}

export default App;