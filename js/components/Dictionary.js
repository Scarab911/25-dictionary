class Dictionary {
    constructor(selector) {
        this.DOM = null;
        this.selector = selector;

        this.listDOM = null;
        this.englishTextDOM = null;
        this.lithuanianTextDOM = null;
        this.buttonSaveDOM = null;

        this.allEditButtonsDOM = null;
        this.allDeleteButtonsDOM = null;

        this.allEngTextsDOM = null;
        this.allLtutextsDOM = null;

        this.savedWords = JSON.parse(localStorage.getItem('words')) || [];

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
        this.addFormEvents();
        this.renderWords();
        this.addDictionaryEvents();
    };
    isValidSelector() {
        if (typeof this.selector !== 'string' ||
            this.selector === '') {
            console.error("ERROR: not valid selector");
            return false
        }
        return true;
    };
    generateMainContent() {
        return `<h1>My dictionary</h1>
                <form>
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
                </form>
                <h2>Saved words:</h2>`
    };
    generateList() {
        return `<list class="words"></list>`
    }
    renderWords() {
        for (const word of this.savedWords) {
            this.renderDictionary(word.English, word.Lithuanian)
        };
    }
    renderDictionary(engText, ltuText) {
        const HTML = `<div class="english">
                            <div class="engText">${engText}</div>
                        </div>
                        <div class="lithuanian">
                            <div class="ltuText">${ltuText}</div>
                        </div>
                        <div class="btn">
                            <button href="html" id="edit" class="fa fa-pencil" aria-hidden="true" type="button"></button>
                            <button id="delete" class="fa fa-trash" aria-hidden="true"  type="button"></button>
                        </div>`

        this.listDOM.insertAdjacentHTML('afterbegin', HTML)

        this.allEditButtonsDOM = document.querySelectorAll('.fa.fa-pencil');
        this.allDeleteButtonsDOM = document.querySelectorAll('.fa.fa-trash');
        this.allEngTextsDOM = document.querySelectorAll('.engText');
        this.allLtuTextsDOM = document.querySelectorAll('.ltuText')
        console.log(this.allLtuTextsDOM);
    };
    render() {
        let HTML = ''
        HTML += this.generateMainContent();
        HTML += this.generateList();
        this.DOM.innerHTML = HTML;

        this.listDOM = document.querySelector('list');
        this.englishTextDOM = document.getElementById('add_english')
        this.lithuanianTextDOM = document.getElementById('add_lithuanian')
        this.buttonSaveDOM = document.getElementById('save');

    }
    addFormEvents() {

        this.buttonSaveDOM.addEventListener('click', (e) => {
            e.preventDefault();
            const engText = this.englishTextDOM.value;
            const ltuText = this.lithuanianTextDOM.value;

            if (engText === '' || ltuText === '') {
                return false;
            }
            this.savedWords.push({
                English: engText,
                Lithuanian: ltuText
            })

            localStorage.setItem('words', JSON.stringify(this.savedWords));

            this.renderDictionary(engText, ltuText)
        });

    };
    addDictionaryEvents() {
        //     // this.deleteButtonDOM.addEventListener('click', (e) => {
        //     //     e.preventDefault();


        // });
        // for (const edit of this.allEditButtonsDOM) {
        //     edit.addEventListener('click', (e) => {
        //         e.preventDefault();

        //         for (const word of this.allEngTextsDOM) {
        //             this.englishTextDOM.value = word.innerText;
        //             break;
        //         };
        //         for (const word of this.allLtuTextsDOM) {
        //             this.lithuanianTextDOM.value = word.innerText;
        //             break;
        //         };
        //         console.log('button works');
        //     })
        // }
        for (let i = 0; i < this.allEditButtonsDOM.length; i++) {
            const editBtn = this.allEditButtonsDOM[i];
            editBtn.addEventListener('click', (e) => {


                for (let j = 0; j < this.allEngTextsDOM.length; j++) {
                    const engWord = this.allEngTextsDOM[j];
                    if (i === j) {
                        this.englishTextDOM.value = engWord.innerText;
                        break;
                    }
                }
                for (let j = 0; j < this.allLtuTextsDOM.length; j++) {
                    const ltuWord = this.allLtuTextsDOM[j];
                    if (i === j) {
                        this.lithuanianTextDOM.value = ltuWord.innerText;
                        break;
                    }
                }
            });

        }

    }

}
export { Dictionary };