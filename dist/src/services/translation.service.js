"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationService = void 0;
class TranslationService {
    static messages = {
        // Auth messages
        'auth.register.success': {
            en: 'User registered successfully',
            es: 'Usuario registrado exitosamente',
            fr: 'Utilisateur enregistré avec succès',
            de: 'Benutzer erfolgreich registriert',
            ar: 'تم تسجيل المستخدم بنجاح'
        },
        'auth.register.email_exists': {
            en: 'Email already registered',
            es: 'El correo electrónico ya está registrado',
            fr: 'L\'email est déjà enregistré',
            de: 'E-Mail bereits registriert',
            ar: 'البريد الإلكتروني مسجل بالفعل'
        },
        'auth.login.success': {
            en: 'Login successful',
            es: 'Inicio de sesión exitoso',
            fr: 'Connexion réussie',
            de: 'Anmeldung erfolgreich',
            ar: 'تم تسجيل الدخول بنجاح'
        },
        'auth.login.invalid_credentials': {
            en: 'Invalid credentials',
            es: 'Credenciales inválidas',
            fr: 'Identifiants invalides',
            de: 'Ungültige Anmeldedaten',
            ar: 'بيانات اعتماد غير صالحة'
        },
        'auth.logout.success': {
            en: 'Logout successful',
            es: 'Cierre de sesión exitoso',
            fr: 'Déconnexion réussie',
            de: 'Abmeldung erfolgreich',
            ar: 'تم تسجيل الخروج بنجاح'
        },
        'auth.token.refresh_success': {
            en: 'Token refreshed successfully',
            es: 'Token actualizado exitosamente',
            fr: 'Token actualisé avec succès',
            de: 'Token erfolgreich aktualisiert',
            ar: 'تم تحديث الرمز المميز بنجاح'
        },
        'auth.token.invalid': {
            en: 'Invalid token',
            es: 'Token inválido',
            fr: 'Token invalide',
            de: 'Ungültiger Token',
            ar: 'رمز مميز غير صالح'
        },
        // User messages
        'user.create.success': {
            en: 'User created successfully',
            es: 'Usuario creado exitosamente',
            fr: 'Utilisateur créé avec succès',
            de: 'Benutzer erfolgreich erstellt',
            ar: 'تم إنشاء المستخدم بنجاح'
        },
        'user.update.success': {
            en: 'User updated successfully',
            es: 'Usuario actualizado exitosamente',
            fr: 'Utilisateur mis à jour avec succès',
            de: 'Benutzer erfolgreich aktualisiert',
            ar: 'تم تحديث المستخدم بنجاح'
        },
        'user.delete.success': {
            en: 'User deleted successfully',
            es: 'Usuario eliminado exitosamente',
            fr: 'Utilisateur supprimé avec succès',
            de: 'Benutzer erfolgreich gelöscht',
            ar: 'تم حذف المستخدم بنجاح'
        },
        'user.not_found': {
            en: 'User not found',
            es: 'Usuario no encontrado',
            fr: 'Utilisateur non trouvé',
            de: 'Benutzer nicht gefunden',
            ar: 'المستخدم غير موجود'
        },
        'user.list.success': {
            en: 'Users retrieved successfully',
            es: 'Usuarios obtenidos exitosamente',
            fr: 'Utilisateurs récupérés avec succès',
            de: 'Benutzer erfolgreich abgerufen',
            ar: 'تم استرجاع المستخدمين بنجاح'
        },
        // Role messages
        'role.create.success': {
            en: 'Role created successfully',
            es: 'Rol creado exitosamente',
            fr: 'Rôle créé avec succès',
            de: 'Rolle erfolgreich erstellt',
            ar: 'تم إنشاء الدور بنجاح'
        },
        'role.update.success': {
            en: 'Role updated successfully',
            es: 'Rol actualizado exitosamente',
            fr: 'Rôle mis à jour avec succès',
            de: 'Rolle erfolgreich aktualisiert',
            ar: 'تم تحديث الدور بنجاح'
        },
        'role.delete.success': {
            en: 'Role deleted successfully',
            es: 'Rol eliminado exitosamente',
            fr: 'Rôle supprimé avec succès',
            de: 'Rolle erfolgreich gelöscht',
            ar: 'تم حذف الدور بنجاح'
        },
        'role.not_found': {
            en: 'Role not found',
            es: 'Rol no encontrado',
            fr: 'Rôle non trouvé',
            de: 'Rolle nicht gefunden',
            ar: 'الدور غير موجود'
        },
        'role.list.success': {
            en: 'Roles retrieved successfully',
            es: 'Roles obtenidos exitosamente',
            fr: 'Rôles récupérés avec succès',
            de: 'Rollen erfolgreich abgerufen',
            ar: 'تم استرجاع الأدوار بنجاح'
        },
        // Permission messages
        'permission.create.success': {
            en: 'Permission created successfully',
            es: 'Permiso creado exitosamente',
            fr: 'Permission créée avec succès',
            de: 'Berechtigung erfolgreich erstellt',
            ar: 'تم إنشاء الإذن بنجاح'
        },
        'permission.update.success': {
            en: 'Permission updated successfully',
            es: 'Permiso actualizado exitosamente',
            fr: 'Permission mise à jour avec succès',
            de: 'Berechtigung erfolgreich aktualisiert',
            ar: 'تم تحديث الإذن بنجاح'
        },
        'permission.delete.success': {
            en: 'Permission deleted successfully',
            es: 'Permiso eliminado exitosamente',
            fr: 'Permission supprimée avec succès',
            de: 'Berechtigung erfolgreich gelöscht',
            ar: 'تم حذف الإذن بنجاح'
        },
        'permission.not_found': {
            en: 'Permission not found',
            es: 'Permiso no encontrado',
            fr: 'Permission non trouvée',
            de: 'Berechtigung nicht gefunden',
            ar: 'الإذن غير موجود'
        },
        'permission.list.success': {
            en: 'Permissions retrieved successfully',
            es: 'Permisos obtenidos exitosamente',
            fr: 'Permissions récupérées avec succès',
            de: 'Berechtigungen erfolgreich abgerufen',
            ar: 'تم استرجاع الأذونات بنجاح'
        },
        // File messages
        'file.upload.success': {
            en: 'File uploaded successfully',
            es: 'Archivo subido exitosamente',
            fr: 'Fichier téléchargé avec succès',
            de: 'Datei erfolgreich hochgeladen',
            ar: 'تم رفع الملف بنجاح'
        },
        'file.upload.no_file': {
            en: 'No file uploaded',
            es: 'No se subió ningún archivo',
            fr: 'Aucun fichier téléchargé',
            de: 'Keine Datei hochgeladen',
            ar: 'لم يتم رفع أي ملف'
        },
        'file.download.success': {
            en: 'File downloaded successfully',
            es: 'Archivo descargado exitosamente',
            fr: 'Fichier téléchargé avec succès',
            de: 'Datei erfolgreich heruntergeladen',
            ar: 'تم تنزيل الملف بنجاح'
        },
        'file.delete.success': {
            en: 'File deleted successfully',
            es: 'Archivo eliminado exitosamente',
            fr: 'Fichier supprimé avec succès',
            de: 'Datei erfolgreich gelöscht',
            ar: 'تم حذف الملف بنجاح'
        },
        'file.not_found': {
            en: 'File not found',
            es: 'Archivo no encontrado',
            fr: 'Fichier non trouvé',
            de: 'Datei nicht gefunden',
            ar: 'الملف غير موجود'
        },
        'file.list.success': {
            en: 'Files retrieved successfully',
            es: 'Archivos obtenidos exitosamente',
            fr: 'Fichiers récupérés avec succès',
            de: 'Dateien erfolgreich abgerufen',
            ar: 'تم استرجاع الملفات بنجاح'
        },
        // General messages
        'validation.error': {
            en: 'Validation error',
            es: 'Error de validación',
            fr: 'Erreur de validation',
            de: 'Validierungsfehler',
            ar: 'خطأ في التحقق من الصحة'
        },
        'unauthorized': {
            en: 'Unauthorized access',
            es: 'Acceso no autorizado',
            fr: 'Accès non autorisé',
            de: 'Nicht autorisierter Zugriff',
            ar: 'وصول غير مصرح'
        },
        'forbidden': {
            en: 'Access forbidden',
            es: 'Acceso prohibido',
            fr: 'Accès interdit',
            de: 'Zugriff verboten',
            ar: 'الوصول محظور'
        },
        'not_found': {
            en: 'Resource not found',
            es: 'Recurso no encontrado',
            fr: 'Ressource non trouvée',
            de: 'Ressource nicht gefunden',
            ar: 'المورد غير موجود'
        },
        'server.error': {
            en: 'Internal server error',
            es: 'Error interno del servidor',
            fr: 'Erreur interne du serveur',
            de: 'Interner Serverfehler',
            ar: 'خطأ في الخادم الداخلي'
        },
        'health.success': {
            en: 'Service is healthy',
            es: 'El servicio está funcionando correctamente',
            fr: 'Le service fonctionne correctement',
            de: 'Der Dienst funktioniert ordnungsgemäß',
            ar: 'الخدمة تعمل بشكل صحيح'
        },
        'ready.success': {
            en: 'Service is ready',
            es: 'El servicio está listo',
            fr: 'Le service est prêt',
            de: 'Der Dienst ist bereit',
            ar: 'الخدمة جاهزة'
        },
        // Export messages
        'export.success': {
            en: 'Data exported successfully',
            es: 'Datos exportados exitosamente',
            fr: 'Données exportées avec succès',
            de: 'Daten erfolgreich exportiert',
            ar: 'تم تصدير البيانات بنجاح'
        },
        'export.no_data': {
            en: 'No data found for the specified criteria',
            es: 'No se encontraron datos para los criterios especificados',
            fr: 'Aucune donnée trouvée pour les critères spécifiés',
            de: 'Keine Daten für die angegebenen Kriterien gefunden',
            ar: 'لم يتم العثور على بيانات للمعايير المحددة'
        },
        'export.invalid_date_range': {
            en: 'Invalid date range provided',
            es: 'Rango de fechas inválido proporcionado',
            fr: 'Plage de dates invalide fournie',
            de: 'Ungültiger Datumsbereich angegeben',
            ar: 'نطاق تاريخ غير صالح'
        },
        'export.field.id': {
            en: 'User ID',
            es: 'ID de usuario',
            fr: 'ID utilisateur',
            de: 'Benutzer-ID',
            ar: 'معرف المستخدم'
        },
        'export.field.name': {
            en: 'User name',
            es: 'Nombre de usuario',
            fr: 'Nom d\'utilisateur',
            de: 'Benutzername',
            ar: 'اسم المستخدم'
        },
        'export.field.email': {
            en: 'Email address',
            es: 'Dirección de correo electrónico',
            fr: 'Adresse e-mail',
            de: 'E-Mail-Adresse',
            ar: 'عنوان البريد الإلكتروني'
        },
        'export.field.role': {
            en: 'User role',
            es: 'Rol de usuario',
            fr: 'Rôle utilisateur',
            de: 'Benutzerrolle',
            ar: 'دور المستخدم'
        },
        'export.field.status': {
            en: 'Account status',
            es: 'Estado de la cuenta',
            fr: 'Statut du compte',
            de: 'Kontostatus',
            ar: 'حالة الحساب'
        },
        'export.field.email_verified': {
            en: 'Email verification status',
            es: 'Estado de verificación de correo electrónico',
            fr: 'Statut de vérification e-mail',
            de: 'E-Mail-Verifizierungsstatus',
            ar: 'حالة التحقق من البريد الإلكتروني'
        },
        'export.field.created_at': {
            en: 'Account creation date',
            es: 'Fecha de creación de cuenta',
            fr: 'Date de création du compte',
            de: 'Kontoerstellungsdatum',
            ar: 'تاريخ إنشاء الحساب'
        },
        'export.field.updated_at': {
            en: 'Last update date',
            es: 'Fecha de última actualización',
            fr: 'Date de dernière mise à jour',
            de: 'Datum der letzten Aktualisierung',
            ar: 'تاريخ آخر تحديث'
        },
        'export.field.last_login': {
            en: 'Last login date',
            es: 'Fecha de último inicio de sesión',
            fr: 'Date de dernière connexion',
            de: 'Datum der letzten Anmeldung',
            ar: 'تاريخ آخر تسجيل دخول'
        }
    };
    /**
     * Get a translated message for the given key and language
     * @param key - The message key
     * @param language - The language code (default: 'en')
     * @returns The translated message or the key if translation not found
     */
    static getMessage(key, language = 'en') {
        const message = this.messages[key];
        if (!message) {
            return key;
        }
        return message[language] || message['en'] || key;
    }
    /**
     * Add a new translation message
     * @param key - The message key
     * @param translations - Object with language codes as keys and messages as values
     */
    static addMessage(key, translations) {
        this.messages[key] = translations;
    }
    /**
     * Get all available languages for a specific key
     * @param key - The message key
     * @returns Array of available language codes
     */
    static getAvailableLanguages(key) {
        const message = this.messages[key];
        return message ? Object.keys(message) : [];
    }
    /**
     * Get all available message keys
     * @returns Array of all message keys
     */
    static getAllKeys() {
        return Object.keys(this.messages);
    }
}
exports.TranslationService = TranslationService;
//# sourceMappingURL=translation.service.js.map