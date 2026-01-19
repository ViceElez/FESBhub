import {CanActivate, ExecutionContext, UnauthorizedException} from "@nestjs/common";
import {Observable} from "rxjs";
import {Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {Request} from "express";


@Injectable()
export class UserGuard implements CanActivate{
    constructor(private jwtService:JwtService) {}
    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request=context.switchToHttp().getRequest();
        const token=this.extractTokenFromHeader(request);
        if(!token){
            throw new UnauthorizedException
                ('Invalid Token');
        }

        try{
            const payload=this.jwtService.verify(token);
            request['user'] = payload;
            return true;
        }catch (e){
            throw new UnauthorizedException('Invalid Token');
        }
    }

    private extractTokenFromHeader(request:Request):string | undefined{
        return request.headers.authorization?.split(' ')[1];
    }
}