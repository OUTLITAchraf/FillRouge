import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "../features/AuthSlice"
import ServiceReducer from "../features/ServiceSlice"

export const store = configureStore({
    reducer: {
        auth: AuthReducer,
        services: ServiceReducer
    }
})