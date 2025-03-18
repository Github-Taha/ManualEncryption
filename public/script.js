import { Cipher } from "./cipher/cipher.js";

function getFile(filename) {
    const xhr = new XMLHttpRequest();
    xhr.onload = (res) => {
        if (res.status == 404) {
            document.getElementById("output").innerText = "404 Error: Not Found";
        }
        else {
            // Get Encrypted Text.
            let response = JSON.parse(res.target.response);
            
            // Encrypt the ekey(response["key"]) with own encryption
            let [ekey, nkey] = Cipher.encrypt(response["key"]);
            
            // let decryptedText = CaeserCipher.decrypt(response["data"], response["key"]);
            const xhr2 = new XMLHttpRequest();
            xhr2.onload = (res) => {
                // Decrypt Public Key with Private Key
                let decryptedKey = Cipher.decrypt(res.target.response, nkey);

                // Decrypt text decrypted Key
                let decryptedText = Cipher.decrypt(response["data"], decryptedKey);

                // Output Text
                document.getElementById("output").innerText = decryptedText;
            }

            // Setup XMLHTTPRequest 2
            xhr2.open("POST", filename);
            xhr2.setRequestHeader("X-Request-Type", "GETE2");
            xhr2.send(
                    JSON.stringify(
                    {
                        "id": response["id"],
                        "key": ekey
                    }
                )
            );
        }
    }
    xhr.open("GET", filename);
    xhr.setRequestHeader("X-Request-Type", "GETE");
    xhr.send();
}

document.getElementById("getfile").onclick = () => {
    getFile('text.txt');
};

