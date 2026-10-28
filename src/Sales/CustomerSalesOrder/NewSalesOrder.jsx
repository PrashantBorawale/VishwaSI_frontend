import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import NavBar from "../../NavBar/NavBar.js";
import SideNav from "../../SideNav/SideNav.js";
import "./NewSalesOrder.css";
// import Cached from "@mui/icons-material/Cached.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrash } from "react-icons/fa";

const NewSalesOrder = () => {
  const location = useLocation();
  const editId = location.state?.id || null;
  const isEditing = !!editId;

  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [, setSoNoLoading] = useState(false);
  const [soNoError, setSoNoError] = useState(null);

  // New States for Items Integration
  const [itemsList, setItemsList] = useState([]); // API items
  const [orderItems, setOrderItems] = useState([]); // Table added items
  const [currentItem, setCurrentItem] = useState({
    selectedSearch: "",
    part_no: "",
    item_no: "",
    part_code: "",
    description: "",
    rate: "",
    qty: "",
    uom: "NOS",
    hsn: "",
    cgst: "",
    igst: "",
    sgst: "",
    utgst: "",
    item_wt: "",
    hsn_code: null,
    assessable_value: "0.0000",
    subtotal: "0.00",
    gr_total: "0.00",
    discount: "",
    pkg_trans: "",
    plan_date_item: "",
    due_date_item: "",
    type_item: "",
    remark_item: "",
    item_size: "",
  });

  const [customerTaxType, setCustomerTaxType] = useState("INTERSTATE");

  const [extraCharges, setExtraCharges] = useState([
    { isChecked: false, name: "Pack Forward Charges", percent: "", amount: "" },
    { isChecked: false, name: "Transport Charges", percent: "", amount: "" },
    { isChecked: false, name: "Freight Charges", percent: "", amount: "" },
    { isChecked: false, name: "Other_ Charges", percent: "", amount: "" },
  ]);

  // API  state
  const [formData, setFormData] = useState({
    cust_date: "",
    plant: "VISHWA S.I.",
    order_type: "",
    order_status: "",
    customer: "",
    cust_po: "",
    pay_day: "",
    pay_note: "",
    valid_up: "",
    so_date: "",
    so_no: "",
    po_rec_date: "",
    incoterms: "",
    bill_to: "",
    ship_to: "",
    ship_to_add_code: "",
    ccn_no: "",
    delivery_date: "",
    buyer_name: "",
    packing: "",
    shift: "",
    plan_date: "",
    lc_no: "",
    sales_person: "",
    site_name: "",
    project_name: "",
    delivery_al: " ",
    terms: "",
    series: "",
  });

  // 1. Fetch Customers and Items on Load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const custRes = await fetch(
          "https://sellerp-backend.onrender.com/Sales/items/customers-list/"
        );
        const custData = await custRes.json();
        setCustomers(Array.isArray(custData) ? custData : custData.data || []);

        const itemRes = await fetch("https://sellerp-backend.onrender.com/Sales/items-list/");
        const itemData = await itemRes.json();
        setItemsList(Array.isArray(itemData) ? itemData : itemData.data || []);
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };
    fetchData();
  }, []);

  // 2. Fetch SO No or existing data
  useEffect(() => {
    if (isEditing) {
      const fetchEditData = async () => {
        try {
          const res = await fetch(`https://sellerp-backend.onrender.com/Sales/newsalesorder/${editId}/`);
          if (res.ok) {
            const data = await res.json();
            setFormData({
              cust_date: data.cust_date || "",
              plant: data.plant || "VISHWA S.I.",
              order_type: data.order_type || "",
              order_status: data.order_status || "",
              customer: data.customer || "",
              cust_po: data.cust_po || "",
              pay_day: data.pay_day || "",
              pay_note: data.pay_note || "",
              valid_up: data.valid_up || "",
              so_date: data.so_date || "",
              so_no: data.so_no || "",
              po_rec_date: data.po_rec_date || "",
              incoterms: data.incoterms || "",
              bill_to: data.bill_to || "",
              ship_to: data.ship_to || "",
              ship_to_add_code: data.ship_to_add_code || "",
              ccn_no: data.ccn_no || "",
              delivery_date: data.delivery_date || "",
              buyer_name: data.buyer_name || "",
              packing: data.packing || "",
              shift: data.shift || "",
              plan_date: data.plan_date || "",
              lc_no: data.lc_no || "",
              sales_person: data.sales_person || "",
              site_name: data.site_name || "",
              project_name: data.project_name || "",
              delivery_al: data.delivery_al || "",
              terms: data.terms || "",
            });
            if (data.item && Array.isArray(data.item)) {
              setOrderItems(data.item);
            }
          } else {
            toast.error("Failed to load Sales Order data for editing");
          }
        } catch (error) {
          console.error("Fetch Edit Error:", error);
          toast.error("Error loading Sales Order data");
        }
      };
      fetchEditData();
    } else {
      const fetchSoNo = async () => {
        try {
          setSoNoLoading(true);
          setSoNoError(null);
          const response = await fetch(
            "https://sellerp-backend.onrender.com/Sales/generate-so-no/"
          );
          if (response.ok) {
            const data = await response.json();
            const soNo = data.so_no || data.SO_No || data.soNo || data.data?.so_no || "";
            setFormData((prev) => ({
              ...prev,
              so_no: soNo,
            }));
          } else {
            setSoNoError("Failed to fetch SO No");
          }
        } catch (error) {
          console.error("SO No fetch error:", error);
          setSoNoError(error.message);
        } finally {
          setSoNoLoading(false);
        }
      };
      fetchSoNo();
    }
  }, [isEditing, editId]);

  // Handle Customer Selection & Auto-fill Ship To
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "customer") {
      const selectedCust = customers.find(
        (c) => `${c.Name} | ${c.number}` === value || c.Name === value
      );

      if (selectedCust) {
        setFormData((prev) => ({
          ...prev,
          customer: `${selectedCust.Name} | ${selectedCust.number}`,
          ship_to: selectedCust.Name,
          pay_day: selectedCust.Payment_Term || "",
          incoterms: selectedCust.Incoterms || "",
        }));
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch Customer Details and Update Tax Type dynamically
  useEffect(() => {
    const fetchCustomerTaxRules = async () => {
      const customerName = formData.customer;
      if (!customerName) return;

      try {
        const token = localStorage.getItem("accessToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        // Fetch from the full detailed API to guarantee we get State_Code
        const res = await fetch("https://sellerp-backend.onrender.com/All_Masters/api/SupplierData/", { headers });
        const data = await res.json();
        
        const custNameOnly = customerName.split('|')[0].trim().toLowerCase();
        const customerInfo = data.find(c => (c.Name || "").toLowerCase() === custNameOnly);
        
        let taxType = "INTERSTATE";
        if (customerInfo) {
          console.log("Customer Tax Info Loaded from API:", customerInfo);
          const stateCode = customerInfo.State_Code || "";
          const stateName = (customerInfo.Region || "").toLowerCase();
          
          if (stateCode === "27" || stateName.includes("maharashtra") || stateName === "mh") {
            taxType = "LOCAL";
          } else if (["35", "04", "26", "31", "38"].includes(stateCode) || 
                     stateName.includes("chandigarh") || stateName.includes("daman") || 
                     stateName.includes("andaman") || stateName.includes("lakshadweep") || 
                     stateName.includes("ladakh")) {
            taxType = "UT";
          }
        }
        setCustomerTaxType(taxType);
      } catch (err) {
        console.error("Error fetching customer tax rules:", err);
      }
    };

    fetchCustomerTaxRules();
  }, [formData.customer]);



  // Handle Item Search Selection
  const handleItemSearchChange = (e) => {
    const val = e.target.value;
    setCurrentItem((prev) => ({ ...prev, selectedSearch: val }));

    const item = itemsList.find(
      (i) => `${i.part_no} | ${i.Part_Code} | ${i.Name_Description}` === val
    );

    if (item) {
      setCurrentItem({
        selectedSearch: val,
        part_no: item.part_no,
        item_no: item.part_no,
        part_code: item.Part_Code,
        description: item.Name_Description,
        rate: item.Rate || "",
        qty: "",
        uom: item.Unit_Code || "NOS",
        hsn: item.HSN_SAC_Code || "",
        hsn_code: item.HSN_SAC_Code || null,
        cgst: item.tax_details?.CGST || "",
        sgst: item.tax_details?.SGST || "",
        igst: item.tax_details?.IGST || "",
        utgst: item.tax_details?.UTGST || "",
        item_wt: item.Gross_Weight || "",
        item_size: item.Item_Size || item.item_size || "",
      });
    }
  };


  // UPDATE addItemToTable function - REPLACE THE ENTIRE FUNCTION
  const addItemToTable = () => {
    if (!currentItem.part_no || !currentItem.qty) {
      toast.warning("⚠️ Please select an item and enter quantity!");
      return;
    }

    const rate = parseFloat(currentItem.rate) || 0;
    const qty = parseFloat(currentItem.qty) || 0;
    const rawSubtotal = rate * qty;
    
    // Discount Calculation (Assuming currentItem.discount is a percentage)
    const discountPercent = parseFloat(currentItem.discount) || 0;
    const descAmt = (rawSubtotal * discountPercent) / 100;
    const discountedSubtotal = rawSubtotal - descAmt;
    
    // Subtotal and assessable value are now based on discounted amount
    const subtotal = discountedSubtotal;

    // Percentages - Fetch exactly from the item's HSN data
    const rawCgst = parseFloat(currentItem.cgst) || 0;
    const rawSgst = parseFloat(currentItem.sgst) || 0;
    const rawIgst = parseFloat(currentItem.igst) || 0;
    const rawUtgst = parseFloat(currentItem.utgst) || 0;

    let cgstPer = 0;
    let sgstPer = 0;
    let igstPer = 0;
    let utgstPer = 0;

    if (customerTaxType === "LOCAL") {
      cgstPer = rawCgst;
      sgstPer = rawSgst;
      // Safety fallback: if item only had IGST defined, split it
      if (cgstPer === 0 && sgstPer === 0 && rawIgst > 0) {
        cgstPer = rawIgst / 2;
        sgstPer = rawIgst / 2;
      }
    } else if (customerTaxType === "UT") {
      cgstPer = rawCgst;
      utgstPer = rawUtgst > 0 ? rawUtgst : rawSgst; // fallback to SGST if UTGST is empty
      if (cgstPer === 0 && utgstPer === 0 && rawIgst > 0) {
        cgstPer = rawIgst / 2;
        utgstPer = rawIgst / 2;
      }
    } else {
      igstPer = rawIgst;
      // Safety fallback: if item only had CGST+SGST defined, combine them for IGST
      if (igstPer === 0 && (rawCgst > 0 || rawSgst > 0)) {
        igstPer = rawCgst + rawSgst;
      }
    }

    // Amounts
    const cgstAmt = (subtotal * cgstPer) / 100;
    const sgstAmt = (subtotal * sgstPer) / 100;
    const igstAmt = (subtotal * igstPer) / 100;
    const utgstAmt = (subtotal * utgstPer) / 100;
    
    const totalTax = cgstAmt + sgstAmt + igstAmt + utgstAmt;
    const grandTotal = subtotal + totalTax;

    const newItem = {
      id: Date.now(),

      // Display + API 
      part_no: currentItem.part_no,
      item_no: currentItem.item_no,
      part_code: currentItem.part_code,
      description: currentItem.description,
      hsn: currentItem.hsn,
      
      // Percentages
      cgst: cgstPer.toFixed(2),
      sgst: sgstPer.toFixed(2),
      igst: igstPer.toFixed(2),
      utgst: utgstPer.toFixed(2),

      // Calculated Amounts
      cgst_amt: cgstAmt.toFixed(2),
      sgst_amt: sgstAmt.toFixed(2),
      igst_amt: igstAmt.toFixed(2),
      utgst_amt: utgstAmt.toFixed(2),

      // API required
      rev_no: "0",
      item_code: currentItem.part_code,
      item_description: currentItem.description,
      item_size: currentItem.item_size || "",
      Item_Size: currentItem.item_size || "",

      rate: rate,
      qty: qty,
      uom: currentItem.uom,
      item_wt: currentItem.item_wt || "",

      line_no: "",
      pr_no: "",
      rm_type: "",
      pkg_trans: currentItem.pkg_trans || "",
      due_date: currentItem.due_date_item || null,
      plan_date_item: currentItem.plan_date_item || "",
      type: currentItem.type_item || "",
      item_category: "",
      remark: currentItem.remark_item || "",
      discount: currentItem.discount || "",
      desc: currentItem.discount || null,
      desc_amt: descAmt.toFixed(2),
      hsn_code: currentItem.hsn_code || null,
      assessable_value: subtotal.toFixed(2),
      subtotal: subtotal.toFixed(2),
      gr_total: grandTotal.toFixed(2),
    };

    setOrderItems([...orderItems, newItem]);
    toast.success("Item added to order!");

    setCurrentItem({
      selectedSearch: "",
      part_no: "",
      item_no: "",
      part_code: "",
      description: "",
      rate: "",
      qty: "",
      uom: "NOS",
      hsn: "",
      cgst: "",
      sgst: "",
      igst: "",
      utgst: "",
      item_wt: "",
      hsn_code: null,
      assessable_value: "0.0000",
      subtotal: "0.00",
      gr_total: "0.00",
      discount: "",
      pkg_trans: "",
      plan_date_item: "",
      due_date_item: "",
      type_item: "",
      remark_item: "",
      item_size: "",
    });
  };

  const handleEditItem = (item) => {
    setCurrentItem({
      selectedSearch: `${item.part_no} | ${item.part_code} | ${item.description}`,
      part_no: item.part_no || "",
      item_no: item.item_no || "",
      part_code: item.part_code || item.item_code || "",
      description: item.description || item.item_description || "",
      rate: item.rate || "",
      qty: item.qty || "",
      uom: item.uom || "NOS",
      hsn: item.hsn || "",
      cgst: item.cgst || "",
      sgst: item.sgst || "",
      igst: item.igst || "",
      utgst: item.utgst || "",
      item_wt: item.item_wt || "",
      hsn_code: item.hsn_code || null,
      assessable_value: item.assessable_value || "0.0000",
      subtotal: item.subtotal || "0.00",
      gr_total: item.gr_total || "0.00",
      discount: item.discount || "",
      pkg_trans: item.pkg_trans || "",
      plan_date_item: item.plan_date_item || "",
      due_date_item: item.due_date || "",
      type_item: item.type || "",
      remark_item: item.remark || "",
      item_size: item.item_size || item.Item_Size || "",
    });
    setOrderItems(orderItems.filter(i => i.id !== item.id));
  };


  const handleSaveOrder = async () => {
    try {
      if (!formData.so_date) {
        toast.error("So Date is mandatory.");
        document.getElementById('taxes-tab')?.click();
        return;
      }
      if (!formData.po_rec_date) {
        toast.error("Po Rec Date is mandatory.");
        document.getElementById('taxes-tab')?.click();
        return;
      }
      if (!formData.delivery_date) {
        toast.error("Delivery Date is mandatory.");
        document.getElementById('taxes-tab')?.click();
        return;
      }
      if (!formData.plan_date) {
        toast.error("Plan Date is mandatory.");
        document.getElementById('taxes-tab')?.click();
        return;
      }

      // Calculate Top Level Totals
      const totalSubtotal = orderItems.reduce((acc, item) => acc + parseFloat(item.subtotal || 0), 0);
      const totalCgstAmt = orderItems.reduce((acc, item) => acc + parseFloat(item.cgst_amt || 0), 0);
      const totalSgstAmt = orderItems.reduce((acc, item) => acc + parseFloat(item.sgst_amt || 0), 0);
      const totalIgstAmt = orderItems.reduce((acc, item) => acc + parseFloat(item.igst_amt || 0), 0);
      const totalUtgstAmt = orderItems.reduce((acc, item) => acc + parseFloat(item.utgst_amt || 0), 0);
      const currentExtraChargesTotal = extraCharges.reduce((sum, charge) => charge.isChecked ? sum + (parseFloat(charge.amount) || 0) : sum, 0);
      const totalGrTotal = orderItems.reduce((acc, item) => acc + parseFloat(item.gr_total || 0), 0) + currentExtraChargesTotal;

      const sanitizeDate = (val) => (val === "" ? null : val);

      const payload = {
        ...formData,
        l_c_no: formData.lc_no,
        cust_date: sanitizeDate(formData.cust_date),
        so_date: sanitizeDate(formData.so_date),
        po_rec_date: sanitizeDate(formData.po_rec_date),
        valid_up: sanitizeDate(formData.valid_up),
        delivery_date: sanitizeDate(formData.delivery_date),
        plan_date: sanitizeDate(formData.plan_date),
        shift: sanitizeDate(formData.shift),
        // Top-level tax summaries
        subtotal: totalSubtotal.toFixed(2),
        cgst: orderItems[0]?.cgst || "0.00",
        sgst: orderItems[0]?.sgst || "0.00",
        igst: orderItems[0]?.igst || "0.00",
        utgst: orderItems[0]?.utgst || "0.00",
        cgst_amt: totalCgstAmt.toFixed(2),
        sgst_amt: totalSgstAmt.toFixed(2),
        igst_amt: totalIgstAmt.toFixed(2),
        utgst_amt: totalUtgstAmt.toFixed(2),
        pack_forward_charges: extraCharges[0].isChecked && extraCharges[0].amount ? extraCharges[0].amount : null,
        transport_charges: extraCharges[1].isChecked && extraCharges[1].amount ? extraCharges[1].amount : null,
        freight_charges: extraCharges[2].isChecked && extraCharges[2].amount ? extraCharges[2].amount : null,
        other_charges: extraCharges[3].isChecked && extraCharges[3].amount ? extraCharges[3].amount : null,
        gr_total: totalGrTotal.toFixed(2),

        item: orderItems.map(item => ({
          rev_no: item.rev_no || "0",
          item_no: item.item_no,
          item_code: item.item_code,
          item_description: item.item_description,
          item_size: item.item_size || item.Item_Size || "",
          rate: parseFloat(item.rate) || 0,
          desc: item.desc || null,
          desc_amt: item.desc_amt || "0.00",
          qty: parseFloat(item.qty) || 0,
          uom: item.uom,
          item_wt: item.item_wt || "",
          line_no: item.line_no || "",
          pr_no: item.pr_no || "",
          rm_type: item.rm_type || "",
          pkg_trans: item.pkg_trans || "",
          due_date: item.due_date || null,
          type: item.type || "",
          item_category: item.item_category || "",
          remark: item.remark || "",
          hsn_code: item.hsn_code || null,
          assessable_value: item.assessable_value || "0.00",
          subtotal: item.subtotal || "0.00",
          cgst: item.cgst || "0.00",
          sgst: item.sgst || "0.00",
          igst: item.igst || "0.00",
          utgst: item.utgst || "0.00",
          cgst_amt: item.cgst_amt || "0.00",
          sgst_amt: item.sgst_amt || "0.00",
          igst_amt: item.igst_amt || "0.00",
          utgst_amt: item.utgst_amt || "0.00",
          gr_total: item.gr_total || "0.00",
        }))
      };

      // Remove file from payload because it's a JSON request
      delete payload.file;
      delete payload.lc_no; // Using l_c_no instead

      console.log("Sending Payload:", JSON.stringify(payload, null, 2));

      const url = isEditing
        ? `https://sellerp-backend.onrender.com/Sales/newsalesorder/${editId}/`
        : "https://sellerp-backend.onrender.com/Sales/newsalesorder/";

      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();

      if (!res.ok) {
        console.error("Server Error Response:", responseData);
        toast.error(responseData.message || "Failed to save order. Please check all fields.");
        return;
      }

      toast.success(isEditing ? "Order updated successfully!" : "Order saved successfully!");

      // Reset form after successful save
      setTimeout(() => {
        setFormData({
          cust_date: "",
          plant: "VISHWA S.I.",
          order_type: "",
          order_status: "",
          customer: "",
          cust_po: "",
          pay_day: "",
          pay_note: "",
          valid_up: "",
          so_date: "",
          so_no: "",
          po_rec_date: "",
          incoterms: "",
          bill_to: "",
          ship_to: "",
          ship_to_add_code: "",
          ccn_no: "",
          delivery_date: "",
          buyer_name: "",
          packing: "",
          shift: "",
          plan_date: "",
          lc_no: "",
          sales_person: "",
          site_name: "",
          project_name: "",
          delivery_al: " ",
          terms: "",
          series: "",
        });
        setOrderItems([]);
        navigate("/CustomerSalesOrderList");
      }, 1500);

    } catch (err) {
      console.error("Catch Error:", err);
      toast.error("Network error. Please check your connection.");
    }
  };






  useEffect(() => {
    if (sideNavOpen) {
      document.body.classList.add("side-nav-open");
    } else {
      document.body.classList.remove("side-nav-open");
    }
  }, [sideNavOpen]);

  // GST Calculations
  const totalSubtotal = orderItems.reduce((acc, item) => acc + parseFloat(item.subtotal || 0), 0);
  const totalCgstAmt = orderItems.reduce((acc, item) => acc + parseFloat(item.cgst_amt || 0), 0);
  const totalSgstAmt = orderItems.reduce((acc, item) => acc + parseFloat(item.sgst_amt || 0), 0);
  const totalIgstAmt = orderItems.reduce((acc, item) => acc + parseFloat(item.igst_amt || 0), 0);
  const totalUtgstAmt = orderItems.reduce((acc, item) => acc + parseFloat(item.utgst_amt || 0), 0);
  const extraChargesTotal = extraCharges.reduce((sum, charge) => {
    return charge.isChecked ? sum + (parseFloat(charge.amount) || 0) : sum;
  }, 0);
  const totalGrTotal = orderItems.reduce((acc, item) => acc + parseFloat(item.gr_total || 0), 0) + extraChargesTotal;

  const handleExtraChargeChange = (index, field, value) => {
    setExtraCharges((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      
      if (field === "percent") {
        const pct = parseFloat(value) || 0;
        updated[index].amount = ((totalSubtotal * pct) / 100).toFixed(2);
      } else if (field === "amount") {
        updated[index].percent = "";
      }
      return updated;
    });
  };
  const gstAmount = totalCgstAmt + totalSgstAmt + totalIgstAmt + totalUtgstAmt;

  const navigate = useNavigate();

  const toggleSideNav = () => {
    setSideNavOpen((prev) => !prev);
  };

  const togglePackMast = () => {
    setShowModal((prev) => !prev);
  };

  const handleNavigate = () => {
    navigate("/CustomerSalesOrderList");
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  };


  return (
    <div className="NewSalesOrderMaster">
      <ToastContainer position="top-right" autoClose={3000} />
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
                <div className="NewSalesOrder">
                  <div className="NewSalesOrder-header mb-2 text-start">
                    <div className="row align-items-center">
                      <div className="col-md-6">
                        <h5 className="header-title mb-0">{isEditing ? "Edit Sales Order" : "New Sales Order"}</h5>
                      </div>
                      <div className="col-md-6 text-end">
                        <button
                          type="button"
                          className="vndrbtn mx-1"
                          onClick={handleNavigate}
                        >
                          Customer Order List
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Model */}
                  <div
                    className={`modal fade ${showModal ? "show d-block" : ""}`}
                    style={{ display: showModal ? "block" : "none", backgroundColor: showModal ? "rgba(0,0,0,0.5)" : "transparent" }}
                    tabIndex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden={!showModal}
                  >
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="exampleModalLabel">
                            Add New Packing Type :
                          </h5>
                          <button
                            type="button"
                            className="btn-close"
                            onClick={togglePackMast}
                          >
                            {" "}
                            <i class="fa fa-times" aria-hidden="true"></i>{" "}
                          </button>
                        </div>

                        <div className="modal-body">
                          <div className="NewSalesOrder-header mb-4 text-start">
                            <div className="row align-items-center">
                              <div className="col-md-4">
                                <h5 className="header-title mb-0">
                                  Packing Master :{" "}
                                </h5>
                              </div>
                            </div>
                          </div>
                          <form>
                            <div className="row">
                              {/* Plant */}
                              <div className="col-md-2 mt-2">
                                <label htmlFor="" className="">
                                  Packing Name:{" "}
                                </label>
                              </div>
                              <div className="col-md-2">
                                <input
                                  type="text"
                                  placeholder=" "
                                  className="form-control"
                                />
                              </div>
                              <div className="col-md-2 mt-2">
                                <button
                                  type="button"
                                  className="vndrbtn w-100"
                                >
                                  Submit
                                </button>
                              </div>
                            </div>
                          </form>
                          <hr />
                          <div>No Data Found !!</div>
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="NewSalesOrder-main">
                    <div className="row text-start">
                      <div className="col-md-2">
                        <label className="form-label">Plant:</label>
                        <select
                          name="plant"
                          value={formData.plant}
                          onChange={handleChange}
                          className="form-control"
                        >
                          <option value="VISHWA S.I.">VISHWA S.I.</option>
                        </select>
                      </div>
                      <div className="col-md-2">
                        <label className="form-label">Series:</label>
                        <select
                          name="series"
                          value={formData.series}
                          onChange={handleChange}
                          className="form-control"
                        >
                          <option value="">Select</option>
                          <option value="SOD">SOD</option>
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label>Order Type:</label>
                        <div className="d-flex gap-2">
                          <select
                            name="order_type"
                            value={formData.order_type}
                            onChange={handleChange}
                            className="form-control"
                          >
                            <option value="">Select</option>
                            <option value="GST">GST</option>
                            <option value="JobWork">JobWork</option>
                          </select>

                          <select
                            name="order_status"
                            value={formData.order_status}
                            onChange={handleChange}
                            className="form-control"
                          >
                            <option value="">Select</option>
                            <option value="Open">Open</option>
                            <option value="Close">Close</option>
                          </select>
                        </div>
                      </div>
                      {/* Customer Select (Fetched from API) */}
                      {/* Customer Select (Fetched from API) */}
                      <div className="col-md-2">
                        <label>Customer:</label>
                        <select
                          name="customer"
                          value={formData.customer}
                          onChange={handleChange}
                          className="form-control"
                        >
                          <option value="">Select Customer...</option>
                          {customers.map((cust) => (
                            <option
                              key={cust.id}
                              value={`${cust.Name} | ${cust.number}`}
                            >
                              {`${cust.Name} | Code: ${cust.number}`}
                            </option>
                          ))}
                        </select>
                      </div>


                      <div className="col-md-2 mt-4 d-flex gap-2">
                        <button type="button" className="vndrbtn flex-grow-1">
                          Search
                        </button>
                        <button type="button" className="vndrbtn flex-grow-1">
                          Clear
                        </button>
                      </div>
                    </div>

                    {/* Fields that auto-fill from API */}
                    <div className="row text-start mt-2">
                      <div className="col-md-2">
                        <label>Cust Po:</label>
                        <input
                          type="text"
                          name="cust_po"
                          value={formData.cust_po}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-2">
                        <label>Cust Date:</label>
                        <input
                          type="date"
                          name="cust_date"
                          className="form-control"
                          value={formData.cust_date}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-2">
                        <label>Pay Day:</label>
                        <input
                          type="text"
                          name="pay_day"
                          value={formData.pay_day}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-2">
                        <label>Pay Note:</label>
                        <input
                          type="text"
                          name="pay_note"
                          value={formData.pay_note}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-2">
                        <label>Valid Up:</label>
                        <input type="date" className="form-control" name="valid_up" value={formData.valid_up} onChange={handleChange} />
                      </div>
                      <div className="col-md-2 mt-2">
                        <input type="file" name="file" onChange={handleFileChange} />
                      </div>
                    </div>
                  </div>

                  <div className="NewSalesOrder-main mt-5">
                    <div className="NewSalesOrder-second">
                      <ul
                        className="nav nav-tabs"
                        id="NewSalesOrderTabs"
                        role="tablist"
                      >
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link active"
                            id="item-details-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#itemdetails"
                            type="button"
                            role="tab"
                          >
                            Item Details
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link"
                            id="terms-conditions-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#termsconditions"
                            type="button"
                            role="tab"
                          >
                            Terms & Conditions
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link"
                            id="address-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#address"
                            type="button"
                            role="tab"
                          >
                            Bill to/Ship to Address
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link"
                            id="taxes-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#taxes"
                            type="button"
                            role="tab"
                          >
                            Taxes
                          </button>
                        </li>
                      </ul>

                      <div
                        className="tab-content mt-4"
                        id="NewSalesOrderTabsContent"
                      >
                        <div
                          className="tab-pane fade show active"
                          id="itemdetails"
                          role="tabpanel"
                        >
                          <div className="NewSalesOrder-Main">
                            <div className="table-responsive">
                              <table className="table table-bordered">
                                <thead>
                                  <tr>
                                    <th>Select Item.</th>
                                    <th>Cust Item Code</th>
                                    <th>Item Desc</th>
                                    <th>Rate</th>
                                    <th>Discount</th>
                                    <th> Qty | UOM</th>
                                    <th>RM Type| Item Wt.</th>
                                    <th>Pkg. Trans </th>
                                    <th>Plan | Due Date</th>
                                    <th>Type</th>
                                    <th>Remark</th>
                                    <th> </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      <input
                                        list="item-search-list"
                                        className="form-control form-control-sm"
                                        value={currentItem.selectedSearch}
                                        onChange={handleItemSearchChange}
                                        placeholder="Search Item..."
                                      />
                                      <datalist id="item-search-list">
                                        {itemsList.map((item, idx) => (
                                          <option
                                            key={idx}
                                            value={`${item.part_no} | ${item.Part_Code} | ${item.Name_Description}`}
                                          />
                                        ))}
                                      </datalist>
                                      <small className="text-muted d-block mt-1">Rev No: {currentItem.part_no ? "0" : ""}</small>
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={currentItem.part_code}
                                        readOnly
                                      />
                                      <div className="mt-1 d-flex align-items-center gap-1">
                                        <span style={{ fontSize: "0.7rem", whiteSpace: "nowrap" }}>Line:</span>
                                        <input
                                          type="text"
                                          className="form-control form-control-sm"
                                          placeholder=""
                                        />
                                      </div>
                                      <div className="mt-1 d-flex align-items-center gap-1">
                                        <span style={{ fontSize: "0.7rem", whiteSpace: "nowrap" }}>PR:</span>
                                        <input
                                          type="text"
                                          className="form-control form-control-sm"
                                          placeholder=""
                                        />
                                      </div>
                                    </td>
                                    <td>
                                      <textarea
                                        className="form-control form-control-sm"
                                        rows="2"
                                        value={currentItem.description}
                                        readOnly
                                        placeholder="Item Desc"
                                      ></textarea>
                                      <div className="mt-1">
                                        <label className="mb-0 text-start d-block" style={{ fontSize: "0.7rem", fontWeight: 600 }}>Item Size:</label>
                                        <input
                                          type="text"
                                          className="form-control form-control-sm mt-1"
                                          value={currentItem.item_size}
                                          onChange={(e) => setCurrentItem({ ...currentItem, item_size: e.target.value })}
                                          placeholder="Item Size"
                                        />
                                      </div>
                                    </td>

                                    <td>
                                      <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        value={currentItem.rate}
                                        onChange={(e) =>
                                          setCurrentItem({
                                            ...currentItem,
                                            rate: e.target.value,
                                          })
                                        }
                                        placeholder="Rate"
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={currentItem.discount}
                                        onChange={(e) =>
                                          setCurrentItem({
                                            ...currentItem,
                                            discount: e.target.value,
                                          })
                                        }
                                        placeholder="Discount"
                                      />
                                    </td>

                                    <td>
                                      <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        value={currentItem.qty}
                                        onChange={(e) =>
                                          setCurrentItem({
                                            ...currentItem,
                                            qty: e.target.value,
                                          })
                                        }
                                        placeholder="Qty"
                                      />
                                      <input
                                        type="text"
                                        className="form-control form-control-sm mt-1"
                                        placeholder=""
                                      />
                                    </td>
                                    <td>
                                      <select 
                                        name="uom" 
                                        id="uom"
                                        className="form-select form-select-sm"
                                        value={currentItem.uom}
                                        onChange={(e) => setCurrentItem({...currentItem, uom: e.target.value})}
                                      >
                                        <option value="NOS">NOS</option>
                                        <option value="KGS">KGS</option>
                                      </select>
                                      <input
                                        type="text"
                                        className="form-control form-control-sm mt-1"
                                        placeholder="Item Wt."
                                      />
                                      <input
                                        type="text"
                                        className="form-control form-control-sm mt-1"
                                        placeholder="Per Unit"
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Pkg Trans"
                                        value={currentItem.pkg_trans}
                                        onChange={(e) => setCurrentItem({...currentItem, pkg_trans: e.target.value})}
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="date"
                                        className="form-control form-control-sm"
                                        value={currentItem.plan_date_item}
                                        onChange={(e) => setCurrentItem({...currentItem, plan_date_item: e.target.value})}
                                      />
                                      <input
                                        type="date"
                                        className="form-control form-control-sm mt-1"
                                        value={currentItem.due_date_item}
                                        onChange={(e) => setCurrentItem({...currentItem, due_date_item: e.target.value})}
                                      />
                                    </td>
                                    <td>
                                      <select
                                        className="form-select form-select-sm"
                                        value={currentItem.type_item}
                                        onChange={(e) => setCurrentItem({...currentItem, type_item: e.target.value})}
                                      >
                                        <option value="">Select</option>
                                        <option value="Regular">Regular</option>
                                        <option value="Sample">Sample</option>
                                        <option value="FOC">FOC</option>
                                      </select>
                                    </td>
                                    <td>
                                      <textarea
                                        className="form-control form-control-sm"
                                        rows="2"
                                        placeholder="Remark"
                                        value={currentItem.remark_item}
                                        onChange={(e) => setCurrentItem({...currentItem, remark_item: e.target.value})}
                                      ></textarea>
                                    </td>
                                    <td>
                                      <button
                                        className="vndrbtn w-100"
                                        onClick={addItemToTable}
                                      >
                                        Add
                                      </button>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div className="NewSalesOrder-Main">
                            <div className="table-responsive">
                              <table className="table table-bordered" style={{ fontSize: '0.8rem' }}>
                                <thead>
                                  <tr>
                                    <th style={{ width: '3%', textAlign: 'center' }}>Sr.</th>
                                    <th style={{ width: '7%' }}>Item No</th>
                                    <th style={{ width: '7%' }}>Item Code</th>
                                    <th style={{ width: '11%' }}>Description</th>
                                    <th style={{ width: '6%' }}>Item Size</th>
                                    <th style={{ width: '6%' }}>Rate</th>
                                    <th style={{ width: '5%' }}>Discount</th>
                                    <th style={{ width: '7%' }}>PO Qty | UOM</th>
                                    <th style={{ width: '7%' }}>Rate Type| Item Wt.</th>
                                    <th style={{ width: '6%' }}>Sub Total</th>
                                    <th style={{ width: '6%' }}>Pkg. Trans</th>
                                    <th style={{ width: '8%' }}>Plan | Due Date</th>
                                    <th style={{ width: '5%' }}>Type</th>
                                    <th style={{ width: '9%' }}>GST</th>
                                    <th style={{ width: '7%' }}>Remark</th>
                                    <th style={{ width: '2.5%', textAlign: 'center' }}>Edit</th>
                                    <th style={{ width: '2.5%', textAlign: 'center' }}>Delete</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {orderItems.map((item, index) => (
                                    <tr key={item.id}>
                                      <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                      <td>
                                        {item.part_no}
                                        <br /> Line No :
                                        <br /> PR No.
                                      </td>

                                      <td>{item.part_code}</td>

                                      <td>
                                        {item.description}
                                        <br /> Rev. No :
                                        <br /> HSN/SAC : {item.hsn}
                                      </td>
                                      <td>{item.Item_Size || item.item_size || "-"}</td>
                                      <td>{item.rate}</td>
                                      <td>{item.discount || '-'}</td>
                                      <td>{item.qty} | {item.uom}</td>

                                      <td>
                                        Rate Type: <br />
                                        Item Wt. : {item.item_wt || ''}<br />
                                        Per Unit:{" "}
                                      </td>

                                      <td>{item.subtotal}</td>

                                      <td>{item.pkg_trans || '-'}</td>
                                      <td>{item.plan_date_item || '-'} <br /> {item.due_date || '-'}</td>
                                      <td>{item.type || '-'}</td>

                                      <td>
                                        CGST ({item.cgst}%): {item.cgst_amt}<br />
                                        SGST ({item.sgst}%): {item.sgst_amt}<br />
                                        IGST ({item.igst}%): {item.igst_amt}<br />
                                        UTGST ({item.utgst}%): {item.utgst_amt}<br />
                                        <strong>Total: {item.gr_total}</strong>
                                      </td>
                                      <td>{item.remark || '-'}</td>
                                      <td style={{ textAlign: 'center' }}>
                                        <button
                                          className="btn btn-sm btn-outline-primary border-0"
                                          title="Edit Item"
                                          onClick={() => handleEditItem(item)}
                                        >
                                          <FaEdit />
                                        </button>
                                      </td>
                                      <td style={{ textAlign: 'center' }}>
                                        <button
                                          className="btn btn-sm border-0"
                                          style={{ color: '#dc3545' }}
                                          title="Delete Item"
                                          onClick={() => setOrderItems(orderItems.filter(i => i.id !== item.id))}
                                        >
                                          <FaTrash />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <div className="d-flex justify-content-end mt-3">
                              <button
                                type="button"
                                className="vndrbtn mx-1"
                                onClick={() => document.getElementById('terms-conditions-tab').click()}
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        </div>

                        <div
                          className="tab-pane fade"
                          id="termsconditions"
                          role="tabpanel"
                        >
                          <div className="NewSalesOrder-header mb-4 text-start">
                            <div className="row align-items-center">
                              <div className="col-md-2">
                                <h5 className="header-title">Add New Terms</h5>
                              </div>
                              <div className="col-md-2">
                                <h5 className="header-title">Refresh List</h5>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between mt-3">
                            <button
                              type="button"
                              className="vndrbtn mx-1"
                              onClick={() => document.getElementById('item-details-tab').click()}
                            >
                              Previous
                            </button>
                            <button
                              type="button"
                              className="vndrbtn mx-1"
                              onClick={() => document.getElementById('address-tab').click()}
                            >
                              Next
                            </button>
                          </div>
                        </div>

                        <div
                          className="tab-pane fade"
                          id="address"
                          role="tabpanel"
                        >
                          <div className="NewSalesOrder-main">
                            <h5 className="text-start mb-3">Bill to/Ship to Address</h5>
                            <div className="row text-start">
                              <div className="col-md-6">
                                <label>Bill To Address:</label>
                                <textarea name="bill_to" value={formData.bill_to} onChange={handleChange} className="form-control mt-1" rows="3" placeholder="Enter billing address..."></textarea>
                              </div>
                              <div className="col-md-6">
                                <label>Ship To Address:</label>
                                <textarea name="ship_to" value={formData.ship_to} onChange={handleChange} className="form-control mt-1" rows="3" placeholder="Enter shipping address..."></textarea>
                              </div>
                            </div>
                            <div className="d-flex justify-content-between mt-4">
                              <button
                                type="button"
                                className="vndrbtn mx-1"
                                onClick={() => document.getElementById('terms-conditions-tab').click()}
                              >
                                Previous
                              </button>
                              <button
                                type="button"
                                className="vndrbtn mx-1"
                                onClick={() => document.getElementById('taxes-tab').click()}
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        </div>

                        <div
                          className="tab-pane fade"
                          id="taxes"
                          role="tabpanel"
                        >
                          <div className="NewSalesOrder-main">
                            <div className="row text-start">
                              <div className="col-md-4">
                                <label>So Date: <span className="text-danger">*</span></label>
                                <input type="date" className="form-control" name="so_date" value={formData.so_date} onChange={handleChange} required />
                              </div>
                              <div className="col-md-4">
                                <label>SO No:</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={formData.so_no}
                                  readOnly
                                  disabled
                                  placeholder="Auto-generated"
                                />
                                {soNoError && <small className="text-danger">{soNoError}</small>}
                              </div>
                              <div className="col-md-4">
                                <label>CCN No:</label>
                                <input
                                  type="text"
                                  name="ccn_no"
                                  value={formData.ccn_no}
                                  onChange={handleChange}
                                  className="form-control"
                                />
                              </div>
                            </div>

                            <div className="row text-start mt-2">
                              <div className="col-md-4">
                                <label>Po Rec Date: <span className="text-danger">*</span></label>
                                <input type="date" className="form-control" name="po_rec_date" value={formData.po_rec_date} onChange={handleChange} required />
                              </div>
                              <div className="col-md-4">
                                <label>Delivery Date: <span className="text-danger">*</span></label>
                                <input type="date" className="form-control" name="delivery_date" value={formData.delivery_date} onChange={handleChange} required />
                              </div>
                              <div className="col-md-4">
                                <label>Plan Date: <span className="text-danger">*</span></label>
                                <input type="date" className="form-control" name="plan_date" value={formData.plan_date} onChange={handleChange} required />
                              </div>
                            </div>

                            <div className="row text-start mt-2">
                              <div className="col-md-4">
                                <label>Incoterms:</label>
                                <select
                                  name="incoterms"
                                  value={formData.incoterms}
                                  onChange={handleChange}
                                  className="form-control"
                                >
                                  <option value="">Select</option>
                                  <option value="FOB">FOB</option>
                                  <option value="EXW">EXW</option>
                                </select>
                              </div>
                              <div className="col-md-4">
                                <label>L.C.No:</label>
                                <input
                                  type="text"
                                  name="lc_no"
                                  value={formData.lc_no}
                                  onChange={handleChange}
                                  className="form-control"
                                />
                              </div>
                              <div className="col-md-4">
                                <label>Sales Person:</label>
                                <select
                                  name="sales_person"
                                  value={formData.sales_person}
                                  onChange={handleChange}
                                  className="form-control"
                                >
                                  <option value="">Select</option>
                                  <option value="Person A">Person A</option>
                                </select>
                              </div>
                            </div>

                            <div className="row text-start mt-2">
                              <div className="col-md-4">
                                <label>Ship To:</label>
                                <input type="text" name="ship_to" value={formData.ship_to} className="form-control" readOnly />
                              </div>
                              <div className="col-md-4">
                                <label>Buyer Name:</label>
                                <input
                                  type="text"
                                  name="buyer_name"
                                  value={formData.buyer_name}
                                  onChange={handleChange}
                                  className="form-control"
                                />
                              </div>
                              <div className="col-md-4">
                                <label>Site Name:</label>
                                <input
                                  type="text"
                                  name="site_name"
                                  value={formData.site_name}
                                  onChange={handleChange}
                                  className="form-control"
                                />
                              </div>
                            </div>

                            <div className="row text-start mt-2">
                              <div className="col-md-4">
                                <label>Ship To Add Code:</label>
                                <input
                                  type="text"
                                  name="ship_to_add_code"
                                  value={formData.ship_to_add_code}
                                  onChange={handleChange}
                                  className="form-control"
                                />
                              </div>
                              <div className="col-md-4">
                                <label>Packing:</label>
                                <input
                                  type="text"
                                  name="packing"
                                  value={formData.packing}
                                  onChange={handleChange}
                                  className="form-control"
                                />
                              </div>
                              <div className="col-md-4">
                                <label>Project Name:</label>
                                <input
                                  type="text"
                                  name="project_name"
                                  value={formData.project_name}
                                  onChange={handleChange}
                                  className="form-control"
                                />
                              </div>
                            </div>

                            <div className="row text-start mt-3">
                              <div className="col-md-6">
                                <label>Delivery AL :</label>
                                <textarea
                                  name="delivery_al"
                                  value={formData.delivery_al}
                                  onChange={handleChange}
                                  className="form-control"
                                ></textarea>
                              </div>
                              <div className="col-md-6">
                                <label>Terms & Conditions:</label>
                                <textarea
                                  name="terms"
                                  value={formData.terms}
                                  onChange={handleChange}
                                  className="form-control"
                                ></textarea>
                              </div>
                            </div>

                            <div className="table-responsive">
                              <table className="table table-bordered table-striped">
                                <tbody>
                                  <tr>
                                    <td
                                      className=""
                                      style={{
                                        width: "100px",
                                        marginLeft: "5px",
                                      }}
                                    >
                                      <div className="d-flex align-items-center">
                                      <input
                                        type="checkbox"
                                        checked={extraCharges[0].isChecked}
                                        onChange={(e) => handleExtraChargeChange(0, 'isChecked', e.target.checked)}
                                        style={{
                                          width: "50px",
                                          marginLeft: "5px",
                                        }}
                                      />
                                      <span className="text-nowrap mx-1">(TOC)</span>
                                      <input
                                        type="text"
                                        placeholder="Pack & Frwd Charges"
                                        value={extraCharges[0].name}
                                        readOnly
                                        style={{
                                          width: "150px",
                                          marginLeft: "5px",
                                        }}
                                      />
                                      <input
                                        type="text"
                                        placeholder="0"
                                        value={extraCharges[0].percent}
                                        onChange={(e) => handleExtraChargeChange(0, 'percent', e.target.value)}
                                        style={{
                                          width: "50px",
                                          marginLeft: "5px",
                                        }}
                                      />{" "}
                                      <span className="ms-1">%</span>
                                      </div>
                                    </td>

                                    <td
                                      style={{
                                        width: "200px",
                                        marginLeft: "5px",
                                      }}
                                    >
                                      <input
                                        type="text"
                                        placeholder="0"
                                        value={extraCharges[0].amount}
                                        onChange={(e) => handleExtraChargeChange(0, 'amount', e.target.value)}
                                        style={{
                                          width: "100px",
                                          marginLeft: "5px",
                                        }}
                                      />
                                    </td>
                                    <td
                                      style={{
                                        width: "200px",
                                        marginLeft: "5px",
                                      }}
                                    >
                                      {" "}
                                      Assessable Value{" "}
                                    </td>
                                    <td
                                      style={{
                                        width: "200px",
                                        marginLeft: "5px",
                                      }}
                                    >
                                      {" "}
                                      {totalSubtotal.toFixed(2)}
                                    </td>
                                    <td
                                      style={{
                                        width: "200px",
                                        marginLeft: "5px",
                                      }}
                                    ></td>
                                    <td
                                      style={{
                                        width: "200px",
                                        marginLeft: "5px",
                                      }}
                                    ></td>
                                  </tr>
                                </tbody>

                                <tbody>
                                  <tr>
                                    <td
                                      className=""
                                      style={{
                                        width: "100px",
                                        marginLeft: "5px",
                                      }}
                                    >
                                      <div className="d-flex align-items-center">
                                      <input
                                        type="checkbox"
                                        checked={extraCharges[1].isChecked}
                                        onChange={(e) => handleExtraChargeChange(1, 'isChecked', e.target.checked)}
                                        style={{
                                          width: "50px",
                                          marginLeft: "5px",
                                        }}
                                      />
                                      <span className="text-nowrap mx-1">(TOC)</span>
                                      <input
                                        type="text"
                                        placeholder="Pack & Frwd Charges"
                                        value={extraCharges[1].name}
                                        readOnly
                                        style={{
                                          width: "150px",
                                          marginLeft: "5px",
                                        }}
                                      />
                                      <input
                                        type="text"
                                        placeholder="0"
                                        value={extraCharges[1].percent}
                                        onChange={(e) => handleExtraChargeChange(1, 'percent', e.target.value)}
                                        style={{
                                          width: "50px",
                                          marginLeft: "5px",
                                        }}
                                      />{" "}
                                      <span className="ms-1">%</span>
                                      </div>
                                    </td>

                                    <td
                                      style={{
                                        width: "200px",
                                        marginLeft: "5px",
                                      }}
                                    >
                                      <input
                                        type="text"
                                        placeholder="0"
                                        value={extraCharges[1].amount}
                                        onChange={(e) => handleExtraChargeChange(1, 'amount', e.target.value)}
                                        style={{
                                          width: "100px",
                                          marginLeft: "5px",
                                        }}
                                      />
                                    </td>
                                    <td
                                      style={{
                                        width: "200px",
                                        marginLeft: "5px",
                                      }}
                                    >
                                      {" "}
                                      CGST : {orderItems[0]?.cgst || 0} %{" "}
                                    </td>
                                    <td
                                      style={{
                                        width: "200px",
                                        marginLeft: "5px",
                                      }}
                                    >
                                      {" "}
                                      {totalCgstAmt.toFixed(2)}
                                    </td>
                                    <td
                                      style={{
                                        width: "200px",
                                        marginLeft: "5px",
                                      }}
                                    ></td>
                                    <td
                                      style={{
                                        width: "200px",
                                        marginLeft: "5px",
                                      }}
                                    ></td>
                                  </tr>
                                </tbody>

                                <tbody>
                                  <tr>
                                    <td
                                      className=""
                                      style={{
                                        width: "100px",
                                        marginLeft: "5px",
                                      }}
                                    >
                                      <div className="d-flex align-items-center">
                                      <input
                                        type="checkbox"
                                        checked={extraCharges[2].isChecked}
                                        onChange={(e) => handleExtraChargeChange(2, 'isChecked', e.target.checked)}
                                        style={{
                                          width: "50px",
                                          marginLeft: "5px",
                                        }}
                                      />
                                      <span className="text-nowrap mx-1">(TOC)</span>
                                      <input
                                        type="text"
                                        placeholder="Pack & Frwd Charges"
                                        value={extraCharges[2].name}
                                        readOnly
                                        style={{
                                          width: "150px",
                                          marginLeft: "5px",
                                        }}
                                      />
                                      <input
                                        type="text"
                                        placeholder="0"
                                        value={extraCharges[2].percent}
                                        onChange={(e) => handleExtraChargeChange(2, 'percent', e.target.value)}
                                        style={{
                                          width: "50px",
                                          marginLeft: "5px",
                                        }}
                                      />{" "}
                                      <span className="ms-1">%</span>
                                      </div>
                                    </td>

                                    <td
                                      style={{
                                        width: "200px",
                                        marginLeft: "5px",
                                      }}
                                    >
                                      <input
                                        type="text"
                                        placeholder="0"
                                        value={extraCharges[2].amount}
                                        onChange={(e) => handleExtraChargeChange(2, 'amount', e.target.value)}
                                        style={{
                                          width: "100px",
                                          marginLeft: "5px",
                                        }}
                                      />
                                    </td>
                                    <td
                                      style={{
                                        width: "200px",
                                        marginLeft: "5px",
                                      }}
                                    >
                                      {" "}
                                      SGST :{orderItems[0]?.sgst || 0} %{" "}
                                    </td>
                                    <td
                                      style={{
                                        width: "200px",
                                        marginLeft: "5px",
                                      }}
                                    >
                                      {" "}
                                      {totalSgstAmt.toFixed(2)}
                                    </td>
                                    <td
                                      style={{
                                        width: "200px",
                                        marginLeft: "5px",
                                      }}
                                    >
                                      {" "}
                                      Third-Party Inspection (TPI){" "}
                                    </td>
                                    <td
                                      style={{
                                        width: "200px",
                                        marginLeft: "5px",
                                      }}
                                    >
                                      <select
                                        style={{
                                          width: "100px",
                                          marginLeft: "5px",
                                        }}
                                        name=""
                                        id=""
                                      >
                                        <option value="">No</option>
                                      </select>
                                    </td>
                                  </tr>
                                </tbody>

                                <tbody>
                                  <tr>
                                    <td
                                      className=""
                                      style={{
                                        width: "100px",
                                        marginLeft: "5px",
                                      }}
                                    >
                                      <div className="d-flex align-items-center">
                                      <input
                                        type="checkbox"
                                        checked={extraCharges[3].isChecked}
                                        onChange={(e) => handleExtraChargeChange(3, 'isChecked', e.target.checked)}
                                        style={{
                                          width: "50px",
                                          marginLeft: "5px",
                                        }}
                                      />
                                      <span className="text-nowrap mx-1">(TOC)</span>
                                      <input
                                        type="text"
                                        placeholder="Other Charges"
                                        value={extraCharges[3].name}
                                        readOnly
                                        style={{
                                          width: "150px",
                                          marginLeft: "5px",
                                        }}
                                      />
                                      <input
                                        type="text"
                                        placeholder="0"
                                        value={extraCharges[3].percent}
                                        onChange={(e) => handleExtraChargeChange(3, 'percent', e.target.value)}
                                        style={{
                                          width: "50px",
                                          marginLeft: "5px",
                                        }}
                                      />{" "}
                                      <span className="ms-1">%</span>
                                      </div>
                                    </td>

                                    <td
                                      style={{
                                        width: "200px",
                                        marginLeft: "5px",
                                      }}
                                    >
                                      <input
                                        type="text"
                                        placeholder="0"
                                        value={extraCharges[3].amount}
                                        onChange={(e) => handleExtraChargeChange(3, 'amount', e.target.value)}
                                        style={{
                                          width: "100px",
                                          marginLeft: "5px",
                                        }}
                                      />
                                    </td>

                                    <td
                                      style={{
                                        width: "200px",
                                        marginLeft: "5px",
                                      }}
                                    >
                                      {" "}
                                      IGST : {orderItems[0]?.igst || 0} %{" "}
                                    </td>
                                    <td
                                      style={{
                                        width: "200px",
                                        marginLeft: "5px",
                                      }}
                                    >
                                      {" "}
                                      {totalIgstAmt.toFixed(2)}
                                    </td>
                                    <td
                                      style={{
                                        width: "200px",
                                        marginLeft: "5px",
                                      }}
                                    >
                                      <div className="d-flex align-items-center">
                                      <input
                                        type="checkbox"
                                        id=""
                                        name=""
                                        style={{
                                          width: "50px",
                                          marginLeft: "5px",
                                        }}
                                      />
                                      <span className="text-nowrap mx-1">Ref. Cust :</span>
                                      </div>
                                    </td>
                                    <td
                                      style={{
                                        width: "200px",
                                        marginLeft: "5px",
                                      }}
                                    >
                                      <input
                                        type="text"
                                        placeholder="Enter Name"
                                        style={{
                                          width: "150px",
                                          marginLeft: "5px",
                                        }}
                                      />
                                    </td>
                                  </tr>
                                </tbody>

                                <tbody>
                                  <tr>
                                    <td
                                      className=""
                                      style={{
                                        width: "100px",
                                        marginLeft: "5px",
                                      }}
                                    >
                                      CR Name :
                                    </td>

                                    <td
                                      style={{
                                        width: "200px",
                                        marginLeft: "5px",
                                      }}
                                    >
                                      <select
                                        style={{
                                          width: "100px",
                                          marginLeft: "5px",
                                        }}
                                        name=""
                                        id=""
                                      >
                                        <option value="">Select</option>
                                      </select>
                                    </td>
                                    <td
                                      style={{
                                        width: "200px",
                                        marginLeft: "5px",
                                      }}
                                    >
                                      {" "}
                                      UTGST : {orderItems[0]?.utgst || 0} %{" "}
                                    </td>
                                    <td
                                      style={{
                                        width: "200px",
                                        marginLeft: "5px",
                                      }}
                                    >
                                      {" "}
                                      {totalUtgstAmt.toFixed(2)}
                                    </td>
                                    <td
                                      style={{
                                        width: "200px",
                                        marginLeft: "5px",
                                      }}
                                    >
                                      {" "}
                                      GR. Total :{" "}
                                    </td>
                                    <td
                                      style={{
                                        width: "200px",
                                        marginLeft: "5px",
                                      }}
                                    >
                                      {" "}
                                      {totalGrTotal.toFixed(2)}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div className="row mt-3">
                              <div className="col-md-12 d-flex justify-content-between">
                                <button
                                  type="button"
                                  className="vndrbtn mx-1"
                                  onClick={() => document.getElementById('address-tab').click()}
                                >
                                  Previous
                                </button>
                                <button
                                  type="button"
                                  onClick={handleSaveOrder}
                                  className="vndrbtn mx-1"
                                >
                                  Save Order
                                </button>
                              </div>
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

export default NewSalesOrder;
