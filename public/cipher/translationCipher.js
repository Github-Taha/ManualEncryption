class TranslationCipher {
	/**
	 * Encrypts text in a translation cipher.
	 * @param {string} text Plain text
	 * @param {string} key Random or specified key
	 * @returns [
	 * 	text: encrypted text,
	 * 	key: encryption key
	 * ]
	 */
	static encrypt(text, key = "random") {
		// Initialization
		let gridLen = Math.ceil(Math.sqrt(text.length));
		let grid = Array.from({ length: gridLen }, () => new Array(gridLen).fill(" "));
		let finalArr =  Array.from({ length: gridLen }, () => new Array(gridLen).fill(" "));
		let finalText = "";

		let keyX = [];
		let keyY = [];

		let possNums = [];

		// Turn text string to a 2D grid
		for (let i = 0; i < gridLen; i++) {
			for (let j = 0; j < gridLen; j++) {
				if (text[i * gridLen + j])
					grid[i][j] = text[i * gridLen + j];
				else
					grid[i][j] = ' ';
			}
		}

		if (key.toLowerCase() == "random") {
			// Get Random KeyX
			for (let i = 0; i < gridLen; i++)
				possNums.push(i);
			for (let i = 0; i < gridLen; i++) {
				let index = Math.floor(Math.random() * possNums.length);
				keyX.push(possNums[index]);
				possNums.splice(index, 1);
			}

			// Get Random KeyY
			for (let i = 0; i < gridLen; i++)
				possNums.push(i);
			for (let i = 0; i < gridLen; i++) {
				let index = Math.floor(Math.random() * possNums.length);
				keyY.push(possNums[index]);
				possNums.splice(index, 1);
			}
		}
		else {
			// Split key into keyX and keyY
			[keyX, keyY] = key.split(":");
			keyX = keyX.split(",");
			keyY = keyY.split(",");
			keyX.forEach((key, index) => {
				keyX[index] = parseInt(key);
			});
			keyY.forEach((key, index) => {
				keyY[index] = parseInt(key);
			});
		}

		// Write encrypted letters to final grid
		for (let i = 0; i < gridLen; i++)
			for (let j = 0; j < gridLen; j++)
				finalArr[i][j] = grid[keyX[i]][keyY[j]];

		// Compile final grid to encrypted string
		for (let i = 0; i < gridLen; i++)
			for (let j = 0; j < gridLen; j++)
				finalText += finalArr[i][j];

		// Return encrypted string and key
		return [
			finalText,
			keyX.join(",") + ":" + keyY.join(",") + ":" + text.length
		]
	}

	/**
	 * Decrypts text in a translation cipher.
	 * @param {string} text Encrypted Text
	 * @param {string} key Encryption Key
	 * @returns Decrypted Text
	 */
	static decrypt(text, key) {
		// Initialization
		let gridLen = Math.ceil(Math.sqrt(text.length));
		let grid = Array.from({ length: gridLen }, () => new Array(gridLen).fill(" "));
		let finalArr =  Array.from({ length: gridLen }, () => new Array(gridLen).fill(" "));
		let finalText = "";

		// Split Keys into keyX, keyY and length
		let [keyX, keyY, length] = key.split(":");
		length = parseInt(length);
		keyX = keyX.split(",");
		keyY = keyY.split(",");
		keyX.forEach((key, index) => {
			keyX[index] = parseInt(key);
		});
		keyY.forEach((key, index) => {
			keyY[index] = parseInt(key);
		});

		// Turn text string to a 2D grid
		for (let i = 0; i < gridLen; i++) {
			for (let j = 0; j < gridLen; j++) {
				if (text[i * gridLen + j])
					grid[i][j] = text[i * gridLen + j];
				else
					grid[i][j] = ' ';
			}
		}

		// Write decrypted letters to final grid
		for (let i = 0; i < gridLen; i++)
			for (let j = 0; j < gridLen; j++)
				finalArr[keyX[i]][keyY[j]] = grid[i][j];

		// Compile final grid to decrypted string
		for (let i = 0; i < gridLen; i++)
			for (let j = 0; j < gridLen; j++)
				finalText += finalArr[i][j];
		
		// Size string to length
		finalText = finalText.substring(0, length);
		
		// Return decrypted text
		return finalText;
	}
}

export { TranslationCipher };
