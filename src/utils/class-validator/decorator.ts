import { registerDecorator, ValidationOptions } from 'class-validator';
import {
  IsMoneyConstraint,
  IsIsoDateConstraint,
  IsVarcharConstraint,
  CheckDigitsConstraint,
} from './constraint';

export function IsMoney(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isMoney',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsMoneyConstraint,
    });
  };
}

export function IsIsoDate(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsIsoDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsIsoDateConstraint,
    });
  };
}

export function IsVarchar(
  length: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsVarchar',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [length], // Pass the length as a constraint
      validator: IsVarcharConstraint,
    });
  };
}

export function CheckDigits(
  length: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'CheckDigits',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [length], // Pass the length as a constraint
      validator: CheckDigitsConstraint,
    });
  };
}
