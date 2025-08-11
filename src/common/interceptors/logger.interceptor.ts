import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {

    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const now = new Date();

    console.log(`${method} ${url} - inicio da Requisição em ${now.toISOString()}`);
    return next.handle().pipe(
      tap(() => {
        console.log(`${method} ${url} - ${new Date().getTime() - now.getTime()}ms`);
      })
    )

  }
}