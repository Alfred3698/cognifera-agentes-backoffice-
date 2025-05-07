export const SERVICE_NAME = 'backoffice-service';
export const MAX_QUESTIONS_PER_DAY = 10;

export enum DbErrorCodes {
  UNIQUE_VIOLATION = '23505', // Violación de clave única
  FOREIGN_KEY_VIOLATION = '23503', // Violación de clave foránea
  NOT_NULL_VIOLATION = '23502', // Violación de restricción NOT NULL
  CHECK_VIOLATION = '23514', // Violación de restricción CHECK
}
