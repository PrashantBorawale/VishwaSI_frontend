import "./NewPurchaseOrder.css";
import { useState, useEffect, useRef, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import NavBar from "../../NavBar/NavBar.js";
import SideNav from "../../SideNav/SideNav.js";
import ItemDetails from "./ItemDetails/ItemDetails.jsx";
import GSTDetails from "./GSTDetails/GSTDetails.jsx";
import ItemOther from "./ItemOther/ItemOther.jsx";
import Schedule from "./Schedule/Schedule.jsx";
import Ship from "./Ship/Ship.jsx";
import Poinfo from "./POInfo/Poinfo.jsx";
import {
  fetchSupplierData,
  fetchNextCode,
  registerPurchaseOrder,
  fetchPurchaseOrderById,
  updatePurchaseOrder,
} from "../../Service/PurchaseApi.jsx";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewPurchaseOrder = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState("");
  const [indentNo, setIndentNo] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [supplierCode, setSupplierCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoadingOrder, setIsLoadingOrder] = useState(isEditMode);
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

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

  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    Item_Detail_Enter: [],
    Gst_Details: [],
    Item_Details_Other: [],
    Schedule_Line: [],
    Ship_To_Add: [],
    field: "",
    Plant: "",
    PoNo: "",
    EnquiryNo: "",
    QuotNo: "",
    PaymentTerms: "",
    DeliveryDate: "",
    AMC_PO: "",
    ModeOfShipment: "",
    PreparedBy: "",
    PoNote: "",
    PoSpecification: "",
    PoDate: "",
    EnquiryDate: "",
    QuotDate: "",
    PaymentRemark: "",
    DeliveryType: "",
    DeliveryNote: "",
    IndentNo: "",
    ApprovedBy: "",
    InspectionTerms: "",
    PF_Charges: "",
    Time: "",
    PoFor: "",
    Freight: "",
    PoRateType: "",
    ContactPerson: "",
    PoValidityDate: "",
    PoEffectiveDate: "",
    TransportName: "",
    PoValidity_WarrantyTerm: "",
    GstTaxes: "",
    Type: "close",
    Series: "",
    Supplier: "",
    CodeNo: "",
  });

  const populateOrderData = useCallback((orderData) => {
    if (!orderData) return;
    setFormData((prev) => ({
      ...prev,
      ...orderData,
      Item_Detail_Enter: orderData.Item_Detail_Enter || orderData.items || [],
      Gst_Details: orderData.Gst_Details || [],
      Item_Details_Other: orderData.Item_Details_Other || [],
      Schedule_Line: orderData.Schedule_Line || [],
      Ship_To_Add: orderData.Ship_To_Add || [],
    }));
    setSelectedSeries(orderData.Series || orderData.series || "");
    setIndentNo(orderData.PoNo || orderData.po_no || "");
    setSupplierName(orderData.Supplier || orderData.supplier || "");
    setSupplierCode(orderData.CodeNo || orderData.code_no || "");
  }, []);

  useEffect(() => {
    const fetchOrderData = async () => {
      if (isEditMode) {
        // If state already has the order (e.g. clicked from list), populate immediately
        if (location.state?.order) {
          populateOrderData(location.state.order);
        }

        setIsLoadingOrder(true);
        try {
          const orderData = await fetchPurchaseOrderById(id);
          console.log("Fetched order data:", orderData);
          if (orderData) {
            populateOrderData(orderData);
            toast.success("Purchase order loaded successfully");
          }
        } catch (error) {
          console.error("Error fetching purchase order:", error);
          if (!location.state?.order) {
            toast.error("Failed to load purchase order");
          }
        } finally {
          setIsLoadingOrder(false);
        }
      }
    };

    fetchOrderData();
  }, [id, isEditMode, location.state, populateOrderData]);

  // Fetch Supplier Details and Extract State dynamically
  useEffect(() => {
    const fetchSupplierStateRules = async () => {
      if (!supplierName) return;

      try {
        const token = localStorage.getItem("accessToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        // Fetch from the full detailed API to guarantee we get State_Code
        const res = await fetch("https://sellerp-backend.onrender.com/All_Masters/api/SupplierData/", { headers });
        const data = await res.json();
        
        const suppNameOnly = supplierName.split('|')[0].trim().toLowerCase();
        const supplierInfo = data.find(s => (s.Name || "").toLowerCase() === suppNameOnly);
        
        if (supplierInfo) {
          const stateCode = supplierInfo.State_Code || "";
          console.log("Supplier Tax Info Loaded from API:", supplierInfo);
          setFormData(prev => ({
            ...prev,
            supplierState: stateCode
          }));
        }
      } catch (err) {
        console.error("Error fetching supplier state rules:", err);
      }
    };

    fetchSupplierStateRules();
  }, [supplierName]);

  const handleSeriesChange = async (e) => {
    if (isEditMode) return;

    const seriesValue = e.target.value;
    setSelectedSeries(seriesValue);
    setFormData((prevData) => ({ ...prevData, field: seriesValue, Series: seriesValue }));

    if (seriesValue.trim() === "" || !formData.Plant) {
      setIndentNo("");
      setFormData((prevData) => ({ ...prevData, PoNo: "" }));
      return;
    }

    const year = localStorage.getItem("Shortyear");

    if (!year) {
      console.error("Year is not available in localStorage.");
      setIndentNo("");
      setFormData((prevData) => ({ ...prevData, PoNo: "" }));
      return;
    }

    setLoading(true);
    try {
      const response = await fetchNextCode(seriesValue, year);
      if (response && response.next_code) {
        setIndentNo(response.next_code);
        setFormData((prevData) => ({ ...prevData, PoNo: response.next_code }));
      } else {
        setIndentNo("");
        setFormData((prevData) => ({ ...prevData, PoNo: "" }));
      }
    } catch (error) {
      console.error("Error fetching next code:", error);
      setIndentNo("");
      setFormData((prevData) => ({ ...prevData, PoNo: "" }));
    } finally {
      setLoading(false);
    }
  };

  const searchTimeoutRef = useRef(null);

  const handleSearchSupplier = (e) => {
    const value = e.target.value;
    setSupplierName(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!value.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await fetchSupplierData(value);
        if (Array.isArray(data) && data.length > 0) {
          setSearchResults(data);
          setShowDropdown(true);
        } else {
          setSearchResults([]);
          setShowDropdown(false);
        }
      } catch (error) {
        console.error("Error fetching supplier data:", error);
        setSearchResults([]);
        setShowDropdown(false);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const updateFormData = useCallback((field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  }, []);

  const validateCurrentTab = () => {
    return true;
  };

  const handleNext = () => {
    if (validateCurrentTab()) {
      setActiveTab((prevTab) => prevTab + 1);
    } else {
      toast.error("Please fill all required fields in the current tab.");
    }
  };

  const handlePrevious = () => {
    setActiveTab((prevTab) => prevTab - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalFormData = {
      ...formData,
      Supplier: formData.Supplier || supplierName,
      CodeNo: formData.CodeNo || supplierCode,
    };

    if (!finalFormData.field || !finalFormData.PoNo || !finalFormData.EnquiryNo) {
      toast.error("Field, PoNo, and EnquiryNo are required.");
      return;
    }

    if (!finalFormData.Supplier || !finalFormData.CodeNo) {
      toast.error("Supplier and Code No are required. Please select a supplier.");
      return;
    }

    const formattedData = {
      ...finalFormData,
      PoValidityDate: finalFormData.PoValidityDate || null,
      Schedule_Line: (finalFormData.Schedule_Line || []).map((item) => {
        // Remove any leftover array fields, keep only named fields
        const { Dates, Quantities, ...rest } = item;
        return {
          ...rest,
          ItemCode: item.ItemCode ? item.ItemCode.substring(0, 30).trim() : "",
        };
      }),
      Item_Detail_Enter: (finalFormData.Item_Detail_Enter || []).map((item) => {
        const {
          HSN_SAC_Code,
          Number: itemNumber,
          PartCode,
          CGST,
          IGST,
          SGST,
          UTGST,
          GST_Details,
          Schedule_Line,
          ...filteredItem
        } = item;
        
        return {
          ...filteredItem,
          Item: (filteredItem.Item || "").substring(0, 30).trim(),
          Rate: Number(filteredItem.Rate) || 0,
          Qty: Number(filteredItem.Qty) || 0,
          Disc: Number(filteredItem.Disc) || 0,
          Particular: filteredItem.Particular === "I" ? "Item" : filteredItem.Particular,
        };
      }),
      Gst_Details: (finalFormData.Gst_Details || []).map((gst) => ({
        ...gst,
        ItemCode: (gst.ItemCode || "").substring(0, 30).trim(),
        Rate: Number(gst.Rate) || 0,
        Qty: Number(gst.Qty) || 0,
        CGST: Number(gst.CGST) || 0,
        SGST: Number(gst.SGST) || 0,
        IGST: Number(gst.IGST) || 0,
      })),
    };

    const gstData = finalFormData.Gst_Details && finalFormData.Gst_Details.length > 0 ? finalFormData.Gst_Details[0] : {};
    
    const grTotal = (finalFormData.Gst_Details || []).reduce((acc, item) => acc + (Number(item.Total) || 0), 0);
    const calcCgst = (finalFormData.Gst_Details || []).reduce((acc, item) => acc + (Number(item.CGSTAmt) || 0), 0);
    const calcSgst = (finalFormData.Gst_Details || []).reduce((acc, item) => acc + (Number(item.SGSTAmt) || 0), 0);
    const calcIgst = (finalFormData.Gst_Details || []).reduce((acc, item) => acc + (Number(item.IGSTAmt) || 0), 0);
    const calcAssable = (finalFormData.Gst_Details || []).reduce((acc, item) => acc + (Number(item.AssValue) || 0), 0);

    const extraCharges = 
      (Number(gstData.TOC_PackCharges) || 0) +
      (Number(gstData.TOC_TransportCost) || 0) +
      (Number(gstData.TOC_Insurance) || 0) +
      (Number(gstData.TOC_InstallationCharges) || 0) +
      (Number(gstData.TOC_VAT) || 0) +
      (Number(gstData.TOC_CESS) || 0);

    const tds = Number(gstData.TOC_TDS) || 0;
    const finalGrTotal = grTotal + extraCharges - tds;

    formattedData.TOC_AssableValue = gstData.TOC_AssableValue !== undefined && gstData.TOC_AssableValue !== "" ? gstData.TOC_AssableValue : calcAssable.toFixed(2);
    formattedData.TOC_PackCharges = gstData.TOC_PackCharges || null;
    formattedData.TOC_TransportCost = gstData.TOC_TransportCost || null;
    formattedData.TOC_Insurance = gstData.TOC_Insurance || null;
    formattedData.TOC_InstallationCharges = gstData.TOC_InstallationCharges || null;
    formattedData.TOC_CGST = gstData.TOC_CGST !== undefined && gstData.TOC_CGST !== "" ? gstData.TOC_CGST : calcCgst.toFixed(2);
    formattedData.TOC_SGST = gstData.TOC_SGST !== undefined && gstData.TOC_SGST !== "" ? gstData.TOC_SGST : calcSgst.toFixed(2);
    formattedData.TOC_IGST = gstData.TOC_IGST !== undefined && gstData.TOC_IGST !== "" ? gstData.TOC_IGST : calcIgst.toFixed(2);
    formattedData.TOC_VAT = gstData.TOC_VAT || null;
    formattedData.TOC_CESS = gstData.TOC_CESS || null;
    formattedData.TOC_TDS = gstData.TOC_TDS || null;
    formattedData.GR_Total = finalGrTotal.toFixed(2);

    console.log("Final Data Being Sent:", formattedData);

    try {
      let response;

      if (isEditMode) {
        response = await updatePurchaseOrder(id, formattedData);
        console.log("Purchase order updated successfully", response);
        toast.success("Purchase order updated successfully");
      } else {
        response = await registerPurchaseOrder(formattedData);
        console.log("Purchase order saved successfully", response);
        toast.success("Purchase order saved successfully");
      }

      setTimeout(() => {
        navigate("/PoList");
      }, 2000);
    } catch (error) {
      console.error("Error saving purchase order:", error?.message || error);
      if (error.response && error.response.data) {
        const errData = error.response.data;
        if (typeof errData === "string") {
          toast.error(errData);
        } else if (errData.error) {
          toast.error(errData.error);
        } else if (typeof errData === "object") {
          const messages = Object.entries(errData)
            .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(" ") : val}`)
            .join(" | ");
          toast.error(messages || "An error occurred while saving.");
        } else {
          toast.error("An unexpected error occurred.");
        }
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const handleSelectSupplier = (supplier) => {
    const name = supplier.Name || supplier?.Name || supplierName;
    const code = supplier.number || supplier?.number || supplierCode;
    const state = supplier.State_Code || supplier?.State_Code || "";
    
    setSupplierName(name);
    setSupplierCode(code);
    setFormData((prevData) => ({
      ...prevData,
      Supplier: name,
      CodeNo: code,
      PaymentTerms: supplier.Payment_Term || prevData.PaymentTerms,
      supplierState: state,
    }));
    setShowDropdown(false);
    
    console.log("Supplier selected:", { name, code, state });
  };

  const handleClear = () => {
    if (isEditMode) {
      navigate("/new-purchase-order");
    } else {
      setFormData({
        Item_Detail_Enter: [], Gst_Details: [], Item_Details_Other: [], Schedule_Line: [], Ship_To_Add: [], field: "", Plant: "", PoNo: "", EnquiryNo: "", QuotNo: "", PaymentTerms: "", DeliveryDate: "", AMC_PO: "", ModeOfShipment: "", PreparedBy: "", PoNote: "", PoSpecification: "", PoDate: "", EnquiryDate: "", QuotDate: "", PaymentRemark: "", DeliveryType: "", DeliveryNote: "", IndentNo: "", ApprovedBy: "", InspectionTerms: "", PF_Charges: "", Time: "", PoFor: "", Freight: "", PoRateType: "", ContactPerson: "", PoValidityDate: "", PoEffectiveDate: "", TransportName: "", PoValidity_WarrantyTerm: "", GstTaxes: "", Type: "close", Series: "", Supplier: "", CodeNo: "",
      });
      setSelectedSeries("");
      setIndentNo("");
      setSupplierName("");
      setSupplierCode("");
    }
  };

  if (isLoadingOrder) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="erp-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="Main-NavBar">
              <NavBar toggleSideNav={toggleSideNav} />
              <SideNav sideNavOpen={sideNavOpen} toggleSideNav={toggleSideNav} />
              <main className={`main-content ${sideNavOpen ? "shifted" : ""}`}>
                <div className="p-4 overflow-hidden">
                  
                  {/* Header */}
                  <div className="erp-header mb-4">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                      <h5 className="header-title mb-0">
                        {isEditMode ? "Edit Purchase Order" : "New Purchase Order"}
                      </h5>
                      <div className="d-flex gap-2">
                        {/* Clear button removed per user request */}
                        <button className="vndrbtn" onClick={() => navigate('/PoList')}>
                          <i className="fas fa-list me-2"></i> PO List
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Control Panel Section */}
                  <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '12px' }}>
                    <div className="card-body">
                      <div className="row g-3 align-items-end text-start">
                        <div className="col-md-2">
                          <label className="form-label w-100 fw-bold text-secondary" style={{ fontSize: '0.85rem' }}>Type</label>
                          <select className="form-select" value={formData.Type || "close"} onChange={(e) => setFormData((prev) => ({ ...prev, Type: e.target.value }))} disabled={isEditMode}>
                            <option value="close">Close</option>
                            <option value="Open">Open</option>
                          </select>
                        </div>
                        <div className="col-md-2">
                          <label className="form-label w-100 fw-bold text-secondary" style={{ fontSize: '0.85rem' }}>Plant</label>
                          <select className="form-select" value={formData.Plant || ""} onChange={(e) => setFormData((prev) => ({ ...prev, Plant: e.target.value }))} disabled={isEditMode}>
                            <option value="">Select</option>
                            <option value="VISHWA S.I.">VISHWA S.I.</option>
                          </select>
                        </div>
                        <div className="col-md-2">
                          <label className="form-label w-100 fw-bold text-secondary" style={{ fontSize: '0.85rem' }}>Series</label>
                          <select className="form-select" value={selectedSeries} onChange={handleSeriesChange} disabled={!formData.Plant || isEditMode}>
                            <option value="">Select</option>
                            <option value="RM">RM</option>
                            <option value="CONSUMABLE">CONSUMABLE</option>
                            <option value="ASSET">ASSET</option>
                            <option value="SERVICE">SERVICE</option>
                          </select>
                        </div>
                        {((formData.Plant && selectedSeries) || isEditMode) && (
                          <div className="col-md-2">
                            <label className="form-label w-100 fw-bold text-secondary" style={{ fontSize: '0.85rem' }}>Indent No</label>
                            <input type="text" className="form-control bg-light" value={indentNo} readOnly />
                          </div>
                        )}
                        <div className="col-md-3 position-relative">
                          <label className="form-label w-100 fw-bold text-secondary" style={{ fontSize: '0.85rem' }}>Supplier</label>
                          <div className="d-flex gap-1">
                            <input type="text" className="form-control" value={supplierName} onChange={handleSearchSupplier} disabled={loading || isEditMode} />
                            <button 
                              className="btn btn-primary" 
                              disabled={loading || isEditMode || searchResults.length === 0 || !!supplierCode}
                              onClick={(e) => {
                                e.preventDefault();
                                if (supplierCode) { toast.info("Supplier is already selected."); return; }
                                if (searchResults.length > 0) handleSelectSupplier(searchResults[0]);
                                else toast.warning("Please search for a supplier first");
                              }}
                            >
                              {loading ? "..." : "Select"}
                            </button>
                          </div>
                          {showDropdown && searchResults.length > 0 && (
                            <ul className="list-group position-absolute w-100 mt-1" style={{ zIndex: 1000, maxHeight: "200px", overflowY: "auto" }}>
                              {searchResults.map((supplier) => (
                                <li 
                                  key={supplier.number} 
                                  className="list-group-item list-group-item-action" 
                                  style={{ cursor: "pointer", fontSize: "0.85rem" }}
                                  onClick={() => handleSelectSupplier(supplier)}
                                >
                                  {supplier.Name} <strong>({supplier.number})</strong>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        {((formData.Plant && selectedSeries) || isEditMode) && (
                          <div className="col-md-1">
                            <label className="form-label w-100 fw-bold text-secondary" style={{ fontSize: '0.85rem' }}>Code No</label>
                            <input type="text" className="form-control bg-light" value={supplierCode} readOnly />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tabs Section */}
                  <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '12px' }}>
                      <div className="card-header bg-white border-bottom-0 pt-3 pb-0">
                        <ul className="nav nav-tabs nav-tabs-custom" role="tablist">
                          {["Item Details", "GST Details", "Item Details Other", "Schedule Line", "Ship To Add", "PO Info"].map((tabName, idx) => (
                            <li className="nav-item" role="presentation" key={idx}>
                              <button 
                                type="button"
                                className={`nav-link text-secondary fw-bold ${activeTab === idx ? "active border-primary text-primary" : "border-transparent"}`}
                                onClick={() => setActiveTab(idx)}
                                style={{
                                  borderBottomWidth: activeTab === idx ? "2px" : "0",
                                  backgroundColor: "transparent",
                                  borderTop: "none",
                                  borderLeft: "none",
                                  borderRight: "none",
                                }}
                              >
                                {tabName}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="card-body p-0">
                        <div className="tab-content" style={{ maxHeight: 'calc(100vh - 380px)', overflowY: 'auto' }}>
                          <div className={`tab-pane fade ${activeTab === 0 ? "show active" : ""}`}>
                            {activeTab === 0 && <ItemDetails updateFormData={updateFormData} supplierCode={supplierCode} supplierState={formData.supplierState} existingItems={formData.Item_Detail_Enter} isEditMode={isEditMode} />}
                          </div>
                          <div className={`tab-pane fade ${activeTab === 1 ? "show active" : ""}`}>
                            {activeTab === 1 && <GSTDetails updateFormData={updateFormData} itemDetails={formData.Item_Detail_Enter} existingGstDetails={formData.Gst_Details} supplierState={formData.supplierState} />}
                          </div>
                          <div className={`tab-pane fade ${activeTab === 2 ? "show active" : ""}`}>
                            {activeTab === 2 && <ItemOther updateFormData={updateFormData} itemDetails={formData.Item_Detail_Enter} existingItemOther={formData.Item_Details_Other} />}
                          </div>
                          <div className={`tab-pane fade ${activeTab === 3 ? "show active" : ""}`}>
                            {activeTab === 3 && <Schedule updateFormData={updateFormData} itemDetails={formData.Item_Detail_Enter} existingSchedule={formData.Schedule_Line} />}
                          </div>
                          <div className={`tab-pane fade ${activeTab === 4 ? "show active" : ""}`}>
                            {activeTab === 4 && <Ship updateFormData={updateFormData} existingShipData={formData.Ship_To_Add && formData.Ship_To_Add.length > 0 ? formData.Ship_To_Add[0] : null} />}
                          </div>
                          <div className={`tab-pane fade ${activeTab === 5 ? "show active" : ""}`}>
                            {activeTab === 5 && <Poinfo updateFormData={updateFormData} paymentTermsFromSupplier={formData.PaymentTerms} poInfoData={formData} isEditMode={isEditMode} />}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-3">
                      {activeTab > 0 && (
                        <button type="button" className="vndrbtn bg-secondary border-secondary" onClick={handlePrevious}>
                          Previous
                        </button>
                      )}
                      {activeTab < 5 ? (
                        <button type="button" className="vndrbtn bg-primary border-primary" onClick={handleNext}>
                          Next
                        </button>
                      ) : (
                        <button type="submit" className="vndrbtn bg-success border-success">
                          {isEditMode ? "Update Purchase Order" : "Save Purchase Order"}
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPurchaseOrder;