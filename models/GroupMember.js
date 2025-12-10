const db = require('../configs/database');

class GroupMember {
  // Thêm thành viên vào group
  static async add(userID, groupID) {
    try {
      const [result] = await db.execute(
        'INSERT INTO groupmember (userID, groupID) VALUES (?, ?)',
        [userID, groupID]
      );
      return result.affectedRows > 0;
    } catch (error) {
      // Nếu đã tồn tại (duplicate key), trả về false
      if (error.code === 'ER_DUP_ENTRY') {
        return false;
      }
      throw error;
    }
  }

  // Xóa thành viên khỏi group
  static async remove(userID, groupID) {
    try {
      const [result] = await db.execute(
        'DELETE FROM groupmember WHERE userID = ? AND groupID = ?',
        [userID, groupID]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Kiểm tra user có phải thành viên của group không
  static async isMember(userID, groupID) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM groupmember WHERE userID = ? AND groupID = ?',
        [userID, groupID]
      );
      return rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  // Lấy tất cả groups của một user
  static async getGroupsByUser(userID) {
    try {
      const [rows] = await db.execute(
        `SELECT g.*, u.username as truongnhom_name, u.fullname as truongnhom_fullname
         FROM groupmember gm
         INNER JOIN \`group\` g ON gm.groupID = g.groupID
         LEFT JOIN user u ON g.truongnhom = u.id
         WHERE gm.userID = ?`,
        [userID]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Lấy tất cả thành viên của một group
  static async getMembersByGroup(groupID) {
    try {
      const [rows] = await db.execute(
        `SELECT u.id, u.username, u.fullname, u.email
         FROM groupmember gm
         INNER JOIN user u ON gm.userID = u.id
         WHERE gm.groupID = ?`,
        [groupID]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Xóa tất cả thành viên của một group (khi xóa group)
  static async removeAllByGroup(groupID) {
    try {
      const [result] = await db.execute(
        'DELETE FROM groupmember WHERE groupID = ?',
        [groupID]
      );
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  // Xóa user khỏi tất cả groups (khi xóa user)
  static async removeAllByUser(userID) {
    try {
      const [result] = await db.execute(
        'DELETE FROM groupmember WHERE userID = ?',
        [userID]
      );
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  // Đếm số thành viên trong group
  static async countMembers(groupID) {
    try {
      const [rows] = await db.execute(
        'SELECT COUNT(*) as count FROM groupmember WHERE groupID = ?',
        [groupID]
      );
      return rows[0].count;
    } catch (error) {
      throw error;
    }
  }

  // Thêm nhiều thành viên cùng lúc
  static async addMultiple(userIDs, groupID) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      
      const results = [];
      for (const userID of userIDs) {
        try {
          await connection.execute(
            'INSERT INTO groupmember (userID, groupID) VALUES (?, ?)',
            [userID, groupID]
          );
          results.push({ userID, success: true });
        } catch (error) {
          if (error.code === 'ER_DUP_ENTRY') {
            results.push({ userID, success: false, reason: 'Đã là thành viên' });
          } else {
            throw error;
          }
        }
      }
      
      await connection.commit();
      return results;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = GroupMember;