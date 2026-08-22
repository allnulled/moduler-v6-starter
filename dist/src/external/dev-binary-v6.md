
/*.html");
                                        outputFile = `@/dist/www/${rootPath.replace("@/src/www/", "")}`;
                                    } else if (event.isSrc) {
                                        currentStep.push("3.2.b. html is src/*
/*.html");
                                        outputFile = `@/dist/src/${rootPath.replace("@/src/", "")}`;
                                    } else {
                                        currentStep.push("3.2.c. html is not src/*
/*.html");
                                        console.log(this.devbin.compiler.constructor.ansi.colors.style("blackBright").text(`[-] DevBinaryV6 dismissed touch event from an *.html not under «@/src/»: ${rootPath}`));
                                        break Touch_event;
                                    }
                                    currentStep.push("3.2.{a,b}. compiling html file");
                                    const outputCompilation = await this.devbin.compiler.compile(filepath);
                                    const outputHtml = outputCompilation.html;
                                    const outputFullpath = this.devbin.moduler.normalizationOf(outputFile);
                                    await require("fs").promises.writeFile(outputFullpath, outputHtml, "utf8");
                                }
                            }
                            Caso_js_o_test_js: {
                                Paso_0_descartar_si_no_es_entry_o_test: {
                                    if (!isEntry && !event.isJsTest) {
                                        currentStep.push("3.3.a. is not entry nor test");
                                        console.log(this.devbin.compiler.constructor.ansi.colors.style("blackBright").text(`[-] DevBinaryV6 dismissed touch event from not entry or test: ${rootPath}`));
                                        break Processing_entry;
                                    } else {
                                        currentStep.push("3.3.b. is entry or test");
                                        console.log(this.devbin.compiler.constructor.ansi.colors.style("blackBright").text(`[*] DevBinaryV6 triggered touch event from: ${rootPath}`));
                                    }
                                }
                                Paso_1_compilar_distribuibles: {
                                    currentStep.push("3.4. compile distribuibles of entry ");
                                    Object.assign(event, {
                                        distribution: await this.compileDistribuiblesOf(filepath, event)
                                    });
                                }
                                Paso_2_fabricar_test_unitario: {
                                    currentStep.push("3.5. make unit test");
                                    Object.assign(event, {
                                        testFabrication: await this.fabricateUnitTestFileOf(filepath, event)
                                    });
                                }
                                Paso_3_ejecutar_test_unitario: {
                                    currentStep.push("3.6. run unit test");
                                    Object.assign(event, {
                                        testExecution: await this.executeUnitTestFileOf(filepath, event)
                                    });
                                }
                                Triggering_onDistribute_file: {
                                    currentStep.push("3.7. trigger e.onDistribute.js");
                                    const onDistributeFile = path.join(path.dirname(filepath), "e.onDistribute.js");
                                    await this.triggerCallbackFromFile(onDistributeFile, {
                                        file: filepath,
                                        event: event
                                    });
                                }
                                Triggering_onTest_file: {
                                    currentStep.push("3.8. trigger e.onTest.js");
                                    const onTestFile = path.join(path.dirname(filepath), "e.onTest.js");
                                    const testsAdded = await this.triggerCallbackFromFile(onTestFile, {
                                        file: filepath,
                                        event: event
                                    });
                                    if (typeof testsAdded !== "number") {
                                        this.assert(typeof testsAdded === "object", `File «e.onTest.js» must return object about file «${onTestFile}» on «DevBinaryV6.Utils.prototype.touchFile»`);
                                        Object.keys(testsAdded).forEach(prop => {
                                            this.assert([ "feature", "integrity", "speed" ].includes(prop), `File «e.onTest.js» on «${onTestFile}» cannot return object with unknown property «${prop}» on «DevBinaryV6.Utils.prototype.touchFile»`);
                                        });
                                        if ("feature" in testsAdded) event.testFeatures.push(...testsAdded.feature);
                                        if ("integrity" in testsAdded) event.testIntegrity.push(...testsAdded.integrity);
                                        if ("speed" in testsAdded) event.testSpeed.push(...testsAdded.speed);
                                    }
                                }
                            }
                        }
                        Processing_test: {
                            if (event.isJsTest) {
                                currentStep.push("4. run file because it is a test");
                                await this.executeUnitTestFileOf(filepath, {
                                    testFabrication: {
                                        unitFile: filepath
                                    }
                                });
                                break Touch_event;
                            }
                        }
                        Triggering_onTouch_file: {
                            if (event.ignoreOnTouchEvent) break Triggering_onTouch_file;
                            currentStep.push("5. run e.onTouch.js");
                            const onTouchFile = path.join(path.dirname(filepath), "e.onTouch.js");
                            await this.triggerCallbackFromFile(onTouchFile, {
                                file: filepath,
                                event: event
                            });
                        }
                        Triggering_onDistributeDirectory_file: {
                            const onDistributeDirectoryFile = path.join(path.dirname(filepath), "e.onDistributeDirectory.js");
                            currentStep.push("6. run e.onDistributeDirectory.js");
                            const result = await this.triggerCallbackFromFile(onDistributeDirectoryFile, {
                                file: filepath,
                                event: event
                            });
                            if (!outputFile) break Triggering_onDistributeDirectory_file;
                            if (result === true) {
                                currentStep.push("6.1. distributing directory");
                                const origin = path.dirname(this.devbin.compiler.normalizationOf(rootPath));
                                const destination = path.dirname(this.devbin.compiler.normalizationOf(outputFile));
                                require("fs").promises.cp(origin, destination, {
                                    recursive: true
                                });
                            }
                        }
                        Propagating_touch_up: {
                            Paso_4_propagar_evento_arriba: {
                                currentStep.push("6.2. propagate touch up");
                                const touchPropagation = event.propagateUp ? await this.propagateUpTouchEventFrom(filepath, event) : false;
                                Object.assign(event, {
                                    touchPropagation: touchPropagation
                                });
                            }
                        }
                        On_root: {
                            if (!event.isRoot) break On_root;
                            currentStep.push("7. it is root");
                            Run_integrity_tests: {
                                currentStep.push("7.1. run integrity tests");
                                await this.devbin.tester.runDirectory("@/test/integrity", {
                                    title: "integrity",
                                    filename: "integrity.js",
                                    filter: file => this.matchesFileWithSimpleSelector(path.basename(file), [ ...event.testIntegrity, ...this.devbin.settings.data?.test?.integrity || [] ])
                                });
                            }
                            Run_speed_tests: {
                                currentStep.push("7.2. run speed tests");
                                await this.devbin.tester.runDirectory("@/test/speed", {
                                    title: "speed",
                                    filename: "speed.js",
                                    filter: file => this.matchesFileWithSimpleSelector(path.basename(file), [ ...event.testSpeed, ...this.devbin.settings.data?.test?.speed || [] ])
                                });
                            }
                            Run_feature_tests: {
                                currentStep.push("7.3. run feature tests");
                                await this.devbin.tester.runDirectory("@/test/feature", {
                                    title: "feature",
                                    filename: "feature.js",
                                    filter: file => this.matchesFileWithSimpleSelector(path.basename(file), [ ...event.testFeatures, ...this.devbin.settings.data?.test?.features || [] ])
                                });
                            }
                            Run_case_tests: {
                                currentStep.push("7.3. run case tests");
                                await this.devbin.tester.runDirectory("@/test/case", {
                                    title: "case",
                                    filename: "case.js",
                                    filter: file => true
                                });
                            }
                            Run_devbin_test_command: {
                                if (!await this.devbin.compiler.files.hasFile("@/dev/bin/test/command.js")) break Run_devbin_test_command;
                                currentStep.push(`7.4. run «devbin test --origin ${filepath}»`);
                                const output = await this.devbin.command([ "test", "--origin", filepath ]);
                                if (output) console.log(output);
                            }
                        }
                    }
                    return event;
                } catch (error) {
                    console.log(`[!] Error on method «touchFile» on step «${currentStep.reverse().join(" < ")}»`, error);
                    throw error;
                }
            }
            async ensureCoreFrom(basedirInput, parametersInput = {}) {
                const basedir = this.devbin.compiler.normalizationOf(basedirInput);
                const parameters = Object.assign({}, {
                    ignoreErrors: false,
                    allowDirtyDirectory: false,
                    dontOverride: false,
                    installDependencies: false
                }, parametersInput, {
                    from: basedirInput
                });
                const fs = require("fs");
                const path = require("path");
                const targetDir = path.resolve(parameters.from);
                const innerFiles = await fs.promises.readdir(targetDir);
                if (!parameters.allowDirtyDirectory) {
                    this.assert(innerFiles.length === 0, `Parameter «--from» should point to an empty directory but «${targetDir}» is not empty on «DevBinaryV6.Utils.prototype.ensureCoreFrom»`);
                }
                const currentPackageJson = (() => {
                    try {
                        return require(`${__dirname}/../package.json`);
                    } catch (error) {
                        return {
                            devDependencies: {},
                            dependencies: {}
                        };
                    }
                })();
                const initialPackageJson = {
                    name: "name-of-the-project",
                    bin: {},
                    main: "dist/main.dist.js",
                    scripts: {
                        dev: "./dev/run.js loop",
                        test: "./dev/run.js test'"
                    },
                    dependencies: currentPackageJson.dependencies,
                    devDependencies: currentPackageJson.devDependencies,
                    author: "allnulled",
                    version: "1.0.0"
                };
                const utils = {};
                Object.assign(utils, {
                    _createDirectory: function(dir) {
                        return fs.promises.mkdir(dir);
                    },
                    _saveFile: async function(file, contents) {
                        if (parameters.dontOverride && await utils._existsFile(file)) {
                            return -1;
                        }
                        return await fs.promises.writeFile(file, contents, "utf8");
                    },
                    _saveFileIfNotExists: async function(file, contents) {
                        if (await utils._existsFile(file)) return -1;
                        return await fs.promises.writeFile(file, contents, "utf8");
                    },
                    _duplicateFile: async function(src, dst) {
                        if (parameters.dontOverride && await utils._existsFile(dst)) {
                            return -1;
                        }
                        return await fs.promises.copyFile(src, dst);
                    },
                    _duplicateDirectory: function(src, dst) {
                        return fs.promises.cp(src, dst, {
                            recursive: true
                        });
                    },
                    _initializeDuplicatedFile: async function(src, dst) {
                        if (!await utils._existsFile(dst)) {
                            return await fs.promises.copyFile(src, dst);
                        }
                    },
                    _readFile: function(src) {
                        return fs.promises.readFile(src, "utf8");
                    },
                    trify: function(callback, errorSignal = false) {
                        return async function(...args) {
                            try {
                                return await callback(...args);
                            } catch (error) {
                                return errorSignal;
                            }
                        };
                    }
                });
                Object.assign(utils, {
                    _existsFile: utils.trify(utils._readFile, false)
                });
                const createDirectory = parameters.ignoreErrors ? utils.trify(utils._createDirectory) : utils._createDirectory;
                const createDirectoryIfNotExists = utils.trify(utils._createDirectory);
                const saveFile = parameters.ignoreErrors ? utils.trify(utils._saveFile) : utils._saveFile;
                const saveFileIfNotExists = utils._saveFileIfNotExists;
                const duplicateFile = parameters.ignoreErrors ? utils.trify(utils._duplicateFile) : utils._duplicateFile;
                const duplicateDirectory = parameters.ignoreErrors ? utils.trify(utils._duplicateDirectory) : utils._duplicateDirectory;
                const duplicateFileIfNotExists = utils.trify(utils._initializeDuplicatedFile);
                await createDirectoryIfNotExists(`${targetDir}/dev`);
                await createDirectoryIfNotExists(`${targetDir}/dev/bin`);
                await createDirectoryIfNotExists(`${targetDir}/dev/bin/help`);
                await createDirectoryIfNotExists(`${targetDir}/dev/bin/test`);
                await createDirectoryIfNotExists(`${targetDir}/dev/coverage`);
                await createDirectoryIfNotExists(`${targetDir}/dev/files`);
                await createDirectoryIfNotExists(`${targetDir}/src`);
                await createDirectoryIfNotExists(`${targetDir}/src/external`);
                await createDirectoryIfNotExists(`${targetDir}/src/www`);
                await createDirectoryIfNotExists(`${targetDir}/src/www/dev`);
                await createDirectoryIfNotExists(`${targetDir}/src/www/external`);
                await createDirectoryIfNotExists(`${targetDir}/dist`);
                await createDirectoryIfNotExists(`${targetDir}/dist/src`);
                await createDirectoryIfNotExists(`${targetDir}/dist/www`);
                await createDirectoryIfNotExists(`${targetDir}/dist/www/coverage`);
                await createDirectoryIfNotExists(`${targetDir}/dist/www/external`);
                await createDirectoryIfNotExists(`${targetDir}/dist/www/dev`);
                await createDirectoryIfNotExists(`${targetDir}/dist/www/dev/settings`);
                await createDirectoryIfNotExists(`${targetDir}/dist/src/external`);
                await createDirectoryIfNotExists(`${targetDir}/test`);
                await createDirectoryIfNotExists(`${targetDir}/test/feature`);
                await createDirectoryIfNotExists(`${targetDir}/test/integrity`);
                await createDirectoryIfNotExists(`${targetDir}/test/unit`);
                await createDirectoryIfNotExists(`${targetDir}/test/unit/src`);
                await createDirectoryIfNotExists(`${targetDir}/test/case`);
                await createDirectoryIfNotExists(`${targetDir}/test/speed`);
                await createDirectoryIfNotExists(`${targetDir}/docs`);
                await createDirectoryIfNotExists(`${targetDir}/docs/dist`);
                await createDirectoryIfNotExists(`${targetDir}/docs/dist/www`);
                await createDirectoryIfNotExists(`${targetDir}/docs/dist/www/external`);
                await saveFileIfNotExists(`${targetDir}/package.json`, JSON.stringify(initialPackageJson, null, 2), "utf8");
                if (!await utils._existsFile(`${targetDir}/.gitignore`)) await saveFile(`${targetDir}/.gitignore`, "node_modules", "utf8");
                await duplicateFileIfNotExists(`${__dirname}/../src/DevBinaryV6/Utils/core/devbin-help.js`, `${targetDir}/dev/bin/help/command.js`);
                await duplicateFileIfNotExists(`${__dirname}/../src/DevBinaryV6/Utils/core/dev-bin.js`, `${targetDir}/dev/bin.js`);
                Al_run_hay_que_darle_permisos: {
                    await duplicateFileIfNotExists(`${__dirname}/../src/DevBinaryV6/Utils/core/dev-run.js`, `${targetDir}/dev/run.js`);
                    await fs.promises.chmod(`${targetDir}/dev/run.js`, "755");
                }
                await duplicateFileIfNotExists(`${__dirname}/../src/DevBinaryV6/Utils/core/index.html`, `${targetDir}/src/www/index.html`);
                await duplicateFileIfNotExists(`${__dirname}/../src/DevBinaryV6/Utils/core/app.js`, `${targetDir}/src/www/app.entry.js`);
                await duplicateFileIfNotExists(`${__dirname}/../src/DevBinaryV6/Utils/core/app.css`, `${targetDir}/src/www/app.entry.css`);
                await duplicateFileIfNotExists(`${__dirname}/../src/DevBinaryV6/Utils/core/settings.js`, `${targetDir}/dev/settings.js`);
                await duplicateFileIfNotExists(`${__dirname}/../src/DevBinaryV6/Utils/core/devbin-test.js`, `${targetDir}/dev/bin/test/command.js`);
                await duplicateFileIfNotExists(`${__dirname}/../src/DevBinaryV6/Utils/core/www-settings.js`, `${targetDir}/src/www/dev/settings.entry.js`);
                await duplicateFileIfNotExists(`${__dirname}/../src/DevBinaryV6/Utils/core/www-settings.js`, `${targetDir}/dist/www/dev/settings.dist.js`);
                await duplicateFileIfNotExists(`${__dirname}/../src/DevBinaryV6/Utils/core/controllers.js`, `${targetDir}/dev/controllers.js`);
                await duplicateFile(`${__dirname}/moduler-v6.dist.js`, `${targetDir}/src/www/external/moduler-v6.entry.js`);
                await duplicateFile(`${__dirname}/moduler-v6.dist.js`, `${targetDir}/dist/www/external/moduler-v6.dist.js`);
                await duplicateFile(`${__dirname}/moduler-v6.dist.js`, `${targetDir}/docs/dist/www/external/moduler-v6.dist.js`);
                await duplicateFile(`${__dirname}/moduler-v6.dist.js`, `${targetDir}/src/external/moduler-v6.entry.js`);
                await duplicateFile(`${__dirname}/compiler-v6.dist.js`, `${targetDir}/src/external/compiler-v6.entry.js`);
                await duplicateFile(`${__dirname}/dev-binary-v6.dist.js`, `${targetDir}/src/external/dev-binary-v6.entry.js`);
                await duplicateFile(`${__dirname}/refrescador.dist.js`, `${targetDir}/src/external/refrescador.entry.js`);
                await duplicateDirectory(`${__dirname}/refrescador`, `${targetDir}/src/external/refrescador`, {
                    recursive: true
                });
                if (parameters.installDependencies) await this.installNpmDependencies([], targetDir);
                return {
                    targetDir: targetDir
                };
            }
            existsFile(file) {
                return require("fs").promises.access(file).then(() => true).catch(error => false);
            }
            async triggerCallbackFromFile(file, injection = {}, dontThrow = false) {
                if (!await this.existsFile(file)) {
                    return -1;
                }
                const callback = require(file);
                this.assert(typeof callback === "function", `File «${file}» should export a function on «DevBinaryV6.Utils.prototype.triggerCallbackFromFile»`);
                return await callback.call(this, {
                    devbin: this.devbin,
                    ...injection
                });
            }
            instrumentCode(code, filename) {
                const {createInstrumenter: createInstrumenter} = require("istanbul-lib-instrument");
                const instrumenter = createInstrumenter({
                    produceSourceMap: true,
                    esModules: true
                });
                const instrumented = instrumenter.instrumentSync(code, filename);
                return instrumented;
            }
            globOf(globPatterns) {
                return {
                    matcher: require("picomatch")(globPatterns),
                    matches(file) {
                        return this.matcher(file);
                    }
                };
            }
            async exportDevSettings(filepath) {
                try {
                    const fs = require("fs");
                    const settingsAsyncFactory = require(filepath);
                    const settingsData = typeof settingsAsyncFactory === "function" ? await settingsAsyncFactory({
                        devbin: this.devbin
                    }) : settingsAsyncFactory;
                    const publicableSettingsData = {};
                    for (let indexProp = 0; indexProp < this.publicableSettingsIds.length; indexProp++) {
                        const publicableProp = this.publicableSettingsIds[indexProp];
                        publicableSettingsData[publicableProp] = settingsData[publicableProp] ?? null;
                    }
                    const publicableSettings = this.constructor.removeNullPropertiesFromObject(publicableSettingsData);
                    const publicableJson = this.devbin.compiler.fullpathOf("@/dist/www/dev/settings/publicable.json");
                    await this.ensureDirectoryOf(publicableJson);
                    await fs.promises.writeFile(publicableJson, JSON.stringify(publicableSettings, null, 2), "utf8");
                } catch (error) {
                    console.log("[!] Error loading settings:", error);
                }
            }
            copyFile(src, dst) {
                return require("fs").promises.copyFile(this.devbin.moduler.normalizationOf(src), this.devbin.moduler.normalizationOf(dst));
            }
            matchesFileWithSimpleSelector(filepath, selectors = []) {
                this.assert(Array.isArray(selectors), "Parameter «selectors» must be array on «DevBinaryV6.Utils.prototype.matchesFileWithSimpleSelector»");
                return selectors.some((selector, index) => {
                    this.assert(typeof selector === "string", `All selectors must be strings but on index «${index}» there is a «${typeof selector}»`);
                    if (selector.startsWith("^")) {
                        return filepath.startsWith(selector.slice(1));
                    }
                    return filepath.includes(selector);
                });
            }
            publicableSettingsIds=[ "env", "instrumentalize", "traceExternalSources", "sectionsMap", "test" ];
            async installNpmDependencies(files, rootdir = this.devbin.moduler.rootdir) {
                const {exec: exec} = require("child_process");
                const {promisify: promisify} = require("util");
                const execAsync = promisify(exec);
                const command = "npm install" + (files ? ` ${files.join(" ")}` : "");
                const {stdout: stdout, stderr: stderr} = await execAsync(command, {
                    cwd: rootdir
                });
                if (stderr) throw stderr;
                return stdout;
            }
            constructor(devbin) {
                this.devbin = devbin;
            }
        };
        static ShadowCommands=class DevBinaryV6ShadowCommands {
            constructor(devbin) {
                this.devbin = devbin;
            }
            assert(...args) {
                return this.devbin.assert(...args);
            }
            "new project"(args, devbin) {
                const parameters = devbin.utils.formatCliArgs({
                    from: {
                        onFormat: devbin.constructor.Formatters.asString,
                        default: false,
                        alias: [ "-f" ],
                        description: "Empty directory from which to start the new project"
                    },
                    installDependencies: {
                        onFormat: devbin.constructor.Formatters.asBoolean,
                        default: false,
                        alias: [ "-i" ],
                        description: "Runs «npm install» once all files are ensured"
                    }
                }, args);
                this.assert(typeof parameters.from === "string", `Parameter «--from» is required as string on «DevBinaryV6.ShadowCommands.prototype['new project']»`);
                return devbin.utils.ensureCoreFrom(parameters.from, {
                    ignoreErrors: 0,
                    allowDirtyDirectory: 0
                });
            }
            async "ensure core"(args, devbin) {
                const parameters = devbin.utils.formatCliArgs({
                    from: {
                        onFormat: devbin.constructor.Formatters.asString,
                        default: false,
                        alias: [ "-f" ],
                        description: "Any directory from which to ensure the core os a devbin project"
                    },
                    reset: {
                        onFormat: devbin.constructor.Formatters.asBoolean,
                        default: false,
                        alias: [ "-r" ],
                        description: "Overwrites all core files if used"
                    },
                    installDependencies: {
                        onFormat: devbin.constructor.Formatters.asBoolean,
                        default: false,
                        alias: [ "-i" ],
                        description: "Runs «npm install» once all files are ensured"
                    }
                }, args);
                this.assert(typeof parameters.from === "string", `Parameter «--from» is required as string on «DevBinaryV6.ShadowCommands.prototype['ensure core']»`);
                this.assert(typeof parameters.reset === "boolean", `Parameter «--reset» is required as boolean on «DevBinaryV6.ShadowCommands.prototype['ensure core']»`);
                return devbin.utils.ensureCoreFrom(parameters.from, {
                    ignoreErrors: 1,
                    allowDirtyDirectory: 1,
                    dontOverride: !parameters.reset
                });
            }
            "print root"(args, devbin) {
                console.log(devbin.compiler.rootdir);
            }
            async "build github pages"(args, devbin) {
                await devbin.compiler.files.copyDirectory("@/dist/www", "@/docs/dist/www");
                await devbin.compiler.files.copyFile.try("@/dist/www/index.html", "@/docs/index.html");
                await devbin.compiler.files.copyFile.try("@/dist/www/app.dist.js", "@/docs/app.dist.js");
                await devbin.compiler.files.copyFile.try("@/dist/www/app.dist.css", "@/docs/app.dist.css");
            }
            async loop(args) {
                const targetRoot = await this.devbin.utils.constructor.findFirstParentDirectoryContaining(process.cwd(), "package.json");
                await this.devbin.settings.load();
                const port = this.devbin.settings.data?.loop?.port || 3005;
                const settingsControllers = this.devbin.settings.data?.loop?.controllers || [];
                const targetDirs = [ require("path").resolve(targetRoot, "src"), require("path").resolve(targetRoot, "dev/settings.js"), require("path").resolve(targetRoot, "test/unit/src"), require("path").resolve(targetRoot, "test/feature"), require("path").resolve(targetRoot, "test/integrity"), require("path").resolve(targetRoot, "test/spontaneous") ];
                const devControllersFile = `${targetRoot}/dev/controllers.js`;
                const devControllers = await this.devbin.utils.existsFile(devControllersFile) ? [ devControllersFile ] : [];
                return this.devbin.constructor.Refrescador.run({
                    watch: targetDirs,
                    bulletproof: false,
                    ignore: [ "*