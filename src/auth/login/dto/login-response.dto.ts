import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/common/utils/response.util';

export class LoginResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  full_name: string | null;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;

  @ApiProperty({ required: false })
  phone_number?: string | null;

  @ApiProperty({ required: false })
  pic?: string | null;

  @ApiProperty()
  verification_status: string;
}

@ApiExtraModels(LoginResponse)
export class LoginResponseDto extends ApiResponseDto<LoginResponse> {
  @ApiProperty({ type: () => LoginResponse })
  declare data: LoginResponse;
}
