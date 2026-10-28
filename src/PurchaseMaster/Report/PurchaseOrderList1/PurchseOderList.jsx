import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import NavBar from "../../../NavBar/NavBar.js";
import SideNav from "../../../SideNav/SideNav.js";
import "./PurchaseOderList.css"
import { Link } from "react-router-dom";
import { fetchPurchaseOrders } from "../../../Service/PurchaseApi.jsx";

const PurchseOderList = () => {
    const [sideNavOpen, setSideNavOpen] = useState(false);

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

    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const getPurchaseOrders = async () => {
        try {
          const data = await fetchPurchaseOrders();
          setPurchaseOrders(data || []);
        } catch (error) {
          console.error("Error fetching purchase orders:", error);
        } finally {
          setLoading(false);
        }
      };
      getPurchaseOrders();
    }, []);

    const handleViewPdf = (order) => {
      if (order?.id) {
        const url = `https://sellerp-backend.onrender.com/Purchase/PoOrder/pdf/${order.id}/`;
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        alert(`No ID found for PO: ${order?.PoNo || "this order"}`);
      }
    };

  return (
    <div className="erp-page NewPurchseOrderList">
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
                <div className="PurchseOrderList-content p-4">
                  
                  {/* Header */}
                  <div className="erp-header mb-4 text-start">
                    <div className="row align-items-center">
                      <div className="col-md-3">
                        <h5 className="header-title mb-0">
                          Purchase Order List
                        </h5>
                      </div>
                      <div className="col-md-9 d-flex justify-content-end gap-2 flex-wrap">
                        <Link to="/RecentlyPoApprovalList" className="vndrbtn text-decoration-none">
                          <i className="fas fa-list-alt me-2"></i> Recently PO Approval List
                        </Link>
                        <Link to="/AMCPurchaseOrderList" className="vndrbtn text-decoration-none">
                          <i className="fas fa-list-alt me-2"></i> AMC Purchase Order List
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Filter Section */}
                  <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '12px' }}>
                    <div className="card-body p-0">
                      <div className="table-responsive">
                        <table className="table table-bordered align-middle mb-0">
                          <thead className="table-light">
                            <tr>
                              <th style={{ fontSize: '0.75rem', padding: '10px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>PLANT</th>
                              <th style={{ fontSize: '0.75rem', padding: '10px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>FROM DATE</th>
                              <th style={{ fontSize: '0.75rem', padding: '10px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>TO DATE</th>
                              <th style={{ fontSize: '0.75rem', padding: '10px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                                <div className="form-check d-flex justify-content-center mb-0">
                                  <input className="form-check-input me-2" type="checkbox" id="supplier" />
                                  <label className="form-check-label mb-0" htmlFor="supplier">SUPPLIER NAME</label>
                                </div>
                              </th>
                              <th style={{ fontSize: '0.75rem', padding: '10px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>PO TYPE</th>
                              <th style={{ fontSize: '0.75rem', padding: '10px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>SERIES</th>
                              <th style={{ fontSize: '0.75rem', padding: '10px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>USER</th>
                              <th style={{ fontSize: '0.75rem', padding: '10px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>SEARCH</th>
                              <th style={{ fontSize: '0.75rem', padding: '10px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>ACTION</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td style={{ padding: '8px', verticalAlign: 'middle' }}>
                                <select className="form-select form-select-sm">
                                  <option>Plant 1</option>
                                  <option>Plant 2</option>
                                  <option>Plant 3</option>
                                </select>
                              </td>
                              <td style={{ padding: '8px', verticalAlign: 'middle' }}>
                                <input type="date" className="form-control form-control-sm" />
                              </td>
                              <td style={{ padding: '8px', verticalAlign: 'middle' }}>
                                <input type="date" className="form-control form-control-sm" />
                              </td>
                              <td style={{ padding: '8px', verticalAlign: 'middle' }}>
                                <input type="text" className="form-control form-control-sm" />
                              </td>
                              <td style={{ padding: '8px', verticalAlign: 'middle' }}>
                                <select className="form-select form-select-sm">
                                  <option value="All">All</option>
                                  <option value="Open">Open</option>
                                  <option value="Close">Close</option>
                                </select>
                              </td>
                              <td style={{ padding: '8px', verticalAlign: 'middle' }}>
                                <select className="form-select form-select-sm">
                                  <option value="RM">RM</option>
                                  <option value="ASSET">ASSET</option>
                                  <option value="SERVICE">SERVICE</option>
                                  <option value="CONSUMABLE">CONSUMABLE</option>
                                </select>
                              </td>
                              <td style={{ padding: '8px', verticalAlign: 'middle' }}>
                                <select className="form-select form-select-sm">
                                  <option value={localStorage.getItem("username") || ""}>
                                    {localStorage.getItem("username") || "Select User"}
                                  </option>
                                </select>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', verticalAlign: 'middle' }}>
                                <button className="vndrbtn btn-sm px-3 w-100" style={{ fontSize: '0.75rem', minHeight: '30px' }}>
                                  <i className="fas fa-search me-1"></i> Search
                                </button>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center', verticalAlign: 'middle' }}>
                                <button className="btn btn-sm btn-light w-100 fw-bold text-secondary" style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>Search Option</button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Data Table Section */}
                  <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '12px' }}>
                    <div className="card-body p-0">
                      <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        <table className="table table-bordered table-striped table-hover align-middle mb-0">
                          <thead className="table-primary sticky-top" style={{ zIndex: 1 }}>
                            <tr>
                              <th style={{ fontSize: '0.75rem', padding: '10px 6px', textAlign: 'center', whiteSpace: 'nowrap' }}>SR</th>
                              <th style={{ fontSize: '0.75rem', padding: '10px 6px', textAlign: 'center', whiteSpace: 'nowrap' }}>YEAR</th>
                              <th style={{ fontSize: '0.75rem', padding: '10px 8px', textAlign: 'center' }}>
                                <div style={{ maxWidth: '100px', whiteSpace: 'normal', wordBreak: 'break-word', margin: '0 auto' }}>PLANT</div>
                              </th>
                              <th style={{ fontSize: '0.75rem', padding: '10px 8px', textAlign: 'center' }}>
                                <div style={{ maxWidth: '120px', whiteSpace: 'normal', wordBreak: 'break-word', margin: '0 auto' }}>PO NO</div>
                              </th>
                              <th style={{ fontSize: '0.75rem', padding: '10px 6px', textAlign: 'center', whiteSpace: 'nowrap' }}>PO DATE</th>
                              <th style={{ fontSize: '0.75rem', padding: '10px 8px', textAlign: 'center' }}>
                                <div style={{ maxWidth: '90px', whiteSpace: 'normal', wordBreak: 'break-word', margin: '0 auto' }}>TYPE</div>
                              </th>
                              <th style={{ fontSize: '0.75rem', padding: '10px 6px', textAlign: 'center', whiteSpace: 'nowrap' }}>CODE NO</th>
                              <th style={{ fontSize: '0.75rem', padding: '10px 8px', textAlign: 'center' }}>
                                <div style={{ maxWidth: '180px', whiteSpace: 'normal', wordBreak: 'break-word', margin: '0 auto' }}>SUPPLIER / VENDOR NAME</div>
                              </th>
                              <th style={{ fontSize: '0.75rem', padding: '10px 8px', textAlign: 'center' }}>
                                <div style={{ maxWidth: '90px', whiteSpace: 'normal', wordBreak: 'break-word', margin: '0 auto' }}>USER</div>
                              </th>
                              <th style={{ fontSize: '0.75rem', padding: '10px 8px', textAlign: 'center' }}>
                                <div style={{ maxWidth: '100px', whiteSpace: 'normal', wordBreak: 'break-word', margin: '0 auto' }}>INFO</div>
                              </th>
                              <th style={{ fontSize: '0.75rem', padding: '10px 6px', textAlign: 'center', whiteSpace: 'nowrap' }}>AUTH STATUS</th>
                              <th style={{ fontSize: '0.75rem', padding: '10px 6px', textAlign: 'center', whiteSpace: 'nowrap' }}>PO STATUS</th>
                              <th style={{ fontSize: '0.75rem', padding: '10px 8px', textAlign: 'center' }}>
                                <div style={{ maxWidth: '130px', whiteSpace: 'normal', wordBreak: 'break-word', margin: '0 auto' }}>EMAIL</div>
                              </th>
                              <th style={{ fontSize: '0.75rem', padding: '10px 8px', textAlign: 'center' }}>
                                <div style={{ maxWidth: '90px', whiteSpace: 'normal', wordBreak: 'break-word', margin: '0 auto' }}>DOCS</div>
                              </th>
                              <th style={{ fontSize: '0.75rem', padding: '10px 6px', textAlign: 'center', whiteSpace: 'nowrap' }}>DISC (%)</th>
                              <th style={{ fontSize: '0.75rem', padding: '10px 6px', textAlign: 'center', whiteSpace: 'nowrap' }}>EDIT</th>
                              <th style={{ fontSize: '0.75rem', padding: '10px 6px', textAlign: 'center', whiteSpace: 'nowrap' }}>VIEW</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loading ? (
                              <tr>
                                <td colSpan="17" className="text-center py-4 text-muted" style={{ fontSize: '0.85rem' }}>
                                  Loading data...
                                </td>
                              </tr>
                            ) : purchaseOrders.length > 0 ? (
                              purchaseOrders.map((order, index) => (
                                <tr key={order.id || index}>
                                  <td style={{ fontSize: '0.85rem', padding: '8px', textAlign: 'center', whiteSpace: 'nowrap' }}>{index + 1}</td>
                                  <td style={{ fontSize: '0.85rem', padding: '8px', textAlign: 'center', whiteSpace: 'nowrap' }}>{order.Year || "2024-25"}</td>
                                  <td style={{ fontSize: '0.85rem', padding: '8px' }}>
                                    <div style={{ maxWidth: '100px', whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'anywhere', lineHeight: '1.3', margin: '0 auto' }}>{order.Plant || "-"}</div>
                                  </td>
                                  <td style={{ fontSize: '0.85rem', padding: '8px' }}>
                                    <div style={{ maxWidth: '120px', whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'anywhere', fontWeight: 'bold', color: '#3b82f6', lineHeight: '1.3', margin: '0 auto' }}>{order.PoNo || "-"}</div>
                                  </td>
                                  <td style={{ fontSize: '0.85rem', padding: '8px', textAlign: 'center', whiteSpace: 'nowrap' }}>{order.PoDate || "-"}</td>
                                  <td style={{ fontSize: '0.85rem', padding: '8px' }}>
                                    <div style={{ maxWidth: '90px', whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'anywhere', lineHeight: '1.3', margin: '0 auto', textAlign: 'center' }}>{order.PoType || "-"}</div>
                                  </td>
                                  <td style={{ fontSize: '0.85rem', padding: '8px', textAlign: 'center', whiteSpace: 'nowrap' }}>{order.CodeNo || "-"}</td>
                                  <td style={{ fontSize: '0.85rem', padding: '8px' }}>
                                    <div style={{ maxWidth: '180px', whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'anywhere', lineHeight: '1.3', margin: '0 auto' }}>{order.Supplier || "-"}</div>
                                  </td>
                                  <td style={{ fontSize: '0.85rem', padding: '8px' }}>
                                    <div style={{ maxWidth: '90px', whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'anywhere', lineHeight: '1.3', margin: '0 auto', textAlign: 'center' }}>{order.User || "-"}</div>
                                  </td>
                                  <td style={{ fontSize: '0.85rem', padding: '8px' }}>
                                    <div style={{ maxWidth: '100px', whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'anywhere', lineHeight: '1.3', margin: '0 auto', textAlign: 'center' }}>-</div>
                                  </td>
                                  <td style={{ fontSize: '0.85rem', padding: '8px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                                    <span className="badge bg-success">Approved</span>
                                  </td>
                                  <td style={{ fontSize: '0.85rem', padding: '8px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                                    <span className="badge bg-primary">Open</span>
                                  </td>
                                  <td style={{ fontSize: '0.85rem', padding: '8px' }}>
                                    <div style={{ maxWidth: '130px', whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'anywhere', lineHeight: '1.3', margin: '0 auto', textAlign: 'center' }}>-</div>
                                  </td>
                                  <td style={{ fontSize: '0.85rem', padding: '8px' }}>
                                    <div style={{ maxWidth: '90px', whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'anywhere', lineHeight: '1.3', margin: '0 auto', textAlign: 'center' }}>-</div>
                                  </td>
                                  <td style={{ fontSize: '0.85rem', padding: '8px', textAlign: 'center', whiteSpace: 'nowrap' }}>0.00</td>
                                  <td style={{ fontSize: '0.85rem', padding: '8px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                                    <Link to={`/new-purchase-order/${order.id}`} state={{ order }} className="btn btn-sm btn-outline-primary" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                                      <i className="fas fa-edit"></i>
                                    </Link>
                                  </td>
                                  <td style={{ fontSize: '0.85rem', padding: '8px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                                    <button
                                      type="button"
                                      onClick={() => handleViewPdf(order)}
                                      className="vndrbtn border-0"
                                      style={{ fontSize: '12px', padding: '4px 10px' }}
                                    >
                                      View
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="17" className="text-center py-4 text-muted" style={{ fontSize: '0.85rem' }}>
                                  No data available.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
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

export default PurchseOderList;
