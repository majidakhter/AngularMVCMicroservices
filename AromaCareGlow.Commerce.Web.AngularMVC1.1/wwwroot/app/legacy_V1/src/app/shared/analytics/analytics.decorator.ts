

interface ITrackingInfo {
  page: string;
}

interface IDictionary {
  [Key: string]: string;
}

export function TrackPage(trackingInfo: ITrackingInfo): ClassDecorator {
  return (constructor: any) => {
    constructor.prototype.trackPageAs = trackingInfo.page;
  };
}

export function TrackTab(propMappings?: IDictionary): PropertyDecorator {
  return (target: any, key: string) => {
    target.trackTabWith = { key: key };
    if (propMappings) {
      target.trackTabWith.mappings = propMappings;
    }
  };
}
