import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminGuard implements CanActivate{
    constructor(private readonly prisma:PrismaService){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const userPayload = request.user;
        if(!userPayload || !userPayload.sub){
            throw new ForbiddenException('Not authorized');
        }

        // Fast-path: if JWT payload already contains isAdmin, trust it (avoids DB lookup)
        if (typeof userPayload.isAdmin === 'boolean'){
            if (!userPayload.isAdmin) {
                throw new ForbiddenException('Admin privileges required');
            }
            return true;
        }

        // Fallback: check DB (keeps current behavior if token doesn't include isAdmin)
        const user = await this.prisma.user.findUnique({where:{id:userPayload.sub}});
        if(!user || !user.isAdmin){
            throw new ForbiddenException('Admin privileges required');
        }
        return true;
    }
}
