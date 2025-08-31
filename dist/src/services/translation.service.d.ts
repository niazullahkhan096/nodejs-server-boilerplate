export declare class TranslationService {
    private static messages;
    /**
     * Get a translated message for the given key and language
     * @param key - The message key
     * @param language - The language code (default: 'en')
     * @returns The translated message or the key if translation not found
     */
    static getMessage(key: string, language?: string): string;
    /**
     * Add a new translation message
     * @param key - The message key
     * @param translations - Object with language codes as keys and messages as values
     */
    static addMessage(key: string, translations: {
        [language: string]: string;
    }): void;
    /**
     * Get all available languages for a specific key
     * @param key - The message key
     * @returns Array of available language codes
     */
    static getAvailableLanguages(key: string): string[];
    /**
     * Get all available message keys
     * @returns Array of all message keys
     */
    static getAllKeys(): string[];
}
//# sourceMappingURL=translation.service.d.ts.map