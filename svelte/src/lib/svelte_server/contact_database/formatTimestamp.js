
export function formatTimestamp(date) {
    return `${date.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    })} at ${date.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', hour12: true
    })}`;
}
