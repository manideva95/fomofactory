import { configureStore } from '@reduxjs/toolkit';
import cryptoReducer from './cryptoSlice';

const store = configureStore({
    reducer: {
        crypto: cryptoReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
