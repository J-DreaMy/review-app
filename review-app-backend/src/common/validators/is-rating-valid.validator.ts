import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsRatingValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidRating',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (Number.isInteger(value)) return true;
          return value % 1 == 0.5;
        },
        defaultMessage() {
          return 'The rating only support half stars';
        }
      },
    });
  };
}
