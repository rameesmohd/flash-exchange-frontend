import { configureStore  } from '@reduxjs/toolkit';
import userReducer from './ClientSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

const persistConfig = { key: 'User', storage, version: 1};
const persistedReducer = persistReducer(persistConfig, userReducer);

// const adminPersistConfig = { key: 'User', storage, version: 1};
// const adminPersistedReducer = persistReducer(adminPersistConfig, adminReducer);

export const store = configureStore({
  reducer: { 
    User : persistedReducer 
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persist = persistStore(store)