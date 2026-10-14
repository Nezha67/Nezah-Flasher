/* =========================================
   NEZHA FLASHER
   Application JavaScript
========================================= */


/* =========================================
   Elements
========================================= */

const boardSelect =
    document.getElementById("boardSelect");

const connectBtn =
    document.getElementById("connectBtn");

const flashBtn =
    document.getElementById("flashBtn");

const eraseBtn =
    document.getElementById("eraseBtn");

const firmwareInput =
    document.getElementById("firmwareInput");

const uploadArea =
    document.getElementById("uploadArea");

const firmwareInfo =
    document.getElementById("firmwareInfo");

const fileName =
    document.getElementById("fileName");

const fileSize =
    document.getElementById("fileSize");

const removeFile =
    document.getElementById("removeFile");

const deviceInfo =
    document.getElementById("deviceInfo");

const connectionStatus =
    document.getElementById("connectionStatus");

const chipName =
    document.getElementById("chipName");

const macAddress =
    document.getElementById("macAddress");

const flashSize =
    document.getElementById("flashSize");

const progressBar =
    document.getElementById("progressBar");

const progressPercent =
    document.getElementById("progressPercent");

const progressStatus =
    document.getElementById("progressStatus");

const progressSize =
    document.getElementById("progressSize");

const terminal =
    document.getElementById("terminal");

const clearTerminal =
    document.getElementById("clearTerminal");


/* =========================================
   Application State
========================================= */

let selectedFirmware = null;

let connected = false;

let flashing = false;


/* =========================================
   Terminal
========================================= */

function log(message, type = "") {

    const line =
        document.createElement("div");

    line.className =
        `terminal-line ${type}`;

    const time =
        new Date().toLocaleTimeString();

    line.innerHTML = `
        <span>[${time}]</span>
        ${escapeHTML(message)}
    `;

    terminal.appendChild(line);

    terminal.scrollTop =
        terminal.scrollHeight;
}


function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* =========================================
   Browser Support
========================================= */

function checkBrowserSupport() {

    if (!("serial" in navigator)) {

        log(
            "Web Serial API is not supported by this browser.",
            "error"
        );

        connectBtn.disabled = true;

        return false;
    }

    log(
        "Web Serial API detected.",
        "success"
    );

    return true;
}


/* =========================================
   Firmware File
========================================= */

firmwareInput.addEventListener(
    "change",
    event => {

        const file =
            event.target.files[0];

        if (!file) {
            return;
        }

        handleFirmware(file);
    }
);


function handleFirmware(file) {

    if (!file.name.toLowerCase().endsWith(".bin")) {

        log(
            "Invalid firmware file. Please select a .bin file.",
            "error"
        );

        firmwareInput.value = "";

        return;
    }


    selectedFirmware = file;


    fileName.textContent =
        file.name;


    fileSize.textContent =
        formatBytes(file.size);


    firmwareInfo.classList.remove(
        "hidden"
    );


    uploadArea.classList.add(
        "hidden"
    );


    updateButtons();


    log(
        `Firmware selected: ${file.name}`
    );


    log(
        `Firmware size: ${formatBytes(file.size)}`
    );
}


/* =========================================
   Remove Firmware
========================================= */

removeFile.addEventListener(
    "click",
    () => {

        selectedFirmware = null;

        firmwareInput.value = "";

        firmwareInfo.classList.add(
            "hidden"
        );

        uploadArea.classList.remove(
            "hidden"
        );

        updateButtons();

        resetProgress();

        log(
            "Firmware removed."
        );
    }
);


/* =========================================
   Drag & Drop
========================================= */

uploadArea.addEventListener(
    "dragover",
    event => {

        event.preventDefault();

        uploadArea.classList.add(
            "dragover"
        );
    }
);


uploadArea.addEventListener(
    "dragleave",
    () => {

        uploadArea.classList.remove(
            "dragover"
        );
    }
);


uploadArea.addEventListener(
    "drop",
    event => {

        event.preventDefault();

        uploadArea.classList.remove(
            "dragover"
        );

        const file =
            event.dataTransfer.files[0];

        if (file) {

            handleFirmware(file);
        }
    }
);


/* =========================================
   Connect Device
========================================= */

connectBtn.addEventListener(
    "click",
    async () => {

        if (!("serial" in navigator)) {

            log(
                "Web Serial is not available.",
                "error"
            );

            return;
        }


        try {

            log(
                "Opening serial device selector..."
            );


            /*
             * Temporary browser connection.
             *
             * Real ESP flashing will be connected
             * through esptool-js in the next version.
             */

            const port =
                await navigator.serial.requestPort();


            await port.open({
                baudRate: 115200
            });


            connected = true;


            connectionStatus.textContent =
                "● Connected";

            connectionStatus.className =
                "connected";


            deviceInfo.classList.remove(
                "hidden"
            );


            const board =
                boardSelect.options[
                    boardSelect.selectedIndex
                ].text;


            chipName.textContent =
                board;


            /*
             * Placeholder values.
             *
             * These will be replaced with real
             * chip information from esptool-js.
             */

            macAddress.textContent =
                "Detecting...";


            flashSize.textContent =
                "Detecting...";


            log(
                `Serial device connected: ${board}`,
                "success"
            );


            log(
                "Serial port opened at 115200 baud."
            );


            /*
             * Temporary simulated information.
             */

            setTimeout(() => {

                macAddress.textContent =
                    "XX:XX:XX:XX:XX:XX";

                flashSize.textContent =
                    "4 MB";

                log(
                    "Device information ready."
                );

            }, 800);


            updateButtons();


        } catch (error) {

            console.error(error);

            log(
                `Connection failed: ${error.message}`,
                "error"
            );
        }
    }
);


/* =========================================
   Flash
========================================= */

flashBtn.addEventListener(
    "click",
    async () => {

        if (!selectedFirmware) {

            log(
                "No firmware selected.",
                "error"
            );

            return;
        }


        if (!connected) {

            log(
                "Please connect your ESP device first.",
                "error"
            );

            return;
        }


        if (flashing) {
            return;
        }


        flashing = true;

        updateButtons();

        resetProgress();


        log(
            "Starting firmware flash..."
        );


        log(
            `Firmware: ${selectedFirmware.name}`
        );


        log(
            `Size: ${formatBytes(selectedFirmware.size)}`
        );


        /*
         * TEMPORARY FLASH SIMULATION
         *
         * Replace this section with
         * esptool-js in the next version.
         */

        await simulateFlash();


        flashing = false;

        updateButtons();


        log(
            "Firmware flashing completed!",
            "success"
        );


        progressStatus.textContent =
            "Flash completed successfully";
    }
);


/* =========================================
   Simulated Flash
========================================= */

function simulateFlash() {

    return new Promise(resolve => {

        let progress = 0;


        const interval =
            setInterval(() => {

                progress +=
                    Math.floor(
                        Math.random() * 8
                    ) + 3;


                if (progress >= 100) {

                    progress = 100;

                    clearInterval(
                        interval
                    );

                    updateProgress(
                        100
                    );

                    resolve();

                    return;
                }


                updateProgress(
                    progress
                );


            }, 180);

    });
}


/* =========================================
   Erase Flash
========================================= */

eraseBtn.addEventListener(
    "click",
    async () => {

        if (!connected) {

            log(
                "Connect your ESP device first.",
                "error"
            );

            return;
        }


        const confirmed =
            confirm(
                "Erase the entire flash memory?"
            );


        if (!confirmed) {

            log(
                "Flash erase cancelled."
            );

            return;
        }


        eraseBtn.disabled = true;


        log(
            "Erasing flash..."
        );


        /*
         * Temporary simulation.
         */

        await delay(1500);


        log(
            "Flash erase completed.",
            "success"
        );


        eraseBtn.disabled = false;
    }
);


/* =========================================
   Progress
========================================= */

function updateProgress(percent) {

    progressBar.style.width =
        `${percent}%`;

    progressPercent.textContent =
        `${percent}%`;


    if (selectedFirmware) {

        const current =
            selectedFirmware.size *
            (percent / 100);

        progressSize.textContent =
            `${formatBytes(current)} / ${formatBytes(selectedFirmware.size)}`;
    }


    if (percent < 100) {

        progressStatus.textContent =
            "Writing firmware...";
    }

    else {

        progressStatus.textContent =
            "Finalizing...";
    }
}


function resetProgress() {

    progressBar.style.width =
        "0%";

    progressPercent.textContent =
        "0%";

    progressStatus.textContent =
        "Ready to flash";

    progressSize.textContent =
        "0 / 0 KB";
}


/* =========================================
   Button State
========================================= */

function updateButtons() {

    connectBtn.disabled =
        connected || flashing;


    flashBtn.disabled =
        !connected ||
        !selectedFirmware ||
        flashing;


    eraseBtn.disabled =
        !connected ||
        flashing;


    if (connected) {

        connectBtn.innerHTML =
            "<span>✓</span> Device Connected";
    }

    else {

        connectBtn.innerHTML =
            "<span>🔌</span> Connect Device";
    }

}


/* =========================================
   Clear Terminal
========================================= */

clearTerminal.addEventListener(
    "click",
    () => {

        terminal.innerHTML = "";

        log(
            "Terminal cleared."
        );
    }
);


/* =========================================
   Helpers
========================================= */

function formatBytes(bytes) {

    if (!bytes) {
        return "0 KB";
    }


    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB"
    ];


    const index =
        Math.floor(
            Math.log(bytes) /
            Math.log(1024)
        );


    return (
        parseFloat(
            (bytes /
                Math.pow(
                    1024,
                    index
                )
            ).toFixed(2)
        )
        + " "
        + units[index]
    );
}


function delay(ms) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                ms
            )
    );
}


/* =========================================
   Initialize
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        checkBrowserSupport();

        updateButtons();

        log(
            "Nezha Flasher ready.",
            "success"
        );
    }
);