import {writable} from "svelte/store";

export const checkoutCustomerBookingComponent = writable({
    subtotal: 0,
    discount: 0,
    tax: 0,
    tip: 0
});

export function netSubtotal(subtotal, discount)
{
    return subtotal - discount;
}

export function tax(netSubtotal, taxRate)
{
    return netSubtotal * taxRate;
}

export function total(subtotal, discount, tax, tip)
{
    return subtotal - discount + tax + tip;
}

export function amountDue(total, creditCardPayment, cashPayment)
{
    return total - creditCardPayment - cashPayment;
}
