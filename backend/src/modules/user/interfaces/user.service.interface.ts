import { UserRequestDto } from '../dto/user-request.dto';
import { UserResponseDto } from '../dto/user-response.dto';

export interface IUserService {
  findAll(): Promise<UserResponseDto[]>;
  findById(id: number): Promise<UserResponseDto>;
  create(dto: UserRequestDto): Promise<UserResponseDto>;
  update(id: number, dto: UserRequestDto): Promise<UserResponseDto>;
  remove(id: number): Promise<void>;
}
