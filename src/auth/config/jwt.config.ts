import { registerAs } from "@nestjs/config";

export default registerAs('jwt', () => ({
  secret: process.env.TOKEN_KEY,
  audience: process.env.JWT_TOKEN_AUDIENCE,
  issuer: process.env.JWT_TOKEN_ISSUER,
  jwtTtl: process.env.JWT_TTL,
}))
