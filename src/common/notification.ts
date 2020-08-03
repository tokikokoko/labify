export const notifyMe = () => {
  // ブラウザーが通知に対応しているかどうかをチェックしましょう
  if (!("Notification" in window)) {
    alert("このブラウザーはデスクトップ通知に対応していません。");
  }

  // 通知の許可が既に得られているかどうかをチェックしましょう
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
      let notification = new Notification(`こんにちは! ${Date.now()}`, {silent: true});
  }

  // そうでなければ、ユーザーに許可を求める必要があります
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      // ユーザーが許可したら、通知を作成しましょう
      if (permission === "granted") {
        let notification = new Notification(`こんにちは! ${Date.now()}`, {silent: true, renotify: true, requireInteraction: false});
      }
    });
  }
};
