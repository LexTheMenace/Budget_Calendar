import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-calendar-day",
  templateUrl: "./calendar-day.component.html",
  styleUrls: ["./calendar-day.component.scss"],
})
export class CalendarDayComponent implements OnInit {
  @Input() date!: any;
  @Input() balance!: number;
  @Input() transactions!:any[];

  constructor() {}

  ngOnInit(): void {    
  }
  logTransactions(){
    console.log(this.transactions);
    
  }
}
