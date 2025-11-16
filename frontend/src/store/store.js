import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "../features/AuthSlice";
import ServiceReducer from "../features/ServiceSlice";
import UserSliceReducer from "../features/UserSlice";

export const store = configureStore({
  reducer: {
    auth: AuthReducer,
    services: ServiceReducer,
    users: UserSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});
