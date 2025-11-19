import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api";

export const fetchProviders = createAsyncThunk(
  "users/fetchProviders",
  async (filters = {}, { rejectWithValue }) => {
    try {
      let response = await api.get("/admin/providers", {
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

export const updateStatusProvider = createAsyncThunk(
  "users/updateStatusProvider",
  async ({ status, provider_id }, { rejectWithValue }) => {
    try {
      let response = await api.patch(
        `/admin/provider/update-status/${provider_id}`,
        {
          status,
        }
      );
      console.log("Response :", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchClients = createAsyncThunk(
  "users/fetchClients",
  async (filters = {}, { rejectWithValue }) => {
    try {
      let response = await api.get("/admin/clients", {
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

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      let response = await api.delete(`/admin/delete-user/${id}`);
      console.log("Response :", response);
      return response.data;
    } catch (error) {
      console.log("Error :", error);
      return rejectWithValue(error);
    }
  }
);

export const restoreUser = createAsyncThunk(
  "users/restoreUser",
  async (id, { rejectWithValue }) => {
    try {
      let response = await api.post(`admin/user/${id}/restore`);
      console.log("Response :", response);
      return response.data;
    } catch (error) {
      console.log("Error :", error);
      return rejectWithValue(error);
    }
  }
);

export const forceDeleteUser = createAsyncThunk(
  "users/forceDeleteUser",
  async (id, { rejectWithValue }) => {
    try {
      let response = await api.post(`/admin/user/${id}/force-delete`);
      console.log("Response :", response);
      return response.data;
    } catch (error) {
      console.log("Error :", error);
      return rejectWithValue(error);
    }
  }
);

const UserSlice = createSlice({
  name: "users",
  initialState: {
    providers: {
      data: [],
      status: "idle",
    },
    clients: {
      data: [],
      status: "idle",
    },
    updateStatusProvider_Status: "idle",
    deleteUserStatus: "idle",
    restoreUserStatus: "idle",
    forceDeleteUserStatus: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProviders.pending, (state, action) => {
        state.providers.status = "loading";
        console.log("Fetch providers Pending :", action);
      })
      .addCase(fetchProviders.fulfilled, (state, action) => {
        state.providers.status = "success";
        state.providers.data = action.payload.providers;

        console.log("Fetch providers Fulfilled :", action.payload);
      })
      .addCase(fetchProviders.rejected, (state, action) => {
        state.providers.status = "failed";
        console.log("Fetch providers Rejected :", action);
      });

    builder
      .addCase(fetchClients.pending, (state, action) => {
        state.clients.status = "loading";
        console.log("Fetch Clients Pending :", action);
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.clients.status = "success";
        state.clients.data = action.payload.clients;

        console.log("Fetch Clients Fulfilled :", action.payload);
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.clients.status = "failed";
        console.log("Fetch Clients Rejected :", action);
      });

    builder
      .addCase(updateStatusProvider.pending, (state, action) => {
        state.updateStatusProvider_Status = "loading";

        console.log("Update Status Provider Pending :", action);
      })
      .addCase(updateStatusProvider.fulfilled, (state, action) => {
        state.updateStatusProvider_Status = "success";

        console.log("Update Status Provider Fulfilled :", action);
      })
      .addCase(updateStatusProvider.rejected, (state, action) => {
        state.updateStatusProvider_Status = "failed";

        console.log("Update Status Provider Rejected :", action);
      });

    builder
      .addCase(deleteUser.pending, (state, action) => {
        state.deleteUserStatus = "loading";
        console.log("Delete User Pending :", action);
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deleteUserStatus = "success";
        console.log("Delete User Fulfilled :", action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleteUserStatus = "failed";
        console.log("Delete User Rejected :", action);
      });

    builder
      .addCase(restoreUser.pending, (state, action) => {
        state.restoreUserStatus = "loading";
        console.log("Delete User Pending :", action);
      })
      .addCase(restoreUser.fulfilled, (state, action) => {
        state.restoreUserStatus = "success";
        console.log("Delete User Fulfilled :", action.payload);
      })
      .addCase(restoreUser.rejected, (state, action) => {
        state.restoreUserStatus = "failed";
        console.log("Delete User Rejected :", action);
      });

    builder
      .addCase(forceDeleteUser.pending, (state, action) => {
        state.forceDeleteUserStatus = "loading";
        console.log("Force Delete User Pending :", action);
      })
      .addCase(forceDeleteUser.fulfilled, (state, action) => {
        state.forceDeleteUserStatus = "success";
        console.log("Force Delete User Fulfilled :", action.payload);
      })
      .addCase(forceDeleteUser.rejected, (state, action) => {
        state.forceDeleteUserStatus = "failed";
        console.log("Force Delete User Rejected :", action);
      });
  },
});

export default UserSlice.reducer;
