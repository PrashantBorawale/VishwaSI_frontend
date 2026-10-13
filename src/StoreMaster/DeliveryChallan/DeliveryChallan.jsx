import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import NavBar from "../../NavBar/NavBar.js";
import SideNav from "../../SideNav/SideNav.js";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./DeliveryChallan.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeliveryChallan = () => {
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [showSupplierList, setShowSupplierList] = useState(false);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [showItemList, setShowItemList] = useState(false);
  
  const [formData1, setFormData1] = useState({
    Plant: "VISHWA S.I.", DCSeries: "Services", DCType: "Select Type", Inventory: "Without Inventory", Supplier: "", AddressCode: "",
    ChallanNo: "", VehicleNo: "", Contractor: "", ChallanDate: "", Transport: "", EWayBillNo: "", PoNo: "", Ref_Person: "", LrNo: "", PoDate: "", Department: "", AssessableValue: "", CGST: "", SGST: "", IGST: "", GrandTotal: "", Remark: "",
  });

  function filterSuppiers(items, searchString) {
    // split the input on whitespace, drop empty strings, lowercase
    const keywords = searchString
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    // if no keywords, hide list and return full list (or empty if you prefer)
    if (keywords.length === 0) {
      setShowSupplierList(false);
      return items;
    }

    // filter
    const filtered = items.filter((item) => {
      const Name = (item.Name || item.name || "").toLowerCase();
      const Number = (item.number || "").toLowerCase();
      // include this item if ANY keyword matches part_no OR description
      return keywords.some((kw) => Name.includes(kw) || Number.includes(kw));
    });

    // hide when there’s nothing to show
    setShowSupplierList(filtered.length > 0);
    return filtered;
  }

  function filterItemsList(itemsList, searchString) {
    const keywords = searchString.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (keywords.length === 0) {
      setShowItemList(false);
      return itemsList;
    }
    const filtered = itemsList.filter((item) => {
      const code = (item.Item_Code || item.item_code || item.part_no || "").toLowerCase();
      const desc = (item.Name_Description || item.description || "").toLowerCase();
      const group = (item.Item_Group || item.item_group || "").toLowerCase();
      return keywords.some((kw) => code.includes(kw) || desc.includes(kw) || group.includes(kw));
    });
    setShowItemList(filtered.length > 0);
    return filtered;
  }



  const fetchSupplierData = async () => {
    try {
      const res = await fetch(
        "https://sellerp-backend.onrender.com/All_Masters/SupplierCustomerVendorList/"
      );
      const responseData = await res.json();
      setSuppliers(responseData);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchItems = async () => {
    try {
      const res = await fetch(
        "https://sellerp-backend.onrender.com/All_Masters/Fetch_Item_fields/"
      );
      const resData = await res.json();
      setItems(resData);
    } catch(err) {
      console.log(err);
    }
  };

  const fetchDCNo = async () => {
    try {
      const res = await fetch("https://sellerp-backend.onrender.com/Store/DC_no/genrate/");
      if (!res.ok) throw new Error("Failed to generate DC series");
      const data = await res.json();
      const generatedNo = data.dc_series || "";
      setFormData1(prev => ({ ...prev, DCSeries: generatedNo }));
      toast.success("DC Series number is generated successfully");
    } catch(err) {
      console.error(err);
      toast.error("Failed to generate DC Series number");
    }
  };

  useEffect(() => {
    fetchSupplierData();
    fetchItems();
    fetchDCNo();
  }, []);

  const toggleSideNav = () => {
    setSideNavOpen((prevState) => !prevState);
  };

  useEffect(() => {
    if (sideNavOpen) {
      document.body.classList.add("side-nav-open");
    } else {
      document.body.classList.remove("side-nav-open");
    }
  }, [sideNavOpen]);

  const [challans, setChallans] = useState([]);
  const [formData, setFormData] = useState({
    SelectItem: "",
    Store: "",
    ItemCode: "",
    HSNCode: "",
    Description: "",
    Purpose: "",
    Unit: "",
    Rate: "",
    Qty: "",
    cgst: 0,
    sgst: 0,
    igst: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    let totalAssessable = 0;
    let totalCGST = 0;
    let totalSGST = 0;
    let totalIGST = 0;
    
    challans.forEach(item => {
      const amount = parseFloat(item.Rate || 0) * parseFloat(item.Qty || 0);
      totalAssessable += amount;
      totalCGST += amount * (parseFloat(item.cgst || 0) / 100);
      totalSGST += amount * (parseFloat(item.sgst || 0) / 100);
      totalIGST += amount * (parseFloat(item.igst || 0) / 100);
    });
    
    const grandTotal = Math.round(totalAssessable + totalCGST + totalSGST + totalIGST);
    
    setFormData1(prev => ({
      ...prev,
      AssessableValue: totalAssessable.toFixed(2),
      CGST: totalCGST.toFixed(2),
      SGST: totalSGST.toFixed(2),
      IGST: totalIGST.toFixed(2),
      GrandTotal: grandTotal
    }));
  }, [challans]);

  useEffect(() => {
    loadChallans();
  }, []);

  // Load delivery challan data
  const loadChallans = async () => {
    // Left empty since this is a create page.
    // If needed, you can GET from "https://sellerp-backend.onrender.com/Store/api/delivery-challans/"
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission for adding items to the table
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.SelectItem || !formData.ItemCode || !formData.Qty) {
      toast.error("Please fill in the required item fields!");
      return;
    }

    if (isEditing) {
      const updatedList = [...challans];
      const index = updatedList.findIndex((item) => item.id === editId);
      if (index !== -1) updatedList[index] = { ...formData, id: editId };
      setChallans(updatedList);
      toast.success("Item updated successfully!");
      setIsEditing(false);
      setEditId(null);
    } else {
      setChallans([...challans, { ...formData, id: Date.now() }]);
      toast.success("Item added successfully!");
    }

    setFormData({ SelectItem: "", Store: "", ItemCode: "", HSNCode: "", Description: "", Purpose: "", Unit: "", Rate: "", Qty: "", cgst: 0, sgst: 0, igst: 0 });
  };

  const handleEdit = (challan) => {
    setFormData(challan);
    setIsEditing(true);
    setEditId(challan.id);
  };

  const handleDelete = (id) => {
    setChallans(challans.filter((c) => c.id !== id));
    toast.success("Item deleted successfully!");
  };

  // formData1 moved up

  const handleChange1 = (e) => {
    setFormData1({ ...formData1, [e.target.name]: e.target.value });
  };

  const handleSubmit1 = async (e) => {
    e.preventDefault();

    const payload = {
      plant: formData1.Plant,
      dc_series: formData1.DCSeries,
      dc_type: formData1.DCType,
      inventory: formData1.Inventory,
      supplier: formData1.Supplier,
      add_code: formData1.AddressCode,
      challan_no: formData1.ChallanNo,
      po_no: formData1.PoNo,
      vehical_no: formData1.VehicleNo,
      contractor: formData1.Contractor,
      challan_date: formData1.ChallanDate || null,
      transport: formData1.Transport,
      e_way_bill_no: formData1.EWayBillNo,
      ref_person_no: formData1.Ref_Person,
      lr_no: formData1.LrNo,
      po_date: formData1.PoDate || null,
      deparment: formData1.Department,
      assessable_value: formData1.AssessableValue,
      cgst_amt: formData1.CGST,
      sgst_amt: formData1.SGST,
      igst_amt: formData1.IGST,
      grand_total: formData1.GrandTotal,
      remark: formData1.Remark,
      items: challans.map((item, index) => ({
        item_no: String(index + 1),
        item_code: item.ItemCode,
        item_desc: item.Description,
        hsn_code: item.HSNCode,
        purpose: item.Purpose,
        unit: item.Unit,
        rate: item.Rate,
        qty: item.Qty,
        cgst: ((parseFloat(item.Rate || 0) * parseFloat(item.Qty || 0)) * (parseFloat(item.cgst || 0) / 100)).toFixed(4),
        sgst: ((parseFloat(item.Rate || 0) * parseFloat(item.Qty || 0)) * (parseFloat(item.sgst || 0) / 100)).toFixed(4),
        igst: ((parseFloat(item.Rate || 0) * parseFloat(item.Qty || 0)) * (parseFloat(item.igst || 0) / 100)).toFixed(4),
      }))
    };

    try {
      const headers = { "Content-Type": "application/json" };
      const token = localStorage.getItem("accessToken");
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch("https://sellerp-backend.onrender.com/Store/api/delivery-challans/", {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        toast.success("Challan saved successfully");
        setFormData1({ Plant: "VISHWA S.I.", DCSeries: "", DCType: "Select Type", Inventory: "Without Inventory", Supplier: "", AddressCode: "", ChallanNo: "", VehicleNo: "", Contractor: "", ChallanDate: "", Transport: "", EWayBillNo: "", PoNo: "", Ref_Person: "", LrNo: "", PoDate: "", Department: "", AssessableValue: "", CGST: "", SGST: "", IGST: "", GrandTotal: "", Remark: "" });
        setChallans([]);
        fetchDCNo();
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error saving challan:", errorData);
        toast.error(errorData?.detail || errorData?.message || "Error saving challan");
      }
    } catch (error) {
      toast.error("Error saving challan");
      console.error("Error:", error);
    }
  };
  return (
    <div className="NewStoreDeliverychallan">
      <ToastContainer />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="Main-NavBar">
              <NavBar toggleSideNav={toggleSideNav} />
              <SideNav
                sideNavOpen={sideNavOpen}
                toggleSideNav={toggleSideNav}
              />
              <main className={`main-content ${sideNavOpen ? "shifted" : ""}`}>
                <div className="Deliverychallan-header">
  <div className="d-flex justify-content-between align-items-center">
    <h5 className="header-title mb-0">Delivery Challan</h5>
  </div>
</div>
                <div className="Deliverychallan-main">
                  <div className="card shadow-sm border-0 mb-4 mt-4" style={{ borderRadius: '12px' }}>
  <div className="card-body text-start">
    <div className="row mb-4">
      <div className="col-md-12">

                          <div className="table-responsive">
                            <table className="table table-bordered w-100 m-0">
                              <thead>
                                <tr>
                                  <th>Plant:</th>
                                  <th>DC Series:</th>
                                  <th>DC Type:</th>
                                  <th>Inventory:</th>
                                  <th>Supp/Cust/Vendor:</th>
                                  <th>Address Code:</th>

                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>
                                    <select
                                      id="sharpSelect"
                                      className="form-select"
                                      name="Plant"
                                      value={formData1.Plant || "VISHWA S.I."}
                                      onChange={handleChange1}
                                    >
                                      <option value="VISHWA S.I.">VISHWA S.I.</option>
                                    </select>
                                  </td>
                                  <td>
                                    <input 
                                      className="form-control"
                                      type="text"
                                      name="DCSeries"
                                      value={formData1.DCSeries || ""}
                                      readOnly
                                    />
                                  </td>
                                  <td>
                                    <select 
                                      className="form-select"
                                      name="DCType"
                                      value={formData1.DCType || "Select Type"}
                                      onChange={handleChange1}
                                    >
                                      <option value="Select Type">Select Type</option>
                                      <option value="Non-Returnable">Non-Returnable</option>
                                      <option value="Returnable">Returnable</option>
                                    </select>
                                  </td>
                                  <td>
                                    <select 
                                      className="form-select"
                                      name="Inventory"
                                      value={formData1.Inventory || "Without Inventory"}
                                      onChange={handleChange1}
                                    >
                                      <option value="Without Inventory">Without Inventory</option>
                                      <option value="With Inventory">With Inventory</option>
                                    </select>
                                  </td>
                                  <td>
                                    <input
                                      className="form-control"
                                      type="text"
                                      name="Supplier"
                                      value={formData1.Supplier || ""}
                                      onChange={(e) => {
                                        handleChange1(e);
                                        const filtered = filterSuppiers(
                                          suppliers,
                                          e.target.value
                                        );
                                        setFilteredSuppliers(filtered);
                                      }}
                                    />
                                    {showSupplierList && (
                                      <ul
                                        className="dropdown-menu show"
                                        style={{
                                          width: "30%",
                                          maxHeight: "200px",
                                          overflowY: "auto",
                                          border: "1px solid #ccc",
                                          zIndex: 1000,
                                        }}
                                      >
                                        {filteredSuppliers.map((item) => (
                                          <li
                                            key={item.part_no}
                                            className="dropdown-item"
                                            style={{
                                              padding: "5px",
                                              cursor: "pointer",
                                            }}
                                            onClick={() => {
                                              setFormData1(prev => ({
                                                ...prev,
                                                Supplier: item.Name || item.name,
                                                AddressCode: item.number
                                              }));
                                              setShowSupplierList(false);
                                            }}
                                          >
                                            {item.Name || item.name}
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </td>
                                  <td>
                                    <input 
                                      className="form-control"
                                      type="text"
                                      name="AddressCode"
                                      value={formData1.AddressCode || ""}
                                      readOnly
                                    />
                                  </td>

                                  <td>
                                    <button type="button" className="btn">
                                      Cancel
                                    </button>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        
      </div>
    </div>
    <div className="row">
      <div className="col-md-12">

                          <div className="table-responsive">
                            <form onSubmit={handleSubmit}>
                              <table className="table table-bordered w-100 m-0">
                                <thead>
                                  <tr>
                                    <th>Select Item: </th>
                                    <th>Store</th>
                                    <th>Item Code</th>
                                    <th>HSN Code</th>
                                    <th>Description</th>
                                    <th>Purpose</th>
                                    <th>Unit</th>
                                    <th>Rate</th>
                                    <th>Qty</th>
                                    <th style={{ whiteSpace: 'nowrap' }}>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      <input
                                        type="text"
                                        name="SelectItem"
                                        className="form-control"
                                        value={formData.SelectItem}
                                        onChange={(e) => {
                                          handleChange(e);
                                          const filtered = filterItemsList(items, e.target.value);
                                          setFilteredItems(filtered);
                                        }}
                                      />
                                      {showItemList && (
                                        <ul
                                          className="dropdown-menu show"
                                          style={{
                                            width: "30%",
                                            maxHeight: "200px",
                                            overflowY: "auto",
                                            border: "1px solid #ccc",
                                            zIndex: 1000,
                                          }}
                                        >
                                          {filteredItems.map((item) => (
                                            <li
                                              key={item.part_no || item.id}
                                              className="dropdown-item"
                                              style={{
                                                padding: "5px",
                                                cursor: "pointer",
                                              }}
                                              onClick={() => {
                                                setFormData(prev => ({
                                                  ...prev,
                                                  SelectItem: item.part_no || item.Item_Code || item.item_code || "",
                                                  ItemCode: item.Part_Code || item.Item_Code || item.item_code || item.part_no || "",
                                                  HSNCode: item.HSN_SAC_Code || item.hsn_code || "",
                                                  Description: item.Name_Description || item.description || "",
                                                  Unit: item.UOM || item.unit || "",
                                                  Rate: item.Standard_Cost || item.rate || "",
                                                  cgst: item.cgst || item.CGST || 0,
                                                  sgst: item.sgst || item.SGST || 0,
                                                  igst: item.igst || item.IGST || 0
                                                }));
                                                setShowItemList(false);
                                              }}
                                            >
                                              {item.part_no || item.Item_Code} - {item.Part_Code}{" "}
                                              - {item.Name_Description || item.description}
                                            </li>
                                          ))}
                                        </ul>
                                      )}
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        name="Store"
                                        className="form-control"
                                        value={formData.Store}
                                        onChange={handleChange}
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        name="ItemCode"
                                        className="form-control"
                                        value={formData.ItemCode}
                                        onChange={handleChange}
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        name="HSNCode"
                                        className="form-control"
                                        value={formData.HSNCode}
                                        onChange={handleChange}
                                      />
                                    </td>
                                    <td>
                                      <textarea
                                        name="Description"
                                        className="form-control"
                                        value={formData.Description}
                                        onChange={handleChange}
                                      ></textarea>
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        name="Purpose"
                                        className="form-control"
                                        value={formData.Purpose}
                                        onChange={handleChange}
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        name="Unit"
                                        className="form-control"
                                        value={formData.Unit}
                                        onChange={handleChange}
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        name="Rate"
                                        className="form-control"
                                        value={formData.Rate}
                                        onChange={handleChange}
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        name="Qty"
                                        className="form-control"
                                        value={formData.Qty}
                                        onChange={handleChange}
                                      />
                                    </td>
                                    <td>
                                      <button type="submit" className="pobtn btn-sm" style={{ padding: '4px 12px', fontSize: '12px', whiteSpace: 'nowrap', display: 'inline-block' }}>
                                        {isEditing ? "Update" : "Add"}
                                      </button>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </form>
                          
      </div>
    </div>
  </div>
</div>
<div className="Deliverychallanstatus mt-4">
<div className="container-fluid p-0 text-start">
                      <div className="table-responsive">
                        <table className="table table-bordered w-100 m-0">
                          <thead>
                            <tr>
                              <th>Sr no.</th>
                              <th>Item No.</th>
                              <th>Item Code</th>
                              <th>HSN Code</th>
                              <th>Description</th>
                              <th>Purpose</th>
                              <th>Unit</th>
                              <th>Rate</th>
                              <th>Qty</th>
                              <th>Edit</th>
                              <th>Delete</th>
                            </tr>
                          </thead>
                          <tbody>
                            {challans.map((challan, index) => (
                              <tr key={challan.id}>
                                <td>{index + 1}</td>
                                <td>{challan.SelectItem}</td>
                                <td>{challan.ItemCode}</td>
                                <td>{challan.HSNCode}</td>
                                <td>{challan.Description}</td>
                                <td>{challan.Purpose}</td>
                                <td>{challan.Unit}</td>
                                <td>{challan.Rate}</td>
                                <td>{challan.Qty}</td>
                                <td>
                                  <FaEdit
                                    className="text-primary"
                                    onClick={() => handleEdit(challan)}
                                    style={{ cursor: "pointer" }}
                                  />
                                </td>
                                <td>
                                  <FaTrash
                                    className="text-danger"
                                    onClick={() => handleDelete(challan.id)}
                                    style={{ cursor: "pointer" }}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div
                    className="DeliverychallanFooter"
                    style={{ marginTop: "50px" }}
                  >
                    <ul
                      className="nav nav-pills mb-3"
                      id="pills-tab"
                      role="tablist"
                    ></ul>
                    <div className="tab-content" id="pills-tabContent">
                      <div
                        className="tab-pane fade show active"
                        id="pills-Gernal-Detail"
                        role="tabpanel"
                        aria-labelledby="pills-Gernal-Detail-tab"
                        tabindex="0"
                      >
                        <div className="card shadow-sm border-0 mt-4" style={{ borderRadius: '12px' }}>
  <div className="card-body text-start">
    <form onSubmit={handleSubmit1}>
                              <div className="row">
                                <div className="col-md-4 text-start">
                                  <div className="container-fluid">
                                    <div className="table-responsive">
                                      <table className="table table-bordered w-100 m-0">
                                        <tbody>
                                          <tr>
                                            <th className="col-md-4">
                                              Challan No:
                                            </th>
                                            <td>
                                              <input
                                                type="text"
                                                className="form-control"
                                                name="ChallanNo"
                                                value={formData1.ChallanNo}
                                                onChange={handleChange1}
                                                required
                                              />
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Vehicle No:</th>
                                            <td>
                                              <input
                                                type="text"
                                                className="form-control"
                                                name="VehicleNo"
                                                value={formData1.VehicleNo}
                                                onChange={handleChange1}
                                                required
                                              />
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Contractor:</th>
                                            <td>
                                              <input
                                                type="text"
                                                className="form-control"
                                                name="Contractor"
                                                value={formData1.Contractor}
                                                onChange={handleChange1}
                                                required
                                              />
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Challan Date:</th>
                                            <td>
                                              <input
                                                type="date"
                                                className="form-control"
                                                name="ChallanDate"
                                                value={formData1.ChallanDate}
                                                onChange={handleChange1}
                                                required
                                              />
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Transport:</th>
                                            <td>
                                              <input
                                                type="text"
                                                className="form-control"
                                                name="Transport"
                                                value={formData1.Transport}
                                                onChange={handleChange1}
                                                required
                                              />
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>E Way Bill No:</th>
                                            <td>
                                              <input
                                                type="text"
                                                className="form-control"
                                                name="EWayBillNo"
                                                value={formData1.EWayBillNo}
                                                onChange={handleChange1}
                                                required
                                              />
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-4 text-start">
                                  {/* Second Column Group */}
                                  <div className="container">
                                    <div className="table-responsive text-start">
                                      <table className="table table-bordered w-100 m-0">
                                        <tbody>
                                          <tr>
                                            <th>PO No:</th>
                                            <td>
                                              <input
                                                type="text"
                                                className="form-control"
                                                name="PoNo"
                                                value={formData1.PoNo}
                                                onChange={handleChange1}
                                                required
                                              />
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Ref.PErson No:</th>
                                            <td>
                                              <input
                                                type="text"
                                                className="form-control"
                                                name="Ref_Person"
                                                value={formData1.Ref_Person}
                                                onChange={handleChange1}
                                                required
                                              />
                                            </td>
                                          </tr>
                                          <tr>
                                            <th className="col-md-4">LR No:</th>
                                            <td>
                                              <input
                                                type="text"
                                                className="form-control"
                                                name="LrNo"
                                                value={formData1.LrNo}
                                                onChange={handleChange1}
                                                required
                                              />
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>PO Date:</th>
                                            <td>
                                              <input
                                                type="date"
                                                className="form-control"
                                                name="PoDate"
                                                value={formData1.PoDate}
                                                onChange={handleChange1}
                                                required
                                              />
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Department:</th>
                                            <td>
                                              <input
                                                type="text"
                                                className="form-control"
                                                name="Department"
                                                value={formData1.Department}
                                                onChange={handleChange1}
                                                required
                                              />
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Assessable Value:</th>
                                            <td>
                                              <input
                                                type="text"
                                                className="form-control"
                                                name="AssessableValue"
                                                value={
                                                  formData1.AssessableValue
                                                }
                                                onChange={handleChange1}
                                                required
                                              />
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-4 text-start">
                                  {/* Third Column Group */}
                                  <div className="container">
                                    <div className="table-responsive">
                                      <table className="table table-bordered w-100 m-0">
                                        <tbody>
                                          <tr>
                                            <th>CGST:</th>
                                            <td>
                                              <input
                                                type="text"
                                                className="form-control"
                                                name="CGST"
                                                value={formData1.CGST}
                                                onChange={handleChange1}
                                                required
                                              />
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>SGST:</th>
                                            <td>
                                              <input
                                                type="text"
                                                className="form-control"
                                                name="SGST"
                                                value={formData1.SGST}
                                                onChange={handleChange1}
                                                required
                                              />
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>IGST:</th>
                                            <td>
                                              <input
                                                type="text"
                                                className="form-control"
                                                name="IGST"
                                                value={formData1.IGST}
                                                onChange={handleChange1}
                                              />
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Grand Total:</th>
                                            <td>
                                              <input
                                                type="text"
                                                className="form-control"
                                                name="GrandTotal"
                                                value={formData1.GrandTotal}
                                                onChange={handleChange1}
                                                required
                                              />
                                            </td>
                                          </tr>

                                          <tr>
                                            <th>Remark:</th>
                                            <td>
                                              <textarea
                                                className="form-control"
                                                name="Remark"
                                                value={formData1.Remark}
                                                onChange={handleChange1}
                                                rows="2"
                                                required
                                              ></textarea>
                                            </td>
                                          </tr>

                                          <tr>
                                            <td
                                              colspan="2"
                                              className="text-center"
                                            >
                                              <button
                                                type="submit"
                                                className="btn"
                                              >
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

export default DeliveryChallan;




