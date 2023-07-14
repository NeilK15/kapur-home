const { PythonShell } = require("python-shell");
const path = require("path");

const Scraper = class {
  static fetchRecipeFromUrl(url) {
    if (!url) {
      // Throw an error if url invalid
      throw SyntaxError("Please provide a url");
    }

    const srcPath = path.join(__dirname, "");

    const options = {
      args: [url, srcPath],
      pythonPath: path.join(__dirname, "/.venv/bin/python3.11"),
      stdio: ["pipe", "pipe", "pipe", "pipe"],
    };

    // Running the python script with the url passed
    const pyshell = new PythonShell(path.join(__dirname, "/src/main.py"), options);

    pyshell.on("message", (message) => {
      try {
        const obj = JSON.parse(message);
        console.log(obj);
        pyshell.end(function (err, code, signal) {
          if (err) throw err;
          console.log("The exit code was: " + code);
          console.log("The exit signal was: " + signal);
          console.log("finished");
        });
        return obj;
      } catch (e) {
        if (e instanceof SyntaxError) console.log("Text isn't valid JSON\n", message, "\nTrying the next message...");
        else {
          console.log("\nUnknown Error\n", e);
        }
      }
    });

    pyshell.on("pythonError", (err) => {
      console.log(err);
      // Throw an error maybe
    });

    pyshell.on("close", () => {
      console.log("Scraper ended");
    });

    // PythonShell.run('../main.py', options).then((messages) => {
    // });
  }
};

module.exports = Scraper;
