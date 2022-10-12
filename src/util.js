String.prototype.toUserId = function () {
  return this.replace(/[<@!>]/g, '');
}

String.prototype.toRoleId = function () {
  return this.replace(/[<@&!>]/g, '');
}

String.prototype.toChannelId = function () {
  return this.replace(/[<@#!>]/g, '');
}

Array.prototype.isEmpty = function () {
	let array = [];
	this.forEach(e => {
		if (typeof e == "object") {
			if (Object.keys(e).length) {
				array.push(e);
			}
		} else {
      if (e.toLowerCase() != "empty" && e != '') array.push(e);
    }
	});
	if (!array.length) return true;
	else return false;
}

Map.prototype.getElementByIndex = function (index) {
  let size = this.size;
  if (index == undefined || isNaN(index) || index > size-1 || index < 0) return -1
  let array = Array.from(this.keys());
  return {
    key: array[index],
    value: this.get(array[index])
  }
}