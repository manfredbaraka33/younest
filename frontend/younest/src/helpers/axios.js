import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { getAccessToken, getRefreshToken, getUser } from "../hooks/user.actions";

// Create an Axios instance with default settings
const axiosService = axios.create({
  baseURL: "https://younest.onrender.com/api", // Update with your API's base URL
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Interceptor to attach the access token to each request
axiosService.interceptors.request.use(async (config) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Refresh logic when a 401 error occurs
const refreshAuthLogic = async (failedRequest) => {
  try {
    const response = await axios.post(
      "token/refresh/", // Update with your refresh endpoint
      {
        refresh: getRefreshToken(),
      },
      {
        baseURL: "https://younest.onrender.com/api", // Same API base URL
      }
    );

    const { access } = response.data;

    // Update headers for the failed request with the new token
    failedRequest.response.config.headers["Authorization"] = `Bearer ${access}`;

    // Save the new access token
    localStorage.setItem(
      "auth",
      JSON.stringify({
        access,
        refresh: getRefreshToken(),
        user: getUser(),
      })
    );

    return Promise.resolve();
  } catch (error) {
    // If refreshing the token fails, clear auth info and redirect to login
    localStorage.removeItem("auth");
    window.location.href = "/login"; // Optional redirect to login
    return Promise.reject(error);
  }
};

// Attach the token refresh interceptor to the Axios instance
createAuthRefreshInterceptor(axiosService, refreshAuthLogic);

// Helper function for GET requests
export async function getData(url) {
  try {
    const response = await axiosService.get(url);
    return response.data;
  } catch (error) {
    console.error("GET request failed:", error);
    throw error;
  }
}

// Helper function for POST requests
export async function postData(url, data) {
  try {
    const response = await axiosService.post(url, data);
    return response.data;
  } catch (error) {
    console.error("POST request failed:", error);
    throw error;
  }
}

// Helper function for PUT requests (full update)
export async function putData(url, data) {
  try {
    const response = await axiosService.put(url, data);
    return response.data;
  } catch (error) {
    console.error("PUT request failed:", error);
    throw error;
  }
}

// Helper function for PATCH requests (partial update)
export async function patchData(url, data) {
  try {
    const response = await axiosService.patch(url, data);
    return response.data;
  } catch (error) {
    console.error("PATCH request failed:", error);
    throw error;
  }
}

// Helper function for DELETE requests
export async function deleteData(url) {
  try {
    const response = await axiosService.delete(url);
    return response.data;
  } catch (error) {
    console.error("DELETE request failed:", error);
    throw error;
  }
}

// New `updateData` function to handle both PUT and PATCH based on the requirement
export async function updateData(url, data, method = "PUT") {
  try {
    const response =
      method === "PUT"
        ? await axiosService.put(url, data) // Full update
        : await axiosService.patch(url, data); // Partial update
    return response.data;
  } catch (error) {
    console.error("Update request failed:", error);
    throw error;
  }
}



export async function followUnfollowShop(shopId) {
  try {
    const response = await axiosService.post(`/shops/${shopId}/follow/`);
    return response.data; // This should include the updated shop data
  } catch (error) {
    console.error("Error in followUnfollowShop:", error);
    throw error;
  }
}


export async function saveUnsavestatus(){
  try {
    const response = await axiosService.get('saved-products/'); 
    return response.data;
  } catch (error) {
    console.error("Error in save status:", error);
    throw error;
  }
}

// Fetch all saved products
export async function fetchSavedProducts() {
  try {
    const response = await axiosService.get("saved-products/");
    console.log("Here is the response",response)
    return response.data.saved_products;
  } catch (error) {
    console.error("Error fetching saved products:", error);
    throw error;
  }
}

// Toggle save/remove product
export async function toggleSaveProduct(productId) {
  try {
    const response = await axiosService.patch(`product/${productId}/toggle-save/`);
    return response.data;  // { message: "...", saved: true/false }
  } catch (error) {
    console.error("Error toggling save product:", error);
    throw error;
  }
}


export const getNotifications = async () => {
  try {
      const response = await axiosService.get("notifications/");
      console.log("Here are the notifications",response.data)
      // return Array.isArray(response.data) ? response.data : []; // Return data directly
      return response.data.results
  } catch (error) {
      console.error("🚀 Error fetching notifications:", error);
      return [];
  }
};


export const markAllNotificationsAsRead = async () => {
  try {
    await axiosService.post('notifications/mark-all-as-read/');
  } catch (error) {
    console.error("Error marking notifications as read:", error);
  }
};




// Default export for the Axios instance
export default axiosService;
