import axios from "axios";

const BASE_URL = "https://sellerp-backend.onrender.com/Settings/";
// const BASE_URL = "api/Settings/";

// Fetch all users
export const getUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}User_RUD/users/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

// Update a user
export const updateUser = async (id, updatedData) => {
  try {
    const response = await axios.put(`${BASE_URL}User_RUD/users/${id}/`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Delete a user
export const deleteUser = async (id) => {
  try {
    await axios.delete(`${BASE_URL}User_RUD/users/${id}/`);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

  
export const registerUser = async (userData) => {
    try {
      const response = await axios.post(`${BASE_URL}api/register/`, userData);
      return response.data; // return the response data if needed
    } catch (error) {
      console.error("Error registering user:", error);
      throw error; // Re-throw the error to be handled by the calling component
    }
  };


  //Login


// Login API integration
export const loginUser = async (username, password, year) => {
  try {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };
    const csrfToken = getCookie("csrftoken");

    const headers = {
      "Content-Type": "application/json",
      ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
    };

    const response = await axios.post(`${BASE_URL}api/login/`, {
      username,
      password,
      year,
    }, {
      headers,
    });

    // Return the response data
    return response.data;
  } catch (error) {
    // Handle errors and rethrow them for the calling function to manage
    console.error("Error logging in:", error);
    throw error.response?.data || error.message || "Error logging in.";
  }
};

  
  // user client
  export const fetchUsersDropdown = async () => {
    try {
      const response = await axios.get(`${BASE_URL}api/users-dropdown/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error; // Let the caller handle the error
    }
  };
  
  // Assign permissions
  export const assignPermissions = async (userId, modulesToSubmit) => {
    const token = localStorage.getItem("accessToken");
  
    if (!token) {
      throw new Error("Authentication token not found. Please login again.");
    }
  
    try {
      const response = await axios.post(
        `${BASE_URL}api/assign-permission/`,
        {
          id: userId,
          modules: modulesToSubmit,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error in assignPermissions API:", error);
      throw error;
    }
  };
  

  // Financial Year
  // Function to create a new financial year
export const createFinancialYear = async (financialYearData) => {
  try {
    const response = await axios.post(`${BASE_URL}financial_years/`, financialYearData);
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error creating financial year:", error);
    throw error; // Re-throw the error for the calling component to handle
  }
};

// Function to fetch all financial years
export const getFinancialYears = async () => {
  try {
    const response = await axios.get(`${BASE_URL}financial_years/`);
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error fetching financial years:", error);
    throw error; // Re-throw the error for the calling component to handle
  }
};

export const deleteFinancialYear = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}financial_years/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting financial year:", error);
    throw error;
  }
};

export const getDefaultRoute = (permissions, username) => {
  const uname = (username || "").trim().toLowerCase();
  const isAdmin = uname === "admin" || uname === "prashant" || permissions?.role === "admin" || permissions === "all";
  if (isAdmin) return "/dashboard";

  if (!permissions || typeof permissions !== "object") return "/";

  if (permissions.Dashboard && permissions.Dashboard.length > 0) {
    return "/dashboard";
  }

  if (permissions.Store && permissions.Store.length > 0) {
    if (permissions.Store.includes("Gate Inward Entry")) return "/Gate-Inward-Entry";
    if (permissions.Store.includes("Subcon GRN")) return "/Subcon-Grn";
    if (permissions.Store.includes("57F4 Inward Challan")) return "/Inward-challan";
    if (permissions.Store.includes("Purchase GRN")) return "/Purchase-Grn";
    if (permissions.Store.includes("New MRN")) return "/New-Mrn";
    if (permissions.Store.includes("Material Issue Challan")) return "/Material-Issue-Challan";
    if (permissions.Store.includes("Delivery Challan")) return "/Delivery-Challan";
    return "/Gate-Inward-Entry";
  }

  if (permissions.Purchase && permissions.Purchase.length > 0) {
    if (permissions.Purchase.includes("New Purchase Order")) return "/new-purchase-order";
    if (permissions.Purchase.includes("New Indent")) return "/new-indent";
    if (permissions.Purchase.includes("Purchase Order List")) return "/purchase-order-list";
    if (permissions.Purchase.includes("Jobwork Purchase Order List")) return "/jobwork-purchase-order-list";
    return "/new-purchase-order";
  }

  if (permissions.Sales && permissions.Sales.length > 0) {
    if (permissions.Sales.includes("Customer Sales Order")) return "/CustSalesOrderList";
    if (permissions.Sales.includes("Customer Order List")) return "/CustSalesOrderList";
    if (permissions.Sales.includes("Tax Invoice List")) return "/tax-invoice-list";
    if (permissions.Sales.includes("JobWork Invoice List")) return "/JobworkInvList";
    if (permissions.Sales.includes("Outward Challan List")) return "/OutwardChallanList";
    return "/CustSalesOrderList";
  }

  if (permissions.Production && permissions.Production.length > 0) {
    if (permissions.Production.includes("Work Order Entry")) return "/WorkOrderEntry";
    if (permissions.Production.includes("Work Order List")) return "/WorkOrderList";
    return "/WorkOrderEntry";
  }

  if (permissions.ProductionV2 && permissions.ProductionV2.length > 0) {
    return "/ContractorWorkOrderList";
  }

  if (permissions.Quality && permissions.Quality.length > 0) {
    if (permissions.Quality.includes("Purchase GRN QC")) return "/PandingQCList";
    return "/PandingQCList";
  }

  if (permissions.Accounts && permissions.Accounts.length > 0) {
    if (permissions.Accounts.includes("Purchase Bill")) return "/purchase-bill";
    if (permissions.Accounts.includes("GL Master")) return "/gl-master";
    if (permissions.Accounts.includes("Tax Invoice List")) return "/tax-invoice-list";
    return "/gl-master";
  }

  if (permissions.Planning && permissions.Planning.length > 0) {
    return "/ManufacturingOrder";
  }

  if (permissions.Maintenance && permissions.Maintenance.length > 0) {
    return "/asset-list";
  }

  if (permissions.All_Masters && permissions.All_Masters.length > 0) {
    if (permissions.All_Masters.includes("Item Master")) return "/item-master";
    if (permissions.All_Masters.includes("Customer")) return "/Customer";
    if (permissions.All_Masters.includes("GST Rate Master")) return "/gst-rate-master";
    return "/item-master";
  }

  if (permissions.ERPSetting && permissions.ERPSetting.length > 0) {
    return "/ErpSetting";
  }

  if (permissions.VendorsUserManagement && permissions.VendorsUserManagement.length > 0) {
    return "/mainpage";
  }

  return "/";
};

