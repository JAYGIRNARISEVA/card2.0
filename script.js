// ==========================================================
// JAY GIRNARI SEVA MANDAL
// DONOR CARD GENERATOR
// PART 1
// ==========================================================

// =============================
// ELEMENTS
// =============================

const donorName = document.getElementById("donorName");
const donationAmount = document.getElementById("donationAmount");
const photoInput = document.getElementById("photoInput");

const previewName = document.getElementById("previewName");
const previewAmount = document.getElementById("previewAmount");
const previewPhoto = document.getElementById("previewPhoto");
const amountWords = document.getElementById("amountWords");
const todayDate = document.getElementById("todayDate");

const card = document.getElementById("card");

const downloadBtn = document.getElementById("downloadBtn");
const shareBtn = document.getElementById("shareBtn");

// =============================
// TODAY DATE
// =============================

function loadDate() {

    const d = new Date();

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    todayDate.textContent = `તા. ${day}-${month}-${year}`;
}

loadDate();

// =============================
// DEFAULT VALUES
// =============================

previewName.textContent = "દાતાનું નામ";
previewAmount.textContent = "₹ ૦/-";
amountWords.textContent = "શૂન્ય રૂપિયા પૂરા";

// =============================
// DONOR NAME LIVE UPDATE
// =============================

donorName.addEventListener("input", () => {

    const value = donorName.value.trim();

    if (value === "") {

        previewName.textContent = "દાતાનું નામ";

    } else {

        previewName.textContent = value;

    }

});

// =============================
// AMOUNT MAP
// =============================

const amountMap = {

    100: "એકસો રૂપિયા પૂરા",

    500: "પાંચસો રૂપિયા પૂરા",

    1000: "એક હજાર રૂપિયા પૂરા",

    1100: "એક હજાર એકસો રૂપિયા પૂરા",

    2100: "બે હજાર એકસો રૂપિયા પૂરા",

    5100: "પાંચ હજાર એકસો રૂપિયા પૂરા",

    11000: "અગિયાર હજાર રૂપિયા પૂરા",

    21000: "એકવીસ હજાર રૂપિયા પૂરા",

    51000: "એકાવન હજાર રૂપિયા પૂરા",

    101000: "એક લાખ એક હજાર રૂપિયા પૂરા"

};

// =============================
// DONATION LIVE UPDATE
// =============================

donationAmount.addEventListener("input", () => {

    const amount = parseInt(donationAmount.value);

    if (isNaN(amount) || amount < 0) {

        previewAmount.textContent = "₹ ૦/-";
        amountWords.textContent = "શૂન્ય રૂપિયા પૂરા";

        return;
    }

    previewAmount.textContent =
        "₹ " +
        amount.toLocaleString("en-IN") +
        "/-";

    amountWords.textContent =
        amountMap[amount] ||
        amount.toLocaleString("en-IN") +
        " રૂપિયા પૂરા";

});

// =============================
// PHOTO UPLOAD
// =============================

photoInput.addEventListener("change", () => {

    const file = photoInput.files[0];

    if (!file)
        return;

    // Check image

    if (!file.type.startsWith("image/")) {

        alert("કૃપા કરીને માત્ર ફોટો પસંદ કરો.");

        photoInput.value = "";

        return;

    }

    // Max 5 MB

    if (file.size > 5 * 1024 * 1024) {

        alert("ફોટો 5 MB કરતાં મોટો ન હોવો જોઈએ.");

        photoInput.value = "";

        return;

    }

    const reader = new FileReader();

    reader.onload = (e) => {

        previewPhoto.src = e.target.result;

    };

    reader.onerror = () => {

        alert("ફોટો વાંચવામાં ભૂલ આવી.");

    };

    reader.readAsDataURL(file);

});

// =============================
// HELPER
// =============================

async function generateCanvas() {

    return await html2canvas(card, {

        scale: 3,

        useCORS: true,

        allowTaint: false,

        backgroundColor: "#ffffff",

        logging: false,

        imageTimeout: 0,

        width: card.offsetWidth,

        height: card.offsetHeight,

        scrollX: 0,

        scrollY: 0

    });
// ==========================================================
// PART 2
// DOWNLOAD + SHARE
// ==========================================================

// =============================
// HD DOWNLOAD
// =============================

downloadBtn.addEventListener("click", async () => {

    try {

        downloadBtn.disabled = true;
        downloadBtn.textContent = "Generating...";

        const canvas = await generateCanvas();

        const link = document.createElement("a");

        link.download = "donor-card.png";

        link.href = canvas.toDataURL("image/png", 1.0);

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

    } catch (error) {

        console.error(error);

        alert("કાર્ડ Download કરવામાં ભૂલ આવી.");

    } finally {

        downloadBtn.disabled = false;

        downloadBtn.textContent = "⬇ HD Download";

    }

});

// =============================
// WHATSAPP SHARE
// =============================

shareBtn.addEventListener("click", async () => {

    try {

        shareBtn.disabled = true;

        shareBtn.textContent = "Preparing...";

        const canvas = await generateCanvas();

        canvas.toBlob(async (blob) => {

            if (!blob) {

                alert("Image બનાવવામાં ભૂલ આવી.");

                resetShareButton();

                return;

            }

            const file = new File(
                [blob],
                "donor-card.png",
                {
                    type: "image/png"
                }
            );

            if (
                navigator.canShare &&
                navigator.canShare({
                    files: [file]
                })
            ) {

                try {

                    await navigator.share({

                        title: "જય ગીરનારી સેવા મંડળ",

                        text: "સેવા પરમો ધર્મ: આપના સહકાર બદલ હાર્દિક આભાર.",

                        files: [file]

                    });

                } catch (err) {

                    console.log("Share cancelled.");

                }

            } else {

                alert(
                    "આ Browser સીધું Share સપોર્ટ કરતું નથી.\n\nપહેલા HD Download કરો."
                );

            }

            resetShareButton();

        }, "image/png");

    } catch (error) {

        console.error(error);

        alert("Share કરવામાં ભૂલ આવી.");

        resetShareButton();

    }

});

// =============================
// RESET SHARE BUTTON
// =============================

function resetShareButton() {

    shareBtn.disabled = false;

    shareBtn.textContent = "WhatsApp Share";

}
// ==========================================================
// PART 3
// INITIALIZATION + UTILITIES
// ==========================================================

// =============================
// RESET FORM (OPTIONAL)
// =============================

function resetCard() {

    previewName.textContent = "દાતાનું નામ";

    previewAmount.textContent = "₹ ૦/-";

    amountWords.textContent = "શૂન્ય રૂપિયા પૂરા";

    previewPhoto.src = "default-user.png";

    donorName.value = "";

    donationAmount.value = "";

    photoInput.value = "";

}

// =============================
// INITIAL LIVE UPDATE
// =============================

window.addEventListener("load", () => {

    donorName.dispatchEvent(new Event("input"));

    donationAmount.dispatchEvent(new Event("input"));

});

// =============================
// PREVENT IMAGE DRAG
// =============================

document.querySelectorAll("img").forEach(img => {

    img.draggable = false;

});

// =============================
// PREVENT DOUBLE CLICK ON BUTTONS
// =============================

document.querySelectorAll("button").forEach(button => {

    button.addEventListener("dblclick", (e) => {

        e.preventDefault();

    });

});

// =============================
// PREVENT NEGATIVE VALUES
// =============================

donationAmount.addEventListener("keydown", (e) => {

    if (e.key === "-" || e.key === "+") {

        e.preventDefault();

    }

});

// =============================
// LIMIT MAX LENGTH
// =============================

donorName.addEventListener("input", () => {

    if (donorName.value.length > 40) {

        donorName.value =
            donorName.value.substring(0, 40);

    }

});

// =============================
// AUTO TRIM SPACES
// =============================

donorName.addEventListener("change", () => {

    donorName.value = donorName.value.trim();

});

// =============================
// END
// =============================

console.log(
    "Donor Card Generator Loaded Successfully."
);
}
