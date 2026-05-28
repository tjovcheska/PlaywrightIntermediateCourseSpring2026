export function generateUser() {
    const timestamp = Date.now();

    return {
        username: `tester${timestamp}`,
        email: `tester${timestamp}@example.com`,
        password: 'password123'
    }
}