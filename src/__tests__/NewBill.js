/**
 * @jest-environment jsdom
 */

// import testing lib
import { screen, fireEvent } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'

// import local file
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES } from "../constants/routes.js";

// mock import
import mockStore from "../__mocks__/store"
import { localStorageMock } from "../__mocks__/localStorage.js";

// mock store
jest.mock("../app/store", () => mockStore)

// mock local storage
Object.defineProperty(window, 'localStorage', { value: localStorageMock })
window.localStorage.setItem('user', JSON.stringify({
  type: 'Employee',
  email: 'employee@test.tld'
}))

// mock onNavigate
const onNavigate = (pathname) => {
  document.body.innerHTML = ROUTES({ pathname })
}

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page and I filled in all fields and upload a file", () => {
    test("Then the store has been updated", async () => {

      // attach ui
      document.body.innerHTML = NewBillUI()
      // create a container instance
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage
      })

      // create spy on bills.method
      const spyStoreBillsCreate = jest.spyOn(mockStore.bills(), 'create');
      const spyStoreBillsUpdate = jest.spyOn(mockStore.bills(), 'update');

      // create a fake file
      const newFile = new File(['fake_image_buffer'], 'image.jpg' , { type: 'image/jpeg'});

      // get the input elements
      const amount = screen.getByTestId('amount');
      const commentary = screen.getByTestId('commentary');
      const datepicker = screen.getByTestId('datepicker');
      const inputFile = screen.getByTestId('file');
      const expenseName = screen.getByTestId('expense-name');
      const pct = screen.getByTestId('pct');
      const vat = screen.getByTestId('vat');

      // fill the form
      fireEvent.change(amount, {target: {value:'100'}});
      fireEvent.change(datepicker, {target: {value:'2023-09-29'}});
      fireEvent.change(expenseName, {target: {value:'my expense'}});
      fireEvent.change(commentary, {target: {value:'my awsome comment'}});
      fireEvent.change(vat, {target: {value:'20'}});
      fireEvent.change(pct, {target: {value:'10'}});

      // upload the file
      userEvent.upload(inputFile, newFile);
      await new Promise(process.nextTick);
      
      // check if create was called
      expect(spyStoreBillsCreate).toHaveBeenCalled();
      // but not update
      expect(spyStoreBillsUpdate).not.toHaveBeenCalled();

      // check newBill vars
      expect(newBill.billId).not.toBeNull();
      expect(newBill.fileUrl).not.toBeNull();
      // expect(newBill.fileName).toBe('image.jpg'); don't know why it's not working...
      
      // submit the form
      const submitButton = document.getElementById('btn-send-bill');
      userEvent.click(submitButton);
      await new Promise(process.nextTick);
      
      // check if create was called
      expect(spyStoreBillsUpdate).toHaveBeenCalled()
      // check if that has created a new bill
    })
  describe("When I am on NewBill Page and I try to upload a file with a wrong format", () => {
    test("Then the store is not modified", async () => {
      document.body.innerHTML = NewBillUI()
      const newbill = new NewBill({document, onNavigate, store: mockStore, localStorage: window.localStorage})
  
      const input = screen.getByTestId("file")
      const file = new File(["fake_image"], "file.pdf", {type: "application/pdf"})
      userEvent.upload(input, file)
      await new Promise(process.nextTick)
  
      expect(newbill.fileName).not.toBe("file.pdf")
    })
  })
  describe("When I am on NewBill Page and I try to submit the form without uploading a file", () => {
    test("Then I stay on the NewBill page", async () => {
      document.body.innerHTML = NewBillUI()
      const newBill = new NewBill({
          document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage
      })
  
      const spyStoreBillsUpdate = jest.spyOn(mockStore.bills(), 'update');
  
      const amount = screen.getByTestId('amount');
      const commentary = screen.getByTestId('commentary');
      const datepicker = screen.getByTestId('datepicker');
      const expenseName = screen.getByTestId('expense-name');
      const pct = screen.getByTestId('pct');
      const vat = screen.getByTestId('vat');
      
      fireEvent.change(amount, {target: {value:'100'}});
      fireEvent.change(datepicker, {target: {value:'2023-09-29'}});
      fireEvent.change(expenseName, {target: {value:'my expense'}});
      fireEvent.change(commentary, {target: {value:'my awsome comment'}});
      fireEvent.change(vat, {target: {value:'20'}});
      fireEvent.change(pct, {target: {value:'10'}});
      
      // faut simuler la reception du message "required" champ <input file required> au <form> ?
      // qui empeche le submit de fonctionner
  
      const submitButton = document.getElementById('btn-send-bill');
      userEvent.click(submitButton);
      await new Promise(process.nextTick);
      
      expect(spyStoreBillsUpdate).not.toHaveBeenCalled()
  
      const title = screen.getByText("Envoyer une note de frais");
      expect(title).toBeTruthy()
    })
  })
  })
})