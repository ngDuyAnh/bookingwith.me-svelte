export async function load({ cookies }) {
    const userInfo = cookies.get('userInfo');
    return userInfo;
}