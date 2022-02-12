import { Transaction } from "src/app/Transaction.model";

export const TRANSACTIONS: Transaction[] =[
    {
        "date": "2022-02-05",
        "amount": -26,
        "category": "Uncategorized",
        "frequency": "Once",
    },
      {
            "date": "2022-02-10",
            "amount": -26,
            "category": "Uncategorized",
            "frequency": "Once",
        },
        {
            "date": "2022-02-12",
            "amount": 15,
            "category": "Uncategorized",
            "frequency": "Once",
        },
        {
            "date": "2022-02-16",
            "amount": 30,
            "category": "Uncategorized",
            "frequency": "Once",
        }
].map(
    ({ date, amount, category, frequency }) =>
      new Transaction(date, amount, category, frequency,false)
  );

export const getTransactionsByMonth = (data:{month:number, year:number}) => {
    console.log(data);
    
    return TRANSACTIONS.filter(t => +t.date.getMonth() === data.month&&  t.date.getFullYear() === data.year ).map(
        ({ date, amount, category, frequency }) =>
          new Transaction(date, amount, category, frequency,false)
      );
}
