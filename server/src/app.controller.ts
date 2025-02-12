import { Controller, Get } from "@nestjs/common";
import { HealthCheck, HealthCheckResult } from "@nestjs/terminus";
import { AppService } from "./app.service";
import { ApiResponse } from "@nestjs/swagger";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get("health")
  @HealthCheck()
  @ApiResponse({ status: 200, description: "Health check successful." })
  healthCheck(): Promise<HealthCheckResult> {
    return this.appService.healthCheck();
  }
}
