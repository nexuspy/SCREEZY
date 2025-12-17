import fs from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';

// Upload directory setup
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

export const storage = {
    /**
     * Save a file buffer to the uploads directory
     * @param buffer - File buffer
     * @param extension - File extension (with or without dot)
     * @returns Saved filename
     */
    saveFile: async (buffer: Buffer, extension: string): Promise<string> => {
        const ext = extension.startsWith('.') ? extension : `.${extension}`;
        const filename = `${nanoid()}-${Date.now()}${ext}`;
        const filepath = path.join(uploadsDir, filename);

        await fs.promises.writeFile(filepath, buffer);
        return filename;
    },

    /**
     * Get file path for a filename
     * @param filename - File name
     * @returns Absolute file path
     */
    getFilePath: (filename: string): string => {
        return path.join(uploadsDir, filename);
    },

    /**
     * Check if file exists
     * @param filename - File name
     * @returns True if file exists
     */
    fileExists: (filename: string): boolean => {
        return fs.existsSync(path.join(uploadsDir, filename));
    },

    /**
     * Delete a file
     * @param filename - File name
     */
    deleteFile: async (filename: string): Promise<void> => {
        const filepath = path.join(uploadsDir, filename);
        if (fs.existsSync(filepath)) {
            await fs.promises.unlink(filepath);
        }
    },

    /**
     * Get file size in bytes
     * @param filename - File name
     * @returns File size in bytes
     */
    getFileSize: (filename: string): number => {
        const filepath = path.join(uploadsDir, filename);
        if (!fs.existsSync(filepath)) {
            return 0;
        }
        const stats = fs.statSync(filepath);
        return stats.size;
    },

    /**
     * Get public URL for a file
     * @param filename - File name
     * @returns Public URL
     */
    getPublicUrl: (filename: string): string => {
        return `/uploads/${filename}`;
    },

    /**
     * Generate unique share token
     * @returns Share token
     */
    generateShareToken: (): string => {
        return nanoid(10);
    },
};
