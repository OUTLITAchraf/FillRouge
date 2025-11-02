import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../utils/api";

export const userRegister = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      console.log("data is :", data);

      let response = await api.post("/register", data);
      console.log("Reseponse :", response);
    } catch (error) {
      console.log("Error :", error);
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }

      // Fallback for network/non-response errors
      return rejectWithValue({ message: error.message || "Network Error" });
    }
  }
);

export const userLogin = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      console.log("data is :", data);

      let response = await api.post("/login", data);
      console.log("Reseponse :", response);
    } catch (error) {
      console.log("Error :", error);
      if (error.response && error.response.data) {
        // This returns { message: "The given data was invalid.", errors: { ... } }
        return rejectWithValue(error.response.data);
      }

      // Fallback for network/non-response errors
      return rejectWithValue({ message: error.message || "Network Error" });
    }
  }
);

const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    userRegister: {
      status: "idle",
    },
    userLogin: {
      status: "idle",
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(userRegister.pending, (state, action) => {
        state.userRegister.status = "loading";

        console.log("Register Pending:", action);
      })
      .addCase(userRegister.fulfilled, (state, action) => {
        (state.userRegister.status = "success"),
          console.log("Register Fulfilled:", action);
      })
      .addCase(userRegister.rejected, (state, action) => {
        state.userRegister.status = "failde";

        console.log("Register Rejected:", action);
      });

    builder
      .addCase(userLogin.pending, (state, action) => {
        state.userLogin.status = "loading";

        console.log("Login Pending:", action);
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        (state.userLogin.status = "success"),
          console.log("Login Fulfilled:", action);
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.userLogin.status = "failde";

        console.log("Login Rejected:", action);
      });
  },
});

export default AuthSlice.reducer;
