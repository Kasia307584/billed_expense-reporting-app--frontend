/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import "@testing-library/jest-dom"
import userEvent from '@testing-library/user-event'
import 'bootstrap'
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js"
import {localStorageMock} from "../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store"
import router from "../app/Router.js"

jest.mock("../app/store", () => mockStore)

Object.defineProperty(window, 'localStorage', { value: localStorageMock })
window.localStorage.setItem('user', JSON.stringify({
  type: 'Employee',
  email: "employee@test.tld"
}))

router()

beforeEach(() => {
  const root = document.createElement("div")
  root.setAttribute("id", "root")
  document.body.append(root)
})

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon).toHaveClass('active-icon')
    })

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })

// handleClickNewBill integration test
  describe("When I am on Bills Page and I click on button New Bill", () => {
      test("Then it should render New Bill page", async () => {
          window.onNavigate(ROUTES_PATH.Bills)
          await waitFor(() => screen.getByText("Mes notes de frais"))
          const btn = screen.getByTestId("btn-new-bill")
          expect(btn).toBeTruthy()

          const newBillButton = document.querySelector('button[data-testid="btn-new-bill"]')
          userEvent.click(newBillButton)
          const title = await screen.getByText("Envoyer une note de frais")
          expect(title).toBeTruthy()
      })
  })

// handleClickIconEye integration test
  describe("When I am on Bills Page and I click on eye icon", () => {
      test("Then it should display modal window", async () => {
          window.onNavigate(ROUTES_PATH.Bills)
          await waitFor(() => screen.getByText("Mes notes de frais"))
          const icon = screen.getAllByTestId("icon-eye")
          expect(icon).toBeTruthy()

          const iconEye = document.getElementById("eye")
          let url = iconEye.getAttribute("data-bill-url")
          expect(url).toBeTruthy()

          userEvent.click(iconEye)
          const title = await screen.getByText("Justificatif")
          expect(title).toBeTruthy()
      })
  })

// API GET integration tests
  describe("When I navigate to Bills Page", () => {
    test("fetches bills from mock API GET", async () => {
      const spyStoreBillsList = jest.spyOn(mockStore.bills(), "list")
      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick)

      expect(spyStoreBillsList).toHaveBeenCalled()

      const billStatus = await screen.getAllByText("Refused")
      expect(billStatus).toBeTruthy()
    })

  describe("When an error occurs on API", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills")
    })

    test("fetches bills from an API and fails with 404 message error", async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 404"))
          }
        }})
      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick)

      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })

    test("fetches messages from an API and fails with 500 message error", async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 500"))
          }
        }})
      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick)

      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
  })

})