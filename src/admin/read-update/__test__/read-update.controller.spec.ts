import { Test, TestingModule } from '@nestjs/testing';
import { ReadUpdateController } from './read-update.controller';

describe('ReadUpdateController', () => {
  let controller: ReadUpdateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReadUpdateController],
    }).compile();

    controller = module.get<ReadUpdateController>(ReadUpdateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
