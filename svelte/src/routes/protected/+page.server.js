export async function load({ cookies }) {
    return JSON.parse(cookies.get('userInfo'));
}