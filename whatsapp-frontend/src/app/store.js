
import { combineReducers,configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";

import  userSlice  from "../features/userSlice";
import { persistReducer, persistStore } from "redux-persist";
import createFilter from "redux-persist-transform-filter";
import  chatSlice  from "../features/chatSlice";


//in user slice only user is save on localstorage 
const saveUserOnlyFilter = createFilter("user", ["user"]);

// persist config
const persistConfig={
  key: "user",                  // localStorage-এ key নাম হবে "persist:user"
  storage,                      // সাধারণত localStorage ব্যবহৃত হয়
  whitelist: ["user"],          // কেবল "user" slice persist হবে
  transforms: [saveUserOnlyFilter],  // তার মধ্যেও শুধু "user" ফিল্ডটা persist হবে
}

const rootReducer = combineReducers({
  user:userSlice,
  chat:chatSlice,
})

const persistedReducer = persistReducer(persistConfig,rootReducer)

export const store = configureStore({
  reducer:persistedReducer,
   middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools:true
})

export const persistor  = persistStore(store)