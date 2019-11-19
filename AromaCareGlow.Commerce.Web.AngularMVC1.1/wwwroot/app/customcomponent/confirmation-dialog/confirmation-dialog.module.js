"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var common_1 = require("@angular/common");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var confirmation_dialog_component_1 = require("../../customcomponent/confirmation-dialog/confirmation-dialog.component");
var confirmation_dialog_service_1 = require("../../customcomponent/confirmation-dialog/confirmation-dialog.service");
var ConfirmationDialogModule = /** @class */ (function () {
    function ConfirmationDialogModule() {
    }
    ConfirmationDialogModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                ng_bootstrap_1.NgbModule.forRoot(),
            ],
            declarations: [
                confirmation_dialog_component_1.ConfirmationDialogComponent
            ],
            providers: [
                confirmation_dialog_service_1.ConfirmationDialogService
            ],
            entryComponents: [confirmation_dialog_component_1.ConfirmationDialogComponent]
        })
    ], ConfirmationDialogModule);
    return ConfirmationDialogModule;
}());
exports.ConfirmationDialogModule = ConfirmationDialogModule;
//# sourceMappingURL=confirmation-dialog.module.js.map