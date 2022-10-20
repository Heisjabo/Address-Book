var form = document.querySelector('form');
var trHead = document.querySelector('#head');
var allData = document.querySelector('#data');
var nameInput = document.querySelector('#name');
var addInput = document.querySelector('#add');
var telInput = document.querySelector('#tel');
var emailInput = document.querySelector('#email');
var button = document.querySelector('button');

//lets create a database

let db

window.onload = function(){
    let request = window.indexedDB.open('contacts', 1)

    request.onerror = function(){
        console.log('Database failed to open')
    }

    request.onsuccess = function(){
        console.log('Database opened successfully')
        db = request.result;
        displayData();
    }
    request.onupgradeneeded = function(e){
        let db = e.target.result;
        let objectStore = db.createObjectStore('contacts', { keyPath: 'id', autoIncrement:true });
    
        objectStore.createIndex('name', 'name', { unique: false });
        objectStore.createIndex('address', 'address', { unique: false });
        objectStore.createIndex('telephone', 'telephone', { unique: false });
        objectStore.createIndex('email', 'email', { unique: false });
      
    
        console.log('Database setup complete');
      };
      // form submitting

    form.onsubmit = function(e){
        e.preventDefault()
        let newItem = { name: nameInput.value, address: addInput.value, telephone: telInput.value, email: emailInput.value, };
        let transaction = db.transaction(['contacts'], 'readwrite');
        let objectStore = transaction.objectStore('contacts');
        var request = objectStore.add(newItem)

        request.onsuccess = function(){
            nameInput.value = '';
            addInput.value = '';
            telInput.value = '';
            emailInput.value = '';
            
        };

        transaction.oncomplete = function(){
            console.log('Transaction completed: database modification finished.');
            displayData();
        };

        transaction.onerror = function(){
            console.log('Transaction not opened due to error');
        };
    }

    //displaying data

    function displayData() {
        while (allData.firstChild) {
          allData.removeChild(allData.firstChild);
        }

        let objectStore = db.transaction('contacts').objectStore('contacts');

        objectStore.openCursor().onsuccess = (e) => {
          let cursor = e.target.result;

          if(cursor) {
            let tr = document.createElement('tr');
            let tdName = document.createElement('td'); 
            let tdAdd = document.createElement('td');
            let tdTel = document.createElement('td');
            let tdEmail = document.createElement('td');
            

            tr.appendChild(tdName);
            tr.appendChild(tdAdd);
            tr.appendChild(tdTel);
            tr.appendChild(tdEmail);
            allData.appendChild(tr);
    
            tdName.textContent = cursor.value.name
            tdAdd.textContent = cursor.value.address
            tdTel.textContent = cursor.value.telephone
            tdEmail.textContent = cursor.value.email

            
    
            tr.setAttribute('data-contact-id', cursor.value.id);
    
            let deleteBtn = document.createElement('button');
            tr.appendChild(deleteBtn);
            deleteBtn.textContent = 'Delete';
            deleteBtn.style = "background: darkred; color: aliceblue; cursor: pointer";
    
            deleteBtn.onclick = deleteItem;

            cursor.continue();
          } 
          else {
            if(!allData.firstChild) {
              let para = document.createElement('p');
              para.textContent = 'No saved contacts.'
              allData.appendChild(para);
            }
            console.log('Notes all displayed');
          }
        };
      }

      function deleteItem(e) {
        let contactId = Number(e.target.parentNode.getAttribute('data-contact-id'));
        let transaction = db.transaction(['contacts'], 'readwrite');
        let objectStore = transaction.objectStore('contacts');
        let request = objectStore.delete(contactId);
    
        transaction.oncomplete = () => {
          e.target.parentNode.parentNode.removeChild(e.target.parentNode);
          console.log('Contact ' + contactId + ' deleted.');

          if(!allData.firstChild) {
            let para = document.createElement('p');
            para.textContent = 'No saved contacts.';
            allData.appendChild(para);
          }
        };
      }
}