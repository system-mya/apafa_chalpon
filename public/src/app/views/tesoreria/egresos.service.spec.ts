import { TestBed } from '@angular/core/testing';

import { EgresosService } from './egresos.service';

describe('EgresosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EgresosService = TestBed.get(EgresosService);
    expect(service).toBeTruthy();
  });
});
