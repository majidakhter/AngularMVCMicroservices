export interface TootipOptions {
    position: string;
    popupClass: string;
    margin: number;
    trigger: {
        on: string;
        off?: string;
    };
    dismissable: boolean;
    active: boolean;
}
export const defaultTooltipOptions: TootipOptions = {
    position: "top",
    popupClass: "",
    margin: 11,
    trigger: {
        on: "mouseover",
        off: "mouseout"
    },
    dismissable: true,
    active: true
}
export interface PositionDescription {
    horizontal: string;
    vertical: string;
}