const fs = require("fs");
const path = require("path");

const libCoverage = require("istanbul-lib-coverage");
const libReport = require("istanbul-lib-report");
const reports = require("istanbul-reports");

const saveCoverage = function (coverageObject, reportName = "default") {
  const reportDir = path.join(__dirname, "coverage", reportName);
  fs.mkdirSync(reportDir, { recursive: true });
  // guardar el raw json
  fs.writeFileSync(path.join(reportDir, "coverage-final.json"), JSON.stringify(coverageObject, null, 2), "utf8");
  // crear CoverageMap
  const coverageMap = libCoverage.createCoverageMap(coverageObject);
  // contexto del report
  const context = libReport.createContext({
    dir: reportDir,
    coverageMap
  });
  // html
  reports.create("html").execute(context);
  // opcionales
  reports.create("json-summary").execute(context);
  reports.create("text-summary").execute(context);
};

module.exports = function ({ app }) {
  const jsonMiddleware = require("body-parser").json({});
  Controller_for_coverage_reporter: {
    app.post("/dev/coverage/commit", [jsonMiddleware], function (request, response) {
      Persist_coverage_as_json: {
        const { coverage, name = "default" } = request.body;
        saveCoverage(coverage, name);
      }
      response.status(200).json({
        message: "El estado de la cobertura de código fue actualizado exitosamente",
      });
    });
  }
  Controller_to_write_file: {
    app.post("/dev/file/write", [jsonMiddleware], async function (request, response) {
      try {
        await require("fs").promises.writeFile(`${__dirname}/files/${request.body.name}`, request.body.text, "utf8");
        return response.sendStatus(200);
      } catch (error) {
        return response.status(501).json({ error: error.name, message: error.message });
      }
    });
  }
  Controller_to_read_file: {
    app.post("/dev/file/read", [jsonMiddleware], async function (request, response) {
      try {
        const contents = await require("fs").promises.readFile(`${__dirname}/files/${request.body.name}`, "utf8");
        return response.status(200).send(contents);
      } catch (error) {
        return response.status(501).json({ error: error.name, message: error.message });
      }
    });
  }
  Controller_for_file_editor: {
    app.get("/dev/file/editor", [], async function (request, response) {
      return response.send(`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Editor</title>
            <style>
                * {
                  box-sizing: border-box;
                }
                .reborder1 {
                    border: 2px solid black;
                }
                .layout-horizontal {
                    display: flex;
                    flex-direction: row;
                }
                .box {
                    flex: 1;
                }
                .box-long {
                    flex: 100;
                }
                #contentbox {
                    min-height: 340px;
                }
            </style>
        </head>
        <body>
            <div class="">
                <div class="layout-horizontal">
                    <div class="box-long">
                        <input id="filebox" class="reborder1" style="width:100%;" type="text" />
                    </div>
                    <div class="box">
                        <button onclick="save()">Guardar</button>
                    </div>
                    <div class="box">
                        <button onclick="load()">Leer</button>
                    </div>
                </div>
                <div class="" style="margin-top:2px";>
                    <textarea id="contentbox" class="reborder1" style="width:100%;resize:vertical;" spellcheck="false"></textarea>
                </div>
            </div>
            <script>
                const save = async function() {
                    const file = document.getElementById("filebox").value;
                    const content = document.getElementById("contentbox").value;
                    if(!file.length) return alert("File needs a name");
                    const data = await fetch("/dev/file/write", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify({
                        name: file,
                        text: content
                      })
                    }).then(it => it.text());
                    console.log(data);
                };
                const load = async function() {
                    const file = document.getElementById("filebox").value;
                    if(!file.length) return alert("File needs a name");
                    const data = await fetch("/dev/file/read", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify({
                        name: file,
                      })
                    }).then(it => it.text());
                    console.log(data);
                    document.getElementById("contentbox").value = data;
                };
            </script>
        </body>
        </html>`);
    });
  }
  Controller_for_coverage_reports_list: {
    app.use("/dev/coverage", async function (req, res, next) {
      try {
        if (["/", ""].includes(req.path)) {
          const coverageReports = await require("fs").promises.readdir(`${__dirname}/coverage`);
          let list = "";
          for (let index = 0; index < coverageReports.length; index++) {
            const filename = coverageReports[index];
            list += `<li><a href="./${filename}">${filename}</a></li>\n`;
          }
          list = `<ul>\n${list}</ul>\n`;
          let html = `<!DOCTYPE html>\n`;
          html += `<html>\n`;
          html += `<body>\n`;
          html += `<style>html { font-family: monospace; }</style>\n`;
          html += `<h3>Reportes de cobertura de código actuales:</h3>\n`;
          html += list;
          html += `</body>\n`;
          html += `</html>\n`;
          return res.send(html);
        }
        next();
      } catch (error) {
        console.log(error);
        next();
      }
    });
  }
  Controller_for_coverage_explorer: {
    app.use("/dev/coverage", require("express").static(`${__dirname}/coverage`));
  }
  return [
    ["build-cov", "/dev/coverage/commit [POST]"],
    ["see-cov", "/dev/coverage"],
    ["files", "/dev/file/{read,write,editor}"],
  ];
};