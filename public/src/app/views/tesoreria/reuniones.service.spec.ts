import { TestBed } from '@angular/core/testing';

import { ReunionesService } from './reuniones.service';

describe('ReunionesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReunionesService = TestBed.get(ReunionesService);
    expect(service).toBeTruthy();
  });
});
