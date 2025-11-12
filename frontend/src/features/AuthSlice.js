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

      Cookies.set("authToken", response.data.token, {
        expires: 7,
        sameSite: "strict",
      });
      Cookies.set("authUser", JSON.stringify(response.data.user), {
        expires: 7,
        sameSite: "strict",
      });

      return response.data;
    } catch (error) {
      console.log("Error :", error);
      return rejectWithValue(error.response.data);
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

      Cookies.set("authToken", response.data.token, {
        expires: 7,
        sameSite: "strict",
      });
      Cookies.set("authUser", JSON.stringify(response.data.user), {
        expires: 7,
        sameSite: "strict",
      });

      return response.data;
    } catch (error) {
      console.log("Error :", error);

      if (error.response.status == 422) {
        return rejectWithValue(error.response.data);
      } else if (error.response.status == 403) {
        return rejectWithValue(error.response.data);
      }

      return rejectWithValue({
        message: "Login failed due to an unknown error.",
      });
    }
  }
);

export const userLogout = createAsyncThunk(
  "auth/userLogout",
  async (_, { rejectWithValue }) => {
    try {
      let response = await api.post("/logout");
      console.log("Response :", response);
      return response.data
    } catch (error) {
      console.log("Error :", error);
      return rejectWithValue(error)
    }
  }
);

const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    token: Cookies.get("authToken") ? Cookies.get("authToken") : null,
    user: Cookies.get("authUser") ? JSON.parse(Cookies.get("authUser")) : null,
    userRegister: {
      status: "idle",
    },
    userLogin: {
      status: "idle",
    },
    userLogout: {
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
        state.userRegister.status = "success";
        state.token = action.payload.token;
        state.user = action.payload.user;


        console.log("Register Fulfilled:", action);
      })
      .addCase(userRegister.rejected, (state, action) => {
        state.userRegister.status = "failde";

        console.log("Register Rejected:", action.payload);
      });

    builder
      .addCase(userLogin.pending, (state, action) => {
        state.userLogin.status = "loading";

        console.log("Login Pending:", action);
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.userLogin.status = "success";
        state.token = action.payload.token;
        state.user = action.payload.user;

        console.log("Login Fulfilled:", action);
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.userLogin.status = "failde";

        console.log("Login Rejected:", action);
      });

    builder
      .addCase(userLogout.pending, (state, action) => {
        state.userLogout.status = "pending";

        console.log("User Logout Pending:", action);
      })
      .addCase(userLogout.fulfilled, (state, action) => {
        state.userLogout.status = "success";
        state.user = null;
        Cookies.remove("authToken");
        Cookies.remove("authUser");

        console.log("User Logout Fulfilled:", action);
      })
      .addCase(userLogout.rejected, (state, action) => {
        state.userLogout.status = "failde";

        console.log("User Logout Rejected:", action);
      });
  },
});

export default AuthSlice.reducer;
