exports.getUsers = async (req, res) => {
    res.status(200).json('all users')
}

exports.deleteUser = async (req, res) => {
    res.status(200).json('delete user')
}

exports.createUser = async (req, res) => {
    res.status(200).json('create user')
}

exports.updateUser = async (req, res) => {
    res.status(200).json('update user')
}

exports.getUser = async (req, res) => {
    res.status(200).json('get user')
}
