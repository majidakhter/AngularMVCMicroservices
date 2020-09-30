
import { TrackPage, TrackTab } from './analytics.decorator';

describe('PageTrack Decorator', () => {
  it('should add trackPageAs property to class prototype when @TrackPage is applied to class', () => {
    @TrackPage({ page: 'testPage' })
    class TestClass { }
    const testClass = new TestClass();
    expect(testClass.constructor.prototype.trackPageAs).toEqual('testPage');
  });

  it('should add trackTabWith key property to class prototype when @TrackTab is applied to prop', () => {
    class TestClass {
      @TrackTab()
      testProp: string;
    }
    const testClass = new TestClass();
    expect(testClass.constructor.prototype.trackTabWith.key).toEqual('testProp');
  });

  it('should add trackTabWith key, mappings properties to class prototype when @TrackTab is applied to prop', () => {
    class TestClass {
      @TrackTab({
        testMap: 'testMap'
      })
      testProp: string;
    }
    const testClass = new TestClass();
    expect(testClass.constructor.prototype.trackTabWith.key).toEqual('testProp');
    expect(testClass.constructor.prototype.trackTabWith.mappings).toEqual({
      testMap: 'testMap'
    });
  });
});
