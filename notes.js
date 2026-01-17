// ===================================== PROJECT SCRIPT ====================================================

// ======================================== M V C =============================================

// ============= Data ======================================
const Model = {
    colorKeys: {
        YELLOW: "note-yellow",
        BLUE: "note-blue",
        GREEN: "note-green",
        RED: "note-red",
        PURPLE: "note-purple"
    },
    NotesData: [],
    showFavorite: false, // состояние нашего фильтра
    getVisibleNotes(){
        if(this.showFavorite){
            return this.NotesData.filter(note => note.favorite);
        }
        return this.NotesData;
    },
    DeleteNote(noteId){
        this.NotesData = this.NotesData.filter((note) => note.id !== noteId)
        // render ui
        viewNotes.RenderNotes(this.getVisibleNotes())
        // LS
        this.save()
    },
    ToggleNote(noteId){
        this.NotesData = this.NotesData.map((note) => {
            if (note.id === noteId){
                note.favorite = !note.favorite
            }
            return note
        })
        // render ui
        viewNotes.RenderNotes(this.getVisibleNotes())
        // LS
        this.save()
    },
    AddNote(title, description, colorNote){
        const favorite = false; //по умолчанию наши задачи не добавляются в избранные
        const id = new Date().getTime();
        const newNote = {id, title, description, colorNote, favorite}
        this.NotesData = [ newNote,...this.NotesData];
        // render ui
        viewNotes.RenderNotes(this.getVisibleNotes())
        // LS
        this.save()
    },
    favoriteNotes(checked){ // ?
        this.showFavorite = checked;
        //ui
        viewNotes.RenderNotes(this.getVisibleNotes())
        // if (checked){
        //     let NewNotes;
        //     NewNotes = this.NotesData.filter((note) => note.favorite === true)
        //     viewNotes.RenderNotes(NewNotes);
        // }
        // if (!checked){
        //     viewNotes.RenderNotes(this.NotesData)
        // }
        // let NewNotes;
        // checked ? NewNotes = this.NotesData.filter((note) => note.favorite === true): this.NotesData;
        // // render ui
        // viewNotes.RenderNotes(NewNotes)
    }, 
    load(){ // загрузка данных при старте
        const data = localStorage.getItem("notes");
        this.NotesData = data ? JSON.parse(data): [];
    },
    save(){ // сейв при изменениях
        localStorage.setItem("notes",JSON.stringify(this.NotesData));
    },
}






// ====================================== Ui ========================================================
const viewNotes = {
    likeBlack: `<img src="images/heart active.svg" alt="act">`,
    likeEmpty: `<img src="images/heart inactive.svg" alt="act">`,
    trash: `<img src="images/trash.svg" alt="garbageImg">`,
    RenderNotes(DataNotes){
        const currentNotes = document.querySelector("small"); // количество заметок
        currentNotes.innerHTML = ""; // очищаем перед рендером количество заметок
        const NotesBox = document.querySelector(".notes-list") // контейнер из дом дерева куда буду аппендить заметки
        NotesBox.innerHTML = '';
    // --
    if(DataNotes.length === 0){
        const defaultMess = document.createElement('div');
        defaultMess.classList.add("NoData");
        defaultMess.textContent = "У вас нет еще ни одной заметки. Заполните поля выше и создайте свою первую заметку!";
        NotesBox.append(defaultMess);
    }
    // --
        for (let i = 0; i < DataNotes.length; i++){
            const noteData = DataNotes[i]; // данные одной задачи
            const note = document.createElement("div") // создаем дом задачу
            note.classList.add('note', noteData.colorNote);
            note.dataset.id = noteData.id; // привязываем айди данных и к задачам дом дерева
            note.innerHTML = `
                    <div class="note-header">
                    <h3 class="note-title">${noteData.title}</h3>
                    <div class="note-get">
                    <button class="note-like">${noteData.favorite ? this.likeBlack: this.likeEmpty}</button>
                    <button class="note-delete">${this.trash}</button>
                    </div>
                    </div>
                    <p class="note-text">${noteData.description}</p>
                    `;
                    NotesBox.append(note); 
                    currentNotes.innerHTML = DataNotes.length // количество заметок равно длине массива наших данных
        }
    },
    initNotes(){
        this.RenderNotes(Model.NotesData);
        this.logicEvents();
    },
    logicEvents(){ // здесь все обработчики
        const form = document.querySelector("form")
        const input = document.querySelector("input");
        const textarea = document.querySelector("textarea");
        const containerNote = document.querySelector(".notes-list");
        const FilterCheckBox = document.getElementById("favorites");
        const colorButtons = document.querySelectorAll(".color"); // все цвета внутри формы
        // переменная с хранением значения цвета
        let colorNote = "note-yellow"; // по умолчанию желтый
        // Обработчик клика по кнопкам цветов (не придумал как проще брать значение выбранной кнопке) 
        // вешаем обработчик на каждый цвет пробегаясь форичем
    colorButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            colorButtons.forEach(b => b.classList.remove("active")); // убрать активный класс если он висит
            btn.classList.add("active"); // добаавляю класс. учитывая что обработчик висит на каждой кнопке сработает на нажатой
            // просто приравнием класс кнопки с классом значения которое будем передавать контроллеру
            if(btn.classList.contains("yellow")) {colorNote = "note-yellow"}
            if(btn.classList.contains("green"))  {colorNote = "note-green"}
            if(btn.classList.contains("blue"))   { colorNote = "note-blue"}
            if(btn.classList.contains("red"))    {colorNote = "note-red"}
            if(btn.classList.contains("pink"))  {colorNote = "note-purple"}
        });
        });
        // обработчмк на форму
        form.addEventListener("submit", (event) => {
            event.preventDefault() // блочим стандартное поведение формы
            const title = document.querySelector("input").value // берем значение с инпута текста
            const description = document.querySelector("textarea").value // берем описание с нашей текстэрии
            //  также здесь нужно как то взять выбранный цвет из формы (сделать позже)
            // const colorNote = "note-purple"
            // передаем контроллеру 
            const isAdded = controllerNotes.AddNote(title, description, colorNote);
            if(isAdded){
                input.value = '', textarea.value = ''; // очищаем поля после события
            }
            
        });
        //  обработчик контейнера с задачами 
        containerNote.addEventListener("click", (event) => {
            if (event.target.closest(".note-like")){
                const noteId = Number(event.target.closest(".note").dataset.id);
                controllerNotes.ToggleNote(noteId)
            }
            if (event.target.closest(".note-delete")){
                const noteId = Number(event.target.closest(".note").dataset.id);
                controllerNotes.DeleteNote(noteId)
            }
        });
        // обработчик на фильтрацию по избранному (отлавливаем чекбокс)  change возвращает тру фолс согласно гуглу
        FilterCheckBox.addEventListener("change", (event) => {
            const StatusCheck = event.target.checked; // чекд работает также как велью из инпутов формы и тд. возвращает тру фолс
            controllerNotes.favoriteNotes(StatusCheck);
        })
    },SecretMessage(text, type = "info"){ // метод добавления сообщения уведомления
        const messageBox = document.querySelector(".message") // наше сообщение из дома
        messageBox.textContent = text;
        messageBox.style.backgroundColor = type === "error"? "#db4646ff": "#70d870ff"; // в зависимости от типа смс меняю бэкграунд
        messageBox.style.opacity = "1"; // делаю полностью видимым
        setTimeout(() => {
            messageBox.textContent = "";
            messageBox.style.opacity = "0";
        }, 3000);  //очищаю текст сообщения и делаю фулл невидимым через 3 сек
    },
}





//  ========================================= CONTROLLER ============================================
const controllerNotes = {
    AddNote(title,description,colorNote){
        if(title.trim() === '' || description.trim() === ''){
            viewNotes.SecretMessage("Заполните все поля!", "error"); // если инпуты пусты обращаемся к методу вью с секретным смс
            return false; 
        }
        if (title.length > 50){
            viewNotes.SecretMessage("Максимальная длина заголовка 50 символов!", "error");
            return false;
        }
        Model.AddNote(title, description, colorNote);
        viewNotes.SecretMessage("Заметка добавлена!", "info");
        return true
    },
    ToggleNote(noteId){
        Model.ToggleNote(noteId)
    },
    DeleteNote(noteId){
        Model.DeleteNote(noteId);
        viewNotes.SecretMessage("Заметка удалена!", "info");
    },
    favoriteNotes(checked){
        Model.favoriteNotes(checked)
    }
}


// ======================== инициализация проекта
function init(){
    Model.load();
    viewNotes.initNotes()
}
init()














