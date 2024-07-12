
export function rawPhoneNumber(phoneNumber)
{
    // Remove non-digit characters
    // Limit to 10 digits
    return phoneNumber.replace(/\D/g, '').slice(0, 10);
}

export function formatPhoneNumber(phoneNumber)
{
    let raw = rawPhoneNumber(phoneNumber);

    // Format as "(123) 456-7890"
    let formattedPhoneNumber = "";
    if (raw.length > 6) {
        // If more than 6 digits, format with parenthesis and dash
        formattedPhoneNumber = `(${raw.slice(0, 3)}) ${raw.slice(3, 6)}-${raw.slice(6)}`;
    } else if (raw.length > 3) {
        // If more than 3 digits, include parenthesis
        formattedPhoneNumber = `(${raw.slice(0, 3)}) ${raw.slice(3)}`;
    } else if (raw.length > 0) {
        // If 1-3 digits, just wrap in parentheses
        formattedPhoneNumber = `(${raw}`;
    } else {
        // Empty input
        formattedPhoneNumber = '';
    }

    return formattedPhoneNumber;
}
