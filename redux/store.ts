import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";

import userReducer from "./reducers/userReducer";

const userPersistConfig = {
  key: "user",
  storage: AsyncStorage,
  whitelist: ["accessToken", "isVarified", "profile"],
};

const reducers = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
});

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
const persistor = persistStore(store);

export { persistor, store };
