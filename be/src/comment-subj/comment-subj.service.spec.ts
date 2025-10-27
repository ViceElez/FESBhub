import { Test, TestingModule } from '@nestjs/testing';
import { CommentSubjService } from './comment-subj.service';

describe('CommentSubjService', () => {
  let service: CommentSubjService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentSubjService],
    }).compile();

    service = module.get<CommentSubjService>(CommentSubjService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
