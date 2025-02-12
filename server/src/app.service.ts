import { Injectable } from "@nestjs/common";
import {
  HealthCheckResult,
  HealthCheckService,
  SequelizeHealthIndicator,
} from "@nestjs/terminus";

@Injectable()
export class AppService {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: SequelizeHealthIndicator
  ) {}

  getHello(): string {
    return "Hello World!";
  }

  async healthCheck(): Promise<HealthCheckResult> {
    const result = await this.health.check([
      () => this.db.pingCheck("database", { timeout: 3000 }), // Đặt timeout ở đây
    ]);
    return result;
  }
}
