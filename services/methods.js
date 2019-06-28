const axios = require("axios");

var http = require("https"),
  Stream = require("stream").Transform,
  fs = require("fs");

const methods = {
  getUser: async id => {
    return axios.default
      .get(`https://reqres.in/api/users/${id}`)
      .then(response => {
        return response.data;
      });
  },

  saveAvatar: async (url, userId, callback) => {
    console.log("something");
    console.log(url);
    http
      .request(url, function(response) {
        var data = new Stream();

        response.on("data", function(chunk) {
          data.push(chunk);
        });

        response.on("end", function() {
          fs.writeFileSync(`./images/${userId}.png`, data.read());
        });
      })
      .end();

    fs.writeFile(`./images/${userId}.txt`, url, err => {});

    let p = `./images/${userId}.png`;
    callback(p)
  },
  returnBase64: async (filePath, callback) => {
    const base64String = fs.readFileSync(filePath, { encoding: "base64" });
    callback(base64String);
  },
  checkUrl: async (userId, newUrl, callback) => {
    let t = false;
    fs.readFile(`./images/${userId}.txt`, "utf8", (err, oldUrl) => {
      if (err) {
        console.log(err);
      } else {
        if (oldUrl = newUrl) {
           t = true;
        } 
      }
      callback (t);
    });
  },
  deleteFile: id => {
    try {
      fs.unlink(`./images/${id}.png`);
      //file removed
    } catch (err) {
      console.error(err);
    }
    try {
      fs.unlink(`./images/${id}.txt`);
      //file removed
    } catch (err) {
      console.error(err);
    }
  },
  avatarNotExist: (url, userId, filePath, callback) => {
    console.log("something");
    console.log(url);
    http
      .request(url, function(response) {
        var data = new Stream();

        response.on("data", function(chunk) {
          data.push(chunk);
        });

        response.on("end", function() {
          fs.writeFile(`./images/${userId}.png`, data.read(), err => {
            fs.writeFile(`./images/${userId}.txt`, url);
            fs.readFile(
              filePath,
              { encoding: "base64" },
              (err, base64String) => {
                callback(base64String);
              }
            );
          });
        });
      })
      .end();
  }
};

module.exports = methods;
