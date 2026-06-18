import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  name: string;

  @IsString()
  block: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  captainName?: string;

  @IsOptional()
  @IsString()
  captainUrl?: string;

  @IsOptional()
  @IsString()
  viceCaptainName?: string;

  @IsOptional()
  @IsString()
  viceCaptainUrl?: string;

  @IsUUID()
  editionId: string;
}
