import User from '../models/user.model.js';


class UserController {

    index = (req, res) => {
        const users = User.findAll();

        return res.json({ users });
    }
}

export default UserController;