import { TestBed } from '@angular/core/testing';

import { ApoderadoService } from './apoderado.service';

describe('ApoderadoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApoderadoService = TestBed.get(ApoderadoService);
    expect(service).toBeTruthy();
  });
});
