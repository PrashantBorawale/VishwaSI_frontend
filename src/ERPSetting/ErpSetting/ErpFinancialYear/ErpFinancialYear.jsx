import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import NavBar from "../../../NavBar/NavBar.js";
import SideNav from "../../../SideNav/SideNav.js";
import "./ErpFinancialYear.css";
import { FaFile } from "react-icons/fa";
import { Link } from "react-router-dom";
import { createFinancialYear, getFinancialYears, deleteFinancialYear } from "../../../Service/Erpsetting.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import AddIcon from "@mui/icons-material/AddOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

const ErpFinancialYear = () => {
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

  const [financialYears, setFinancialYears] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    FyName: "",
    From_Date: "",
    To_Date: "",
    ShortName: "",
  });

  const [errors, setErrors] = useState({});

  // Fetch financial years on component mount
  useEffect(() => {
    const fetchFinancialYears = async () => {
      try {
        const data = await getFinancialYears();
        setFinancialYears(data);
      } catch (error) {
        toast.error("Failed to fetch financial years!");
      }
    };

    fetchFinancialYears();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Validation for ShortName
    if (name === "ShortName") {
      const shortNameRegex = /^\d{4}-\d{4}$/;
      if (!shortNameRegex.test(value)) {
        setErrors((prev) => ({
          ...prev,
          ShortName: "Format must be YYYY-YYYY"
        }));
      } else {
        // Optional: Validate difference
        const [start, end] = value.split("-").map(Number);
        if (end !== start + 1) {
          setErrors((prev) => ({
            ...prev,
            ShortName: "End year must be one more than start year"
          }));
        } else {
          setErrors((prev) => ({ ...prev, ShortName: "" }));
        }
      }
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async () => {
    try {
      const newFinancialYear = await createFinancialYear(formData);
      setFinancialYears([...financialYears, newFinancialYear]); // Update table
      toast.success("Financial Year added successfully!");
      setShowModal(false);
      setFormData({
        FyName: "",
        From_Date: "",
        To_Date: "",
        ShortName: "",
      });
    } catch (error) {
      toast.error("Failed to add Financial Year!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this financial year?")) return;
    try {
      await deleteFinancialYear(id);
      setFinancialYears(financialYears.filter((item) => item.id !== id));
      toast.success("Financial Year deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete Financial Year!");
    }
  };

  return (
    <div className="ErpFinancialyear">
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
                <div className="financial mt-5 px-3">
                  <div className="WorkOrderEntry-header mb-4 text-start">
                    <div className="row align-items-center">
                      <div className="col-md-4 d-flex justify-content-start align-items-center">
                        <Typography variant="h4" sx={{ fontWeight: 800, background: 'linear-gradient(to right, #2563eb, #4f46e5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.025em', m: 0 }}>
                          Financial Year
                        </Typography>
                      </div>
                      <div className="col-md-8 d-flex justify-content-end gap-2">
                        <Button 
                          variant="contained" 
                          startIcon={<AddIcon />}
                          onClick={() => setShowModal(true)}
                          sx={{ 
                            borderRadius: '8px', textTransform: 'none', fontWeight: 600, 
                            background: 'linear-gradient(to right, #3b82f6, #4f46e5)', color: 'white',
                            boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.39)', transition: 'all 0.2s ease',
                            '&:hover': { background: 'linear-gradient(to right, #2563eb, #4338ca)', transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(79, 70, 229, 0.4)' } 
                          }}
                        >
                          Create New Year
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', mt: 4, mb: 4 }}>
                    <TableContainer sx={{ maxHeight: 600, '&::-webkit-scrollbar': { height: 8, width: 8 }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#cbd5e1', borderRadius: 4 } }}>
                      <Table stickyHeader size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ whiteSpace: 'nowrap', backgroundColor: '#f8fafc', color: '#475569', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', padding: '12px 16px', textAlign: 'center' }}>FyId</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap', backgroundColor: '#f8fafc', color: '#475569', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', padding: '12px 16px' }}>Fy Name</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap', backgroundColor: '#f8fafc', color: '#475569', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', padding: '12px 16px' }}>From Date</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap', backgroundColor: '#f8fafc', color: '#475569', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', padding: '12px 16px' }}>To Date</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap', backgroundColor: '#f8fafc', color: '#475569', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', padding: '12px 16px', textAlign: 'center' }}>Short Name</TableCell>
                            {/* <TableCell sx={{ whiteSpace: 'nowrap', backgroundColor: '#f8fafc', color: '#475569', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', padding: '12px 16px', textAlign: 'center' }}>Doc Start No.</TableCell> */}
                            {/* <TableCell sx={{ whiteSpace: 'nowrap', backgroundColor: '#f8fafc', color: '#475569', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', padding: '12px 16px', textAlign: 'center' }}>Fy Month</TableCell> */}
                            <TableCell sx={{ whiteSpace: 'nowrap', backgroundColor: '#f8fafc', color: '#475569', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', padding: '12px 16px', textAlign: 'center' }}>Delete</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {financialYears.map((year) => (
                            <TableRow key={year.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 }, transition: "all 0.2s ease", "&:hover": { backgroundColor: "#f1f5f9" } }}>
                              <TableCell sx={{ color: '#475569', fontSize: '0.8rem', padding: '12px 16px', borderBottom: '1px solid #f1f5f9', textAlign: 'center' }}>{year.id}</TableCell>
                              <TableCell sx={{ color: '#475569', fontSize: '0.8rem', padding: '12px 16px', borderBottom: '1px solid #f1f5f9', fontWeight: 500 }}>{year.FyName}</TableCell>
                              <TableCell sx={{ color: '#475569', fontSize: '0.8rem', padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>{year.From_Date}</TableCell>
                              <TableCell sx={{ color: '#475569', fontSize: '0.8rem', padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>{year.To_Date}</TableCell>
                              <TableCell sx={{ color: '#475569', fontSize: '0.8rem', padding: '12px 16px', borderBottom: '1px solid #f1f5f9', textAlign: 'center' }}>
                                <span style={{ backgroundColor: '#e2e8f0', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>{year.ShortName}</span>
                              </TableCell>
                              {/* <TableCell sx={{ color: '#475569', fontSize: '0.8rem', padding: '12px 16px', borderBottom: '1px solid #f1f5f9', textAlign: 'center' }}>
                                <Link to="/Document-start" style={{ color: '#3b82f6', transition: 'color 0.2s ease', display: 'inline-block' }} onMouseOver={(e) => e.currentTarget.style.color = '#2563eb'} onMouseOut={(e) => e.currentTarget.style.color = '#3b82f6'}>
                                  <FaFile size={18} />
                                </Link>
                              </TableCell> */}
                              {/* <TableCell sx={{ color: '#475569', fontSize: '0.8rem', padding: '12px 16px', borderBottom: '1px solid #f1f5f9', textAlign: 'center' }}>
                                <FaFile size={18} style={{ color: '#94a3b8', cursor: 'pointer', transition: 'color 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.color = '#64748b'} onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'} />
                              </TableCell> */}
                              <TableCell sx={{ color: '#ef4444', fontSize: '0.8rem', padding: '12px 16px', borderBottom: '1px solid #f1f5f9', textAlign: 'center' }}>
                                <DeleteIcon style={{ cursor: 'pointer', transition: 'color 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.color = '#b91c1c'} onMouseOut={(e) => e.currentTarget.style.color = '#ef4444'} onClick={() => handleDelete(year.id)} />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
      
      {/* MUI Dialog Modal */}
      <Dialog 
        open={showModal} 
        onClose={() => setShowModal(false)}
        PaperProps={{
          sx: { borderRadius: '16px', padding: '12px', minWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#1e293b', pb: 1, fontSize: '1.25rem' }}>Create New Financial Year</DialogTitle>
        <DialogContent>
          <div className="form-group mt-2">
            <label className="form-label fw-bold" style={{ fontSize: '0.85rem', color: '#475569' }}>Fy Name</label>
            <input
              type="text"
              name="FyName"
              value={formData.FyName}
              onChange={handleInputChange}
              className="form-control"
              style={{ borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: 'none' }}
            />
          </div>
          <div className="form-group mt-3">
            <label className="form-label fw-bold" style={{ fontSize: '0.85rem', color: '#475569' }}>From Date</label>
            <input
              type="date"
              name="From_Date"
              value={formData.From_Date}
              onChange={handleInputChange}
              className="form-control"
              style={{ borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: 'none' }}
            />
          </div>
          <div className="form-group mt-3">
            <label className="form-label fw-bold" style={{ fontSize: '0.85rem', color: '#475569' }}>To Date</label>
            <input
              type="date"
              name="To_Date"
              value={formData.To_Date}
              onChange={handleInputChange}
              className="form-control"
              style={{ borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: 'none' }}
            />
          </div>
          <div className="form-group mt-3">
            <label className="form-label fw-bold" style={{ fontSize: '0.85rem', color: '#475569' }}>Short Name</label>
            <input
              type="text"
              name="ShortName"
              value={formData.ShortName}
              onChange={handleInputChange}
              className={`form-control ${errors.ShortName ? "is-invalid" : ""}`}
              placeholder="e.g. 2024-2025"
              style={{ borderRadius: '8px', border: errors.ShortName ? '1px solid #ef4444' : '1px solid #cbd5e1', boxShadow: 'none' }}
            />
            {errors.ShortName && (
              <div className="invalid-feedback">{errors.ShortName}</div>
            )}
          </div>
        </DialogContent>
        <DialogActions sx={{ pt: 2, pb: 2, px: 3 }}>
          <Button 
            onClick={() => setShowModal(false)} 
            sx={{ color: '#64748b', fontWeight: 600, textTransform: 'none', borderRadius: '8px', '&:hover': { backgroundColor: '#f1f5f9' } }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleFormSubmit} 
            variant="contained"
            sx={{ 
              borderRadius: '8px', textTransform: 'none', fontWeight: 600, 
              background: 'linear-gradient(to right, #3b82f6, #4f46e5)', color: 'white',
              boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.39)',
              '&:hover': { background: 'linear-gradient(to right, #2563eb, #4338ca)' } 
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </div>
  );
};

export default ErpFinancialYear;
