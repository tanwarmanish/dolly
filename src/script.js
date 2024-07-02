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
  // let rawConfig = getComputedStyle(target);
  // styleConfig = minifyStyle(rawConfig, styleConfig);

  for (let property of styleConfig) {
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
    clone(child, targetChildren[index], false),
  );
}

// main
// const source = $("#source");
// const target = $("#target");
// clone(source, target);
