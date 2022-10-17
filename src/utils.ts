import type { Context } from "./context";

export function addListDL(context: Context) {
  const swapLink: HTMLElement = document.querySelector(
    "a[title='Change Order']"
  );
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

export function createCSV(context: Context) {
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

export function getSeriesChapters(
  db: IDBDatabase,
  context: Context,
  chapterList: HTMLElement
) {
  const objectStore = db.transaction("chapterUrls").objectStore("chapterUrls");

  const seriesIndex = objectStore.index("serie");
  const keyRng = IDBKeyRange.only(context.seriesId);
  const cursorRequest = seriesIndex.openCursor(keyRng);

  cursorRequest.onsuccess = (e) => {
    // @ts-ignore
    const cursor = e.target.result;
    if (cursor) {
      const chapter = chapterList.querySelector(
        `a[href='${cursor.value.fullUrl}']`
      );
      context.chapters.push(cursor.value);

      chapter.innerHTML = chapter.innerHTML.replace("✖", "✔");

      cursor.continue();
    }
    cursorRequest.onerror = (e) => {
      console.error("ERROOOOR");
    };
  };
}

export function addButton(db: IDBDatabase, context: Context) {
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

export function updateButton(context: Context) {
  const button = document.getElementById(
    "csvExportButton"
  ) as HTMLButtonElement;
  if (context.inDB) {
    button.disabled = false;
    button.innerHTML = "Copy episode's url";
  } else {
    button.innerHTML = "Resolve this captcha first";
    button.disabled = true;
  }
}

export function copyToClipboard(db: IDBDatabase, context: Context) {
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

      const button = document.getElementById(
        "csvExportButton"
      ) as HTMLButtonElement;

      button.innerHTML = "Copied!";
      button.disabled = true;

      setTimeout(updateButton, 2000);
    };
  };
}

export function isDataInDB(db: IDBDatabase, context: Context) {
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

export function addData(db: IDBDatabase, context: Context) {
  if (!context.seriesId || !context.chapterNumber || !context.url) return;

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

export function addCaptchaListener(db: IDBDatabase, context: Context) {
  return () => {
    const buttonCaptcha = document.querySelector(
      "#chapter-video-captcha-validator button[type=submit]"
    );

    if (!buttonCaptcha) return;

    buttonCaptcha.addEventListener("click", () => {
      setTimeout(getIframe(db, context, true), 1000);
    });
  };
}

export function getIframe(db: IDBDatabase, context: Context, retry: boolean) {
  return () => {
    if (context.reader !== "LECTEUR Stape") return;
    const iframe: HTMLIFrameElement = document.querySelector(
      ".chapter-video-frame iframe"
    );

    if (iframe.title === "reCAPTCHA") {
      if (retry) {
        setTimeout(getIframe(db, context, false), 500);
      } else {
        console.log("The captcha wasn't completed");
      }
    } else {
      console.log("The iframe url is:", iframe.src);
      context.url = iframe.src;
      addData(db, context);
    }
  };
}
