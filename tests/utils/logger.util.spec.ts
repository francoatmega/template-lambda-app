import { loggerError, loggerInfo, logger } from '../../src/utils';

describe('logger util', () => {
  it('should successfuly log an info', () => {
    const infoSpy = jest.spyOn(logger, 'info');
    const message = { test: 1 };
    const label = '[UNIT][TEST][INFO]';

    loggerInfo(label, message);

    expect(infoSpy).toHaveBeenCalledWith({
      label,
      message,
      environment: 'test',
      date: expect.any(Date),
    });
  });

  it('should successfuly log an info without message', () => {
    const infoSpy = jest.spyOn(logger, 'info');
    const label = '[UNIT][TEST][INFO]';

    loggerInfo(label);

    expect(infoSpy).toHaveBeenCalledWith({
      label,
      message: undefined,
      environment: 'test',
      date: expect.any(Date),
    });
  });

  it('should successfuly log an error', () => {
    const errorSpy = jest.spyOn(logger, 'error');
    const error = { message: 'fail' };
    const label = '[UNIT][TEST][ERROR]';

    loggerError(label, error);

    expect(errorSpy).toHaveBeenCalledWith({
      label,
      message: error,
      environment: 'test',
      date: expect.any(Date),
    });
  });
});
