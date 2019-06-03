import { TestBed } from '@angular/core/testing';

import { GradoSeccionService } from './grado-seccion.service';

describe('GradoSeccionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GradoSeccionService = TestBed.get(GradoSeccionService);
    expect(service).toBeTruthy();
  });
});
