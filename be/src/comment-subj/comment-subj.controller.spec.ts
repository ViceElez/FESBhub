import { Test, TestingModule } from '@nestjs/testing';
import { CommentSubjController } from './comment-subj.controller';
import { CommentSubjService } from './comment-subj.service';

describe('CommentSubjController', () => {
  let controller: CommentSubjController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentSubjController],
      providers: [CommentSubjService],
    }).compile();

    controller = module.get<CommentSubjController>(CommentSubjController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
