
// Function to format cost
export function formatCost(cost) {
    // Convert to fixed, then to a number to remove trailing .00
    return cost % 1 === 0 ? cost.toFixed(0) : cost.toFixed(2);
}
