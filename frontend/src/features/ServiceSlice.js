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
      return rejectWithValue(error);
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
      return rejectWithValue(error);
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
      return rejectWithValue(error);
    }
  }
);

export const addReview = createAsyncThunk(
  "service/addReview",
  async ({ rating, comment, service_id }) => {
    // console.log(rating, comment, service_id);

    let response = await api.post(`/service/${service_id}/add-review`, {
      rating,
      comment,
    });
    console.log("Response :", response);
    return response.data;
  }
);

export const updateReview = createAsyncThunk(
  "service/updateReview",
  async (review) => {
    let response = await api.put(`/update-review/${review.id}`, review);
    console.log("Response :", response);
    return response.data;
  }
);

export const deleteReview = createAsyncThunk(
  "service/deleteReview",
  async (id) => {
    let response = await api.delete(`/delete-review/${id}`);

    console.log("Response :", response);
    return response.data;
  }
);

export const reserverService = createAsyncThunk(
  "service/reserverService",
  async (
    { description, reservation_date, service_id },
    { rejectWithValue }
  ) => {
    try {
      let response = await api.post(`/service/${service_id}/reserve`, {
        description,
        reservation_date,
      });
      console.log("Response :", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
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
    isReserved: false,
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

    builder
      .addCase(reserverService.pending, (state) => {
        state.isReserved = false;
        console.log("Reservation Pending.");
      })
      .addCase(reserverService.fulfilled, (state) => {
        state.isReserved = true;
        console.log("Reservation Fulfilled.");
      })
      .addCase(reserverService.rejected, (state) => {
        state.isReserved = false;
        console.log("Reservation Rejected.");
      });
  },
});

export default ServiceSlice.reducer;
