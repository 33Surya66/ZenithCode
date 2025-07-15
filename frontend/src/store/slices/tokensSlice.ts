import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TokenTransaction {
  id: string;
  type: 'earned' | 'spent' | 'transferred';
  amount: number;
  description: string;
  timestamp: string;
}

interface TokensState {
  balance: number;
  transactions: TokenTransaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TokensState = {
  balance: 0,
  transactions: [],
  loading: false,
  error: null,
};

const tokensSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    setBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
    },
    addTokens: (state, action: PayloadAction<number>) => {
      state.balance += action.payload;
    },
    spendTokens: (state, action: PayloadAction<number>) => {
      state.balance -= action.payload;
    },
    addTransaction: (state, action: PayloadAction<TokenTransaction>) => {
      state.transactions.unshift(action.payload);
    },
    setTransactions: (state, action: PayloadAction<TokenTransaction[]>) => {
      state.transactions = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setBalance, 
  addTokens, 
  spendTokens, 
  addTransaction, 
  setTransactions, 
  setLoading, 
  setError 
} = tokensSlice.actions;
export default tokensSlice.reducer; 