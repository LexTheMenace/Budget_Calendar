import { Component, Input, OnChanges, OnInit, Output, SimpleChanges,EventEmitter } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Transaction } from "../Transaction.model";

@Component({
  selector: "app-calendar-actions",
  templateUrl: "./calendar-actions.component.html",
  styleUrls: ["./calendar-actions.component.scss"],
})
export class CalendarActionsComponent implements OnInit, OnChanges {
  @Input() currentDate!: any;
  @Output() addTransaction: EventEmitter<any> = new EventEmitter();
  transactionForm!: FormGroup;
  transactionType = "+";
  constructor() {}

  ngOnInit(): void {
    this.initForm();
  }
  ngOnChanges(changes: SimpleChanges){
    if(changes['currentDate'] && this.transactionForm){      
      this.transactionForm.controls['date'].setValue(this.formatDate());
    }
  }
  onSubmit() {
  this.addTransaction.emit(this.transactionForm.value);
  this.initForm();
  }
  initForm() {
    let date = this.formatDate()

    this.transactionForm = new FormGroup({
      date: new FormControl(date, Validators.required),
      category: new FormControl('Uncategorized',Validators.required),
      amount: new FormControl(0, [Validators.required,Validators.pattern(/^[1-9]*$/)]),
      name: new FormControl(),
      frequency: new FormControl('Once')
    });
  }
  addLeadingZero(num: number){
  return num < 10 ?  "0" + num : num
  }
  toggleTransactionType(){
    this.transactionType = this.transactionType === '-' ? '+' : '-';
    this.transactionForm.controls['amount'].setValue(-(this.transactionForm.controls['amount'].value))
  }
  formatDate(){
    let { year, month, date: day } = this.currentDate;

    return [
      year,
      this.addLeadingZero(month +1),
      this.addLeadingZero(day),
    ].join("-");
  }
}
