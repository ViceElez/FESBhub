import { Test, TestingModule } from '@nestjs/testing';
import { SubjController } from './subj.controller';
import { SubjService } from './subj.service';

describe('SubjController', () => {
  let controller: SubjController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubjController],
      providers: [SubjService],
    }).compile();

    controller = module.get<SubjController>(SubjController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
