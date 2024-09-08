import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define interfaces for nested structures
export interface ILevel {
  id: string;
  name: string;
  badge: string;
  min_bet: number;
  free_claims: number;
}

export interface IPlayer {
  id: string;
  credits: number;
  gamesWon: number;
  gamesLost: number;
  gamesPlayed: number;
  exp: number;
  level: ILevel;
}

export interface IUserState {
  id?: string;
  username?: string;
  email?: string;
  avatar?: string;
  isAdmin?: boolean;
  player?: IPlayer; // Relación con el player
  createdAt?: string;
  updatedAt?: string;
}

// Estado inicial actualizado
const initialState: IUserState = {
  id: undefined,
  username: undefined,
  email: undefined,
  avatar: undefined,
  isAdmin: undefined,
  player: undefined,
  createdAt: undefined,
  updatedAt: undefined,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserState: (state, action: PayloadAction<Partial<IUserState>>) => {
      return { ...state, ...action.payload };
    },
    setEmailState: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setUsernameState: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    clearUserState: (state) => {
      state.id = undefined;
      state.username = undefined;
      state.email = undefined;
      state.avatar = undefined;
      state.isAdmin = undefined;
      state.player = undefined;
      state.createdAt = undefined;
      state.updatedAt = undefined;
    },
  },
});

export const {
  setUserState,
  setEmailState,
  setUsernameState,
  clearUserState,
} = userSlice.actions;
export const userReducer = userSlice.reducer;
