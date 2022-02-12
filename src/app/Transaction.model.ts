export class Transaction{
    public date: Date
    constructor(private dateStr: string | Date, public amount: number, public category: string, public frequency: string, public fulfilled: boolean,public name?: string){
        this.date = new Date(dateStr);        
    }
    get month(){
        return this.date.getMonth();
    }
    get day(){
        return this.date.getDate();
    }
    get year(){
        return this.date.getFullYear();
    }
}