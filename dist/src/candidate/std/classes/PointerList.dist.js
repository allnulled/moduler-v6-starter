module.exports = $moduler.import([], function () {
  return class PointerList {
    constructor(pairs = []) {
      this.items = pairs;
    }
    static LocutionOfWith = class LocutionOfWith {
      constructor(args) {
        Object.assign(this, args);
      }
      with(key2) {
        return this[this.operation](this.key, key2);
      }
    };
    assert(condition, message) {
      if (!condition) throw new Error(message);
    }
    findPosition(key, defaultValue = -1) {
      const pos = this.items.findIndex((item) => item[0] === key);
      return pos === -1 ? defaultValue : pos;
    }
    find(key, defaultValue = undefined) {
      const selection = this.items.filter((item) => item[0] === key);
      this.assert(
        selection.length <= 1,
        `Duplication of key detected on key «${key}» on «PointerList.prototype.find`,
      );
      return selection.length ? selection[0][1] : defaultValue;
    }
    select(key, defaultValue = undefined) {
      const selection = this.items.filter((item) => item[0] === key);
      this.assert(
        selection.length <= 1,
        `Duplication of key detected on key «${key}» on «PointerList.prototype.select»`,
      );
      return selection.length ? selection[0][1] : defaultValue;
    }
    insert(entry) {
      this._validateEntry(entry, "insert");
      this.assert(
        !this.items.filter((item) => item[0] === key).length,
        `Cannot insert because a duplication of key detected on key «${key}» on «PointerList.prototype.insert»`,
      );
      this.items.push([key, value]);
      return this;
    }
    insertAll(...entries) {
      for (let index = 0; index < entries.length; index++) {
        const entry = entries[index];
        this._validateEntry(entry, "insertAll");
        this.insert(entry);
      }
    }
    update(key, value) {
      const pos = this.items.findIndex((item) => item[0] === key);
      this.assert(
        pos !== -1,
        `Cannot update key ${key} because it does not exist on «PointerList.prototype.update»`,
      );
      this.items.push([key, value]);
      return this;
    }
    delete(key) {
      const pos = this.items.findIndex((item) => item[0] === key);
      if (pos === -1)
        throw new Error(
          `Cannot update key ${key} because it does not exist on «PointerList.prototype.delete»`,
        );
      this.items.splice(pos, 1);
      return this;
    }
    precede(key) {
      return this.constructor.LocutionOfWith.create({
        list: this,
        operation: "precedeKeyWith",
        key,
      });
    }
    follow(key) {
      return this.constructor.LocutionOfWith.create({
        list: this,
        operation: "followKeyWith",
        key,
      });
    }
    replace(key) {
      return this.constructor.LocutionOfWith.create({
        list: this,
        operation: "replaceKeyWith",
        key,
      });
    }
    _validateEntry(entry, comingFromMethod) {
      this.assert(
        Array.isArray(entry),
        `Parameter «entry» is required to be an array on «PointerList.prototype.${comingFromMethod}»`,
      );
      this.assert(
        entry.length === 2,
        `Parameter «entry» is required to be an array of 2 items on «PointerList.prototype.${comingFromMethod}»`,
      );
    }
    precedeKeyWith(key, entry) {
      this._validateEntry(entry, "precedeKeyWith");
      const pos = this.items.indexOf(key);
      this.assert(
        pos !== -1,
        `Cannot precede key because it does not exist on «PointerList.prototype.precedeKeyWith»`,
      );
      this.items.splice(pos, 0, entry);
      return this;
    }
    followKeyWith(key, entry) {
      this._validateEntry(entry, "followKeyWith");
      const pos = this.items.indexOf(key);
      this.assert(
        pos !== -1,
        `Cannot precede key because it does not exist on «PointerList.prototype.followKeyWith»`,
      );
      this.items.splice(pos + 1, 0, entry);
      return this;
    }
    replaceKeyWith(key, entry) {
      this._validateEntry(entry, "replaceKeyWith");
      const pos = this.items.indexOf(key);
      this.assert(
        pos !== -1,
        `Cannot precede key because it does not exist on «PointerList.prototype.replaceKeyWith»`,
      );
      this.items.splice(pos, 1, entry);
      return this;
    }
  };
});
