import { configureStore } from "@reduxjs/toolkit";
import treeReducer, { hydrateFromStorage } from "@/features/tree/treeSlice";
import { STORAGE_KEY } from "@/constants";


export const store = configureStore({
reducer: {
tree: treeReducer,
},
});


try {
const raw = localStorage.getItem(STORAGE_KEY);
if (raw) store.dispatch(hydrateFromStorage(JSON.parse(raw)));
} catch {}


let timeoutId: number | undefined;
store.subscribe(() => {
clearTimeout(timeoutId);
timeoutId = window.setTimeout(() => {
const state = store.getState().tree;
localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}, 250);
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;