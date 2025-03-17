import { IsNumberString, IsNotEmpty, IsNumber } from 'class-validator';

export class PropertiesFindParams {
  @IsNumberString()
  id: number;
}
