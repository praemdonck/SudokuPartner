function create(id, parent, width, height) {


  // $("body").append("<p>This is a paragraph added in create canvas function</p>");
  $(parent).append("<p>This is a paragraph added in create canvas function</p>");

  let divWrapper = document.createElement('div');
  let canvasElem = document.createElement('canvas');

  $(divWrapper).append(canvasElem);
  $(parent).append(divWrapper);

  // parent.appendChild(divWrapper);
  // divWrapper.appendChild(canvasElem);

  divWrapper.id = id;
  canvasElem.width = width;
  canvasElem.height = height;

  let ctx = canvasElem.getContext('2d');

  return {
    ctx: ctx,
    id: id
  };
}

function createReportList(wrapperId) {
  let list = document.createElement('ul');
  list.id = wrapperId + '-reporter';

  let canvasWrapper = document.getElementById(wrapperId);
  canvasWrapper.appendChild(list);

  return list.id;
}

const myObject = () => {
  
  let myPrivateVar = 0;

  let mySetter = (text) => {
    console.log('Setting myPrivateVar to: ' + text);
    myPrivateVar = text;
  };

  let myGetter = () => {
    console.log('Getting myPrivateVar: ' + myPrivateVar);
    return myPrivateVar;
  };

  return {mySetter, myGetter};
};

class MyClass {

  #myPrivateVar;

  constructor(myString) {
    this.#myPrivateVar = myString;
  }
  
  get myGetter() {
    console.log('Getting myPrivateVar: ' + this.#myPrivateVar);
    return this.#myPrivateVar;
  }

  /**
   * @param {string} text
   */
  set mySetter(text) {
    console.log('Setting myPrivateVar to: ' + text);
    this.#myPrivateVar = text;
  }
};


// export const myObject2 = myObject();

export { create, createReportList, myObject, MyClass };
