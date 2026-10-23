import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import NavBar from "../../../NavBar/NavBar.js";
import SideNav from "../../../SideNav/SideNav.js";
import "./BalanceSheet.css";
import * as XLSX from "xlsx";

const BalanceSheet = () => {
  const [sideNavOpen, setSideNavOpen] = useState(false);

  // Filter form fields
  const [filters, setFilters] = useState({
    plant: "VISHWA S.I.",
    fromDate: "",
    toDate: "",
    itemDesc: "",
  });

  // Data for the main table
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(rows.length / itemsPerPage) || 1;
  const currentRows = rows.slice(
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

  // Fetch balance sheet data from backend API
  const fetchBalanceSheetData = async (params = {}) => {
    setLoading(true);
    try {
      const response = await axios.get("https://sellerp-backend.onrender.com/Store/balance-sheet/", {
        params,
      });

      let data = [];
      if (Array.isArray(response.data)) {
        data = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        data = response.data.data;
      } else if (response.data && Array.isArray(response.data.results)) {
        data = response.data.results;
      }

      data.sort((a, b) => {
        const idA = parseInt(a.id || a.pk || 0, 10);
        const idB = parseInt(b.id || b.pk || 0, 10);
        return idB - idA;
      });

      setRows(data);
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
    const params = {};
    if (filters.itemDesc && filters.itemDesc.trim() !== "") {
      params.item_code = filters.itemDesc.trim();
    }
    if (filters.fromDate && filters.fromDate.trim() !== "") {
      params.from_date = filters.fromDate.trim();
    }
    if (filters.toDate && filters.toDate.trim() !== "") {
      params.to_date = filters.toDate.trim();
    }
    fetchBalanceSheetData(params);
  };

  const handleClear = () => {
    setFilters({
      plant: "VISHWA S.I.",
      fromDate: "",
      toDate: "",
      itemDesc: "",
    });
    fetchBalanceSheetData({});
  };

  const handleExportExcel = () => {
    if (rows.length === 0) {
      alert("No data to export");
      return;
    }

    const exportData = rows.map((r, index) => ({
      "Sr": index + 1,
      "Item Number": r.item_number ?? r.item_no ?? r.part_no ?? "-",
      "Item Code": r.item_code ?? r.Part_Code ?? r.part_code ?? "-",
      "Item Desc": r.item_desc ?? r.description ?? r.Name_Description ?? r.desc ?? "-",
      "Stock": r.stock ?? r.total_stock ?? 0,
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
                        Export To Excel
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
                          <div className="col-md-2 col-sm-6">
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
                          <div className="col-md-2 col-sm-6">
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
                          <div className="col-md-2 col-sm-6">
                            <label className="form-label">To Date</label>
                            <input
                              type="date"
                              className="form-control"
                              name="toDate"
                              value={filters.toDate}
                              onChange={handleChange}
                            />
                          </div>

                          {/* Item/Description Search */}
                          <div className="col-md-3 col-sm-6">
                            <label className="form-label">Item/Description Search</label>
                            <input
                              type="text"
                              className="form-control"
                              name="itemDesc"
                              value={filters.itemDesc}
                              onChange={handleChange}
                              autoComplete="off"
                              placeholder="Enter Item Code / Description..."
                            />
                          </div>

                          {/* Search / View Button */}
                          <div className="col-md-1 col-sm-6">
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

                          {/* Clear Button */}
                          <div className="col-md-1 col-sm-6">
                            <button
                              type="button"
                              className="btn btn-secondary w-100"
                              onClick={handleClear}
                              style={{
                                height: "34px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              Clear
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
                              <th>Sr</th>
                              <th>Item Number</th>
                              <th>Item Code</th>
                              <th>Item Desc</th>
                              <th>Stock</th>
                              <th>Bar</th>
                              <th>Wire Rod</th>
                              <th>Shop Floor</th>
                              <th>Rework</th>
                              <th>Reject</th>
                              <th>Invoice Qty</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loading ? (
                              <tr>
                                <td colSpan="11" className="text-center py-4 text-muted">
                                  Loading data...
                                </td>
                              </tr>
                            ) : currentRows.length > 0 ? (
                              currentRows.map((r, index) => (
                                <tr key={r.id || r.item_code || index}>
                                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                  <td>{r.item_number ?? r.item_no ?? r.part_no ?? "-"}</td>
                                  <td>{r.item_code ?? r.Part_Code ?? r.part_code ?? "-"}</td>
                                  <td>{r.item_desc ?? r.description ?? r.Name_Description ?? r.desc ?? "-"}</td>
                                  <td>{r.stock ?? r.total_stock ?? 0}</td>
                                  <td>{r.bar ?? r.bar_qty ?? 0}</td>
                                  <td>{r.wire_rod ?? r.wire_rod_qty ?? 0}</td>
                                  <td>{r.ShopFloor ?? r.shop_floor ?? r.shopfloor_qty ?? 0}</td>
                                  <td>{r.rework ?? r.rework_qty ?? 0}</td>
                                  <td>{r.reject ?? r.reject_qty ?? 0}</td>
                                  <td>{r.invoice_qty ?? r.inv_qty ?? 0}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="11" className="text-center py-4 text-muted">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheet;
