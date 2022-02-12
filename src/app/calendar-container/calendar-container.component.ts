import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-calendar-container',
  templateUrl: './calendar-container.component.html',
  styleUrls: ['./calendar-container.component.scss']
})
export class CalendarContainerComponent implements OnInit {
  @Input() squares!: any[];
  @Input() days!:string[];
  @Input() balance!:number;
  @Input() projectedBalance!:number;
  @Output() changeDate: EventEmitter<any> = new EventEmitter();
  @Input() currentDate!:any;
  @Input() transactions!:any[];

  @Output() prev: EventEmitter<void> = new EventEmitter();
  @Output() next: EventEmitter<void> = new EventEmitter();
  
  thisMonth = new Date().getMonth();
  todaysDate = new Date().getDate();
  thisYear = new Date().getFullYear();

  constructor() { }

  ngOnInit(): void {

  }
changeMonth(day:number){
  // if day is less than 7, it's a day from next month otherwise go back
  day < 7 ? this.next.emit() : this.prev.emit();
  this.selectDay(day);
}
  selectDay(day:number){
    this.changeDate.emit(day);
  }
  getDaysTransactions(day:number){
    return this.transactions.filter(t => t.date.getDate() === day);
  }
}
