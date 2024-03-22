import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as R from 'ramda';

@ValidatorConstraint({ name: 'isMoney', async: false })
export class IsMoneyConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    // Customize this logic based on your specific "money" type requirements
    // Here, we assume that the "money" type should be a positive number with up to two decimal places
    const regex = /^\d+(\.\d{1,2})?$/;
    return regex.test(value);
  }
}

@ValidatorConstraint({ name: 'IsIsoDate', async: false })
export class IsIsoDateConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    if (R.isNil(value) || R.isEmpty(value)) return true;
    else {
      if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(value)) {
        return false;
      }

      const d = new Date(value);
      return (
        d instanceof Date && d.toISOString() === value && !isNaN(d.getTime())
      );
    }
  }
}

@ValidatorConstraint({ name: 'IsVarchar', async: false })
export class IsVarcharConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const length = args.constraints[0]; // Get the length from the constraint

    if (typeof value === 'string' && value.length <= length) {
      return true;
    }

    return false;
  }
}

@ValidatorConstraint({ name: 'IsFiveDigits', async: false })
export class CheckDigitsConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const length = args.constraints[0]; // Get the length from the constraint

    let _value = value;
    if (typeof _value === 'string') {
      _value = Number(_value);
    }
    if (isNaN(_value)) {
      return false;
    }

    const stringValue = String(_value);
    return stringValue.length === length && /^\d+$/.test(stringValue);
  }
}
