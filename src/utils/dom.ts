import {el} from "redom";
import {ChapterUrls} from "../database";
import {createCSV} from "../utilsLast";

export function createDownloadButton(): void {
    const parent = document.querySelector('div.wp-manga-nav');
    const button = el(
        'button',
        'Resolve this captcha first',
        {
            style: 'margin-bottom:0;',
            id: 'titleDownload',
            class: 'btn',
        });
    const div = el('div', button, {
        class: "select-view",
        style: "display: flex;align-items:center;height: 36px;background-color:#ebebeb;border-radius:5px; margin-left: 1rem; padding: 0.5rem;"
    });
    parent.appendChild(div);
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