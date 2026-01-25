export let db = {
    users: [
        {
            username: "user1",
            password: "password1"
        },
        {
            username: "user2",
            password: "password2"
        }
    ]
}

export function findUserByUsername(username) {
    const user = db.users.find(user => user.username == username);

    return user;
}

export function createUser(username, password) {
    db.users.push({ username: username, password: password });
}