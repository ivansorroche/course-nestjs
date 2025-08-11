import { CallHandler, ExecutionContext, NestInterceptor, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class BodyCreaterTaskInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;

    console.log(`Intercepting request: ${method} ${url}`);
    console.log('Request body:', body);

    return next.handle()
  }

}