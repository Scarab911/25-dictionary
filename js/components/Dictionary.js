class Dictionary {
    constructor(selector) {
        this.DOM = null;
        this.selector = selector;

        this.listDOM = null;
        this.englishTextDOM = null;
        this.lithuanianTextDOM = null;
        this.buttonSaveDOM = null;

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
        this.addEvents();
        this.renderWords();
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
                            <div>${engText}</div>
                        </div>
                        <div class="lithuanian">
                            <div>${ltuText}</div>
                        </div>
                        <div class="btn">
                            <button class="fa fa-pencil" aria-hidden="true" type="button"></button>
                            <button class="fa fa-trash" aria-hidden="true" class="delete" type="button"></button>
                        </div>`

        this.listDOM.insertAdjacentHTML('afterbegin', HTML)
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
    addEvents() {

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
}
export { Dictionary };