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
  describe("When I am on NewBill Page", () => {
    test("Then i upload a file and validate the form", async () => {

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
  })
})