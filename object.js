const newBookButton = document.querySelector('#newBookButton');
const addBookButton = document.querySelector('#addBookButton');
const rmvBook = document.querySelector('#removeBtn');

var localStorageAvailable = false;

let myLibrary = [new Book('Harry Potter','496','J. K. Rowling', 'Yes'),
                 new Book('Calculus','525','Chapman', 'Not yet')];

function Book(title, pages, author, read) {
    this.title = title
    this.pages = pages
    this.author = author
    this.read = read
    this.imgSrc = 'images/remove-icon-png-7113.png'
    this.info = function(){
        if(this.read=="yes"){
            return(this.title + ' by ' + this.author + '. ' + this.pages + ' pages, has been read.')
        }else{
            return(this.title + ' by ' + this.author + '. ' + this.pages + ' pages, not read yet.')
        }
    }
}

function addBookToLibrary(title,pages,author,read) {
    var newBook = new Book(title,pages,author,read);
    myLibrary.push(newBook);
    writeLocalStrg(myLibrary.length);
}

function displayLibrary() {
    while(tableBody.hasChildNodes()){
        tableBody.removeChild(tableBody.firstChild);
    }
    for(let i = myLibrary.length-1; i>-1; i--){
        const bookData = document.createElement('tr');
        bookData.id = i;
        bookData.classList.add('tableRow');
        tableBody.appendChild(bookData);
        const dataTitle = document.createElement('td');
        dataTitle.id = 'data';
        dataTitle.textContent = myLibrary[i].title;
        bookData.appendChild(dataTitle);
        const dataAuthor = document.createElement('td');
        dataAuthor.id = 'data';
        dataAuthor.textContent = myLibrary[i].author;
        bookData.appendChild(dataAuthor);
        const dataPages = document.createElement('td');
        dataPages.id = 'data';
        dataPages.textContent = myLibrary[i].pages;
        bookData.appendChild(dataPages);
        const dataRead = document.createElement('td');
        dataRead.id = 'read'+i;
        bookData.appendChild(dataRead);
        addReadToggle(i);
        const rmv = document.createElement('td');
        rmv.id = 'remove'+i;
        rmv.classList.add('rmvBtnImg');
        bookData.appendChild(rmv)
        addRmvBtn(i);
    }
}

function addRmvBtn(i){
    var btnCont = document.createElement('btn');
    btnCont.classList.add('buttonRmv');
    var rmv = document.getElementById('remove'+i);
    rmv.appendChild(btnCont);
    const rmvBtn = document.createElement('img');
    rmvBtn.id = 'removeBtn';
    rmvBtn.classList.add('rmvBtnImg');
    rmvBtn.src = myLibrary[i].imgSrc;
    btnCont.appendChild(rmvBtn);
    btnCont.addEventListener('click',function(e){
        myLibrary.splice(document.getElementById('remove'+i).parentElement.id,1);
        writeLocalStrg(myLibrary.length);
        displayLibrary();
    });            
}

function addReadToggle(i){
    var togLabel = document.createElement('label');
    togLabel.classList.add('toggle-switchy');
    togLabel.setAttribute("data-style", "rounded");
    togLabel.htmlFor = 'toggle'+i;
    togLabel.id = 'togContent';
    var dataRead = document.getElementById('read'+i);
    dataRead.appendChild(togLabel);
    var togInput = document.createElement('input');
    togInput.id = 'toggle' + i;
    togInput.type = 'checkbox';
    togLabel.appendChild(togInput);
    var togSpan = document.createElement('span');
    togSpan.classList.add('toggle');
    togLabel.appendChild(togSpan);
    var togSpan1 = document.createElement('span');
    togSpan1.classList.add('switch');
    togSpan.appendChild(togSpan1);
    if(myLibrary[i].read=='Yes'){togInput.checked=true;}
    else if(myLibrary[i].read=='Not yet'){togInput.checked=false;}
    togLabel.addEventListener('click', function(e){
        if(togInput.checked){
            myLibrary[i].read='Yes';
            localStorage.setItem('data'+i+'.read','Yes');
        }
        else{
            myLibrary[i].read='Not yet';
            localStorage.setItem('data'+i+'.read','Not yet');
        }
    });
}

function showForm(){
    document.getElementById("formContainer").style.display = "inline";
    document.getElementById("description").style.display = "none";
}

newBookButton.addEventListener('click', function(e){
    showForm();
});

function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

function writeLocalStrg(size){
    localStorage.clear();
    localStorage.setItem('myLibrarySize',size);
    for(let i = 0; i<size; i++){
        localStorage.setItem('data'+i+'.title',myLibrary[i].title);
        localStorage.setItem('data'+i+'.pages',myLibrary[i].pages);
        localStorage.setItem('data'+i+'.author',myLibrary[i].author);
        localStorage.setItem('data'+i+'.read',myLibrary[i].read);
    }
}

function readLocalStrg(){
    myLibrary = [];
    for(let i = 0;i<localStorage.getItem('myLibrarySize');i++){
        var newBook = new Book(localStorage.getItem('data'+i+'.title'),
                                localStorage.getItem('data'+i+'.pages'),
                                localStorage.getItem('data'+i+'.author'),
                                localStorage.getItem('data'+i+'.read'));
        console.log(localStorage.getItem('data'+i+'.title'));
        myLibrary.push(newBook);
    }
}

function initialization(){
    if (storageAvailable('localStorage')) {
    // Yippee! We can use localStorage awesomeness
        localStorageAvailable = true;
        if(!localStorage.getItem('myLibrarySize')){
            //writeLocalStrg(myLibrary.length);
        }
        else{
            readLocalStrg();
        }
    }
    else {
    // Too bad, no localStorage for us
        localStorageAvailable = false;
    }        
}

addBookButton.addEventListener('click', function(e){
    var bTitle = document.getElementById("bookTitleInput").value;
    var bAuthor = document.getElementById("bookAuthorInput").value;
    var bPages = document.getElementById("bookPagesInput").value;
    var bRead = document.getElementById("bookReadInput").value;
    if(bTitle != ""){
        addBookToLibrary(bTitle,bPages,bAuthor,bRead);
        displayLibrary();
        document.getElementById("formContainer").style.display = "none";
    }
    document.getElementById("description").style.display = "inline";
});      

initialization();
displayLibrary();
document.getElementById("formContainer").style.display = "none";