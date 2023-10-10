/**
 * @jest-environment jsdom
 */

import 'bootstrap';
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
    describe("When I am on Bills Page and I click on eye icon", () => {
        test("Then it should display modal window", async () => {
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
})