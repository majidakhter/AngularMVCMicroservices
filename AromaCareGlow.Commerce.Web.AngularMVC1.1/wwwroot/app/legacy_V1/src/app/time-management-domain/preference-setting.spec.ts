import { PreferenceSetting, SelfSchedulePeriod } from './preference-setting';

describe('SelfSchedulePeriod', () => {
    const startDate = '2020-01-01';
    const endDate = '2020-01-15';
    const preference = new PreferenceSetting();
    preference.viewedSelfSchedulePeriods.push(new SelfSchedulePeriod(startDate, endDate));
    it('SelfSchedulePeriod constructor should initialize correct values', () => {
        expect(startDate).toEqual(preference.viewedSelfSchedulePeriods[0].startDate);
        expect(endDate).toEqual(preference.viewedSelfSchedulePeriods[0].endDate);
    });
});
