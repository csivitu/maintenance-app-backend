import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsFutureDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(value: any, args: ValidationArguments) {
          const dateValue = new Date(value);
          const now = new Date();
          // Adjust UTC to IST (UTC + 5:30)
          const istNow = Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            now.getUTCHours() + 5,
            now.getUTCMinutes() + 30,
            now.getUTCSeconds(),
            now.getUTCMilliseconds(),
          );
          return (
            dateValue instanceof Date &&
            !isNaN(dateValue.getTime()) &&
            dateValue.getTime() > istNow
          );
        },
      },
    });
  };
}
