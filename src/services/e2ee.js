import CryptoJS from "crypto-js";

// Encrypt message (IV embedded)
export function encryptMessage(base64Key, message) {
    const key = CryptoJS.enc.Base64.parse(base64Key);
    const iv = CryptoJS.lib.WordArray.random(16);

    const encrypted = CryptoJS.AES.encrypt(message, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    // Combine IV + ciphertext as a single string (both base64)
    return (
        iv.toString(CryptoJS.enc.Base64) + ":" + encrypted.ciphertext.toString(CryptoJS.enc.Base64)
    );
}

// Decrypt message (split IV + ciphertext)
export function decryptMessage(base64Key, combined) {
    const key = CryptoJS.enc.Base64.parse(base64Key);
    const [ivB64, ctB64] = combined.split(":");
    const iv = CryptoJS.enc.Base64.parse(ivB64);

    const decrypted = CryptoJS.AES.decrypt({ ciphertext: CryptoJS.enc.Base64.parse(ctB64) }, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
}
