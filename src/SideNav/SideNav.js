"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { FaHome } from "react-icons/fa"
import "./SideNav.css"
import "bootstrap/dist/css/bootstrap.min.css"
import { MdOutlineSettings } from "react-icons/md";
import { GiMasterOfArms } from "react-icons/gi";
import { BiPurchaseTag } from "react-icons/bi";
import { FaStore } from "react-icons/fa6";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { MdEqualizer } from "react-icons/md";
import { SiSalesforce } from "react-icons/si";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { MdSettingsSuggest } from "react-icons/md";
import { MdOutlineDashboard } from "react-icons/md";

const SideNav = ({ sideNavOpen, toggleSideNav }) => {
  const [openDropdowns, setOpenDropdowns] = useState({})

  // Load permissions strictly from backend for sub-users; Admin sees everything
  const rawPermissions = JSON.parse(localStorage.getItem("permissions")) || {}
  const username = (localStorage.getItem("username") || "").trim().toLowerCase()
  const isAdmin = username === "admin" || username === "prashant" || rawPermissions?.role === "admin" || rawPermissions === "all"

  let permissions = rawPermissions
  if (isAdmin) {
    permissions = {
      VendorsUserManagement: ["Vendors"],
      ERPSetting: ["User Configuration", "ERP Configuration", "Change Password", "Login History", "Dealer Management", "Dashboard Backup", "Delete Record"],
      Dashboard: ["Dashboard", "Dashboard View", "Financial", "Purchase", "PPC", "OEE", "Quality", "Stores", "Subcon", "Planning", "Sales", "Account", "CRM"],
      All_Masters: ["Masters", "Customer", "Business Partner Address", "Item Master", "Cross Reference", "Customer / Supplier Item Link", "Item Cross Reference", "GST Rate Master", "Commodity Master", "BOM Routing Master", "Work Center Master", "Cycle Time Master", "Operator and Supervisor Master", "Contractor Master", "Shift Master", "Work Center Schedule", "Unit Conversion", "Price List", "Price List Master", "Price List Entry", "Cost Center Master", "Project Management", "Document Management", "Master Report", "Customer State", "Master Customers"],
      Purchase: ["Purchase", "New Indent", "New Purchase Order", "New Jobwork Purchase Order", "Pending PO Release", "Pending Jobwork PO Release", "Pending Indent Release", "Purchase MRN Release", "Purchase Order Status", "Quote Comparison", "RFO", "Quoto Comparison Statement", "Quoto Comparison Pending", "Reports", "Purchase Order List", "Jobwork Purchase Order List", "Supplier Wise Item Purchase List", "Purchase Report (Cost Center Wise)", "Import"],
      Store: ["Store", "Gate Inward Entry", "Pending ASN List", "New MRN", "Purchase GRN", "Subcon GRN", "57F4 Inward Challan", "JobWork Inward Challan", "Vendor Scrap Inward", "Material Issue Challan", "Material Issue Gernal", "Stock Transaction", "Opening Stock", "FG Movement", "RM Stock Transaction", "Stock Transfer", "Delivery Challan", "DC GRN", "Store Report", "GRN List", "MRN List", "Inward 57F4 Challan List", "Material Issue Challan List", "General Material Issue Challan List", "Deliver Challan List", "DC GRN List", "Indent List", "Indent Status", "Stock Report", "Subcontract Stock", "WIP Stock Report", "RM Stock Report", "Consumable Stock Report", "FG Stock Report"],
      Production: ["Production", "Work Order Entry", "Work Order List", "Production Plan List", "Production Entry", "Production Entry Ass.", "Production Report", "Rework Production", "Rework Production Entry2", "Rework Production Entry", "Rework Production Report", "Scrap Production", "Scrap/Rejection Entry", "Scrap/Rejection Report", "FG Scrap/Rejection Entry", "FG Scrap/Rejection Report", "Material Idle Time", "Breakdown Time Entry", "Breakdown Time Report", "Contractor Payment", "P Report", "Rejection Report", "Rework Report", "Default Ideal Time Report", "Breakdown Analysis Report", "Cycle Time Report", "Operator Performance Report"],
      ProductionV2: ["Production V2", "Work Order Entry V2", "Work Order Report V2", "Contractor Work Order", "Work Order Status Entry", "Punching And Laser Schedule", "Punching Program", "Power Press"],
      Quality: ["Quality", "Quality Planning", "Purchase GRN QC", "Pending QC List", "Inward Test Certificate", "Subcon / JobWork GRN QC", "Pending QC Inward", "Inward Inspection List", "Inprocess QC", "Inprocess Inspection", "Inprocess Inspection List", "Sales Return QC", "Sales Return QC Pending List", "Sales Return QC List", "Gauges And Instruction Calibration", "Heat Code Register", "DTC - Dispatch Test Certificate", "PDI - Pre Dispatch Inspection", "First Piece Approval", "Set Up Approval", "Hot Inspection", "Sampling Plan", "Customer Complaint", "Customer Complaint Entry", "Customer Complaint Authorization", "Customer Complaint List", "Test Master", "Test Report", "Test Master List"],
      Planning: ["Planning", "Manufacturing Order", "Production Schedule", "Min Max Planning", "Daily Dispatch Plan", "Business Plan", "Upcoming Dispatch List", "Capacity Planning", "Costing", "Vendor Schedule"],
      Sales: ["Sales", "Customer Sales Order", "Customer Order List", "New Sales Order", "Customer Sales Order Amendment", "Sales Order Amend List", "New Amend Order", "Outward Challan", "New Outward Challan", "Outward Challan List", "GST Tax Invoice", "New Tax Invoice", "Tax Invoice List", "GST Jobwork Invoice", "New Jobwork Invoice", "Jobwork Invoice List", "Credit / Debit Note", "Purchase Debit Note", "Sales Credit Note", "Reports", "Customer Order List Report", "Tax Invoice List Report", "Bajaj Tax Invoice Report", "Jobwork Invoice List Report", "Outward Challan List Report", "Transport Report", "GST Sales Return", "New Proforma Invoice", "Proforma Invoice List"],
      Accounts: ["Accounts", "Bill Passing", "Purchase Bill", "Jobwork Bill", "Direct Bill", "GL Master", "GST Report", "Purchase Register", "AC Purchase Register", "TDS Register", "TCS Register", "GL Ledger"],
      Maintenance: ["Maintenance", "Asset List", "Item Asset Master", "Machine Breakdown", "Breakdown List", "Breakdown Authorisation", "Breakdown Report", "Breakdown Slip", "Machine Repair", "Repair Entry", "Repair List", "Machine Preventive", "Machine Preventive Entry", "Machine Preventive Report", "Machine Preventive Schedule", "Machine Preventive SetUp", "Tool Management"],
      ...rawPermissions
    }
  }

  const handleDropdownToggle = (dropdown) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }))
  }

  const isDropdownOpen = (dropdown) => {
    return openDropdowns[dropdown] || false
  }

  return (
    <div className={`blueside-Nav ${sideNavOpen ? "open" : ""}`}>
      <div className={`side-nav ${sideNavOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="side-nav-header">
          <h6 className="logo-light">ProdNomics</h6>
          <button className="close-button" onClick={toggleSideNav}>
            &times;
          </button>
        </div>

        <ul className="nav-list">
          {/* Show Dashboard only if user has permission or is admin */}
          {(isAdmin || (permissions && permissions.Dashboard?.length > 0)) && (
            <li className="vdnrbbnns" style={{ marginLeft: "15px" }}>
              <Link to="/dashboard">
                <MdOutlineDashboard />
                Dashboard
              </Link>
            </li>
          )}

          {/* Show ERP Setting only if user has permission */}
          {permissions && permissions.VendorsUserManagement?.length > 0 && (
            <li className="vdnrbbnns" style={{ marginLeft: "15px" }}>
              <Link to="/mainpage">
                <FaHome />
                Vendors
              </Link>
            </li>
          )}

          {/* //////////////////////////////    ERPSetting       /////////////////////////// */}
          {permissions && permissions.ERPSetting?.length > 0 && (
            <li className="dropdown-container">
              <div className="dropdown-toggle" onClick={() => handleDropdownToggle("erp")}>
                <MdOutlineSettings />
                <span>ERP Setting</span>
                <span className={`dropdown-arrow ${isDropdownOpen("erp") ? "open" : ""}`}>  </span>
              </div>
              <div className={`custom-dropdown-menu ${isDropdownOpen("erp") ? "show" : ""}`}>
                {permissions.ERPSetting.includes("User Configuration") && (
                  <div className="nested-dropdown">
                    <div
                      className="dropdown-item nested-toggle"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDropdownToggle("userConfig")
                      }}
                    >
                      User Configuration
                      <span className={`arrow ${isDropdownOpen("userConfig") ? "open" : ""}`}> ▶ </span>
                    </div>
                    <div className={`nested-dropdown-menu ${isDropdownOpen("userConfig") ? "show" : ""}`}>
                      <Link className="dropdown-item" to="/ErpSetting">
                        User Management
                      </Link>
                      <Link className="dropdown-item" to="/User-Permit">
                        User Permission
                      </Link>
                      {/* <Link className="dropdown-item" to="/DashboardPermission">
                        Dashboard Permission
                      </Link>
                      <Link className="dropdown-item" to="/BackDated">
                        Back Dated Entry Setting
                      </Link>
                      <Link className="dropdown-item" to="/User-Wise-Series">
                        User Wise Series
                      </Link>
                      <Link className="dropdown-item" to="/UserwiseProduction">
                        Userwise Prod. Operation
                      </Link>
                      <Link className="dropdown-item" to="/USerwiseAuth">
                        Userwise Auth. Setting
                      </Link>
                      <Link className="dropdown-item" to="/User-plant">
                        User Plant
                      </Link>
                      <Link className="dropdown-item" to="/Plantwiseseries">
                        Plant Wise Series
                      </Link>
                      <Link className="dropdown-item" to="/AlertSetting">
                        Alert Setting
                      </Link>
                      <Link className="dropdown-item" to="/Userwisepermission">
                        User Wise Permission
                      </Link> */}
                    </div>
                  </div>
                )}

                {permissions.ERPSetting.includes("ERP Configuration") && (
                  <div className="nested-dropdown">
                    <div
                      className="dropdown-item nested-toggle"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDropdownToggle("erpConfig")
                      }}
                    >
                      ERP Configuration
                      <span className={`arrow ${isDropdownOpen("erpConfig") ? "open" : ""}`}> ▶ </span>
                    </div>
                    <div className={`nested-dropdown-menu ${isDropdownOpen("erpConfig") ? "show" : ""}`}>
                      {/* <div className="dropdown-item-header">
                        <strong>Company</strong>
                      </div>
                      <Link className="dropdown-item" to="/Companysetup">
                        Company / Plant Setup
                      </Link>
                      <Link className="dropdown-item" to="/WebconfigFile">
                        Web. config File
                      </Link> */}
                      <Link className="dropdown-item" to="/ErpFinancialYear">
                        Financial Year
                      </Link>
                      {/* <Link className="dropdown-item" to="/FinancialMonth">
                        Financial Month Master
                      </Link> */}
                      <Link className="dropdown-item" to="/ScheduleMonth">
                        Schedule Month Master
                      </Link>
                      {/* <Link className="dropdown-item" to="/Weekoff">
                        Weekly Off / Holiday
                      </Link>
                      <div className="dropdown-item-header">
                        <strong>Setting</strong>
                      </div>
                      <Link className="dropdown-item" to="/Docseriesgroup">
                        Doc. Series /Group
                      </Link>
                      <Link className="dropdown-item" to="/UserPermission">
                        Parameter Setting
                      </Link>
                      <Link className="dropdown-item" to="/DocprintFormat">
                        Doc. Print Format
                      </Link>
                      <Link className="dropdown-item" to="/Docnoeditable">
                        Doc. No Editable
                      </Link>
                      <Link className="dropdown-item" to="/Qcisoformat">
                        Qc ISO Format
                      </Link>
                      <Link className="dropdown-item" to="/Roundofsetting">
                        Round Of Setting
                      </Link>
                      <Link className="dropdown-item" to="/Customersupplier">
                        Customer / Supplier
                      </Link>
                      <Link className="dropdown-item" to="/Itemmastersetup">
                        Item Master Setup
                      </Link>
                      <div className="dropdown-item-header">
                        <strong>Email / SMS</strong>
                      </div>
                      <Link className="dropdown-item" to="/Emailsetup">
                        Email Setup
                      </Link>
                      <Link className="dropdown-item" to="/Emailtemplate">
                        Email Template
                      </Link> */}
                    </div>
                  </div>
                )}

                {/* {permissions.ERPSetting.includes("Change Password") && (
                  <Link className="dropdown-item" to="/change-password">
                    Change Password
                  </Link>
                )}

                {permissions.ERPSetting.includes("Login History") && (
                  <Link className="dropdown-item" to="/login-history">
                    Login History
                  </Link>
                )}

                {permissions.ERPSetting.includes("Dealer Management") && (
                  <Link className="dropdown-item" to="/delete-management">
                    Dealer Management
                  </Link>
                )}

                {permissions.ERPSetting.includes("Dashboard Backup") && (
                  <Link className="dropdown-item" to="/dashboard-backup">
                    Dashboard Backup
                  </Link>
                )}

                {permissions.ERPSetting.includes("Delete Record") && (
                  <Link className="dropdown-item" to="/delete-record">
                    Delete Record
                  </Link>
                )} */}
              </div>
            </li>
          )}

          {/* //////////////////////////////     All-Masters       /////////////////////////// */}
          {permissions?.All_Masters?.length > 0 && (
            <li className="dropdown-container">
              <div className="dropdown-toggle" onClick={() => handleDropdownToggle("masters")}>
                <GiMasterOfArms />
                <span>Masters</span>
                <span className={`dropdown-arrow ${isDropdownOpen("masters") ? "open" : ""}`}>  </span>
              </div>
              <div className={`custom-dropdown-menu ${isDropdownOpen("masters") ? "show" : ""}`}>
                {permissions.All_Masters.includes("Customer") && (
                  <Link className="dropdown-item" to="/vender-list">
                    Supplier Customer Master
                  </Link>
                )}

                {permissions.All_Masters.includes("Business Partner Address") && (
                  <Link className="dropdown-item" to="/business-partner">
                    Business Partner Address
                  </Link>
                )}

                {permissions.All_Masters.includes("Item Master") && (
                  <Link className="dropdown-item" to="/item-master">
                    Item Master
                  </Link>
                )}

                {/* {permissions.All_Masters.includes("Cross Reference") && (
                  <div className="nested-dropdown">
                    <div
                      className="dropdown-item nested-toggle"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDropdownToggle("crossRef")
                      }}
                    >
                      Cross Reference
                      <span className={`arrow ${isDropdownOpen("crossRef") ? "open" : ""}`}> ▶</span>
                    </div>
                    <div className={`nested-dropdown-menu ${isDropdownOpen("crossRef") ? "show" : ""}`}>
                      {permissions.All_Masters.includes("Customer / Supplier Item Link") && (
                        <Link className="dropdown-item" to="/Customer-Item-Wise">
                          Customer Item Wise
                        </Link>
                      )}
                      {permissions.All_Masters.includes("Customer / Supplier Item Link") && (
                        <Link className="dropdown-item" to="/customer-supplier-item-link">
                          Customer / Supplier Item Link
                        </Link>
                      )}
                      {permissions.All_Masters.includes("Item Cross Reference") && (
                        <Link className="dropdown-item" to="/item-cross-reference">
                          Item Cross Reference
                        </Link>
                      )}
                    </div>
                  </div>
                )} */}

                {permissions.All_Masters.includes("GST Rate Master") && (
                  <Link className="dropdown-item" to="/gst-rate-master">
                    GST Rate Master
                  </Link>
                )}

                {/* {permissions.All_Masters.includes("Commodity Master") && (
                  <Link className="dropdown-item" to="/commodity-master">
                    Commodity Master
                  </Link>
                )} */}

                {permissions.All_Masters.includes("BOM Routing Master") && (
                  <Link className="dropdown-item" to="/bom-routing">
                    BOM Routing Master
                  </Link>
                )}

                {permissions.All_Masters.includes("Work Center Master") && (
                  <Link className="dropdown-item" to="/work-center-master">
                    Work Center Master
                  </Link>
                )}

                {permissions.All_Masters.includes("Cycle Time Master") && (
                  <Link className="dropdown-item" to="/cycle-time-master">
                    Cycle Time Master
                  </Link>
                )}

                {permissions.All_Masters.includes("Operator and Supervisor Master") && (
                  <Link className="dropdown-item" to="/operator-supervisor-master">
                    Operator and Supervisor Master
                  </Link>
                )}

                {permissions.All_Masters.includes("Contractor Master") && (
                  <Link className="dropdown-item" to="/contractor-master">
                    Contractor Master
                  </Link>
                )}

                {permissions.All_Masters.includes("Shift Master") && (
                  <Link className="dropdown-item" to="/shift-master">
                    Shift Master
                  </Link>
                )}

                {permissions.All_Masters.includes("Work Center Schedule") && (
                  <Link className="dropdown-item" to="/work-center-schedule">
                    Work Center Schedule
                  </Link>
                )}

                {permissions.All_Masters.includes("Unit Conversion") && (
                  <Link className="dropdown-item" to="/unit-conversion">
                    Unit Conversion
                  </Link>
                )}

                {permissions.All_Masters.includes("Price List") && (
                  <div className="nested-dropdown">
                    <div
                      className="dropdown-item nested-toggle"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDropdownToggle("priceList")
                      }}
                    >
                      Price List
                      <span className={`arrow ${isDropdownOpen("priceList") ? "open" : ""}`}> ▶</span>
                    </div>
                    <div className={`nested-dropdown-menu ${isDropdownOpen("priceList") ? "show" : ""}`}>
                      {permissions.All_Masters.includes("Price List Master") && (
                        <Link className="dropdown-item" to="/price-list-master">
                          Price List Master
                        </Link>
                      )}
                      {permissions.All_Masters.includes("Price List Entry") && (
                        <Link className="dropdown-item" to="/price-entry-master">
                          Price List Entry
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {permissions.All_Masters.includes("Cost Center Master") && (
                  <Link className="dropdown-item" to="/cost-center-master">
                    Cost Center Master
                  </Link>
                )}

                {permissions.All_Masters.includes("Project Management") && (
                  <Link className="dropdown-item" to="/project-management">
                    Project Management
                  </Link>
                )}

                {permissions.All_Masters.includes("Document Management") && (
                  <Link className="dropdown-item" to="/document-management">
                    Document Management
                  </Link>
                )}

                {permissions.All_Masters.includes("Master Report") && (
                  <Link className="dropdown-item" to="/master-report">
                    Master Report
                  </Link>
                )}

                {permissions.All_Masters.includes("Customer State") && (
                  <Link className="dropdown-item" to="/CustomerState">
                    Customer State
                  </Link>
                )}

                {permissions.All_Masters.includes("Master Customers") && (
                  <Link className="dropdown-item" to="/master-customers">
                    Master Customers
                  </Link>
                )}

                {permissions.All_Masters.includes("Master State") && (
                  <Link className="dropdown-item" to="/master-state">
                    Master State
                  </Link>
                )}
              </div>
            </li>
          )}

          {/* //////////////////////////////     Purchase       /////////////////////////// */}
          {permissions?.Purchase?.length > 0 && (
            <li className="dropdown-container">
              <div className="dropdown-toggle" onClick={() => handleDropdownToggle("purchase")}>
                <BiPurchaseTag />
                <span>Purchase</span>
                <span className={`dropdown-arrow ${isDropdownOpen("purchase") ? "open" : ""}`}>  </span>
              </div>
              <div className={`custom-dropdown-menu ${isDropdownOpen("purchase") ? "show" : ""}`}>
                {permissions.Purchase.includes("New Indent") && (
                  <Link className="dropdown-item" to="/new-indent">
                    New Indent
                  </Link>
                )}

                {permissions.Purchase.includes("New Purchase Order") && (
                  <Link className="dropdown-item" to="/new-purchase-order">
                    New Purchase Order
                  </Link>
                )}

                {permissions.Purchase.includes("New Jobwork Purchase Order") && (
                  <Link className="dropdown-item" to="/new-jobwork-order">
                    New Jobwork Purchase Order
                  </Link>
                )}

                {permissions.Purchase.includes("Pending PO Release") && (
                  <Link className="dropdown-item" to="/pendingpo">
                    Pending PO Release
                  </Link>
                )}

                <Link className="dropdown-item" to="/pending-jobwork-po-release">
                  Pending Jobwork PO Release
                </Link>

                {permissions.Purchase.includes("Pending Indent Release") && (
                  <Link className="dropdown-item" to="/pendingindent">
                    Pending Indent Release
                  </Link>
                )}

                {/* {permissions.Purchase.includes("Purchase MRN Release") && (
                  <Link className="dropdown-item" to="/Purchse-Mrn">
                    Purchase MRN Release
                  </Link>
                )}

                {permissions.Purchase.includes("Purchase Order Status") && (
                  <Link className="dropdown-item" to="/Purchse-order-status">
                    Purchase Order Status
                  </Link>
                )}

                {permissions.Purchase.includes("Quote Comparison") && (
                  <div className="nested-dropdown">
                    <div
                      className="dropdown-item nested-toggle"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDropdownToggle("quoteComp")
                      }}
                    >
                      Quote Comparison
                      <span className={`arrow ${isDropdownOpen("quoteComp") ? "open" : ""}`}> ▶</span>
                    </div>
                    <div className={`nested-dropdown-menu ${isDropdownOpen("quoteComp") ? "show" : ""}`}>
                      {permissions.Purchase.includes("RFO") && (
                        <Link className="dropdown-item" to="/Rfo">
                          RFO
                        </Link>
                      )}
                      {permissions.Purchase.includes("Quoto Comparison Statement") && (
                        <Link className="dropdown-item" to="/Quoto-Comparison-Statement">
                          Quoto Comparison Statement
                        </Link>
                      )}
                      {permissions.Purchase.includes("Quoto Comparison Pending") && (
                        <Link className="dropdown-item" to="/Quoto-Comparison-Pending">
                          Quoto Comparison Pending
                        </Link>
                      )}
                    </div>
                  </div>
                )} */}

                {permissions.Purchase.includes("Reports") && (
                  <div className="nested-dropdown">
                    <div
                      className="dropdown-item nested-toggle"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDropdownToggle("purchaseReports")
                      }}
                    >
                      Report
                      <span className={`arrow ${isDropdownOpen("purchaseReports") ? "open" : ""}`}> ▶</span>
                    </div>
                    <div className={`nested-dropdown-menu ${isDropdownOpen("purchaseReports") ? "show" : ""}`}>
                      {permissions.Purchase.includes("Purchase Order List") && (
                        <Link className="dropdown-item" to="/purchase-order-list">
                          Purchase Order List
                        </Link>
                      )}
                      {permissions.Purchase.includes("Jobwork Purchase Order List") && (
                        <Link className="dropdown-item" to="/jobwork-purchase-order-list">
                          Jobwork Purchase Order List
                        </Link>
                      )}
                      {/* {permissions.Purchase.includes("Supplier Wise Item Purchase List") && (
                        <Link className="dropdown-item" to="/supplier-wise-list">
                          Supplier Wise Item Purchase List
                        </Link>
                      )}
                      {permissions.Purchase.includes("Purchase Report (Cost Center Wise)") && (
                        <Link className="dropdown-item" to="/purchase-report">
                          Purchase Report (Cost Center Wise)
                        </Link>
                      )} */}
                    </div>
                  </div>
                )}

                {/* {permissions.Purchase.includes("Import") && (
                  <Link className="dropdown-item" to="/Importfile">
                    Import
                  </Link>
                )} */}
              </div>
            </li>
          )}

          {/* //////////////////////////////     Accounts       /////////////////////////// */}
          {permissions?.Accounts?.length > 0 && (
            <li className="dropdown-container">
              <div className="dropdown-toggle" onClick={() => handleDropdownToggle("accounts")}>
                <MdOutlineAccountBalanceWallet />
                <span>Accounts</span>
                <span className={`dropdown-arrow ${isDropdownOpen("accounts") ? "open" : ""}`}>  </span>
              </div>
              <div className={`custom-dropdown-menu ${isDropdownOpen("accounts") ? "show" : ""}`}>
                <Link className="dropdown-item" to="/gl-master">
                  GL Master
                </Link>

                <div className="nested-dropdown">
                  <div
                    className="dropdown-item nested-toggle"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDropdownToggle("billPassing")
                    }}
                  >
                    Bill Passing
                    <span className={`arrow ${isDropdownOpen("billPassing") ? "open" : ""}`}> ▶</span>
                  </div>
                  <div className={`nested-dropdown-menu ${isDropdownOpen("billPassing") ? "show" : ""}`}>
                    <Link className="dropdown-item" to="/purchase-bill">
                      Purchase Bill
                    </Link>
                    <Link className="dropdown-item" to="/jobwork-bill">
                      Jobwork Bill
                    </Link>
                    <Link className="dropdown-item" to="/direct-bill">
                      Direct Bill
                    </Link>
                  </div>
                </div>

                <Link className="dropdown-item" to="/purchase-register">
                  Purchase Register
                </Link>

                {/* <Link className="dropdown-item" to="/tds-register">
                  TDS Register
                </Link>

                <Link className="dropdown-item" to="/tcs-register">
                  TCS Register
                </Link> */}

                <div className="nested-dropdown">
                  <div
                    className="dropdown-item nested-toggle"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDropdownToggle("acRegister")
                    }}
                  >
                    AC Register
                    <span className={`arrow ${isDropdownOpen("acRegister") ? "open" : ""}`}> ▶</span>
                  </div>
                  <div className={`nested-dropdown-menu ${isDropdownOpen("acRegister") ? "show" : ""}`}>
                    <Link className="dropdown-item" to="/tax-invoice-list">
                      Tax Invoice List
                    </Link>
                    <Link className="dropdown-item" to="/jobwork-invoice-list">
                      Jobwork Invoice List
                    </Link>
                    <Link className="dropdown-item" to="/debit-note-list">
                      Debit Note List
                    </Link>
                    <Link className="dropdown-item" to="/credit-note-list">
                      Credit Note List
                    </Link>
                    <Link className="dropdown-item" to="/gst-sales-return-list">
                      GST Sales Return List
                    </Link>
                    {/* <Link className="dropdown-item" to="/ac-purchase-register">
                      Purchase Register
                    </Link> */}
                  </div>
                </div>

                <Link className="dropdown-item" to="/gl-ledger">
                  GL Ledger
                </Link>

                <div className="nested-dropdown">
                  <div
                    className="dropdown-item nested-toggle"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDropdownToggle("gstReport")
                    }}
                  >
                    GST Report
                    <span className={`arrow ${isDropdownOpen("gstReport") ? "open" : ""}`}> ▶</span>
                  </div>
                  <div className={`nested-dropdown-menu ${isDropdownOpen("gstReport") ? "show" : ""}`}>
                    <Link className="dropdown-item" to="/gst-report">
                      GSTR 1
                    </Link>
                    <Link className="dropdown-item" to="/hsn-sac-summary">
                      HSN/SAC Summary
                    </Link>
                    {/* <Link className="dropdown-item" to="/gstr-2">
                      GSTR 2
                    </Link>
                    <Link className="dropdown-item" to="/gstr-3b">
                      GSTR 3B
                    </Link>
                    <Link className="dropdown-item" to="/gst-itc-04">
                      GST ITC_04
                    </Link> */}
                  </div>
                </div>
              </div>
            </li>
          )}

          {/* //////////////////////////////     Store   /////////////////////////// */}
          {permissions?.Store?.length > 0 && (
            <li className="dropdown-container">
              <div className="dropdown-toggle" onClick={() => handleDropdownToggle("store")}>
                <FaStore />
                <span>Store</span>
                <span className={`dropdown-arrow ${isDropdownOpen("store") ? "open" : ""}`}>  </span>
              </div>
              <div className={`custom-dropdown-menu ${isDropdownOpen("store") ? "show" : ""}`}>
                {permissions.Store.includes("Gate Inward Entry") && (
                  <Link className="dropdown-item" to="/Gate-Inward-Entry">
                    Gate Inward Entry
                  </Link>
                )}

                {/* {permissions.Store.includes("Pending ASN List") && (
                  <Link className="dropdown-item" to="/Pending-Asn-List">
                    Pending ASN List
                  </Link>
                )} */}

                {/* {permissions.Store.includes("New MRN") && (
                  <Link className="dropdown-item" to="/New-Mrn">
                    New MRN
                  </Link>
                )} */}

                {permissions.Store.includes("Purchase GRN") && (
                  <Link className="dropdown-item" to="/Purchase-Grn">
                    Purchase GRN
                  </Link>
                )}

                {permissions.Store.includes("Subcon GRN") && (
                  <div className="nested-dropdown">
                    <div
                      className="dropdown-item nested-toggle"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDropdownToggle("subconGRN")
                      }}
                    >
                      Subcon GRN
                      <span className={`arrow ${isDropdownOpen("subconGRN") ? "open" : ""}`}> ▶</span>
                    </div>
                    <div className={`nested-dropdown-menu ${isDropdownOpen("subconGRN") ? "show" : ""}`}>
                      {permissions.Store.includes("57F4 Inward Challan") && (
                        <Link className="dropdown-item" to="/Inward-challan">
                          57F4 Inward Challan
                        </Link>
                      )}
                      {permissions.Store.includes("JobWork Inward Challan") && (
                        <Link className="dropdown-item" to="/Jobwork-Inward-Challan">
                          Jobwork Inward Challan
                        </Link>
                      )}
                      {/* {permissions.Store.includes("Vendor Scrap Inward") && (
                        <Link className="dropdown-item" to="/Vendor-Scrap-Inward">
                          Vendor Scrap Inward
                        </Link>
                      )} */}
                    </div>
                  </div>
                )}

                {permissions.Store.includes("Material Issue Challan") && (
                  <Link className="dropdown-item" to="/Material-Issue-Challan">
                    Material Issue Challan
                  </Link>
                )}

                {/* {permissions.Store.includes("Material Issue Gernal") && (
                  <Link className="dropdown-item" to="/Material-Issue-Gernal">
                    Material Issue Gernal
                  </Link>
                )} */}

                {permissions.Store.includes("Stock Transaction") && (
                  <div className="nested-dropdown">
                    <div
                      className="dropdown-item nested-toggle"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDropdownToggle("stockTransaction")
                      }}
                    >
                      Stock Transaction
                      <span className={`arrow ${isDropdownOpen("stockTransaction") ? "open" : ""}`}> ▶</span>
                    </div>
                    <div className={`nested-dropdown-menu ${isDropdownOpen("stockTransaction") ? "show" : ""}`}>
                      {permissions.Store.includes("Opening Stock") && (
                        <Link className="dropdown-item" to="/Opening-Stock">
                          Opening Stock
                        </Link>
                      )}
                      {permissions.Store.includes("FG Movement") && (
                        <Link className="dropdown-item" to="/FG-Movement">
                          FG Movement
                        </Link>
                      )}
                      {permissions.Store.includes("RM Stock Transaction") && (
                        <Link className="dropdown-item" to="/RM-Stock-Transaction">
                          RM Stock Transaction
                        </Link>
                      )}
                      {/* {permissions.Store.includes("Stock Transfer") && (
                        <Link className="dropdown-item" to="/Stock-Transaction">
                          Stock Transfer
                        </Link>
                      )} */}
                    </div>
                  </div>
                )}

                {permissions.Store.includes("Delivery Challan") && (
                  <Link className="dropdown-item" to="/Delivery-Challan">
                    Delivery Challan
                  </Link>
                )}

                {/* {permissions.Store.includes("DC GRN") && (
                  <Link className="dropdown-item" to="/Dcgrn">
                    DC GRN
                  </Link>
                )}

                {permissions.Store.includes("New Indent") && (
                  <Link className="dropdown-item" to="/Store-New-indent">
                    New Indent
                  </Link>
                )} */}

                {permissions.Store.includes("Store Report") && (
                  <div className="nested-dropdown">
                    <div
                      className="dropdown-item nested-toggle"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDropdownToggle("storeReport")
                      }}
                    >
                      Report
                      <span className={`arrow ${isDropdownOpen("storeReport") ? "open" : ""}`}> ▶</span>
                    </div>
                    <div className={`nested-dropdown-menu ${isDropdownOpen("storeReport") ? "show" : ""}`}>
                      {permissions.Store.includes("GRN List") && (
                        <Link className="dropdown-item" to="/Grn-List">
                          GRN List
                        </Link>
                      )}
                      {/* {permissions.Store.includes("MRN List") && (
                        <Link className="dropdown-item" to="/MRNList">
                          MRN List
                        </Link>
                      )} */}
                      {permissions.Store.includes("Inward 57F4 Challan List") && (
                        <Link className="dropdown-item" to="/Challaninward">
                          Inward 57F4 Challan List
                        </Link>
                      )}
                      {permissions.Store.includes("Material Issue Challan List") && (
                        <Link className="dropdown-item" to="/IssueMaterial">
                          Material Issue Challan List
                        </Link>
                      )}
                      {/* {permissions.Store.includes("General Material Issue Challan List") && (
                        <Link className="dropdown-item" to="/GeneralMtrlIssue">
                          General Material Issue Challan List
                        </Link>
                      )} */}
                      {permissions.Store.includes("Deliver Challan List") && (
                        <Link className="dropdown-item" to="/DeliveryChlln">
                          Delivery Challan List
                        </Link>
                      )}
                      {/* {permissions.Store.includes("DC GRN List") && (
                        <Link className="dropdown-item" to="/GRNDCReport">
                          DC GRN List
                        </Link>
                      )} */}
                      {/* {permissions.Store.includes("Indent List") && (
                        <Link className="dropdown-item" to="/IndentReport">
                          Indent List
                        </Link>
                      )} */}
                      {/* {permissions.Store.includes("Indent Status") && (
                        <Link className="dropdown-item" to="/IndentStatus">
                          Indent Status
                        </Link>
                      )} */}
                    </div>
                  </div>
                )}

                {permissions.Store.includes("Stock Report") && (
                  <div className="nested-dropdown">
                    <div
                      className="dropdown-item nested-toggle"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDropdownToggle("stockReport")
                      }}
                    >
                      Stock Report
                      <span className={`arrow ${isDropdownOpen("stockReport") ? "open" : ""}`}> ▶</span>
                    </div>
                    <div className={`nested-dropdown-menu ${isDropdownOpen("stockReport") ? "show" : ""}`}>
                      <Link className="dropdown-item" to="/SubcontractStock">
                        Subcontract Stock
                      </Link>
                      {permissions.Store.includes("WIP Stock Report") && (
                        <Link className="dropdown-item" to="/WIPStock">
                          WIP Stock Report
                        </Link>
                      )}
                      {permissions.Store.includes("RM Stock Report") && (
                        <Link className="dropdown-item" to="/RMStock">
                          RM Stock Report
                        </Link>
                      )}
                      <Link className="dropdown-item" to="/JobworkStockReport">
                        Jobwork Stock Report
                      </Link>
                      {permissions.Store.includes("Consumable Stock Report") && (
                        <Link className="dropdown-item" to="/ConsumableStock">
                          Consumable Stock Report
                        </Link>
                      )}
                      {permissions.Store.includes("FG Stock Report") && (
                        <Link className="dropdown-item" to="/FGStock">
                          FG Stock Report
                        </Link>
                      )}
                      {permissions.Store.includes("Customer Stock") && (
                        <Link className="dropdown-item" to="#/">
                          Customer Stock
                        </Link>
                      )}
                      {permissions.Store.includes("Scrap Stock") && (
                        <Link className="dropdown-item" to="#/">
                          Scrap Stock
                        </Link>
                      )}
                      {permissions.Store.includes("Tray Bin Stock Report") && (
                        <Link className="dropdown-item" to="#/">
                          Tray Bin Stock Report
                        </Link>
                      )}
                      {permissions.Store.includes("Itemwise Stock Report") && (
                        <Link className="dropdown-item" to="#/">
                          Itemwise Stock Report
                        </Link>
                      )}
                      {permissions.Store.includes("Monthly Consumption Report") && (
                        <Link className="dropdown-item" to="#/">
                          Monthly Consumption Report
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </li>
          )}

          {/* //////////////////////////////     Maintenance       /////////////////////////// */}
          {permissions?.Maintenance?.length > 0 && (
            <li className="dropdown-container">
              <div className="dropdown-toggle" onClick={() => handleDropdownToggle("maintenance")}>
                <MdSettingsSuggest />
                <span>Maintenance</span>
                <span className={`dropdown-arrow ${isDropdownOpen("maintenance") ? "open" : ""}`}>  </span>
              </div>
              <div className={`custom-dropdown-menu ${isDropdownOpen("maintenance") ? "show" : ""}`}>
                {/* <Link className="dropdown-item" to="/asset-list">
                  Asset List
                </Link>

                <Link className="dropdown-item" to="/item-asset-master">
                  Item Asset Master
                </Link>

                <div className="nested-dropdown">
                  <div
                    className="dropdown-item nested-toggle"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDropdownToggle("machineBreakdown")
                    }}
                  >
                    Machine Breakdown
                    <span className={`arrow ${isDropdownOpen("machineBreakdown") ? "open" : ""}`}> ▶</span>
                  </div>
                  <div className={`nested-dropdown-menu ${isDropdownOpen("machineBreakdown") ? "show" : ""}`}>
                    <Link className="dropdown-item" to="/breakdown-list">
                      Breakdown List
                    </Link>
                    <Link className="dropdown-item" to="/breakdown-authorisation">
                      Breakdown Authorisation
                    </Link>
                    <Link className="dropdown-item" to="/breakdown-report">
                      Breakdown Report
                    </Link>
                    <Link className="dropdown-item" to="/breakdown-slip">
                      Breakdown Slip
                    </Link>
                  </div>
                </div>

                <div className="nested-dropdown">
                  <div
                    className="dropdown-item nested-toggle"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDropdownToggle("machineRepair")
                    }}
                  >
                    Machine Repair
                    <span className={`arrow ${isDropdownOpen("machineRepair") ? "open" : ""}`}> ▶</span>
                  </div>
                  <div className={`nested-dropdown-menu ${isDropdownOpen("machineRepair") ? "show" : ""}`}>
                    <Link className="dropdown-item" to="/repair-entry">
                      Repair Entry
                    </Link>
                    <Link className="dropdown-item" to="/repair-list">
                      Repair List
                    </Link>
                  </div>
                </div>

                <div className="nested-dropdown">
                  <div
                    className="dropdown-item nested-toggle"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDropdownToggle("machinePreventive")
                    }}
                  >
                    Machine Preventive
                    <span className={`arrow ${isDropdownOpen("machinePreventive") ? "open" : ""}`}> ▶</span>
                  </div>
                  <div className={`nested-dropdown-menu ${isDropdownOpen("machinePreventive") ? "show" : ""}`}>
                    <Link className="dropdown-item" to="/machine-preventive-entry">
                      Machine Preventive Entry
                    </Link>
                    <Link className="dropdown-item" to="/machine-preventive-report">
                      Machine Preventive Report
                    </Link>
                    <Link className="dropdown-item" to="/machine-preventive-schedule">
                      Machine Preventive Schedule
                    </Link>
                    <Link className="dropdown-item" to="/machine-preventive-setup">
                      Machine Preventive SetUp
                    </Link>
                  </div>
                </div> */}

                <Link className="dropdown-item" to="/tool-management">
                  Tool Management
                </Link>
              </div>
            </li>
          )}

          {/* //////////////////////////////     Production   /////////////////////////// */}
          {permissions?.Production?.length > 0 && (
            <li className="dropdown-container">
              <div className="dropdown-toggle" onClick={() => handleDropdownToggle("production")}>
                <MdOutlineProductionQuantityLimits />
                <span>Production</span>
                <span className={`dropdown-arrow ${isDropdownOpen("production") ? "open" : ""}`}>  </span>
              </div>
              <div className={`custom-dropdown-menu ${isDropdownOpen("production") ? "show" : ""}`}>
                {/* {permissions.Production.includes("Work Order Entry") && (
                  <Link className="dropdown-item" to="/WorkOrderEntry">
                    Work Order Entry
                  </Link>
                )}

                {permissions.Production.includes("Work Order List") && (
                  <Link className="dropdown-item" to="/WorkOrderList">
                    Work Order List
                  </Link>
                )}

                {permissions.Production.includes("Production Plan List") && (
                  <Link className="dropdown-item" to="/ProductionPlanList">
                    Production Plan List
                  </Link>
                )} */}

                {permissions.Production.includes("Production Entry") && (
                  <Link className="dropdown-item" to="/ProductionEntry">
                    Production Entry
                  </Link>
                )}

                {/* {permissions.Production.includes("Production Entry Ass.") && (
                  <Link className="dropdown-item" to="/ProductionEntryAss">
                    Production Entry Ass.
                  </Link>
                )} */}

                {permissions.Production.includes("Production Report") && (
                  <Link className="dropdown-item" to="/ProductionReport">
                    Production Report
                  </Link>
                )}

                <Link className="dropdown-item" to="/ReworkEntry">
                  Rework Entry
                </Link>

                {/* {permissions.Production.includes("Rework Production") && (
                  <div className="nested-dropdown">
                    <div
                      className="dropdown-item nested-toggle"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDropdownToggle("reworkProduction")
                      }}
                    >
                      <strong>Rework Production</strong>
                      <span className={`arrow ${isDropdownOpen("reworkProduction") ? "open" : ""}`}> ▶</span>
                    </div>
                    <div className={`nested-dropdown-menu ${isDropdownOpen("reworkProduction") ? "show" : ""}`}>
                      {permissions.Production.includes("Rework Production Entry2") && (
                        <Link className="dropdown-item" to="/ReworkProduction">
                          Rework Production Entry2
                        </Link>
                      )}
                      {permissions.Production.includes("Rework Production Entry") && (
                        <Link className="dropdown-item" to="/ReworkProductionEntry">
                          Rework Production Entry
                        </Link>
                      )}
                      <Link className="dropdown-item" to="/ReworkEntry">
                        Rework Entry
                      </Link>
                      {permissions.Production.includes("Rework Production Report") && (
                        <Link className="dropdown-item" to="/ReworkProductionReport">
                          Rework Production Report
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {permissions.Production.includes("Scrap Production") && (
                  <div className="nested-dropdown">
                    <div
                      className="dropdown-item nested-toggle"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDropdownToggle("scrapProduction")
                      }}
                    >
                      <strong>Scrap Production</strong>
                      <span className={`arrow ${isDropdownOpen("scrapProduction") ? "open" : ""}`}> ▶</span>
                    </div>
                    <div className={`nested-dropdown-menu ${isDropdownOpen("scrapProduction") ? "show" : ""}`}>
                      {permissions.Production.includes("Scrap/Rejection Entry") && (
                        <Link className="dropdown-item" to="/ScrapRejection">
                          Scrap/Rejection Entry
                        </Link>
                      )}
                      {permissions.Production.includes("Scrap/Rejection Report") && (
                        <Link className="dropdown-item" to="/ScrapRejectionReport">
                          Scrap/Rejection Report
                        </Link>
                      )}
                      {permissions.Production.includes("FG Scrap/Rejection Entry") && (
                        <Link className="dropdown-item" to="/ScrapRejectionEntry">
                          FG Scrap/Rejection Entry
                        </Link>
                      )}
                      {permissions.Production.includes("FG Scrap/Rejection Report") && (
                        <Link className="dropdown-item" to="/FGScrapRejectionReport">
                          FG Scrap/Rejection Report
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {permissions.Production.includes("Material Idle Time") && (
                  <Link className="dropdown-item" to="/MachineIdleTime">
                    Material Idle Time
                  </Link>
                )}

                {permissions.Production.includes("Breakdown Time Entry") && (
                  <Link className="dropdown-item" to="/BreakdownTimeEntry">
                    Breakdown Time Entry
                  </Link>
                )}

                {permissions.Production.includes("Breakdown Time Report") && (
                  <Link className="dropdown-item" to="/BreakdownTimeReport">
                    Breakdown Time Report
                  </Link>
                )}

                {permissions.Production.includes("Contractor Payment") && (
                  <Link className="dropdown-item" to="/ContractorReport">
                    Contractor Payment
                  </Link>
                )} */}

                {permissions.Production.includes("P Report") && (
                  <div className="nested-dropdown">
                    <div
                      className="dropdown-item nested-toggle"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDropdownToggle("productionReport")
                      }}
                    >
                      <strong>Report</strong>
                      <span className={`arrow ${isDropdownOpen("productionReport") ? "open" : ""}`}> ▶</span>
                    </div>
                    <div className={`nested-dropdown-menu ${isDropdownOpen("productionReport") ? "show" : ""}`}>
                      {permissions.Production.includes("Rejection Report") && (
                        <Link className="dropdown-item" to="/ProReport">
                          Rejection Report
                        </Link>
                      )}
                      {permissions.Production.includes("Rework Report") && (
                        <Link className="dropdown-item" to="/ReworkReport">
                          Rework Report
                        </Link>
                      )}
                      {/* {permissions.Production.includes("Default Ideal Time Report") && (
                        <Link className="dropdown-item" to="/MachineDefaultidle">
                          Default Idle Time Report
                        </Link>
                      )}
                      {permissions.Production.includes("Breakdown Analysis Report") && (
                        <Link className="dropdown-item" to="/BreakdownAnalysis">
                          Breakdown Analysis Report
                        </Link>
                      )}
                      {permissions.Production.includes("Cycle Time Report") && (
                        <Link className="dropdown-item" to="/CycleTime1">
                          Cycle Time Report
                        </Link>
                      )}
                      {permissions.Production.includes("Operator Performance Report") && (
                        <Link className="dropdown-item" to="/OperatorReport">
                          Operator Performance Report
                        </Link>
                      )} */}
                    </div>
                  </div>
                )}
              </div>
            </li>
          )}

          {/* //////////////////////////////     Production V2   /////////////////////////// */}
          {/* <li className="dropdown-container">
            <div className="dropdown-toggle" onClick={() => handleDropdownToggle("productionV2")}>
              <MdOutlineProductionQuantityLimits />
              <span>Production V2</span>
              <span className={`dropdown-arrow ${isDropdownOpen("productionV2") ? "open" : ""}`}>  </span>
            </div>
            <div className={`custom-dropdown-menu ${isDropdownOpen("productionV2") ? "show" : ""}`}>
              <Link className="dropdown-item" to="/WorkOrderEntryV2">
                Work Order Entry V2
              </Link>

              <Link className="dropdown-item" to="/WorkOrderReportV2">
                Work Order Report V2
              </Link>

              <div className="nested-dropdown">
                <div
                  className="dropdown-item nested-toggle"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDropdownToggle("contractorWorkOrder")
                  }}
                >
                  Contractor Work Order
                  <span className={`arrow ${isDropdownOpen("contractorWorkOrder") ? "open" : ""}`}> ▶</span>
                </div>
                <div className={`nested-dropdown-menu ${isDropdownOpen("contractorWorkOrder") ? "show" : ""}`}>
                  <Link className="dropdown-item" to="/ContractorWorkOrder">
                    Contractor Work Order Entry
                  </Link>
                  <Link className="dropdown-item" to="/ContractorWorkOrderList">
                    Contractor Work Order List
                  </Link>
                </div>
              </div>

              <Link className="dropdown-item" to="/WorkOrderStatusEntry">
                Work Order Status Entry
              </Link>

              <Link className="dropdown-item" to="/PunchingLaserSchedule">
                Punching And Laser Schedule
              </Link>

              <Link className="dropdown-item" to="/PunchingProgram">
                Punching Program
              </Link>

              <Link className="dropdown-item" to="/PowerPress">
                Power Press
              </Link>
            </div>
          </li> */}

          {/* //////////////////////////////     Quality       /////////////////////////// */}
          {permissions?.Quality?.length > 0 && (
            <li className="dropdown-container">
              <div className="dropdown-toggle" onClick={() => handleDropdownToggle("quality")}>
                <MdEqualizer />
                <span>Quality</span>
                <span className={`dropdown-arrow ${isDropdownOpen("quality") ? "open" : ""}`}>  </span>
              </div>
              <div className={`custom-dropdown-menu ${isDropdownOpen("quality") ? "show" : ""}`}>
                {permissions.Quality.includes("Quality Planning") && (
                  <Link className="dropdown-item" to="/QualityPlan">
                    Quality Planning
                  </Link>
                )}

                {permissions.Quality.includes("Purchase GRN QC") && (
                  <div className="nested-dropdown">
                    <div
                      className="dropdown-item nested-toggle"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDropdownToggle("purchaseGRNQC")
                      }}
                    >
                      Purchase GRN QC
                      <span className={`arrow ${isDropdownOpen("purchaseGRNQC") ? "open" : ""}`}> ▶</span>
                    </div>
                    <div className={`nested-dropdown-menu ${isDropdownOpen("purchaseGRNQC") ? "show" : ""}`}>
                      {permissions.Quality.includes("Pending QC List") && (
                        <Link className="dropdown-item" to="/PandingQCList">
                          Pending QC List
                        </Link>
                      )}
                      {permissions.Quality.includes("Inward Test Certificate") && (
                        <Link className="dropdown-item" to="/InwardTestCertificate">
                          Inward Test Certificate
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {permissions.Quality.includes("Subcon / JobWork GRN QC") && (
                  <div className="nested-dropdown">
                    <div
                      className="dropdown-item nested-toggle"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDropdownToggle("subconJobworkGRNQC")
                      }}
                    >
                      Subcon / JobWork GRN QC
                      <span className={`arrow ${isDropdownOpen("subconJobworkGRNQC") ? "open" : ""}`}> ▶</span>
                    </div>
                    <div className={`nested-dropdown-menu ${isDropdownOpen("subconJobworkGRNQC") ? "show" : ""}`}>
                      {permissions.Quality.includes("Pending QC Inward") && (
                        <Link className="dropdown-item" to="/PaddingQCInward">
                          Pending QC Inward
                        </Link>
                      )}
                      {permissions.Quality.includes("Inward Inspection List") && (
                        <Link className="dropdown-item" to="/InwardQCList">
                          Inward Inspection List
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {permissions.Quality.includes("Inprocess QC") && (
                  <div className="nested-dropdown">
                    <div
                      className="dropdown-item nested-toggle"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDropdownToggle("inprocessQC")
                      }}
                    >
                      Inprocess QC
                      <span className={`arrow ${isDropdownOpen("inprocessQC") ? "open" : ""}`}> ▶</span>
                    </div>
                    <div className={`nested-dropdown-menu ${isDropdownOpen("inprocessQC") ? "show" : ""}`}>
                      {permissions.Quality.includes("Inprocess Inspection") && (
                        <Link className="dropdown-item" to="/InprocessInspection">
                          Inprocess Inspection
                        </Link>
                      )}
                      {permissions.Quality.includes("Inprocess Inspection List") && (
                        <Link className="dropdown-item" to="/InprocessInspectionList">
                          Inprocess Inspection List
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {permissions.Quality.includes("Sales Return QC") && (
                  <div className="nested-dropdown">
                    <div
                      className="dropdown-item nested-toggle"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDropdownToggle("salesReturnQC")
                      }}
                    >
                      Sales Return QC
                      <span className={`arrow ${isDropdownOpen("salesReturnQC") ? "open" : ""}`}> ▶</span>
                    </div>
                    <div className={`nested-dropdown-menu ${isDropdownOpen("salesReturnQC") ? "show" : ""}`}>
                      {permissions.Quality.includes("Sales Return QC Pending List") && (
                        <Link className="dropdown-item" to="/PaddingSalesQC">
                          Sales Return QC Pending List
                        </Link>
                      )}
                      {permissions.Quality.includes("Sales Return QC List") && (
                        <Link className="dropdown-item" to="/SalesQCList">
                          Sales Return QC List
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {/* {permissions.Quality.includes("Gauges And Instruction Calibration") && (
                  <Link className="dropdown-item" to="/GaugesCalibration">
                    Gauges and Instruction Calibration
                  </Link>
                )}

                {permissions.Quality.includes("Heat Code Register") && (
                  <Link className="dropdown-item" to="/HeatCodeRegister">
                    Heat Code Register
                  </Link>
                )}

                {permissions.Quality.includes("DTC - Dispatch Test Certificate") && (
                  <Link className="dropdown-item" to="/TestCertificateList">
                    DTC - Dispatch Test Certificate
                  </Link>
                )}

                {permissions.Quality.includes("PDI - Pre Dispatch Inspection") && (
                  <Link className="dropdown-item" to="/PDIList">
                    PDI - Pre Dispatch Inspection
                  </Link>
                )}

                {permissions.Quality.includes("First Piece Approval") && (
                  <Link className="dropdown-item" to="/FirstPieceApproval">
                    First Piece Approval
                  </Link>
                )}

                {permissions.Quality.includes("Set Up Approval") && (
                  <Link className="dropdown-item" to="/NewSetupApproval">
                    Setup Approval
                  </Link>
                )}

                {permissions.Quality.includes("Hot Inspection") && (
                  <Link className="dropdown-item" to="/HotInspectionList">
                    Hot Inspection
                  </Link>
                )}

                {permissions.Quality.includes("Sampling Plan") && (
                  <Link className="dropdown-item" to="/SamplingPlan">
                    Sampling Plan
                  </Link>
                )}

                {permissions.Quality.includes("Customer Complaint") && (
                  <div className="nested-dropdown">
                    <div
                      className="dropdown-item nested-toggle"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDropdownToggle("customerComplaint")
                      }}
                    >
                      Customer Complaint
                      <span className={`arrow ${isDropdownOpen("customerComplaint") ? "open" : ""}`}> ▶</span>
                    </div>
                    <div className={`nested-dropdown-menu ${isDropdownOpen("customerComplaint") ? "show" : ""}`}>
                      {permissions.Quality.includes("Customer Complaint Entry") && (
                        <Link className="dropdown-item" to="/CustomerComplaintEntry">
                          Customer Complaint Entry
                        </Link>
                      )}
                      {permissions.Quality.includes("Customer Complaint Authorization") && (
                        <Link className="dropdown-item" to="/CustomerComplaintAuth">
                          Customer Complaint Authorization
                        </Link>
                      )}
                      {permissions.Quality.includes("Customer Complaint List") && (
                        <Link className="dropdown-item" to="/CustomerComplaintList">
                          Customer Complaint List
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {permissions.Quality.includes("Test Master") && (
                  <div className="nested-dropdown">
                    <div
                      className="dropdown-item nested-toggle"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDropdownToggle("testMaster")
                      }}
                    >
                      Test Master
                      <span className={`arrow ${isDropdownOpen("testMaster") ? "open" : ""}`}> ▶</span>
                    </div>
                    <div className={`nested-dropdown-menu ${isDropdownOpen("testMaster") ? "show" : ""}`}>
                      {permissions.Quality.includes("Test Report") && (
                        <Link className="dropdown-item" to="/TestReportList">
                          Test Report
                        </Link>
                      )}
                      {permissions.Quality.includes("Test Master") && (
                        <Link className="dropdown-item" to="/TestMasterNew">
                          Test Master
                        </Link>
                      )}
                      {permissions.Quality.includes("Test Master List") && (
                        <Link className="dropdown-item" to="/TestMasterList">
                          Test Master List
                        </Link>
                      )}
                    </div>
                  </div>
                )} */}
              </div>
            </li>
          )}

          {/* //////////////////////////////     Planning       /////////////////////////// */}
          {permissions?.Planning?.length > 0 && (
            <li className="dropdown-container">
              <div className="dropdown-toggle" onClick={() => handleDropdownToggle("planning")}>
                <MdOutlineProductionQuantityLimits />
                <span>Planning</span>
                <span className={`dropdown-arrow ${isDropdownOpen("planning") ? "open" : ""}`}>  </span>
              </div>
              <div className={`custom-dropdown-menu ${isDropdownOpen("planning") ? "show" : ""}`}>
                {/* {permissions.Planning.includes("Manufacturing Order") && (
                  <Link className="dropdown-item" to="/ManufacturingOrder">
                    Manufacturing Order
                  </Link>
                )} */}

                {permissions.Planning.includes("Production Schedule") && (
                  <Link className="dropdown-item" to="/ProductionSchedule">
                    Production Schedule
                  </Link>
                )}

                {permissions.Planning.includes("Min Max Planning") && (
                  <Link className="dropdown-item" to="/MinMaxPlanning">
                    Min Max Planning
                  </Link>
                )}

                {/* <Link className="dropdown-item" to="/DispatchPlanSetup">
                  Dispatch Plan Setup
                </Link> */}



                {permissions.Planning.includes("Daily Dispatch Plan") && (
                  <Link className="dropdown-item" to="/DailyDispatchPlan">
                    Daily Dispatch Plan
                  </Link>
                )}

                {/* {permissions.Planning.includes("Business Plan") && (
                  <Link className="dropdown-item" to="/BusinessPlan">
                    Business Plan
                  </Link>
                )}

                {permissions.Planning.includes("Upcoming Dispatch List") && (
                  <Link className="dropdown-item" to="/UpcomingDispatchList">
                    Upcoming Dispatch List
                  </Link>
                )}

                {permissions.Planning.includes("Capacity Planning") && (
                  <Link className="dropdown-item" to="/CapacityPlanning">
                    Capacity Planning
                  </Link>
                )}

                {permissions.Planning.includes("Costing") && (
                  <Link className="dropdown-item" to="/Costing">
                    Costing
                  </Link>
                )}

                {permissions.Planning.includes("Vendor Schedule") && (
                  <div className="nested-dropdown">
                    <div
                      className="dropdown-item nested-toggle"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDropdownToggle("vendorSchedule")
                      }}
                    >
                      Vendor Schedule
                      <span className={`arrow ${isDropdownOpen("vendorSchedule") ? "open" : ""}`}> ▶</span>
                    </div>
                    <div className={`nested-dropdown-menu ${isDropdownOpen("vendorSchedule") ? "show" : ""}`}>
                      <Link className="dropdown-item" to="/ScheduleSetup">
                        Schedule Setup
                      </Link>
                      <Link className="dropdown-item" to="/ScheduleStatusGenerate">
                        Schedule Status/Generate
                      </Link>
                    </div>
                  </div>
                )} */}
              </div>
            </li>
          )}

          {/* //////////////////////////////     Sales       /////////////////////////// */}
          {permissions?.Sales?.length > 0 && (
            <li className="dropdown-container">
              <div className="dropdown-toggle" onClick={() => handleDropdownToggle("sales")}>
                <SiSalesforce />
                <span>Sales</span>
                <span className={`dropdown-arrow ${isDropdownOpen("sales") ? "open" : ""}`}>  </span>
              </div>
              <div className={`custom-dropdown-menu ${isDropdownOpen("sales") ? "show" : ""}`}>
                {permissions.Sales.includes("E-Invoicing") && (
                  <div className="nested-dropdown">
                    <div
                      className="dropdown-item nested-toggle"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDropdownToggle("eInvoicing")
                      }}
                    >
                      E-Invoicing
                      <span className={`arrow ${isDropdownOpen("eInvoicing") ? "open" : ""}`}> ▶</span>
                    </div>
                    <div className={`nested-dropdown-menu ${isDropdownOpen("eInvoicing") ? "show" : ""}`}>
                      {permissions.Sales.includes("GST Sales") && (
                        <Link className="dropdown-item" to="/GSTsales1">
                          GST Sales
                        </Link>
                      )}
                      {permissions.Sales.includes("JobWork Sales") && (
                        <Link className="dropdown-item" to="/JobWorkSales">
                          JobWork Sales
                        </Link>
                      )}
                      {permissions.Sales.includes("Debit Note") && (
                        <Link className="dropdown-item" to="/DebitNote">
                          Debit Note
                        </Link>
                      )}
                      {permissions.Sales.includes("Credit Note") && (
                        <Link className="dropdown-item" to="/CreditNote">
                          Credit Note
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {permissions.Sales.includes("Customer Sales Order") && (
                  <Link className="dropdown-item" to="/NewSalesOrder">
                    Customer Sales Order
                  </Link>
                )}

                {permissions.Sales.includes("Customer Sales Order Amendment") && (
                  <Link className="dropdown-item" to="/SalesOrderAmendList">
                    Customer Sales Order Amendment
                  </Link>
                )}

                {/* {permissions.Sales.includes("Schedule Sales Order") && (
                  <Link className="dropdown-item" to="/SacheduleSalesNew">
                    Schedule Sales Order
                  </Link>
                )}

                {permissions.Sales.includes("Customer Sales Order Status") && (
                  <Link className="dropdown-item" to="/SalesOrderStatus">
                    Customer Sales Order Status
                  </Link>
                )} */}

                {permissions.Sales.includes("GST Invoice") && (
                  <Link className="dropdown-item" to="/NewInvoice">
                    GST Invoice
                  </Link>
                )}

                {permissions.Sales.includes("New Proforma Invoice") && (
                  <Link className="dropdown-item" to="/NewProformaInvoice">
                    New Proforma Invoice
                  </Link>
                )}

                {permissions.Sales.includes("GST JobWork") && (
                  <div className="nested-dropdown">
                    <div
                      className="dropdown-item nested-toggle"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDropdownToggle("gstJobwork")
                      }}
                    >
                      GST JobWork
                      <span className={`arrow ${isDropdownOpen("gstJobwork") ? "open" : ""}`}> ▶</span>
                    </div>
                    <div className={`nested-dropdown-menu ${isDropdownOpen("gstJobwork") ? "show" : ""}`}>
                      {permissions.Sales.includes("GST JobWork Invoice") && (
                        <Link className="dropdown-item" to="/GSTJobworkInvoice">
                          GST JobWork Invoice
                        </Link>
                      )}
                      {/* {permissions.Sales.includes("GST JobWork DC Return") && (
                        <Link className="dropdown-item" to="/GSTJobworkDCreturn">
                          GST JobWork DC Return
                        </Link>
                      )} */}
                    </div>
                  </div>
                )}

                {permissions.Sales.includes("OutWard 57F4 Challan") && (
                  <Link className="dropdown-item" to="/OutwardChallan">
                    OutWard 57F4 Challan
                  </Link>
                )}

                {permissions.Sales.includes("Credit / Debit Note") && (
                  <div className="nested-dropdown">
                    <div
                      className="dropdown-item nested-toggle"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDropdownToggle("creditDebitNote")
                      }}
                    >
                      Credit / Debit Note
                      <span className={`arrow ${isDropdownOpen("creditDebitNote") ? "open" : ""}`}> ▶</span>
                    </div>
                    <div className={`nested-dropdown-menu ${isDropdownOpen("creditDebitNote") ? "show" : ""}`}>
                      {permissions.Sales.includes("Purchase Debit Note") && (
                        <Link className="dropdown-item" to="/PurchaseDabitNote">
                          Purchase Debit Note
                        </Link>
                      )}
                      {permissions.Sales.includes("Credit / Debit Note") && (
                        <Link className="dropdown-item" to="/NewDabitNote">
                          Sales Rate Diff Debit Note
                        </Link>
                      )}
                      {permissions.Sales.includes("Credit / Debit Note") && (
                        <Link className="dropdown-item" to="/JobWorkRateDiff">
                          Jobwork Rate Diff Debit Note
                        </Link>
                      )}
                      {permissions.Sales.includes("Credit Note Entry") && (
                        <Link className="dropdown-item" to="/CreditNotie">
                          Credit Note Entry
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {permissions.Sales.includes("GST Sales Return") && (
                  <Link className="dropdown-item" to="/GSTSalesReturn1">
                    GST Sales Return
                  </Link>
                )}

                {/* {permissions.Sales.includes("Material GatePass") && (
                  <div className="nested-dropdown">
                    <div
                      className="dropdown-item nested-toggle"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDropdownToggle("materialGatePass")
                      }}
                    >
                      Material GatePass
                      <span className={`arrow ${isDropdownOpen("materialGatePass") ? "open" : ""}`}> ▶</span>
                    </div>
                    <div className={`nested-dropdown-menu ${isDropdownOpen("materialGatePass") ? "show" : ""}`}>
                      {permissions.Sales.includes("Material GatePass New") && (
                        <Link className="dropdown-item" to="/MaterialGatepassNew">
                          Material GatePass New
                        </Link>
                      )}
                      {permissions.Sales.includes("Pending Material GatePass") && (
                        <Link className="dropdown-item" to="/PendingMaterialGatepassList">
                          Pending Material GatePass
                        </Link>
                      )}
                      {permissions.Sales.includes("Material GatePass List") && (
                        <Link className="dropdown-item" to="/MaterialGatepassList">
                          Material GatePass List
                        </Link>
                      )}
                    </div>
                  </div>
                )} */}

                {permissions.Sales && (
                  <div className="nested-dropdown">
                    <div
                      className="dropdown-item nested-toggle"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDropdownToggle("salesReport")
                      }}
                    >
                      Report
                      <span className={`arrow ${isDropdownOpen("salesReport") ? "open" : ""}`}>▶</span>
                    </div>
                    <div className={`nested-dropdown-menu ${isDropdownOpen("salesReport") ? "show" : ""}`}>
                      {permissions.Sales && (
                        <Link className="dropdown-item" to="/CustomerSalesOrderList">
                          Customer Sales Order List
                        </Link>
                      )}

                    </div>
                  </div>
                )}
              </div>
            </li>
          )}

        </ul>
      </div>
    </div>
  )
}

export default SideNav
