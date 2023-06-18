import { loggerInfo } from '../utils';

export enum ParamDecorator {
  HIDE = 'HIDE',
}

export function logMethod(param?: ParamDecorator) {
  return function (target: Record<string, any>, method: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const targetMethod = descriptor.value;
    const className = target?.constructor?.name;

    descriptor.value = function (...args: unknown[]): unknown {
      if (param === ParamDecorator.HIDE) {
        loggerInfo(`[INIT][${className}][${method}]`);
      } else {
        loggerInfo(`[INIT][${className}][${method}]`, args);
      }
      try {
        return targetMethod.apply(this, args);
      } catch (error) {
        loggerInfo(`[EXCEPTION][${className}][${method}]`, error);
        throw error;
      }
    };

    return descriptor;
  };
}
