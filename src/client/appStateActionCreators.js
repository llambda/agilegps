
export function selectHistoryItemID(id) {
  return {
    type: "SET_HISTORY_ITEM_ID",
    value: id
  };
}

export function selectDays(startDate, endDate) {
  return {
    type: "SELECT_DAYS",
    startDate: startDate,
    endDate: endDate
  }
};

export function setShowVerbose(bool) {
  return {
    type: "SHOWVERBOSE",
    value: bool
  };
};

export function setShowLatLong(bool) {
  return {
    type: "SHOWLATLONG",
    value: bool
  };
};


export function animationPlay() {
  return {
    type: "ANIMATION_PLAY",
    value: true
  };
};

export function animationPause() {
  return {
    type: "ANIMATION_PAUSE",
    value: true
  };
};

export function animationStop() {
  return {
    type: "ANIMATION_STOP",
    value: true
  };
};
