const $log = document.querySelector('.history')
let db;
const req = window.indexedDB.open('punch',1);

const getAllPunch = () =>{
    const transaction = db.transaction('punch','readonly').objectStore('punch');
    const req = transaction.openCursor();
    req.addEventListener('success', (e)=>{
        const cursor = e.target.result;
        if(cursor){
            const punch = cursor.value;
            renderAllPunch(punch)
            cursor.continue();
        }
    }) 
}

const renderAllPunch = (punch) =>{
    const $li = document.createElement('LI');
    $li.classList.add('history__item')
    $li.textContent = punch;
    $log.insertAdjacentElement('beforeend',$li);
}

req.addEventListener('success',(e)=>{
    db = e.target.result;
    getAllPunch();
})

req.addEventListener('upgradeneeded',(e)=>{
    db = e.target.result;
    const punch = db.createObjectStore('punch',{autoIncrement:true});
})

req.addEventListener('error',()=>{
    throw new Error('No se pudo abrir la base de datos escrito por el desarrollador');
})
