   function AJAX(config) {
       if (!(this instanceof AJAX)) {
           return new AJAX(config);
       }
       this._xhr = new XMLHttpRequest();
       this._config = this._extendOptions(config);


       this._assignEvent();
       this._beforeSend();


   }
   AJAX.prototype._assignEvent = function () {

       this._xhr.addEventListener('ready', this._handleResponse.bind(this), false);
       this._xhr.addEventListener('abort', this._handleError.bind(this), false);
       this._xhr.addEventListener('error', this._handleError.bind(this), false);
       this._xhr.addEventListener('timeout', this._handleError.bind(this), false);
       // bind dlatego ze podczas zdarzen this kieruje na obiekt zdarzenia _xhr
       // w metodzie _handleResponse/Error this kieruje na 
       // blad :  this._xhr.addEventListener('timeout', this._handleError, false); 


   };
   AJAX.prototype._open = function () {
       this._xhr.open(
           this._config.type,
           this._config.url,
           this._config.options.async,
           this._config.options.username,
           this._config.options.password,
       )
       this._xhr.timeout = this._config.options.timeout;
   };
   AJAX.prototype._send = function (data) {


       this._xhr.send(data);
   };
   AJAX.prototype._assignUserHeaders = function () {

       if (Object.keys(this._config.headers).length) {


           for (var key in this._config.headers) {
               this._xhr.setRequestHeader(key, this._config.headers[key]);
           }
       }

   };
   AJAX.prototype._beforeSend = function () {

       var isData = Object.keys(this._config.data).length > 0,
           data = null;
       if (this._config.type.toUpperCase() === "POST" && isData) {
           data = this._serializedFormData(this._config.data);
       } else if (this._config.type.toUpperCase() === "GET" && isData) {
           var URLData = this._serializeData(this._config.data);
           this._config.url += '?' + URLData;
       }
       console.log(this._config.url);
       this._open();
       this._assignUserHeaders();
       this._send(data);
   };

   AJAX.prototype._serializeData = function (data) {

       var serialize = '';
       for (var key in data) {
           serialize += key + '=' + encodeURIComponent(data[key]) + "&";

       }

       return serialize.slice(0, serialize.length - 1);
   };

   AJAX.prototype._serializedFormData = function (data) {
       var serialized = new FormData();
       for (var key in data) {
           serialized.append(key, data[key]);
       }
       return serialized;
   };
   AJAX.prototype._extendOptions = function (config) {
       // zmiana na ciag znakow , potem zmiana na obiekt po co ? mamy nowy // obiekt (kopie) 
       var defaultConfig = JSON.parse(JSON.stringify(this._defaultConfig));

       for (var key in defaultConfig) {
           if (key in config) {
               continue;
           }
           config[key] = defaultConfig[key];

       }


       return config;
   };

   AJAX.prototype._handleResponse = function (e) {

       console.log('Ready state : ' + this._xhr.readyState + ', Status : ' + this._xhr.status);

       if (this._xhr.readyState === 4 && this._xhr.status >= 200 && this._xhr.status < 400) {
           if (typeof this._xhr.config.success === 'function') {
               this._xhr.config.success(this._xhr.response, this._xhr);
           }
       } else if (this._xhr.readyState === 4 && this._xhr.status >= 400) {
           this._handleError();
       }
   };

   AJAX.prototype._handleError = function (e) {
       console.log('blad');
       if (typeof this._xhr.config.failure === 'function') {
           this._xhr.config.failure(this._xhr.response, this._xhr);
       }


   };
   AJAX.prototype._defaultConfig = {
       type: 'GET',
       url: window.location.href,
       data: {},
       options: {
           async: true,
           timeout: 0,
           username: null,
           password: null,
       },
       headers: {}
   };
   var a = AJAX({
       type: "GET",
       url: "odbierz.php",
       data: {
           firstName: "Piotr",
           lastName: "Kowalski"
       },
       headers: {
           "X-My-Header": "123#asdf"
       },
       success: function (response, xhr) {
           console.log("Udało się! Status: " + xhr.status);
       },
       failure: function (xhr) {
           console.log("Wystąpił błąd. Status: " + xhr.status);
       }
   });
