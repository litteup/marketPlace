// import { ApiProperty } from '@nestjs/swagger';
// import { IsNumberString, IsOptional, IsString } from 'class-validator';

// export class UserQueryDto {
//   @ApiProperty({
//     description: 'Search term for user name or email',
//     required: false,
//     example: 'john',
//   })
//   @IsOptional()
//   @IsString()
//   search?: string;

//   @ApiProperty({
//     description: 'Page number for pagination',
//     required: false,
//     example: '1',
//   })
//   @IsOptional()
//   @IsNumberString()
//   page?: string;

//   @ApiProperty({
//     description: 'Number of users per page',
//     required: false,
//     example: '10',
//   })
//   @IsOptional()
//   @IsNumberString()
//   limit?: string;
// }

// src/user/dto/user-query.dto.ts
import { IsOptional, IsString } from 'class-validator';
import { BaseFilterDto } from 'src/common/dto/base-filter.dto';

export class UserQueryDto extends BaseFilterDto {
  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
