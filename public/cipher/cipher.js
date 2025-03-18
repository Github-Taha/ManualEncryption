import { CaeserCipher } from "./caeserCipher.js";
import { TranslationCipher } from "./translationCipher.js";
import { VigenereCipher } from "./vigenereCipher.js";

function shuffleArray(arr) {
    let array = arr;
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // Random index
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

class Cipher {
    static ciphers = [
        // "translation",
        "ceaser",
        "vigenere",
    ];

    static encLevel = 5;

    static encrypt(text) {
        // Initialize
        let key = [];
        let order = "";
        let finalText = text;

        // Make Cipher Order
        let ciphers = [];
        for (let i = 0; i < Cipher.encLevel; i++) {
            ciphers.push(Cipher.ciphers[Math.floor(Math.random() * Cipher.ciphers.length)]);
        }
        // let ciphers = shuffleArray([...Cipher.ciphers]);
        
        // Cipher based on randomized shuffle order
        for (let i = 0; i < ciphers.length; i++) {
            let index = Cipher.ciphers.indexOf(ciphers[i]);
            order += index + (i - 1 === ciphers.length ? "" : ":");
            let cKey = "";
            if (ciphers[i] == "translation")
                [finalText, cKey] = TranslationCipher.encrypt(finalText);
            else if (ciphers[i] == "ceaser")
                [finalText, cKey] = CaeserCipher.encrypt(finalText);
            else if (ciphers[i] == "vigenere")
                [finalText, cKey] = VigenereCipher.encrypt(finalText);
            key.push(cKey);
        }
        

        return [
            finalText,
            order + "\0" + JSON.stringify(key)
        ];
    }

    static decrypt(text, key) {
        // Initialize
        let finalText = text;
        key = key.split("\0");
        let order = key[0].split(":");
        for (let i = 0; i < order.length; i++)
            order[i] = parseInt(order[i]);
        key = JSON.parse(key[1])

        // Decrypt the text based on type
        for (let i = order.length - 1; i >= 0; i--) {
            let type = Cipher.ciphers[order[i]];
            
            if (type == "translation")
                finalText = TranslationCipher.decrypt(finalText, key[i]);
            else if (type == "ceaser")
                finalText = CaeserCipher.decrypt(finalText, key[i]);
            else if (type == "vigenere")
                finalText = VigenereCipher.decrypt(finalText, key[i]);

        }

        return finalText;
    }
}

export { Cipher };
