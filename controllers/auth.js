// controllers/auth.js

exports.register = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // Demo response (bạn thay logic sau)
        return res.status(201).json({
            status: "success",
            message: "User registered successfully",
            data: { username, email }
        });
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: err.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Demo response
        return res.status(200).json({
            status: "success",
            message: "Login successful",
            token: "fake-jwt-token"
        });
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: err.message
        });
    }
};
