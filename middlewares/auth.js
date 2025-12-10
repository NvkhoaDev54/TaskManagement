const { verifyToken } = require('../utils/jwt');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Vui lòng đăng nhập để tiếp tục'
            });
        }

        const token = authHeader.split(' ')[1];
        const result = verifyToken(token);

        if (!result.valid) {
            let message = 'Token không hợp lệ';
            if (result.error.includes('expired')) {
                message = 'Phiên đăng nhập đã hết hạn';
            }
            return res.status(401).json({
                success: false,
                message
            });
        }

        req.userId = result.decoded.userId;
        req.username = result.decoded.username;
        req.user = result.decoded;
        
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi xác thực'
        });
    }
};

// Middleware kiểm tra optional auth (không bắt buộc đăng nhập)
const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const result = verifyToken(token);
            
            if (result.valid) {
                req.userId = result.decoded.userId;
                req.username = result.decoded.username;
                req.user = result.decoded;
            }
        }
        
        next();
    } catch (error) {
        next();
    }
};

module.exports = { authMiddleware, optionalAuth };