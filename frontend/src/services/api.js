
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export const createOrganization = async (name) => {
    const response = await api.post("/organizations", { name });
    return response.data;
};

export const getProducts = async (organizationId) => {
    const response = await api.get(
        `/organizations/${organizationId}/products`
    );
    return response.data;
};

export const createProduct = async (organizationId, product) => {
    const response = await api.post(
        `/organizations/${organizationId}/products`,
        product
    );
    return response.data;
};

export const updateProduct = async (organizationId, productId, product) => {
    const response = await api.put(
        `/organizations/${organizationId}/products/${productId}`,
        product
    );
    return response.data;
};

export const deleteProduct = async (organizationId, productId) => {
    await api.delete(
        `/organizations/${organizationId}/products/${productId}`
    );
};

export const getDashboardSummary = async (organizationId) => {
    const response = await api.get(
        `/organizations/${organizationId}/dashboard/summary`
    );
    return response.data;
};

export default api;
