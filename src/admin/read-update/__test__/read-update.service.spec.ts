import { Test, TestingModule } from '@nestjs/testing';
import { ReadUpdateService } from './read-update.service';

describe('ReadUpdateService', () => {
  let service: ReadUpdateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReadUpdateService],
    }).compile();

    service = module.get<ReadUpdateService>(ReadUpdateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
