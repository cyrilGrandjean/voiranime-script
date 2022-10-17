const DBOpenRequest = window.indexedDB.open("csvExporter", 4);
let db;

let seriesId;
let chapterNumber;
let reader;
let url;
let chapters = [];
let inDB = false;

DBOpenRequest.onerror = (event) => {
    console.error("Error loading database.");
};

DBOpenRequest.onupgradeneeded = (event) => {
    db = event.target.result;

    // Create an objectStore for this database
    const objectStore = db.createObjectStore("chapterUrls", {
        keyPath: ["serie", "chapter"],
    });

    // Define what data items the objectStore will contain
    objectStore.createIndex("serie", "serie", {unique: false});
    objectStore.createIndex("url", "url", {unique: false});
    objectStore.createIndex("fullUrl", "fullUrl", {unique: true});
};

DBOpenRequest.onsuccess = (event) => {
    console.info("Database initialized.");
    db = DBOpenRequest.result;

    initViewer();
    initList();
};

function addListDL() {
    const swapLink = document.querySelector("a[title='Change Order']");
    swapLink.style.marginLeft = "auto";

    const icon = document.createElement("i")
    icon.classList.add("icon", "ion-md-download");
    icon.style.transform = "unset";

    const link = document.createElement("a");
    link.href = "#";
    link.classList.add("btn-reverse-order");
    link.appendChild(icon);

    link.addEventListener("click", e => {
        e.preventDefault();
        createCSV(chapters);
    })

    swapLink.parentNode.appendChild(link);
}

function createCSV(chapters) {
    const csvRows = [];
    csvRows.push("Episode;Url");

    csvRows.push(...chapters.map(c => `${c.chapter};${c.url}`));

    const blob = new Blob([csvRows.join("\n")], {type: 'text/csv'});

    // Creating an object for downloading url
    const url = window.URL.createObjectURL(blob)

    // Creating an anchor(a) tag of HTML
    const a = document.createElement('a')

    // Passing the blob downloading url
    a.setAttribute('href', url)

    // Setting the anchor tag attribute for downloading
    // and passing the download file name
    a.setAttribute('download', `${seriesId}.csv`);

    // Performing a download with click
    a.click()
}

function getSeriesChapters(chapterList) {
    const objectStore = db.transaction('chapterUrls').objectStore('chapterUrls');

    const seriesIndex = objectStore.index('serie');
    const keyRng = IDBKeyRange.only(seriesId);
    const cursorRequest = seriesIndex.openCursor(keyRng);

    cursorRequest.onsuccess = e => {
        const cursor = e.target.result;
        if (cursor) {
            const chapter = chapterList.querySelector(`a[href='${cursor.value.fullUrl}']`)
            chapters.push(cursor.value);

            chapter.innerHTML = chapter.innerHTML.replace("✖", "✔")

            cursor.continue();
        }
        cursorRequest.onerror = e => {
            console.error("ERROOOOR");
        }
    }

}

function addButton() {
    const button = document.createElement("button");
    button.id = "csvExportButton";
    button.disabled = true;
    button.innerHTML = "LOADING...";
    button.classList.add("btn");

    button.style.backgroundColor = "black";
    button.style.color = "white";
    button.style.height = "36px";
    button.style.padding = "4px";

    button.addEventListener("click", copyToClipboard);

    const nextContainer = document.querySelector(".select-view");
    nextContainer.appendChild(button);
}

function updateButton() {
    const button = document.getElementById("csvExportButton");
    if (inDB) {
        button.disabled = false;
        button.innerHTML = "Copy episode's url"
    } else {
        button.innerHTML = "Resolve this captcha first";
        button.disabled = true;
    }
}

function copyToClipboard() {
    const objectStore = db.transaction('chapterUrls').objectStore('chapterUrls');

    const objectStoreRequest = objectStore.get([seriesId, chapterNumber]);

    objectStoreRequest.onsuccess = (event) => {
        navigator.clipboard.writeText(objectStoreRequest.result.url);

        const button = document.getElementById("csvExportButton");

        button.innerHTML = "Copied!";
        button.disabled = true;

        setTimeout(updateButton, 2000);
    };
}

function isDataInDB() {
    const objectStore = db.transaction('chapterUrls').objectStore('chapterUrls');

    const objectStoreRequest = objectStore.get([seriesId, chapterNumber]);

    objectStoreRequest.onsuccess = (event) => {
        inDB = !!objectStoreRequest.result;
        updateButton();
    };

    objectStoreRequest.onerror = (event) => {
        console.log("Couldn't fetch the db data")
    };
}

function addData() {
    if (!seriesId || !chapterNumber || !url) return;

    let fullUrl = window.location.href;
    if (!fullUrl.endsWith("/")) {
        fullUrl += "/";
    }

    const newItem = {
        serie: seriesId,
        chapter: chapterNumber,
        url,
        fullUrl,
    };

    // Open a read/write DB transaction, ready for adding the data
    const transaction = db.transaction(["chapterUrls"], "readwrite");

    // Report on the success of the transaction completing, when everything is done
    transaction.oncomplete = () => {
        console.log("Added data successfully");
        isDataInDB();
    };

    // Handler for any unexpected error
    transaction.onerror = () => {
        console.error(`Transaction not opened due to error: ${transaction.error}`);
    };

    // Call an object store that's already been added to the database
    const objectStore = transaction.objectStore("chapterUrls");

    // Make a request to add our newItem object to the object store
    objectStore.add(newItem);
}

function addCaptchaListener() {
    const buttonCaptcha = document.querySelector(
        "#chapter-video-captcha-validator button[type=submit]"
    );

    if (!buttonCaptcha) return;

    buttonCaptcha.addEventListener("click", () => {
        setTimeout(getIframe(true), 1000);
    });
}

function getIframe(retry) {
    return () => {
        if (reader !== "LECTEUR Stape") return;
        const iframe = document.querySelector(".chapter-video-frame iframe");

        if (iframe.title === "reCAPTCHA") {
            if (retry) {
                setTimeout(getIframe(false), 500);
            } else {
                console.log("The captcha wasn't completed");
            }
        } else {
            console.log("The iframe url is:", iframe.src);
            url = iframe.src;
            addData();
        }
    };
}