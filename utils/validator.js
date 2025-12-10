const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const validatePassword = (password) => {
    if (!password || password.length < 6) {
        return { valid: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' };
    }
    return { valid: true };
};

const validateUsername = (username) => {
    if (!username || username.length < 3 || username.length > 50) {
        return { valid: false, message: 'Username phải có từ 3-50 ký tự' };
    }
    const regex = /^[a-zA-Z0-9_]+$/;
    if (!regex.test(username)) {
        return { valid: false, message: 'Username chỉ được chứa chữ cái, số và dấu gạch dưới' };
    }
    return { valid: true };
};

const validateFullname = (fullname) => {
    if (!fullname || fullname.trim().length < 2) {
        return { valid: false, message: 'Họ tên phải có ít nhất 2 ký tự' };
    }
    return { valid: true };
};

module.exports = {
    validateEmail,
    validatePassword,
    validateUsername,
    validateFullname
};