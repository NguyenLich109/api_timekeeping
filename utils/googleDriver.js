import { google } from 'googleapis';
import fs from 'fs';

const configuration = () => {
    const oAuth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URI,
    );
    oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

    const drive = google.drive({
        version: 'v3',
        auth: oAuth2Client,
    });

    return { drive, oAuth2Client };
};

const getFile = async ({ drive, fileId }) => {
    try {
        await drive.permissions.create({
            fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });
        const getUrl = await drive.files.get({
            fileId,
            fields: 'webViewLink, webContentLink',
        });

        return { getUrl };
    } catch (error) {
        console.error(error);
    }
};

//search
const searchFolder = async ({ drive, folderName }) => {
    const search = await drive.files.list({
        q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
        fields: 'files(id, name)',
    });
    return { retultSearch: search.data.files[0]?.id };
};

const createFolder = async ({ drive, folderName }) => {
    let folderId;
    const { retultSearch } = await searchFolder({ drive, folderName });
    if (!retultSearch) {
        const { data } = await drive.files.create({
            requestBody: {
                name: folderName,
                mimeType: 'application/vnd.google-apps.folder',
            },
            fields: 'id, name',
        });
        folderId = data.id;
    }
    return { folderId: folderId || retultSearch };
};

//update file lên gg drive
const uploadFile = async ({ file, folderName }) => {
    try {
        const { drive } = configuration();
        const { folderId } = await createFolder({ drive, folderName });
        const createFile = await drive.files.create({
            requestBody: {
                name: file.originalname,
                mimeType: file.mimetype,
                parents: folderId ? [folderId] : [],
            },
            media: {
                mimeType: file.mimetype,
                body: fs.createReadStream(file.path),
            },
            fields: 'id',
        });
        const { getUrl } = await getFile({ drive, fileId: createFile.data.id });

        return { createFile: createFile.data.id, getUrl: getUrl.data.webViewLink };
    } catch (error) {
        console.log(error);
    }
};

//xóa
const deteteFile = async ({ fileId }) => {
    try {
        const { drive } = configuration();
        const retultDelete = await drive.files.delete({ fileId });
        return { retultDelete: retultDelete.data };
    } catch (error) {
        console.log(error);
    }
};

export { uploadFile, deteteFile };
