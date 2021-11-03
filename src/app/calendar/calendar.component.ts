import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  dayInMilliseconds = 8.64e+7;
  projDay: number | null = null;
  startingBalance = 400;
  projectedBalance = 0;
  amount: number = 0;
  // transactions = {};
  transactions: any = {
    '2021-11-03': [30],
    '2021-11-23': [3],
    '2021-11-29': [-35],
    '2022-02-23': [30],
    '2021-11-05': [50],
    '2021-12-23': [30],
  };

  today = new Date();

  addTransaction() {
    const dateExists = this.transactions[this.date];
    if (dateExists) {
      this.transactions[this.date].push(this.amount);
    } else {
      this.transactions[this.date] = [this.amount];
    }
  }
  // DUPLICATE, refactor later
  addTransactionWithDate(date: string) {
    const dateExists = this.transactions[date];
    if (dateExists) {
      this.transactions[date].push(this.amount);
    } else {
      this.transactions[date] = [this.amount];
    }
  }

  addRecurringTransaction() {
    const freqInMS = {
      weekly: 6.048e+8,
      biWeekly: this.dayInMilliseconds * 14,
    };

    let todayInMS = this.today.getTime();
    let inc = this.dayInMilliseconds * 7;
    let twoYearsInMS = todayInMS + (this.dayInMilliseconds * 730);

    console.log(new Date(todayInMS));
    console.log(new Date(twoYearsInMS));

    for (let todayTime = todayInMS; todayTime < twoYearsInMS; todayTime += inc) {

      const transactionDate = this.getFormattedDate(new Date(todayTime));
      console.log(transactionDate)
      this.addTransactionWithDate(transactionDate);
    }
    // Add event Id for recuuring transations to bulk delete
    // {id: 'fdstsggd', amount: 40, name: 'Gas'}
  }
  getProjected(day: number) {
    const transactions = [];
    this.projDay = day;
    this.today = new Date(this.year, this.month - 1, day + 1);

    for (let key in this.transactions) {
      const keyDate = new Date(key).getTime();
      const projectedDate = this.today.getTime();
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

  get month() {
    return this.today.getMonth() + 1;
  }
  get day() {
    return this.today.getDate();
  }
  get year() {
    return this.today.getFullYear();
  }
  get date() {
    return this.getFormattedDate();
  }
  getFormattedDate(date: Date = this.today) {
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getFullYear();

    return (
      year +
      '-' +
      (month > 9 ? month : '0' + month) +
      '-' +
      (day > 9 ? day : '0' + day)
    );
  }
  resetToday() {
    this.today = new Date();
  }

  getDaysInMonth() {
    return Array.from({
      length: new Date(this.year, this.month, 0).getDate(),
    }).fill(null);
  }
  changeDate(val: string) {
    // Changes Date by 1
    if (val === 'future') {
      // this.today = new Date(this.today.getTime() + this.dayInMilliseconds);
      this.today = new Date(this.year, this.month ,this.day);

    }
    if (val == 'past') {
      // this.today = new Date(this.today.getTime() - this.dayInMilliseconds);
      this.today = new Date(this.year, this.month -2 ,this.day);

    }
  }

  ngOnInit(): void {
  }

}
