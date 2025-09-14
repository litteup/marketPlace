import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import {
  ApiResponseDto,
  PaginatedResponseDto,
} from 'src/common/utils/response.util';

export class UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  full_name: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  profile_picture: string;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  seller_badge: boolean;

  @ApiProperty()
  avg_rating: number;

  @ApiProperty()
  rating_count: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

@ApiExtraModels(UserDto)
export class UserResponseDto extends ApiResponseDto<UserDto> {
  @ApiProperty({ type: () => UserDto })
  declare data: UserDto;
}

@ApiExtraModels(UserDto)
export class UserPaginatedResponseDto extends PaginatedResponseDto<UserDto> {
  @ApiProperty({ type: () => [UserDto] })
  declare data: UserDto[];
}
