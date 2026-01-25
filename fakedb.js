export let db = {
    users: [
        {
            username: "user1",
            password: "$2a$10$I3qJNfyMhJFI4kTr3jlysuodr3CdOyLTkVIEEH1fyXWDbPOgLm9X2"
        },
        {
            username: "user2",
            password: "$2a$10$I3qJNfyMhJFI4kTr3jlysuodr3CdOyLTkVIEEH1fyXWDbPOgLm9X2"
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