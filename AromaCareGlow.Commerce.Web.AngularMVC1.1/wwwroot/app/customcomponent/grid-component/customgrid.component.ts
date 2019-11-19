import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";

@Component({
    selector: 'customgrid-ui',
    templateUrl:'./app/customcomponent/grid-component/customgrid.component.html'
})
export class CustomGridComponent implements OnInit {
    gridColumns: Array<Object> = new Array<Object>();
    // inputs
    gridData: Array<Object> = new Array<Object>();
    @Output("grid-selected") selected: EventEmitter<Object> = new EventEmitter<Object>();
    @Input("grid-entityname") EntityName: string = "";
    @Input("grid-data")
    set gridDataSet(_gridData: Array<Object>) {

        if (_gridData.length > 0) {
            // Fill column names in gridColumns collection
            if (this.gridColumns.length == 0) {
                var columnNames = Object.keys(_gridData[0]);
                this.gridColumns = new Array<Object>();
                for (var index in columnNames) {
                    this.gridColumns.push(columnNames[index]);
                }
            }
            this.gridData = _gridData;
        }
    }
    Select(_selected: Object) {
        this.selected.emit(_selected);
    }
    constructor() {

    }
    ngOnInit() {

    }
}