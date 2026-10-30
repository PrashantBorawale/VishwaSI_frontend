import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import NavBar from "../../../NavBar/NavBar.js";
import SideNav from "../../../SideNav/SideNav.js";
import "./ProductionEntryList.css";
import { fetchProductionEntries, deleteProductionEntry } from "../../../Service/Production.jsx";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductionEntryList = () => {
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

  const [productionEntries, setProductionEntries] = useState([]);

  useEffect(() => {
    const loadProductionEntries = async () => {
      const data = await fetchProductionEntries();
      console.log("Fetched Data:", data); // Debugging step
      setProductionEntries(data.sort((a, b) => b.id - a.id));
    };
    loadProductionEntries();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Calculate indexes
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = productionEntries.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  // Ensure total pages are correct
  const totalPages = Math.ceil(productionEntries.length / recordsPerPage);

  console.log("Current Page:", currentPage, "Total Pages:", totalPages);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleViewPdf = (entry) => {
    const viewPath = entry?.View || entry?.PDF_Link || entry?.pdf || entry?.file || entry?.document;
    if (viewPath && viewPath !== "null" && viewPath !== "undefined" && viewPath !== "") {
      let url = viewPath;
      if (viewPath.startsWith("http://") || viewPath.startsWith("https://")) {
        url = viewPath;
      } else if (viewPath.startsWith("/")) {
        url = `https://sellerp-backend.onrender.com${viewPath}`;
      } else {
        url = `https://sellerp-backend.onrender.com/${viewPath}`;
      }
      window.open(url, "_blank", "noopener,noreferrer");
    } else if (entry?.id) {
      window.open(`https://sellerp-backend.onrender.com/Production/ProductionEntry/pdf/${entry.id}/`, "_blank", "noopener,noreferrer");
    } else {
      alert(`No PDF document available for Production Entry: ${entry?.Prod_no || "this record"}`);
    }
  };

  const handleDelete = async (id, prodNo) => {
    if (!window.confirm(`Are you sure you want to delete Production Entry ${prodNo || `#${id}`}?`)) {
      return;
    }

    try {
      await deleteProductionEntry(id);
      setProductionEntries((prev) => prev.filter((item) => item.id !== id));
      toast.success("Production Entry deleted successfully!");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to delete Production Entry");
    }
  };

  return (
    <div className="ProductionEntryMasterList" style={{ maxWidth: "100vw", overflowX: "hidden" }}>
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
                <div className="ProductionEntryList mt-2">
                  <div className="ProductionEntryList-header mb-4 text-start">
                    <div className="row align-items-center">
                      <div className="col-md-4">
                        <h5 className="header-title">
                          Production Entry Report
                        </h5>
                      </div>
                      <div className="col-md-8 text-end">
                      </div>
                    </div>
                  </div>
                  <div className="ProductionEntryList-Main">
                    <div className="container-fluid">
                      <div className="d-flex flex-wrap align-items-end gap-3 text-start">
                        {/* Plant */}
                        <div style={{minWidth: '150px', flex: '1'}}>
                          <label className="fw-bold mb-1" style={{fontSize: '12px'}}>Plant:</label>
                          <select className="form-select form-select-sm">
                            <option>Select All</option>
                            <option value="VISHWA S.I.">VISHWA S.I.</option>
                          </select>
                        </div>

                        {/* From Date */}
                        <div style={{minWidth: '150px', flex: '1'}}>
                          <label className="fw-bold mb-1" style={{fontSize: '12px'}}>From:</label>
                          <input type="date" className="form-control form-control-sm" />
                        </div>

                        {/* To Date */}
                        <div style={{minWidth: '150px', flex: '1'}}>
                          <label className="fw-bold mb-1" style={{fontSize: '12px'}}>To Date:</label>
                          <input type="date" className="form-control form-control-sm" />
                        </div>

                        {/* Series */}
                        <div style={{minWidth: '150px', flex: '1'}}>
                          <label className="fw-bold mb-1" style={{fontSize: '12px'}}>Series:</label>
                          <select className="form-select form-select-sm">
                            <option>Select All</option>
                            <option value="All">All</option>
                          </select>
                        </div>

                        {/* Shift */}
                        <div style={{minWidth: '150px', flex: '1'}}>
                          <label className="fw-bold mb-1" style={{fontSize: '12px'}}>Shift:</label>
                          <select className="form-select form-select-sm">
                            <option>Select All</option>
                            <option value="All">All</option>
                          </select>
                        </div>

                        <div>
                          <button
                            type="button"
                            className="vndrbtn"
                            style={{ padding: '6px 20px', minWidth: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            Search
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ProductionEntryList-table mt-5">
                    <div className="table-responsive">
                      <table className="table table-bordered table-striped">
                        <thead>
                          <tr>
                            <th>Sr.</th>
                            <th>Mill Name</th>
                            <th>Prod No</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Shift</th>
                            <th>Contractor</th>
                            <th>Operator</th>
                            <th>Item</th>
                            <th>Prod Qty</th>
                            <th>Reject Qty</th>
                            <th>Rework Qty</th>
                            <th>Edit</th>
                            <th>View</th>
                            <th>Delete</th>
                          </tr>
                        </thead>

                        <tbody>
                          {currentRecords.length > 0 ? (
                            currentRecords.map((entry, index) => (
                              <tr key={entry.id}>
                                <td>{index + 1 + indexOfFirstRecord}</td>
                                <td>{entry.mill_name}</td>
                                <td>{entry.Prod_no}</td>
                                <td>{entry.Date}</td>
                                <td>{entry.Time}</td>
                                <td>{entry.shift}</td>
                                <td>{entry.contractor}</td>
                                <td>{entry.operator}</td>
                                <td>{entry.item}</td>
                                <td>{entry.prod_qty}</td>
                                <td>{entry.reject_qty}</td>
                                <td>{entry.rework_qty}</td>
                                <td>
                                  <Link
                                    to={`/ProductionEntry/${entry.id}`}
                                    className="btn btn-sm btn-warning"
                                  >
                                    <FaEdit />
                                  </Link>
                                </td>

                                <td>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-primary"
                                    onClick={() => handleViewPdf(entry)}
                                  >
                                    View
                                  </button>
                                </td>

                                <td>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(entry.id, entry.Prod_no)}
                                    title="Delete"
                                  >
                                    <FaTrash />
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="15" className="text-center">
                                No production entries found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="d-flex justify-content-between mt-3">
                      <button
                        className="btn btn-secondary"
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                      <span className="align-self-center">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        className="btn btn-secondary"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
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

export default ProductionEntryList;
