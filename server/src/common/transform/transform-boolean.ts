import { Transform } from "class-transformer";

const optionalBooleanMapper = new Map([
  ["undefined", undefined],
  ["null", null],
  ["true", true],
  ["false", false],
]);

export const TransformBoolean = () =>
  Transform(({ key, obj }) => {
    if (
      obj?.[key] === undefined ||
      obj?.[key] === null ||
      typeof obj?.[key] === "boolean"
    ) {
      return obj?.[key];
    }

    return optionalBooleanMapper.get(obj?.[key]);
  });
