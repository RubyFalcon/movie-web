module.exports.create = async (req, res) => {
    res.status(200).json({
        success: 1,
        message: "Create account"
    });
}

module.exports.signin = async (req, res) => {
    res.status(200).json({
        success: 1,
        message: "Login"
    });
}