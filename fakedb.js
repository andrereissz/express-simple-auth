export let db = {
    users: [
        {
            id: "e2a15d35-3870-4b54-9ace-ba35f65e8d0e",
            username: "user1",
            password: "$2a$10$I3qJNfyMhJFI4kTr3jlysuodr3CdOyLTkVIEEH1fyXWDbPOgLm9X2"
        },
        {
            id: "4108bd97-c3fd-482c-a2f6-31c144339e0a",
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
    const uuid = crypto.randomUUID();
    db.users.push({ id: uuid, username: username, password: password });
}