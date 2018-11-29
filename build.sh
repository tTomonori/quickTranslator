electron-packager ./ quickTranslator --platform=darwin --icon=image/icon.icns
rm -r quickTranslator-darwin-x64/quickTranslator.app/Contents/Resources/app/node_modules
cp -r node_modules quickTranslator-darwin-x64/quickTranslator.app/Contents/Resources/app/node_modules
