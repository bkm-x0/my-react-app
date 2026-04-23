// backend/middleware/auditLog.js
/**
 * Middleware لتسجيل جميع عمليات الإدمن الحساسة
 */

const auditLog = (operation) => {
  return (req, res, next) => {
    // تسجيل معلومات الطلب
    const logData = {
      timestamp: new Date().toISOString(),
      userId: req.user?.id,
      username: req.user?.username,
      role: req.user?.role,
      operation,
      method: req.method,
      path: req.path,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent')
    };

    // طباعة السجل
    console.log(`
🔐 ═══════════════════════════════════════════
📋 عملية إدمن محمية تم تنفيذها
🔐 ═══════════════════════════════════════════
👤 المستخدم: ${logData.username} (ID: ${logData.userId})
👮 الدور: ${logData.role}
⚙️  العملية: ${logData.operation}
📍 المسار: ${logData.method} ${logData.path}
🌐 عنوان IP: ${logData.ip}
⏰ الوقت: ${logData.timestamp}
🔐 ═══════════════════════════════════════════
    `);

    // يمكن إضافة تسجيل في قاعدة البيانات هنا لاحقاً
    // await AuditLog.create(logData);

    next();
  };
};

module.exports = auditLog;
