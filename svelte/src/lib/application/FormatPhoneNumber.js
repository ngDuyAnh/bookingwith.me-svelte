export function formatPhoneNumberInput(value) {
    value = value.replace(/\D/g, ''); // Remove non-digit characters
    value = value.slice(0, 10); // Limit to 10 digits

    // Format as "(123) 456-7890"
    let formattedPhoneNumber = "";
    if (value.length > 6) {
        // If more than 6 digits, format with parenthesis and dash
        formattedPhoneNumber = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
    } else if (value.length > 3) {
        // If more than 3 digits, include parenthesis
        formattedPhoneNumber = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    } else if (value.length > 0) {
        // If 1-3 digits, just wrap in parentheses
        formattedPhoneNumber = `(${value}`;
    } else {
        // Empty input
        formattedPhoneNumber = '';
    }

    return formattedPhoneNumber;
}