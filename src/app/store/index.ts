import { ActionReducerMap } from "@ngrx/store";
import { authFeatureKey, authReducer } from "./auth/auth.reducer";

export interface AppState{
  //TODO
  [authFeatureKey]: any
}

export const actionReducerMap: ActionReducerMap<AppState> ={
  [authFeatureKey]:authReducer
}
