import { configureStore } from "@reduxjs/toolkit";
import authslice from "./authSlice";

export const store = configureStore({
  reducer: {
    auth: authslice,
  },
});
