

import * as moment from 'moment';
import { TimeSpan } from './time-span';
import * as _ from 'lodash';
import { duration } from 'moment';

describe('Time span data model', () => {
  describe('When constructed with a start and end time', () => {
    let span: TimeSpan;
    beforeEach(() => {
      span = new TimeSpan(moment(), moment().add(8, 'hours'));
    });

    it('should calculate duration', () => {
      expect(Math.round(span.duration.asHours())).toBe(8);
    });
  });

  describe('When constructed with a start and duration', () => {
    let span: TimeSpan;
    beforeEach(() => {
      span = TimeSpan.fromDuration(moment(), duration(8, 'hours'));
    });

    it('should set the correct end time', () => {
      expect(span.end.diff(span.start)).toBe(8 * 60 * 60 * 1000);
    });
  });

  function ezSpan(startHour: number, endHour: number): TimeSpan {
    return new TimeSpan(
      moment('2015-01-01 00:00').add(startHour),
      moment('2015-01-01 00:00').add(endHour)
    );
  }

  describe('When merging with another', () => {
    let span8to10: TimeSpan;
    let span9to16: TimeSpan;
    let span9to11: TimeSpan;
    let span11to14: TimeSpan;
    let span11to16: TimeSpan;
    beforeEach(() => {
      span8to10 = ezSpan(8, 10);
      span9to16 = ezSpan(9, 16);
      span9to11 = ezSpan(9, 11);
      span11to14 = ezSpan(11, 14);
      span11to16 = ezSpan(11, 16);
    });

    describe('when attempting to merge time spans with partial overlap', () => {
      let merge1: TimeSpan, merge2: TimeSpan;
      beforeEach(() => {
        merge1 = span9to16.tryMergeWith(span8to10);
        merge2 = span8to10.tryMergeWith(span9to16);
      });
      it('should merge 9 to 16 with 8 to 10', () => {
        expect(merge1.start.isSame(span8to10.start)).toBeTruthy();
        expect(merge1.end.isSame(span9to16.end)).toBeTruthy();
      });
      it('should merge symmetrically', () => {
        expect(merge1.start.isSame(merge2.start)).toBeTruthy();
        expect(merge1.end.isSame(merge2.end)).toBeTruthy();
      });
      it('should indicate a collision', () => {
        expect(span9to16.collidesWith(span8to10)).toBeTruthy();
      });
    });

    describe('when attempting to merge time spans with complete overlap', () => {
      let merge1: TimeSpan, merge2: TimeSpan;
      beforeEach(() => {
        merge1 = span9to16.tryMergeWith(span11to14);
        merge2 = span11to14.tryMergeWith(span9to16);
      });
      it('should merge 9 to 16 with 11 to 14', () => {
        expect(merge1.start.isSame(span9to16.start)).toBeTruthy();
        expect(merge1.end.isSame(span9to16.end)).toBeTruthy();
      });
      it('should merge symmetrically', () => {
        expect(merge1.start.isSame(merge2.start)).toBeTruthy();
        expect(merge1.end.isSame(merge2.end)).toBeTruthy();
      });
      it('should indicate a collision', () => {
        expect(span9to16.collidesWith(span11to14)).toBeTruthy();
      });
    });

    describe('when attempting to merge time spans only touching each other', () => {
      let merge1: TimeSpan, merge2: TimeSpan;
      beforeEach(() => {
        merge1 = span9to11.tryMergeWith(span11to16);
        merge2 = span11to16.tryMergeWith(span9to11);
      });
      it('should not merge 9 to 11 with 11 to 16', () => {
        expect(merge1.start.isSame(span9to11.start)).toBeTruthy();
        expect(merge1.end.isSame(span11to16.end)).toBeTruthy();
      });
      it('should merge symmetrically', () => {
        expect(merge1.start.isSame(merge2.start)).toBeTruthy();
        expect(merge1.end.isSame(merge2.end)).toBeTruthy();
      });
      it('should not indicate a collision', () => {
        expect(span9to11.collidesWith(span11to16)).toBeFalsy();
      });
    });

    describe('when attempting to merge time spans sharing the same start time', () => {
      let merge1: TimeSpan, merge2: TimeSpan;
      beforeEach(() => {
        merge1 = span9to16.tryMergeWith(span9to11);
        merge2 = span9to11.tryMergeWith(span9to16);
      });
      it('should merge 9 to 16 with 9 to 11', () => {
        expect(merge1.start.isSame(span9to16.start)).toBeTruthy();
        expect(merge1.end.isSame(span9to16.end)).toBeTruthy();
      });
      it('should merge symmetrically', () => {
        expect(merge1.start.isSame(merge2.start)).toBeTruthy();
        expect(merge1.end.isSame(merge2.end)).toBeTruthy();
      });
      it('should indicate a collision', () => {
        expect(span9to16.collidesWith(span9to11)).toBeTruthy();
      });
    });

    describe('when attempting to merge time spans sharing the same end time', () => {
      let merge1: TimeSpan, merge2: TimeSpan;
      beforeEach(() => {
        merge1 = span9to16.tryMergeWith(span11to16);
        merge2 = span11to16.tryMergeWith(span9to16);
      });
      it('should merge 9 to 16 with 11 to 16', () => {
        expect(merge1.start.isSame(span9to16.start)).toBeTruthy();
        expect(merge1.end.isSame(span9to16.end)).toBeTruthy();
      });
      it('should merge symmetrically', () => {
        expect(merge1.start.isSame(merge2.start)).toBeTruthy();
        expect(merge1.end.isSame(merge2.end)).toBeTruthy();
      });
      it('should indicate a collision', () => {
        expect(span9to16.collidesWith(span11to16)).toBeTruthy();
      });
    });

    describe('when attempting to merge completely seperate time spans', () => {
      let merge1: TimeSpan, merge2: TimeSpan;
      beforeEach(() => {
        merge1 = span8to10.tryMergeWith(span11to14);
        merge2 = span11to14.tryMergeWith(span8to10);
      });
      it('should not merge 8 to 10 with 11 to 14', () => {
        expect(merge1).toBeNull();
        expect(merge2).toBeNull();
      });
      it('should indicate no a collision', () => {
        expect(span8to10.collidesWith(span11to14)).toBeFalsy();
      });
    });
  });

  describe('When attempting to reduce a list of time spans', () => {
    let toBeMerged: TimeSpan[];
    let mergedSpans: TimeSpan[];
    beforeEach(() => {
      toBeMerged = [
        ezSpan(8, 10),
        ezSpan(9, 16),
        ezSpan(9, 11),
        ezSpan(11, 14),
        ezSpan(11, 16),
        ezSpan(17, 20),
        ezSpan(20, 23),
        ezSpan(25, 30)
      ];

      mergedSpans = TimeSpan.mergeReduceTimeSpans(_.shuffle(toBeMerged));
    });

    it('should reduce to the minumum number of spans', () => {
      expect(mergedSpans.length).toBe(3);
    });

    it('should reduce to the correct spans', () => {
      mergedSpans = mergedSpans.sort((a, b) => a.start.diff(b.start));
      expect(mergedSpans[0].start.isSame(toBeMerged[0].start)).toBeTruthy();
      expect(mergedSpans[0].end.isSame(toBeMerged[4].end)).toBeTruthy();

      expect(mergedSpans[1].start.isSame(toBeMerged[5].start)).toBeTruthy();
      expect(mergedSpans[1].end.isSame(toBeMerged[6].end)).toBeTruthy();

      expect(mergedSpans[2].start.isSame(toBeMerged[7].start)).toBeTruthy();
      expect(mergedSpans[2].end.isSame(toBeMerged[7].end)).toBeTruthy();
    });
  });
});
