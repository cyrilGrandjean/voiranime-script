// ==UserScript==
// @name        voiranime-csv-exporter
// @description Keep track of the VoirAnime sources, to export them easily
// @namespace   github.com/D34DPlayer
// @match       https://voiranime.com/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=voiranime.com
// @version     1.0.0
// @author      D34DPlayer
// @license     MIT
// @grant       none
// ==/UserScript==

/*
MIT License

Copyright (c) 2022 D34DPlayer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/* globals React, ReactDOM */
(function () {
    'use strict';

    class Context {
        constructor() {
            this.chapters = [];
            this.inDB = false;
        }
    }

    function initDB() {
        return new Promise((resolve, reject) => {
            const DBOpenRequest = window.indexedDB.open("csvExporter", 4);
            DBOpenRequest.onerror = (_) => {
                console.error("Error loading database.");
                reject();
            };
            DBOpenRequest.onupgradeneeded = (_) => {
                const db = DBOpenRequest.result;
                // Create an objectStore for this database
                const objectStore = db.createObjectStore("chapterUrls", {
                    keyPath: ["serie", "chapter"],
                });
                // Define what data items the objectStore will contain
                objectStore.createIndex("serie", "serie", { unique: false });
                objectStore.createIndex("url", "url", { unique: false });
                objectStore.createIndex("fullUrl", "fullUrl", { unique: true });
            };
            DBOpenRequest.onsuccess = (_) => {
                console.info("Database initialized.");
                resolve(DBOpenRequest.result);
            };
        });
    }

    function addListDL(context) {
        const swapLink = document.querySelector("a[title='Change Order']");
        swapLink.style.marginLeft = "auto";
        const icon = document.createElement("i");
        icon.classList.add("icon", "ion-md-download");
        icon.style.transform = "unset";
        const link = document.createElement("a");
        link.href = "#";
        link.classList.add("btn-reverse-order");
        link.appendChild(icon);
        link.addEventListener("click", (e) => {
            e.preventDefault();
            createCSV(context);
        });
        swapLink.parentNode.appendChild(link);
    }
    function createCSV(context) {
        const csvRows = [];
        csvRows.push("Episode;Url");
        csvRows.push(...context.chapters.map((c) => `${c.chapter};${c.url}`));
        const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
        // Creating an object for downloading url
        const url = window.URL.createObjectURL(blob);
        // Creating an anchor(a) tag of HTML
        const a = document.createElement("a");
        // Passing the blob downloading url
        a.setAttribute("href", url);
        // Setting the anchor tag attribute for downloading
        // and passing the download file name
        a.setAttribute("download", `${context.seriesId}.csv`);
        // Performing a download with click
        a.click();
    }
    function getSeriesChapters(db, context, chapterList) {
        const objectStore = db.transaction("chapterUrls").objectStore("chapterUrls");
        const seriesIndex = objectStore.index("serie");
        const keyRng = IDBKeyRange.only(context.seriesId);
        const cursorRequest = seriesIndex.openCursor(keyRng);
        cursorRequest.onsuccess = (e) => {
            // @ts-ignore
            const cursor = e.target.result;
            if (cursor) {
                const chapter = chapterList.querySelector(`a[href='${cursor.value.fullUrl}']`);
                context.chapters.push(cursor.value);
                chapter.innerHTML = chapter.innerHTML.replace("✖", "✔");
                cursor.continue();
            }
            cursorRequest.onerror = (e) => {
                console.error("ERROOOOR");
            };
        };
    }
    function addButton(db, context) {
        const button = document.createElement("button");
        button.id = "csvExportButton";
        button.disabled = true;
        button.innerHTML = "LOADING...";
        button.classList.add("btn");
        button.style.backgroundColor = "black";
        button.style.color = "white";
        button.style.height = "36px";
        button.style.padding = "4px";
        button.addEventListener("click", copyToClipboard(db, context));
        const nextContainer = document.querySelector(".select-view");
        nextContainer.appendChild(button);
    }
    function updateButton(context) {
        const button = document.getElementById("csvExportButton");
        if (context.inDB) {
            button.disabled = false;
            button.innerHTML = "Copy episode's url";
        }
        else {
            button.innerHTML = "Resolve this captcha first";
            button.disabled = true;
        }
    }
    function copyToClipboard(db, context) {
        return () => {
            const objectStore = db
                .transaction("chapterUrls")
                .objectStore("chapterUrls");
            const objectStoreRequest = objectStore.get([
                context.seriesId,
                context.chapterNumber,
            ]);
            objectStoreRequest.onsuccess = (event) => {
                navigator.clipboard.writeText(objectStoreRequest.result.url);
                const button = document.getElementById("csvExportButton");
                button.innerHTML = "Copied!";
                button.disabled = true;
                setTimeout(updateButton, 2000);
            };
        };
    }
    function isDataInDB(db, context) {
        const objectStore = db.transaction("chapterUrls").objectStore("chapterUrls");
        const objectStoreRequest = objectStore.get([
            context.seriesId,
            context.chapterNumber,
        ]);
        objectStoreRequest.onsuccess = (event) => {
            context.inDB = !!objectStoreRequest.result;
            updateButton(context);
        };
        objectStoreRequest.onerror = (event) => {
            console.log("Couldn't fetch the db data");
        };
    }
    function addData(db, context) {
        if (!context.seriesId || !context.chapterNumber || !context.url)
            return;
        let fullUrl = window.location.href;
        if (!fullUrl.endsWith("/")) {
            fullUrl += "/";
        }
        const newItem = {
            serie: context.seriesId,
            chapter: context.chapterNumber,
            url: context.url,
            fullUrl: context.fullUrl,
        };
        // Open a read/write DB transaction, ready for adding the data
        const transaction = db.transaction(["chapterUrls"], "readwrite");
        // Report on the success of the transaction completing, when everything is done
        transaction.oncomplete = () => {
            console.log("Added data successfully");
            isDataInDB(db, context);
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
    function addCaptchaListener(db, context) {
        return () => {
            const buttonCaptcha = document.querySelector("#chapter-video-captcha-validator button[type=submit]");
            if (!buttonCaptcha)
                return;
            buttonCaptcha.addEventListener("click", () => {
                setTimeout(getIframe(db, context, true), 1000);
            });
        };
    }
    function getIframe(db, context, retry) {
        return () => {
            if (context.reader !== "LECTEUR Stape")
                return;
            const iframe = document.querySelector(".chapter-video-frame iframe");
            if (iframe.title === "reCAPTCHA") {
                if (retry) {
                    setTimeout(getIframe(db, context, false), 500);
                }
                else {
                    console.log("The captcha wasn't completed");
                }
            }
            else {
                console.log("The iframe url is:", iframe.src);
                context.url = iframe.src;
                addData(db, context);
            }
        };
    }

    function initViewer(db, context) {
        const lecteurPicker = document.querySelector(".host-select");
        if (!lecteurPicker)
            return;
        const chapterPicker = document.querySelector(".single-chapter-select");
        context.seriesId = window.location.pathname.split("/")[2];
        context.chapterNumber =
            chapterPicker.options[chapterPicker.selectedIndex].innerHTML;
        context.reader = lecteurPicker.value;
        addCaptchaListener(db, context)();
        lecteurPicker.addEventListener("change", (e) => {
            context.reader = e.target.value;
            console.log("READER", context.reader);
            setTimeout(addCaptchaListener(db, context), 100);
        });
        addButton(db, context);
        isDataInDB(db, context);
    }
    function initList(db, context) {
        const chapterList = document.querySelector(".version-chap");
        if (!chapterList)
            return;
        for (const a of chapterList.querySelectorAll("li a")) {
            a.innerHTML += " ✖";
        }
        context.seriesId = window.location.pathname.split("/")[2];
        getSeriesChapters(db, context, chapterList);
        addListDL(context);
    }

    (async () => {
      const context = new Context();
      const db = await initDB();
      initViewer(db, context);
      initList(db, context);
    })();

})();
//# sourceMappingURL=bundle.user.js.map
