import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Pattern {
  id: string;
  hash: string;
  language: string;
  domain: string;
  complexity: number;
  tokensEarned: number;
  createdAt: string;
}

interface PatternsState {
  patterns: Pattern[];
  loading: boolean;
  error: string | null;
  totalContributions: number;
  totalTokensEarned: number;
}

const initialState: PatternsState = {
  patterns: [],
  loading: false,
  error: null,
  totalContributions: 0,
  totalTokensEarned: 0,
};

const patternsSlice = createSlice({
  name: 'patterns',
  initialState,
  reducers: {
    setPatterns: (state, action: PayloadAction<Pattern[]>) => {
      state.patterns = action.payload;
      state.error = null;
    },
    addPattern: (state, action: PayloadAction<Pattern>) => {
      state.patterns.push(action.payload);
      state.totalContributions += 1;
      state.totalTokensEarned += action.payload.tokensEarned;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setStats: (state, action: PayloadAction<{ contributions: number; tokens: number }>) => {
      state.totalContributions = action.payload.contributions;
      state.totalTokensEarned = action.payload.tokens;
    },
  },
});

export const { setPatterns, addPattern, setLoading, setError, setStats } = patternsSlice.actions;
export default patternsSlice.reducer; 