export class Transaction{
    
    constructor(public id: string,public date: Date | Date, public amount: number, public category: string, public frequency: string, public fulfilled: boolean,public name?: string){
        this.date = new Date(date);        
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