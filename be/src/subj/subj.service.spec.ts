import { Test, TestingModule } from '@nestjs/testing';
import { SubjService } from './subj.service';

describe('SubjService', () => {
  let service: SubjService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubjService],
    }).compile();

    service = module.get<SubjService>(SubjService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
