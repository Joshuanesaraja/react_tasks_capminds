import CryptoJS from "crypto-js";

const SECRET_KEY = "task017-healthcare-secret-key";

export function encryptData(data) {
    return CryptoJS.AES.encrypt(
        JSON.stringify(data),
        SECRET_KEY
    ).toString();
}

export function decryptData(encryptedData) {
    const bytes = CryptoJS.AES.decrypt(
        encryptedData,
        SECRET_KEY
    );

    const decryptedData = bytes.toString(
        CryptoJS.enc.Utf8
    );

    return JSON.parse(decryptedData);
}