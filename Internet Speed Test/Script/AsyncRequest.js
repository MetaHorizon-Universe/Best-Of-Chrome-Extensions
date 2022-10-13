
var Request = function (id = 0) {
  this.id = id;
  this.timer = null;
  this.previousRead = 0;
  this.previousReadForUpload = 0;
  this.method = '';
  this.url = '';
  this.formData = null;
  this.timeout = null;
  this.upload = {};
  this.onload = this.onerror = this.onprogress = this.upload.onprogress = () => { };
  this._req = null;
};

Request.prototype.prepare = function () {
  this._req = new XMLHttpRequest();
  this._req.upload.onload = () => {
    this.previousRead = 0;
    this.previousReadForUpload = 0;
    this.prepare();
  };
  this._req.onerror = (e) => {
    this.onerror(e);
    window.clearTimeout(this.timer);
  };
  this._req.onprogress = e => {
    this.onprogress(Object.assign(e, {
      id: this.id,
      previousRead: this.previousRead
    }));
    this.previousRead = e.loaded;
  };
  this._req.upload.onprogress = e => {
    this.upload.onprogress(Object.assign(e, {
      id: this.id,
      previousReadForUpload: this.previousReadForUpload
    }));
    this.previousReadForUpload = e.loaded;
  };
  this._req.open(this.method, this.url + '?r=' + Math.random());
  this._req.timeout = this.timeout;
  this._req.send(this.formData);
};
Request.prototype.open = function (method, url, period = 5000) {
  this.method = method;
  this.url = url;
  this.timer = window.setTimeout(() => {
    if (this._req) {
      this._req.abort();
      this.onload();
    }
  }, period);
};
Request.prototype.send = function (formData) {
  this.formData = formData;
  this.prepare();
};
Request.prototype.abort = function () {
  if (this._req) {
    this._req.abort();
    delete this._req;
  }
};

