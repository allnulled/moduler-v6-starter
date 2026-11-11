// @interface:ProgresserInterface
{
  prototype: {

    onCreate: function(relations, { total = 1, current = 0 } = {}, parent = null, weight = 1) {
      this.total = total;
      this.current = current;
      this.parent = parent;
      this.weight = weight;
      this.children = [];
      this.ownCurrent = current;
      this._updateProgress();
    },

    advanceProgress: function (n = 1) {
      this.ownCurrent += n;
      this._updateProgress();
      return this;
    },

    setProgressTotal: function (total) {
      this.total = total;
      if (this.ownCurrent > total) {
        this.ownCurrent = total;
      }
      this._updateProgress();
      return this;
    },

    createSubprogress: function ({ total = 1, current = 0, weight = 1} = {}) {
      const child = this.constructor.create({}, { total, current }, this, weight);
      this.children.push(child);
      this._updateProgress();
      return child;
    },

    _getOwnRelativeProgress: function () {
      if (this.total === 0) return 0;
      return this.ownCurrent / this.total;
    },

    _getChildrenRelativeProgress: function () {
      if (this.children.length === 0) {
        return 0;
      }
      const sumWeights = this.children.reduce((sum, child) => sum + child.weight, 0);
      let progress = 0;
      for (const child of this.children) {
        progress += child._getRelativeProgress() * child.weight / sumWeights;
      }
      return progress;
    },

    _getRelativeProgress: function () {
      if (this.total === 0) return 0;
      return this.current / this.total;
    },

    _updateProgress: function () {
      if (this.children.length === 0) {
        this.current = this.ownCurrent;
      } else {
        const childrenProgress = this._getChildrenRelativeProgress();
        this.current = childrenProgress * this.total;
      }
      this.percent = (this._getRelativeProgress() * 100).toFixed(2) + "%";
      if (this.parent) {
        this.parent._updateProgress();
      }
      return this;
    },

  },
  static: { },
}