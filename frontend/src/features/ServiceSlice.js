import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api";

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

export const fetchCities = createAsyncThunk(
  "services/fetchCities",
  async (_, { rejectWithValue }) => {
    try {
      let response = await api.get("/cities");
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
  async (formData, { rejectWithValue }) => {
    try {
      let response = await api.post(`/create-service`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Response :", response.data);
      return response.data;
    } catch (error) {
      console.log("Error :", error);
      return rejectWithValue(error);
    }
  }
);

export const updateService = createAsyncThunk(
  "services/updateService",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      console.log("service id :", id);
      for (let item of formData.entries()) {
        console.log(item[0], item[1]);
      }

      let response = await api.post(`/update-service/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Response :", response.data);
      return response.data;
    } catch (error) {
      console.log("Error :", error);
      return rejectWithValue(error);
    }
  }
);

export const deleteService = createAsyncThunk(
  "services/deleteService",
  async (id, { rejectWithValue }) => {
    try {
      let response = await api.delete(`/delete-service/${id}`);
      console.log("Response :", response);
      return response.data;
    } catch (error) {
      console.log("Error :", error);
      return rejectWithValue(error);
    }
  }
);

export const restoreService = createAsyncThunk(
  "services/restoreService",
  async (id, { rejectWithValue }) => {
    try {
      let response = await api.post(`admin/service/${id}/restore`);
      console.log("Response :", response);
      return response.data;
    } catch (error) {
      console.log("Error :", error);
      return rejectWithValue(error);
    }
  }
);

export const forceDeleteService = createAsyncThunk(
  "services/forceDeleteService",
  async (id, { rejectWithValue }) => {
    try {
      let response = await api.post(`/admin/service/${id}/force-delete`);
      console.log("Response :", response);
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
  async (filters = {}, { rejectWithValue }) => {
    try {
      let response = await api.get("/reservations", {
        params: filters,
      });
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
      let response = await api.patch(
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
      let response = await api.patch(
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

export const createCategory = createAsyncThunk(
  "services/createCategory",
  async (data, { rejectWithValue }) => {
    try {
      let response = await api.post("/admin/create-category", data);
      console.log("Response :", response);
      return response.data;
    } catch (error) {
      console.log("Error :", error);
      return rejectWithValue(error);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "services/updateCategory",
  async (data, { rejectWithValue }) => {
    try {
      let response = await api.put(`/admin/update-category/${data.id}`, data);
      console.log("Response :", response);
      return response.data;
    } catch (error) {
      console.log("Error :", error);
      return rejectWithValue(error);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "services/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      let response = await api.delete(`/admin/delete-category/${id}`);
      console.log("Response :", response);
      return response.data;
    } catch (error) {
      console.log("Error :", error);
      return rejectWithValue(error);
    }
  }
);

export const restoreCategory = createAsyncThunk(
  "services/restoreCategory",
  async (id, { rejectWithValue }) => {
    try {
      let response = await api.post(`/admin/category/${id}/restore`);
      console.log("Response :", response);
      return response.data;
    } catch (error) {
      console.log("Error :", error);
      return rejectWithValue(error);
    }
  }
);

export const forceDeleteCategory = createAsyncThunk(
  "services/forceDeleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      let response = await api.post(`/admin/category/${id}/force-delete`);
      console.log("Response :", response);
      return response.data;
    } catch (error) {
      console.log("Error :", error);
      return rejectWithValue(error);
    }
  }
);

export const fetchReviews = createAsyncThunk(
  "services/fetchReviews",
  async (filter = {}, { rejectWithValue }) => {
    try {
      let response = await api.get("/reviews", {
        params: filter,
      });
      console.log("Response Review :", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const forceDeleteReview = createAsyncThunk(
  "services/forceDeleteReview",
  async (id, { rejectWithValue }) => {
    try {
      let response = await api.post(`/admin/review/${id}/force-delete`);
      console.log("Response :", response);
      return response.data;
    } catch (error) {
      console.log("Error :", error);
      return rejectWithValue(error);
    }
  }
);

const ServiceSlice = createSlice({
  name: "services",
  initialState: {
    fetchCategoriesStatus: "idle",
    categories: null,
    fetchCitiesStatus: "idle",
    cities: null,
    createCategoryStatus: "idle",
    updateCategoryStatus: "idle",
    deleteCategoryStatus: "idle",
    restoreCategoryStatus: "idle",
    forceDeleteCategoryStatus: "idle",
    services: {
      data: [],
      status: "idle",
    },
    service: {
      data: {},
      status: "idle",
    },
    createServiceStatus: "idle",
    updateServiceStatus: "idle",
    updateStatusServiceStatus: "idle",
    deleteServiceStatus: "idle",
    restoreServiceStatus: "idle",
    forceDeleteServiceStatus: "idle",
    reviews: {
      data: [],
      status: "idle",
    },
    addReviewStatus: "idle",
    updateReviewStatus: "idle",
    deleteReviewStatus: "idle",
    forceDeleteReviewStatus: "idle",
    reservationStatus: "idle",
    reservations: {
      data: [],
      status: "idle",
    },
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
      .addCase(fetchCities.pending, (state, action) => {
        state.fetchCitiesStatus = "loading";
        state.cities = null;

        console.log("Fetch Cities Pending :", action);
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.fetchCitiesStatus = "success";
        state.cities = action.payload.cities;

        console.log("Fetch Cities Fulfilled :", action.payload);
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.fetchCitiesStatus = "failed";
        state.cities = null;

        console.log("Fetch Cities Rejected :", action);
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
      .addCase(updateService.pending, (state, action) => {
        state.updateServiceStatus = "loading";
        console.log("Update Service Pending :", action);
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.updateServiceStatus = "success";

        console.log("Update Service Fulfilled :", action.payload);
      })
      .addCase(updateService.rejected, (state, action) => {
        state.updateServiceStatus = "failed";
        console.log("Update Service Rejected :", action);
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
      .addCase(deleteService.pending, (state, action) => {
        state.deleteServiceStatus = "loading";
        console.log("Delete Service Pending :", action);
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.deleteServiceStatus = "success";
        console.log("Delete Service Fulfilled :", action.payload);
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.deleteServiceStatus = "failed";
        console.log("Delete Service Rejected :", action);
      });

    builder
      .addCase(restoreService.pending, (state, action) => {
        state.restoreServiceStatus = "loading";
        console.log("Delete Service Pending :", action);
      })
      .addCase(restoreService.fulfilled, (state, action) => {
        state.restoreServiceStatus = "success";
        console.log("Delete Service Fulfilled :", action.payload);
      })
      .addCase(restoreService.rejected, (state, action) => {
        state.restoreServiceStatus = "failed";
        console.log("Delete Service Rejected :", action);
      });

    builder
      .addCase(forceDeleteService.pending, (state, action) => {
        state.forceDeleteServiceStatus = "loading";
        console.log("Force Delete Service Pending :", action);
      })
      .addCase(forceDeleteService.fulfilled, (state, action) => {
        state.forceDeleteServiceStatus = "success";
        console.log("Force Delete Service Fulfilled :", action.payload);
      })
      .addCase(forceDeleteService.rejected, (state, action) => {
        state.forceDeleteServiceStatus = "failed";
        console.log("Force Delete Service Rejected :", action);
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
      .addCase(fetchReviews.pending, (state, action) => {
        state.reviews.status = "loading";

        console.log("Fetch Reviews Pending :", action);
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.reviews.status = "success";
        state.reviews.data = action.payload;

        console.log("Fetch Reviews Fulfilled :", action);
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.reviews.status = "failed";

        console.log("Fetch Reviews Rejected :", action);
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

    builder
      .addCase(createCategory.pending, (state, action) => {
        state.createCategoryStatus = "loading";
        console.log("Create Category Pending :", action);
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.createCategoryStatus = "success";

        console.log("Create Category Fulfilled :", action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.createCategoryStatus = "failed";
        console.log("Create Category Rejected :", action);
      });

    builder
      .addCase(updateCategory.pending, (state, action) => {
        state.updateCategoryStatus = "loading";
        console.log("Update Category Pending :", action);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.updateCategoryStatus = "success";

        console.log("Update Category Fulfilled :", action.payload);
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.updateCategoryStatus = "failed";
        console.log("Update Category Rejected :", action);
      });

    builder
      .addCase(deleteCategory.pending, (state, action) => {
        state.deleteCategoryStatus = "loading";
        console.log("Delete Category Pending :", action);
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.deleteCategoryStatus = "success";
        console.log("Delete Category Fulfilled :", action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.deleteCategoryStatus = "failed";
        console.log("Delete Category Rejected :", action);
      });

    builder
      .addCase(restoreCategory.pending, (state, action) => {
        state.restoreCategoryStatus = "loading";
        console.log("Restore Category Pending :", action);
      })
      .addCase(restoreCategory.fulfilled, (state, action) => {
        state.restoreCategoryStatus = "success";
        console.log("Restore Category Fulfilled :", action.payload);
      })
      .addCase(restoreCategory.rejected, (state, action) => {
        state.restoreCategoryStatus = "failed";
        console.log("Restore Category Rejected :", action);
      });

    builder
      .addCase(forceDeleteCategory.pending, (state, action) => {
        state.forceDeleteCategoryStatus = "loading";
        console.log("ForceDelete Category Pending :", action);
      })
      .addCase(forceDeleteCategory.fulfilled, (state, action) => {
        state.forceDeleteCategoryStatus = "success";
        console.log("ForceDelete Category Fulfilled :", action.payload);
      })
      .addCase(forceDeleteCategory.rejected, (state, action) => {
        state.forceDeleteCategoryStatus = "failed";
        console.log("ForceDelete Category Rejected :", action);
      });

    builder
      .addCase(forceDeleteReview.pending, (state, action) => {
        state.forceDeleteReviewStatus = "loading";
        console.log("Force Delete Review Pending :", action);
      })
      .addCase(forceDeleteReview.fulfilled, (state, action) => {
        state.forceDeleteReviewStatus = "success";
        console.log("Force Delete Review Fulfilled :", action.payload);
      })
      .addCase(forceDeleteReview.rejected, (state, action) => {
        state.forceDeleteReviewStatus = "failed";
        console.log("Force Delete Review Rejected :", action);
      });
  },
});

export default ServiceSlice.reducer;
