const productdb = (dbname, table) => {
    
    //  Create Database
    const db = new Dexie(dbname)
    db.version(1).stores(table)
    db.open();

/*
const db = new Dexie("myDb");

db.version(1).stores({
    friends: `name, age`
})
*/
return db;

}


// insert function
const bulkcreate = (dbtable, data) => {
    let flag = empty(data);
    if(flag) {
        dbtable.bulkAdd([data]);
        alert('Data inserted successfully')
        console.log('dbtable = ', dbtable);
        console.log('data in create bulk = ', data);
        
    } else {
        alert('Please provide data')
        console.log("Please provide data");
    }
    return flag;
}

// check textbox validation
const empty = object => {
    let flag = false;

    for (const value in object) {
        if(object[value] !="" && object.hasOwnProperty(value)) {
            flag = true;
        } else {
            flag = false;
        }
    }
    return flag;

}

// Get data from the database
const getData = (dbtable, fn) => {
    let index = 0;
    let obj = {};

    dbtable.count((count) => {
        if(count) {
            dbtable.each(table => {
                obj = Sortobj(table); 
                fn(obj, index++);
            })
        } else {
            fn(0);
        }
    })
};

// sort object
const Sortobj = sortobj => {
    let obj = {};
    obj = {
        id: sortobj.id,
        name: sortobj.name,
        email: sortobj.email,
        phone: sortobj.phone
    }
    return obj;
}


// Create Dynamic Element
const createEle = (tagname, appendTo, fn) => {
    const element = document.createElement(tagname);
    if(appendTo) appendTo.appendChild(element);
    if(fn) fn(element);
}

export default productdb;

export {
    bulkcreate,
    getData,
    createEle
}