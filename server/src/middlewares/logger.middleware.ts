import { HttpStatus, Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { colors } from "src/common/colors";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger("HTTP");

  use(request: Request, response: Response, next: NextFunction): void {
    const startAt = process.hrtime();
    const { ip, method, originalUrl, body } = request;
    const userAgent = request.get("user-agent") || "";

    response.on("finish", () => {
      const { statusCode } = response;
      const diff = process.hrtime(startAt);
      const responseTime = diff[0] * 1e3 + diff[1] * 1e-6;

      const listStatus = [
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpStatus.BAD_REQUEST,
      ];
      if (
        listStatus.includes(statusCode) &&
        body &&
        Object.keys(body).length !== 0
      ) {
        this.logger.log(
          `${colors.FgCyan}PAYLOAD ${colors.FgMagenta}${JSON.stringify(body)}`
        );
      }
      this.logger.log(
        `${colors.FgCyan}${method} ${colors.FgGreen}${originalUrl} ${
          [HttpStatus.OK, HttpStatus.NOT_MODIFIED].includes(statusCode)
            ? colors.FgYellow
            : colors.FgRed
        }${statusCode} ${colors.FgGreen}- ${colors.FgBlue}${userAgent} ${
          colors.FgMagenta
        }${ip} ${colors.FgYellow}+${responseTime.toFixed(0)}ms`
      );
    });

    next();
  }
}
