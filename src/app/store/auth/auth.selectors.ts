import { createFeatureSelector, createSelector } from "@ngrx/store";
import { authFeatureKey, authState } from "./auth.reducer";


export const selectAuthState = createFeatureSelector<authState>(authFeatureKey)

export const selectAuthUser = createSelector(
  selectAuthState,
  (state)=> state.authUser
)
