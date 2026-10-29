import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import NavBar from "../../../NavBar/NavBar.js";
import SideNav from "../../../SideNav/SideNav.js";
import "./BalanceSheet.css";
import { Tooltip, IconButton } from "@mui/material";
import { FaEye } from "react-icons/fa";
import * as XLSX from "xlsx";

const BalanceSheet = () => {
  const [sideNavOpen, setSideNavOpen] = useState(false);

  // Filter form fields
  const [filters, setFilters] = useState({
    plant: "VISHWA S.I.",
    fromDate: "",
    toDate: "",
    customer: "",
    heatNo: "",
  });

  // Data for the main table (flattened items with customer details)
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal state for Heat Details
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  // Filter rows by heat number if entered
  const displayedRows = rows.filter((r) => {
    if (!filters.heatNo || filters.heatNo.trim() === "") return true;
    const query = filters.heatNo.trim().toLowerCase();
    if (!r.variants || !Array.isArray(r.variants)) return false;
    return r.variants.some((v) => {
      const heat = String(v.HeatNo || v.heat_no || "").toLowerCase();
      return heat.includes(query);
    });
  });

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(displayedRows.length / itemsPerPage) || 1;
  const currentRows = displayedRows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSideNav = () => {
    setSideNavOpen((prev) => !prev);
  };

  useEffect(() => {
    if (sideNavOpen) {
      document.body.classList.add("side-nav-open");
    } else {
      document.body.classList.remove("side-nav-open");
    }
  }, [sideNavOpen]);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showModal]);

  // Fetch balance sheet data from backend API
  const fetchBalanceSheetData = async (params = {}) => {
    setLoading(true);
    try {
      const response = await axios.get("https://sellerp-backend.onrender.com/Store/balance-sheet/", {
        params,
      });

      let rawData = [];
      if (Array.isArray(response.data)) {
        rawData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        rawData = response.data.data;
      } else if (response.data && Array.isArray(response.data.results)) {
        rawData = response.data.results;
      }

      // Flatten customer data structure:
      // Each customer has .items array. Map each item with customer name and metadata.
      const flattenedRows = [];
      rawData.forEach((custObj, custIndex) => {
        const customerName = custObj.customer || "-";
        const itemsList = Array.isArray(custObj.items) ? custObj.items : (custObj.items ? [custObj.items] : []);

        if (itemsList.length > 0) {
          itemsList.forEach((item, itemIndex) => {
            flattenedRows.push({
              ...item,
              customer: customerName,
              uniqueId: `${custIndex}_${itemIndex}_${item.item_code || ""}`,
            });
          });
        } else if (custObj.item_code) {
          // Fallback if data is already a flat list of items
          flattenedRows.push({
            ...custObj,
            customer: customerName,
            uniqueId: `${custIndex}_${custObj.item_code || ""}`,
          });
        }
      });

      setRows(flattenedRows);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error fetching balance sheet:", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load - show all data normally
  useEffect(() => {
    fetchBalanceSheetData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((f) => ({ ...f, [name]: value }));
  };

  // Build query params and search/filter
  const handleSearch = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setCurrentPage(1);
    const params = {};
    if (filters.customer && filters.customer.trim() !== "") {
      params.customer = filters.customer.trim();
    }
    if (filters.fromDate && filters.fromDate.trim() !== "") {
      const from = filters.fromDate.trim();
      params.from_date = from;
      params.fromDate = from;
    }
    if (filters.toDate && filters.toDate.trim() !== "") {
      const to = filters.toDate.trim();
      params.to_date = to;
      params.toDate = to;
    }
    if (filters.heatNo && filters.heatNo.trim() !== "") {
      const heat = filters.heatNo.trim();
      params.heat_no = heat;
      params.heatNo = heat;
    }
    fetchBalanceSheetData(params);
  };

  const handleOpenHeatDetails = (item) => {
    setSelectedItem(item);
    setModalData(item.variants || []);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalData([]);
    setSelectedItem(null);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const getHeatCount = (variants) => {
    if (!variants || !Array.isArray(variants)) return 0;
    const heats = variants
      .map((v) => v.HeatNo || v.heat_no)
      .filter((h) => h && String(h).trim() !== "");
    return heats.length;
  };

  const handleExportExcel = () => {
    if (displayedRows.length === 0) {
      alert("No data to export");
      return;
    }

    const exportData = displayedRows.map((r, index) => ({
      "Sr": index + 1,
      "Cust. Name": r.customer || "-",
      "Item Number": r.item_number ?? r.item_no ?? r.part_no ?? "-",
      "Item Code": r.item_code ?? r.Part_Code ?? r.part_code ?? "-",
      "Item Desc": r.item_desc ?? r.description ?? r.Name_Description ?? r.desc ?? "-",
      "Item Size": r.item_size ?? r.size ?? "-",
      "Inv Desc": r.inv_description ?? r.inv_desc ?? "-",
      "Inv Item Size": r.inv_item_size ?? r.inv_size ?? "-",
      "Stock": r.stock ?? r.total_stock ?? 0,
      "Todays Stock": r.today_stock ?? r.today_total_stock ?? 0,
      "Heat No": getHeatCount(r.variants) > 0 ? `${getHeatCount(r.variants)} Heat No(s)` : "N/A",
      "Bar": r.bar ?? r.bar_qty ?? 0,
      "Wire Rod": r.wire_rod ?? r.wire_rod_qty ?? 0,
      "Shop Floor": r.ShopFloor ?? r.shop_floor ?? r.shopfloor_qty ?? 0,
      "Rework": r.rework ?? r.rework_qty ?? 0,
      "Reject": r.reject ?? r.reject_qty ?? 0,
      "Invoice Qty": r.invoice_qty ?? r.inv_qty ?? 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Balance Sheet");
    XLSX.writeFile(workbook, "Balance_Sheet.xlsx");
  };

  return (
    <div className="BalanceSheet">
      <div className="container-fluid p-0">
        <div className="row m-0">
          <div className="col-md-12 p-0">
            <div className="Main-NavBar">
              <NavBar toggleSideNav={toggleSideNav} />
              <SideNav sideNavOpen={sideNavOpen} toggleSideNav={toggleSideNav} />
              <main className={`main-content ${sideNavOpen ? "shifted" : ""}`}>
                {/* Header */}
                <div className="BalanceSheet-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="header-title mb-0">Balance Sheet</h5>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="vndrbtn"
                        onClick={handleExportExcel}
                        style={{
                          height: "34px",
                          display: "flex",
                          alignItems: "center",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Export Excel
                      </button>
                    </div>
                  </div>
                </div>

                {/* Filter Form Card */}
                <div className="BalanceSheet-main mt-3">
                  <div className="container-fluid p-0">
                    <div
                      className="card shadow-sm border-0 mb-4 mt-4"
                      style={{ borderRadius: "12px" }}
                    >
                      <div className="card-body">
                        <form
                          className="row g-3 text-start align-items-end"
                          onSubmit={handleSearch}
                        >
                          {/* Plant */}
                          <div className="col-xl-2 col-lg-2 col-md-4 col-sm-6">
                            <label className="form-label">Plant</label>
                            <select
                              className="form-select"
                              name="plant"
                              value={filters.plant}
                              onChange={handleChange}
                            >
                              <option>VISHWA S.I.</option>
                            </select>
                          </div>

                          {/* From Date Calendar */}
                          <div className="col-xl-2 col-lg-2 col-md-4 col-sm-6">
                            <label className="form-label">From Date</label>
                            <input
                              type="date"
                              className="form-control"
                              name="fromDate"
                              value={filters.fromDate}
                              onChange={handleChange}
                            />
                          </div>

                          {/* To Date Calendar */}
                          <div className="col-xl-2 col-lg-2 col-md-4 col-sm-6">
                            <label className="form-label">To Date</label>
                            <input
                              type="date"
                              className="form-control"
                              name="toDate"
                              value={filters.toDate}
                              onChange={handleChange}
                            />
                          </div>

                          {/* Customer Name Search */}
                          <div className="col-xl-2 col-lg-2 col-md-4 col-sm-6">
                            <label className="form-label">Customer Name</label>
                            <input
                              type="text"
                              className="form-control"
                              name="customer"
                              value={filters.customer}
                              onChange={handleChange}
                              autoComplete="off"
                              placeholder="Customer Name..."
                            />
                          </div>

                          {/* Heat No Search */}
                          <div className="col-xl-2 col-lg-2 col-md-4 col-sm-6">
                            <label className="form-label">Heat No</label>
                            <input
                              type="text"
                              className="form-control"
                              name="heatNo"
                              value={filters.heatNo}
                              onChange={handleChange}
                              autoComplete="off"
                              placeholder="Heat No..."
                            />
                          </div>

                          {/* Search / View Button */}
                          <div className="col-xl-2 col-lg-2 col-md-4 col-sm-6">
                            <button
                              type="submit"
                              className="vndrbtn w-100"
                              disabled={loading}
                              style={{
                                height: "34px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {loading ? "..." : "Search"}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>

                  {/* Table Section */}
                  <div className="StoreBalanceSheet mt-4">
                    <div className="container-fluid p-0 text-start">
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th style={{ width: "3%" }}>Sr</th>
                              <th style={{ width: "10%" }}>Cust. Name</th>
                              <th style={{ width: "6%" }}>Item Number</th>
                              <th style={{ width: "6%" }}>Item Code</th>
                              <th style={{ width: "8%" }}>Item Desc</th>
                              <th style={{ width: "5%" }}>Item Size</th>
                              <th style={{ width: "8%" }}>Inv Desc</th>
                              <th style={{ width: "5%" }}>Inv Item Size</th>
                              <th style={{ width: "5%" }}>Stock</th>
                              <th style={{ width: "6%" }}>Todays Stock</th>
                              <th style={{ width: "7%" }}>Heat No</th>
                              <th style={{ width: "5%" }}>Bar</th>
                              <th style={{ width: "5%" }}>Wire Rod</th>
                              <th style={{ width: "5%" }}>Shop Floor</th>
                              <th style={{ width: "5%" }}>Rework</th>
                              <th style={{ width: "5%" }}>Reject</th>
                              <th style={{ width: "6%" }}>Invoice Qty</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loading ? (
                              <tr>
                                <td colSpan="17" className="text-center py-4 text-muted">
                                  Loading data...
                                </td>
                              </tr>
                            ) : currentRows.length > 0 ? (
                              currentRows.map((r, index) => {
                                const heatCount = getHeatCount(r.variants);
                                return (
                                  <tr key={r.uniqueId || index}>
                                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                    <td style={{ fontWeight: 600, color: "#1e293b" }}>{r.customer || "-"}</td>
                                    <td>{r.item_number ?? r.item_no ?? r.part_no ?? "-"}</td>
                                    <td>{r.item_code ?? r.Part_Code ?? r.part_code ?? "-"}</td>
                                    <td>{r.item_desc ?? r.description ?? r.Name_Description ?? r.desc ?? "-"}</td>
                                    <td>{r.item_size ?? r.size ?? "-"}</td>
                                    <td>{r.inv_description ?? r.inv_desc ?? "-"}</td>
                                    <td>{r.inv_item_size ?? r.inv_size ?? "-"}</td>
                                    <td style={{ fontWeight: 600 }}>{r.stock ?? r.total_stock ?? 0}</td>
                                    <td style={{ fontWeight: 600, color: "#2563eb" }}>{r.today_stock ?? r.today_total_stock ?? 0}</td>
                                    <td>
                                      <div className="d-flex align-items-center justify-content-center gap-1">
                                        <span>{heatCount > 0 ? `${heatCount} Heat No(s)` : "N/A"}</span>
                                        {r.variants && r.variants.length > 0 && (
                                          <Tooltip title="View Heat Details">
                                            <IconButton
                                              size="small"
                                              sx={{ color: "#0ea5e9", "&:hover": { bgcolor: "#e0f2fe" }, padding: "2px" }}
                                              onClick={() => handleOpenHeatDetails(r)}
                                            >
                                              <FaEye size={14} />
                                            </IconButton>
                                          </Tooltip>
                                        )}
                                      </div>
                                    </td>
                                    <td>{r.bar ?? r.bar_qty ?? 0}</td>
                                    <td>{r.wire_rod ?? r.wire_rod_qty ?? 0}</td>
                                    <td>{r.ShopFloor ?? r.shop_floor ?? r.shopfloor_qty ?? 0}</td>
                                    <td>{r.rework ?? r.rework_qty ?? 0}</td>
                                    <td>{r.reject ?? r.reject_qty ?? 0}</td>
                                    <td>{r.invoice_qty ?? r.inv_qty ?? 0}</td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan="17" className="text-center py-4 text-muted">
                                  No Data Found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Controls */}
                      {totalPages > 1 && (
                        <div
                          className="d-flex justify-content-end align-items-center mt-3 mb-2 px-2"
                          style={{ backgroundColor: "#fff" }}
                        >
                          <span
                            className="me-3"
                            style={{
                              fontSize: "0.85rem",
                              color: "#64748b",
                              fontWeight: 600,
                            }}
                          >
                            Page {currentPage} of {totalPages}
                          </span>
                          <button
                            className="btn btn-outline-secondary btn-sm me-2"
                            disabled={currentPage === 1}
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                          >
                            Previous
                          </button>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            disabled={currentPage === totalPages}
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages)
                              )
                            }
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </main>

              {/* Modal for Heat Details */}
              {showModal && (
                <>
                  <div
                    className="modal-backdrop fade show"
                    onClick={handleBackdropClick}
                    style={{ zIndex: 1040 }}
                  ></div>
                  <div
                    className="modal fade show d-flex align-items-center justify-content-center"
                    style={{ display: "flex", zIndex: 1050 }}
                    tabIndex="-1"
                    onClick={handleBackdropClick}
                  >
                    <div
                      className="modal-dialog modal-dialog-centered modal-lg"
                      style={{ width: "100%", maxWidth: "800px", margin: "auto" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        className="modal-content"
                        style={{
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                        }}
                      >
                        <div className="modal-header border-bottom-0 pb-0 pt-4 px-4">
                          <div>
                            <h5
                              className="header-title text-start mb-1"
                              style={{
                                fontSize: "1.25rem",
                                fontWeight: "700",
                                color: "#1e293b",
                              }}
                            >
                              Heat Details
                            </h5>
                            {selectedItem && (
                              <small className="text-muted d-block text-start">
                                <strong>Customer:</strong> {selectedItem.customer} | <strong>Item:</strong> {selectedItem.item_code} ({selectedItem.description || selectedItem.item_no || "-"})
                              </small>
                            )}
                          </div>
                          <button
                            type="button"
                            className="btn-close"
                            onClick={closeModal}
                            aria-label="Close"
                          ></button>
                        </div>
                        <div className="modal-body p-4">
                          <div className="table-responsive">
                            <table className="table table-bordered table-hover text-center mb-0">
                              <thead className="table-light">
                                <tr>
                                  <th style={{ background: "#f8fafc", color: "#475569", fontWeight: "600" }}>Sr No.</th>
                                  <th style={{ background: "#f8fafc", color: "#475569", fontWeight: "600" }}>Heat No</th>
                                  <th style={{ background: "#f8fafc", color: "#475569", fontWeight: "600" }}>GRN Qty</th>
                                  <th style={{ background: "#f8fafc", color: "#475569", fontWeight: "600" }}>Today Qty</th>
                                  <th style={{ background: "#f8fafc", color: "#475569", fontWeight: "600" }}>Bar</th>
                                  <th style={{ background: "#f8fafc", color: "#475569", fontWeight: "600" }}>Wire Rod</th>
                                </tr>
                              </thead>
                              <tbody>
                                {modalData.length > 0 ? (
                                  modalData.map((variant, index) => (
                                    <tr key={index}>
                                      <td className="text-muted">{index + 1}</td>
                                      <td className="fw-bold">{variant.HeatNo || variant.heat_no || "-"}</td>
                                      <td className="fw-medium">{variant.GRNQty ?? variant.grn_qty ?? 0}</td>
                                      <td className="fw-medium">{variant.TodayQty ?? variant.today_qty ?? 0}</td>
                                      <td className="fw-medium">{variant.bar ?? 0}</td>
                                      <td className="fw-medium">{variant.wire_rod ?? 0}</td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="6" className="text-center text-muted py-4">
                                      No variant / heat details available
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="modal-footer border-top-0 pt-0 pb-4 px-4">
                          <button
                            type="button"
                            className="btn btn-secondary px-4 rounded-pill"
                            onClick={closeModal}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheet;
