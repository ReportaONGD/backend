exports.bindingObject = function (sourceObj, targetObj) {
  Object.keys(sourceObj).forEach((k) => {
    if (k !== '_id') {
      targetObj[k] = sourceObj[k];
    }
  })
}

exports.bindingObject2 = function (sourceObj, targetObj) {
  Object.keys(sourceObj.toObject()).forEach((k) => {
    if (k !== '_id' ) {
      targetObj[k] = sourceObj[k];
    }
  })
}