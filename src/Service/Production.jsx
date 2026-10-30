import axios from "axios";

const BASE_URL = "https://sellerp-backend.onrender.com/Production/";
// const BASE_URL = "api/Production/";

export const createWorkOrder = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}api/work-order-entry/`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating work order:", error.response?.data || error.message);
    throw error;
  }
};



  export const fetchNextWorkOrderNo = async (year) => {
    try {
      const response = await axios.get(`${BASE_URL}api/work_order_entry/?year=${year}`);
      return response.data.next_wo_no;
    } catch (error) {
      console.error("Error fetching next WO No:", error);
      throw error;
    }
  };


 
  export const saveContractorProduction = async (productionData) => {
    try {
      const response = await axios.post(`${BASE_URL}api/ProductionRecord/`, productionData, {
        headers: { "Content-Type": "application/json" },
      });
  
      return response.data;
    } catch (error) {
      console.error("Error saving production entry:", error.response?.data || error);
      throw error;
    }
  };
  


  

  export const getNextScrapRejectionNo = async (series, year) => {
    try {
      const response = await axios.get(`${BASE_URL}scrap_rejection_no/`, {
        params: { Shortyear: year, field: series }, // Ensure correct parameters
      });
  
      return response.data; // Expecting { "next_scrap_rejection_no": "Line R 242500002" }
    } catch (error) {
      console.error("Error fetching scrap rejection number:", error);
      throw error; // Rethrow error for handling in the calling component
    }
  };




// Function to submit the scrap rejection form data
export const submitScrapRejection = async (payload) => {
  try {
    const response = await axios.post(`${BASE_URL}scrap_rejection/`, payload);
    return response.data;
  } catch (error) {
    console.error("Error submitting data:", error);
    throw error; // Rethrow error for handling in the calling component
  }
};

// GET all scrap rejections
export const getScrapRejections = async () => {
  try {
    const response = await axios.get(`${BASE_URL}scrap_rejection/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data", error);
    return [];
  }
};

// POST a new scrap rejection
export const addScrapRejection = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}scrap_rejection/`, data);
    return response.data;
  } catch (error) {
    console.error("Error adding data", error);
    throw error;
  }
};

// DELETE a scrap rejection by id
export const deleteScrapRejection = async (id) => {
  try {
    await axios.delete(`${BASE_URL}scrap_rejection/${id}/`);
    return id;
  } catch (error) {
    console.error("Error deleting data", error);
    throw error;
  }
};



// Production

export const getProductionNumber = async (series, shortYear) => {
  try {
    // Adjust query parameters as required by your API
    const response = await axios.get(`${BASE_URL}api/production-entries/get_prod_no/`, {
      params: { series: series, year: shortYear },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching production number:", error);
    throw error; // Rethrow error for handling in the calling component
  }
};






export const createProductionEntry = async (productionData) => {
  try {
    const response = await fetch(`${BASE_URL}api/production-entries/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productionData),
    })

    if (!response.ok) {
      throw new Error("Failed to create production entry")
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating production entry:", error)
    throw error
  }
}


// Get a specific production entry by ID
export const getProductionId = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}api/production-entries/${id}/`)
    return response.data
  } catch (error) {
    console.error("Error fetching production entry:", error)
    throw error
  }
}

export const updateProduction = async (id, data) => {
  try {
    const response = await axios.put(`${BASE_URL}api/production-entries/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating production entry:", error);
    throw error;
  }
};

export const deleteProductionEntry = async (id) => {
  try {
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.delete(`${BASE_URL}api/production-entries/${id}/`, { headers });
    return response.data;
  } catch (error) {
    console.error("Error deleting production entry:", error);
    throw error;
  }
};

export const fetchHelpers = async () => {
  try {
    const response = await fetch(`${BASE_URL}Production_Helper/`);
    const data = await response.json();
    console.log("API Response for helpers:", data);

    // If data is already an array, use it directly
    const collection = Array.isArray(data) ? data : data.collection;

    if (!Array.isArray(collection)) {
      console.error("Invalid response format for helpers:", data);
      return [];
    }

    return collection.filter((item) => item.Name && item.Code);
  } catch (error) {
    console.error("Error fetching helpers:", error);
    return [];
  }
}

export const fetchUnitMachines = async () => {
  try {
    const response = await fetch(`${BASE_URL}Production_unitmachine/`);
    const data = await response.json();

    console.log("API Response for Unit Machines:", data);

    // If the response is an array, use it directly; otherwise, use `collection`
    const collection = Array.isArray(data) ? data : data.collection;

    if (!Array.isArray(collection)) {
      console.error("Invalid response format for unit machines:", data);
      return [];
    }

    return collection.filter((item) => item.WorkCenterCode && item.WorkCenterName);
  } catch (error) {
    console.error("Error fetching unit/machines:", error);
    return [];
  }
};


export const fetchContractors = async () => {
  try {
    const response = await fetch(`${BASE_URL}Production_contractor/`);
    const data = await response.json();

    console.log("API Response for Contractors:", data);

    const collection = Array.isArray(data) ? data : data.collection;

    if (!Array.isArray(collection)) {
      console.error("Invalid response format for contractors:", data);
      return [];
    }

    return collection.filter((item) => item.ContractorName);
  } catch (error) {
    console.error("Error fetching contractors:", error);
    return [];
  }
};



export const fetchOperators = async () => {
  try {
    const response = await fetch(`${BASE_URL}Production_operators/`);
    const data = await response.json();

    console.log("API Response for Operators:", data);

    const collection = Array.isArray(data) ? data : data.collection;

    if (!Array.isArray(collection)) {
      console.error("Invalid response format for operators:", data);
      return [];
    }

    return collection.filter((item) => item.Name && item.Code);
  } catch (error) {
    console.error("Error fetching operators:", error);
    return [];
  }
};



export const fetchSupervisors = async () => {
  try {
    const response = await fetch(`${BASE_URL}Production_supervisor/`);
    const data = await response.json();

    console.log("API Response for Supervisors:", data);

    const collection = Array.isArray(data) ? data : data.collection;

    if (!Array.isArray(collection)) {
      console.error("Invalid response format for supervisors:", data);
      return [];
    }

    return collection.filter((item) => item.Name && item.Code);
  } catch (error) {
    console.error("Error fetching supervisors:", error);
    return [];
  }
};



export const fetchShifts = async () => {
  try {
    const response = await fetch(`${BASE_URL}Production_shift/`);
    const data = await response.json();

    console.log("API Response for Shifts:", data);

    const collection = Array.isArray(data) ? data : data.collection;

    if (!Array.isArray(collection)) {
      console.error("Invalid response format for shifts:", data);
      return [];
    }

    return collection.filter((item) => item.Shift_Name && item.Shift_From && item.Shift_Till);
  } catch (error) {
    console.error("Error fetching shifts:", error);
    return [];
  }
};




export const fetchProductionEntries = async () => {
  try {
    const response = await axios.get(`${BASE_URL}ProductionEntryList/`);
    return response.data; // Return the fetched data
  } catch (error) {
    console.error("Error fetching production entries:", error);
    return []; // Return empty array if error occurs
  }
};


export const postProductionEntry = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}api/production-entries2/`, data);
    return response.data;
  } catch (error) {
    console.error("Error in postProductionEntry:", error);
    throw error;
  }
};


export const getNextReworkNo = async (year) => {
  try {
    console.log(`Fetching next rework number for year: ${year}`);
    const response = await axios.get(
      `${BASE_URL}api/production-entries2/get_next_rework_no/?year=${year}`
    );
    console.log("API Response:", response.data);
    return response.data.next_rework_no || "";
  } catch (error) {
    console.error("Error fetching next rework number:", error);
    return ""; // Return empty string if API fails
  }
};



// Fetch Next Available Rework No
export const getNextReworkNo1 = async (year) => {
  try {
    const response = await axios.get(`${BASE_URL}production-entries5/get_prod_no/?year=${year}`);
    return response.data.next_rework_no;
  } catch (error) {
    console.error("Error fetching next rework no:", error);
    return "";
  }
};

// Submit Production Entry
export const postProductionEntry1 = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}api/product-details/`, data);
    return response.data;
  } catch (error) {
    console.error("Error posting production entry:", error);
    throw error;
  }
};


export const getNextDPNo = async (year) => {
  try {
    const response = await axios.get(`${BASE_URL}api/get-next-dp-no/?year=${year}`);
    return response.data; // Return full response
  } catch (error) {
    console.error("Error fetching next DP number:", error);
    return null;
  }
};



// Submit a new production entry
export const submitProductionEntry = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}api/production-entriesAss/`, data)
    return response.data
  } catch (error) {
    console.error("Error submitting production entry:", error)
    throw error
  }
}

// Get a specific production entry by ID
export const getProductionEntryById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}api/production-entriesAss/${id}/`)
    return response.data
  } catch (error) {
    console.error("Error fetching production entry:", error)
    throw error
  }
}

export const updateProductionEntryy = async (id, data) => {
  try {
    const response = await axios.put(`${BASE_URL}api/production-entriesAss/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating production entry:", error);
    throw error;
  }
};



export const getReworkReasons = async () => {
  try {
    const response = await axios.get(`${BASE_URL}ReworkReason2/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching rework reasons:", error);
    return [];
  }
};

// Fetch Reject Reasons
export const getRejectReasons = async () => {
  try {
    const response = await axios.get(`${BASE_URL}RejectReason2/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reject reasons:", error);
    return [];
  }
};

// Add Rework Reason
export const addReworkReason = async (data) => {
  try {
    await axios.post(`${BASE_URL}ReworkReason2/`, data);
  } catch (error) {
    console.error("Error adding rework reason:", error);
  }
};

// Add Reject Reason
export const addRejectReason = async (data) => {
  try {
    await axios.post(`${BASE_URL}RejectReason2/`, data);
  } catch (error) {
    console.error("Error adding reject reason:", error);
  }
};





export const getProductDetails = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const response = await axios.get(`${BASE_URL}api/product-details/?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product details:', error);
    return [];
  }
};

export const deleteProductDetail = async (id) => {
  try {
    await axios.delete(`${BASE_URL}api/product-details/${id}/`);
    return true;
  } catch (error) {
    console.error('Error deleting product detail:', error);
    return false;
  }
};

export const getScrapLineRejectionNote = async (year) => {
  try {
    const response = await axios.get(`${BASE_URL}GetNextNote/?year=${year}`);
    return response.data.next_ScrapRejectionNo; // Ensure this matches API response
  } catch (error) {
    console.error("Error fetching next scrap rejection note:", error);
    return null;
  }
};

export const getAssemblyReport = async () => {
  try {
    const response = await axios.get(`${BASE_URL}ProductionEntryAssemblyList/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reject reasons:", error);
    return [];
  }
};


// Utility to get headers with Authorization token
const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("Authentication token not found. Please login again.");
  }

  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};

// ðŸ“„ Get Scrap Line Rejection Report
export const getScrapLineRejectionReport = async (params) => {
  try {
    const response = await axios.get(`${BASE_URL}ScrapLineRejectionReport/`, {
      ...getAuthHeaders(),
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Scrap Line Rejection Report:", error);
    return [];
  }
};

// ðŸ” Fetch scrap rejection detail by ID
export const fetchScrapRejectionDetail = async (rejectionId) => {
  try {
    const response = await axios.get(`${BASE_URL}api/ScrapLineRejectionNote/${rejectionId}/`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error fetching scrap rejection data:", error);
    throw error;
  }
};

// ðŸ”„ Update existing scrap rejection note
export const updateScrapRejectionNote = async (id, data) => {
  try {
    const response = await axios.put(`${BASE_URL}api/ScrapLineRejectionNote/${id}/`, data, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error updating scrap rejection note:", error);
    throw error;
  }
};

// ðŸ†• Submit new scrap rejection note
export const submitScrapRejectionNote = async (data) => {
  try {
   const response = await axios.post(`${BASE_URL}api/ScrapLineRejectionNote/`, data, getAuthHeaders());

    return response.data;
  } catch (error) {
    console.error("Error submitting scrap rejection entry:", error);
    throw error;
  }
};



export const getFgScrapLineRejectionReport = async (params) => {
  try {
    const response = await axios.get(`${BASE_URL}FGScrapRejectionReport/`, {
      ...getAuthHeaders(),
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Scrap Line Rejection Report:", error);
    return [];
  }
};


// Submit Scrap Rejection Entry
export const getNextNoteNo = async (year) => {
  try {
    const response = await axios.get(`${BASE_URL}GetNextNoteNo/?year=${year}`);
    return response.data.next_note_no;
  } catch (error) {
    console.error("Error fetching next note number:", error);
    return null;
  }
};

export const submitScrapRejectionEntry = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}api/FGScrapDetails/`,data, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error submitting scrap rejection entry:", error);
    throw error;
  }
};


// ðŸ” Fetch scrap rejection detail by ID
export const fetchFGScrapRejectionDetail = async (rejectionId) => {
  try {
    const response = await axios.get(`${BASE_URL}api/FGScrapDetails/${rejectionId}/`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error fetching scrap rejection data:", error);
    throw error;
  }
};

// ðŸ”„ Update existing scrap rejection note
export const updateFGScrapRejectionNote = async (id, data) => {
  try {
    const response = await axios.put(`${BASE_URL}api/FGScrapDetails/${id}/`, data, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error updating scrap rejection note:", error);
    throw error;
  }
};

export const getProductionFilterReport = async (filters) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const response = await axios.get(`https://sellerp-backend.onrender.com/Production/production-filter/?${params}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching production filter report:", error);
    throw error;
  }
};

export const getDailyProductionReport = async (filters) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const response = await axios.get(`https://sellerp-backend.onrender.com/Production/daily-production/?${params}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching daily production report:", error);
    throw error;
  }
};