import { expect } from "@playwright/test"

export class PaymentPage {
    constructor(page) {
        this.page = page

        this.discountCode = page
            .frameLocator('[data-qa="active-discount-container"]')
            .locator('[data-qa="discount-code"]')
        this.discountInput = page.locator('[data-qa="discount-code-input"]')
        this.activatedDiscountButton = page.locator('[data-qa="submit-discount-button"]')
        this.activatedDiscountMessage = page.locator('[data-qa="discount-active-message"]')
        this.totalSum = page.locator('[data-qa="total-value"]')
        this.totalSumWithDiscount = page.locator('[data-qa="total-with-discount-value"]')
        this.creditCardOwnerInput = page.getByPlaceholder('Credit card owner')
        this.credirCardNumberInput = page.getByPlaceholder('Credit card number')
        this.creditCardValidUntilInput = page.getByPlaceholder('Valid until')
        this.creditCardCvcInput = page.getByPlaceholder('Credit card CVC')
        this.payButton = page.locator('[data-qa="pay-button"]')
    }

    activateDiscount = async () => {
        await this.discountCode.waitFor()
        const code = await this.discountCode.innerText()
        await this.discountInput.waitFor()
        
        // Option 1
        await this.discountInput.fill(code)
        await expect(this.discountInput).toHaveValue(code)

        // Option 2
        // await this.discountInput.focus()
        // await this.page.keyboard.type(code, { delay: 1000 })
        // expect(await this.discountInput.inputValue()).toBe(code)

        expect(await this.totalSumWithDiscount.isVisible()).toBe(false)
        expect(await this.activatedDiscountMessage.isVisible()).toBe(false)

        await this.activatedDiscountButton.waitFor()
        await this.activatedDiscountButton.click()

        await this.activatedDiscountMessage.waitFor()
        await expect(await this.activatedDiscountMessage).toHaveText("Discount activated!")

        await this.totalSum.waitFor()
        const totalPriceText = await this.totalSum.innerText()
        const totalPriceOnlyStringNumber = totalPriceText.replace('$', '')
        const totalPriceNumber = parseInt(totalPriceOnlyStringNumber, 10)

        await this.totalSumWithDiscount.waitFor()
        const totalPriceWithDiscountText = await this.totalSumWithDiscount.innerText()
        const totalPriceWithDiscountStringNumber = totalPriceWithDiscountText.replace('$', '')
        const totalPriceWithDiscountNumber = parseInt(totalPriceWithDiscountStringNumber, 10)
        expect(totalPriceWithDiscountNumber).toBeLessThan(totalPriceNumber)

    }

    fillPaymentDetails = async (pd) => {
        await this.creditCardOwnerInput.waitFor()
        await this.creditCardOwnerInput.fill(pd.owner)
        await this.credirCardNumberInput.waitFor()
        await this.credirCardNumberInput.fill(pd.number)
        await this.creditCardValidUntilInput.waitFor()
        await this.creditCardValidUntilInput.fill(pd.validUntil)
        await this.creditCardCvcInput.waitFor()
        await this.creditCardCvcInput.fill(pd.cvc)
    }

    completePayment = async () => {
        await this.payButton.waitFor()
        await this.payButton.click()
        await this.page.waitForURL(/\/thank-you/, { timeout: 3000 })
    }
}