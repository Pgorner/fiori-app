sap.ui.define(
	[
		"sap/base/strings/formatMessage",
		"sap/ui/core/date/UI5Date",
		"sap/ui/VersionInfo",
		"sap/base/util/Version",
		"sap/ui/integration/util/Utils",
		"sap/ui/thirdparty/jquery"
	],
	function (formatMessage, UI5Date, VersionInfo, VersionUtil, Utils, jQuery) {
		"use strict";

		var fileUtils = {
			/**
			 * Save modified files shown in code editor as Base64 encoded archive file.
			 * Archive can be imported into FPM Explorer
			 * @param {object[]} files Objects with file name and content.
			 * @param {string} folderName The name of the archive.
			 * @param {string} extension The extension of the archive.
			 * @param {string} versionInfo UI5 version of the current loaded sample.
			 */

			downloadFilesCompressed: function (files, folderName, extension, sampleInfo) {
				return new Promise((resolve) => {
					sap.ui.require(["sap/ui/thirdparty/jszip"], function (JSZip) {
						var zip = new JSZip(),
							folder;

						files.forEach(function (file) {
							if (fileUtils.isBlob(file.name)) {
								var content = file.content.split(",")[1]; // erase the base64 prefix
								//complete folder path required if shared as Base64 string
								folder = zip.file(file.url, content, { base64: true });
							} else {
								folder = zip.file(file.url, file.content);
							}
						});

						folder.file("sampleInfo.json", JSON.stringify(sampleInfo));
						const baseData = zip.generate({ type: "blob" });
						fileUtils.downloadFile(baseData, folderName, extension, "application/zip");
					});
				});
			},

			unpackFiles: function (base64FilesContent) {
				return new Promise((resolve, reject) => {
					sap.ui.require(["sap/ui/thirdparty/jszip"], function (JSZip) {
						try {
							var oZip = new JSZip();
							oZip.load(base64FilesContent);
						} catch (e) {
							reject(e);
						}
						const filesContent = {};
						Object.keys(oZip.files).forEach((fileName) => {
							const oZipElement = oZip.files[fileName];
							if (!oZipElement.options.dir) {
								filesContent[oZipElement.name] = oZipElement.asText();
							}
						});
						resolve(filesContent);
					});
				});
			},

			getMatchingFilesFromUpload: function (unpackagedFiles, currentSampleFiles) {
				//all current sample files and their path need to match a file in the uploaded sample
				let matchCount = 0;
				let matchingFiles = currentSampleFiles.map((currentFile) => {
					let match = Object.entries(unpackagedFiles).find((file) => {
						if (file[0].includes(currentFile.url)) {
							matchCount = matchCount + 1;
							return true;
						}
					});
					//remove OS specific path prefixes for locally un- and rezipped packages
					if (match) {
						match[0] = currentFile.url;
						return match;
					}
				});
				if (matchCount != currentSampleFiles.length) {
					throw new Error("Sample incomplete");
				}
				return Object.fromEntries(matchingFiles);
			},

			getSampleInfo: function (unpackagedFiles) {
				const sampleInfo = Object.keys(unpackagedFiles).find((currentFileName) => currentFileName.includes("sampleInfo.json"));
				//sampleInfo file added during download with information about UI5 version and sample root path
				if (!sampleInfo) {
					throw new Error("Sample invalid");
				}
				return unpackagedFiles[sampleInfo];
			},

			/**
			 * Lazy loads thirdparty jszip and saves project compressed.
			 * @param {object[]} files Objects with file name and content.
			 * @param {string} folderName The name of the archive.
			 * @param {string} extension The extension of the archive.
			 */
			downloadProjectCompressed: function (files, folderName, extension) {
				sap.ui.require(["sap/ui/thirdparty/jszip"], async function (JSZip) {
					var folders = { [folderName]: new JSZip() };
					//sort files according to the hierarchy level by using sort compare function
					files.sort((memberA, memberB) => memberA.level - memberB.level);
					files.forEach(function (file) {
						if (!folders[file.folder]) {
							folders[file.folder] = folders[file.parentFolder].folder(file.folder);
						}
						if (fileUtils.isBlob(file.name)) {
							var content = file.content.split(",")[1]; // erase the base64 prefix
							folders[file.folder].file(file.name, content, { base64: true });
						} else {
							folders[file.folder].file(file.name, file.content);
						}
					});

					var blobData = folders[folderName].generate({ type: "blob" });

					fileUtils.downloadFile(blobData, folderName, extension, "application/zip");
				});
			},
			/**
			 * Lazy loads File util and saves file.
			 * @param {*} vData File content.
			 * @param {string} sFileName File name.
			 * @param {string} sFileExtension File extension.
			 * @param {string} sMimeType File mime-type.
			 */
			downloadFile: function (vData, sFileName, sFileExtension, sMimeType) {
				sap.ui.require(["sap/ui/core/util/File"], function (File) {
					File.save(vData, sFileName, sFileExtension, sMimeType);
				});
			},
			fetch: function (sUrl) {
				if (fileUtils.isBlob(sUrl)) {
					return fileUtils._fetchBlob(sUrl);
				}

				return new Promise(function (resolve, reject) {
					jQuery
						.ajax(sUrl, {
							dataType: "text"
						})
						.done(function (oData) {
							resolve(oData);
						})
						.fail(function (jqXHR, sTextStatus, sError) {
							reject(formatMessage("Error {0} {1} ({2})", [jqXHR.status, sUrl, sError]));
						});
				});
			},
			isBlob: function (sName) {
				return sName.match(/\.(jpeg|jpg|gif|png)$/) !== null;
			},

			isMD: function (sName) {
				return sName.match(/\.(md)$/) !== null;
			},

			_fetchBlob: function (sUrl) {
				return new Promise(function (resolve, reject) {
					jQuery
						.ajax(sUrl, {
							xhrFields: {
								responseType: "text" // don't use 'blob' because MockServer doesn't support it
							},
							mimeType: "text/plain; charset=x-user-defined"
						})
						.done(function (sData) {
							var sBase64EncodedData = "data:image/png; base64," + fileUtils._base64Encode(sData);

							resolve(sBase64EncodedData);
						})
						.fail(function (jqXHR, sTextStatus, sError) {
							reject(sError);
						});
				});
			},
			// Used to encode images returned as text to base64
			_base64Encode: function (sToEncode) {
				var sCHARSList = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
				var sResult = "",
					iIndex = 0,
					c1,
					c2,
					c3;
				while (iIndex < sToEncode.length) {
					c1 = sToEncode.charCodeAt(iIndex++) & 0xff;
					if (iIndex === sToEncode.length) {
						sResult += sCHARSList.charAt(c1 >> 2);
						sResult += sCHARSList.charAt((c1 & 0x3) << 4);
						sResult += "==";
						break;
					}
					c2 = sToEncode.charCodeAt(iIndex++);
					if (iIndex === sToEncode.length) {
						sResult += sCHARSList.charAt(c1 >> 2);
						sResult += sCHARSList.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
						sResult += sCHARSList.charAt((c2 & 0xf) << 2);
						sResult += "=";
						break;
					}
					c3 = sToEncode.charCodeAt(iIndex++);
					sResult += sCHARSList.charAt(c1 >> 2);
					sResult += sCHARSList.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
					sResult += sCHARSList.charAt(((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6));
					sResult += sCHARSList.charAt(c3 & 0x3f);
				}
				return sResult;
			},
			_getFilesFromIndex: function (directoryTree, files, folderName, parentFolderName, level) {
				directoryTree.children.forEach(
					function (item) {
						if (item.type === "file") {
							files.push({
								content: "",
								key: item.name,
								name: item.name,
								url: item.path,
								folder: folderName,
								parentFolder: parentFolderName,
								level: level
							});
						} else if (item.type === "directory") {
							this._getFilesFromIndex(item, files, item.name, folderName, level + 1);
						}
					}.bind(this)
				);
				return files;
			},
			_insertSourceTemplate: function (fileContent, templates, sampleName, currentVersion) {
				const sourceTemplate = templates
					.find(({ key }) => key === "sourceTemplate.txt")
					?.content.replace("##sampleName##", sampleName)
					.replace("##ui5Version##", fileUtils._getVersionWithoutSuffix(currentVersion, true))
					.replace("##toolsId##", Utils.generateUuidV4());
				return [
					fileContent.slice(0, fileContent.indexOf('"dataSources"')),
					sourceTemplate + "\n		",
					fileContent.slice(fileContent.indexOf('"dataSources"'))
				].join("");
			},
			_insertLanguageModel: function (fileContent, templates, appId) {
				if (!fileContent.slice(fileContent.indexOf('"models":')).includes("i18n")) {
					const parts = fileContent.split('"models": {'),
						i18nTemplate = templates.find(({ key }) => key === "i18nModel.txt")?.content.replace("##appId##", appId);
					return [parts[0], i18nTemplate, parts[1]].join("");
				} else {
					return fileContent;
				}
			},
			_insertlocalUri: function (fileContent, templates, serviceFolder) {
				const localUriTemplate = templates
					.find(({ key }) => key === "localUri.txt")
					?.content.toString()
					.replace("##serviceFolder##", serviceFolder);
				return [
					fileContent.slice(0, fileContent.indexOf('"odataVersion"')),
					localUriTemplate + "\n					",
					fileContent.slice(fileContent.indexOf('"odataVersion"'))
				].join("");
			},
			_getVersionWithoutSuffix: function (currentVersion, minor) {
				const version = new VersionUtil(currentVersion);
				//return major or minor version
				return minor
					? version.getMajor() + "." + version.getMinor() + "." + version.getPatch()
					: version.getMajor() + "." + version.getMinor();
			},
			_getVersionInfo: async function (fallBackUI5Version) {
				const versionInfo = await VersionInfo.load();
				//fallback version for localhost testing
				return versionInfo.version.includes("SNAPSHOT") || versionInfo.version === "1.0.0"
					? fallBackUI5Version
					: versionInfo.version;
			},
			_processCommonFiles: async function (files, templates, currentSample, serviceDefinition, fallBackUI5Version) {
				const manifestFile = files.filter((file) => file.key === "manifest.json")[0];

				//fallback version for localhost testing
				const currentVersion = await this._getVersionInfo(fallBackUI5Version),
					specialCharExcludeWSRegex = new RegExp("[^A-Za-z0-9() ]"),
					bracketsRegex = new RegExp("[\\(\\)]", "gmi"),
					commentRegex = new RegExp("(\\/\\/.+)\\s", "gmi"),
					minVersionRegex = new RegExp('"minUI5Version": (["])(?:(?=(\\.?))\\2.)*?\\1'),
					serviceUriRegex = new RegExp("(\\/sap\\/fe\\/core\\/mock\\/.*\\b)"),
					serviceUri = manifestFile.content.match(serviceUriRegex)[0],
					appIdRegex = new RegExp("(sap.fe.core.fpmExplorer.*\\b)"),
					appId = manifestFile.content.match(appIdRegex)[0],
					sampleName = currentSample.title
						.replaceAll(currentSample.title.match(specialCharExcludeWSRegex), "")
						.replaceAll(bracketsRegex, "")
						.replace(/\s/g, "");

				files.forEach((file) => {
					switch (file.key) {
						case "flpSandbox.html":
							file.content = file.content
								//remove all special characters
								.replaceAll("##sampleName##", sampleName)
								.replaceAll("##appid##", appId)
								.replaceAll(
									"##sampleTitle##",
									currentSample.topicTitle.replaceAll(currentSample.title.match(specialCharExcludeWSRegex), "")
								)
								.replaceAll(
									"##sampleDescription##",
									currentSample.topicTitle.replaceAll(currentSample.title.match(specialCharExcludeWSRegex), "")
								);
							break;
						case "manifest.json":
							//check for i18n bundle entry at beginning of models section
							file.content = fileUtils._insertLanguageModel(file.content, templates, appId);
							//insert sourceTemplate
							file.content = fileUtils._insertSourceTemplate(file.content, templates, sampleName, currentVersion);
							//insert local metadata uri path
							file.content = fileUtils._insertlocalUri(file.content, templates, serviceDefinition.folder);
							//set current UI5 version as minVersion
							file.content = file.content.replace(
								minVersionRegex,
								'"minUI5Version": "' + fileUtils._getVersionWithoutSuffix(currentVersion, true) + '"'
							);
							//pretty print manifest.json
							file.content = JSON.parse(JSON.stringify(file.content, null, "\t"));
							break;
						case "Component.js":
							file.content = file.content.replaceAll("##appid##", appId);
							if (currentSample.hash && currentSample.hash.split("/").length === 2) {
								file.content = file.content
									//uncomment hash changer code block
									.replace("//##hashChanger##", "")
									.replaceAll("//", "")
									//match route part of the hash
									.replaceAll(
										"##hash##",
										currentSample.hash.includes(sampleName)
											? currentSample.hash
											: "#" + sampleName + "-Sample?&" + currentSample.hash
									);
							} else {
								//remove whole hash changer code block
								file.content = file.content.replace("//##hashChanger##", "\n").replaceAll(commentRegex, "");
							}
							break;
						case "ui5.yaml":
							file.content = file.content
								.replaceAll("##appid##", appId)
								.replaceAll("##urlPath##", serviceUri)
								.replaceAll("##serviceFolderName##", serviceDefinition.folder);
							break;
						case "package.json":
							file.content = file.content
								.replaceAll("##sampleKey##", currentSample.key.toLowerCase())
								//replace with current major version info for matching @sap/ux-specification
								.replace("##ui5version##", fileUtils._getVersionWithoutSuffix(currentVersion, false))
								.replaceAll("##serviceFolderName##", serviceDefinition.folder)
								.replaceAll("##sampleName##", sampleName);
							break;
						case "README.md":
							file.content = file.content
								//remove all special characters except spaces
								.replaceAll("##sampleTitle##", currentSample.topicTitle)
								.replace("##currentYear##", UI5Date.getInstance().getFullYear().toString());
							break;
						default:
							break;
					}
				});
				return files;
			}
		};

		return fileUtils;
	}
);
