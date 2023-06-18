import { generateLocalDatePeriod } from '../../src/utils';

describe('format date util', () => {
  it('should generate a period from two dates', () => {
    const { startDate, endDate } = generateLocalDatePeriod(
      new Date('2022-06-04T04:35:32.123Z'),
      new Date('2022-06-05T15:35:32.456Z'),
    );

    expect(startDate).toEqual(new Date('2022-06-04T03:00:00.000Z'));
    expect(endDate).toEqual(new Date('2022-06-06T02:59:59.999Z'));
  });
});
