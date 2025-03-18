import { Cipher } from "./encrypt/cipher.mjs";
import http from "http";
import fs from "fs";
import path from "path";
import { CaeserCipher } from "./encrypt/caeserCipher.mjs";

const PORT = 3000;
const PUBLIC_DIR = new URL('./public', import.meta.url).pathname;

let cipheredKeys = new Map();
let currId = 0;

const server = http.createServer(
    (req, res) => {
        const geteRequest = req.rawHeaders.indexOf("X-Request-Type");
        if (req.rawHeaders[geteRequest + 1] == "GETE2") {
            let body = "";

            req.on("data", (chunk) => {
                body += chunk.toString(); // Convert Buffer to String
            });

            req.on("end", () => {
                let request = JSON.parse(body);
        
                if (cipheredKeys.get(request["id"])) {
                    let ekey = request["key"];
                    let key = cipheredKeys.get(request["id"]);
        
                    let dkey = Cipher.decrypt(ekey, key);
        
                    res.writeHead(200, { "Content-Type": "text/plain" });
                    res.end(dkey);
                }
                else {
                    res.writeHead(404, { "Content-Type": "text/plain" });
                    res.end("404 Not Found");
                }
            });

        }
        else {
            let filePath = path.join(PUBLIC_DIR, req.url === "/" ? "index.html" : req.url);
            
            // Check if the file exists
            fs.access(
                filePath,
                fs.constants.F_OK,
                (err) => {
                    if (err) {
                        res.writeHead(404, { "Content-Type": "text/plain" });
                        res.end("404 Not Found");
                        return;
                    }

                    // Read and serve the file
                    fs.readFile(
                        filePath, 
                        (err, data) => {
                            if (err) {
                                res.writeHead(500, { "Content-Type": "text/plain" });
                                res.end("500 Server Error");
                                return;
                            }

                            if (geteRequest < 0) {
                                // Set content type based on file extension
                                let ext = path.extname(filePath);
                                let contentType = {
                                    ".html": "text/html",
                                    ".js": "application/javascript",
                                    ".css": "text/css",
                                    ".json": "application/json",
                                    ".png": "image/png",
                                    ".jpg": "image/jpeg",
                                    ".txt": "text/plain"
                                }[ext] || "application/octet-stream";
                    
                                res.writeHead(200, { "Content-Type": contentType });
                                res.end(data);
                            }
                            else if (req.rawHeaders[geteRequest + 1] == "GETE") {
                                // Give encrypted content
                                res.writeHead(200, {"content-Type": "application/json"});
                                
                                // Send data over
                                currId ++;
                                let [encryptedText, key] = Cipher.encrypt(data.toString());
                                let [encryptedKey, ekey] = Cipher.encrypt(key);
                                res.end(
                                    JSON.stringify
                                    (
                                        {
                                            "key": encryptedKey,
                                            "data": encryptedText,
                                            "id": currId
                                        }
                                    )
                                );

                                // Save the key
                                cipheredKeys.set(currId, ekey);
                            }

                        }
                    );
                }
            );
        }
    }
);

server.listen(
    PORT,
    () => {
        console.log(`Server running at http://localhost:${PORT}/`);
    }
);

