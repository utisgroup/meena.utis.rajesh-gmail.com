import productdb, { bulkcreate, getData, createEle } from "./module.js";

let db = productdb("Productdb", { products: `++id, name, email, phone` });

// Input tags
const userid = document.getElementById("userid");
const name = document.getElementById("name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");

// Buttons
const btncreate = document.getElementById("btn-create");
const btnread = document.getElementById("btn-read");
const btnupdate = document.getElementById("btn-update");
const btndelete = document.getElementById("btn-delete");

// Insert value using create button
btncreate.onclick = event => {
  let check = onValidate()
  if(check === false) {
      alert('** invalid form can not be submitted');
      return;
  }
  let arr = [];
  getData(db.products, data => {
    // userid.value = data.id + 1 || 1;
    console.log('data in create function = ', data);
    arr.push(data);
    let name = name.value;
    let email = email.value;
    let phone = phone.value;
  })
  
  var checkName = '';
  var checkEmail = '';
  var checkPhone = '';

  let flag = bulkcreate(db.products, {
    name: name.value,
    email: email.value,
    phone: phone.value
  },
  checkName = name.value,
  checkEmail = email.value,
  checkPhone = phone.value
  );

  console.log('checkName = ', checkName);
  console.log('checkEmail = ', checkEmail);
  console.log('checkPhone = ', checkPhone);
     
  name.value = email.value = phone.value = "";

  getData(db.products, data => {
    userid.value = data.id + 1 || 1;
    console.log('data in create function = ', data);
  });
  table();
  
};

db.products.each(prod => {
    if((prod.name === checkName) && (prod.email === checkEmail) && (prod.phone === checkPhone)) {
        console.log('condition match === ', prod.name);
    }  else {
        console.log('else log called');
        
    }
})

// Create event on read button
btnread.onclick = table;

// Load Event
window.addEventListener("load", event => {
  table();
//   getData(db.products, data => {
//     console.log("load table dat = ", data);
//   });
});

// update event on update button
btnupdate.onclick = () => {
  const id = parseInt(userid.value || 0);

  if (id) {
    console.log("id in update method = ", id);
    db.products
      .update(id, {
        name: name.value,
        email: email.value,
        phone: phone.value
      })
      .then(updated => {
        let get = updated
          ? `data updated successfully`
          : `data updation failed`; 
      });
  }
  name.value = email.value = phone.value = "";
  alert('Data updated successfully!!')
  table();
};

// Delete All
btndelete.onclick = () => {
  db.delete();
  db = productdb("Productdb", {
    products: `++id, name, email, phone`
  });
  db.open();
  table();
};

function table() {
  const tbody = document.getElementById("tbody");

  while (tbody.hasChildNodes()) {
    tbody.removeChild(tbody.firstChild);
  }

  getData(db.products, data => {
    const nameList = [];
    let Name = data.name;
    nameList.push(Name);
    nameList.forEach(name => {
      console.log("name list =", name);
      // alert(name)
    });

    if (data) {
      createEle("tr", tbody, tr => {
        for (const value in data) {
          createEle("td", tr, td => {
            td.textContent =
              data.phone === data[value] ? ` ${data[value]}` : data[value];
          });
        }

        createEle("td", tr, td => {
          createEle("i", td, i => {
            i.className += "fa fa-edit btnedit";
            i.setAttribute(`data-id`, data.id);
            i.onclick = editbtn;
          });
        });

        createEle("td", tr, td => {
          createEle("i", td, i => {
            i.className += "fa fa-trash btndelete";
            i.setAttribute(`data-id`, data.id);
            i.onclick = deletebtn;
          });
        });
      });
    }
  });
}

function onValidate() {
  // Name Validation -
  let nameValue = document.getElementById("name").value;
  if (nameValue == "") {
    document.getElementById("nameMessage").innerHTML = "** Name is required";
    return false;
  }

  // Email Validation Start -
  let emailValue = document.myForm.email.value;
  if (emailValue.indexOf("@") <= 0) {
    document.getElementById("emailMessage").innerHTML = "** invalid @ position";
    return false;
  }

  if (
    emailValue.charAt(emailValue.length - 4) != "." &&
    emailValue.charAt(emailValue.length - 3) != "."
  ) {
    document.getElementById("emailMessage").innerHTML = "** invalid . position";
    return false;
  }
  // Email Validation End -

  // Phone Validation -
  let phoneValue = document.getElementById("phone").value;
  if (phoneValue == "") {
    document.getElementById("phoneMessage").innerHTML =
      "** Phone no is required";
    return false;
  }
  if (isNaN(phoneValue)) {
    document.getElementById("phoneMessage").innerHTML =
      "** Only numbers are allowed";
    return false;
  }
  if (phoneValue.length < 10) {
    document.getElementById("phoneMessage").innerHTML =
      "** Numbers must be 10 digit";
    return false;
  }
  if (phoneValue.length > 10) {
    document.getElementById("phoneMessage").innerHTML =
      "** Numbers must be 10 digit";
    return false;
  }
  if (
    phoneValue.charAt(0) != 9 &&
    phoneValue.charAt(0) != 8 &&
    phoneValue.charAt(0) != 7
  ) {
    document.getElementById("phoneMessage").innerHTML =
      "** Numbers must be start with 9, 8, 7";
    return false;
  }
}

// Edit function
function editbtn(event) {
  let id = parseInt(event.target.dataset.id);
  db.products.get(id, data => {
    userid.value = data.id || 0;
    name.value = data.name || "";
    email.value = data.email || "";
    phone.value = data.phone || "";
  });
}

// Delete function
function deletebtn() {
  let id = parseInt(event.target.dataset.id);
  console.log('event.target.dataset.id =', event.target.dataset.id);
  db.products.delete(id);
  alert('Current record deleted successfully!!');
  table();
}
