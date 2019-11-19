"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var CustomGridComponent = /** @class */ (function () {
    function CustomGridComponent() {
        this.gridColumns = new Array();
        // inputs
        this.gridData = new Array();
        this.selected = new core_1.EventEmitter();
        this.EntityName = "";
    }
    Object.defineProperty(CustomGridComponent.prototype, "gridDataSet", {
        set: function (_gridData) {
            if (_gridData.length > 0) {
                // Fill column names in gridColumns collection
                if (this.gridColumns.length == 0) {
                    var columnNames = Object.keys(_gridData[0]);
                    this.gridColumns = new Array();
                    for (var index in columnNames) {
                        this.gridColumns.push(columnNames[index]);
                    }
                }
                this.gridData = _gridData;
            }
        },
        enumerable: true,
        configurable: true
    });
    CustomGridComponent.prototype.Select = function (_selected) {
        this.selected.emit(_selected);
    };
    CustomGridComponent.prototype.ngOnInit = function () {
    };
    __decorate([
        core_1.Output("grid-selected"),
        __metadata("design:type", core_1.EventEmitter)
    ], CustomGridComponent.prototype, "selected", void 0);
    __decorate([
        core_1.Input("grid-entityname"),
        __metadata("design:type", String)
    ], CustomGridComponent.prototype, "EntityName", void 0);
    __decorate([
        core_1.Input("grid-data"),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], CustomGridComponent.prototype, "gridDataSet", null);
    CustomGridComponent = __decorate([
        core_1.Component({
            selector: 'customgrid-ui',
            templateUrl: './app/customcomponent/grid-component/customgrid.component.html'
        }),
        __metadata("design:paramtypes", [])
    ], CustomGridComponent);
    return CustomGridComponent;
}());
exports.CustomGridComponent = CustomGridComponent;
//# sourceMappingURL=customgrid.component.js.map