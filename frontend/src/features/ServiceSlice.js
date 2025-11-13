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

export const createService = createAsyncThunk(
  "services/createService",
  async (data, { rejectWithValue }) => {
    try {
      let response = await api.post(`/create-service`, data);

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

export const fetchReservations = createAsyncThunk(
  "services/fetchReservations",
  async (_, { rejectWithValue }) => {
    try {
      let response = await api.get("/reservations");
      console.log("Response Reservation :", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateStatusService = createAsyncThunk(
  "services/updateStatusService",
  async ({ status, service_id }, { rejectWithValue }) => {
    try {
      let response = await api.put(
        `/admin/service/update-status/${service_id}`,
        {
          status,
        }
      );
      console.log("Response Reservation :", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateStatusReservations = createAsyncThunk(
  "services/updateStatusReservations",
  async ({ status, reservation_id }, { rejectWithValue }) => {
    try {
      let response = await api.put(
        `/reservation/update-status/${reservation_id}`,
        {
          status,
        }
      );
      console.log("Response Reservation :", response);
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
    createServiceStatus: "idle",
    addReviewStatus: "idle",
    updateReviewStatus: "idle",
    deleteReviewStatus: "idle",
    reservationStatus: "idle",
    reservations: {
      data: [],
      status: "idle",
    },
    updateStatusServiceStatus: "idle",
    updateStatusReservationsStatus: "idle",
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
      .addCase(createService.pending, (state, action) => {
        state.createServiceStatus = "loading";
        console.log("Create Service Pending :", action);
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.createServiceStatus = "success";

        console.log("Create Service Fulfilled :", action.payload);
      })
      .addCase(createService.rejected, (state, action) => {
        state.createServiceStatus = "failed";
        console.log("Create Service Rejected :", action);
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
        state.reservationStatus = "loading";
        console.log("Reservation Pending.");
      })
      .addCase(reserverService.fulfilled, (state) => {
        state.reservationStatus = "success";
        console.log("Reservation Fulfilled.");
      })
      .addCase(reserverService.rejected, (state) => {
        state.reservationStatus = "failed";
        console.log("Reservation Rejected.");
      });

    builder
      .addCase(addReview.pending, (state, action) => {
        state.addReviewStatus = "loading";

        console.log("Add Review Pending :", action);
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.addReviewStatus = "success";

        console.log("Add Review Fulfilled :", action);
      })
      .addCase(addReview.rejected, (state, action) => {
        state.addReviewStatus = "failed";

        console.log("Add Review Rejected :", action);
      });

    builder
      .addCase(updateReview.pending, (state, action) => {
        state.updateReviewStatus = "loading";

        console.log("Update Review Pending :", action);
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.updateReviewStatus = "success";

        console.log("Update Review Fulfilled :", action);
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.updateReviewStatus = "failed";

        console.log("Update Review Rejected :", action);
      });

    builder
      .addCase(deleteReview.pending, (state, action) => {
        state.deleteReviewStatus = "loading";

        console.log("Delete Review Pending :", action);
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.deleteReviewStatus = "success";

        console.log("Delete Review Fulfilled :", action);
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.deleteReviewStatus = "failed";

        console.log("Delete Review Rejected :", action);
      });

    builder
      .addCase(fetchReservations.pending, (state, action) => {
        state.reservations.status = "loading";

        console.log("Fetch Reservation Pending :", action);
      })
      .addCase(fetchReservations.fulfilled, (state, action) => {
        state.reservations.status = "success";
        state.reservations.data = action.payload.reservations;

        console.log("Fetch Reservation Fulfilled :", action);
      })
      .addCase(fetchReservations.rejected, (state, action) => {
        state.reservations.status = "failed";

        console.log("Fetch Reservation Rejected :", action);
      });

    builder
      .addCase(updateStatusService.pending, (state, action) => {
        state.updateStatusServiceStatus = "loading";

        console.log("Update Status Service Pending :", action);
      })
      .addCase(updateStatusService.fulfilled, (state, action) => {
        state.updateStatusServiceStatus = "success";

        console.log("Update Status Service Fulfilled :", action);
      })
      .addCase(updateStatusService.rejected, (state, action) => {
        state.updateStatusServiceStatus = "failed";

        console.log("Update Status Service Rejected :", action);
      });

    builder
      .addCase(updateStatusReservations.pending, (state, action) => {
        state.updateStatusReservationsStatus = "loading";

        console.log("Update Status Reservation Pending :", action);
      })
      .addCase(updateStatusReservations.fulfilled, (state, action) => {
        state.updateStatusReservationsStatus = "success";

        console.log("Update Status Reservation Fulfilled :", action);
      })
      .addCase(updateStatusReservations.rejected, (state, action) => {
        state.updateStatusReservationsStatus = "failed";

        console.log("Update Status Reservation Rejected :", action);
      });
  },
});

export default ServiceSlice.reducer;
