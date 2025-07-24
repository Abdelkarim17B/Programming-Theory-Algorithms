import { TestBed } from '@angular/core/testing';

import { ArticulationService } from './articulation.service';

describe('ArticulationService', () => {
  let service: ArticulationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticulationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
