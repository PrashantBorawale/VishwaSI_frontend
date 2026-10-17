"use client"

import React, { useState, useEffect, useCallback } from "react"
import axios from "axios"
import NavBar from "../../NavBar/NavBar.js"
import SideNav from "../../SideNav/SideNav.js"
import { FaPlus, FaTrash, FaTimes, FaSave } from "react-icons/fa"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./ReworkEntry.css"

const ReworkEntry = () => {
  const [sideNavOpen, setSideNavOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("prod-details")

  // Header State
  const [plant, setPlant] = useState("VISHWA S.I.")
  const [series, setSeries] = useState("REWORK PRODUC")

  // Tab 1: Prod Details Form State (Empty initial values as requested)
  const [headerPrefix, setHeaderPrefix] = useState("REWPRO")
  const [reworkNo, setReworkNo] = useState("")
  const [reworkDate, setReworkDate] = useState("")
  const [reworkTimeH, setReworkTimeH] = useState("")
  const [reworkTimeM, setReworkTimeM] = useState("")
  const [machine, setMachine] = useState("")

  // Auto-generate Rework No from API on page load / series change
  const fetchReworkNo = useCallback(async () => {
    try {
      const token = localStorage.getItem("token")
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const res = await axios.get("https://sellerp-backend.onrender.com/Production/generate-rework-no/", { headers })
      const data = res.data

      // Support various response formats (e.g. { rework_no: "..." } or { next_rework_no: "..." } or string)
      let generatedNo = ""
      if (typeof data === "string") {
        generatedNo = data
      } else if (data?.rework_no) {
        generatedNo = data.rework_no
      } else if (data?.next_rework_no) {
        generatedNo = data.next_rework_no
      } else if (data?.data) {
        generatedNo = data.data
      }

      if (generatedNo) {
        setReworkNo(generatedNo)
        toast.success(`Rework No generated successfully: ${generatedNo}`)
      } else {
        toast.info("Rework No generated successfully!")
      }
    } catch (err) {
      console.error("Error generating rework number:", err)
      toast.error("Failed to generate Rework No.")
    }
  }, [])

  useEffect(() => {
    fetchReworkNo()
  }, [fetchReworkNo])

  const [hasWorkOrder, setHasWorkOrder] = useState(false)
  const [workOrder, setWorkOrder] = useState("")

  const [itemCode, setItemCode] = useState("")
  const [partCode, setPartCode] = useState("")
  const [bomOperations, setBomOperations] = useState([])

  // Item Search State
  const [itemSearchResults, setItemSearchResults] = useState([])
  const [showItemDropdown, setShowItemDropdown] = useState(false)
  const [isSearchingItem, setIsSearchingItem] = useState(false)

  const handleItemSearch = async (val) => {
    setItemCode(val)
    if (!val || !val.trim()) {
      setItemSearchResults([])
      setShowItemDropdown(false)
      setBomOperations([])
      setPartCode("")
      return
    }

    try {
      setIsSearchingItem(true)
      const res = await axios.get(`https://sellerp-backend.onrender.com/Production/api/item-dropdown/?q=${encodeURIComponent(val)}`)
      const data = res.data || []
      
      // If user cleared the input while request was in-flight, do not show dropdown
      setItemCode((currentVal) => {
        if (!currentVal || !currentVal.trim()) {
          setItemSearchResults([])
          setShowItemDropdown(false)
        } else {
          setItemSearchResults(data)
          setShowItemDropdown(data.length > 0)
        }
        return currentVal
      })
    } catch (err) {
      console.error("Error fetching items:", err)
      setItemSearchResults([])
      setShowItemDropdown(false)
    } finally {
      setIsSearchingItem(false)
    }
  }

  const handleSelectItem = async (item) => {
    // Format: part_no | Part_Code | Name_Description
    const formatted = `${item.part_no || ""} | ${item.Part_Code || ""} | ${item.Name_Description || ""}`
    setItemCode(formatted)
    setShowItemDropdown(false)
    setItemSearchResults([])

    const selectedPartCode = item.Part_Code
    if (selectedPartCode) {
      try {
        const bomRes = await axios.get(
          `https://sellerp-backend.onrender.com/Production/api/bom-by-partcode/?part_code=${encodeURIComponent(selectedPartCode)}`
        )
        const ops = bomRes.data || []
        setBomOperations(ops)
        if (ops.length > 0) {
          // Format: OPNo | PartCode
          const firstOpDisplay = `${ops[0].OPNo} | ${ops[0].PartCode}`
          setPartCode(firstOpDisplay)
        } else {
          setPartCode(selectedPartCode)
        }
      } catch (err) {
        console.error("Error fetching BOM operations for part_code:", err)
        setBomOperations([])
        setPartCode(selectedPartCode)
      }
    } else {
      setBomOperations([])
      setPartCode("")
    }
  }

  const [heatCode, setHeatCode] = useState("")
  const [reworkToOk, setReworkToOk] = useState("")
  const [rejectToOk, setRejectToOk] = useState("")

  // Prod Details Table List
  const [prodTable, setProdTable] = useState([])

  // Bottom textareas and operators (Empty initial values as requested)
  const [reasonForRework, setReasonForRework] = useState("")
  const [qualityRemark, setQualityRemark] = useState("")
  const [operatorInput, setOperatorInput] = useState("")
  const [operatorsList, setOperatorsList] = useState([])

  // Tab 2: Consumption Details State (Empty initial values as requested)
  const [consumptionItem, setConsumptionItem] = useState("")
  const [consumptionStock, setConsumptionStock] = useState("")
  const [consumptionQty, setConsumptionQty] = useState("")

  // Consumption Table List
  const [consumptionTable, setConsumptionTable] = useState([])

  const toggleSideNav = () => {
    setSideNavOpen((prev) => !prev)
  }

  // Handle Tab 1 Add Row
  const handleAddProdRow = () => {
    if (!itemCode && !reworkToOk && !rejectToOk && !heatCode && !partCode) {
      toast.warning("Please enter item or qty details to add.")
      return
    }
    const newRow = {
      id: prodTable.length + 1,
      item_des: itemCode || "",
      bom_part: partCode || "",
      heat_code: heatCode || "",
      rework_to_ok: reworkToOk || "0.00",
      reject_to_ok: rejectToOk || "0.00",
      reworkToRejectQty: "",
    }
    setProdTable([...prodTable, newRow])
    toast.success("Item added to table!")

    // Clear item inputs after adding
    setItemCode("")
    setPartCode("")
    setHeatCode("")
    setReworkToOk("")
    setRejectToOk("")
  }

  // Handle Tab 1 Delete Row (Local removal and backend delete if saved ID exists)
  const handleDeleteProdRow = async (index) => {
    const itemToDelete = prodTable[index]
    if (itemToDelete?.backend_id) {
      try {
        const token = localStorage.getItem("token")
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        await axios.delete(`https://sellerp-backend.onrender.com/Production/api/rework-production/${itemToDelete.backend_id}/`, { headers })
        toast.success("Item deleted successfully from backend!")
      } catch (err) {
        console.error("Error deleting item:", err)
        toast.error("Failed to delete item from backend.")
      }
    } else {
      toast.info("Item removed from table.")
    }
    setProdTable(prodTable.filter((_, idx) => idx !== index))
  }

  // Handle Operator Add
  const handleAddOperator = () => {
    if (operatorInput.trim()) {
      setOperatorsList([...operatorsList, operatorInput.trim()])
      setOperatorInput("")
    }
  }

  // Handle Operator Delete
  const handleDeleteOperator = (index) => {
    setOperatorsList(operatorsList.filter((_, idx) => idx !== index))
  }

  // Handle Tab 2 Add Row
  const handleAddConsumptionRow = () => {
    if (!consumptionItem && !consumptionQty) {
      toast.warning("Please enter consumption item or qty to add.")
      return
    }
    const newRow = {
      id: consumptionTable.length + 1,
      itemDesc: consumptionItem || "",
      heatCode: consumptionStock || "",
      qty: consumptionQty || "",
    }
    setConsumptionTable([...consumptionTable, newRow])
  }

  // Handle Tab 2 Delete Row
  const handleDeleteConsumptionRow = (index) => {
    setConsumptionTable(consumptionTable.filter((_, idx) => idx !== index))
  }

  // Save handler - POST API integration
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSave = async (e) => {
    if (e) e.preventDefault()

    // Form validation
    if (!reworkNo && !reworkDate) {
      toast.warning("Please provide at least Rework No or Date before saving.")
      return
    }

    // Format rework time as HH:MM:00
    let formattedTime = ""
    if (reworkTimeH || reworkTimeM) {
      const hh = (reworkTimeH || "00").toString().padStart(2, "0")
      const mm = (reworkTimeM || "00").toString().padStart(2, "0")
      formattedTime = `${hh}:${mm}:00`
    }

    // Prepare items list from prodTable (or current fields if table is empty)
    let payloadItems = prodTable.map((row) => ({
      item_des: row.item_des || "",
      bom_part: row.bom_part || "",
      heat_code: row.heat_code || "",
      rework_to_ok: row.rework_to_ok || "0.00",
      reject_to_ok: row.reject_to_ok || "0.00",
    }))

    // If user entered details in top fields but didn't click ADD, auto-include
    if (payloadItems.length === 0 && (itemCode || partCode || reworkToOk || rejectToOk)) {
      payloadItems = [
        {
          item_des: itemCode || "",
          bom_part: partCode || "",
          heat_code: heatCode || "",
          rework_to_ok: reworkToOk || "0.00",
          reject_to_ok: rejectToOk || "0.00",
        },
      ]
    }

    const payload = {
      rework_no: reworkNo,
      rework_date: reworkDate || null,
      rework_time: formattedTime || null,
      machine: machine || "",
      work_order: workOrder || "",
      reason_for_rework: reasonForRework || "",
      quality_remark: qualityRemark || "",
      operator: operatorsList.length > 0 ? operatorsList.join(", ") : (operatorInput || ""),
      items: payloadItems,
    }

    try {
      setIsSubmitting(true)
      const token = localStorage.getItem("token")
      const headers = {
        "Content-Type": "application/json",
      }
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      const response = await axios.post(
        "https://sellerp-backend.onrender.com/Production/api/rework-production/",
        payload,
        { headers }
      )

      if (response.status === 200 || response.status === 201) {
        toast.success("Rework Production entry saved successfully!")

        // Reset form fields
        setReworkNo("")
        setReworkDate("")
        setReworkTimeH("")
        setReworkTimeM("")
        setMachine("")
        setHasWorkOrder(false)
        setWorkOrder("")
        setItemCode("")
        setPartCode("")
        setHeatCode("")
        setReworkToOk("")
        setRejectToOk("")
        setProdTable([])
        setReasonForRework("")
        setQualityRemark("")
        setOperatorInput("")
        setOperatorsList([])
        setConsumptionItem("")
        setConsumptionStock("")
        setConsumptionQty("")
        setConsumptionTable([])

        // Auto-generate fresh rework number for next entry
        fetchReworkNo()
      } else {
        toast.error("Failed to save Rework Production data.")
      }
    } catch (error) {
      console.error("Error saving rework production:", error)
      const errorMsg = error?.response?.data?.message || error?.response?.data?.detail || error.message || "Failed to save data."
      toast.error(`Error: ${errorMsg}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="ReworkEntryMaster">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="Main-NavBar">
        <NavBar toggleSideNav={toggleSideNav} />
        <SideNav sideNavOpen={sideNavOpen} toggleSideNav={toggleSideNav} />
        <main className={`main-content ${sideNavOpen ? "shifted" : ""}`}>
          <div className="container-fluid p-0">
            {/* Header: Clean title with Plant & Series; Header Button Removed as requested */}
            <div className="ReworkEntry-header d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div className="d-flex align-items-center gap-4 flex-wrap">
                <h5 className="header-title mb-0">Rework Production</h5>

                <div className="d-flex align-items-center gap-2">
                  <span className="fw-medium text-secondary" style={{ fontSize: "0.85rem" }}>Plant:</span>
                  <select
                    className="form-select form-select-sm"
                    value={plant}
                    onChange={(e) => setPlant(e.target.value)}
                    style={{ width: "150px" }}
                  >
                    <option value="VISHWA S.I.">VISHWA S.I.</option>
                  </select>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <span className="fw-medium text-secondary" style={{ fontSize: "0.85rem" }}>Series:</span>
                  <select
                    className="form-select form-select-sm"
                    value={series}
                    onChange={(e) => setSeries(e.target.value)}
                    style={{ width: "180px" }}
                  >
                    <option value="REWORK PRODUC">REWORK PRODUC</option>
                    <option value="SERIES A">SERIES A</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Main Content Card */}
            <div className="ReworkEntry-card">
              {/* Navigation Tabs */}
              <ul className="nav nav-tabs">
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${activeTab === "prod-details" ? "active" : ""}`}
                    onClick={() => setActiveTab("prod-details")}
                  >
                    Prod Details
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${activeTab === "consumption-details" ? "active" : ""}`}
                    onClick={() => setActiveTab("consumption-details")}
                  >
                    Consumption Details
                  </button>
                </li>
              </ul>

              {/* Tab 1: Prod Details */}
              {activeTab === "prod-details" && (
                <div>
                  {/* Top Form Fields with labels on top */}
                  <div className="row g-3 mb-3">
                    {/* Rework No */}
                    <div className="col-md-3">
                      <label>Rework No :</label>
                      <div className="d-flex gap-1">
                        <input
                          type="text"
                          className="form-control"
                          value={headerPrefix}
                          onChange={(e) => setHeaderPrefix(e.target.value)}
                          style={{ width: "85px" }}
                          readOnly
                        />
                        <input
                          type="text"
                          className="form-control rework-no-highlight"
                          value={reworkNo}
                          onChange={(e) => setReworkNo(e.target.value)}
                          placeholder="Rework No"
                        />
                      </div>
                    </div>

                    {/* Rework Date */}
                    <div className="col-md-3">
                      <label>Rework Date :</label>
                      <input
                        type="date"
                        className="form-control"
                        value={reworkDate}
                        onChange={(e) => setReworkDate(e.target.value)}
                      />
                    </div>

                    {/* Rework Time */}
                    <div className="col-md-3">
                      <label>Rework Time :</label>
                      <div className="d-flex align-items-center gap-1">
                        <input
                          type="text"
                          className="form-control text-center"
                          placeholder="HH"
                          value={reworkTimeH}
                          onChange={(e) => setReworkTimeH(e.target.value)}
                          style={{ width: "50px" }}
                        />
                        <span className="text-danger fw-bold">*</span>
                        <span>:</span>
                        <input
                          type="text"
                          className="form-control text-center"
                          placeholder="MM"
                          value={reworkTimeM}
                          onChange={(e) => setReworkTimeM(e.target.value)}
                          style={{ width: "50px" }}
                        />
                        <span className="text-danger fw-bold">*</span>
                      </div>
                    </div>

                    {/* Machine */}
                    <div className="col-md-3">
                      <label>Machine :</label>
                      <select
                        className="form-select"
                        value={machine}
                        onChange={(e) => setMachine(e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="M01">M01</option>
                        <option value="M02">M02</option>
                        <option value="Machine 1">Machine 1</option>
                      </select>
                    </div>

                    {/* Work Order Checkbox + Input */}
                    <div className="col-md-6">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <input
                          type="checkbox"
                          id="chkWO"
                          className="form-check-input mt-0"
                          checked={hasWorkOrder}
                          onChange={(e) => setHasWorkOrder(e.target.checked)}
                          style={{ cursor: "pointer" }}
                        />
                        <label htmlFor="chkWO" className="mb-0" style={{ cursor: "pointer" }}>
                          Work Order :
                        </label>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Select Work Order"
                        value={workOrder}
                        onChange={(e) => setWorkOrder(e.target.value)}
                      />
                    </div>

                    {/* Item Code & Part Code */}
                    <div className="col-md-4 position-relative">
                      <label>Item Code :</label>
                      <input
                        type="text"
                        className="form-control"
                        value={itemCode}
                        onChange={(e) => handleItemSearch(e.target.value)}
                        onFocus={() => {
                          if (itemCode && itemCode.trim() && itemSearchResults.length > 0) {
                            setShowItemDropdown(true)
                          }
                        }}
                        onBlur={() => {
                          setTimeout(() => setShowItemDropdown(false), 200)
                        }}
                        placeholder="Type to search items..."
                        autoComplete="off"
                      />
                      {showItemDropdown && itemCode && itemCode.trim() && itemSearchResults.length > 0 && (
                        <ul
                          className="dropdown-menu show w-100 shadow-sm"
                          style={{
                            maxHeight: "220px",
                            overflowY: "auto",
                            zIndex: 1050,
                            position: "absolute",
                            top: "100%",
                            left: 0,
                          }}
                        >
                          {itemSearchResults.map((item, idx) => {
                            const display = `${item.part_no || ""} | ${item.Part_Code || ""} | ${item.Name_Description || ""}`
                            return (
                              <li
                                key={idx}
                                className="dropdown-item"
                                style={{
                                  fontSize: "0.8rem",
                                  cursor: "pointer",
                                  whiteSpace: "normal",
                                  padding: "6px 10px",
                                }}
                                onMouseDown={() => handleSelectItem(item)}
                              >
                                {display}
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </div>

                    <div className="col-md-2">
                      <label>Part Code :</label>
                      {bomOperations.length > 0 ? (
                        <select
                          className="form-select"
                          value={partCode}
                          onChange={(e) => setPartCode(e.target.value)}
                        >
                          {bomOperations.map((op, idx) => {
                            const opDisplay = `${op.OPNo} | ${op.PartCode}`
                            return (
                              <option key={idx} value={opDisplay}>
                                {opDisplay}
                              </option>
                            )
                          })}
                        </select>
                      ) : (
                        <input
                          type="text"
                          className="form-control"
                          value={partCode}
                          onChange={(e) => setPartCode(e.target.value)}
                          placeholder="OPNo | PartCode"
                        />
                      )}
                    </div>

                    {/* Heat Code, Rework to Ok, Reject to Ok */}
                    <div className="col-md-4">
                      <label>Heat Code :</label>
                      <select
                        className="form-select"
                        value={heatCode}
                        onChange={(e) => setHeatCode(e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="HEAT001">HEAT001</option>
                        <option value="HEAT002">HEAT002</option>
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label>Rework to Ok :</label>
                      <input
                        type="text"
                        className="form-control"
                        value={reworkToOk}
                        onChange={(e) => setReworkToOk(e.target.value)}
                        placeholder="0"
                      />
                    </div>

                    <div className="col-md-3">
                      <label>Reject to Ok :</label>
                      <input
                        type="text"
                        className="form-control"
                        value={rejectToOk}
                        onChange={(e) => setRejectToOk(e.target.value)}
                        placeholder="0"
                      />
                    </div>

                    {/* ADD Button placed cleanly next to inputs */}
                    <div className="col-md-2 d-flex align-items-end">
                      <button
                        type="button"
                        className="vndrbtn w-100 justify-content-center"
                        onClick={handleAddProdRow}
                      >
                        <FaPlus /> ADD
                      </button>
                    </div>
                  </div>

                  {/* Table Section */}
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th className="text-nowrap" style={{ width: "4%" }}>Sr.</th>
                          <th className="text-nowrap" style={{ minWidth: "160px" }}>Item Desc</th>
                          <th className="text-nowrap" style={{ minWidth: "130px" }}>Part Code</th>
                          <th className="text-nowrap" style={{ minWidth: "110px" }}>Heat code</th>
                          <th className="text-nowrap" style={{ minWidth: "150px" }}>Rework to -&gt; Ok Qty</th>
                          <th className="text-nowrap" style={{ minWidth: "150px" }}>Reject to -&gt; Ok Qty</th>
                          <th className="text-nowrap" style={{ width: "6%" }} title="Delete Row Action">
                            <FaTrash style={{ marginRight: "4px", fontSize: "0.8rem" }} />
                            <span>Delete</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {prodTable.length > 0 ? (
                          prodTable.map((row, index) => (
                            <tr key={index}>
                              <td className="text-center">{row.id || index + 1}</td>
                              <td>{row.item_des}</td>
                              <td>{row.bom_part}</td>
                              <td>{row.heat_code}</td>
                              <td className="text-end">{row.rework_to_ok}</td>
                              <td className="text-end">{row.reject_to_ok}</td>
                              <td className="text-center">
                                <button
                                  type="button"
                                  className="btn btn-outline-danger btn-sm p-1"
                                  onClick={() => handleDeleteProdRow(index)}
                                  title="Delete row"
                                >
                                  <FaTrash style={{ fontSize: "0.75rem" }} />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center text-muted py-3">
                              No items added yet. Fill the details above and click ADD.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Bottom Area: Remarks & Operators */}
                  <div className="row g-3 mt-1">
                    <div className="col-md-4">
                      <label>Reason for Rework :</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={reasonForRework}
                        onChange={(e) => setReasonForRework(e.target.value)}
                        placeholder="Enter reason for rework"
                      ></textarea>
                    </div>

                    <div className="col-md-4">
                      <label>Quality Remark :</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={qualityRemark}
                        onChange={(e) => setQualityRemark(e.target.value)}
                        placeholder="Enter quality remark"
                      ></textarea>
                    </div>

                    <div className="col-md-4">
                      <label>Operator :</label>
                      <div className="d-flex gap-2 mb-2">
                        <input
                          type="text"
                          className="form-control"
                          value={operatorInput}
                          onChange={(e) => setOperatorInput(e.target.value)}
                          placeholder="Operator name"
                        />
                        <button
                          type="button"
                          className="btn-outline-erp text-nowrap"
                          onClick={handleAddOperator}
                        >
                          + Add&gt;&gt;
                        </button>
                      </div>

                      <div className="rework-operator-box">
                        {operatorsList.length > 0 ? (
                          operatorsList.map((op, idx) => (
                            <div key={idx} className="rework-operator-badge">
                              <span>{op}</span>
                              <FaTimes onClick={() => handleDeleteOperator(idx)} />
                            </div>
                          ))
                        ) : (
                          <div className="text-muted text-center pt-3" style={{ fontSize: "0.78rem" }}>
                            No operators added
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="mt-4 d-flex justify-content-end">
                    <button
                      type="button"
                      className="vndrbtn"
                      onClick={handleSave}
                      disabled={isSubmitting}
                    >
                      <FaSave /> {isSubmitting ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 2: Consumption Details */}
              {activeTab === "consumption-details" && (
                <div>
                  <div className="row g-3 mb-3">
                    <div className="col-md-5">
                      <label>Item :</label>
                      <input
                        type="text"
                        className="form-control"
                        value={consumptionItem}
                        onChange={(e) => setConsumptionItem(e.target.value)}
                        placeholder="Enter item"
                      />
                    </div>

                    <div className="col-md-3">
                      <label>Stock :</label>
                      <select
                        className="form-select"
                        value={consumptionStock}
                        onChange={(e) => setConsumptionStock(e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="S1">S1</option>
                        <option value="S2">S2</option>
                      </select>
                    </div>

                    <div className="col-md-2">
                      <label>Qty :</label>
                      <input
                        type="text"
                        className="form-control"
                        value={consumptionQty}
                        onChange={(e) => setConsumptionQty(e.target.value)}
                        placeholder="0"
                      />
                    </div>

                    <div className="col-md-2 d-flex align-items-end">
                      <button
                        type="button"
                        className="vndrbtn w-100 justify-content-center"
                        onClick={handleAddConsumptionRow}
                      >
                        <FaPlus /> Add
                      </button>
                    </div>
                  </div>

                  {/* Table Section */}
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th style={{ width: "6%" }}>Sr.</th>
                          <th style={{ width: "42%" }}>Item Desc</th>
                          <th style={{ width: "32%" }}>Heat code</th>
                          <th style={{ width: "14%" }}>Qty</th>
                          <th style={{ width: "6%" }}>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {consumptionTable.length > 0 ? (
                          consumptionTable.map((row, index) => (
                            <tr key={index}>
                              <td className="text-center">{row.id || index + 1}</td>
                              <td>{row.itemDesc}</td>
                              <td>{row.heatCode}</td>
                              <td className="text-end">{row.qty}</td>
                              <td className="text-center">
                                <button
                                  type="button"
                                  className="btn btn-outline-danger btn-sm p-1"
                                  onClick={() => handleDeleteConsumptionRow(index)}
                                  title="Delete row"
                                >
                                  <FaTrash style={{ fontSize: "0.75rem" }} />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center text-muted py-3">
                              No consumption items added yet. Fill details above and click Add.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Save Button */}
                  <div className="mt-4 d-flex justify-content-end">
                    <button
                      type="button"
                      className="vndrbtn"
                      onClick={handleSave}
                      disabled={isSubmitting}
                    >
                      <FaSave /> {isSubmitting ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ReworkEntry
