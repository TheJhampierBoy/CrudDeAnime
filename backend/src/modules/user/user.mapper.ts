import { UserRequestDto } from './dto/user-request.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserEntity } from './entities/user.entity';

export class UserMapper {
  static toEntity(dto: UserRequestDto): UserEntity {
    const entity = new UserEntity();
    entity.name = dto.name;
    return entity;
  }

  static toResponse(entity: UserEntity): UserResponseDto {
    const response = new UserResponseDto();
    response.id = entity.id;
    response.name = entity.name;
    response.created_at = entity.created_at;
    return response;
  }

  static toResponseList(entities: UserEntity[]): UserResponseDto[] {
    return entities.map((entity) => UserMapper.toResponse(entity));
  }
}
