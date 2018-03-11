// ng
import { Injectable, ElementRef } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";

// rxjs
import { Subject } from "rxjs/Subject";
import { debounceTime, map } from "rxjs/operators";

// app
import { environment } from '../environments/environment';

interface Balance {
  total: number;
  due: number;
  standing: { name: string; paid: number }[];
  transactions: Transaction[];
}

interface Transaction {
  from: string;
  to: string;
  amount: number;
}

export interface Traveller {
  name: string;
  expenses: Expense[];
}

export interface Expense {
  desc: string;
  value?: number;
}

export interface DocumentResponse {
  id: number;
  document: Document;
}

export interface Document {
  currency: string;
  tripName: string;
  travellers: Traveller[];
  completed: boolean;
}


@Injectable()
export class BackendService {

  backendBaseURL = environment.backendBaseURL
  documentID;
  document: Document 
  balance: Balance;
  changeSubject = new Subject<any>();

  constructor(public http: HttpClient, public router: Router) {
    // autosave
    this.changeSubject.pipe(debounceTime(2000)).subscribe(() => {
      this.saveTrip();
    });
  }

  /**
   * Returns a blank trip document
   */
  blankDocument(): Document {
    return {
      tripName: "",
      currency: "EUR",
      travellers: [
        {
          name: "",
          expenses: [{ desc: "", value: undefined }]
        }
      ],
      completed: false
    };
  }

  /**
   * Loads a trip of a given id and stores it locally
   */
  loadTrip(id) {
    this.http
      .get(this.backendBaseURL + "/api/documents/" + id)
      .subscribe((reply: DocumentResponse) => {

        // store document
        this.document = reply.document;
        this.documentID = reply.id;

        // initial calculation of balance
        const balance = this.getBalanceFromDocument(this.document);
        this.balance = this.processBill(balance);
        
      });
  }

  /**
   * Creates a new trip with a given name, then nativates to the trips URLS
   */
  createTrip(tripName: string) {
    this.document = this.blankDocument()
    this.document.tripName = tripName
    this.http
      .put(this.backendBaseURL + "/api/documents/0", this.document)
      .subscribe((response: DocumentResponse) => {
        this.document = response.document;
        this.router.navigate(["/trip", response.id]);
      });
  }

  /**
   * Removes blank entries for the document,
   * marks it as completed and saves it
   */
  completeTrip() {
    this.document.completed = true;

    // remove travellers without name
    this.document.travellers = this.document.travellers.filter(
      t => t.name.length > 0
    );
    // remove exenses without descriptions
    for (let traveller of this.document.travellers) {
      traveller.expenses = traveller.expenses.filter(
        exp => exp.desc.length > 0
      );
    }
    this.saveTrip();
  }

  saveTrip() {
    this.http
      .post(
        this.backendBaseURL + "/api/documents/" + this.documentID,
        this.document
      )
      .subscribe((reply: DocumentResponse) => {
        console.log("saved trip!", reply);
      });
  }

  /**
   * adds blank travellers and expenses so the user doesn't have to
   */
  checkAppendForm() {

    // if there is no empty traveller name, add one
    let noBlankTravellers =
      this.document.travellers.filter(traveller => traveller.name === "")
        .length === 0;
    if (noBlankTravellers) {
      this.document.travellers.push({ name: "", expenses: [] });
    }

    // for each traveller -> if there is no blank expense, add one
    for (let traveller of this.document.travellers) {
      const needsRow =
        traveller.expenses.filter(expense => expense.desc === "").length === 0;
      if (needsRow) {
        traveller.expenses.push({ desc: "" });
      }
    }

    // settle the balance
    const startingBalance = this.getBalanceFromDocument(this.document);
    this.balance = this.processBill(startingBalance);

    // broadcast change event for auto-saving
    this.changeSubject.next();
  }

  /**
   * recursively applies transactions aginst the blance, until it is settles
   */
  processBill(balance: Balance): Balance {
    const balanceCopy = JSON.parse(JSON.stringify(balance));
    const transaction = this.generateTransaction(balanceCopy);
    if (transaction) {
      this.applyTransaction(balanceCopy, transaction);
      return this.processBill(balanceCopy);
    } else {
      return balanceCopy;
    }
  }

  // create a Balance for further processing
  getBalanceFromDocument(document: Document): Balance {
    const balance = {
      total: 0,
      due: 0,
      standing: [],
      transactions: []
    };
    const namedTravellers = document.travellers.filter(
      traveller => traveller.name.length > 0
    );
    for (let traveller of namedTravellers) {

      // collect a traveller's expenses into an array
      const travellerExpenses = traveller.expenses.map(
        expense => (isNaN(expense.value) ? 0 : +expense.value)
      );

      // sum up the array to get the traveller's total expenses
      const travellerTotal = travellerExpenses.reduce((sum, val) => sum + val);

      // add traveller's total expenses to balance total
      balance.total += travellerTotal;

      // add a record for the traveller to the 'standing' array
      balance.standing.push({ name: traveller.name, paid: travellerTotal });
    }
    // calculate everybody's share of the bill
    balance.due = balance.total / balance.standing.length;

    return balance;
  }

  /**
   * Creates a transaction from a given balance
   * - The person who has paid the least pays the person who paid the most
   * - The amount is so to settle the person who has paid the least
   */
  generateTransaction(balance: Balance): Transaction | false {
    
    // get a sorted and cleaned balance
    const nextBalance = this.sortAndClean(balance);

    // return false if there are not enough people for a transaction
    if (nextBalance.standing.length < 2) { return false }

    // generate transaction
    const payer = nextBalance.standing[nextBalance.standing.length - 1];
    const receiver = nextBalance.standing[0];
    const paymentAmount = nextBalance.due - payer.paid;

    const transaction: Transaction = {
      from: payer.name,
      to: receiver.name,
      amount: paymentAmount
    };

    // return false if transaction about is sub-cent
    if (transaction.amount < 0.1) { return false }

    // else return the transaction
    return transaction;
  }

  /**
   * Applies and records transaction against a given balance
   */
  applyTransaction(balance: Balance, transaction: Transaction): Balance {
    const payer = balance.standing.find(
      person => person.name === transaction.from
    );
    const receiver = balance.standing.find(
      person => person.name === transaction.to
    );
    payer.paid += transaction.amount;
    receiver.paid -= transaction.amount;
    balance.transactions.push(transaction);
    return balance;
  }

  /**
   * Removes travellers who have paid their due
   * and orders the remaining ones
   */
  sortAndClean(balance: Balance): Balance {
    const balanceCopy = JSON.parse(JSON.stringify(balance));
    const filteredStanding = balanceCopy.standing.filter(
      person => person.paid !== balanceCopy.due
    );
    const sortedStanding = filteredStanding.sort((a, b) => {
      return b.paid - a.paid;
    });
    balanceCopy.standing = sortedStanding;
    return balanceCopy;
  }
}
