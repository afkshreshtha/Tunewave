"use client";

import { configureStore } from '@reduxjs/toolkit';
import { jioSavaanapi } from './services/jioSavaanapi';

import playerReducer from './Features/playerSlice';

export const store = configureStore({
  reducer: {
    [jioSavaanapi.reducerPath]: jioSavaanapi.reducer,
    player: playerReducer,
  },
  middleware: (getDefaultMiddleWare) => getDefaultMiddleWare().concat(jioSavaanapi.middleware),
});
