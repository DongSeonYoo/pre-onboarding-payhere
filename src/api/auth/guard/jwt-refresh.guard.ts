import { AuthGuard } from '@nestjs/passport';

export class JwtRefreshGurad extends AuthGuard('jwt-refresh') {}
