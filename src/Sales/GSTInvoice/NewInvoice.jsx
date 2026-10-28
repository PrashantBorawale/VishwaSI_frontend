import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import NavBar from "../../NavBar/NavBar.js";
import SideNav from "../../SideNav/SideNav.js";
import { FaPlus } from "react-icons/fa6";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import "./NewInvoice.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const getTodayDateStr = () => {
  const today = new Date();
  // Adjust to local timezone explicitly to avoid UTC shift
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getCurrentTimeStr = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const NewInvoice = () => {
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [items, setItems] = useState([]);
  const [customerItems, setCustomerItems] = useState([]);
  const [selectedItemObj, setSelectedItemObj] = useState(null);
  const [selectedItemCode, setSelectedItemCode] = useState("");
  const [itemSearchTerm, setItemSearchTerm] = useState("");
  const [tableData, setTableData] = useState([]);
  const [itemSearchLoading, setItemSearchLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [poList, setPoList] = useState([]);
  const [selectedPO, setSelectedPO] = useState("");
  const [poSearchLoading, setPoSearchLoading] = useState(false);

  // --- FIX 1: formData keys renamed to match Django model (case-sensitive) ---
  const [formData, setFormData] = useState({
    invoice_no: "",
    series_type: "",
    invoice_type: "GST",
    invoice_Date: getTodayDateStr(),        // ✅ was: invoice_date
    invoice_time: getCurrentTimeStr(),
    payment_Date: "",        // ✅ was: payment_date
    note: "",
    date_of_removal: "",
    time: getCurrentTimeStr(),
    mode_of_trans: "By Road",
    freight: "",
    vehical_no: "",
    transporter: "",
    bill_to: "",
    ship_to: "",
    addr_code: "",
    l_r_gc_note: "",
    place_of_supply: "",
    Eway_bill_Date: "",      // ✅ was: eway_bill_date
    Eway_bill_no: "",        // ✅ was: eway_bill_no
    destenation_code: "",
    note_remark: "",
    pdi_no: "",
    bank: "",
    d_c_no: "",
    d_c_Date: "",            // ✅ was: d_c_date
    delivery_terms: "",
    plant: "VISHWA S.I.",      // ✅ added missing plant state
    trans_doc_no: "",
    trans_distance_km: "",
  });

  // Tax Data State
  const [taxData, setTaxData] = useState({
    base_value: "0",
    disc_amt: "0",
    assessable_value: "0",
    cgst: "6",          // ✅ Default 6% for domestic transactions
    sgst: "6",          // ✅ Default 6% for domestic transactions
    igst: "0",          // ✅ 0% by default, use if applicable
    utgst: "0",
    cgst_amt: "0.00",
    sgst_amt: "0.00",
    igst_amt: "0.00",
    utgst_amt: "0.00"
  });

  const [customerTaxType, setCustomerTaxType] = useState("INTERSTATE");

  // 1. Fetch Items for Dropdown (on Mount)
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("https://sellerp-backend.onrender.com/Sales/newsalesorder/");
        const data = await res.json();

        const flatItems = data.flatMap((order) =>
          (order.item || []).map((itm) => {
            const partNo = itm.part_no || itm.item_no || "";
            const itemCode = itm.item_code || itm.part_code || "";
            const itemDesc = itm.item_description || itm.Name_Description || itm.ItemDescription || itm.description || "";
            const fullLabel = `${partNo} -${itemCode}-${itemDesc}`;
            
            return {
              ...itm,
              customer: order.customer,
              cust_po: order.cust_po,
              plant: order.plant,
              ship_to: order.ship_to,
              part_no: partNo,
              item_code_short: itemCode,
              item_code: fullLabel, // Use full label as the primary identifier
              item_description: itemDesc,
              rate: itm.rate || itm.Rate || itm.Rate_per || itm.price || itm.rate_value || 0,
              desc_percent: itm.desc_percent || itm.desc || itm.discount_percent || itm.default_discount || 0,
              HSN_SAC_Code: itm.HSN_SAC_Code || itm.hsn_code || itm.HSN || itm.hsn || "",
              pkg_trans: itm.pkg_trans || itm.pkg_charges || itm.Pkg_Charges || itm.pkg || "",
              trans_charges: itm.trans_charges || itm.Trans_Charges || itm.transport_charges || "",
              Finish_Weight: itm.Finish_Weight || itm.item_wt || itm.Gross_Weight || itm.weight || 0,
              Unit_Code: itm.Unit_Code || itm.uom || itm.unit || itm.Unit || "pcs",
              plan_date: itm.plan_date || itm.Plan_Date || itm.due_date || itm.Due_Date || null,
              po_qty: itm.po_qty || itm.qty || itm.order_qty || itm.Qty || itm.PO_Qty || 0,
              item_size: itm.item_size || itm.Item_Size || "",
              Item_Size: itm.Item_Size || itm.item_size || "",
            };
          })
        );

        setItems(flatItems);
      } catch (err) {
        toast.error("Item load failed");
      }
    };

    fetchItems();
  }, []);

  // Fetch and filter items by customer
  const filterItemsByCustomer = (customerName) => {
    if (!customerName || !items.length) {
      setCustomerItems([]);
      return;
    }
    const filtered = items.filter(item =>
      (item.customer || "").toLowerCase() === customerName.toLowerCase()
    );
    setCustomerItems(filtered);
    console.log(`Found ${filtered.length} items for customer: ${customerName}`);
  };

  // Auto-filter items when customer changes
  useEffect(() => {
    const customerName = formData.bill_to || customerSearchTerm;
    filterItemsByCustomer(customerName);
    setSelectedItemCode("");
  }, [formData.bill_to, customerSearchTerm, items]);

  // Fetch Customer Details and Update Tax Type dynamically
  useEffect(() => {
    const fetchCustomerTaxRules = async () => {
      const customerName = formData.bill_to || customerSearchTerm;
      if (!customerName) return;

      try {
        const token = localStorage.getItem("accessToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch("https://sellerp-backend.onrender.com/All_Masters/api/SupplierData/", { headers });
        const data = await res.json();
        
        const custNameOnly = customerName.split('|')[0].trim().toLowerCase();
        const customerInfo = data.find(c => (c.Name || "").toLowerCase() === custNameOnly);
        
        let taxType = "INTERSTATE";
        if (customerInfo) {
          console.log("Customer Tax Info Loaded:", customerInfo);
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
  }, [formData.bill_to, customerSearchTerm]);


  // Fetch Tax Data from API
  useEffect(() => {
    const fetchTaxData = async () => {
      try {
        const res = await fetch("https://sellerp-backend.onrender.com/Sales/newsalesorder/");
        const data = await res.json();

        if (data.length > 0 && data[0].item && data[0].item.length > 0) {
          const firstItem = data[0].item[0];
          
          const rawCgst = parseFloat(firstItem.cgst) || 0;
          const rawSgst = parseFloat(firstItem.sgst) || 0;
          const rawIgst = parseFloat(firstItem.igst) || 0;
          const rawUtgst = parseFloat(firstItem.utgst) || 0;

          let cgstPer = 0, sgstPer = 0, igstPer = 0, utgstPer = 0;

          if (customerTaxType === "LOCAL") {
            cgstPer = rawCgst;
            sgstPer = rawSgst;
            if (cgstPer === 0 && sgstPer === 0 && rawIgst > 0) {
              cgstPer = rawIgst / 2;
              sgstPer = rawIgst / 2;
            }
          } else if (customerTaxType === "UT") {
            cgstPer = rawCgst;
            utgstPer = rawUtgst > 0 ? rawUtgst : rawSgst;
            if (cgstPer === 0 && utgstPer === 0 && rawIgst > 0) {
              cgstPer = rawIgst / 2;
              utgstPer = rawIgst / 2;
            }
          } else {
            igstPer = rawIgst;
            if (igstPer === 0 && (rawCgst > 0 || rawSgst > 0)) {
              igstPer = rawCgst + rawSgst;
            }
          }

          setTaxData(prev => ({
            ...prev,
            assessable_value: firstItem.assessable_value || "0",
            cgst: cgstPer.toString(),
            sgst: sgstPer.toString(),
            igst: igstPer.toString(),
            utgst: utgstPer.toString()
          }));
        }
      } catch (err) {
        console.error("Tax data load failed:", err);
      }
    };

    fetchTaxData();
  }, [customerTaxType]);

  // Calculate GST amounts
  useEffect(() => {
    const assessableVal = parseFloat(taxData.assessable_value) || 0;
    
    const cgstPercent = !isNaN(parseFloat(taxData.cgst)) ? parseFloat(taxData.cgst) : 6;
    const sgstPercent = !isNaN(parseFloat(taxData.sgst)) ? parseFloat(taxData.sgst) : 6;
    const igstPercent = !isNaN(parseFloat(taxData.igst)) ? parseFloat(taxData.igst) : 0;
    const utgstPercent = !isNaN(parseFloat(taxData.utgst)) ? parseFloat(taxData.utgst) : 0;

    const cgstAmount = (assessableVal * cgstPercent / 100).toFixed(2);
    const sgstAmount = (assessableVal * sgstPercent / 100).toFixed(2);
    const igstAmount = (assessableVal * igstPercent / 100).toFixed(2);
    const utgstAmount = (assessableVal * utgstPercent / 100).toFixed(2);

    setTaxData(prev => ({
      ...prev,
      cgst_amt: cgstAmount,
      sgst_amt: sgstAmount,
      igst_amt: igstAmount,
      utgst_amt: utgstAmount
    }));
  }, [taxData.assessable_value, taxData.cgst, taxData.sgst, taxData.igst, taxData.utgst]);

  // Auto-update assessable value from table items
  useEffect(() => {
    let baseValueSum = 0;
    let discAmtSum = 0;
    tableData.forEach((item) => {
      const qty = parseFloat(item.qty || item.po_qty || 0);
      const rate = parseFloat(item.rate || 0);
      const rowBase = qty * rate;
      baseValueSum += rowBase;

      const discPercent = parseFloat(item.desc || item.desc_percent || item.discount_percent || item.discount_amount || 0);
      discAmtSum += (rowBase * (discPercent / 100));
    });
    
    const calculatedAssessableValue = baseValueSum - discAmtSum;

    setTaxData(prev => ({
      ...prev,
      base_value: baseValueSum.toFixed(4),
      disc_amt: discAmtSum.toFixed(4),
      ...(calculatedAssessableValue > 0 || tableData.length > 0 ? { assessable_value: calculatedAssessableValue.toFixed(4) } : {})
    }));
  }, [tableData]);

  // Fetch Tax Details by HSN Code
  useEffect(() => {
    const fetchTaxDetailsByHSN = async () => {
      if (!selectedItemObj || !selectedItemObj.HSN_SAC_Code) {
        return;
      }

      try {
        const hsnCode = selectedItemObj.HSN_SAC_Code;

        const res = await fetch("https://sellerp-backend.onrender.com/Sales/newsalesorder/");
        const data = await res.json();

        let foundItem = null;
        for (let order of data) {
          if (order.item && Array.isArray(order.item)) {
            foundItem = order.item.find(itm =>
              (itm.hsn_code === hsnCode || itm.HSN === hsnCode || itm.hsn === hsnCode || itm.HSN_SAC_Code === hsnCode)
            );
            if (foundItem) break;
          }
        }

        if (foundItem) {
          const rawCgst = parseFloat(foundItem.cgst) || 0;
          const rawSgst = parseFloat(foundItem.sgst) || 0;
          const rawIgst = parseFloat(foundItem.igst) || 0;
          const rawUtgst = parseFloat(foundItem.utgst) || 0;

          let cgstPer = 0, sgstPer = 0, igstPer = 0, utgstPer = 0;

          if (customerTaxType === "LOCAL") {
            cgstPer = rawCgst;
            sgstPer = rawSgst;
            if (cgstPer === 0 && sgstPer === 0 && rawIgst > 0) {
              cgstPer = rawIgst / 2;
              sgstPer = rawIgst / 2;
            }
          } else if (customerTaxType === "UT") {
            cgstPer = rawCgst;
            utgstPer = rawUtgst > 0 ? rawUtgst : rawSgst;
            if (cgstPer === 0 && utgstPer === 0 && rawIgst > 0) {
              cgstPer = rawIgst / 2;
              utgstPer = rawIgst / 2;
            }
          } else {
            igstPer = rawIgst;
            if (igstPer === 0 && (rawCgst > 0 || rawSgst > 0)) {
              igstPer = rawCgst + rawSgst;
            }
          }

          setTaxData(prev => ({
            ...prev,
            assessable_value: foundItem.assessable_value || "0",
            cgst: cgstPer.toString(),
            sgst: sgstPer.toString(),
            igst: igstPer.toString(),
            utgst: utgstPer.toString()
          }));
          console.log("Tax details fetched for HSN:", hsnCode, foundItem);
        } else {
          console.log("No matching item found for HSN:", hsnCode);
        }
      } catch (err) {
        console.error("HSN Tax fetch failed:", err);
      }
    };

    fetchTaxDetailsByHSN();
  }, [selectedItemObj?.HSN_SAC_Code, customerTaxType]);

  // 2. Handle Item Selection and Fetch Stock
  const handleItemSelect = async (e) => {
    const fullItemCode = e.target.value;
    setSelectedItemCode(fullItemCode);

    const itemObj = customerItems.find(i => i.item_code === fullItemCode);
    if (!itemObj) return;

    // Use short code or part number for API parameters
    const lookupKey = itemObj.item_code_short || itemObj.part_no || fullItemCode;

    try {
      setItemSearchLoading(true);

      const [stockRes, itemFieldsRes] = await Promise.all([
        fetch(`https://sellerp-backend.onrender.com/Sales/wip/stock/get/?q=${lookupKey}`),
        fetch(`https://sellerp-backend.onrender.com/All_Masters/Fetch_Item_fields/?q=${encodeURIComponent(lookupKey)}`)
      ]);

      const stockData = await stockRes.json();
      let itemFieldsData = null;

      if (itemFieldsRes.ok) {
        const fieldsList = await itemFieldsRes.json();
        itemFieldsData = Array.isArray(fieldsList) ? fieldsList[0] : fieldsList;
      }

      console.log("Stock API Response:", stockData);
      console.log("Item Fields API Response:", itemFieldsData);

      const poQty = itemObj.po_qty || 0;
      const rate = itemFieldsData?.Rate || itemFieldsData?.rate || itemObj.rate || 0;
      const assessableValue = parseFloat(poQty) * parseFloat(rate);

      setSelectedItemObj({
        ...itemObj,
        last_operation: stockData?.last_operation || {
          part_code: itemFieldsData?.Part_Code || "",
          part_no: lookupKey,
          Name_Description: itemFieldsData?.Name_Description || itemObj.item_description,
          OPNo: stockData?.last_operation?.OPNo || "",
          Operation: stockData?.last_operation?.Operation || "",
          prod_qty: stockData?.last_operation?.prod_qty || 0,
          lots: stockData?.last_operation?.lots || [],
        },
        stock: stockData?.last_operation?.prod_qty ?? 0,
        op_no: stockData?.last_operation?.OPNo ?? "",
        operation_name: stockData?.last_operation?.Operation ?? "",
        part_code: itemFieldsData?.Part_Code || stockData?.last_operation?.part_code || "",
        part_no: stockData?.last_operation?.part_no || lookupKey,
        Name_Description: itemFieldsData?.Name_Description || itemObj.item_description,
        rate: rate,
        HSN_SAC_Code: itemFieldsData?.HSN_SAC_Code || itemFieldsData?.HSN || itemObj.HSN_SAC_Code || "",
        Finish_Weight: itemFieldsData?.Finish_Weight || itemFieldsData?.FinishWeight || itemObj.Finish_Weight || 0,
        Unit_Code: itemFieldsData?.Unit_Code || itemFieldsData?.unit_code || itemObj.Unit_Code || "pcs",
        pkg_trans: itemFieldsData?.pkg_trans || itemFieldsData?.Pkg_Charges || itemFieldsData?.Pkg_Charges_Amount || itemObj.pkg_trans || itemObj.pkg_charges || "",
        plan_date: itemFieldsData?.plan_date || itemFieldsData?.Plan_Date || itemObj.plan_date || null,
        due_date: itemFieldsData?.due_date || itemFieldsData?.Due_Date || itemObj.due_date || null,
        trans_charges: itemFieldsData?.trans_charges || itemFieldsData?.Trans_Charges || itemObj.trans_charges || "",
        qty: poQty,
        po_qty: poQty,
        item_size: itemFieldsData?.item_size || itemFieldsData?.Item_Size || itemObj.item_size || itemObj.Item_Size || "",
        Item_Size: itemFieldsData?.Item_Size || itemFieldsData?.item_size || itemObj.Item_Size || itemObj.item_size || "",
        assessable_value: assessableValue.toFixed(2),
      });

      toast.info(`Selected: ${fullItemCode}`);
    } catch (error) {
      console.error("Item fetch error:", error);

      const poQty = itemObj.po_qty || 0;
      const itemRate = itemObj.rate || 0;
      const assessableValue = parseFloat(poQty) * parseFloat(itemRate);

      setSelectedItemObj({
        ...itemObj,
        stock: 0,
        rate: itemRate,
        HSN_SAC_Code: itemObj.HSN_SAC_Code || "",
        Finish_Weight: itemObj.Finish_Weight || 0,
        Unit_Code: itemObj.Unit_Code || "pcs",
        qty: poQty,
        po_qty: poQty,
        item_size: itemObj.item_size || itemObj.Item_Size || "",
        Item_Size: itemObj.Item_Size || itemObj.item_size || "",
        assessable_value: assessableValue.toFixed(2),
        last_operation: {
          part_code: itemObj.Part_Code || "",
          part_no: lookupKey,
          Name_Description: itemObj.item_description,
          OPNo: "",
          Operation: "",
          prod_qty: 0,
          lots: [],
        },
      });

      toast.warning("Some item details not available, using defaults");
    } finally {
      setItemSearchLoading(false);
    }

    console.log("Selected Item:", itemObj);
  };

  // 3. Add to Table
  const handleAddItem = () => {
    if (!selectedItemObj) {
      toast.error("Please select an item first");
      return;
    }
    console.log("Adding item to table:", selectedItemObj);
    setTableData((prev) => [...prev, selectedItemObj]);
    setSelectedItemCode("");
    setSelectedItemObj(null);
    toast.success("Item added to table!");
  };

  // --- 1. Fetch Invoice Number on Series Selection ---
  const handleSeriesChange = async (e) => {
    const selectedSeries = e.target.value;
    setFormData((prev) => ({ ...prev, series_type: selectedSeries }));

    if (selectedSeries === "GST Invoice") {
      try {
        const response = await fetch(
          "https://sellerp-backend.onrender.com/Sales/create/invoice_no"
        );
        if (response.ok) {
          const data = await response.json();
          setFormData((prev) => ({
            ...prev,
            invoice_no: data.Invoice_no,
          }));
          toast.success(`Invoice No: ${data.Invoice_no} generated`);
        } else {
          toast.error("Failed to generate invoice number");
        }
      } catch (error) {
        console.error("API Error:", error);
        toast.error("Error generating invoice number");
      }
    } else {
      setFormData((prev) => ({ ...prev, invoice_no: "" }));
    }
  };

  const handleChange = (e) => {
    const { name, value, id } = e.target;
    const fieldName = name || id;
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  // --- FIX 4: cleanPayload with updated valid item fields ---
  const cleanPayload = (data) => {
    const validItemFields = [
      "plant", "series", "invoice_type", "invoice_no",
      "customer", "po_no", "date", "stock", "description",
      "rate", "dis", "po_qty", "bal_qty", "inv_qty",
      "pkg_qty", "type_of_packing", "hsn_code", "invoice",
      "item_code", "part_code", "part_no", "item", "item_size"
    ];

    const cleaned = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== null && value !== undefined && value !== "") {
        if (key === "items" && Array.isArray(value)) {
          cleaned[key] = value.map((item) => {
            const cleanedItem = {};
            for (const [itemKey, itemValue] of Object.entries(item)) {
              if (validItemFields.includes(itemKey) &&
                itemValue !== null &&
                itemValue !== undefined &&
                itemValue !== "") {
                cleanedItem[itemKey] = itemValue;
              }
            }
            return cleanedItem;
          });
        } else if (key === "GSTdetails" && Array.isArray(value)) {
          // Clean GSTdetails array
          cleaned[key] = value.map((tax) => {
            const cleanedTax = {};
            for (const [taxKey, taxValue] of Object.entries(tax)) {
              if (taxValue !== null && taxValue !== undefined && taxValue !== "" && taxValue !== "0") {
                cleanedTax[taxKey] = taxValue;
              }
            }
            return cleanedTax;
          });
        } else {
          cleaned[key] = value;
        }
      }
    }
    return cleaned;
  };

  // --- 2. Save Invoice (POST) ---
  const handleGenerateInvoice = async () => {
    if (!formData.series_type || !formData.invoice_no) {
      toast.error("Please select series and generate invoice number first");
      return;
    }

    if (!formData.invoice_Date) {
      toast.error("Invoice Date is mandatory.");
      document.getElementById('taxes-tab')?.click();
      return;
    }

    if (!formData.invoice_time) {
      toast.error("Invoice Time is mandatory.");
      document.getElementById('taxes-tab')?.click();
      return;
    }

    if (!formData.payment_Date) {
      toast.error("Payment Date is mandatory.");
      document.getElementById('taxes-tab')?.click();
      return;
    }

    if (!formData.date_of_removal) {
      toast.error("Removal Date is mandatory.");
      document.getElementById('taxes-tab')?.click();
      return;
    }

    if (!formData.time) {
      toast.error("Time is mandatory.");
      document.getElementById('taxes-tab')?.click();
      return;
    }

    if (!formData.vehical_no) {
      toast.error("Vehicle No is mandatory.");
      document.getElementById('taxes-tab')?.click();
      return;
    }

    if (!formData.d_c_Date) {
      toast.error("D.C. Date is mandatory.");
      document.getElementById('taxes-tab')?.click();
      return;
    }

    if (!formData.trans_distance_km) {
      toast.error("Transport K.M. is mandatory.");
      document.getElementById('taxes-tab')?.click();
      return;
    }

    if (tableData.length === 0) {
      toast.error("Please add at least one item to the invoice");
      return;
    }

    try {
      // --- FIX 2: Map frontend fields to backend ---
      const mappedItems = tableData.map((row) => ({
        plant: formData.plant || row.plant || "VISHWA S.I.",
        series: formData.series_type || "",
        invoice_type: formData.invoice_type || "GST",
        invoice_no: formData.invoice_no || "",
        customer: row.customer || formData.bill_to || "",
        po_no: row.cust_po || selectedPO || "",
        date: row.plan_date || row.due_date || null,
        stock: String(row.stock ?? 0),
        description: row.item_description || row.Name_Description || "",
        rate: String(row.rate || 0),
        dis: Number(row.desc_percent || row.discount_percent || 0), // ✅ Ensure Number
        po_qty: String(row.po_qty || row.qty || 0),
        assessable_value: String(row.assessable_value || 0),
        bal_qty: String(row.bal_qty !== undefined ? row.bal_qty : (row.po_qty || row.qty || 0)),
        inv_qty: String(row.inv_qty || row.qty || row.po_qty || 0),
        pkg_qty: row.pkg_qty ? String(row.pkg_qty) : null,
        type_of_packing: row.type_of_packing || "",
        hsn_code: row.HSN_SAC_Code || row.hsn_code || "",
        item_code: row.item_code || "",
        part_code: row.last_operation?.part_code || row.Part_Code || row.part_code || row.Item_Code || row.hsn_code || "1",
        part_no: row.last_operation?.part_no || row.Part_No || row.part_no || row.part_no_short || row.item_code || "",
        item_size: row.item_size || row.Item_Size || "",
      }));

      // Calculate total assessable value
      const totalAssessableValue = tableData.reduce((sum, item) => {
        const value = parseFloat(item.assessable_value || 0);
        return sum + value;
      }, 0);

      let invoicePayload = {
        ...formData,
        items: mappedItems,
        GSTdetails: [{
          base_value: taxData.base_value || "0.00",
          disc_amt: parseInt(taxData.disc_amt || 0),
          assessble_value: totalAssessableValue.toFixed(2),
          cgst: Number(taxData.cgst || 0),
          sgst: Number(taxData.sgst || 0),
          igst: Number(taxData.igst || 0),
          utgst: Number(taxData.utgst || 0),
          cgst_amt: Number(taxData.cgst_amt || 0),
          sgst_amt: Number(taxData.sgst_amt || 0),
          igst_amt: Number(taxData.igst_amt || 0),
          utgst_amt: Number(taxData.utgst_amt || 0),
          grand_total: Math.round(totalAssessableValue + 
            Number(taxData.cgst_amt || 0) + 
            Number(taxData.sgst_amt || 0) + 
            Number(taxData.igst_amt || 0) + 
            Number(taxData.utgst_amt || 0)),           // ✅ API requires integer
        }],
      };

      // Clean the payload to remove null/empty values
      invoicePayload = cleanPayload(invoicePayload);

      console.log("🔍 CLEANED PAYLOAD BEFORE SEND:");
      console.log(JSON.stringify(invoicePayload, null, 2));

      const response = await fetch("https://sellerp-backend.onrender.com/Sales/invoice/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoicePayload),
      });

      if (response.ok) {
        toast.success("Invoice Generated Successfully!");
        setFormData({
          ...formData,
          invoice_no: "",
          series_type: "",
        });
        setTableData([]);
        setTaxData({
          base_value: "0",
          disc_amt: "0",
          assessable_value: "0",
          cgst: "6",
          sgst: "6",
          igst: "0",
          utgst: "0",
          cgst_amt: "0.00",
          sgst_amt: "0.00",
          igst_amt: "0.00",
          utgst_amt: "0.00"
        });

        const seriesSelect = document.getElementById("seriesSelect");
        if (seriesSelect) seriesSelect.value = "Select";

        // setTimeout(() => {
        //   navigate("/InvoiceList");
        // }, 1500);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Invoice Error Response:", errorData);
        toast.error(`Failed: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Error generating invoice: " + error.message);
    }
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleButtonClick = () => {
    navigate("/NewinvoiceGST");
  };

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

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        if (!customerSearchTerm) {
          setCustomers([]);
          return;
        }

        const response = await fetch(
          `https://sellerp-backend.onrender.com/Sales/items/customers-list/?q=${customerSearchTerm}`
        );

        if (response.ok) {
          const result = await response.json();
          setCustomers(result.data || []);
        }
      } catch (error) {
        console.error("Customer fetch error:", error);
      }
    };

    const delayDebounce = setTimeout(fetchCustomers, 300);
    return () => clearTimeout(delayDebounce);
  }, [customerSearchTerm]);

  // Fetch PO data from API
  const fetchPOList = async (customerName) => {
    if (!customerName) {
      setPoList([]);
      return;
    }

    try {
      setPoSearchLoading(true);
      const response = await fetch(
        `https://sellerp-backend.onrender.com/Sales/customer/po/?customer=${encodeURIComponent(customerName)}`
      );

      if (response.ok) {
        const data = await response.json();
        console.log("PO List:", data);
        const poArray = Array.isArray(data) ? data : data.data || data.po || [];
        setPoList(poArray);
        if (poArray.length > 0) {
          toast.success(`Found ${poArray.length} PO(s)`);
        }
      } else {
        setPoList([]);
      }
    } catch (error) {
      console.error("PO fetch error:", error);
      setPoList([]);
    } finally {
      setPoSearchLoading(false);
    }
  };

  // Auto-fetch POs when customer is selected
  useEffect(() => {
    const customerName = formData.bill_to || customerSearchTerm;
    if (customerName && customerName.trim()) {
      fetchPOList(customerName);
    }
  }, [formData.bill_to, customerSearchTerm]);

  // Handle Select PO button click
  const handleSelectPO = async () => {
    const customerName = formData.bill_to || customerSearchTerm;

    if (!customerName) {
      toast.error("Please select a customer first");
      return;
    }

    fetchPOList(customerName);
  };

  // Handle Clear button for PO
  const handleClearPO = () => {
    setSelectedPO("");
    setPoList([]);
    toast.info("PO selection cleared");
  };

  return (
    <div className="NewInvoice">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
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
                <div className="NewInvoice">
                  <div className="NewInvoice-header mb-2 text-start">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="header-title mb-0" style={{ fontSize: "22px", fontWeight: "700", color: "blue" }}>New Invoice</h5>
                      <div className="d-flex gap-2 align-items-center">
                        <button
                          type="button"
                          className="vndrbtn mx-1"
                          onClick={() => navigate("/InvoiceList")}
                        >
                          InvoiceList
                        </button>
                        
                      </div>
                    </div>

                    <div className="d-flex align-items-center flex-wrap gap-4">
                      <div className="d-flex flex-column gap-1 align-items-start">
                        <label className="mb-0 fw-bold text-nowrap" style={{ fontSize: "12px" }}>Plant:</label>
                        <select
                          className="form-select form-select-sm header-plant-select"
                          name="plant"
                          value={formData.plant}
                          onChange={handleChange}
                          style={{ width: "100px" }}
                        >
                          <option value="VISHWA S.I.">VISHWA S.I.</option>
                        </select>
                      </div>

                      <div className="d-flex flex-column gap-1 align-items-start">
                        <label className="mb-0 fw-bold text-nowrap" style={{ fontSize: "12px" }}>Series:</label>
                        <select
                          className="form-select form-select-sm"
                          name="series_type"
                          value={formData.series_type}
                          onChange={handleSeriesChange}
                          style={{ width: "130px" }}
                        >
                          <option value="">Select</option>
                          <option value="GST Invoice">GST Invoice</option>
                        </select>
                      </div>

                      <div className="d-flex flex-column gap-1 align-items-start">
                        <label className="mb-0 fw-bold text-nowrap" style={{ fontSize: "12px" }}>Inv No:</label>
                        <input
                          type="text"
                          placeholder="Inv No"
                          className="form-control form-control-sm bg-light"
                          value={formData.invoice_no || ""}
                          readOnly
                          style={{ width: "100px" }}
                        />
                      </div>

                      <div className="d-flex flex-column gap-1 align-items-start">
                        <label className="mb-0 fw-bold text-nowrap" style={{ fontSize: "12px" }}>Type:</label>
                        <select
                          name="invoice_type"
                          value={formData.invoice_type}
                          onChange={handleChange}
                          className="form-select form-select-sm"
                          style={{ width: "150px" }}
                        >
                          <option value="GST">GST</option>
                          <option value="SCRAP">SCRAP</option>
                          <option value="Stock Transfer">Stock Transfer</option>
                          <option value="Direct Export">Direct Export</option>
                          <option value="Third Party EXP (In State)">Third Party EXP (In State)</option>
                          <option value="Third Party Export (Out State)">Third Party Export (Out State)</option>
                          <option value="Asset">Asset</option>
                          <option value="Tool">Tool</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="NewInvoice-Main mt2">
                    <div className="NewInvoice-tabs">
                      <ul
                        className="nav nav-tabs"
                        id="AssembleEntryTabs"
                        role="tablist"
                      >
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link active"
                            id="itemdetails-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#itemdetails"
                            type="button"
                            role="tab"
                          >
                            A. Item Details
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
                            B. Taxes
                          </button>
                        </li>
                      </ul>

                      <div
                        className="tab-content mt-2"
                        id="productionEntryTabsContent"
                      >
                        <div
                          className="tab-pane fade show active"
                          id="itemdetails"
                          role="tabpanel"
                        >
                          <div className="row text-start">
                            <div className="col-2">
                              <label htmlFor="customer-select" className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>
                                Select Cust:
                              </label>
                            </div>
                            <div className="col-3">
                              <select
                                id="customer-select"
                                className="form-select"
                                value={formData.bill_to}
                                onChange={(e) => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    bill_to: e.target.value,
                                  }));
                                  setCustomerSearchTerm(e.target.value);
                                }}
                              >
                                <option value="">Select Customer</option>
                                {items
                                  .map((item) => item.customer)
                                  .filter((value, index, self) => value && self.indexOf(value) === index)
                                  .sort()
                                  .map((customer) => (
                                    <option key={customer} value={customer}>
                                      {customer}
                                    </option>
                                  ))}
                              </select>
                            </div>
                            <div className="col-2">
                              <button
                                className="vndrbtn w-100"
                                onClick={() => {
                                  alert("Customer Selected: " + formData.bill_to);
                                }}
                              >
                                Search
                              </button>
                            </div>
                          </div>

                          <div className="row mt-2 text-start">
                            <div className="col-2">
                              <label htmlFor="prod-no" className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>Select PO:</label>
                            </div>
                            <div className="col-3">
                              <select
                                name="po"
                                id="po-select"
                                className="form-control"
                                value={selectedPO}
                                onChange={(e) => setSelectedPO(e.target.value)}
                              >
                                <option value="">Select an Option</option>
                                {poList.map((po, index) => (
                                  <option
                                    key={index}
                                    value={po.cust_po || po.po_no || po.id || po}
                                  >
                                    {po.cust_po || po.po_no || po.id} - {po.cust_date || po.po_date || ""} - SO: {po.so_no || po.sales_order_no || po.order_no || ""}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="col-1">
                                              <button
                                  type="button"
                                  className="vndrbtn w-100"
                                  onClick={handleClearPO}
                                >
                                  Clear
                                </button>
                            </div>
                            <div className="col-2">
                                  <button
                                  type="button"
                                  className="vndrbtn w-100"
                                  onClick={handleSelectPO}
                                >
                                  Select PO
                                </button>
                            </div>
                          </div>

                          {/* SEARCH SECTION */}
                          <div className="row mt-2 text-start mb-3">
                            <div className="col-2">
                              <label htmlFor="prod-no" className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>Select Item :</label>
                            </div>
                            <div className="col-3">
                              <select
                                name="item"
                                id="item-select"
                                className="form-control"
                                value={selectedItemCode}
                                onChange={handleItemSelect}
                                disabled={itemSearchLoading || customerItems.length === 0}
                              >
                                <option value="">
                                  {customerItems.length === 0 ? 'Select customer first' : 'Select Item'}
                                </option>
                                {customerItems.map((item, index) => (
                                  <option
                                    key={index}
                                    value={item.item_code}
                                  >
                                    {item.item_code}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="col-2">
                                  <button
                                  type="button"
                                  className="vndrbtn w-100"
                                  onClick={handleAddItem}
                                >
                                  Add
                                </button>
                            </div>
                          </div>

                          <div className="table-responsive mt-2">
                            <table className="table">
                              <thead>
                                <tr>
                                  <th>Sr.</th>
                                  <th>Item Code | Description</th>
                                  <th>PO No | Date</th>
                                  <th>Stock</th>
                                  <th>Description</th>
                                  <th>Rate</th>
                                  <th>PO Qty</th>
                                  <th>Bal.Qty</th>
                                  <th>Inv.Qty</th>
                                  <th>Pkg Qty</th>
                                  <th>Type Of Packing</th>
                                  <th>Del</th>
                                </tr>
                              </thead>
                              <tbody>
                                {tableData.length > 0 ? (
                                  tableData.map((row, index) => (
                                    <tr key={index}>
                                      <td>{index + 1}</td>
                                      <td>
                                        <strong>Code:</strong> {row.item_code} <br />
                                        <strong>Desc:</strong> {row.item_description}
                                      </td>
                                      <td>
                                        {row.part_no} <br /> Pr No. :{" "}
                                        {row.Part_Code}
                                      </td>
                                      <td>
                                        <small>
                                          <div><strong>Part No:</strong> {row.last_operation?.part_no}</div>
                                          <div><strong>Part Code:</strong> {row.last_operation?.part_code}</div>
                                          <div><strong>Name:</strong> {row.last_operation?.Name_Description}</div>
                                          <div><strong>OP No:</strong> {row.last_operation?.OPNo}</div>
                                          <div style={{ fontSize: "11px", color: "gray" }}><strong>Operation:</strong> {row.last_operation?.Operation}</div>
                                          <div><strong>Prod Qty:</strong> <span style={{ backgroundColor: "#ffeb3b", padding: "2px 5px", borderRadius: "3px" }}>{row.last_operation?.prod_qty ?? 0}</span></div>
                                          {row.last_operation?.lots && row.last_operation.lots.length > 0 && (
                                            <div><strong>Lots:</strong> {row.last_operation.lots.join(", ")}</div>
                                          )}
                                        </small>
                                      </td>
                                      <td>
                                        <textarea
                                          defaultValue={row.Name_Description}
                                          className="form-control-sm w-100"
                                        ></textarea>
                                        <br />{" "}
                                        <span>
                                          Item Size : {row.Item_Size || row.item_size || "-"}
                                        </span>
                                        <br />{" "}
                                        <span>
                                          HSN Code : {row.HSN_SAC_Code}
                                        </span>
                                        <br />
                                        <span>
                                          Plan/Due: {row.due_date ? new Date(row.due_date).toLocaleDateString() : (row.plan_date ? new Date(row.plan_date).toLocaleDateString() : "-")}
                                        </span>
                                      </td>
                                      <td className="text-start">
                                        Rate : {row.rate}
                                        <br />
                                        Disc: {row.desc || row.desc_percent || row.discount_percent || row.discount_amount || "-"}% <br />
                                        Pkg Charges: {row.pkg_trans || "-"} <br />
                                        Trans Charges: {row.trans_charges || "-"} <br />
                                        <span style={{ color: "blue" }}>
                                          Rate Type:
                                        </span>
                                        <br /> Amort Rate :
                                      </td>
                                      <td>{row.po_qty || row.qty || 0}</td>
                                      <td>{row.bal_qty !== undefined ? row.bal_qty : (row.po_qty || row.qty || 0)}</td>
                                      <td>
                                        <input
                                          type="number"
                                          className="form-control form-control-sm w-100"
                                          placeholder="Qty"
                                          value={row.inv_qty !== undefined ? row.inv_qty : (row.qty || row.po_qty || 0)}
                                          onChange={(e) => {
                                            let newQty = e.target.value;
                                            const prodQty = parseFloat(row.last_operation?.prod_qty || 0);
                                            
                                            if (newQty !== "" && parseFloat(newQty) > prodQty) {
                                              toast.error("Quantity cannot be higher than Production Qty.");
                                              newQty = prodQty.toString();
                                            }

                                            const updatedData = tableData.map((item, i) => {
                                              if (i === index) {
                                                const rate = parseFloat(item.rate || 0);
                                                const itemTotal = parseFloat(newQty || 0) * rate;
                                                return { 
                                                  ...item, 
                                                  inv_qty: newQty,
                                                  qty: newQty, 
                                                  assessable_value: itemTotal.toFixed(2) 
                                                };
                                              }
                                              return item;
                                            });
                                            setTableData(updatedData);
                                          }}
                                        />
                                        <div className="mt-1" style={{ fontSize: "11px" }}>
                                          Per Pcs Wt:
                                        </div>
                                        <input
                                          type="number"
                                          className="form-control form-control-sm w-100"
                                          placeholder="Weight"
                                          value={row.Finish_Weight || ""}
                                          onChange={(e) => {
                                            const updatedData = tableData.map((item, i) => 
                                              i === index ? { ...item, Finish_Weight: e.target.value } : item
                                            );
                                            setTableData(updatedData);
                                          }}
                                        />
                                        <div className="mt-1" style={{ fontSize: "11px", color: "blue" }}>
                                          Per Unit: {row.Unit_Code || "NOS"}
                                        </div>
                                      </td>
                                      <td>
                                        <input 
                                          type="number" 
                                          className="form-control form-control-sm w-100" 
                                          placeholder="Pkg Qty"
                                          value={row.pkg_qty || ""}
                                          onChange={(e) => {
                                            const updatedData = tableData.map((item, i) => 
                                              i === index ? { ...item, pkg_qty: e.target.value } : item
                                            );
                                            setTableData(updatedData);
                                          }}
                                        />
                                      </td>
                                      <td>
                                        <textarea 
                                          className="form-control form-control-sm w-100"
                                          rows="2"
                                          placeholder="Type of Packing"
                                          value={row.type_of_packing || ""}
                                          onChange={(e) => {
                                            const updatedData = tableData.map((item, i) => 
                                              i === index ? { ...item, type_of_packing: e.target.value } : item
                                            );
                                            setTableData(updatedData);
                                          }}
                                        ></textarea>
                                      </td>
                                      <td>
                                        <button
                                          className="vndrbtn btn-danger btn-sm"
                                          onClick={() =>
                                            setTableData(
                                              tableData.filter(
                                                (_, i) => i !== index
                                              )
                                            )
                                          }
                                        >
                                          X
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="11" className="text-center">
                                      No items added
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div
                          className="tab-pane fade"
                          id="taxes"
                          role="tabpanel"
                        >
                          <div className="row text-start">
                            {/* Column 1 */}
                            <div className="col-md-4">
                              <div className="row mb-2">
                                <div className="col-4">
                                  <label className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>Invoice No:</label>
                                </div>
                                <div className="col-8 d-flex gap-1">
                                  <input
                                    name="series_display"
                                    value={formData.series_type || ""}
                                    className="form-control"
                                    readOnly
                                    placeholder="Series"
                                  />
                                  <input
                                    name="invoice_no"
                                    value={formData.invoice_no || ""}
                                    className="form-control"
                                    placeholder="No."
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div className="row mb-2">
                                <div className="col-4">
                                  <label className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>Payment Date: <span className="text-danger">*</span></label>
                                </div>
                                <div className="col-8">
                                  {/* FIX 1: name updated to payment_Date */}
                                  <input
                                    type="date"
                                    name="payment_Date"
                                    value={formData.payment_Date}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="row mb-2">
                                <div className="col-4">
                                  <label className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>Mode of Trans:</label>
                                </div>
                                <div className="col-8 d-flex gap-1">
                                  <input
                                    type="text"
                                    name="mode_of_trans"
                                    value={formData.mode_of_trans}
                                    onChange={handleChange}
                                    className="form-control"
                                  />
                                  <select
                                    name="freight"
                                    value={formData.freight}
                                    onChange={handleChange}
                                    className="form-control"
                                  >
                                    <option value="">Freight</option>
                                  </select>
                                </div>
                              </div>
                              <div className="row mb-2">
                                <div className="col-4">
                                  <label className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>Bill TO:</label>
                                </div>
                                <div className="col-8 d-flex gap-1">
                                  <input
                                    name="bill_to"
                                    value={formData.bill_to}
                                    onChange={handleChange}
                                    className="form-control"
                                  />
                                  <button
                                    type="button"
                                    className="vndrbtn"
                                  >
                                    Search
                                  </button>
                                </div>
                              </div>
                              <div className="row mb-2">
                                <div className="col-4">
                                  <label className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>Ship TO:</label>
                                </div>
                                <div className="col-8 d-flex gap-1">
                                  <input
                                    name="ship_to"
                                    value={formData.ship_to}
                                    onChange={handleChange}
                                    className="form-control"
                                  />
                                  <button
                                    type="button"
                                    className="vndrbtn"
                                  >
                                    Search
                                  </button>
                                </div>
                              </div>
                              <div className="row mb-2">
                                <div className="col-4">
                                  <label className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>Eway Bill Date:</label>
                                </div>
                                <div className="col-8">
                                  {/* FIX 1: name updated to Eway_bill_Date */}
                                  <input
                                    type="date"
                                    name="Eway_bill_Date"
                                    value={formData.Eway_bill_Date}
                                    onChange={handleChange}
                                    className="form-control"
                                  />
                                </div>
                              </div>
                              <div className="row mb-2">
                                <div className="col-4">
                                  <label className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>Note/Remark:</label>
                                </div>
                                <div className="col-8">
                                  <textarea
                                    name="note_remark"
                                    value={formData.note_remark}
                                    onChange={handleChange}
                                    className="form-control"
                                  ></textarea>
                                </div>
                              </div>
                            </div>

                            {/* Column 2 */}
                            <div className="col-md-4">
                              <div className="row mb-2">
                                <div className="col-4">
                                  <label className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>Invoice Date: <span className="text-danger">*</span></label>
                                </div>
                                <div className="col-8">
                                  {/* FIX 1: name updated to invoice_Date */}
                                  <input
                                    type="date"
                                    name="invoice_Date"
                                    value={formData.invoice_Date}
                                    className="form-control bg-light"
                                    readOnly
                                    required
                                  />
                                </div>
                              </div>
                              <div className="row mb-2">
                                <div className="col-4">
                                  <label className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>Removal Date: <span className="text-danger">*</span></label>
                                </div>
                                <div className="col-8">
                                  <input
                                    type="date"
                                    name="date_of_removal"
                                    value={formData.date_of_removal}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="row mb-2">
                                <div className="col-4">
                                  <label className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>Vehicle No: <span className="text-danger">*</span></label>
                                </div>
                                <div className="col-8 d-flex gap-1">
                                  <input
                                    name="vehical_no"
                                    value={formData.vehical_no}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                  />
                                  <button
                                    type="button"
                                    className="vndrbtn"
                                  >
                                    <FaPlus />
                                  </button>
                                </div>
                              </div>
                              <div className="row mb-2">
                                <div className="col-4">
                                  <label className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>Addr Code:</label>
                                </div>
                                <div className="col-8 d-flex gap-1">
                                  <select
                                    name="addr_code"
                                    value={formData.addr_code}
                                    onChange={handleChange}
                                    className="form-control"
                                  >
                                    <option value=""></option>
                                  </select>
                                  <button
                                    type="button"
                                    className="vndrbtn"
                                  >
                                    <FaRegCircleQuestion />
                                  </button>
                                </div>
                              </div>
                              <div className="row mb-2">
                                <div className="col-4">
                                  <label className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>Eway Bill No:</label>
                                </div>
                                <div className="col-8">
                                  {/* FIX 1: name updated to Eway_bill_no */}
                                  <input
                                    name="Eway_bill_no"
                                    value={formData.Eway_bill_no}
                                    onChange={handleChange}
                                    className="form-control"
                                  />
                                </div>
                              </div>
                              <div className="row mb-2">
                                <div className="col-4">
                                  <label className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>Delivery Terms:</label>
                                </div>
                                <div className="col-8">
                                  <textarea
                                    name="delivery_terms"
                                    value={formData.delivery_terms}
                                    onChange={handleChange}
                                    className="form-control"
                                  ></textarea>
                                </div>
                              </div>
                              <div className="row mb-2">
                                <div className="col-4">
                                  <label className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>D.C. Date: <span className="text-danger">*</span></label>
                                </div>
                                <div className="col-8">
                                  {/* FIX 1: name updated to d_c_Date */}
                                  <input
                                    type="date"
                                    name="d_c_Date"
                                    value={formData.d_c_Date}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Column 3 */}
                            <div className="col-md-4">
                              <div className="row mb-2">
                                <div className="col-4">
                                  <label className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>Invoice Time: <span className="text-danger">*</span></label>
                                </div>
                                <div className="col-8">
                                  <input
                                    type="time"
                                    name="invoice_time"
                                    value={formData.invoice_time}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="row mb-2">
                                <div className="col-4">
                                  <label className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>Time: <span className="text-danger">*</span></label>
                                </div>
                                <div className="col-8">
                                  <input
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="row mb-2">
                                <div className="col-4">
                                  <label className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>Transporter:</label>
                                </div>
                                <div className="col-8 d-flex gap-1">
                                  <input
                                    name="transporter"
                                    value={formData.transporter}
                                    onChange={handleChange}
                                    className="form-control"
                                  />
                                  <button
                                    type="button"
                                    className="vndrbtn"
                                  >
                                    <FaPlus />
                                  </button>
                                </div>
                              </div>
                              <div className="row mb-2">
                                <div className="col-4">
                                  <label className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>L/R GC Note:</label>
                                </div>
                                <div className="col-8">
                                  <input
                                    name="l_r_gc_note"
                                    value={formData.l_r_gc_note}
                                    onChange={handleChange}
                                    className="form-control"
                                  />
                                </div>
                              </div>
                              <div className="row mb-2">
                                <div className="col-4">
                                  <label className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>Place Supply:</label>
                                </div>
                                <div className="col-8">
                                  <input
                                    name="place_of_supply"
                                    value={formData.place_of_supply}
                                    onChange={handleChange}
                                    className="form-control"
                                  />
                                </div>
                              </div>
                              <div className="row mb-2">
                                <div className="col-4">
                                  <label className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>Dest. Code:</label>
                                </div>
                                <div className="col-8">
                                  <input
                                    name="destenation_code"
                                    value={formData.destenation_code}
                                    onChange={handleChange}
                                    className="form-control"
                                  />
                                </div>
                              </div>
                              <div className="row mb-2">
                                <div className="col-4">
                                  <label className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>D.C. NO:</label>
                                </div>
                                <div className="col-8">
                                  <input
                                    name="d_c_no"
                                    value={formData.d_c_no}
                                    onChange={handleChange}
                                    className="form-control"
                                  />
                                </div>
                              </div>
                              <div className="row mb-2">
                                <div className="col-4">
                                  <label className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>Transport Doc No.:</label>
                                </div>
                                <div className="col-8">
                                  <input
                                    name="trans_doc_no"
                                    value={formData.trans_doc_no}
                                    onChange={handleChange}
                                    className="form-control"
                                  />
                                </div>
                              </div>
                              <div className="row mb-2">
                                <div className="col-4">
                                  <label className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>Transport K.M.: <span className="text-danger">*</span></label>
                                </div>
                                <div className="col-8">
                                  <input
                                    name="trans_distance_km"
                                    value={formData.trans_distance_km}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="table-container border p-2">
                            {/* Row 1 */}
                            <div className="row align-items-center mb-2">
                              <div className="col-md-3 d-flex justify-content-between">
                                <label className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>Base Value</label>
                                <input
                                  className="form-control form-control-sm w-50"
                                  placeholder="0"
                                  value={taxData.base_value || "0"}
                                  readOnly
                                />
                              </div>

                              <div className="col-md-3 d-flex justify-content-between">
                                <label className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>Assessable Value</label>
                                <input
                                  className="form-control form-control-sm w-50"
                                  placeholder="0"
                                  value={taxData.assessable_value}
                                  onChange={(e) => setTaxData({ ...taxData, assessable_value: e.target.value })}
                                />
                              </div>

                              <div className="col-md-3">
                                <div className="d-flex align-items-center gap-1">
                                  <label className="me-auto fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>Pack & Fwrd</label>
                                  <input
                                    className="form-control form-control-sm w-25"
                                    placeholder="%"
                                  />
                                  <input
                                    className="form-control form-control-sm w-50"
                                    placeholder="0"
                                  />
                                </div>
                              </div>

                              <div className="col-md-3">
                                <strong>Total Amortisation : 0</strong>
                              </div>
                            </div>

                            {/* Row 2 */}
                            <div className="row align-items-center mb-2">
                              <div className="col-md-3 d-flex justify-content-between">
                                <label className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>Disc Amt</label>
                                <input
                                  className="form-control form-control-sm w-50"
                                  placeholder="0"
                                  value={taxData.disc_amt || "0"}
                                  readOnly
                                />
                              </div>

                              <div className="col-md-3 d-flex justify-content-between">
                                <label className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>CGST {taxData.cgst || 0}%</label>
                                <input
                                  className="form-control form-control-sm w-50"
                                  placeholder="0.00"
                                  value={taxData.cgst_amt}
                                  readOnly
                                />
                              </div>

                              <div className="col-md-3">
                                <div className="d-flex align-items-center gap-1">
                                  <label className="me-auto fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>
                                    Transport Crg
                                  </label>
                                  <input
                                    className="form-control form-control-sm w-25"
                                    placeholder="%"
                                  />
                                  <input
                                    className="form-control form-control-sm w-50"
                                    placeholder="0"
                                  />
                                </div>
                              </div>

                              <div className="col-md-3">
                                <label className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>CGST Amt: ₹{taxData.cgst_amt || "0.00"}</label>
                              </div>
                            </div>

                            {/* Row 3 */}
                            <div className="row align-items-center mb-2">
                              <div className="col-md-3 d-flex justify-content-between">
                                <label className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>Rev. Base Crg</label>
                                <select className="form-select form-select-sm w-50">
                                  <option>NO</option>
                                  <option>YES</option>
                                </select>
                              </div>

                              <div className="col-md-3 d-flex justify-content-between">
                                <label className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>SGST {taxData.sgst || 0}%</label>
                                <input
                                  className="form-control form-control-sm w-50"
                                  placeholder="0.00"
                                  value={taxData.sgst_amt}
                                  readOnly
                                />
                              </div>

                              <div className="col-md-3">
                                <div className="d-flex align-items-center gap-1">
                                  <label className="me-auto fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>Freight Crg</label>
                                  <input
                                    className="form-control form-control-sm w-25"
                                    placeholder="%"
                                  />
                                  <input
                                    className="form-control form-control-sm w-50"
                                    placeholder="0"
                                  />
                                </div>
                              </div>

                              <div className="col-md-3">
                                <label className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>SGST Amt: ₹{taxData.sgst_amt || "0.00"}</label>
                              </div>
                            </div>

                            {/* Row 4 */}
                            <div className="row align-items-center mb-2">
                              <div className="col-md-3 d-flex justify-content-between">
                                <label className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>Rev Crg Amt</label>
                                <input
                                  className="form-control form-control-sm w-50"
                                  placeholder="0"
                                />
                              </div>

                              <div className="col-md-3 d-flex justify-content-between">
                                <label className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>IGST {taxData.igst || 0}%</label>
                                <input
                                  className="form-control form-control-sm w-50"
                                  placeholder="0.00"
                                  value={taxData.igst_amt}
                                  readOnly
                                />
                              </div>

                              <div className="col-md-3">
                                <div className="d-flex align-items-center gap-1">
                                  <label className="me-auto fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>Other Crg</label>
                                  <input
                                    className="form-control form-control-sm w-25"
                                    placeholder="%"
                                  />
                                  <input
                                    className="form-control form-control-sm w-50"
                                    placeholder="0"
                                  />
                                </div>
                              </div>

                              <div className="col-md-3">
                                <label className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>IGST Amt: ₹{taxData.igst_amt || "0.00"}</label>
                              </div>
                            </div>

                            {/* Row 5 */}
                            <div className="row align-items-center">
                              <div className="col-md-3 d-flex justify-content-between">
                                <label className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>TCS</label>
                                <input
                                  className="form-control form-control-sm w-50"
                                  placeholder="0"
                                />
                              </div>

                              <div className="col-md-3 d-flex justify-content-between">
                                <label className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>UTGST {taxData.utgst || 0}%</label>
                                <input
                                  className="form-control form-control-sm w-50"
                                  placeholder="0.00"
                                  value={taxData.utgst_amt}
                                  readOnly
                                />
                              </div>

                              <div className="col-md-3 d-flex justify-content-between">
                                <label className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>Grand Total</label>
                                <input
                                  className="form-control form-control-sm w-50 bg-light"
                                  placeholder="0"
                                  value={Math.round(
                                    parseFloat(taxData.assessable_value || 0) +
                                    Number(taxData.cgst_amt || 0) +
                                    Number(taxData.sgst_amt || 0) +
                                    Number(taxData.igst_amt || 0) +
                                    Number(taxData.utgst_amt || 0)
                                  )}
                                  readOnly
                                />
                              </div>

                              <div className="col-md-3">
                                <label className="fw-bold mb-0 text-nowrap" style={{ fontSize: "12px" }}>UTGST Amt: ₹{taxData.utgst_amt || "0.00"}</label>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="row mt-2 mb-5 pb-5">
                          <div className="col-md-2">
                            <button
                              className="vndrbtn w-100 mt-3"
                              onClick={handleGenerateInvoice}
                            >
                              Generate Invoice
                            </button>
                          </div>
                          <div className="col-md-3 d-flex align-items-center">
                            <input
                              type="checkbox"
                              id="printRate"
                              checked={isChecked}
                              onChange={handleCheckboxChange}
                            />
                            <label htmlFor="printRate" className="ms-2">
                              PrintRate
                            </label>
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

export default NewInvoice;