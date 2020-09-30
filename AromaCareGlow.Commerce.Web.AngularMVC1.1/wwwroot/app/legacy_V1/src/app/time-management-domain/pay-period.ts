export class PayPeriod {
    constructor(
        public id: number,
        public beginDate: string,
        public endDate: string,
        public type?: string) {
    }
}
