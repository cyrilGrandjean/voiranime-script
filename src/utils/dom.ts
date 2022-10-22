import {el} from "redom";
import {ChapterUrls} from "../database";
import {createCSV} from "../utilsLast";

export function createDownloadButton(): void {
    const button = el('button')
    button.id = "csvExportButton";
    button.disabled = true;
    button.innerHTML = "LOADING...";
    button.classList.add("btn");

    button.style.backgroundColor = "black";
    button.style.color = "white";
    button.style.height = "36px";
    button.style.padding = "4px";
    const nextContainer = document.querySelector(".select-view");
    nextContainer.appendChild(button);
}

export function addButtonDownloadCsv(callDownload: () => void) {
    const link: HTMLLinkElement = document.querySelector('a[title="Change Order"]');
    link.style.marginLeft = "auto";
    const iconCsv = el('i', {class: 'ion-md-download', style: 'transform: unset'})
    const button = el('a', iconCsv, {class: 'btn-reverse-order', href: '#'})
    button.addEventListener("click", (e) => {
        e.preventDefault();
        callDownload();
    });
    link.parentNode.appendChild(button);
}


export function addIconOnListEpisode(chapterUrls: ChapterUrls[]) {
    const allLink = document.querySelectorAll('li.wp-manga-chapter a')

    for (let i of allLink) {
        const iconFail = el('i', {class: 'icon ion-md-close', style: 'display: inline-block; margin-left: 1rem'})
        i.appendChild(iconFail)
    }

    for (let i of chapterUrls) {
        const linkIcon = document.querySelector(
            `a[href='${i.episodeUrl}'] i`
        );
        if (linkIcon) {
            linkIcon.classList.replace('ion-md-close', 'ion-md-checkmark')
        }
    }
}