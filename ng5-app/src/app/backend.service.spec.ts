import { TestBed, inject, async } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import { BackendService } from "./backend.service";

describe("BackendService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BackendService],
      imports: [HttpClientModule, RouterTestingModule, FormsModule]
    });
  });

  it(
    "should be created",
    inject([BackendService], (service: BackendService) => {
      expect(service).toBeTruthy();
    })
  );

  it(
    "should calculate correctly",
    inject([BackendService], (service: BackendService) => {
      
      const testDocument = {
        tripName: "vegas",
        currency: "EUR",
        travellers: [
          {
            name: "hoff",
            expenses: [{ desc: "food", value: 100 }]
          },
          {
            name: "peter",
            expenses: [{ desc: "car", value: 60 }]
          },
          {
            name: "john",
            expenses: [{ desc: "gas", value: 20 }]
          },
        ],
        completed: false,
      };
      expect(testDocument.tripName).toEqual('vegas')
      const balance = service.getBalanceFromDocument(testDocument);
      expect(balance.total).toEqual(180);

      const transaction = service.generateTransaction(balance)
      expect(transaction).toBeDefined()
      if (transaction) {

        expect(transaction.from).toBe("john")
        expect(transaction.to).toBe("hoff")
        expect(transaction.amount).toBe(40)

        const nextBalance = service.applyTransaction(balance, transaction)
        const nextTransaction = service.generateTransaction(nextBalance)
        expect(nextTransaction).toBeFalsy

      }
    })
  )
  
})
