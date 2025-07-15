import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import patternsReducer from './slices/patternsSlice';
import tokensReducer from './slices/tokensSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    patterns: patternsReducer,
    tokens: tokensReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 