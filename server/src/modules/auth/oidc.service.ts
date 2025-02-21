import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { JWK, importJWK } from "jose";
import { lastValueFrom } from "rxjs";
import { OIDCConfigurationResDto } from "./dto/OIDCConfigurationRes.dto";

@Injectable()
export class OIDCService {
  constructor(
    private readonly logger: Logger,
    private readonly httpService: HttpService
  ) {}

  public async loadOpenidConfiguration(
    iss: string
  ): Promise<OIDCConfigurationResDto> {
    console.log(3);
    const oidcConfigurationRes = await lastValueFrom(
      this.httpService.get(`${iss}/.well-known/openid-configuration`)
    );
    console.log(4);
    const config = oidcConfigurationRes.data as OIDCConfigurationResDto;
    return config;
  }

  public async loadPublicKeyFromIssuer(iss: string, kid: string, alg: string) {
    const oidcConfigurationRes = await lastValueFrom(
      this.httpService.get(`${iss}/.well-known/openid-configuration`)
    );
    const { jwks_uri: jwksUri } = oidcConfigurationRes.data;
    const jwksRes = await lastValueFrom(this.httpService.get(jwksUri));

    this.logger.debug(
      `secretOrKeyProvider - get secret key from ${jwksUri}, res: ${JSON.stringify(
        jwksRes.data
      )}`,
      OIDCService.name
    );

    const jwks = jwksRes.data["keys"] as JWK[];
    const jwk = jwks.find((item) => item.kid === kid) as JWK;

    const publicKey = await importJWK(jwk, alg);

    return publicKey;
  }

  public async getUserInfo(iss: string, token: string) {
    const oidcConfigurationRes = await lastValueFrom(
      this.httpService.get(`${iss}/.well-known/openid-configuration`)
    );
    const { userinfo_endpoint: userInfoUrl } = oidcConfigurationRes.data;

    const userInfoRes = await lastValueFrom(
      this.httpService.get(userInfoUrl, {
        headers: { Authorization: `Bearer ${token}` },
      })
    );

    this.logger.debug(`userInfoRes: ${JSON.stringify(userInfoRes.data)}`);

    return userInfoRes.data;
  }
}
