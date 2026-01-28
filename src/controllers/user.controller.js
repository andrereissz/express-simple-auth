import User from '../models/user.model.js';


class UserController {

    index = (req, res) => {
        const users = User.listAll();

        return res.json({ users });
    }
}

export default UserController;