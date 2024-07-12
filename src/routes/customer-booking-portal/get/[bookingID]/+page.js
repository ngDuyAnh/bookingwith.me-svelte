export async function load({params}) {
    // Access the dynamic parameter from the URL
    const {bookingID} = params;

    return {
        bookingID
    };
}
