import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../utils/api";

export const fetchProviders = createAsyncThunk(
  "providers/fetchProviders",
  async (filters = {}, { rejectWithValue }) => {
    try {
      let response = await api.get("/admin/providers", {
        params: filters
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
  "providers/updateStatusProvider",
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

const UserSlice = createSlice({
  name: "users",
  initialState: {
    providers: {
      data: [],
      status: "idle",
    },
    updateStatusProvider_Status: "idle",
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
  },
});

export default UserSlice.reducer;
