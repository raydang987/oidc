import * as bcrypt from "bcrypt";

export function generateOtpCode(length: number = 6): string {
  if (process.env.OTP_ENABLED === "true") {
    return generateNumberCode(length);
  }
  return "1".repeat(length);
}

export function generateNumberCode(length: number): string {
  return Math.floor(
    Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)
  ).toString();
}

export function formatNumber(number: number, locale?: string): string {
  return new Intl.NumberFormat(locale ?? "en-US").format(number);
}

export function b64Encode(value: string): string {
  return Buffer.from(value, "utf8").toString("base64");
}

export function b64Decode(value: string): string {
  return Buffer.from(value, "base64").toString("utf8");
}

export function hash(data: string | Buffer): string {
  return bcrypt.hashSync(data, 10);
}

export function compareHash(data: string | Buffer, encrypted: string): boolean {
  return bcrypt.compareSync(data, encrypted);
}

export function removeSpecialCharacters(keyword: string): string {
  if (!keyword) {
    return "";
  }

  return keyword
    .toLowerCase()
    .replace("đ", "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, " ")
    .replace(/\\s+/g, " ")
    .trim();
}

export function formatSqlDate(date: Date): string {
  return date.toISOString();
}
