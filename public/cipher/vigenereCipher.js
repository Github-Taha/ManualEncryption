class VigenereCipher {
    static letterList = "\0\n\tABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`~-_=+[]{}|\\;:'\",./<>?!@#$%^&*() ";

    /**
	 * Encrypts text in a Vigenere cipher.
	 * @param {string} text Plain text
	 * @param {string} key Random or specified key
	 * @returns [
	 * 	text: encrypted text,
	 * 	key: encryption key
	 * ]
	 */
    static encrypt(text, key = "") {
        let finalText = "";

        if (key == "") {
            // Generate Random Key of a random length
            for (let i = 0; i < Math.floor(Math.random() * 100); i++) {
                key += VigenereCipher.letterList[Math.floor(Math.random() * VigenereCipher.letterList.length)];
            }
        }

        for (let i = 0; i < text.length; i++) {
            let index = VigenereCipher.letterList.split("").indexOf(text[i]);
            let keyIndex = VigenereCipher.letterList.split("").indexOf(key[i % key.length]);
            finalText += VigenereCipher.letterList[(index + keyIndex) % VigenereCipher.letterList.length];
        }

        return [finalText, key];
    }

    /**
	 * Decrypts text in a Vigenere cipher.
	 * @param {string} text Encrypted Text
	 * @param {string} key Encryption Key
	 * @returns Decrypted Text
	 */
    static decrypt(text, key) {
        let finalText = "";

        for (let i = 0; i < text.length; i++) {
            let keyIndex = VigenereCipher.letterList.split("").indexOf(key[i % key.length]);
            let index = VigenereCipher.letterList.split("").indexOf(text[i]) - keyIndex;
            index = index < 0 ? VigenereCipher.letterList.length + index : index;
            finalText += VigenereCipher.letterList[index % VigenereCipher.letterList.length];
        }

        return finalText;
    }
}

export { VigenereCipher };
