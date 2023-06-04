import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const InscripcionesActions = createActionGroup({
  source: 'Inscripciones',
  events: {
    'Load Inscripcioness': emptyProps(),
    'Load Inscripcioness Success': props<{ data: unknown }>(),
    'Load Inscripcioness Failure': props<{ error: unknown }>(),
  }
});
