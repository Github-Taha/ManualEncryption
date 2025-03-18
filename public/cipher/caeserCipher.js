class CaeserCipher {
    static letterList = "\0\n\tABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`~-_=+[]{}|\\;:'\",./<>?!@#$%^&*() ";

    /**
	 * Encrypts text in a Ceaser cipher.
	 * @param {string} text Plain text
	 * @param {string} key Random or specified key
	 * @returns [
	 * 	text: encrypted text,
	 * 	key: encryption key
	 * ]
	 */
    static encrypt(text, key = "random") {
        let finalText = "";
        key = typeof(key) == "string" && key.toLowerCase() == "random" ? Math.floor(Math.random() * CaeserCipher.letterList.length) : key;

        for (let i = 0; i < text.length; i++) {
            let index = CaeserCipher.letterList.split("").indexOf(text[i]);
            finalText += CaeserCipher.letterList[(index + key) % CaeserCipher.letterList.length];
        }

        return [finalText, key];
    }

    /**
	 * Decrypts text in a Ceaser cipher.
	 * @param {string} text Encrypted Text
	 * @param {string} key Encryption Key
	 * @returns Decrypted Text
	 */
    static decrypt(text, key) {
        let finalText = "";

        for (let i = 0; i < text.length; i++) {
            let index = CaeserCipher.letterList.split("").indexOf(text[i]) - key;
            index = index < 0 ? CaeserCipher.letterList.length + index : index;
            finalText += CaeserCipher.letterList[index % CaeserCipher.letterList.length];
        }

        return finalText;
    }
}

export { CaeserCipher };
