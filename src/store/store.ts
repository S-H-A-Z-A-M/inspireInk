import { configureStore } from "@reduxjs/toolkit";
import authslice from "./authSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage for persistence

// Step 1: Create a persist configuration for the auth reducer
const persistConfig = {
  key: "auth", // Key for localStorage
  storage, // Storage method (localStorage)
};

// Step 2: Wrap the auth reducer with persistReducer
const persistedAuthReducer = persistReducer(persistConfig, authslice);

// Step 3: Configure the store with the persistent reducer
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check due to redux-persist
    }),
});

// Step 4: Create a persistor for the store
export const persistor = persistStore(store);
