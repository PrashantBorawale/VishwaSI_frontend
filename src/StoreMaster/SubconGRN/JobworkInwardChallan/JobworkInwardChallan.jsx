import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import NavBar from "../../../NavBar/NavBar.js";
import SideNav from "../../../SideNav/SideNav.js";
import "./JobworkInwardChallan.css";

import { toast, ToastContainer } from "react-toastify";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";

const JobworkInwardChallan = () => {
  const navigate = useNavigate();
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [gateEntryData, setGateEntryData] = useState([]);
  const [selectedGateEntry, setSelectedGateEntry] = useState();
  const [challanNumbers, setChallanNumbers] = useState([]);
  const [PO, setPO] = useState([]);
  const [itemSearchTerm, setItemSearchTerm] = useState("");
  const [showItemDropdown, setShowItemDropdown] = useState(false);
  const [selectedItemType, setSelectedItemType] = useState("All");

  // BOM Items state
  const [bomItems, setBomItems] = useState({}); // raw API response
  const [itemCodeOptions, setItemCodeOptions] = useState([]); // ["FG001 - CAP OIL LOCK", ...]
  const [fgPartCodeOptions, setFgPartCodeOptions] = useState([]); // PartCodes for selected item
  const itemDropdownRef = React.useRef(null);

  // Series & Plant state
  const [selectedSeries, setSelectedSeries] = useState("Select");
  const [inputNo, setInputNo] = useState("");

  // Table rows state
  const [tableRows, setTableRows] = useState([]);
  const [editingRowIndex, setEditingRowIndex] = useState(null);

  // Current row being filled
  const [currentRow, setCurrentRow] = useState({
    ItemCode: "",
    FGPartCode: "",
    item_size: "",
    ChallanQty: "",
    GRNQty: "",
    GRNUnit: "",
    MaterialRateChallan: "",
    MaterialRateGRN: "",
    HeatNo: "",
    CustHeatNo: "",
    RMSpecification: "",
    ParticularNatureOfProcess: "",
  });

  const toggleSideNav = () => {
    setSideNavOpen((prevState) => !prevState);
  };

  const fetchGateEntryData = async () => {
    try {
      const res = await fetch("https://sellerp-backend.onrender.com/Store/general-details/");
      const resData = await res.json();
      setGateEntryData(Array.isArray(resData) ? resData : (resData.data || resData.details || []));
    } catch (err) {
      console.log(err);
      setGateEntryData([]);
    }
  };

  const fetchItems = async () => {
    try {
      if (selectedItemType === "RM") {
        const res = await fetch("https://sellerp-backend.onrender.com/All_Masters/api/rm-items/");
        const resData = await res.json();
        
        const transformedData = {};
        const dataArray = Array.isArray(resData) ? resData : (resData.items || Object.values(resData) || []);
        
        dataArray.forEach(item => {
          if (item && typeof item === 'object') {
            const newKey = `${item.part_no || ""} | ${item.Part_Code || ""} | ${item.Name_Description || ""}`;
            transformedData[newKey] = item;
          }
        });
        
        setBomItems(transformedData);
        setItemCodeOptions(Object.keys(transformedData));
      } else {
        const res = await fetch("https://sellerp-backend.onrender.com/All_Masters/api/bom-items/");
        const resData = await res.json();

        const transformedData = {};
        if (Array.isArray(resData)) {
           resData.forEach(item => {
              if (item && item.Part_Code) {
                 const newKey = `${item.Part_Code} - ${item.Name_Description} - ${item.id}`;
                 transformedData[newKey] = item;
              }
           });
        } else if (resData && typeof resData === 'object') {
          Object.keys(resData).forEach(key => {
            const parts = key.split(" - ");
            if (parts.length === 3) {
              const [id, name, fgCode] = parts;
              const newKey = `${fgCode} - ${name} - ${id}`;
              transformedData[newKey] = resData[key];
            } else {
              transformedData[key] = resData[key];
            }
          });
        }
        
        setBomItems(transformedData);
        setItemCodeOptions(Object.keys(transformedData));
      }
    } catch (err) {
      console.log("Error fetching items:", err);
      toast.error("Error fetching items. Check console.");
    }
  };

  const fetchChallanNo = async (series) => {
    try {
      const res = await fetch(`https://sellerp-backend.onrender.com/Store/jobwork-challan-no/?series=${series}`);
      const resData = await res.json();
      // Key from API is "InwardF4No"
      const challanNo = resData.InwardF4No || "";
      setFormData((prev) => ({ ...prev, InwardF4No: challanNo }));
      setInputNo(challanNo);
    } catch (err) {
      console.log("Error fetching challan no:", err);
    }
  };

  useEffect(() => {
    if (sideNavOpen) {
      document.body.classList.add("side-nav-open");
    } else {
      document.body.classList.remove("side-nav-open");
    }
  }, [sideNavOpen]);

  useEffect(() => {
    fetchItems();
  }, [selectedItemType]);

  useEffect(() => {
    fetchGateEntryData();

    const handleClickOutside = (event) => {
      if (itemDropdownRef.current && !itemDropdownRef.current.contains(event.target)) {
        setShowItemDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [formData, setFormData] = useState({
    InwardF4No: "",
    InwardDate: "",
    InwardTime: "",
    ChallanNo: "",
    ChallanDate: "",
    SubVendor: "",
    DcNo: "",
    DcDate: "",
    EWayBillQty: "",
    EWayBillNo: "",
    VehicleNo: "",
    LrNo: "",
    Transporter: "",
    PreparedBy: "",
    CheckedBy: "",
    VehicleTime: "",
    TcNo: "",
    TcDate: "",
    Remark: "",
    DeliveryInTime: "",
    ClearingStatus: "",
    VehicleOutTime: "",
    GateEntryNo: "",
    Customer: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (value) => {
    setFormData((prev) => ({ ...prev, DeliveryInTime: value }));
  };

  const handleCurrentRowChange = (e) => {
    const { name, value } = e.target;
    setCurrentRow((prev) => ({ ...prev, [name]: value }));
  };

  // When Item Code is selected (via suggestion click), load its FG Part Codes from bom_items
  const selectItemCode = (selectedKey) => {
    const selectedItemObj = (selectedKey && bomItems[selectedKey]) ? bomItems[selectedKey] : null;
    let autoItemSize = "";

    if (selectedItemType === "RM") {
      // RM uses Item_Size from backend (with fallbacks if needed)
      autoItemSize = selectedItemObj?.Item_Size || selectedItemObj?.item_size || selectedItemObj?.size || selectedItemObj?.Size || "";
    } else {
      // FG/All uses item_size from backend
      autoItemSize = selectedItemObj?.item_size || selectedItemObj?.Item_Size || selectedItemObj?.size || selectedItemObj?.Size || "";
    }

    setCurrentRow((prev) => ({
      ...prev,
      ItemCode: selectedKey,
      FGPartCode: "",
      item_size: autoItemSize,
    }));
    setItemSearchTerm(selectedKey);
    setShowItemDropdown(false);

    if (selectedKey && bomItems[selectedKey]) {
      const parts = bomItems[selectedKey].bom_items || [];
      // Store full objects instead of just strings
      setFgPartCodeOptions(parts);
    } else {
      setFgPartCodeOptions([]);
    }
  };

  const handleFGPartCodeChange = (e) => {
    const selectedFull = e.target.value;
    if (!selectedFull) {
      setCurrentRow(prev => ({ ...prev, FGPartCode: "", ParticularNatureOfProcess: "" }));
      return;
    }

    // The value is "OPNo | PartCode | Operation"
    const parts = selectedFull.split(" | ");
    const partCode = parts[1] || "";
    const operation = parts[2] || "";

    // Find selected part object from fgPartCodeOptions to extract item_size if present
    const matchedPart = fgPartCodeOptions.find(
      (pc) => `${pc.OPNo} | ${pc.PartCode} | ${pc.Operation}` === selectedFull || pc.PartCode === partCode
    );
    const fgItemSize = matchedPart?.item_size || matchedPart?.Item_Size || matchedPart?.size || matchedPart?.Size || "";

    setCurrentRow(prev => ({
      ...prev,
      FGPartCode: selectedFull, // Store the full string for display
      FGPartCodeShort: partCode, // Keep a short version for internal logic if needed
      ParticularNatureOfProcess: operation, // Auto-fill Operation
      item_size: fgItemSize || prev.item_size // If part has specific item_size, use it, otherwise keep item's size
    }));
  };

  // Add or update row in the table
  const handleAddRow = () => {
    if (!currentRow.ItemCode) {
      toast.error("Item Code is required to add a row.");
      return;
    }

    if (editingRowIndex !== null) {
      // Update existing row
      const updatedRows = [...tableRows];
      updatedRows[editingRowIndex] = { ...currentRow };
      setTableRows(updatedRows);
      setEditingRowIndex(null);
      toast.success("Row updated successfully");
    } else {
      setTableRows((prev) => [...prev, { ...currentRow }]);
      toast.success("Row added successfully");
    }

    // Reset current row
    setCurrentRow({
      ItemCode: "",
      FGPartCode: "",
      item_size: "",
      ChallanQty: "",
      GRNQty: "",
      GRNUnit: "",
      MaterialRateChallan: "",
      MaterialRateGRN: "",
      HeatNo: "",
      CustHeatNo: "",
      RMSpecification: "",
      ParticularNatureOfProcess: "",
    });
    setItemSearchTerm("");
    setFgPartCodeOptions([]);
  };

  const handleEditRow = (index) => {
    const row = tableRows[index];
    setCurrentRow({ ...row });
    setEditingRowIndex(index);
    setItemSearchTerm(row.ItemCode);
    // Restore FG Part Code options for the selected item
    if (row.ItemCode && bomItems[row.ItemCode]) {
      const parts = bomItems[row.ItemCode].bom_items || [];
      setFgPartCodeOptions(parts);
    }
  };

  const handleDeleteRow = (index) => {
    setTableRows((prev) => prev.filter((_, i) => i !== index));
    toast.info("Row deleted");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.InwardDate) {
      newErrors.InwardDate = "Inward Date is required";
    }
    if (!formData.ChallanDate) {
      newErrors.ChallanDate = "Challan Date is required";
    }
    if (!formData.DcDate) {
      newErrors.DcDate = "D.C. Date is required";
    }
    if (!formData.TcDate) {
      newErrors.TcDate = "Tc Date is required";
    }
    if (!formData.VehicleNo) {
      newErrors.VehicleNo = "Vehicle No is required";
    }
    if (!formData.VehicleTime) {
      newErrors.VehicleTime = "Vehicle in Time is required";
    }
    if (!formData.VehicleOutTime) {
      newErrors.VehicleOutTime = "Vehicle Out Time is required";
    }
    if (!formData.DeliveryInTime) {
      newErrors.DeliveryInTime = "Please select Yes or No for Delivery In Time.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangeGateEntry = async (e) => {
    const selectedGE_No = e.target.value;
    const entryObj = gateEntryData.find(
      (ent) => String(ent.GE_No) === selectedGE_No
    );
    setSelectedGateEntry(entryObj);
    const customerName = entryObj?.Supp_Cust?.replace(/^\d+\s*-\s*/, "") || "";
    setFormData((prev) => ({
      ...prev,
      GateEntryNo: selectedGE_No,
      Customer: customerName,
    }));

    try {
      const res = await fetch(
        "https://sellerp-backend.onrender.com/Sales/supplierview/?supplier=" + encodeURIComponent(customerName)
      );
      const resData = await res.json();
      setChallanNumbers(resData.challans || []);

      const res2 = await fetch(
        "https://sellerp-backend.onrender.com/Store/newjobworkpodetails/?supplier=" + encodeURIComponent(customerName)
      );
      const resData2 = await res2.json();
      setPO(resData2.purchase_orders || []);
    } catch (err) {
      console.log(err);
      setChallanNumbers([]);
      setPO([]);
    }
  };

  // Build and POST the payload
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill in the required fields");
      return;
    }

    // Map tableRows to the API's JobworkInwardChallanTable format
    const JobworkInwardChallanTable = tableRows.map((row) => ({
      ItemCode: row.ItemCode,
      Operation: row.ParticularNatureOfProcess,
      item_size: row.item_size || "",
      ChallanQty: row.ChallanQty,
      GRNQty: row.GRNQty,
      MaterialRate: row.MaterialRateChallan,
      HeatNo: row.HeatNo,
      CustHeatNo: row.CustHeatNo,
      ParticularNatureOfProcess: row.ParticularNatureOfProcess,
      FGPartCode: (row.FGPartCode || "").toUpperCase(),
    }));

    const payload = {
      Plant: "VISHWA S.I.",
      Series: selectedSeries,
      NO: inputNo,
      GateEntryNo: formData.GateEntryNo,
      Customer: formData.Customer,
      SelectItem: "",
      ItemCode: tableRows[0]?.ItemCode || "",
      FGPartCode: (tableRows[0]?.FGPartCode || "").toUpperCase(),
      item_size: tableRows[0]?.item_size || "",
      ChallanQty: tableRows[0]?.ChallanQty || "",
      GRNQty: tableRows[0]?.GRNQty || "",
      MaterialRate: tableRows[0]?.MaterialRateChallan || "",
      HeatNo: tableRows[0]?.HeatNo || "",
      CustHeatNo: tableRows[0]?.CustHeatNo || "",
      RMSpecification: tableRows[0]?.RMSpecification || "",
      PaticularNatureOfProcess: tableRows[0]?.ParticularNatureOfProcess || "",
      InwardF4No: formData.InwardF4No,
      InwardDate: formData.InwardDate,
      InwardTime: formData.InwardTime,
      ChallanNo: formData.ChallanNo,
      ChallanDate: formData.ChallanDate,
      SubVendor: formData.SubVendor,
      DCNo: formData.DcNo,
      DCDate: formData.DcDate,
      WayBillQty: formData.EWayBillQty,
      WayBillNo: formData.EWayBillNo,
      VehicleNo: formData.VehicleNo,
      LrNo: formData.LrNo,
      Transporter: formData.Transporter,
      PrepartedBy: formData.PreparedBy,
      CheckedBy: formData.CheckedBy,
      VehicleInTime: formData.VehicleTime,
      TCNo: formData.TcNo,
      TCDate: formData.TcDate,
      Remark: formData.Remark,
      DevileryInTime: formData.DeliveryInTime,
      ClearingStatus: formData.ClearingStatus,
      VehicleOutTime: formData.VehicleOutTime,
      JobworkInwardChallanTable,
    };

    try {
      const response = await fetch(
        "https://sellerp-backend.onrender.com/Store/JobworkInwardChallan/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        console.error("API Error:", errData);
        toast.error("Error submitting data: " + JSON.stringify(errData));
        return;
      }

      const data = await response.json();
      console.log("Submitted successfully:", data);
      toast.success("Challan saved successfully!");

      // Reset form after success
      setFormData({
        InwardF4No: "", InwardDate: "", InwardTime: "", ChallanNo: "",
        ChallanDate: "", SubVendor: "", DcNo: "", DcDate: "",
        EWayBillQty: "", EWayBillNo: "", VehicleNo: "", LrNo: "",
        Transporter: "", PreparedBy: "", CheckedBy: "", VehicleTime: "",
        TcNo: "", TcDate: "", Remark: "", DeliveryInTime: "",
        ClearingStatus: "", VehicleOutTime: "", GateEntryNo: "", Customer: "",
      });
      setTableRows([]);
      setSelectedGateEntry(null);

      // Fetch new challan no for the currently selected series
      if (selectedSeries !== "Select") {
        await fetchChallanNo(selectedSeries);
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error while submitting data");
    }
  };

  return (
    <div className="NewStoreInwardJobwork">
      <ToastContainer />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="Main-NavBar">
              <NavBar toggleSideNav={toggleSideNav} />
              <SideNav sideNavOpen={sideNavOpen} toggleSideNav={toggleSideNav} />
              <main className={`main-content ${sideNavOpen ? "shifted" : ""}`}>
                {/* ── Header ── */}
                <div className="InwardJobwork-header mb-2 text-start">
  <h5 className="header-title mb-0" style={{ fontWeight: 800, fontSize: '1.8rem', background: 'linear-gradient(90deg, #2563eb, #4f46e5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '16px' }}>Jobwork Inward Challan</h5>
  <div className="d-flex flex-wrap align-items-center gap-3 w-100 mt-2" style={{ overflowX: "auto" }}>

                    <select id="sharpSelect" className="form-select w-auto" style={{ minWidth: "90px", fontSize: "0.8rem", padding: "4px 25px 4px 8px" }}>
                      <option defaultValue>VISHWA S.I.</option>
                    </select>

                    <div className="d-flex align-items-center gap-2">
                      <label htmlFor="seriesSelect" className="mb-0" style={{ fontSize: "0.85rem" }}>Series:</label>
                      <select
                        id="seriesSelect"
                        className="form-select w-auto"
                        style={{ fontSize: "0.8rem", padding: "4px 25px 4px 8px" }}
                        value={selectedSeries}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedSeries(val);
                          if (val !== "Select") {
                            fetchChallanNo(val);
                          }
                        }}
                      >
                        <option value="Select">Select</option>
                        <option value="57F4">Jobwork 57F4 Inward</option>
                        <option value="57F4 Return">Non Return Inward</option>
                        <option value="Process Loss/Scrap">Cust Rework</option>
                      </select>
                      <input
                        type="text"
                        className="form-control ms-5"
                        style={{ width: "110px", fontSize: "0.8rem", padding: "4px 8px" }}
                        placeholder="Enter value"
                        value={inputNo}
                        onChange={(e) => setInputNo(e.target.value)}
                      />
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <span className="mb-0" style={{ fontSize: "0.85rem" }}>Gate Entry No:</span>
                      <select
                        onChange={handleChangeGateEntry}
                        className="form-select w-auto"
                        style={{ maxWidth: "150px", fontSize: "0.8rem", padding: "4px 20px 4px 8px" }}
                        value={formData.GateEntryNo}
                      >
                        <option value="">Select</option>
                        {gateEntryData?.map((item) => (
                          <option key={item.GE_No} value={item?.GE_No}>
                            {item?.GE_No} | {item?.Supp_Cust}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <span className="mb-0" style={{ fontSize: "0.85rem" }}>Customer:</span>
                      <input
                        type="text"
                        className="form-control w-auto"
                        style={{ maxWidth: "200px", fontSize: "0.8rem", padding: "4px 8px" }}
                        placeholder="Customer"
                        value={formData.Customer}
                        readOnly
                      />
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <button type="button" className="btn btn-primary" style={{ fontSize: "0.8rem", padding: "4px 12px", }}>Search</button>
                      <button type="button" className="btn btn-danger" style={{ fontSize: "0.8rem", padding: "4px 12px", }}>Cancel</button>
                      <button type="button" className="btn btn-primary" style={{ fontSize: "0.8rem", padding: "4px 12px", }} onClick={() => navigate("/Jobwork-Inward-Challan-List")}>
                        Jobwork List
                      </button>
                    </div>

                  </div>
                </div>

                {/* ── Item Entry Table ── */}
                <div className="InwardJobwork-main mt-2">
                  <div className="container-fluid text-start">
                    <div className="table-responsive" style={(showItemDropdown && itemSearchTerm) ? { overflow: "visible" } : {}}>
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th style={{ minWidth: "150px", maxWidth: "180px", fontSize: "0.75rem", padding: "6px 8px" }}>
                              Select Item:
                              <div className="d-flex mt-1" style={{ fontSize: "0.75rem" }}>
                                <label className="me-2 mb-0"><input type="checkbox" name="selectAll" checked={selectedItemType === "All"} onChange={() => setSelectedItemType("All")} /> All</label>
                                <label className="me-2 mb-0"><input type="checkbox" name="selectRM" checked={selectedItemType === "RM"} onChange={() => setSelectedItemType("RM")} /> RM</label>
                                <label className="mb-0"><input type="checkbox" name="selectFG" checked={selectedItemType === "FG"} onChange={() => setSelectedItemType("FG")} /> FG</label>
                              </div>
                            </th>
                            <th style={{ width: "90px", minWidth: "80px", fontSize: "0.75rem", padding: "6px 8px" }}>Item Size</th>
                            <th style={{ fontSize: "0.75rem", padding: "6px 8px" }}>Inward Qty</th>
                            <th style={{ fontSize: "0.75rem", padding: "6px 8px" }}>Material Rate</th>
                            <th style={{ fontSize: "0.75rem", padding: "6px 8px" }}>Heat No</th>
                            <th style={{ fontSize: "0.75rem", padding: "6px 8px" }}>Cust Heat No</th>
                            <th style={{ fontSize: "0.75rem", padding: "6px 8px" }}>RM Specification</th>
                            <th style={{ fontSize: "0.75rem", padding: "6px 8px" }}>Particular/Nature Of Process</th>
                            <th style={{ fontSize: "0.75rem", padding: "6px 8px" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={{ minWidth: "150px", maxWidth: "180px", padding: "6px" }}>
                              <div className="d-flex mb-1 position-relative align-items-center" ref={itemDropdownRef}>
                                <div className="input-group flex-nowrap w-100">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search..."
                                    value={itemSearchTerm}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setItemSearchTerm(val);
                                      setShowItemDropdown(true);
                                      if (!val) {
                                        setCurrentRow(prev => ({ ...prev, ItemCode: "" }));
                                        setFgPartCodeOptions([]);
                                      }
                                    }}
                                    onFocus={() => setShowItemDropdown(true)}
                                    style={{ fontSize: "0.75rem", padding: "3px 6px", height: "28px" }}
                                  />
                                  <button className="btn btn-outline-secondary d-flex align-items-center px-2 py-0" type="button" onClick={() => setShowItemDropdown(!showItemDropdown)} style={{ height: "28px" }}>
                                    <FaSearch size={11} />
                                  </button>
                                </div>

                                {showItemDropdown && itemSearchTerm && (
                                  <ul className="list-group position-absolute w-100 z-3" style={{ top: "100%", left: 0, maxHeight: "200px", overflowY: "auto", fontSize: "0.75rem", border: "1px solid #ddd" }}>
                                    {itemCodeOptions
                                      .filter(opt => opt.toLowerCase().includes(itemSearchTerm.toLowerCase()))
                                      .map((opt, idx) => (
                                        <li
                                          key={idx}
                                          className="list-group-item list-group-item-action py-1 px-2"
                                          style={{ cursor: "pointer" }}
                                          onClick={() => selectItemCode(opt)}
                                        >
                                          {opt}
                                        </li>
                                      ))}
                                    {itemCodeOptions.filter(opt => opt.toLowerCase().includes(itemSearchTerm.toLowerCase())).length === 0 && (
                                      <li className="list-group-item disabled py-1 px-2">No items found</li>
                                    )}
                                  </ul>
                                )}
                              </div>
                              {selectedItemType !== "RM" && (
                                <div className="d-flex mt-1">
                                  <select
                                    name="FGPartCode"
                                    className="form-select w-100"
                                    value={currentRow.FGPartCode}
                                    onChange={handleFGPartCodeChange}
                                    disabled={fgPartCodeOptions.length === 0}
                                    style={{ padding: "2px 18px 2px 6px", fontSize: "0.75rem", height: "26px" }}
                                  >
                                    <option value="">FG Part Code...</option>
                                    {fgPartCodeOptions.map((pc, idx) => {
                                      const fullVal = `${pc.OPNo} | ${pc.PartCode} | ${pc.Operation}`;
                                      return (
                                        <option key={idx} value={fullVal}>
                                          {fullVal}
                                        </option>
                                      );
                                    })}
                                  </select>
                                </div>
                              )}
                            </td>
                            <td style={{ width: "90px", minWidth: "80px", padding: "6px" }}>
                              <input
                                type="text"
                                name="item_size"
                                className="form-control text-center"
                                placeholder="Size"
                                value={currentRow.item_size}
                                readOnly
                                style={{ width: "100%", fontSize: "0.75rem", padding: "3px 6px", height: "28px", backgroundColor: "#f1f5f9", cursor: "default" }}
                              />
                            </td>
                            <td>
                              <div className="d-flex mb-1">
                                <label className="me-1 text-nowrap">Challan Qty:</label>
                                <input
                                  name="ChallanQty"
                                  className="form-control"
                                  value={currentRow.ChallanQty}
                                  onChange={handleCurrentRowChange}
                                />
                              </div>
                              <div className="d-flex">
                                <label className="me-1 text-nowrap">GRN Qty:</label>
                                <input
                                  name="GRNQty"
                                  className="form-control"
                                  value={currentRow.GRNQty}
                                  onChange={handleCurrentRowChange}
                                />
                                <select
                                  name="GRNUnit"
                                  className="form-select"
                                  value={currentRow.GRNUnit}
                                  onChange={handleCurrentRowChange}
                                >
                                  <option value=""></option>
                                  <option value="KG">KG</option>
                                  <option value="NOS">NOS</option>
                                </select>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex mb-1">
                                <label className="me-1 text-nowrap">Challan:</label>
                                <input
                                  name="MaterialRateChallan"
                                  className="form-control"
                                  value={currentRow.MaterialRateChallan}
                                  onChange={handleCurrentRowChange}
                                />
                              </div>
                              <div className="d-flex">
                                <label className="me-1 text-nowrap">GRN:</label>
                                <input
                                  name="MaterialRateGRN"
                                  className="form-control"
                                  value={currentRow.MaterialRateGRN}
                                  onChange={handleCurrentRowChange}
                                />
                                <span className="ms-1">KG</span>
                              </div>
                            </td>
                            <td>
                              <input
                                name="HeatNo"
                                className="form-control"
                                value={currentRow.HeatNo}
                                onChange={handleCurrentRowChange}
                              />
                            </td>
                            <td>
                              <input
                                name="CustHeatNo"
                                className="form-control"
                                value={currentRow.CustHeatNo}
                                onChange={handleCurrentRowChange}
                              />
                            </td>
                            <td>
                              <textarea
                                name="RMSpecification"
                                className="form-control"
                                value={currentRow.RMSpecification}
                                onChange={handleCurrentRowChange}
                              ></textarea>
                            </td>
                            <td>
                              <textarea
                                name="ParticularNatureOfProcess"
                                className="form-control"
                                value={currentRow.ParticularNatureOfProcess}
                                onChange={handleCurrentRowChange}
                              ></textarea>
                            </td>
                            <td>
                              <button type="button" className="btn btn-success btn-sm text-nowrap" onClick={handleAddRow}
                              >
                                {editingRowIndex !== null ? "UPDATE" : "ADD"}
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* ── Added Rows Table ── */}
                  <div className="InwardJobworkstatus">
                    <div className="container-fluid text-start">
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>Sr no.</th>
                              <th>Item Code</th>
                              <th>Item Size</th>
                              <th>Operation</th>
                              <th>Challan Qty</th>
                              <th>GRN Qty</th>
                              <th>Material Rate</th>
                              <th>Heat No</th>
                              <th>Cust. Heat No</th>
                              <th>Particular/Nature Of Process</th>
                              <th>HC</th>
                              <th>Edit</th>
                              <th>Delete</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tableRows.length === 0 ? (
                              <tr>
                                <td colSpan="13" className="text-center text-muted">
                                  No items added yet. Use the form above to add items.
                                </td>
                              </tr>
                            ) : (
                              tableRows.map((row, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{row.ItemCode}</td>
                                  <td>{row.item_size || "-"}</td>
                                  <td>{row.ParticularNatureOfProcess}</td>
                                  <td>{row.ChallanQty}</td>
                                  <td>{row.GRNQty}</td>
                                  <td>{row.MaterialRateChallan}</td>
                                  <td>{row.HeatNo}</td>
                                  <td>{row.CustHeatNo}</td>
                                  <td>{row.ParticularNatureOfProcess}</td>
                                  <td>{row.RMSpecification}</td>
                                  <td>
                                    <FaEdit
                                      style={{ cursor: "pointer", color: "#0d6efd" }}
                                      onClick={() => handleEditRow(index)}
                                    />
                                  </td>
                                  <td>
                                    <FaTrash
                                      style={{ cursor: "pointer", color: "#dc3545" }}
                                      onClick={() => handleDeleteRow(index)}
                                    />
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── General Detail Form ── */}
                <div className="StoreInwardJobworkFooter">
                  <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link active"
                        id="pills-Gernal-Detail-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-Gernal-Detail"
                        type="button"
                        role="tab"
                        aria-controls="pills-Gernal-Detail"
                        aria-selected="true"
                      >
                        General Detail
                      </button>
                    </li>
                  </ul>

                  <div className="tab-content" id="pills-tabContent">
                    <div
                      className="tab-pane fade show active"
                      id="pills-Gernal-Detail"
                      role="tabpanel"
                      aria-labelledby="pills-Gernal-Detail-tab"
                      tabIndex="0"
                    >
                      <div className="StoreInwardJobworks text-start">
                        <div className="container-fluid">
                          <form onSubmit={handleSubmit}>
                            <div className="row">
                              {/* Column 1 */}
                              <div className="col-md-4 text-start">
                                <div className="container-fluid">
                                  <div className="table-responsive">
                                    <table className="table table-bordered">
                                      <tbody>
                                        {[
                                          { label: "Inward F4 No:", name: "InwardF4No", type: "text", readOnly: true },
                                          { label: "Inward Date:", name: "InwardDate", type: "date", required: true },
                                          { label: "Inward Time:", name: "InwardTime", type: "text" },
                                          { label: "Challan No:", name: "ChallanNo", type: "text" },
                                          { label: "Challan Date:", name: "ChallanDate", type: "date", required: true },
                                          { label: "Sub Vendor:", name: "SubVendor", type: "text" },
                                          { label: "D. C. No:", name: "DcNo", type: "text" },
                                        ].map(({ label, name, type, readOnly, required }) => (
                                          <tr key={name}>
                                            <th className="col-md-4">
                                              {label} {required && <span className="text-danger">*</span>}
                                            </th>
                                            <td>
                                              <input
                                                type={type}
                                                className="form-control"
                                                name={name}
                                                value={formData[name] || ""}
                                                onChange={handleInputChange}
                                                readOnly={readOnly}
                                                style={readOnly ? { backgroundColor: "#e9ecef" } : {}}
                                              />
                                              {errors[name] && <span className="text-danger" style={{ fontSize: "0.75rem" }}>{errors[name]}</span>}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>

                              {/* Column 2 */}
                              <div className="col-md-4 text-start">
                                <div className="container-fluid">
                                  <div className="table-responsive text-start">
                                    <table className="table table-bordered">
                                      <tbody>
                                        {[
                                          { label: "D.C. Date:", name: "DcDate", type: "date", required: true },
                                          { label: "Way Bill Qty:", name: "EWayBillQty", type: "text" },
                                          { label: "Way Bill No:", name: "EWayBillNo", type: "text" },
                                          { label: "Vehicle No:", name: "VehicleNo", type: "text", required: true },
                                          { label: "Lr No:", name: "LrNo", type: "text" },
                                          { label: "Transporter:", name: "Transporter", type: "text" },
                                          { label: "Prepared By:", name: "PreparedBy", type: "text" },
                                          { label: "Checked By:", name: "CheckedBy", type: "text" },
                                        ].map(({ label, name, type, required }) => (
                                          <tr key={name}>
                                            <th className="col-md-4">
                                              {label} {required && <span className="text-danger">*</span>}
                                            </th>
                                            <td>
                                              <input
                                                type={type}
                                                className="form-control"
                                                name={name}
                                                value={formData[name]}
                                                onChange={handleInputChange}
                                              />
                                              {errors[name] && <span className="text-danger" style={{ fontSize: "0.75rem" }}>{errors[name]}</span>}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>

                              {/* Column 3 */}
                              <div className="col-md-4 text-start">
                                <div className="container-fluid">
                                  <div className="table-responsive">
                                    <table className="table table-bordered">
                                      <tbody>
                                        <tr>
                                          <th className="col-md-4">
                                            Vehicle in Time: <span className="text-danger">*</span>
                                          </th>
                                          <td>
                                            <input type="time" className="form-control" name="VehicleTime" value={formData.VehicleTime} onChange={handleInputChange} />
                                            {errors.VehicleTime && <span className="text-danger" style={{ fontSize: "0.75rem" }}>{errors.VehicleTime}</span>}
                                          </td>
                                        </tr>
                                        <tr>
                                          <th className="col-md-4">Tc No:</th>
                                          <td>
                                            <input type="text" className="form-control" name="TcNo" value={formData.TcNo} onChange={handleInputChange} />
                                          </td>
                                        </tr>
                                        <tr>
                                          <th className="col-md-4">
                                            Tc Date: <span className="text-danger">*</span>
                                          </th>
                                          <td>
                                            <input type="date" className="form-control" name="TcDate" value={formData.TcDate} onChange={handleInputChange} />
                                            {errors.TcDate && <span className="text-danger" style={{ fontSize: "0.75rem" }}>{errors.TcDate}</span>}
                                          </td>
                                        </tr>
                                        <tr>
                                          <th className="col-md-4">Remark:</th>
                                          <td>
                                            <textarea className="form-control" name="Remark" value={formData.Remark} onChange={handleInputChange} rows="2"></textarea>
                                          </td>
                                        </tr>

                                        <tr>
                                          <th className="col-md-4">Delivery in Time:</th>
                                          <td>
                                            <div className="d-flex align-items-center gap-3">
                                              <div className="form-check mb-0">
                                                <input
                                                  className="form-check-input"
                                                  type="checkbox"
                                                  name="DeliveryInTime"
                                                  id="deliveryYes"
                                                  checked={formData.DeliveryInTime === "yes"}
                                                  onChange={() => handleCheckboxChange("yes")}
                                                />
                                                <label className="form-check-label" htmlFor="deliveryYes">
                                                  Yes
                                                </label>
                                              </div>
                                              <div className="form-check mb-0">
                                                <input
                                                  className="form-check-input"
                                                  type="checkbox"
                                                  name="DeliveryInTime"
                                                  id="deliveryNo"
                                                  checked={formData.DeliveryInTime === "no"}
                                                  onChange={() => handleCheckboxChange("no")}
                                                />
                                                <label className="form-check-label" htmlFor="deliveryNo">
                                                  No
                                                </label>
                                              </div>
                                            </div>
                                            {errors.DeliveryInTime && <span className="text-danger" style={{ fontSize: "0.75rem" }}>{errors.DeliveryInTime}</span>}
                                          </td>
                                        </tr>
                                        <tr>
                                          <th className="col-md-4">Clearing Status:</th>
                                          <td>
                                            <select 
                                              className="form-select" 
                                              name="ClearingStatus" 
                                              value={formData.ClearingStatus} 
                                              onChange={handleInputChange}
                                              style={{ minHeight: "34px", padding: "6px 30px 6px 12px", fontSize: "13px" }}
                                            >
                                              <option value="">Select</option>
                                              <option value="Pending">Pending</option>
                                              <option value="yes">Yes</option>
                                              <option value="No">No</option>
                                            </select>
                                          </td>
                                        </tr>
                                        <tr>
                                          <th className="col-md-4">
                                            Vehicle Out Time: <span className="text-danger">*</span>
                                          </th>
                                          <td>
                                            <input type="time" className="form-control" name="VehicleOutTime" value={formData.VehicleOutTime} onChange={handleInputChange} />
                                            {errors.VehicleOutTime && <span className="text-danger" style={{ fontSize: "0.75rem" }}>{errors.VehicleOutTime}</span>}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td colSpan="2" className="text-center">
                                            <button type="submit" className="btn btn-primary">
                                              Save Challan
                                            </button>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobworkInwardChallan;