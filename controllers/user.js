// controllers/user.js

const User = require('../models/User');
const Task = require('../models/Task');
const Group = require('../models/Group');
const GroupMember = require('../models/GroupMember');
const CatchAsync = require('../utils/CatchAsync');
const AppError = require('../utils/AppError');
const hashing = require('../utils/hashing'); // Dùng để băm mật khẩu mới

// Lấy thông tin chi tiết của user bất kỳ (Không bao gồm mật khẩu)
exports.getUser = CatchAsync(async (req, res, next) => {
    const { id } = req.params;
    
    const user = await User.findById(id);

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});

// Cập nhật thông tin cá nhân (Update Me)
// Lưu ý: Validation đã chạy trước đó trong middleware
exports.updateMe = CatchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { fullname, email, password } = req.body;

    // 1. Tạo đối tượng data để cập nhật
    const userData = {};
    if (fullname) userData.fullname = fullname;
    if (email) userData.email = email;
    
    // 2. Nếu có mật khẩu mới, phải băm nó trước khi lưu
    if (password) {
        const hashedPassword = await hashing.hashPassword(password);
        userData.password = hashedPassword;
    }

    if (Object.keys(userData).length === 0) {
        return next(new AppError('Please provide fields to update', 400));
    }

    const updated = await User.update(userId, userData);

    if (!updated) {
        return next(new AppError('User not found or no changes made', 404));
    }

    const updatedUser = await User.findById(userId);

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

// Xóa tài khoản cá nhân (Delete Me)
// Đây là một hành động nguy hiểm, cần xử lý các ràng buộc khóa ngoại
exports.deleteMe = CatchAsync(async (req, res, next) => {
    const userId = req.user.id;
    
    // 1. Kiểm tra xem user có phải là trưởng nhóm nào không
    const leaderGroups = await Group.findByLeader(userId);

    if (leaderGroups && leaderGroups.length > 0) {
        return next(new AppError('You are the leader of one or more groups. Please transfer leadership before deleting your account.', 400));
    }

    // 2. Xóa các Task được giao cho user này (hoặc có thể chuyển giao/xóa)
    // Giả định chúng ta sẽ xóa các task mà user này là người được giao
    // Tuy nhiên, vì task.id là khóa ngoại NOT NULL, chúng ta cần tìm giải pháp:
    // Tạm thời, giả định rằng DB có CASCADE DELETE hoặc chúng ta sẽ xóa thủ công:
    // await Task.deleteByUserId(userId); // Giả định có hàm này

    // 3. Xóa User khỏi tất cả các groups
    await GroupMember.removeAllByUser(userId);

    // 4. Xóa User
    const deleted = await User.delete(userId);

    if (!deleted) {
        return next(new AppError('User not found', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});

// Lấy tất cả users (Giả sử dùng cho mục đích tìm kiếm/quản lý)
exports.getAllUsers = CatchAsync(async (req, res, next) => {
    const users = await User.findAll();

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
});

// Tìm kiếm users
exports.searchUsers = CatchAsync(async (req, res, next) => {
    const { keyword } = req.query;

    if (!keyword) {
        return next(new AppError('Keyword is required for search', 400));
    }

    const users = await User.search(keyword);

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
});