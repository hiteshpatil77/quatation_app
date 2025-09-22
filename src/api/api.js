import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "https://solar-backend-app-a7535b846a11.herokuapp.com/api/";
const TIMEOUT = 10000;

const endPoint = {
  Login: "user/login",
  Quotations: "quotation/list",
  leadscreate: "organization/leads/create",
  addComplaint: "complaint/create",
  leadUpdate: "quotation/leads",
  quotationCreate: "quotation/create",
  quotationView: "quotation/leads",
  complaintView: "complaint/list",
};

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: TIMEOUT,
});

const fetchData = async (endpoint, method = "POST", payload = {}) => {
  console.log("Request URL:", `${API_URL}${endpoint}`);
  console.log("Request Method:", method);
  console.log("Request Payload:", payload);

  try {
    const token = await AsyncStorage.getItem("accessToken");
    console.log("Token:", token);

    const isFormData = payload instanceof FormData;

    const headers = {
      ...(isFormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const config = {
      url: endpoint, // ✅ only endpoint, baseURL already set
      method,
      headers,
    };

    if (method === "GET") {
      config.params = payload;
    } else {
      config.data = payload;
    }

    const response = await axiosInstance(config);
    console.log("API Response:", response.data);

    return validateApiResponse(response);
  } catch (error) {
    console.error(
      "fetchData Error ===>",
      JSON.stringify(error.response?.data || error.message)
    );
    throw new Error(
      error.response?.data?.message ||
        "An error occurred while processing your request."
    );
  }
};

const validateApiResponse = (response) => {
  return response?.data || null;
};

// ✅ API methods
export const apiCalls = {
  login: (email, password) =>
    fetchData(endPoint.Login, "POST", { email, password }),

  getQuotations: (filters = {}) =>
    fetchData(endPoint.Quotations, "GET", filters),

  getComplaint: (filters = {}) =>
    fetchData(endPoint.complaintView, "GET", filters),

  // 🔹 Rename this from getLeads → updateLead
  updateLead: (id, { note, leadStatus }) =>
    fetchData(`${endPoint.leadUpdate}/${id}`, "PUT", {
      note,
      leadStatus,
    }),

  CreateView: (data = {}) => fetchData(endPoint.leadUpdate, "GET", data),

  CreatLeadApi: (name, address, city, pincode, phone, note) =>
    fetchData(endPoint.leadscreate, "POST", {
      name,
      address,
      city,
      pincode,
      phone,
      note,
    }),

  AddComplaint: (
    name,
    address,
    city,
    description,
    phone,
    note,
    consumerNumber,
    priority,
    category
  ) =>
    fetchData(endPoint.addComplaint, "POST", {
      name,
      address,
      city,
      description,
      phone,
      note,
      consumerNumber,
      priority,
      category,
    }),

  CreateQuotation: (data) => fetchData(endPoint.quotationCreate, "POST", data),

  updateQuotation: (id, { status, note }) =>
    fetchData(`quotation/${id}/update`, "PUT", { status, note }),

  updateComplaint: (id, { status, note }) =>
    fetchData(`complaint/${id}/update`, "PUT", { status, note }),

  getQuotationsWithParams: ({
    sortBy = "createdAt",
    sortOrder = "desc",
    page = 1,
    limit = 10,
  } = {}) =>
    fetchData(
      `quotation/list?sortBy=${sortBy}&sortOrder=${sortOrder}&page=${page}&limit=${limit}`,
      "GET"
    ),
};
