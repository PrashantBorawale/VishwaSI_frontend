import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import NavBar from "../../../NavBar/NavBar.js";
import SideNav from "../../../SideNav/SideNav.js";
import { FaTrash, FaEye } from "react-icons/fa";
import "./JobworkInwardChallanList.css";

const JobworkInwardChallanList = () => {
    const [sideNavOpen, setSideNavOpen] = useState(false);
    const [inwardChallanList, setInwardChallanList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    const toggleSideNav = () => {
        setSideNavOpen((prevState) => !prevState);
    };

    const getAuthHeaders = () => {
        const token = localStorage.getItem("accessToken") || localStorage.getItem("token") || localStorage.getItem("authToken");
        const getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
        };
        const csrfToken = getCookie("csrftoken");
        return {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
        };
    };

    const fetchInwardChallanList = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://sellerp-backend.onrender.com/Store/JobworkInwardChallan/', {
                headers: getAuthHeaders(),
            });
            const data = await response.json();
            console.log('Fetched Jobwork data:', data);

            // Handle potentially nested data (DRF often uses 'results')
            if (Array.isArray(data)) {
                setInwardChallanList(data);
            } else if (data && Array.isArray(data.results)) {
                setInwardChallanList(data.results);
            } else if (data && Array.isArray(data.data)) {
                setInwardChallanList(data.data);
            } else {
                console.error('Unexpected API response format:', data);
                setInwardChallanList([]);
            }
        } catch (error) {
            console.error('Error fetching inward challan list:', error);
            setInwardChallanList([]);
        } finally {
            setLoading(false);
        }
    };

    const formatItemsDisplay = (inwardChallanTable) => {
        if (!inwardChallanTable || inwardChallanTable.length === 0) {
            return 'No items';
        }

        return inwardChallanTable.map(item =>
            `${item.ChallanQty || 0} | ${item.ItemCode || 'N/A'}`
        ).join(', ');
    };

    const handleViewPdf = (challanId) => {
        // Open PDF in new tab
        window.open(`https://sellerp-backend.onrender.com/Store/jobwork-inward-challan-pdf/${challanId}/`, '_blank');
    };

    const handleDelete = async (id) => {
        if (!id) return;
        const confirmDelete = window.confirm("Are you sure you want to delete this Jobwork Inward Challan?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`https://sellerp-backend.onrender.com/Store/JobworkInwardChallan/${id}/`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            if (response.ok) {
                toast.success("Deleted successfully!");
                fetchInwardChallanList();
            } else {
                toast.error("Failed to delete.");
            }
        } catch (error) {
            console.error("Error deleting:", error);
            toast.error("Error deleting record.");
        }
    };

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = inwardChallanList.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(inwardChallanList.length / recordsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    useEffect(() => {
        if (sideNavOpen) {
            document.body.classList.add("side-nav-open");
        } else {
            document.body.classList.remove("side-nav-open");
        }
        fetchInwardChallanList();
    }, [sideNavOpen]);

    return (
        <div className="NewStoreInwardList">
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
                                <div className="InwardList-header mb-4 text-start mt-5">
                                    <div className="row align-items-center">
                                        <div className="col-md-4">
                                            <h5 className="header-title text-start mb-0" style={{ fontWeight: 800, fontSize: '1.8rem', background: 'linear-gradient(90deg, #2563eb, #4f46e5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '16px' }}>
                                                Jobwork List
                                            </h5>
                                        </div>
                                        
                                        
                                    </div>
                                </div>

                                <div className="InwardList-main">
                                    <div className="container-fluid text-start">
                                        <div className="row mt-4">
                                            <div className="col-12 col-md">
                                                <label htmlFor="fromDate">From Date</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    id="fromDate"
                                                />
                                            </div>
                                            <div className="col-12 col-md">
                                                <label htmlFor="toDate">To Date</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    id="toDate"
                                                />
                                            </div>
                                            <div className="col-12 col-md">
                                                <label htmlFor="plant">Plant</label>
                                                <select className="form-control" id="plant">
                                                    <option>VISHWA S.I.</option>
                                                </select>
                                            </div>
                                            <div className="col-12 col-md">
                                                <label htmlFor="type">Type</label>
                                                <select className="form-control" id="type">
                                                    <option>ALL</option>
                                                </select>
                                            </div>
                                            <div className="col-12 col-md">
                                                <label htmlFor="series">Series</label>
                                                <select className="form-control" id="series">
                                                    <option>Select</option>
                                                    <option>57F4 Inward</option>
                                                    <option>57F4 Return</option>
                                                    <option>Jobwork 57F4 Inward</option>
                                                    <option>Non Returnable Inward</option>
                                                    <option>Vendor Scrap Inward</option>
                                                    <option>Inward Tool</option>
                                                    <option>Cust Rework</option>
                                                </select>
                                            </div>
                                            <div className="col-12 col-md">
                                                <label htmlFor="f4Status">F4 Status</label>
                                                <select className="form-control" id="f4Status">
                                                    <option>ALL</option>
                                                </select>
                                            </div>
                                            <div className="col-12 col-md">
                                                <label htmlFor="vendorCustomerName">V Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="vendorCustomerName"
                                                />
                                            </div>
                                            <div className="col-12 col-md">
                                                <label htmlFor="itemCodeNo">ItemCodeNo:</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="itemCodeNo"
                                                />
                                            </div>
                                            <div className="col-12 col-md">
                                                <label htmlFor="partCode">Part Code:</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="partCode"
                                                />
                                            </div>
                                            <div className="col-12 col-md">
                                                <label htmlFor="inward">Inward</label>
                                                <select className="form-control" id="inward">
                                                    <option>Select Inward</option>
                                                </select>
                                            </div>
                                            <div className="col-12 col-md text-start d-flex flex-column align-items-start justify-content-end">
                                                <label htmlFor="critical" className="invisible">Is Critical</label>
                                                <button type="button" className="btn btn-primary w-100" style={{ fontSize: "0.85rem", padding: "6px 12px" }}>
                                                    Search
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="InwardList-table">
                                        <div className="container-fluid mt-4 text-start">
                                            <div className="table-responsive" style={{ width: '100%', overflowX: 'hidden' }}>
                                                <table className="table table-bordered table-striped table-sm" style={{ width: '100%', wordBreak: 'break-word', fontSize: '0.75rem' }}>
                                                    <thead>
                                                        <tr>
                                                            <th>Sr no.</th>
                                                            <th>Inward F4 No</th>
                                                            <th>Inward Date</th>
                                                            <th>Inward Time</th>
                                                            <th>Challan No.</th>
                                                            <th>Challan Date</th>
                                                            <th>Invoice No</th>
                                                            <th>Invoice Date</th>
                                                            <th style={{ width: '120px', minWidth: '120px' }}>Supplier Name</th>
                                                            <th>Vehicle No</th>
                                                            <th>Transporter</th>
                                                            <th style={{ width: '180px', minWidth: '180px' }}>Item Qty | Desc</th>
                                                            <th>Prepared By</th>
                                                            <th>Checked By</th>
                                                            <th>Total Items</th>
                                                            <th>Remarks</th>
                                                            <th>View</th>
                                                            <th>Del</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {loading ? (
                                                            <tr>
                                                                <td colSpan="18" className="text-center">
                                                                    Loading...
                                                                </td>
                                                            </tr>
                                                        ) : currentRecords.length > 0 ? (
                                                            currentRecords.map((challan, index) => (
                                                                <tr key={challan.id || index}>
                                                                    <td>{indexOfFirstRecord + index + 1}</td>
                                                                    <td>{challan.InwardF4No || 'N/A'}</td>
                                                                    <td>{challan.InwardDate || 'N/A'}</td>
                                                                    <td>{challan.InwardTime || 'N/A'}</td>
                                                                    <td>{challan.ChallanNo || 'N/A'}</td>
                                                                    <td>{challan.ChallanDate || 'N/A'}</td>
                                                                    <td>{challan.DCNo || 'N/A'}</td>
                                                                    <td>{challan.DCDate || 'N/A'}</td>
                                                                    <td>{challan.Customer || 'N/A'}</td>
                                                                    <td>{challan.VehicleNo || 'N/A'}</td>
                                                                    <td>{challan.Transporter || 'N/A'}</td>
                                                                    <td style={{ maxWidth: '180px', wordWrap: 'break-word', whiteSpace: 'normal' }}>
                                                                        {formatItemsDisplay(challan.JobworkInwardChallanTable)}
                                                                    </td>
                                                                    <td>{challan.PrepartedBy || 'N/A'}</td>
                                                                    <td>{challan.CheckedBy || 'N/A'}</td>
                                                                    <td>{challan.TotalItem || 'N/A'}</td>
                                                                    <td>{challan.Remark || 'N/A'}</td>
                                                                    <td>
                                                                        <FaEye
                                                                            title="View PDF"
                                                                            style={{ cursor: 'pointer', fontSize: '1.2rem', color: '#0dcaf0' }}
                                                                            onClick={() => handleViewPdf(challan.id)}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <FaTrash
                                                                            title="Delete"
                                                                            className="text-danger"
                                                                            style={{ cursor: 'pointer', fontSize: '1.1rem' }}
                                                                            onClick={() => handleDelete(challan.id)}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="18" className="text-center">
                                                                    No inward challan data available
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="InwardList-bottom mt-4">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="record-count">
                                                Total Record : <span className="badge bg-primary text-white">{inwardChallanList.length}</span>
                                            </div>
                                            {totalPages > 1 && (
                                                <nav>
                                                    <ul className="pagination mb-0">
                                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                            <button
                                                                className="page-link"
                                                                onClick={() => setCurrentPage(currentPage - 1)}
                                                                disabled={currentPage === 1}
                                                            >
                                                                Previous
                                                            </button>
                                                        </li>
                                                        {pageNumbers.map((number) => (
                                                            <li
                                                                key={number}
                                                                className={`page-item ${currentPage === number ? "active" : ""}`}
                                                            >
                                                                <button
                                                                    className="page-link"
                                                                    onClick={() => setCurrentPage(number)}
                                                                >
                                                                    {number}
                                                                </button>
                                                            </li>
                                                        ))}
                                                        <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`}>
                                                            <button
                                                                className="page-link"
                                                                onClick={() => setCurrentPage(currentPage + 1)}
                                                                disabled={currentPage === totalPages || totalPages === 0}
                                                            >
                                                                Next
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </nav>
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

export default JobworkInwardChallanList;
