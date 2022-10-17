import type { Context } from "./context";
import {
  addCaptchaListener,
  addButton,
  isDataInDB,
  getSeriesChapters,
  addListDL,
} from "./utils";

export function initViewer(db: IDBDatabase, context: Context) {
  const lecteurPicker: HTMLInputElement =
    document.querySelector(".host-select");

  if (!lecteurPicker) return;

  const chapterPicker: HTMLSelectElement = document.querySelector(
    ".single-chapter-select"
  );

  context.seriesId = window.location.pathname.split("/")[2];
  context.chapterNumber =
    chapterPicker.options[chapterPicker.selectedIndex].innerHTML;
  context.reader = lecteurPicker.value;

  addCaptchaListener(db, context)();

  lecteurPicker.addEventListener("change", (e: InputEvent) => {
    context.reader = (e.target as HTMLInputElement).value;
    console.log("READER", context.reader);
    setTimeout(addCaptchaListener(db, context), 100);
  });

  addButton(db, context);
  isDataInDB(db, context);
}

export function initList(db: IDBDatabase, context: Context) {
  const chapterList: HTMLElement = document.querySelector(".version-chap");

  if (!chapterList) return;

  for (const a of chapterList.querySelectorAll("li a")) {
    a.innerHTML += " ✖";
  }

  context.seriesId = window.location.pathname.split("/")[2];

  getSeriesChapters(db, context, chapterList);
  addListDL(context);
}
