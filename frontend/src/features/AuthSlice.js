import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../utils/api";
import Cookies from "js-cookie";

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

      return response.data;
    } catch (error) {
      console.log("Error :", error);

      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }

      return rejectWithValue({ message: error.message || "Network Error" });
    }
  }
);

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      let response = await api.get("/user");
      console.log("Response :", response);
      return response.data;
    } catch (error) {
      console.log("Error :", error);
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }

      return rejectWithValue({ message: error.message || "Network Error" });
    }
  }
);

export const userLogout = createAsyncThunk(
  "auth/userLogout",
  async (_, { rejectWithValue }) => {
    try {
      let response = await api.post("/logout");
      console.log("Response :", response);
      return response.data;
    } catch (error) {
      console.log("Error :", error);
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }

      return rejectWithValue({ message: error.message || "Network Error" });
    }
  }
);

const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    token: Cookies.get("authToken") ? Cookies.get("authToken") : null,
    fetchUserStatus: "idle",
    user: null,
    userRegister: {
      status: "idle",
    },
    userLogin: {
      status: "idle",
    },
    userLogout: {
      status: "idle",
    }
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
          (state.token = action.payload.token),
          (state.user = action.payload.user),
          Cookies.set("authToken", action.payload.token, {
            expires: 7,
            sameSite: "strict",
          });

        console.log("Login Fulfilled:", action);
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.userLogin.status = "failde";
        Cookies.remove("authToken");

        console.log("Login Rejected:", action);
      });

    builder
      .addCase(fetchUser.pending, (state, action) => {
        state.fetchUserStatus = "loading";
        state.user = null;

        console.log("Fetch User Pending:", action);
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.fetchUserStatus = "success";
        state.user = action.payload.user;
        console.log("Fetch User Fulfilled:", action);
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.fetchUserStatus = "failde";
        state.user = null;

        console.log("Fetch User Rejected:", action);
      });

    builder
      .addCase(userLogout.pending, (state, action) => {
        state.userLogout.status = "pending"

        console.log("User Logout Pending:", action);
      })
      .addCase(userLogout.fulfilled, (state, action) => {
        state.userLogout.status = "success";
        state.user = null;
        Cookies.remove("authToken")

        console.log("User Logout Fulfilled:", action);
      })
      .addCase(userLogout.rejected, (state, action) => {
        state.userLogout.status = "failde";

        console.log("User Logout Rejected:", action);
      });
  },
});

export default AuthSlice.reducer;
