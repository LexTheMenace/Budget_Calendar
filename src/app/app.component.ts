import { Component, OnDestroy, OnInit } from "@angular/core";
import { Transaction } from "./Transaction.model";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
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
  calendarDate!: Date;
  touchX: any;
  transactions: Transaction[] = [] as Transaction[];

  ngOnInit(): void {
    window.addEventListener("touchstart", (e) => {
      this.touchX = e.changedTouches[0].screenX;
    });
    window.addEventListener("touchend", (e) => {
      const distance = e.changedTouches[0].screenX;

      distance - this.touchX > 30
        ? this.changeMonth("prev")
        : distance - this.touchX < -30
        ? this.changeMonth("next")
        : null;
    });

    this.load();
    this.setProjectedBalance();
    this.balance += this.projectedBalance;
  }
  ngOnDestroy(): void {
    if (window.removeAllListeners) {
      window.removeAllListeners();
    }
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

    // Adjust Balance On Increase, Add this month's transactions to starting balance
    if (this.month - currentMonth === (1 || -11)) {
      let transactions = this.transactions.map((t) => t.amount);
      const addFromThisMonth = transactions.length
        ? transactions.reduce((a, b) => a + b)
        : 0;
      this.startingMonthBalance += addFromThisMonth;
    }

    // Get new months transactions
    this.transactions = this.getTransactions();

    // Decrease Balance On Decrease, Remove new month's transactions from starting balance

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
        const daySquare = {
          day: i - paddingDays,
          padding: false,
          fullDate: this.calendarDate,
        };
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

    let formattedDate = new Date(date + " 20:00");

    this.transactions.push(
      new Transaction(
        this.getRandomID(),
        formattedDate,
        amount,
        category,
        frequency,
        false,
        name
      )
    );

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
        if (frequency === "Weekly" || frequency === "Bi-Weekly") {
          // Delete +1 for date later?
          formattedDate.setDate(formattedDate.getDate() + interval!);
        } else {
          formattedDate.setMonth(formattedDate.getMonth() + 1);
        }

        this.transactions.push(
          new Transaction(
            this.getRandomID(),
            formattedDate,
            amount,
            category,
            frequency,
            false,
            name
          )
        );
      }
    }
    this.save();
    this.setBalance();
    this.setProjectedBalance();
  }
  setBalance() {
    this.balance =
      this.startingMonthBalance +
      this.transactions
        .filter((t) => t.date <= new Date())
        .map((t) => t.amount)
        .reduce((a, b) => a + b);
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
  save() {
    // Fetch stored transactions exculding this month, as we will overwrite it
    let savedTransactions = this.getAllTransactions().filter(
      (t) =>
        t.date.getMonth() !== this.calendarDate.getMonth() ||
      t.date.getFullYear() !== this.calendarDate.getFullYear()
    );
    localStorage.setItem(
      "transactions",
      JSON.stringify([...savedTransactions, ...this.transactions])
    );
    this.transactions = this.getTransactions();
  }
  reset() {
    if (confirm("Sure?")) {
      localStorage.removeItem("transactions");
      this.transactions = this.getTransactions();
      this.startingMonthBalance = 0;
      this.setProjectedBalance();
      this.setBalance();
      this.resetDate();
    }
  }
  resetDate(){
    this.nav = 0;
    this.startingMonthBalance = 0;
    this.load();
    this.setProjectedBalance();
  }
  getAllTransactions(): Transaction[] {
    return localStorage.getItem("transactions")
      ? (
          JSON.parse(localStorage.getItem("transactions")!) as Transaction[]
        ).map(
          ({ id, date, amount, category, frequency }) =>
            new Transaction(
              id,
              new Date(date),
              amount,
              category,
              frequency,
              false
            )
        )
      : [];
  }
  getTransactions() {
    return this.getAllTransactions().filter(
      (t) =>
        new Date(t.date).getMonth() === this.calendarDate.getMonth() &&
        new Date(t.date).getFullYear() === this.calendarDate.getFullYear()
    );
  }
  getRandomID() {
    return Math.floor(Math.random() * 84920375892475).toString();
  }
}
