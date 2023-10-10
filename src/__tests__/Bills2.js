/**
 * @jest-environment jsdom
 */

import {getByText, screen, waitFor} from "@testing-library/dom"
import "@testing-library/jest-dom"
import userEvent from '@testing-library/user-event'
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"

import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
    describe("When I am on Bills Page and I click on button New Bill", () => {
        test("Then it should render New Bill page", async () => {
            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))
            const root = document.createElement("div")
            root.setAttribute("id", "root")
            document.body.append(root)

            router()
            window.onNavigate(ROUTES_PATH.Bills)
            await waitFor(() => screen.getByText("Mes notes de frais"))
            const btn = screen.getByTestId("btn-new-bill")
            expect(btn).toBeTruthy()
            
            // const bills = new Bills({ document, onNavigate, store: mockStore, localStorage: window.localStorage })
            // const spyBillsHandleClick = jest.spyOn(bills, "handleClickNewBill")

            const newBillButton = document.querySelector('button[data-testid="btn-new-bill"]')
            userEvent.click(newBillButton)
            const title = await screen.getByText("Envoyer une note de frais")

            // expect(spyBillsHandleClick).toHaveBeenCalled()
            expect(title).toBeTruthy()
                })
    })
})