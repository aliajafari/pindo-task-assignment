import { configureStore, combineReducers } from "@reduxjs/toolkit";
import tree from "@/features/tree/treeSlice";
import { createPersistMiddleware, loadState } from "./persist";

const rootReducer = combineReducers({
  tree,
});

export type RootState = ReturnType<typeof rootReducer>;

const preloaded = loadState() as Partial<RootState> | undefined;

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: preloaded,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(createPersistMiddleware()),
});

export type AppDispatch = typeof store.dispatch;
