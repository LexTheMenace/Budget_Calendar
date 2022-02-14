import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() prev: EventEmitter<void> = new EventEmitter();
  @Output() next: EventEmitter<void> = new EventEmitter();
  @Output() resetDate: EventEmitter<void> = new EventEmitter();
  @Input() currentDate!: {month: number, year: number}
  constructor() { }

  ngOnInit(): void {
  }
  prevMonth(){
    this.prev.emit();
  }

  nextMonth(){
    this.next.emit();
  }
}
