import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../utils/api";

export const fetchCategories = createAsyncThunk(
  "services/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      let response = await api.get("/categories");
      console.log("Response :", response.data);
      return response.data;
    } catch (error) {
      console.log("Error :", error);
    }
  }
);

export const fetchServices = createAsyncThunk(
  "services/fetchServices",
  async (filters = {}, { rejectWithValue }) => {
    try {
      let response = await api.get("/services", {
        params: filters,
      });
      console.log("Response :", response.data);
      return response.data;
    } catch (error) {
      console.log("Error :", error);
    }
  }
);

export const fetchService = createAsyncThunk(
  "service/fetchService",
  async (id, { rejectWithValue }) => {
    try {
      let response = await api.get(`/service/${id}`);

      console.log("Response :", response.data);
      return response.data;
    } catch (error) {
      console.log("Error :", error);
    }
  }
);
const ServiceSlice = createSlice({
  name: "services",
  initialState: {
    fetchCategoriesStatus: "idle",
    categories: null,
    services: {
      data: [],
      status: "idle",
    },
    service: {
      data: {},
      status: "idle",
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state, action) => {
        state.fetchCategoriesStatus = "loading";
        state.categories = null;

        console.log("Fetch Categories Pending :", action);
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.fetchCategoriesStatus = "success";
        state.categories = action.payload.categories;

        console.log("Fetch Categories Fulfilled :", action.payload.categories);
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.fetchCategoriesStatus = "failed";
        state.categories = null;

        console.log("Fetch Categories Rejected :", action);
      });

    builder
      .addCase(fetchServices.pending, (state, action) => {
        state.services.status = "loading";
        console.log("Fetch Services Pending :", action);
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.services.status = "success";
        state.services.data = action.payload.services;

        console.log("Fetch Services Fulfilled :", action.payload);
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.services.status = "failed";
        console.log("Fetch Services Rejected :", action);
      });
    
    builder
      .addCase(fetchService.pending, (state, action) => {
        state.service.status = "loading";
        console.log("Fetch Service Pending :", action);
      })
      .addCase(fetchService.fulfilled, (state, action) => {
        state.service.status = "success";
        state.service.data = action.payload.service;

        console.log("Fetch Service Fulfilled :", action.payload);
      })
      .addCase(fetchService.rejected, (state, action) => {
        state.service.status = "failed";
        console.log("Fetch Service Rejected :", action);
      });
  },
});

export default ServiceSlice.reducer;
