import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import NavBar from "../../../NavBar/NavBar.js";
import SideNav from "../../../SideNav/SideNav.js";
import { Link } from "react-router-dom";
import { Tooltip, IconButton } from "@mui/material";
import { FaInfoCircle, FaUndo, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import "./DeliveryChlln.css";

const DeliveryChlln = () => {
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [allChallans, setAllChallans] = useState([]);
  const [challanList, setChallanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallan, setSelectedChallan] = useState(null);

  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    customerName: "",
    dcSeries: "",
    dcType: "",
    dcNo: "",
    itemName: "",
    plant: "",
    inventory: "",
  });

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
    fetchDeliveryChallans();
  }, []);

  const fetchDeliveryChallans = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch("https://sellerp-backend.onrender.com/Store/api/delivery-challans/", {
        headers,
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        const sorted = data.sort((a, b) => {
          const idA = parseInt(a.id || a.pk || 0, 10);
          const idB = parseInt(b.id || b.pk || 0, 10);
          return idB - idA;
        });
        setAllChallans(sorted);
        setChallanList(sorted);
      }
    } catch (error) {
      console.error("Error fetching delivery challans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    let filtered = [...allChallans];

    if (filters.fromDate) {
      filtered = filtered.filter((item) => {
        const d = item.challan_date || item.ChallanDate;
        return d && d >= filters.fromDate;
      });
    }

    if (filters.toDate) {
      filtered = filtered.filter((item) => {
        const d = item.challan_date || item.ChallanDate;
        return d && d <= filters.toDate;
      });
    }

    if (filters.customerName.trim()) {
      const q = filters.customerName.toLowerCase().trim();
      filtered = filtered.filter((item) => {
        const cust = (item.supplier || item.CustName || item.contractor || "").toLowerCase();
        return cust.includes(q);
      });
    }

    if (filters.dcSeries) {
      const q = filters.dcSeries.toLowerCase().trim();
      filtered = filtered.filter((item) => (item.dc_series || "").toLowerCase().includes(q));
    }

    if (filters.dcType) {
      const q = filters.dcType.toLowerCase().trim();
      filtered = filtered.filter((item) => (item.dc_type || item.Type || item.DCType || "").toLowerCase().includes(q));
    }

    if (filters.dcNo.trim()) {
      const q = filters.dcNo.toLowerCase().trim();
      filtered = filtered.filter((item) => {
        const dc = (item.challan_no || item.dc_series || item.DCNo || item.ChallanNo || "").toLowerCase();
        return dc.includes(q);
      });
    }

    if (filters.itemName.trim()) {
      const q = filters.itemName.toLowerCase().trim();
      filtered = filtered.filter((item) => {
        if (!item.items || !Array.isArray(item.items)) return false;
        return item.items.some((it) => {
          const desc = (it.item_desc || it.Description || "").toLowerCase();
          const code = (it.item_code || it.ItemCode || "").toLowerCase();
          return desc.includes(q) || code.includes(q);
        });
      });
    }

    if (filters.plant) {
      const q = filters.plant.toLowerCase().trim();
      filtered = filtered.filter((item) => (item.plant || item.Plant || "").toLowerCase().includes(q));
    }

    if (filters.inventory) {
      const q = filters.inventory.toLowerCase().trim();
      filtered = filtered.filter((item) => (item.inventory || item.Inventory || "").toLowerCase().includes(q));
    }

    setChallanList(filtered);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters({
      fromDate: "",
      toDate: "",
      customerName: "",
      dcSeries: "",
      dcType: "",
      dcNo: "",
      itemName: "",
      plant: "",
      inventory: "",
    });
    setChallanList(allChallans);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Delivery Challan?")) return;
    try {
      const token = localStorage.getItem("accessToken");
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const response = await fetch(`https://sellerp-backend.onrender.com/Store/api/delivery-challans/${id}/`, {
        method: "DELETE",
        headers,
      });
      if (response.ok) {
        fetchDeliveryChallans();
      } else {
        alert("Failed to delete record");
      }
    } catch (error) {
      console.error("Error deleting delivery challan:", error);
    }
  };

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const totalPages = Math.ceil(challanList.length / itemsPerPage);
  const currentChallanList = challanList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewPdf = (item) => {
    if (item?.id) {
      window.open(`https://sellerp-backend.onrender.com/Store/delivery-challans/pdf/${item.id}/`, "_blank", "noopener,noreferrer");
    } else {
      alert(`No PDF attached or generated for Delivery Challan: ${item?.challan_no || item?.dc_series || item?.DCNo || item?.ChallanNo || "this record"}`);
    }
  };

  return (
    <div className="NewStoreDeliveryChlln">
      <div className="container-fluid p-0">
        <div className="row m-0">
          <div className="col-md-12 p-0">
            <div className="Main-NavBar">
              <NavBar toggleSideNav={toggleSideNav} />
              <SideNav
                sideNavOpen={sideNavOpen}
                toggleSideNav={toggleSideNav}
              />
              <main className={`main-content ${sideNavOpen ? "shifted" : ""}`}>
                <div className="DeliveryChlln-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="header-title mb-0">Delivery Challan List</h5>
                    {/* <div className="d-flex gap-2">
                      <Link className="vndrbtn">DC - Report</Link>
                      <Link type="button" className="vndrbtn" to="/DeliveryQuery">Delivery Challan Query</Link>
                    </div> */}
                  </div>
                </div>

                <div className="DeliveryChlln-main mt-3">
                  <div className="container-fluid p-0">
                    <div className="card shadow-sm border-0 mb-4 mt-4" style={{ borderRadius: '12px' }}>
                      <div className="card-body">
                        <form className="row g-3 text-start" onSubmit={handleSearch}>
                          {/* From Date */}
                          <div className="col-md-2 col-sm-6">
                            <label className="form-label">From Date</label>
                            <input
                              type="date"
                              className="form-control"
                              name="fromDate"
                              value={filters.fromDate}
                              onChange={handleFilterChange}
                            />
                          </div>

                          {/* To Date */}
                          <div className="col-md-2 col-sm-6">
                            <label className="form-label">To Date</label>
                            <input
                              type="date"
                              className="form-control"
                              name="toDate"
                              value={filters.toDate}
                              onChange={handleFilterChange}
                            />
                          </div>

                          {/* Customer Name */}
                          <div className="col-md-2 col-sm-6">
                            <label className="form-label">Customer Name</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Customer Name"
                              name="customerName"
                              value={filters.customerName}
                              onChange={handleFilterChange}
                            />
                          </div>

                          {/* DC Series */}
                          <div className="col-md-2 col-sm-6">
                            <label className="form-label">DC Series</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter DC Series"
                              name="dcSeries"
                              value={filters.dcSeries}
                              onChange={handleFilterChange}
                            />
                          </div>

                          {/* DC Type */}
                          <div className="col-md-2 col-sm-6">
                            <label className="form-label">DC Type</label>
                            <select
                              className="form-select"
                              name="dcType"
                              value={filters.dcType}
                              onChange={handleFilterChange}
                            >
                              <option value="">ALL</option>
                              <option value="Non-Returnable">Non-Returnable</option>
                              <option value="Returnable">Returnable</option>
                            </select>
                          </div>

                          {/* DC No. */}
                          <div className="col-md-2 col-sm-6">
                            <label className="form-label">DC No.</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter DC No."
                              name="dcNo"
                              value={filters.dcNo}
                              onChange={handleFilterChange}
                            />
                          </div>

                          {/* Item Name */}
                          <div className="col-md-2 col-sm-6">
                            <label className="form-label">Item Name</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Item Name"
                              name="itemName"
                              value={filters.itemName}
                              onChange={handleFilterChange}
                            />
                          </div>

                          {/* Plant */}
                          <div className="col-md-2 col-sm-6">
                            <label className="form-label">Plant</label>
                            <select
                              className="form-select"
                              name="plant"
                              value={filters.plant}
                              onChange={handleFilterChange}
                            >
                              <option value="">ALL</option>
                              <option value="VISHWA S.I.">VISHWA S.I.</option>
                            </select>
                          </div>

                          {/* Inventory */}
                          <div className="col-md-2 col-sm-6">
                            <label className="form-label">Inventory</label>
                            <select
                              className="form-select"
                              name="inventory"
                              value={filters.inventory}
                              onChange={handleFilterChange}
                            >
                              <option value="">ALL</option>
                              <option value="With Inventory">With Inventory</option>
                              <option value="Without Inventory">Without Inventory</option>
                            </select>
                          </div>

                          {/* Search Button */}
                          <div className="col-md-1 col-sm-6 mt-1 align-self-end">
                            <button type="submit" className="vndrbtn w-100">
                              Search
                            </button>
                          </div>

                          {/* Reset Button */}
                          <div className="col-md-1 col-sm-6 mt-1 align-self-end">
                            <button
                              type="button"
                              className="btn btn-secondary w-100"
                              onClick={handleReset}
                            >
                              Reset
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>

                  <div className="StoreDeliveryChlln mt-4">
                    <div className="container-fluid p-0 text-start">
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>Sr no.</th>
                              <th>Year</th>
                              <th>Plant</th>
                              <th>DC No</th>
                              <th>DC Date</th>
                              <th>Type </th>
                              <th>Cust Code</th>
                              <th>Cust Name</th>
                              <th>Inventry</th>
                              <th>User</th>
                              <th>Info</th>
                              <th>Return</th>
                              <th>Edit</th>
                              <th>Del</th>
                              <th>View</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loading ? (
                              <tr>
                                <td colSpan={15} className="text-center py-4 text-muted">Loading...</td>
                              </tr>
                            ) : currentChallanList.length === 0 ? (
                              <tr>
                                <td colSpan={15} className="text-center py-4 text-muted">No Records Found</td>
                              </tr>
                            ) : (
                              currentChallanList.map((item, index) => {
                                const year = item.challan_date
                                  ? new Date(item.challan_date).getFullYear()
                                  : item.ChallanDate
                                  ? new Date(item.ChallanDate).getFullYear()
                                  : "-";
                                const plant = item.plant || item.Plant || "-";
                                const dcNo = item.challan_no || item.dc_series || item.DCNo || item.ChallanNo || "-";
                                const dcDate = item.challan_date || item.ChallanDate || "-";
                                const type = item.dc_type || item.Type || item.DCType || "-";
                                const custCode = item.add_code || item.CustCode || item.contractor || item.Contractor || "-";
                                const custName = item.supplier || item.CustName || item.contractor || item.Contractor || "-";
                                const inventory = item.inventory || item.Inventory || item.deparment || item.Department || "-";
                                const user = item.user || item.created_by || localStorage.getItem("username") || "User";

                                return (
                                  <tr key={item.id || index}>
                                    <td className="text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                    <td>{year}</td>
                                    <td>{plant}</td>
                                    <td className="text-center fw-bold">{dcNo}</td>
                                    <td>{dcDate}</td>
                                    <td>{type}</td>
                                    <td>{custCode}</td>
                                    <td>{custName}</td>
                                    <td>{inventory}</td>
                                    <td>{user}</td>
                                    <td className="text-center">
                                      <Tooltip title="View Information">
                                        <IconButton
                                          size="small"
                                          sx={{ color: '#0ea5e9', '&:hover': { bgcolor: '#e0f2fe' } }}
                                          onClick={() => setSelectedChallan(item)}
                                        >
                                          <FaInfoCircle size={16} />
                                        </IconButton>
                                      </Tooltip>
                                    </td>
                                    <td className="text-center">
                                      <Tooltip title="Return Item">
                                        <IconButton size="small" sx={{ color: '#8b5cf6', '&:hover': { bgcolor: '#ede9fe' } }}>
                                          <FaUndo size={16} />
                                        </IconButton>
                                      </Tooltip>
                                    </td>
                                    <td className="text-center">
                                      <Tooltip title="Edit Record">
                                        <IconButton
                                          size="small"
                                          sx={{ color: '#f59e0b', '&:hover': { bgcolor: '#fef3c7' } }}
                                          component={Link}
                                          to="/Delivery-Challan"
                                        >
                                          <FaEdit size={16} />
                                        </IconButton>
                                      </Tooltip>
                                    </td>
                                    <td className="text-center">
                                      <Tooltip title="Delete Record">
                                        <IconButton
                                          size="small"
                                          sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fee2e2' } }}
                                          onClick={() => handleDelete(item.id)}
                                        >
                                          <FaTrash size={16} />
                                        </IconButton>
                                      </Tooltip>
                                    </td>
                                    <td className="text-center">
                                      <Tooltip title="View Document">
                                        <IconButton
                                          size="small"
                                          sx={{ color: '#64748b', '&:hover': { bgcolor: '#f1f5f9' } }}
                                          onClick={() => handleViewPdf(item)}
                                        >
                                          <FaEye size={16} />
                                        </IconButton>
                                      </Tooltip>
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="d-flex justify-content-end align-items-center mt-3 mb-2 px-2" style={{ backgroundColor: '#fff' }}>
                      <span className="me-3" style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>
                        Page {currentPage} of {totalPages}
                      </span>
                      <div className="btn-group shadow-sm">
                        <button
                          className="btn btn-light border"
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          style={{ padding: "4px 12px", fontSize: "0.85rem", fontWeight: 600 }}
                        >
                          Prev
                        </button>
                        <button
                          className="btn btn-light border"
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          style={{ padding: "4px 12px", fontSize: "0.85rem", fontWeight: 600 }}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>

      {/* Info Modal */}
      {selectedChallan && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delivery Challan #{selectedChallan.challan_no || selectedChallan.dc_series || selectedChallan.id} Details</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedChallan(null)}></button>
              </div>
              <div className="modal-body text-start">
                <div className="row g-2 mb-3">
                  <div className="col-md-4"><strong>Plant:</strong> {selectedChallan.plant || "-"}</div>
                  <div className="col-md-4"><strong>DC Date:</strong> {selectedChallan.challan_date || "-"}</div>
                  <div className="col-md-4"><strong>DC Type:</strong> {selectedChallan.dc_type || "-"}</div>
                  <div className="col-md-4"><strong>Supplier / Cust:</strong> {selectedChallan.supplier || "-"}</div>
                  <div className="col-md-4"><strong>Address Code:</strong> {selectedChallan.add_code || "-"}</div>
                  <div className="col-md-4"><strong>Inventory:</strong> {selectedChallan.inventory || "-"}</div>
                  <div className="col-md-4"><strong>Vehicle No:</strong> {selectedChallan.vehical_no || "-"}</div>
                  <div className="col-md-4"><strong>Contractor:</strong> {selectedChallan.contractor || "-"}</div>
                  <div className="col-md-4"><strong>Transport:</strong> {selectedChallan.transport || "-"}</div>
                  <div className="col-md-4"><strong>PO No:</strong> {selectedChallan.po_no || "-"}</div>
                  <div className="col-md-4"><strong>PO Date:</strong> {selectedChallan.po_date || "-"}</div>
                  <div className="col-md-4"><strong>Department:</strong> {selectedChallan.deparment || "-"}</div>
                  <div className="col-md-4"><strong>Assessable Value:</strong> {selectedChallan.assessable_value || "-"}</div>
                  <div className="col-md-4"><strong>CGST Amt:</strong> {selectedChallan.cgst_amt || "-"}</div>
                  <div className="col-md-4"><strong>SGST Amt:</strong> {selectedChallan.sgst_amt || "-"}</div>
                  <div className="col-md-4"><strong>IGST Amt:</strong> {selectedChallan.igst_amt || "-"}</div>
                  <div className="col-md-4"><strong>Grand Total:</strong> {selectedChallan.grand_total || "-"}</div>
                  <div className="col-md-12"><strong>Remark:</strong> {selectedChallan.remark || "-"}</div>
                </div>
                {selectedChallan.items && selectedChallan.items.length > 0 && (
                  <div>
                    <h6>Items List</h6>
                    <div className="table-responsive">
                      <table className="table table-bordered table-sm">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Item Code</th>
                            <th>Description</th>
                            <th>HSN</th>
                            <th>Purpose</th>
                            <th>Unit</th>
                            <th>Rate</th>
                            <th>Qty</th>
                            <th>CGST</th>
                            <th>SGST</th>
                            <th>IGST</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedChallan.items.map((it, idx) => (
                            <tr key={it.id || idx}>
                              <td>{idx + 1}</td>
                              <td>{it.item_code}</td>
                              <td>{it.item_desc}</td>
                              <td>{it.hsn_code}</td>
                              <td>{it.purpose}</td>
                              <td>{it.unit}</td>
                              <td>{it.rate}</td>
                              <td>{it.qty}</td>
                              <td>{it.cgst}</td>
                              <td>{it.sgst}</td>
                              <td>{it.igst}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedChallan(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryChlln;
