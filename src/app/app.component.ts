import { Component, OnInit } from "@angular/core";
import { Transaction } from "./Transaction.model";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  squares: any[] = [];
  nav = 0;
  date!: number;
  month!: number;
  year!: number;
  startingMonthBalance: number = 0;
  balance: number = 0;
  projectedBalance: number = 0;
  calendarDate!:Date;

  transactions: Transaction[] = [] as Transaction[];

  ngOnInit(): void {
    this.load();
    this.setProjectedBalance();
    this.balance += this.projectedBalance;
  }
  load() {
    const dt = new Date();
    const currentMonth = this.month || dt.getMonth();

    if (this.nav !== 0) {
      dt.setMonth(new Date().getMonth() + this.nav);
    }
    this.calendarDate = dt;

    this.date = dt.getDate();
    this.month = dt.getMonth();
    this.year = dt.getFullYear();

    if (this.month - currentMonth === (1 || -11)) {
      let transactions = this.transactions.map((t) => t.amount);
      const addFromThisMonth = transactions.length
        ? transactions.reduce((a, b) => a + b)
        : 0;
      this.startingMonthBalance += addFromThisMonth;
    }
    this.transactions = this.getTransactions();
    if (this.month - currentMonth === (-1 || 10)) {
      let transactions = this.transactions.map((t) => t.amount);
      const subtractFromThisMonth = transactions.length
        ? transactions.reduce((a, b) => a + b)
        : 0;
      this.startingMonthBalance =
        this.startingMonthBalance - subtractFromThisMonth;
    }

    const firstDayOfMonth = new Date(this.year, this.month, 1);
    let lastDayInMonth = new Date(this.year, this.month + 1, 0).getDay();

    const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();

    const dateString = firstDayOfMonth.toLocaleDateString("en-us", {
      weekday: "long",
    });
    let paddingDays = this.weekdays.indexOf(dateString);
    if (paddingDays > 6) {
      paddingDays = 0;
    }

    const squares = [];
    for (let i = 1; i <= paddingDays + daysInMonth; i++) {
      if (i > paddingDays) {
        const daySquare = { day: i - paddingDays, padding: false, fullDate: this.calendarDate };
        squares.push(daySquare);
      } else {
        const daysLastMonth = new Date(this.year, this.month, 0).getDate();
        const daySquare = {
          day: daysLastMonth - (paddingDays - i),
          padding: true,
        };
        squares.push(daySquare);
      }
    }

    if (lastDayInMonth !== 6) {
      let i = 1;
      while (lastDayInMonth < 6) {
        const daySquare = { day: i, padding: true };
        squares.push(daySquare);
        lastDayInMonth++;
        i++;
      }
    }
    this.squares = squares;
  }
  changeMonth(val: string) {
    // Changes Month by 1
    if (val === "next") {
      this.nav++;
    }
    if (val === "prev") {
      this.nav--;
    }
    this.load();
    this.setProjectedBalance();
  }
  changeDate(e: number) {
    this.date = e;
    this.setProjectedBalance();
  }
  addTransaction(newTransaction: {
    date: string;
    amount: number;
    category: string;
    frequency: string;
    name?: string | undefined;
  }) {
    const { date, amount, category, name, frequency } = newTransaction;
    let formattedDate = new Date(date);
    formattedDate.setDate(formattedDate.getDate() + 1);
    this.transactions.push(
      new Transaction(formattedDate, amount, category, frequency, false, name)
    );
    if (+date.split("-")[2] === this.date) {
      this.setProjectedBalance();
    }
    if (frequency !== "Once") {
      let interval: number;
      switch (frequency) {
        case "Weekly":
          interval = 7;
          break;
        case "Bi-Weekly":
          interval = 14;
          break;
      }
      for (let i = 1; i < 100; i++) {
        const setDate = new Date(date);
        
        if (frequency === "Weekly" || frequency === "Bi-Weekly") {
          
          // Delete +1 for date later?
          setDate.setDate(setDate.getDate() + 1 + interval! * i);
        } else {
          setDate.setDate(setDate.getDate() +1);
          setDate.setMonth(setDate.getMonth() + 1 * i);
        }
        console.log(setDate);
        
        this.transactions.push(
          new Transaction(setDate, amount, category, frequency, false,name)
        );
      }
    this.save()      
      this.transactions = this.getTransactions();
    }
  }
  setProjectedBalance() {
    const dateStr = new Date(
      [this.year, this.month + 1, this.date + 1].join("-")
    );
    const prevTransactions = this.transactions.filter(
      (t) => new Date(t.date) <= dateStr
    );

    if (prevTransactions.length) {
      this.projectedBalance =
        this.startingMonthBalance +
        prevTransactions.map((t) => t.amount).reduce((a, b) => a + b);
    } else {
      this.projectedBalance = this.startingMonthBalance;
    }
  }
  save(){
    localStorage.setItem('transactions', JSON.stringify(this.transactions))
  }
  reset(){
    if(confirm('Sure?')){
      localStorage.removeItem('transactions')
      
    }
  }
  getTransactions(){
    const TRANSACTIONS: Transaction[] = localStorage.getItem('transactions') ? JSON.parse(localStorage.getItem('transactions')!): [];
    
    return TRANSACTIONS.filter(t => new Date(t.date).getMonth() === this.calendarDate.getMonth()&&  new Date(t.date).getFullYear() === this.calendarDate.getFullYear() ).map(
        ({ date, amount, category, frequency, }) =>
          new Transaction(date, amount, category, frequency,false)
      );
  }
  getTransactionsByMonth(data:{month:number, year:number}){
    const TRANSACTIONS: Transaction[] = localStorage.getItem('transactions') ? JSON.parse(localStorage.getItem('transactions')!): [];
    
    return TRANSACTIONS.filter(t => new Date(t.date).getMonth() === data.month&&  new Date(t.date).getFullYear() === data.year ).map(
        ({ date, amount, category, frequency }) =>
          new Transaction(date, amount, category, frequency,false)
      );
} 

}
