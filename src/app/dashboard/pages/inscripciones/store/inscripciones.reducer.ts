import { createFeature, createReducer, on } from '@ngrx/store';
import { InscripcionesActions } from './inscripciones.actions';

export const inscripcionesFeatureKey = 'inscripciones';

export interface State {

}

export const initialState: State = {

};

export const reducer = createReducer(
  initialState,
  on(InscripcionesActions.loadInscripcioness, state => state),
  on(InscripcionesActions.loadInscripcionessSuccess, (state, action) => state),
  on(InscripcionesActions.loadInscripcionessFailure, (state, action) => state),
);

export const inscripcionesFeature = createFeature({
  name: inscripcionesFeatureKey,
  reducer,
});

