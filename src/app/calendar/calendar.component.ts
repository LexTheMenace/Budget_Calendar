import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"],
})
export class CalendarComponent implements OnInit {
  transactions: any = {
    "2021-11-03": [30],
    "2021-11-23": [3],
    "2021-11-29": [-35],
    "2022-02-23": [30],
    "2021-11-05": [50],
    "2021-12-23": [30],
  };

  projDay: number = 0;
  startingBalance = 400;
  projectedBalance = 0;
  amount: number = 0;
  
  dayInMilliseconds = 8.64e7;

  today = this.getLocalDate(new Date());
  currentDate = this.today;
  currentMonth = this.getDaysInMonth();
  monthStartDay!: number;
  newTransactionType = 'negative'
  ngOnInit(): void {
    console.log(this.today);
    this.setMonthStartDay();
  }

  switchTransactionType(){
    this.newTransactionType = this.newTransactionType === 'negative' ? 'positive' : 'negative';
  }
  addTransactionWithDate(date: string = this.getFormattedDate()) {
    const dateExists = this.transactions[date];
    console.log(-this.amount);
    
    const transactionAmount = this.newTransactionType === 'positive' ? +this.amount : -this.amount
    if (dateExists) {
      this.transactions[date].push(transactionAmount);
    } else {
      this.transactions[date] = [transactionAmount];
    }
  }

  addRecurringTransaction(freq: string = "weekly") {
    const freqInMS: { [key: string]: number } = {
      weekly: 6.048e8,
      biWeekly: this.dayInMilliseconds * 14,
    };
    let todayInMS = this.currentDate.getTime();
    let twoYearsInMS = todayInMS + this.dayInMilliseconds * 730;
    let isDst = new Date(todayInMS).toString().includes("Daylight");
    const checkDst = (date: number) =>
      new Date(date).toString().includes("Daylight");

    // Need to account for DST
    for (todayInMS; todayInMS < twoYearsInMS; todayInMS += freqInMS[freq]) {
      if (checkDst(todayInMS) !== isDst) {
        if (isDst === true) {
          todayInMS += this.dayInMilliseconds;
        } else {
          todayInMS -= this.dayInMilliseconds;
        }
        isDst = !isDst;
      }

      const transactionDate = this.getFormattedDate(new Date(todayInMS));
      this.addTransactionWithDate(transactionDate);
    }
    // Add event Id for recuuring transations to bulk delete
    // {id: 'fdstsggd', amount: 40, name: 'Gas'}
  }
  getProjected(day: number) {
    const transactions = [];
    this.projDay = day;
    this.currentDate = new Date(this.year, this.month - 1, day);

    for (let key in this.transactions) {
      const keyDate = new Date(key).getTime();
      const projectedDate = this.currentDate.getTime();
      if (keyDate <= projectedDate) {
        transactions.push(...this.transactions[key]);
      }
    }
    this.projectedBalance =
      this.startingBalance + transactions.reduce((a, b) => a + b);
  }

  getDaysTransactions(year: number, month: number, day: number) {
    const date = this.getFormattedDate(new Date(year, month - 1, day));
    return this.transactions[date];
  }
  getLocalDate(date: Date | string) {
    if (typeof date === "string") {
      date = new Date(date);
    }
    return new Date(date.toLocaleDateString());
  }
  get month() {
    return this.currentDate.getMonth() + 1;
  }
  get day() {
    return this.currentDate.getDate();
  }
  get year() {
    return this.currentDate.getFullYear();
  }

  get date() {
    return this.getFormattedDate();
  }

  getFormattedDate(date: Date = this.currentDate) {
    const formatted = this.getLocalDate(date)
      .toISOString()
      .split("T")[0];
    return formatted;
  }

  resetToday() {
    this.currentDate = this.today;
  }

  getDaysInMonth() {
    return Array.from({
      length: new Date(this.year, this.month, 0).getDate(),
    }, (i,_ ) => {
     const transactions = this.getDaysTransactions(this.year, this.month, _ +1);
     // return {date: _ + 1, transactions};
     return _ + 1;
    })
  }

  changeDate(val: string) {
    // Changes Month by 1
    if (val === "future") {
      this.currentDate = new Date(this.year, this.month, this.day);
    }
    if (val == "past") {
      this.currentDate = new Date(this.year, this.month - 2, this.day);
    }
    this.setMonthStartDay()
  }
  setMonthStartDay(){
    const currentDate = new Date(this.currentDate.getTime());
    this.monthStartDay = new Date(currentDate.setDate(1)).getDay();
  }
  
}
