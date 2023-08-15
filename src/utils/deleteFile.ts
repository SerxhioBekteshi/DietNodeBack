import fs from 'fs';

export default async function deleteFile(filePath: string) {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`Error deleting file: ${err}`);
        } else {
            // File deleted successfully'
        }
    });
};

