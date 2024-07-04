let classes = {};
let classString = "";
console.log("SCRIPT LOADED"); 

function $(selector, root = document) {
  return root.querySelector(selector);
}

function minifyStyle(base, source) {
  const target = {};
  for (let key of source) {
    if (base[key] != source[key]) {
      target[key] = source[key];
    }
  }
  return target;
}

function applyStyle(source, target) {
  let styleConfig = getComputedStyle(source);

  // minifying
  let rawConfig = getComputedStyle(target);
  styleConfig = minifyStyle(rawConfig, styleConfig);

  for (let property in styleConfig) {
    target.style[property] = styleConfig[property];
  }
}

function clone(source, target, root = true) {
  // clone structure
  root && (target.innerHTML = source.innerHTML);

  // apply style
  applyStyle(source, target);

  // process children
  const sourceChildren = Array.from(source.children);
  const targetChildren = Array.from(target.children);

  sourceChildren.forEach((child, index) =>
    clone(child, targetChildren[index], false)
  );
}

// generate css
function includeStyleProp(prop) {
  // const filter = ['block-size','perspective-origin','transform-origin'];
  // if(filter.includes(prop)) return false;
  return true;
}

function generateStyleObject(element) {
  styleObject = {};
  for (let prop of element.style) {
    if (includeStyleProp(prop)) {
      styleObject[prop] = element.style[prop];
    }
  }
  return styleObject;
}

function uniqueClassName() {
  const prefix = "_";
  const uuid = Math.floor(Math.pow(10, 5) * Math.random());
  const timestamp = Date.now();
  return `${prefix}${uuid}${timestamp}`;
}

function extractElementStyle(element) {
  const styles = generateStyleObject(element);
  const className = uniqueClassName();
  element.style = null;
  element.classList = "";
  element.classList.add(className);
  classString += `.${className}{`;
  for (let prop in styles) {
    classString += `${prop}:${styles[prop]};`;
  }
  classString += "}";
  return {
    styles,
    className,
    children: [],
  };
}

function processStyle(source, classRef = classes) {
  classRef = Object.assign(classRef, extractElementStyle(source));
  let index = 0;
  for (let child of source.children) {
    classRef.children[index] = {};
    processStyle(child, classRef.children[index]);
    index++;
  }
}

function generateTemplate(source) {
  const htmlString = source.innerHTML;
  return `<style>${classString}</style>${htmlString}`;
}

// main
function run() {
  const source = $("#source");
  const target = document.createElement("div");
  console.log("Cloning Template");
  clone(source, target);
  processStyle(target);
  console.log({ template: generateTemplate(target) });
}
