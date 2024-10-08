/**
 * @jest-environment jsdom
 */

// import testing lib
import { screen, fireEvent } from "@testing-library/dom"
import "@testing-library/jest-dom"
import userEvent from '@testing-library/user-event'

// import local file
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES } from "../constants/routes.js"

// mock import
import mockStore from "../__mocks__/store"
import { localStorageMock } from "../__mocks__/localStorage.js"

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
// mock window alert
window.alert = jest.fn()

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page and I filled in all fields and upload a file", () => {
    test("Then it should update the store and display the Bills page", async () => {
      // attach UI
      document.body.innerHTML = NewBillUI()
      
      // create a container instance
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage
      })

      // create spy on bills.method
      const spyStoreBillsCreate = jest.spyOn(mockStore.bills(), 'create')
      const spyStoreBillsUpdate = jest.spyOn(mockStore.bills(), 'update')

      // create a fake file
      const newFile = new File(['fake_image_buffer'], 'image.jpg' , { type: 'image/jpeg'})

      // get the input elements
      const amount = screen.getByTestId('amount')
      const commentary = screen.getByTestId('commentary')
      const datepicker = screen.getByTestId('datepicker')
      const inputFile = screen.getByTestId('file')
      const expenseName = screen.getByTestId('expense-name')
      const pct = screen.getByTestId('pct')
      const vat = screen.getByTestId('vat')

      // fill the form
      fireEvent.change(amount, {target: {value:'100'}})
      fireEvent.change(datepicker, {target: {value:'2023-09-29'}})
      fireEvent.change(expenseName, {target: {value:'my expense'}})
      fireEvent.change(commentary, {target: {value:'my awsome comment'}})
      fireEvent.change(vat, {target: {value:'20'}})
      fireEvent.change(pct, {target: {value:'10'}})

      // upload the file
      userEvent.upload(inputFile, newFile)
      await new Promise(process.nextTick)
      
      // check if create was called
      expect(spyStoreBillsCreate).toHaveBeenCalled()
      // but not update
      expect(spyStoreBillsUpdate).not.toHaveBeenCalled()

      // check newBill vars
      expect(newBill.billId).not.toBeNull()
      expect(newBill.fileUrl).not.toBeNull()
      expect(newBill.fileName).toBe('image.jpg')
      
      // submit the form
      const submitButton = document.getElementById('btn-send-bill')
      userEvent.click(submitButton)
      await new Promise(process.nextTick)
      
      // check if uptade was called
      expect(spyStoreBillsUpdate).toHaveBeenCalled()

      // check if Bills page is displayed
      const title = screen.getByText("Mes notes de frais")
      expect(title).toBeTruthy()
    })

  describe("When I am on NewBill Page and I try to upload a file with a wrong format", () => {
    test("Then it should display an alert and keep the NewBill class fields unchanged", async () => {
      document.body.innerHTML = NewBillUI()
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage
      })
  
      const input = screen.getByTestId("file")
      const file = new File(["fake_image"], "file.pdf", {type: "application/pdf"})
      userEvent.upload(input, file)
      await new Promise(process.nextTick)

      expect(alert).toBeTruthy()
      expect(newBill.fileName).not.toBe("file.pdf")

      window.alert.mockClear()
    })
  })

  describe("When I am on NewBill Page and I try to upload a file but an error occurs on API", () => {
    test ("Then it should display an alert", async () => {
      document.body.innerHTML = NewBillUI()

      jest.spyOn(mockStore, "bills")
      mockStore.bills.mockImplementationOnce(() => {
        return {
          create : () =>  {
            return Promise.reject(new Error("Erreur 500"))
          }
        }})

      const inputFile = screen.getByTestId('file')
      const file = new File(["fake_image"], "file.jpg", {type: "image/jpg"})
      userEvent.upload(inputFile, file)
      await new Promise(process.nextTick)
      
      expect(alert).toBeTruthy()

      window.alert.mockClear()
      })
  })
  })
})