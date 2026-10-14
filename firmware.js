/* =========================================
   NEZHA FIRMWARE LIBRARY
========================================= */


/*
 * Add your firmware here.
 *
 * "file" must point to the actual .bin
 * file inside your GitHub repository.
 */

const firmwareList = [

    {
        name: "Bruce Firmware",
        board: "ESP32 Dev",
        version: "CYD-2432S028",
        size: "3.5 MB",
        date: "2026-10-03",

        description:
            "For 2.4 TFT Display...",

        file:
            "firmware/bruce/Bruce-CYD-2432S028.bin"
    },


    {
        name: "Nezha S3",
        board: "ESP32-S3",
        version: "1.0.0",
        size: "4.2 MB",
        date: "2026-10-03",

        description:
            "Nezha firmware optimized for ESP32-S3 boards.",

        file:
            "firmware/esp32-s3/nezha-s3-v1.0.0.bin"
    },


    {
        name: "Nezha C3",
        board: "ESP32-C3",
        version: "1.0.0",
        size: "2.9 MB",
        date: "2026-10-03",

        description:
            "Compact Nezha firmware for ESP32-C3 boards.",

        file:
            "firmware/esp32-c3/nezha-c3-v1.0.0.bin"
    },


    {
        name: "Nezha ESP8266",
        board: "ESP8266",
        version: "1.0.0",
        size: "1.2 MB",
        date: "2026-10-03",

        description:
            "Nezha firmware for ESP8266 development boards.",

        file:
            "firmware/esp8266/nezha-esp8266-v1.0.0.bin"
    }

];


/* =========================================
   Elements
========================================= */

const grid =
    document.getElementById("firmwareGrid");

const searchInput =
    document.getElementById("searchInput");

const emptyState =
    document.getElementById("emptyState");

const filterButtons =
    document.querySelectorAll(".filter-btn");


let currentBoard = "all";


/* =========================================
   Render
========================================= */

function renderFirmware() {

    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    const filtered =
        firmwareList.filter(firmware => {

            const matchesBoard =
                currentBoard === "all" ||
                firmware.board === currentBoard;


            const matchesSearch =
                firmware.name
                    .toLowerCase()
                    .includes(search)

                ||

                firmware.board
                    .toLowerCase()
                    .includes(search)

                ||

                firmware.version
                    .toLowerCase()
                    .includes(search);


            return (
                matchesBoard &&
                matchesSearch
            );

        });


    grid.innerHTML = "";


    if (filtered.length === 0) {

        emptyState.classList.remove(
            "hidden"
        );

        return;
    }


    emptyState.classList.add(
        "hidden"
    );


    filtered.forEach(
        firmware => {

            grid.appendChild(
                createFirmwareCard(
                    firmware
                )
            );

        }
    );

}


/* =========================================
   Firmware Card
========================================= */

function createFirmwareCard(firmware) {

    const card =
        document.createElement("article");


    card.className =
        "firmware-card";


    card.innerHTML = `

        <div class="card-top">

            <div class="firmware-icon">
                ⚡
            </div>

            <span class="board-badge">
                ${firmware.board}
            </span>

        </div>


        <div class="card-content">

            <h3>
                ${firmware.name}
            </h3>

            <p>
                ${firmware.description}
            </p>

        </div>


        <div class="firmware-meta">

            <div>
                <span>VERSION</span>
                <strong>
                    ${firmware.version}
                </strong>
            </div>

            <div>
                <span>SIZE</span>
                <strong>
                    ${firmware.size}
                </strong>
            </div>

        </div>


        <div class="card-footer">

            <span class="release-date">
                Released ${firmware.date}
            </span>


            <a
                href="${firmware.file}"
                download
                class="download-btn"
            >
                ↓ Download
            </a>

        </div>

    `;


    return card;
}


/* =========================================
   Search
========================================= */

searchInput.addEventListener(
    "input",
    renderFirmware
);


/* =========================================
   Filters
========================================= */

filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            filterButtons.forEach(
                btn =>
                    btn.classList.remove(
                        "active"
                    )
            );


            button.classList.add(
                "active"
            );


            currentBoard =
                button.dataset.board;


            renderFirmware();

        }
    );

});


/* =========================================
   Start
========================================= */

renderFirmware();