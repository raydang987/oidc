/* eslint-disable prettier/prettier */
import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsDateFormat(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDateFormat',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;

          // Kiểm tra định dạng dd-mm-yyyy
          const regex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{4})$/;
          return regex.test(value);
        },
        defaultMessage() {
          return 'Ngày sinh phải có định dạng dd-mm-yyyy';
        },
      },
    });
  };
}
