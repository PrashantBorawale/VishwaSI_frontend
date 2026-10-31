// src/services/api.jsx

import axios from "axios";

// Automatically attach Bearer auth token and CSRF token to ALL axios requests across the entire application
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token") || localStorage.getItem("authToken");
  if (token && !config.headers["Authorization"]) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };
  const csrfToken = getCookie("csrftoken");
  if (csrfToken && !config.headers["X-CSRFToken"]) {
    config.headers["X-CSRFToken"] = csrfToken;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


// Define base URLs
const BASE_URL = "https://sellerp-backend.onrender.com/All_Masters/";
// const BASE_URL = "api/All_Masters/";
const TAX_CODE_URL = `${BASE_URL}Tax_Code/`;
const GST_MASTER_URL = `${BASE_URL}GST_Master/`;
const CUT_WISE_URL = `${BASE_URL}Cut_Wise/`;
const UPLOAD_URL = `${BASE_URL}upload/`;


// Home


const BASE_URL1 = "https://sellerp-backend.onrender.com/";
// const BASE_URL1 = "api";


export async function postRequest(endpoint, data) {
  try {
    const response = await fetch(`${BASE_URL1}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData };
    }

    const responseData = await response.json();
    return { data: responseData };
  } catch (error) {
    return { error: error.message };
  }
}

export const saveBusiness = async (data) => {

  try {
    const response = await fetch(`${BASE_URL1}/master/Business_Partner/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Failed to post data: ${error.message}`);
  }
};

// GST Master
const getAuthConfig = () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("Authentication token not found. Please login again.");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const fetchGstMasterRecords = async () => {
  try {
    const config = getAuthConfig();
    const response = await axios.get(GST_MASTER_URL, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching GST Master records:", error.message);
    throw new Error("Error fetching GST Master records");
  }
};

export const createGstMasterRecord = async (data) => {
  try {
    const config = getAuthConfig();
    const response = await axios.post(GST_MASTER_URL, data, config);
    return response.data;
  } catch (error) {
    console.error("Error creating GST Master record:", error.message);
    throw new Error("Error creating GST Master record");
  }
};

export const updateGstMasterRecord = async (id, data) => {
  try {
    const config = getAuthConfig();
    const response = await axios.put(`${GST_MASTER_URL}${id}/`, data, config);
    return response.data;
  } catch (error) {
    console.error("Error updating GST Master record:", error.message);
    throw new Error("Error updating GST Master record");
  }
};

export const deleteGstMasterRecord = async (id) => {
  try {
    const config = getAuthConfig();
    await axios.delete(`${GST_MASTER_URL}${id}/`, config);
  } catch (error) {
    console.error("Error deleting GST Master record:", error.message);
    throw new Error("Error deleting GST Master record");
  }
};

// Tax Code Master
export const getTaxCodes = async () => {
  try {
    const response = await axios.get(TAX_CODE_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching tax codes:", error);
    throw error;
  }
};

export const getTaxCodeById = async (id) => {
  try {
    const response = await axios.get(`${TAX_CODE_URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tax code by ID:", error);
    throw error;
  }
};

export const createTaxCode = async (taxCodeData) => {
  try {
    const response = await axios.post(TAX_CODE_URL, taxCodeData);
    return response.data;
  } catch (error) {
    console.error("Error creating tax code:", error);
    throw error;
  }
};

export const updateTaxCode = async (id, taxCodeData) => {
  try {
    const response = await axios.put(`${TAX_CODE_URL}${id}/`, taxCodeData);
    return response.data;
  } catch (error) {
    console.error("Error updating tax code:", error);
    throw error;
  }
};

export const deleteTaxCode = async (id) => {
  try {
    await axios.delete(`${TAX_CODE_URL}${id}/`);
  } catch (error) {
    console.error("Error deleting tax code:", error);
    throw error;
  }
};

// Cutwise
const CutwiseApi = {
  get: async () => {
    try {
      const response = await axios.get(CUT_WISE_URL);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  post: async (data) => {
    try {
      const response = await axios.post(CUT_WISE_URL, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  put: async (id, data) => {
    try {
      const response = await axios.put(`${CUT_WISE_URL}${id}/`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await axios.delete(`${CUT_WISE_URL}${id}/`);
    } catch (error) {
      throw error;
    }
  },
};

export default CutwiseApi;

// upload master

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(UPLOAD_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Upload error details:", error.response || error.message);
    throw new Error("Error uploading file");
  }
};

// Supplier Customer Master



// Supplier Customer
export const getNextNumber = async (type) => {
  try {
    const response = await axios.get(`${BASE_URL}get-next-item-number/?type=${type}`);
    return response.data.next_number;
  } catch (error) {
    console.error("Error fetching next item number:", error);
    return "";
  }
};

// Function to save supplier/customer data
export const SuplliersaveData = async (data) => {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("Authentication token not found. Please login again.");
    }

    const response = await fetch(`${BASE_URL}api/SupplierData/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error Response:", errorData);
      throw new Error(errorData.detail || "Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting form:", error);
    return { status: false, message: error.message };
  }
};

// Function to get supplier/customer data by ID
export const getSupplierDataById = async (id) => {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("Authentication token not found. Please login again.");
    }

    const response = await fetch(`${BASE_URL}api/SupplierData/${id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching supplier data:", error);
    return { status: false, message: error.message };
  }
};
export const getSupplierData = async (searchTerm) => {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("Authentication token not found. Please login again.");
    }

    const response = await axios.get(`${BASE_URL}api/SupplierData/`, {
      params: { search: searchTerm },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching supplier data:", error);
    return [];
  }
};

// Function to update supplier/customer data
export const updateSupplierData = async (id, data) => {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("Authentication token not found. Please login again.");
    }

    const response = await fetch(`${BASE_URL}api/SupplierData/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating supplier data:", error);
    return { status: false, message: error.message };
  }
};


// Function to delete supplier/customer data
export const deleteSupplierData = async (id) => {
  try {
    const token = localStorage.getItem("access")

    const response = await fetch(`${BASE_URL}api/SupplierData/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || "Network response was not ok")
    }

    return { status: true, message: "Supplier data deleted successfully" }
  } catch (error) {
    console.error("Error deleting supplier data:", error)
    return { status: false, message: error.message }
  }
}


// Supplier Vendor List
export const getSupplierCustomerData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}items/details/`);
    return response.data;
  } catch (error) {
    console.error("API call error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config,
    });
    throw error;
  }
};


export const getSupplierList = async () => {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("Authentication token not found. Please login again.");
    }

    const response = await fetch(`${BASE_URL}SupplierCustomerVendorList/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching supplier list:", error);
    throw error;
  }
};


// Supplier card 1

export const fetchCategories = async () => {
  const response = await fetch(`${BASE_URL}Type/`);
  if (!response.ok) throw new Error("Failed to fetch categories");
  return response.json();
};

export const addCategory = async (categoryName) => {
  const response = await fetch(`${BASE_URL}Type/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ Category_Name: categoryName }),
  });
  if (!response.ok) throw new Error("Failed to add category");
  return response.json();
};

export const updateCategory = async (id, categoryName) => {
  const response = await fetch(`${BASE_URL}Type/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ Category_Name: categoryName }),
  });
  if (!response.ok) throw new Error("Failed to update category");
  return response.json();
};

export const deleteCategory = async (id) => {
  const response = await fetch(`${BASE_URL}Type/${id}/`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete category");
};

// Fetch all cities
export const fetchCities = async () => {
  const response = await fetch(`${BASE_URL}City/`);
  if (!response.ok) throw new Error("Failed to fetch cities");
  return response.json();
};

export const addCity = async (cityName) => {
  const response = await fetch(`${BASE_URL}City/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ CityName: cityName }),
  });
  if (!response.ok) throw new Error("Failed to add city");
  return response.json();
};

export const updateCity = async (id, cityData) => {
  const response = await fetch(`${BASE_URL}City/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cityData),
  });
  if (!response.ok) throw new Error("Failed to update city");
  return response.json();
};

export const deleteCity = async (id) => {
  const response = await fetch(`${BASE_URL}City/${id}/`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete city");
  return response;
};

//card country


export const addCountry = async (code, country) => {
  const response = await axios.post(`${BASE_URL}Country/`, {
    Code: code,
    Country: country,
  });
  return response.data;
};

export const updateCountry = async (id, code, country) => {
  const response = await axios.put(`${BASE_URL}Country/${id}/`, {
    Code: code,
    Country: country,
  });
  return response.data;
};

export const deleteCountry = async (id) => {
  const response = await axios.delete(`${BASE_URL}Country/${id}/`);
  return response.data;
};

// card currency
export const fetchCurrencies = async () => {
  const response = await axios.get(`${BASE_URL}Currency/`);
  return response.data;
};

export const addCurrency = async (code, symbol, description) => {
  const response = await axios.post(`${BASE_URL}Currency/`, {
    Code: code,
    Symbol: symbol,
    Description: description,
  });
  return response.data;
};

export const updateCurrency = async (id, code, symbol, description) => {
  const response = await axios.put(`${BASE_URL}Currency/${id}/`, {
    Code: code,
    Symbol: symbol,
    Description: description,
  });
  return response.data;
};

export const deleteCurrency = async (id) => {
  const response = await axios.delete(`${BASE_URL}Currency/${id}/`);
  return response.data;
};

// card group
export const fetchGroups = async () => {
  const response = await axios.get(`${BASE_URL}Group/`);
  return response.data;
};

export const addGroup = async (prefix, group) => {
  const response = await axios.post(`${BASE_URL}Group/`, {
    Prefix: prefix,
    Group: group,
  });
  return response.data;
};

export const updateGroup = async (id, prefix, group) => {
  const response = await axios.put(`${BASE_URL}Group/${id}/`, {
    Prefix: prefix,
    Group: group,
  });
  return response.data;
};

export const deleteGroup = async (id) => {
  const response = await axios.delete(`${BASE_URL}Group/${id}/`);
  return response.data;
};

// card payment
export const fetchPaymentTerms = async () => {
  const response = await axios.get(`${BASE_URL}Payment_Term/`);
  return response.data;
};
export const addPaymentTerm = async (days) => {
  try {
    // Log the data to be sent
    console.log("Sending data:", { Days: days });

    const response = await axios.post(`${BASE_URL}Payment_Term/`, {
      Days: days,
    });

    // Log the response from the server
    console.log("Response data:", response.data);
    return response.data;

  } catch (error) {
    // Log the error response from the server
    console.error("Error response:", error.response);
    throw error;
  }
};


export const updatePaymentTerm = async (id, days) => {
  try {
    const response = await axios.put(`${BASE_URL}Payment_Term/${id}/`, {
      Days: days,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating payment term:", error.response);
    throw error;
  }
};


export const deletePaymentTerm = async (id) => {
  const response = await axios.delete(`${BASE_URL}Payment_Term/${id}/`);
  return response.data;
};

// card region

export const fetchRegions = async () => {
  const response = await axios.get(`${BASE_URL}Region/`);
  return response.data;
};

export const addRegion = async (regionCode, regionName) => {
  const response = await axios.post(`${BASE_URL}Region/`, {
    RegionCode: regionCode,
    RegionName: regionName,
  });
  return response.data;
};

export const updateRegion = async (id, regionCode, regionName) => {
  const response = await axios.put(`${BASE_URL}Region/${id}/`, {
    RegionCode: regionCode,
    RegionName: regionName,
  });
  return response.data;
};

export const deleteRegion = async (id) => {
  const response = await axios.delete(`${BASE_URL}Region/${id}/`);
  return response.data;
};

// card sector
export const fetchSectors = async () => {
  const response = await axios.get(`${BASE_URL}Sector/`);
  return response.data;
};

export const addSector = async (sectorPrefix, sectorName) => {
  const response = await axios.post(`${BASE_URL}Sector/`, {
    Sector_Prefix: sectorPrefix,
    SectorName: sectorName,
  });
  return response.data;
};

export const updateSector = async (id, sectorPrefix, sectorName) => {
  const response = await axios.put(`${BASE_URL}Sector/${id}/`, {
    Sector_Prefix: sectorPrefix,
    SectorName: sectorName,
  });
  return response.data;
};

export const deleteSector = async (id) => {
  const response = await axios.delete(`${BASE_URL}Sector/${id}/`);
  return response.data;
};

// ccard statecode1
export const fetchStates = async () => {
  try {
    const response = await axios.get(`${BASE_URL}StateCode/`);
    return response.data; // Ensure this returns an array of state objects
  } catch (error) {
    throw new Error("Failed to fetch states");
  }
};

export const addState = async (stateName, stateNoNumeric, stateCodeAlpha) => {
  try {
    const response = await axios.post(`${BASE_URL}StateCode/`, {
      StateName: stateName,
      State_No_Numeric: stateNoNumeric,
      State_Code_Alpha: stateCodeAlpha,
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to add state");
  }
};

export const updateState = async (
  id,
  stateName,
  stateNoNumeric,
  stateCodeAlpha
) => {
  try {
    const response = await axios.put(`${BASE_URL}StateCode/${id}/`, {
      StateName: stateName,
      State_No_Numeric: stateNoNumeric,
      State_Code_Alpha: stateCodeAlpha,
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to update state");
  }
};

export const deleteState = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}StateCode/${id}/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete state");
  }
};

// QUMC Code
export const fetchQMSCodes = async () => {
  const response = await axios.get(`${BASE_URL}QMSC_Code/`);
  return response.data;
};

export const addQMSCode = async (code, desc) => {
  const response = await axios.post(`${BASE_URL}QMSC_Code/`, {
    QMSC_Code: code,
    QMSC_Code_Desc: desc,
  });
  return response.data;
};

export const updateQMSCode = async (id, code, desc) => {
  const response = await axios.put(`${BASE_URL}QMSC_Code/${id}/`, {
    QMSC_Code: code,
    QMSC_Code_Desc: desc,
  });
  return response.data;
};

export const deleteQMSCode = async (id) => {
  const response = await axios.delete(`${BASE_URL}QMSC_Code/${id}/`);
  return response.data;
};

// Item Cross Reference

export const postItemCrossReference = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}Item_Cross/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Failed to post data: ${error.message}`);
  }
};

// Cross reference supplier item

export const postSupplierItem = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}Supplier_Item/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error during API call:", error);
    throw error;
  }
};

// Cross reference customer -item -wise

export const saveItemRate = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}Item_VA_Rate/`, data);

    return response.data;
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    if (error.response && error.response.data) {
      console.log(error.response.data.message || "Failed to save data");
    } else {
      console.log("An unexpected error occurred");
    }
    throw error; // Rethrow error to handle it in the component if needed
  }
};

export const saveCycleTimeData = async (data) => {
  const response = await axios.post(`${BASE_URL}Cycle_Time_Master/`, data);
  return response.data;
};


export const fetchCycleTimeList = async () => {
  const response = await axios.get(`${BASE_URL}Cycle_Time_Master/`);
  return response.data;
};


export const updateCycleTimeData = async (id, data) => {
  const response = await axios.put(`${BASE_URL}Cycle_Time_Master/${id}/`, data);
  return response.data;
};

export const deleteCycleTimeData = async (id) => {
  const response = await axios.delete(`${BASE_URL}Cycle_Time_Master/${id}/`);
  return response.data;
};

export const fetchWorkCenterData = async () => {
  const response = await axios.get(`${BASE_URL}Work_Center/`);
  return response.data;
};

export const fetchBomItems = async () => {
  const response = await axios.get(`${BASE_URL}api/bom-items/`);
  return response.data;
};


// Work Center add new
export const saveWorkCenter = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}Work_Center/`, data);

    console.log("Work Center saved successfully");
    return response.data;
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    if (error.response && error.response.data) {
      console.log(error.response.data.message || "Failed to save data");
    } else {
      console.log("An unexpected error occurred");
    }
    throw error; // Rethrow error to handle it in the component if needed
  }
};

// work center ke andar card card ke card

export const saveMachineGroupData = async (data) => {
  try {
    const response = await axios.post(
      `${BASE_URL}Machine_Group_Work_Center/`,
      data
    );
    console.log("Machine Group saved successfully");
    return response.data; // Adjust based on API response structure
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    if (error.response && error.response.data) {
      console.log(error.response.data.message || "Failed to save data");
    } else {
      console.log("An unexpected error occurred");
    }
    throw new Error("Error saving machine group data");
  }
};

//Work center master card

export const saveWorkCenterTypeGroupData = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}WorkCenterTypeGroup/`, data);
    console.log("data save");
    return response.data;
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    if (error.response && error.response.data) {
      console.log(error.response.data.message || "Failed to save data");
    } else {
      console.log("An unexpected error occurred");
    }
    throw error;
  }
};


/// ✅ Update WorkCenter Type Group by ID
export const updateWorkCenterTypeGroupData = async (id, data) => {
  try {
    const response = await axios.put(`${BASE_URL}WorkCenterTypeGroup/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating data:", error);
    throw error;
  }
};

// ✅ Fetch WorkCenter Type Group List with Pagination
export const fetchWorkCenterTypeGroupList = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}WorkCenterTypeGroup/`
    );
    return response;
  } catch (error) {
    console.error("Error fetching list:", error);
    throw error;
  }
};

// ✅ Get Single WorkCenter Type Group by ID
export const getWorkCenterTypeGroupById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}WorkCenterTypeGroup/${id}/`);
    return response;
  } catch (error) {
    console.error("Error fetching by ID:", error);
    throw error;
  }
};

// ✅ Delete WorkCenter Type Group by ID
export const deleteWorkCenterTypeGroup = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}WorkCenterTypeGroup/${id}/`);
    return response;
  } catch (error) {
    console.error("Error deleting:", error);
    throw error;
  }
};

export const getMachineTypes = async () => {
  try {
    const response = await fetch(`${BASE_URL}Machine_Group_Work_Center/`);
    if (!response.ok) throw new Error("Failed to fetch machine types");
    const data = await response.json();
    return data.filter((item) => item.EnterType !== null); // Filter out null values
  } catch (error) {
    console.error("Error fetching machine types:", error);
    return [];
  }
};

// shift master
export const saveShiftMaster = async (data, id = null) => {
  const url = id ? `${BASE_URL}Shift_Master/${id}/` : `${BASE_URL}Shift_Master/`;
  const method = id ? "PUT" : "POST";
  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to save data");
  }

  return response.json();
};

export const fetchShiftMasters = async () => {
  const response = await fetch(`${BASE_URL}Shift_Master/`);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

export const deleteShiftMaster = async (id) => {
  const response = await fetch(`${BASE_URL}Shift_Master/${id}/`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete data");
  }
  return response;
};

// Operator Supplier Master add button

export const addOperator = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}Add_New_Operator/`, data);
    return response;
  } catch (error) {
    console.error("Error occurred while saving data:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    // Display detailed error message from response if available
    if (error.response && error.response.data) {
      console.log("Error Details:", error.response.data);
    } else {
      console.log("An unexpected error occurred:", error.message);
    }

    // Return a default message or rethrow the error
    throw new Error(error.response?.data?.message || "Failed to save data");
  }
};

// Operator  supplier master ke andar card
export const fetchDepartments = async () => {
  try {
    const response = await axios.get(`${BASE_URL}Department_Maste/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching departments:", error);
    throw error;
  }
};

export const addDepartment = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}Department_Maste/`, data);
    return response;
  } catch (error) {
    console.error("Error adding department:", error);
    throw error;
  }
};

export const editDepartment = async (id, data) => {
  try {
    const response = await axios.put(
      `${BASE_URL}Department_Maste/${id}/`,
      data
    );
    return response;
  } catch (error) {
    console.error("Error editing department:", error);
    throw error;
  }
};

export const deleteDepartment = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}Department_Maste/${id}/`);
    return response;
  } catch (error) {
    console.error("Error deleting department:", error);
    throw error;
  }
};

// card 2

export const fetchCompanyNames = async () => {
  try {
    const response = await axios.get(`${BASE_URL}Department_Category_Master/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching company names:", error);
    throw error;
  }
};

export const addCompanyName = async (data) => {
  try {
    const response = await axios.post(
      `${BASE_URL}Department_Category_Master/`,
      data
    );
    return response;
  } catch (error) {
    console.error("Error adding company name:", error);
    throw error;
  }
};

export const editCompanyName = async (id, data) => {
  try {
    const response = await axios.put(
      `${BASE_URL}Department_Category_Master/${id}/`,
      data
    );
    return response;
  } catch (error) {
    console.error("Error editing company name:", error);
    throw error;
  }
};

export const deleteCompanyName = async (id) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}Department_Category_Master/${id}/`
    );
    return response;
  } catch (error) {
    console.error("Error deleting company name:", error);
    throw error;
  }
};

// card 3
export const fetchTypes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}Designation_Api/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching types:", error);
    throw error;
  }
};

export const addType = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}Designation_Api/`, data);
    return response;
  } catch (error) {
    console.error("Error adding type:", error);
    throw error;
  }
};

export const editType = async (id, data) => {
  try {
    const response = await axios.put(`${BASE_URL}Designation_Api/${id}/`, data);
    return response;
  } catch (error) {
    console.error("Error editing type:", error);
    throw error;
  }
};

export const deleteType = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}Designation_Api/${id}/`);
    return response;
  } catch (error) {
    console.error("Error deleting type:", error);
    throw error;
  }
};

// Contractor api
export const fetchContractors = async () => {
  try {
    const response = await axios.get(`${BASE_URL}Contractor_Api/`);
    return response.data;
  } catch (error) {
    console.error("Error occurred while saving data:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    // Display detailed error message from response if available
    if (error.response && error.response.data) {
      console.log("Error Details:", error.response.data);
    } else {
      console.log("An unexpected error occurred:", error.message);
    }

    throw error;
  }
};

export const addContractor = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}Contractor_Master/`, data);
    return response;
  } catch (error) {
    console.error("Error occurred while saving data:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    // Display detailed error message from response if available
    if (error.response && error.response.data) {
      console.log("Error Details:", error.response.data);
    } else {
      console.log("An unexpected error occurred:", error.message);
    }

    throw error;
  }
};

export const fetchContractorMaster = async (searchQuery = "") => {
  try {
    const url = searchQuery ? `${BASE_URL}Contractor_Master/?q=${searchQuery}` : `${BASE_URL}Contractor_Master/`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteContractor = async (id) => {
  const response = await axios.delete(`${BASE_URL}Contractor_Master/${id}/`);
  return response.data;
};

export const updateContractor = async (id, updatedData) => {
  const response = await axios.put(`${BASE_URL}Contractor_Master/${id}/`, updatedData);
  return response.data;
};

// Unit Conversion

export const saveUnitConversion = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}Unit_Conversion/`, data);
    return response.data;
  } catch (error) {
    console.error("Error occurred while saving data:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    // Display detailed error message from response if available
    if (error.response && error.response.data) {
      console.log("Error Details:", error.response.data);
    } else {
      console.log("An unexpected error occurred:", error.message);
    }
    throw error;
  }
};

export const fetchUnitConversionData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}Unit_Conversion/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};



// Item Master NPD

export const addNPD = async (npd, customerName, npdQty, npdDueDate) => {
  const response = await axios.post(`${BASE_URL}NPD/`, {
    NPD: npd,
    CustomerName: customerName,
    NPD_Qty: npdQty,
    NPD_Due_Date: npdDueDate,
  });
  return response.data;
};

// Item Master technical
export const fetchSpecifications = async () => {
  const response = await axios.get(`${BASE_URL}Technical_Specification/`);
  return response.data;
};

export const addSpecification = async (specification, parameter) => {
  const response = await axios.post(`${BASE_URL}Technical_Specification/`, {
    Specification: specification,
    Parameter: parameter,
  });
  return response.data;
};

export const updateSpecification = async (id, specification, parameter) => {
  const response = await axios.put(
    `${BASE_URL}Technical_Specification/${id}/`,
    {
      Specification: specification,
      Parameter: parameter,
    }
  );
  return response.data;
};

export const deleteSpecification = async (id) => {
  const response = await axios.delete(
    `${BASE_URL}Technical_Specification/${id}/`
  );
  return response.data;
};

// Item master data 2
export const saveItemMasterData = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}Item_Master_Data2/`, data);
    return response.data;
  } catch (error) {
    console.error("Error occurred while saving data:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
    });

    // Display detailed error message from response if available
    if (error.response && error.response.data) {
      console.log("Error Details:", error.response.data);
    } else {
      console.log("An unexpected error occurred:", error.message);
    }
    throw error;
  }
};

// Item Master Gernal

export const saveItemMaster = async (formData, technicalSpecs, npdDetails, data2Fields, itemId = null) => {
  try {
    const token = localStorage.getItem("accessToken")

    if (!token) {
      throw new Error("Authentication token not found. Please login again.")
    }

    // Construct the complete data object with all tab data
    const completeData = {
      // General tab data (main form)
      ...formData,

      // Data-2 tab data
      item_master_data: {
        ...data2Fields,
      },

      // Technical Specification tab data
      technical_specifications: technicalSpecs || [],

      // NPD tab data
      npd_details: npdDetails || [],
    }

    console.log(`${itemId ? "Updating" : "Creating new"} item:`, completeData)

    // If itemId exists, use PUT to update, otherwise use POST to create
    const method = itemId ? "PUT" : "POST"
    const url = itemId
      ? `${BASE_URL}api/item-table/${itemId}/`
      : `${BASE_URL}api/item-table/`

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(completeData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("API Error Response:", errorData)
      throw new Error(errorData.detail || "Network response was not ok")
    }

    const result = await response.json()
    // Return success message with operation type
    return {
      status: true,
      message: `Item ${itemId ? "updated" : "created"} successfully!`,
      data: result
    }
  } catch (error) {
    console.error(`Error ${itemId ? "updating" : "submitting"} form:`, error)
    return { status: false, message: error.message }
  }
}

export const updateIItemData = async (id, data) => {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("Authentication token not found. Please login again.");
    }

    const response = await fetch(`${BASE_URL}api/item-table/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating supplier data:", error);
    return { status: false, message: error.message };
  }
};

export const getItemDataById = async (id) => {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("Authentication token not found. Please login again.");
    }

    const response = await fetch(`${BASE_URL}api/item-table/${id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching supplier data:", error);
    return { status: false, message: error.message };
  }
};


export const fetchItemFields = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}Fetch_Item_fields/?q=${query}`)
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching item fields:", error)
    throw error
  }
}


// Add transaction API functions
export const addTransaction = async (data) => {
  try {
    const token = localStorage.getItem("accessToken")
    const headers = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${BASE_URL}api/transaction/create2/`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error adding transaction:", error)
    throw error
  }
}

export const getTransaction = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}api/transaction2/${id}/`)
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error getting transaction:", error)
    throw error
  }
}

// Cost Center Master
export const saveCostCenter = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}Cost_Center/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to save data");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchCostCenters = async () => {
  try {
    const response = await fetch(`${BASE_URL}Cost_Center/`);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateCostCenter = async (id, data) => {
  try {
    const response = await fetch(`${BASE_URL}Cost_Center/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to update data");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteCostCenter = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}Cost_Center/${id}/`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete data");
    }

    // Check if response has content before parsing
    const text = await response.text();
    return text ? JSON.parse(text) : {};  // Avoids JSON parsing error

  } catch (error) {
    console.error("Delete Error:", error);
    throw error;
  }
};


// card1
export const saveCostCenterAdd = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}Cost_Center_Master_Add_New/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to save data");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchCostCentersAdd = async () => {
  try {
    const response = await fetch(`${BASE_URL}Cost_Center_Master_Add_New/`);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateCostCenterAdd = async (id, data) => {
  try {
    const response = await fetch(
      `${BASE_URL}Cost_Center_Master_Add_New/${id}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to update data");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteCostCenterAdd = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}Cost_Center_Master_Add_New/${id}/`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete data");
    }

    // Check if response has content before parsing
    const text = await response.text();
    return text ? JSON.parse(text) : {};  // Avoids JSON parsing error

  } catch (error) {
    console.error("Delete Error:", error);
    throw error;
  }
};


// Price Entry Component

export const fetchPriceListEntries = async () => {
  try {
    const response = await axios.get(`${BASE_URL}Price_List_Entry/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching price list entries:", error);
    throw error;
  }
};

export const savePriceListEntry = async (entry) => {
  try {
    await axios.post(`${BASE_URL}Price_List_Entry/`, entry);
  } catch (error) {
    console.error("Error saving price list entry:", error);
    throw error;
  }
};

export const updatePriceListEntry = async (id, entry) => {
  try {
    await axios.put(`${BASE_URL}Price_List_Entry/${id}/`, entry);
  } catch (error) {
    console.error("Error updating price list entry:", error);
    throw error;
  }
};

export const deletePriceListEntry = async (id) => {
  try {
    await axios.delete(`${BASE_URL}Price_List_Entry/${id}/`);
  } catch (error) {
    console.error("Error deleting price list entry:", error);
    throw error;
  }
};

// Price List Master
export const savePriceList = async (data) => {
  const response = await fetch(`${BASE_URL}Add_Price_List/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to save price list");
  }

  return response.json();
};

// Item card Main Group
export const saveMainGroup = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}api/maingroup/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to save data");
    return await response.json();
  } catch (error) {
    console.error("Error occurred while saving data:", error);
    throw error;
  }
};

export const getMainGroups = async () => {
  try {
    const response = await fetch(`${BASE_URL}api/maingroup/`);
    if (!response.ok) throw new Error("Failed to fetch data");
    return await response.json();
  } catch (error) {
    console.error("Error occurred while fetching data:", error);
    throw error;
  }
};

export const deleteMainGroup = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}api/maingroup/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete: ${response.statusText}`);
    }

    return true; // Return true to indicate success
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error;
  }
};

export const updateMainGroup = async (id, data) => {
  try {
    const response = await fetch(`${BASE_URL}api/maingroup/${id}/`, {
      method: "PUT", // Use PUT for updating
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update: ${response.statusText}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : true;
  } catch (error) {
    console.error("Error updating data:", error);
    throw error;
  }
};


// item group
export const saveItemGroup = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}api/itemgroup/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to save data");
    return await response.json();
  } catch (error) {
    console.error("Error occurred while saving data:", error);
    throw error;
  }
};

export const updateItemGroup = async (id, data) => {
  try {
    const response = await fetch(`${BASE_URL}api/itemgroup/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update data");
    const text = await response.text();
    return text ? JSON.parse(text) : true;
  } catch (error) {
    console.error("Error occurred while updating data:", error);
    throw error;
  }
};

export const getItemGroups = async () => {
  try {
    const response = await fetch(`${BASE_URL}api/itemgroup/`);
    if (!response.ok) throw new Error("Failed to fetch data");
    return await response.json();
  } catch (error) {
    console.error("Error occurred while fetching data:", error);
    throw error;
  }
};

export const deleteItemGroup = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}api/itemgroup/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete: ${response.statusText}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : { message: "Deleted successfully" };
  } catch (error) {
    console.error("Error occurred while deleting data:", error);
    throw error;
  }
};



// Part No
export const fetchNextPartNo = async (main_group, item_group) => {
  try {
    const response = await fetch(
      `${BASE_URL}generate-code/?subgroup_name=${main_group}&group_name=${item_group}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch next part number");
    }
    const data = await response.json();
    return data.generated_code;
  } catch (error) {
    console.error("Error fetching next part number:", error);
    throw error;
  }
};





// Unit Code
export const saveUnitCode = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}UnitCode/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to save data");
    return await response.json();
  } catch (error) {
    console.error("Error occurred while saving data:", error);
    throw error;
  }
};

export const getUnitCodes = async () => {
  try {
    const response = await fetch(`${BASE_URL}UnitCode/`);
    if (!response.ok) throw new Error("Failed to fetch data");
    return await response.json();
  } catch (error) {
    console.error("Error occurred while fetching data:", error);
    throw error;
  }
};

export const updateUnitCode = async (id, data) => {
  try {
    const response = await fetch(`${BASE_URL}UnitCode/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update data");
    const text = await response.text();
    return text ? JSON.parse(text) : true;
  } catch (error) {
    console.error("Error occurred while updating data:", error);
    throw error;
  }
};

export const deleteUnitCode = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}UnitCode/${id}/`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete data");
    const text = await response.text();
    return text ? JSON.parse(text) : true;
  } catch (error) {
    console.error("Error occurred while deleting data:", error);
    throw error;
  }
};

// Tdc
export const saveTdc = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}TDC/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to save data");
    return await response.json();
  } catch (error) {
    console.error("Error occurred while saving data:", error);
    throw error;
  }
};

export const getTdcs = async () => {
  try {
    const response = await fetch(`${BASE_URL}TDC/`);
    if (!response.ok) throw new Error("Failed to fetch data");
    return await response.json();
  } catch (error) {
    console.error("Error occurred while fetching data:", error);
    throw error;
  }
};

export const deleteTdc = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}TDC/${id}/`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete data");
    return await response.json();
  } catch (error) {
    console.error("Error occurred while deleting data:", error);
    throw error;
  }
};

// Store Location
export const saveStoreLocation = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}Store_Location/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to save data");
    return await response.json();
  } catch (error) {
    console.error("Error occurred while saving data:", error);
    throw error;
  }
};

export const updateStoreLocation = async (id, data) => {
  try {
    const response = await fetch(`${BASE_URL}Store_Location/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update data");
    const text = await response.text();
    return text ? JSON.parse(text) : true;
  } catch (error) {
    console.error("Error occurred while updating data:", error);
    throw error;
  }
};

export const getStoreLocations = async () => {
  try {
    const response = await fetch(`${BASE_URL}Store_Location/`);
    if (!response.ok) throw new Error("Failed to fetch data");
    return await response.json();
  } catch (error) {
    console.error("Error occurred while fetching data:", error);
    throw error;
  }
};

export const deleteStoreLocation = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}Store_Location/${id}/`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to delete data");

    // Don't try to parse JSON if there's no response body
    return true;
  } catch (error) {
    console.error("Error occurred while deleting data:", error);
    throw error;
  }
};


// Item master Sector

export const saveSector = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}Sector_Item/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to save data");
    return await response.json();
  } catch (error) {
    console.error("Error occurred while saving data:", error);
    throw error;
  }
};

export const updateSectorcard = async (id, data) => {
  try {
    const response = await fetch(`${BASE_URL}Sector_Item/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update data");
    const text = await response.text();
    return text ? JSON.parse(text) : true;
  } catch (error) {
    console.error("Error occurred while updating data:", error);
    throw error;
  }
};

export const getSectors = async () => {
  try {
    const response = await fetch(`${BASE_URL}Sector_Item/`);
    if (!response.ok) throw new Error("Failed to fetch data");
    return await response.json();
  } catch (error) {
    console.error("Error occurred while fetching data:", error);
    throw error;
  }
};

export const deleteSectorcard = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}Sector_Item/${id}/`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete data");
    const text = await response.text();
    return text ? JSON.parse(text) : true;
  } catch (error) {
    console.error("Error occurred while deleting data:", error);
    throw error;
  }
};

// Route
export const saveRoute = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}Route/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to save data");
    return await response.json();
  } catch (error) {
    console.error("Error occurred while saving data:", error);
    throw error;
  }
};

export const updateRoute = async (id, data) => {
  try {
    const response = await fetch(`${BASE_URL}Route/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update data");
    const text = await response.text();
    return text ? JSON.parse(text) : true;
  } catch (error) {
    console.error("Error occurred while updating data:", error);
    throw error;
  }
};

export const getRoutes = async () => {
  try {
    const response = await fetch(`${BASE_URL}Route/`);
    if (!response.ok) throw new Error("Failed to fetch data");
    return await response.json();
  } catch (error) {
    console.error("Error occurred while fetching data:", error);
    throw error;
  }
};

export const deleteRoute = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}Route/${id}/`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete data");
    const text = await response.text();
    return text ? JSON.parse(text) : true;
  } catch (error) {
    console.error("Error occurred while deleting data:", error);
    throw error;
  }
};

// Qty packing
export const saveQtyPack = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}Qty_Packing/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to save data");
    return await response.json();
  } catch (error) {
    console.error("Error occurred while saving data:", error);
    throw error;
  }
};

export const updateQtyPack = async (id, data) => {
  try {
    const response = await fetch(`${BASE_URL}Qty_Packing/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update data");
    return await response.json();
  } catch (error) {
    console.error("Error occurred while updating data:", error);
    throw error;
  }
};

export const getQtyPacks = async () => {
  try {
    const response = await fetch(`${BASE_URL}Qty_Packing/`);
    if (!response.ok) throw new Error("Failed to fetch data");
    return await response.json();
  } catch (error) {
    console.error("Error occurred while fetching data:", error);
    throw error;
  }
};

export const deleteQtyPack = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}Qty_Packing/${id}/`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete data");
    return await response.json();
  } catch (error) {
    console.error("Error occurred while deleting data:", error);
    throw error;
  }
};

//Item sector
export const saveItemSection = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}Item_Section/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to save data");
    return await response.json();
  } catch (error) {
    console.error("Error occurred while saving data:", error);
    throw error;
  }
};

export const updateItemSection = async (id, data) => {
  try {
    const response = await fetch(`${BASE_URL}Item_Section/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update data");
    const text = await response.text();
    return text ? JSON.parse(text) : true;
  } catch (error) {
    console.error("Error occurred while updating data:", error);
    throw error;
  }
};

export const getItemSections = async () => {
  try {
    const response = await fetch(`${BASE_URL}Item_Section/`);
    if (!response.ok) throw new Error("Failed to fetch data");
    return await response.json();
  } catch (error) {
    console.error("Error occurred while fetching data:", error);
    throw error;
  }
};

export const deleteItemSection = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}Item_Section/${id}/`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete data");
    const text = await response.text();
    return text ? JSON.parse(text) : true;
  } catch (error) {
    console.error("Error occurred while deleting data:", error);
    throw error;
  }
};


// Grade
export const saveGrade = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}Type_Grade_New/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to save data");
    return await response.json();
  } catch (error) {
    console.error("Error occurred while saving data:", error);
    throw error;
  }
};

export const updateGrade = async (id, data) => {
  try {
    const response = await fetch(`${BASE_URL}Type_Grade_New/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update data");
    const text = await response.text();
    return text ? JSON.parse(text) : true;
  } catch (error) {
    console.error("Error occurred while updating data:", error);
    throw error;
  }
};

export const getGrades = async () => {
  try {
    const response = await fetch(`${BASE_URL}Type_Grade_New/`);
    if (!response.ok) throw new Error("Failed to fetch data");
    return await response.json();
  } catch (error) {
    console.error("Error occurred while fetching data:", error);
    throw error;
  }
};

export const deleteGrade = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}Type_Grade_New/${id}/`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete data");
    const text = await response.text();
    return text ? JSON.parse(text) : true;
  } catch (error) {
    console.error("Error occurred while deleting data:", error);
    throw error;
  }
};

export const saveItem = async (item) => {
  const response = await fetch(`${BASE_URL}Sub_Group/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
  if (!response.ok) {
    throw new Error("Failed to save item");
  }
  return response.json();
};

// Get all items
export const getItems = async () => {
  const response = await fetch(`${BASE_URL}Sub_Group/`);
  if (!response.ok) {
    throw new Error("Failed to fetch items");
  }
  return response.json();
};

// Update existing item
export const updateItem = async (id, item) => {
  const response = await fetch(`${BASE_URL}Sub_Group/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
  if (!response.ok) {
    throw new Error("Failed to update item");
  }
  const text = await response.text();
  return text ? JSON.parse(text) : true;
};

// Delete an item
export const deleteItem = async (id) => {
  const response = await fetch(`${BASE_URL}Sub_Group/${id}/`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete item");
  }
};

export const saveParentFgCode = async (item) => {
  const response = await fetch(`${BASE_URL}Parent_FG_Code/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
  if (!response.ok) {
    throw new Error("Failed to save item");
  }
  return response.json();
};

// Get all items
export const getParentFgCodes = async () => {
  const response = await fetch(`${BASE_URL}Parent_FG_Code/`);
  if (!response.ok) {
    throw new Error("Failed to fetch items");
  }
  return response.json();
};

// Update existing item
export const updateParentFgCode = async (id, item) => {
  const response = await fetch(`${BASE_URL}Parent_FG_Code/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
  if (!response.ok) {
    throw new Error("Failed to update item");
  }
  const text = await response.text();
  return text ? JSON.parse(text) : true;
};

// Delete an item
export const deleteParentFgCode = async (id) => {
  const response = await fetch(`${BASE_URL}Parent_FG_Code/${id}/`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete item");
  }
};

export const saveMetalType = async (item) => {
  const response = await fetch(`${BASE_URL}MetalType/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
  if (!response.ok) {
    throw new Error("Failed to save item");
  }
  return response.json();
};

// Get all items
export const getMetalTypes = async () => {
  const response = await fetch(`${BASE_URL}MetalType/`);
  if (!response.ok) {
    throw new Error("Failed to fetch items");
  }
  return response.json();
};

// Update existing item
export const updateMetalType = async (id, item) => {
  const response = await fetch(`${BASE_URL}MetalType/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
  if (!response.ok) {
    throw new Error("Failed to update item");
  }
  const text = await response.text();
  return text ? JSON.parse(text) : true;
};

// Delete an item
export const deleteMetalType = async (id) => {
  const response = await fetch(`${BASE_URL}MetalType/${id}/`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete item");
  }
};

//Bom Routing Master
export const saveDepartment = async (item) => {
  const response = await fetch(`${BASE_URL}Production_Department/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
  if (!response.ok) {
    throw new Error("Failed to save department");
  }
  return response.json();
};

// Get all departments
export const getDepartments = async () => {
  const response = await fetch(`${BASE_URL}Production_Department/`);
  if (!response.ok) {
    throw new Error("Failed to fetch departments");
  }
  return response.json();
};

// Update existing department
export const updateDepartment = async (id, item) => {
  const response = await fetch(`${BASE_URL}Production_Department/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
  if (!response.ok) {
    throw new Error("Failed to update department");
  }
  return response.json();
};

// Delete a department
export const deleteDepartmentCard = async (id) => {
  const response = await fetch(`${BASE_URL}Production_Department/${id}/`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete department");
  }
};

// Bom
export const saveOperation = async (item) => {
  const response = await fetch(`${BASE_URL}Operation_Master/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
  if (!response.ok) {
    throw new Error("Failed to save operation");
  }
  return response.json();
};

// Get all operations
export const getOperations = async () => {
  const response = await fetch(`${BASE_URL}Operation_Master/`);
  if (!response.ok) {
    throw new Error("Failed to fetch operations");
  }
  return response.json();
};

// Update existing operation
export const updateOperation = async (id, item) => {
  const response = await fetch(`${BASE_URL}Operation_Master/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
  if (!response.ok) {
    throw new Error("Failed to update operation");
  }
  return response.json();
};

// Delete an operation
export const deleteOperation = async (id) => {
  const response = await fetch(`${BASE_URL}Operation_Master/${id}/`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete operation");
  }
};

// Bom Routing Std
export const saveStdRouting = async (item) => {
  const response = await fetch(`${BASE_URL}Std_Routing/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
  if (!response.ok) {
    throw new Error("Failed to save std routing");
  }
  return response.json();
};

// Get all std routings
export const getStdRoutings = async () => {
  const response = await fetch(`${BASE_URL}Std_Routing/`);
  if (!response.ok) {
    throw new Error("Failed to fetch std routings");
  }
  return response.json();
};

// Update existing std routing
export const updateStdRouting = async (id, item) => {
  const response = await fetch(`${BASE_URL}Std_Routing/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
  if (!response.ok) {
    throw new Error("Failed to update std routing");
  }
  return response.json();
};

// Delete a std routing
export const deleteStdRouting = async (id) => {
  const response = await fetch(`${BASE_URL}Std_Routing/${id}/`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete std routing");
  }
};

export const saveBomItemGroup = async (item) => {
  const response = await fetch(`${BASE_URL}Bom_Item_Group/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
  if (!response.ok) {
    throw new Error("Failed to save BOM item group");
  }
  return response.json();
};

// Get all BOM item groups
export const getBomItemGroups = async () => {
  const response = await fetch(`${BASE_URL}Bom_Item_Group/`);
  if (!response.ok) {
    throw new Error("Failed to fetch BOM item groups");
  }
  return response.json();
};

// Update existing BOM item group
export const updateBomItemGroup = async (id, item) => {
  const response = await fetch(`${BASE_URL}Bom_Item_Group/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
  if (!response.ok) {
    throw new Error("Failed to update BOM item group");
  }
  return response.json();
};

// Delete a BOM item group
export const deleteBomItemGroup = async (id) => {
  const response = await fetch(`${BASE_URL}Bom_Item_Group/${id}/`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete BOM item group");
  }
};


// region search
export const searchRegionByCode = async (code) => {
  try {
    const response = await axios.get(`${BASE_URL}?search=${code}`);
    return response.data;
  } catch (error) {
    console.error('Error searching for region:', error);
    throw error;
  }
};






// Supplier Fetch country
export const fetchCountries = async (searchTerm = '') => {
  try {
    const response = await fetch(`${BASE_URL}SupplierCountry/?search=${searchTerm}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch countries:', error);
    throw error;
  }
};

// Supplier Currency
export const fetchCurrencyCodes = async () => {
  try {
    const response = await fetch(`${BASE_URL}currency-codes/`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return [];
  }
};




// item master main group
export const fetchMainGroupData = async () => {
  try {
    const response = await fetch(`${BASE_URL}api/maingroup/`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Main Group data:", error);
    return null;
  }
};


// services
export const searchCrossRefSupplier = async (query) => {
  return await axios.get(`${BASE_URL}Cross_Ref_Supplier/?search=${query}`);
};

export const searchItemCrossItem = async (query) => {
  return await axios.get(`${BASE_URL}Item_Cross_Item/?search=${query}`);
};


// APi Item
export const fetchItems = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Authentication token not found. Please login again.");
  }

  try {
    const response = await axios.get(`${BASE_URL}api/item/summary/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};


export const fetchItemById = async (id) => {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("Authentication token not found. Please login again.");
    }

    const response = await fetch(`${BASE_URL}api/item-table/${id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching supplier data:", error);
    return { status: false, message: error.message };
  }
};
// State 
export const fetchStateData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}get-state-data/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching state data:", error);
    throw error;
  }
};

// Services/Api.jsx
export const fetchStateDetails = async (stateName) => {
  try {
    const response = await axios.get(`${BASE_URL}get-state-data/`, {
      params: { state: stateName },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for state ${stateName}:`, error);
    throw error;
  }
};


// unit code
export const getUnitCode = async () => {
  try {
    const response = await axios.get(`${BASE_URL}UnitCodeHardCoded/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching unit codes:', error);
    throw error;
  }
};



export const getNextCode = async (type) => {
  try {
    const response = await axios.get(`${BASE_URL}SupplierType/entity/${type}/`);
    return response.data.next_code;
  } catch (error) {
    throw new Error('Error fetching next code');
  }
};

export const saveData = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}SupplierType/entity/`, data);
    return response.data;
  } catch (error) {
    throw new Error('Error saving data');
  }
};



// Vendor Login 
// Services/Api.jsx

// const BASE_URL = "http://13.201.136.34:8000/";
// const BASE_URL = "api/";

export const loginVendor = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}vendor/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

// Dashboard
export const fetchVendorProfile = async () => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${BASE_URL}vendor/profile/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Include token for authorization
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error fetching profile data:", errorData); // Log detailed error
      throw new Error(errorData.detail || "Failed to fetch profile data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in fetchVendorProfile:", error); // Log error message
    throw new Error(error.message);
  }
};


// BOM
export const fetchScrapData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}FetchScrap/`)
    return response.data
  } catch (error) {
    console.error("Error fetching scrap data:", error)
    return []
  }
}

export const searchItems = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}api/item-search/?q=${query}`)
    return response.data
  } catch (error) {
    console.error("Error searching items:", error)
    return []
  }
}

const getBomAuthHeaders = () => {
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

export const saveBomItem = async (itemId, formData, editingId = null) => {
  try {
    console.log("API Call - Item ID:", itemId, "Form Data:", formData) // Debug log
    const headers = getBomAuthHeaders();

    if (editingId) {
      // Update existing record
      const response = await axios.put(`${BASE_URL}api/items/${itemId}/boms/${editingId}/`, formData, { headers })
      return response.data
    } else {
      // Create new record
      const response = await axios.post(`${BASE_URL}api/items/${itemId}/boms/`, formData, { headers })
      return response.data
    }
  } catch (error) {
    console.error("Error saving BOM data:", error)
    if (error.response) {
      console.error("Response data:", error.response.data)
      console.error("Response status:", error.response.status)
    }
    throw error
  }
}

export const deleteBomItem = async (itemId, bomId) => {
  try {
    const headers = getBomAuthHeaders();
    try {
      const response = await axios.delete(`${BASE_URL}api/items/${itemId}/boms/${bomId}/delete/`, { headers });
      return response.data;
    } catch (primaryError) {
      if (primaryError.response && (primaryError.response.status === 404 || primaryError.response.status === 405)) {
        // Fallback endpoint formats supported by different Django router configurations
        try {
          const res2 = await axios.delete(`${BASE_URL}api/items/${itemId}/boms/${bomId}/`, { headers });
          return res2.data;
        } catch (e2) {
          const res3 = await axios.delete(`${BASE_URL}bom/delete/${bomId}/`, { headers });
          return res3.data;
        }
      }
      throw primaryError;
    }
  } catch (error) {
    console.error("Error deleting BOM data:", error);
    throw error;
  }
}





export const getWorkCenters = async (machineType = "") => {
  try {
    const url = machineType && machineType !== "ALL" 
      ? `${BASE_URL}Work_Center/?q=${machineType}` 
      : `${BASE_URL}Work_Center/`;
    const response = await axios.get(url);
    console.log("API Response:", response.data);
    
    // Front-end fallback filter if backend doesn't support ?q= for this endpoint yet
    let data = response.data;
    if (machineType && machineType !== "ALL") {
      data = data.filter(item => item.WorkCenterType === machineType);
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching items:", error);
    return [];
  }
};


// Update work center
export const updateWorkCenter = async (id, updatedData) => {
  try {
    const response = await axios.put(`${BASE_URL}Work_Center/${id}/`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating work center:", error);
    throw error;
  }
};

// Delete work center
export const deleteWorkCenter = async (id) => {
  try {
    await axios.delete(`${BASE_URL}Work_Center/${id}/`);
  } catch (error) {
    console.error("Error deleting work center:", error);
    throw error;
  }
};

export const getOperatorList = async (nameQuery = "") => {
  const url = nameQuery ? `${BASE_URL}Add_New_Operator/?q=${nameQuery}` : `${BASE_URL}Add_New_Operator/`;
  const res = await axios.get(url);
  
  let data = res.data;
  if (nameQuery) {
    data = data.filter(item => item.Name && item.Name.toLowerCase().includes(nameQuery.toLowerCase()));
  }
  return data;
};

export const getOperatorById = async (id) => {
  const res = await axios.get(`${BASE_URL}Add_New_Operator/${id}/`);
  return res.data;
};

export const deleteOperator = async (id) => {
  const res = await axios.delete(`${BASE_URL}Add_New_Operator/${id}/`);
  return res.data;
};

export const updateOperator = async (id, data) => {
  const res = await axios.put(`${BASE_URL}Add_New_Operator/${id}/`, data);
  return res.data;
};



export const fetchoperationData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}api/operations/`)
    return response.data
  } catch (error) {
    console.error("Error fetching scrap data:", error)
    return []
  }
}


export const fetchCombinedPartNo = async (part_no, operation_name) => {
  try {
    const response = await axios.get(
      `${BASE_URL}api/combine-partno/?part_no=${part_no}&operation_name=${operation_name}`
    );
    return response.data.combined_part_no;
  } catch (error) {
    console.error("Error fetching combined part number:", error);
    return null;
  }
};


// Updated API functions for BOM Item Part Master
export const getBomItemsForSelectedItem = async (itemId) => {
  try {
    const headers = getBomAuthHeaders();
    const response = await axios.get(`${BASE_URL}BOM_ItemPartMaster/item/${itemId}/bom/`, { headers })
    console.log("BOM Items for selected item:", response.data)
    return response.data || []
  } catch (error) {
    console.error("Error fetching BOM items for selected item:", error)
    return []
  }
}

export const saveBomItemForSelectedItem = async (itemId, data) => {
  try {
    const headers = getBomAuthHeaders();
    const response = await axios.post(`${BASE_URL}BOM_ItemPartMaster/item/${itemId}/bom/`, data, { headers })
    console.log("Saved BOM item:", response.data)
    return response.data
  } catch (error) {
    console.error("Error saving BOM item:", error)
    throw error
  }
}

// Update BOM
export const updateBomItemForSelectedItem = async (itemId, bomId, data) => {
  try {
    const headers = getBomAuthHeaders();
    const response = await axios.put(`${BASE_URL}api/item/${itemId}/bom/${bomId}/`, data, { headers })
    console.log("Updated BOM item:", response.data)
    return response.data
  } catch (error) {
    console.error("Error updating BOM item:", error)
    throw error
  }
}

export const deleteBomItemForSelectedItem = async (itemId, bomId) => {
  try {
    const headers = getBomAuthHeaders();
    const response = await axios.delete(`${BASE_URL}api/item/${itemId}/bom/${bomId}/`, { headers })
    console.log("Deleted BOM item")
    return response.data
  } catch (error) {
    console.error("Error deleting BOM item:", error)
    throw error
  }
}


export const getRMItems = async (search) => {
  const res = await axios.get(`${BASE_URL}api/rm-items/?search=${search}`);
  return res.data;
};

export const getComItems = async (itemId, search) => {
  const res = await axios.get(`${BASE_URL}bom/simple-search/${itemId}/?search=${search}`);
  return res.data;
};


export const fetchPartCodeDropdownData = async (itemId) => {
  try {
    const response = await axios.get(`${BASE_URL}api/item/${itemId}/bom/dropdown/`)
    console.log("Part Code dropdown data:", response.data)
    return response.data || []
  } catch (error) {
    console.error("Error fetching part code dropdown data:", error)
    return []
  }
}


// Vender List Delete 

export const deleteSupplier = async (id) => {
  try {
    const response = await fetch(`https://sellerp-backend.onrender.com/All_Masters/supplier/delete/${id}`, {
      method: "DELETE",
    });

    return response.json();
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
};

// Item Master delete

export const deleteItemMaster = async (id) => {
  try {
    const response = await fetch(`https://sellerp-backend.onrender.com/All_Masters/item/delete/${id}`, {
      method: "DELETE",
    });

    return response.json();
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
};

// Subcon Jobwork Inward QC - V3
export const forceSaveSubconQC = async (data) => {
  const url = `https://sellerp-backend.onrender.com/Quality/subcon-jobwork-qc/`;
  console.log("!!! FORCING API CALL TO:", url);
  try {
    const token = localStorage.getItem("accessToken");
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    const contentType = response.headers.get("content-type");
    if (!response.ok) {
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || JSON.stringify(errorData));
      } else {
        const text = await response.text();
        console.error("Server HTML Error Response:", text);
        throw new Error(`Server returned ${response.status} ${response.statusText} at ${url}. Check console for details.`);
      }
    }

    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      const text = await response.text();
      return text;
    }
  } catch (error) {
    console.error("Error saving Subcon Jobwork QC (V3):", error);
    throw error;
  }
};

// Inward Test QC Number
export const fetchInwardTestQcNumber = async () => {
  const url = `https://sellerp-backend.onrender.com/Quality/inwardtest-qc-number/`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Server returned ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching Inward Test QC Number:", error);
    throw error;
  }
};
// Save QC Info
export const saveQCInfo = async (data) => {
  const url = `https://sellerp-backend.onrender.com/Quality/api/qcinfo/`;
  try {
    const token = localStorage.getItem("accessToken");
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMsg = "Failed to save QC report";
      try {
        const errorData = await response.json();
        errorMsg = errorData.detail || errorData.message || errorData.error || JSON.stringify(errorData) || errorMsg;
      } catch (e) {
        const text = await response.text();
        errorMsg = text || errorMsg;
      }
      throw new Error(errorMsg);
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving QC Info:", error);
    throw error;
  }
};

// Save Production QC Info
export const saveProductionQCInfo = async (data) => {
  const url = `${BASE_URL1}Production/api/production-entries/`;
  try {
    const token = localStorage.getItem("accessToken");
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMsg = "Failed to save data to production";
      try {
        const errorData = await response.json();
        errorMsg = errorData.detail || errorData.message || errorData.error || JSON.stringify(errorData) || errorMsg;
      } catch (e) {
        const text = await response.text();
        errorMsg = text || errorMsg;
      }
      throw new Error(errorMsg);
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving to production entries:", error);
    throw error;
  }
};

// Fetch Sales Returns
export const fetchSalesReturns = async (startDate, endDate, custName) => {
  const url = `${BASE_URL1}Sales/get/sales-return/?start_date=${startDate}&end_date=${endDate}&cust_name=${encodeURIComponent(custName)}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Server returned ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching Sales Returns:", error);
    throw error;
  }
};
