import React, { useEffect, useState } from "react";
import { Paper, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Pagination } from '@mui/material';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@fortawesome/fontawesome-free/css/all.min.css";
import NavBar from "../../NavBar/NavBar";
import SideNav from "../../SideNav/SideNav";
import "./BomRouting.css";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

const BomRouting = () => {
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [bomData, setBomData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [selectedItemGroup, setSelectedItemGroup] = useState("ALL");
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleSideNav = () => {
    setSideNavOpen(!sideNavOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleRowExpansion = (partNumber) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(partNumber)) {
      newExpandedRows.delete(partNumber);
    } else {
      newExpandedRows.add(partNumber);
    }
    setExpandedRows(newExpandedRows);
  };

  // Helper to get auth & CSRF headers
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
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(csrfToken ? { 'X-CSRFToken': csrfToken } : {}),
    };
  };

  // Fetch BOM data from API
  const fetchBomData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://sellerp-backend.onrender.com/All_Masters/api/bom-items/", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBomData(data);
    } catch (err) {
      setError(`Failed to fetch BOM data: ${err.message}`);
      console.error("Error fetching BOM data:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- DELETE FUNCTION INTEGRATION ---
  const handleDelete = async (id, type = 'parent', parentId = null) => {
    if (!id) return;

    // 1. Confirmation Dialog
    const confirmDelete = window.confirm("Are you sure you want to delete this item? This action cannot be undone.");

    if (confirmDelete) {
      try {
        // 2. API Call
        const url = type === 'child' 
          ? `https://sellerp-backend.onrender.com/All_Masters/bom/delete/${id}/`
          : `https://sellerp-backend.onrender.com/All_Masters/api/bom/delete/${id}/`;

        const response = await fetch(url, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });

        if (response.ok) {
          // 3. Success Handling
          alert("Item deleted successfully!");
          // Refresh data to reflect changes
          fetchBomData();
        } else {
          // Handle server errors
          alert("Failed to delete item. Server responded with status: " + response.status);
        }
      } catch (err) {
        // Handle network errors
        console.error("Delete error:", err);
        alert("An error occurred while trying to delete.");
      }
    }
  };

  useEffect(() => {
    fetchBomData();
  }, []);

  // Filter data based on search and filters
  const getFilteredData = () => {
    let filteredData = { ...bomData };

    // Apply search filter
    if (searchTerm) {
      filteredData = Object.fromEntries(
        Object.entries(filteredData).filter(([partNumber, data]) =>
          partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          data.bom_items.some(item =>
            item.PartCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.BomPartDesc?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      );
    }

    // Apply BOM part type filter
    if (selectedFilter !== "ALL") {
      filteredData = Object.fromEntries(
        Object.entries(filteredData).map(([partNumber, data]) => [
          partNumber,
          {
            ...data,
            bom_items: data.bom_items.filter(item =>
              item.BOMPartType === selectedFilter
            )
          }
        ]).filter(([, data]) => data.bom_items.length > 0)
      );
    }

    return filteredData;
  };

  // Calculate total counts
  const getTotalCounts = () => {
    const filteredData = getFilteredData();
    const allItems = Object.values(filteredData).flatMap(data => data.bom_items);
    const partNumbers = Object.keys(filteredData);

    return {
      totalItems: allItems.length,
      totalPartNumbers: partNumbers.length,
    };
  };

  const { totalItems } = getTotalCounts();

  // --- EXPORT TO EXCEL LOGIC ---
  const handleExportBOM = () => {
    const filteredData = getFilteredData();
    if (Object.keys(filteredData).length === 0) {
      alert("No records available to export");
      return;
    }

    const exportData = [];
    let srNo = 1;

    Object.entries(filteredData).forEach(([partNumber, data]) => {
      // Create a main row for the Parent item
      exportData.push({
        "Sr.": srNo++,
        "Level": "Parent",
        "Part Number": data.part_no || partNumber,
        "Part Code": data.Part_Code || "-",
        "Description": data.Name_Description || "-",
        "NPD": data.NPD || "-",
        "Auth": data.Auth ? "Auth" : "Un-Auth",
        "User": data.User || "-",
        "BOM Part Type": "-",
        "BOM QC": "-"
      });

      // Create indented rows for children underneath
      if (data.bom_items && data.bom_items.length > 0) {
        data.bom_items.forEach((item, index) => {
          exportData.push({
            "Sr.": "",
            "Level": `  └─ Child ${index + 1}`,
            "Part Number": item.item || "-",
            "Part Code": item.PartCode || item.BomPartCode || "-",
            "Description": item.BomPartDesc || "-",
            "NPD": "-",
            "Auth": "-",
            "User": "-",
            "BOM Part Type": item.BOMPartType || "-",
            "BOM QC": item.QC || "-"
          });
        });
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "BOM Master List");

    const wscols = Object.keys(exportData[0] || {}).map(key => ({
      wch: Math.max(key.length, ...exportData.map(row => row[key] ? row[key].toString().length : 0)) + 2
    }));
    worksheet["!cols"] = wscols;

    XLSX.writeFile(workbook, "BOM_Master_List.xlsx");
  };

  const handleExportRouting = () => {
    const filteredData = getFilteredData();
    if (Object.keys(filteredData).length === 0) {
      alert("No records available to export");
      return;
    }

    const exportData = [];
    let srNo = 1;

    Object.entries(filteredData).forEach(([partNumber, data]) => {
      if (data.bom_items && data.bom_items.length > 0) {
        data.bom_items.forEach(item => {
          exportData.push({
            "Sr.": srNo++,
            "Parent Part Number": data.part_no || partNumber,
            "Parent Description": data.Name_Description || "-",
            "Operation No (OPNo)": item.OPNo || "-",
            "Routing/BOM Part": item.BomPartCode || item.PartCode || "-",
            "Routing/BOM Desc": item.BomPartDesc || "-",
            "Qty": item.QtyKg || "-",
            "WIP Rate": item.WipRate || "-"
          });
        });
      }
    });

    if(exportData.length === 0) {
       alert("No routing/operation records found to export.");
       return;
    }

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Routing Data");

    const wscols = Object.keys(exportData[0] || {}).map(key => ({
      wch: Math.max(key.length, ...exportData.map(row => row[key] ? row[key].toString().length : 0)) + 2
    }));
    worksheet["!cols"] = wscols;

    XLSX.writeFile(workbook, "Routing_Export.xlsx");
  };
  // -----------------------------

  const renderDetailRows = (bomItems, partNumber) => {
    return bomItems.map((item, index) => (
      <TableRow key={`${partNumber}-${item.id}`} className="detail-row bg-light">
        <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px', paddingLeft: '32px' }}>└─ {index + 1}</TableCell>
        <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>{item.PartCode || "-"}</TableCell>
        <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>{item.item || "-"}</TableCell>
        <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>{item.BomPartCode || "-"}</TableCell>
        <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>{item.BomPartDesc || "-"}</TableCell>
        <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>{item.OPNo || "-"}</TableCell>
        <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>
          <span className={`badge ${item.BOMPartType === 'RM' ? 'bg-primary' :
            item.BOMPartType === 'COM' ? 'bg-success' :
              item.BOMPartType === 'Casting' ? 'bg-warning' : 'bg-secondary'
            }`}>
            {item.BOMPartType || "-"}
          </span>
        </TableCell>
        <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>
          <span className={`badge ${item.QC === 'Yes' || item.QC === 'y' ? 'bg-success' :
            item.QC === 'N' ? 'bg-danger' : 'bg-secondary'
            }`}>
            {item.QC || "-"}
          </span>
        </TableCell>
        <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>
          <small>
            Qty: {item.QtyKg || "-"}<br />
            Rate: {item.WipRate || "-"}
          </small>
        </TableCell>
        <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => window.open(`https://sellerp-backend.onrender.com/All_Masters/api/bom_pdf/${item.item}`, "_blank")}
          >
            <i className="fas fa-eye"></i>
          </button>
        </TableCell>
        {/* Detail Row Delete Button */}
        <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => handleDelete(item.id)}
            title="Delete Item"
          >
            <i className="fas fa-trash-alt"></i>
          </button>
        </TableCell>
      </TableRow>
    ));
  };

  const renderTableRows = () => {
    // Increased colSpan to 11 to match new header count
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={11} sx={{ textAlign: 'center', py: 4 }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={11} sx={{ textAlign: 'center', color: '#ef4444', py: 4 }}>
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </TableCell>
        </TableRow>
      );
    }

    const filteredData = getFilteredData();

    if (Object.keys(filteredData).length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={11} sx={{ textAlign: 'center', py: 4 }}>
            <i className="fas fa-search me-2"></i>
            No data available
          </TableCell>
        </TableRow>
      );
    }

    let serialNumber = 1;
    const rows = [];

    Object.entries(filteredData).forEach(([partNumber, data]) => {
      const bomItems = data.bom_items;
      const isExpanded = expandedRows.has(partNumber);

      // Get summary data
      const uniquePartCodes = [...new Set(bomItems.map(item => item.PartCode).filter(Boolean))];
      const uniqueOperations = [...new Set(bomItems.map(item => item.OPNo).filter(Boolean))];
      const uniqueBomTypes = [...new Set(bomItems.map(item => item.BOMPartType).filter(Boolean))];
      const qcStatuses = [...new Set(bomItems.map(item => item.QC).filter(Boolean))];

      // Main row
      rows.push(
        <TableRow key={partNumber} className="main-row">
          <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>
            <button
              className="btn btn-sm btn-link p-0 me-2"
              onClick={() => toggleRowExpansion(partNumber)}
            >
              <i className={`fas fa-chevron-${isExpanded ? 'down' : 'right'}`}></i>
            </button>
            {serialNumber++}
          </TableCell>
          <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>
            <strong className="text-primary">{partNumber}</strong>
            <br />
            <small className="text-muted">Items: {bomItems.length}</small>
          </TableCell>
          <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>{data.item_id || "-"}</TableCell>
          <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>
            <small>{uniquePartCodes.slice(0, 2).join(", ")}
              {uniquePartCodes.length > 2 && ` +${uniquePartCodes.length - 2} more`}</small>
          </TableCell>
          <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>-</TableCell>
          <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>
            <small>{uniqueOperations.slice(0, 2).join(", ")}
              {uniqueOperations.length > 2 && ` +${uniqueOperations.length - 2} more`}</small>
          </TableCell>
          <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>
            {uniqueBomTypes.map(type => (
              <span key={type} className={`badge me-1 ${type === 'RM' ? 'bg-primary' :
                type === 'COM' ? 'bg-success' :
                  type === 'Casting' ? 'bg-warning' : 'bg-secondary'
                }`}>
                {type}
              </span>
            ))}
          </TableCell>
          <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>
            {qcStatuses.map(qc => (
              <span key={qc} className={`badge me-1 ${qc === 'Yes' || qc === 'y' ? 'bg-success' :
                qc === 'N' ? 'bg-danger' : 'bg-secondary'
                }`}>
                {qc}
              </span>
            ))}
          </TableCell>
          <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>
            <small className="text-muted">
              Total: {bomItems.reduce((sum, item) => sum + (parseFloat(item.QtyKg) || 0), 0).toFixed(2)}
            </small>
          </TableCell>
          <TableCell width="200px" sx={{ whiteSpace: "nowrap" }}>
            <button
              style={{ width: "auto" }}
              onClick={() => window.open(`https://sellerp-backend.onrender.com/All_Masters/api/bom_pdf/${data.item_id}`, "_blank")}
              className="btn btn-sm btn-primary me-1 d-inline-block"
            >
              <i className="fas fa-file-pdf"></i>
            </button>

            <button
              style={{ width: "auto" }}
              onClick={() => toggleRowExpansion(partNumber)}
              className="btn btn-sm btn-outline-secondary d-inline-block"
            >
              <i className="fas fa-list"></i>
            </button>
          </TableCell>


          {/* Main Row Delete Button */}
          <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleDelete(data.item_id)}
              title="Delete Main Record"
            >
              <i className="fas fa-trash"></i>
            </button>
          </TableCell>
        </TableRow>
      );

      // Detail rows (expanded)
      if (isExpanded) {
        rows.push(...renderDetailRows(bomItems, partNumber));
      }
    });

    return rows;
  };

  const renderNewDetailRows = (bomItems, partNumber) => {
    return bomItems.map((item, index) => (
      <TableRow key={`new-detail-${partNumber}-${item.id}`} sx={{ backgroundColor: '#f8fafc' }}>
        <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px', paddingLeft: '32px' }}>└─ {index + 1}</TableCell>
        <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>{item.BomPartCode || "-"}</TableCell>
        <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>{item.PartCode || item.item || "-"}</TableCell>
        <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>{item.BomPartDesc || "-"}</TableCell>
        {/* <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>{item.QC || "-"}</TableCell>
        <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>{item.BOMPartType || "-"}</TableCell> */}
        <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>{item.User || "-"}</TableCell>
        <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>
          <IconButton size="small" onClick={() => window.open(`https://sellerp-backend.onrender.com/All_Masters/api/bom_pdf/${item.item || item.id}`, "_blank")} sx={{ color: '#3b82f6', '&:hover': { background: '#dbeafe' } }}><i className="fas fa-eye" style={{ fontSize: '16px' }}></i></IconButton>
        </TableCell>
        <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>-</TableCell>
        <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>
          <IconButton size="small" onClick={() => handleDelete(item.id, 'child', item.item)} sx={{ color: '#ef4444', '&:hover': { background: '#fee2e2' } }}><i className="fas fa-trash-alt" style={{ fontSize: '16px' }}></i></IconButton>
        </TableCell>
      </TableRow>
    ));
  };

  const renderNewTableRows = () => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={10} sx={{ textAlign: 'center', py: 4, color: '#64748b' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={10} sx={{ textAlign: 'center', py: 4, color: '#ef4444' }}>
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </TableCell>
        </TableRow>
      );
    }

    const filteredData = getFilteredData();
    const sortedEntries = Object.entries(filteredData).sort((a, b) => (b[1].item_id || 0) - (a[1].item_id || 0));

    if (sortedEntries.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={10} sx={{ textAlign: 'center', py: 4, color: '#64748b' }}>
            <i className="fas fa-search me-2"></i>
            No data available
          </TableCell>
        </TableRow>
      );
    }

    const rowsPerPage = 10;
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedEntries = sortedEntries.slice(startIndex, startIndex + rowsPerPage);

    let serialNumber = startIndex + 1;
    const rows = [];

    paginatedEntries.forEach(([partNumber, data]) => {
      const isExpanded = expandedRows.has(partNumber);

      rows.push(
        <TableRow key={`new-${partNumber}`} hover sx={{ cursor: 'pointer', "&:last-child td, &:last-child th": { border: 0 } }}>
          <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>{serialNumber++}</TableCell>
          <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>{data.part_no || partNumber}</TableCell>
          <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>{data.Part_Code || "-"}</TableCell>
          <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>{data.Name_Description || "-"}</TableCell>
          {/* <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>{data.NPD || "-"}</TableCell>
          <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>{data.Auth === true ? "Auth" : "Un-Auth"}</TableCell> */}
          <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>{data.User || "Admin"}</TableCell>
          <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>
            <IconButton size="small" onClick={() => window.open(`https://sellerp-backend.onrender.com/All_Masters/api/bom_pdf/${data.item_id || data.Part_Code}`, "_blank")} sx={{ color: '#3b82f6', '&:hover': { background: '#dbeafe' } }}><i className="fas fa-eye" style={{ fontSize: '16px' }}></i></IconButton>
          </TableCell>
          <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>
            <IconButton size="small" onClick={() => toggleRowExpansion(partNumber)} sx={{ color: '#64748b', '&:hover': { background: '#f1f5f9' } }}><i className={`fas fa-${isExpanded ? 'chevron-down' : 'list'}`} style={{ fontSize: '16px' }}></i></IconButton>
          </TableCell>
          <TableCell sx={{ color: '#475569', fontSize: '0.85rem', padding: '12px 16px' }}>
            <IconButton size="small" onClick={() => handleDelete(data.item_id, 'parent')} sx={{ color: '#ef4444', '&:hover': { background: '#fee2e2' } }}><i className="fas fa-trash-alt" style={{ fontSize: '16px' }}></i></IconButton>
          </TableCell>
        </TableRow>
      );

      if (isExpanded && data.bom_items) {
        rows.push(...renderNewDetailRows(data.bom_items, partNumber));
      }
    });

    return rows;
  };

  return (
    <div className="erp-page BomRoutingMaster">
      <div className="container-fluid p-0">
        <div className="row m-0">
          <div className="col-md-12 p-0">
            <div className="Main-NavBar">
              <NavBar toggleSideNav={toggleSideNav} />
              <SideNav sideNavOpen={sideNavOpen} toggleSideNav={toggleSideNav} />
              <main className={`main-content ${sideNavOpen ? "shifted" : ""}`}>
                <div className="container-fluid p-0 py-4 overflow-hidden">
                  {/* Header */}
                  
                  {/* Header Section */}
                  <div className="erp-header mb-4">
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                      <h5 className="header-title mb-0">BOM And Routing List</h5>
                      
                      <div className="d-flex gap-2 flex-wrap justify-content-end align-items-center">
                        {/* <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mr: 2 }}>
                          <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '6px 12px', fontSize: '13px' }}>Total BOM:</span>
                          <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '6px 12px', fontSize: '13px' }}>FG:548</span>
                          <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '6px 12px', fontSize: '13px' }}>SFG:1</span>
                          <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '6px 12px', fontSize: '13px' }}>RM:44</span>
                          <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '6px 12px', fontSize: '13px' }}>NPD:0</span>
                          <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '6px 12px', fontSize: '13px' }}>Total:593</span>
                          <span className="badge" style={{ backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fca5a5', padding: '6px 12px', fontSize: '13px' }}>Un-Auth:2</span>
                          <span className="badge" style={{ backgroundColor: '#f0fdf4', color: '#16a34a', border: '1px solid #86efac', padding: '6px 12px', fontSize: '13px' }}>Auth:591</span>
                        </Box> */}
  
                        {/* <div style={{ position: 'relative', display: 'inline-block' }}>
                          <button onClick={toggleDropdown} className="vndrbtn border-0">BOM:Report ▼</button>
  
                        {dropdownOpen && (
                          <ul
                            className="dropdown-menu show"
                            style={{
                              position: 'absolute',
                              top: '100%',
                              left: 0,
                              zIndex: 1000,
                              display: 'block',
                              minWidth: '14rem',
                              padding: '0.5rem 0',
                              margin: '0.125rem 0 0',
                              fontSize: '13px',
                              color: '#212529',
                              textAlign: 'left',
                              listStyle: 'none',
                              backgroundColor: '#fff',
                              backgroundClip: 'padding-box',
                              borderRadius: '8px',
                              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                            }}
                          >
                            <li><Link className="dropdown-item py-2 px-3" to={"/UploadWIPvalue"} style={{ fontWeight: 500 }}>Upload WIP Value</Link></li>
                            <li><Link className="dropdown-item py-2 px-3" to={"/UploadOperationSpeci"} style={{ fontWeight: 500 }}>Upload Operation Specification</Link></li>
                            <li><Link className="dropdown-item py-2 px-3" to={"/ManualBOMWorking"} style={{ fontWeight: 500 }}>Manual BOM Working Sheet</Link></li>
                            <li><Link className="dropdown-item py-2 px-3" to={"/BOMItemTrace"} style={{ fontWeight: 500 }}>BOM Item Traceability</Link></li>
                            <li><Link className="dropdown-item py-2 px-3" to={"/"} style={{ fontWeight: 500 }}>BOM Value Report</Link></li>
                            <li><Link className="dropdown-item py-2 px-3" to={"/"} style={{ fontWeight: 500 }}>BOM Tree View</Link></li>
                          </ul>
                        )}
                      </div> */}

                      <Link to="/bill-material" className="vndrbtn">New / Modify BOM</Link>
                      {/* <Link to="/BOMQuery" className="vndrbtn">BOM:Query</Link> */}
                    </div>
                  </div>
                </div>

                <div className="BomRouting-Main px-3">

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, flexGrow: 1, alignItems: 'center' }}>
                        <select
                          className="form-select"
                          style={{ width: '180px', borderRadius: '8px', height: '38px' }}
                          value={selectedFilter}
                          onChange={(e) => setSelectedFilter(e.target.value)}
                        >
                          <option value="ALL">All Types</option>
                          <option value="RM">Raw Material</option>
                          <option value="COM">Component</option>
                          <option value="Casting">Casting</option>
                        </select>
                        <input
                          type="text"
                          className="form-control"
                          style={{ width: '220px', borderRadius: '8px', height: '38px' }}
                          placeholder="Search part numbers, codes..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select
                          className="form-select"
                          style={{ width: '180px', borderRadius: '8px', height: '38px' }}
                          value={selectedItemGroup}
                          onChange={(e) => setSelectedItemGroup(e.target.value)}
                        >
                          <option value="ALL">All Groups</option>
                          <option value="BEARING">BEARING</option>
                          <option value="BELTS">BELTS</option>
                          <option value="CAMS">CAMS</option>
                        </select>
                        <Button variant="contained" onClick={fetchBomData} disabled={loading} sx={{ height: '38px', borderRadius: '8px', textTransform: 'none', fontWeight: 600, background: 'linear-gradient(to right, #6366f1, #4f46e5)', boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)', '&:hover': { background: 'linear-gradient(to right, #4f46e5, #4338ca)', transform: 'translateY(-1px)' } }}>
                          <i className="fas fa-sync-alt me-2"></i> Refresh
                        </Button>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button onClick={handleExportBOM} variant="contained" sx={{ height: '38px', whiteSpace: 'nowrap', borderRadius: '8px', textTransform: 'none', fontWeight: 600, background: 'linear-gradient(to right, #10b981, #059669)', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)', '&:hover': { background: 'linear-gradient(to right, #059669, #047857)', transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)' } }}>
                          <i className="fas fa-file-excel me-2"></i> Export BOM
                        </Button>
                        <Button onClick={handleExportRouting} variant="contained" sx={{ height: '38px', whiteSpace: 'nowrap', borderRadius: '8px', textTransform: 'none', fontWeight: 600, background: 'linear-gradient(to right, #10b981, #059669)', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)', '&:hover': { background: 'linear-gradient(to right, #059669, #047857)', transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)' } }}>
                          <i className="fas fa-file-excel me-2"></i> Export Routing
                        </Button>
                      </Box>
                    </Box>
                  </div>

                  {/* Table */}
                  {/* <div className="BomRoutingTable mt-2">
                    <div className="">
                      <div className="card-body p-0">
                        <div className="table-responsive">
                          <table className="table table-hover mb-0">
                            <TableHead>
                              <tr>
                                <TableCell sx={{ whiteSpace: 'nowrap', backgroundColor: '#f8fafc', color: '#475569', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', padding: '16px' }}>Sr</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap', backgroundColor: '#f8fafc', color: '#475569', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', padding: '16px' }}>Part Number</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap', backgroundColor: '#f8fafc', color: '#475569', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', padding: '16px' }}>Item ID</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap', backgroundColor: '#f8fafc', color: '#475569', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', padding: '16px' }}>Part Codes</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap', backgroundColor: '#f8fafc', color: '#475569', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', padding: '16px' }}>Description</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap', backgroundColor: '#f8fafc', color: '#475569', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', padding: '16px' }}>Operations</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap', backgroundColor: '#f8fafc', color: '#475569', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', padding: '16px' }}>BOM Types</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap', backgroundColor: '#f8fafc', color: '#475569', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', padding: '16px' }}>QC Status</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap', backgroundColor: '#f8fafc', color: '#475569', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', padding: '16px' }}>Summary</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap', backgroundColor: '#f8fafc', color: '#475569', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', padding: '16px' }}>Actions</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap', backgroundColor: '#f8fafc', color: '#475569', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', padding: '16px' }}>Delete</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {renderTableRows()}
                            </TableBody>
                          
                        </Table>
                      </TableContainer>
                    </Paper>
                  </div>
   */}

                  {/* New Table with requested fields */}
                  
                  <div className="BomRoutingTable mt-4 px-3">
                    <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', mb: 4 }}>
                      <TableContainer sx={{ maxHeight: 600, '&::-webkit-scrollbar': { height: 8, width: 8 }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#cbd5e1', borderRadius: 4 } }}>
                        <Table stickyHeader size="small" sx={{ tableLayout: 'fixed' }}>
  
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ width: '4%', whiteSpace: 'normal', backgroundColor: '#f8fafc', color: '#475569', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', padding: '16px' }}>sr</TableCell>
                                <TableCell sx={{ width: '12%', whiteSpace: 'normal', backgroundColor: '#f8fafc', color: '#475569', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', padding: '16px' }}>item no</TableCell>
                                <TableCell sx={{ width: '12%', whiteSpace: 'normal', backgroundColor: '#f8fafc', color: '#475569', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', padding: '16px' }}>item code</TableCell>
                                <TableCell sx={{ width: '25%', whiteSpace: 'normal', backgroundColor: '#f8fafc', color: '#475569', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', padding: '16px' }}>item description</TableCell>
                                {/* <TableCell sx={{ width: '7%', whiteSpace: 'normal', backgroundColor: '#f8fafc', color: '#475569', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', padding: '16px' }}>NPD</TableCell>
                                <TableCell sx={{ width: '8%', whiteSpace: 'normal', backgroundColor: '#f8fafc', color: '#475569', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', padding: '16px' }}>Auth</TableCell> */}
                                <TableCell sx={{ width: '10%', whiteSpace: 'normal', backgroundColor: '#f8fafc', color: '#475569', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', padding: '16px' }}>User</TableCell>
                                <TableCell sx={{ width: '8%', whiteSpace: 'normal', backgroundColor: '#f8fafc', color: '#475569', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', padding: '16px' }}>View</TableCell>
                                <TableCell sx={{ width: '8%', whiteSpace: 'normal', backgroundColor: '#f8fafc', color: '#475569', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', padding: '16px' }}>Action</TableCell>
                                <TableCell sx={{ width: '6%', whiteSpace: 'normal', backgroundColor: '#f8fafc', color: '#475569', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', padding: '16px' }}>Delete</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {renderNewTableRows()}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Paper>
                      
                      {Object.keys(getFilteredData()).length > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                          <Pagination 
                            count={Math.ceil(Object.keys(getFilteredData()).length / 10)} 
                            page={currentPage} 
                            onChange={(e, value) => setCurrentPage(value)} 
                            color="primary" 
                            shape="rounded"
                            size="small"
                          />
                        </div>
                      )}
                    </div>

                  {/* Footer */}
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, px: 2 }}>
                    <div className="record-count fw-bold" style={{ marginLeft: "15px" }}>
                      Total Record : <span className="badge bg-primary text-white fs-6" style={{ padding: "0.35em 0.65em" }}>{totalItems}</span>
                    </div>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b' }}>
                      Format: <strong style={{ color: '#6366f1' }}>PDF</strong>
                    </Typography>
                  </Box>
  
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>


      <style jsx>{`
        .detail-row {
          font-size: 0.9em;
        }
        .main-row:hover {
          background-color: #f8f9fa;
        }
        .badge {
          font-size: 0.75em;
        }
          .btn {
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
}

        .btn-link {
          color: #6c757d;
          text-decoration: none;
        }
        .btn-link:hover {
          color: #495057;
        }
      `}</style>
    </div>
  );
};

export default BomRouting;