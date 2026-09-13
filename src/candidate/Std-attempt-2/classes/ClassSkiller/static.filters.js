static filters = {
  accessors: function(entry) {
    return entry[1].get || entry[1].set;
  },
  members: function(entry) {
    return (!entry[1].get) && (!entry[1].set);
  },
};