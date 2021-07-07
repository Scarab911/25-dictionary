class Dictionary {
    constructor(selector) {
        this.DOM = null;
        this.selector = selector;

        this.listDOM = null;
        this.englishTextDOM = null;
        this.lithuanianTextDOM = null;
        this.buttonSaveDOM = null;

        this.entryDOM = null;
        this.editButtonDOM = null;
        this.deleteButtonDOM = null;

        this.EngTextDOM = null;
        this.ltutextDOM = null;

        this.addFormDOM = null;
        this.updateFormDOM = null;
        this.updateButton = null;
        this.cancelButton = null;
        this.updateEngTextDOM = null;
        this.updateLtuTextDOM = null;

        this.localStorageSavedWords = 'words';
        this.localStorageIDcount = 'translationID';

        this.latestUsedID = JSON.parse(localStorage.getItem(this.localStorageIDcount)) || 0;
        this.savedWords = JSON.parse(localStorage.getItem(this.localStorageSavedWords)) || [];

        this.currentlyEditableEntryID = 0;

        this.init();
    }
    init() {
        if (!this.isValidSelector()) {
            return false
        }
        this.DOM = document.querySelector(this.selector);
        if (!this.DOM) {
            console.error('ERROR: Element not found!');
            return false
        }
        this.render();
        this.renderWords();
        this.addEvents();
    };
    isValidSelector() {
        if (typeof this.selector !== 'string' ||
            this.selector === '') {
            console.error("ERROR: not valid selector");
            return false
        }
        return true;
    };
    generateAddForm() {
        return `<h1>My dictionary</h1>
                <form id="add_form">
                    <div>
                        <label for="english">English</label>
                        <input id="add_english" type="text">
                    </div>
                    <div>
                        <label for="lithuanian">Lithuanian</label>
                        <input id="add_lithuanian" type="text">
                    </div>
                    <div class="buttons">
                        <button id="save" type="submit">Save</button>
                        <button id="reset" type="reset">Reset</button>
                    </div>
                </form>`

    };
    generateEditForm() {
        return ` <form id="update_form" class="paslepta">
                    <div>
                        <label for="english">English</label>
                        <input id="update_english" type="text">
                    </div>
                    <div>
                        <label for="lithuanian">Lithuanian</label>
                        <input id="update_lithuanian" type="text">
                    </div>
                    <div class="buttons">
                        <button id="update" type="submit">Update</button>
                        <button id="cancel" type="button">Cancel</button>
                    </div>
                </form>
                <h2>Saved words:</h2>`
    }
    generateList() {
        return `<list class="words"></list>`;
    }
    renderWords() {
        for (const word of this.savedWords) {
            this.renderDictionary(word.id, word.english, word.lithuanian)
        };
    }
    renderDictionary(id, engText, ltuText) {
        const HTML = `<div id="translation_${id}" class="entry">
                        <div class="english">
                            <div class="engText">${engText}</div>
                        </div>
                        <div class="fa fa-arrows-h" aria-hidden="true"></div>
                        <div class="lithuanian">
                            <div class="ltuText">${ltuText}</div>
                        </div>
                        <div class="btn">
                            <button href="html" id="edit" class="fa fa-pencil" aria-hidden="true" type="button"></button>
                            <button id="delete" class="fa fa-trash" aria-hidden="true"  type="submit"></button>
                        </div>
                      </div >`

        this.listDOM.insertAdjacentHTML('afterbegin', HTML)

        const entryDOM = this.listDOM.querySelector('.entry')
        const editButtonDOM = entryDOM.querySelector('.fa.fa-pencil');
        const deleteButtonDOM = entryDOM.querySelector('.fa.fa-trash');


        deleteButtonDOM.addEventListener('click', (e) => {
            e.preventDefault();
            if (!confirm('Ar tikrai norite istrinti si irasa?')) { //eilute skirta papildomam paklausimui!
                return false;
            }

            entryDOM.remove();

            this.savedWords = this.savedWords.filter((translation) => translation.id !== id);
            localStorage.setItem(this.localStorageSavedWords, JSON.stringify(this.savedWords));
        });

        editButtonDOM.addEventListener('click', () => {

            this.addHideEditUnhide()
            this.updateEngTextDOM.value = engText;
            this.updateLtuTextDOM.value = ltuText;
            this.currentlyEditableEntryID = id;

        });
    };
    render() {
        let HTML = ''
        HTML += this.generateAddForm();
        HTML += this.generateEditForm();
        HTML += this.generateList();
        this.DOM.innerHTML = HTML;

        this.listDOM = document.querySelector('list');
        this.englishTextDOM = document.getElementById('add_english')
        this.lithuanianTextDOM = document.getElementById('add_lithuanian')
        this.buttonSaveDOM = document.getElementById('save');
        this.addFormDOM = document.getElementById('add_form');
        this.updateFormDOM = document.getElementById('update_form');
        this.updateButton = this.updateFormDOM.querySelector('#update')
        this.cancelButton = this.updateFormDOM.querySelector('#cancel')
        this.updateEngTextDOM = document.getElementById('update_english');
        this.updateLtuTextDOM = document.getElementById('update_lithuanian')

        this.cancelButton.addEventListener('click', () => {
            this.addUnhideEditHide();
        })

    }
    addEvents() {

        this.buttonSaveDOM.addEventListener('click', (e) => {
            e.preventDefault();
            const engText = this.englishTextDOM.value;
            const ltuText = this.lithuanianTextDOM.value;

            if (engText === '' || ltuText === '') {
                return false;
            }
            this.savedWords.push({
                id: ++this.latestUsedID,
                english: engText,
                lithuanian: ltuText
            })

            localStorage.setItem(this.localStorageSavedWords, JSON.stringify(this.savedWords));
            localStorage.setItem(this.localStorageIDcount, JSON.stringify(this.latestUsedID));

            this.renderDictionary(this.latestUsedID, engText, ltuText)
        });
        this.updateButton.addEventListener('click', (e) => {

            e.preventDefault();

            this.addUnhideEditHide();

            const engWord = this.updateEngTextDOM.value;
            const ltuWord = this.updateLtuTextDOM.value;

            for (const entry of this.savedWords) {
                if (entry.id === this.savedWords.id) {
                    console.log(entry.id);
                    engText = engWord;
                    ltuText = ltuWord;
                }
            }
            localStorage.setItem(this.localStorageSavedWords, JSON.stringify(this.savedWords));

            const translationDOM = document.querySelector('#translation_' + this.currentlyEditableEntryID)
            const engEntryDOM = translationDOM.querySelector('.engText')
            const ltuEntryDOM = translationDOM.querySelector('.ltuText')

            engEntryDOM.innerText = engWord;
            ltuEntryDOM.innerText = ltuWord;
            console.log(engEntryDOM, ltuEntryDOM);
        });

    };
    addHideEditUnhide() {
        this.addFormDOM.classList.add('paslepta');
        this.updateFormDOM.classList.remove('paslepta');
    };
    addUnhideEditHide() {
        this.addFormDOM.classList.remove('paslepta');
        this.updateFormDOM.classList.add('paslepta');
    }
}
export { Dictionary };
