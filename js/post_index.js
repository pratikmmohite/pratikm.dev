function loadTrackers() {
  //#Begin: countly

  //some default pre init
  var Countly = Countly || {};
  Countly.q = Countly.q || [];

  //provide countly initialization parameters
  Countly.app_key = "a487c6b47413734b2da85cfae60d5fb9edd7e454";
  Countly.url = "https://pratikm-89b30be12f6a1.flex.countly.com";

  Countly.q.push(["track_sessions"]);
  Countly.q.push(["track_pageview"]);
  Countly.q.push(["track_clicks"]);
  Countly.q.push(["track_scrolls"]);
  Countly.q.push(["track_errors"]);
  Countly.q.push(["track_links"]);
  Countly.q.push(["track_forms"]);
  Countly.q.push(["collect_from_forms"]);

  //load countly script asynchronously
  (function () {
    var cly = document.createElement("script");
    cly.type = "text/javascript";
    cly.async = true;
    //enter url of script here
    cly.src =
      "https://pratikm-89b30be12f6a1.flex.countly.com/sdk/web/countly.min.js";
    cly.onload = function () {
      Countly.init();
    };
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(cly, s);
  })();

  //#End: countly

  //#Begin: clarity
  (function (c, l, a, r, i, t, y) {
    c[a] =
      c[a] ||
      function () {
        (c[a].q = c[a].q || []).push(arguments);
      };
    t = l.createElement(r);
    t.async = 1;
    t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", "lwbcm01d97");
  //#End: clarity
}
function loadServiceWorkers() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/sw.js").then(
        function (registration) {
          // Registration was successful
          console.log(
            "ServiceWorker registration successful with scope: ",
            registration.scope
          );
        },
        function (err) {
          // registration failed :(
          console.log("ServiceWorker registration failed: ", err);
        }
      );
    });
  }
}
loadServiceWorkers();
loadTrackers();
