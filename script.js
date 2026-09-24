// ======================================
// SAVE DATA
// ======================================

const STORAGE_KEY = "fungerTracker";

function saveData() {

    const conditions = {};

    document
        .querySelectorAll(".condition-box[data-condition]")
        .forEach(box => {

            conditions[box.dataset.condition] =
                box.classList.contains("active");

        });

    const limbs = {};

    document
        .querySelectorAll(".limb-slot[data-limb]")
        .forEach(slot => {

            limbs[slot.dataset.limb] =
                slot.classList.contains("active");

        });

    const data = {

        hunger: document.getElementById("hungerValue").value,

        sanity: document.getElementById("sanityValue").value,

        sanityMax: document.getElementById("sanityMax").value,

        notes: document.querySelector("textarea").value,

        heroicInspirations: heroicBox.value,

        conditions: conditions,

        limbs: limbs
    };

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );
}

function loadData() {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return;

    const data = JSON.parse(saved);

    // Hunger

    if (data.hunger !== undefined) {

        document.getElementById("hungerValue").value =
            data.hunger;

        document.getElementById("hungerSlider").value =
            data.hunger;
    }

    // Sanity

    if (data.sanity !== undefined) {

        document.getElementById("sanityValue").value =
            data.sanity;

        document.getElementById("sanitySlider").value =
            data.sanity;
    }

    // Sanity Max

    if (data.sanityMax !== undefined) {

        document.getElementById("sanityMax").value =
            data.sanityMax;

        document.getElementById("sanitySlider").max =
            data.sanityMax;
    }

    // Notes

    if (data.notes !== undefined) {

        document.querySelector("textarea").value =
            data.notes;
    }

    // Heroic Inspirations

    if (data.heroicInspirations !== undefined) {

        heroicBox.value = data.heroicInspirations;

    }

    // Conditions

    if (data.conditions) {

        document
            .querySelectorAll(".condition-box[data-condition]")
            .forEach(box => {

                if (
                    data.conditions[box.dataset.condition]
                ) {
                    box.classList.add("active");
                }

            });
    }

    // Limbs

    if (data.limbs) {

        document
            .querySelectorAll(".limb-slot[data-limb]")
            .forEach(slot => {

                if (
                    data.limbs[slot.dataset.limb]
                ) {

                    slot.classList.add("active");

                }

            });

    }
}


// ======================================
// SLIDER SYNCING
// ======================================

function linkSlider(sliderId, numberId, maxId = null) {

    const slider = document.getElementById(sliderId);
    const number = document.getElementById(numberId);
    const maxInput = maxId
        ? document.getElementById(maxId)
        : null;

    // Current value changed with slider
    slider.addEventListener("input", () => {

        number.value = slider.value;

        saveData();
    });

    // Current value changed with number box
    number.addEventListener("input", () => {

        let value = parseInt(number.value);
        let max = maxInput
            ? parseInt(maxInput.value)
            : 100;

        if (isNaN(value)) value = 0;

        if (value < 0) value = 0;
        if (value > max) value = max;

        number.value = value;
        slider.value = value;

        saveData();
    });

    // Maximum value changed
    if (maxInput) {

        maxInput.addEventListener("input", () => {

            let max = parseInt(maxInput.value);

            if (isNaN(max) || max < 1) {
                max = 1;
            }

            maxInput.value = max;

            // Change slider maximum
            slider.max = max;

            // Make sure current value isn't above new maximum
            let value = parseInt(number.value);

            if (value > max) {
                value = max;
                number.value = value;
                slider.value = value;
            }

            saveData();
        });
    }
}

linkSlider("hungerSlider", "hungerValue");
linkSlider("sanitySlider", "sanityValue", "sanityMax");

// ======================================
// NOTES AUTOSAVE
// ======================================

const notesBox = document.querySelector("textarea");

if (notesBox) {

    notesBox.addEventListener("input", () => {

        saveData();

    });
}


// ======================================
// HEROIC INSPIRATIONS
// ======================================

const heroicBox = document.getElementById("heroicInspiration");

heroicBox.addEventListener("input", () => {
    saveData();
});


// ======================================
// CONDITION BOXES
// ======================================

document
    .querySelectorAll(".condition-box[data-condition]")
    .forEach(box => {

        box.addEventListener("click", () => {

            box.classList.toggle("active");

            saveData();
        });

    });


// ======================================
// LIMB SLOTS
// ======================================

document
    .querySelectorAll(".limb-slot[data-limb]")
    .forEach(slot => {

        slot.addEventListener("click", () => {

            slot.classList.toggle("active");

            saveData();

        });

    });


// ======================================
// POPUPS
// ======================================

const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupText = document.getElementById("popupText");

document.querySelectorAll(".info-btn").forEach(button => {

    button.addEventListener("click", () => {

        popupTitle.textContent =
            button.dataset.title;

        popupText.innerHTML =
            button.dataset.text.replace(/\n/g, "<br>");

        popup.classList.remove("hidden");
    });

});

document
    .getElementById("closePopup")
    .addEventListener("click", () => {

        popup.classList.add("hidden");

    });

popup.addEventListener("click", (e) => {

    if (e.target === popup) {

        popup.classList.add("hidden");

    }

});

// ======================================
// LOAD SAVED DATA
// ======================================

loadData();