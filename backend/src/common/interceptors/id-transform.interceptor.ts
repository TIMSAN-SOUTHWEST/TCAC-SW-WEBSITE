import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Adds `_id` field as an alias for `id` in all responses.
 * This ensures backward compatibility with frontend code that references `_id` (from MongoDB era).
 */
@Injectable()
export class IdTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => this.transformIds(data)),
    );
  }

  private transformIds(data: any): any {
    if (data === null || data === undefined) return data;

    if (Array.isArray(data)) {
      return data.map((item) => this.transformIds(item));
    }

    if (typeof data === 'object' && data !== null) {
      const transformed = { ...data };

      // Add _id alias if `id` exists
      if (transformed.id && !transformed._id) {
        transformed._id = transformed.id;
      }

      // Recursively transform nested objects
      for (const key of Object.keys(transformed)) {
        if (typeof transformed[key] === 'object' && transformed[key] !== null && key !== '_id') {
          transformed[key] = this.transformIds(transformed[key]);
        }
      }

      return transformed;
    }

    return data;
  }
}
