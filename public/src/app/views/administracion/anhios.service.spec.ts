import { TestBed } from '@angular/core/testing';

import { AnhiosService } from './anhios.service';

describe('AnhiosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnhiosService = TestBed.get(AnhiosService);
    expect(service).toBeTruthy();
  });
});
