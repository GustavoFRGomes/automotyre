#!/usr/bin/env node

const program = require('commander')
const fs = require('fs')
const { exec } = require("child_process");

program
    .option('-e, --export [destination]', 'Path to export the keystore and credentials file to.', './')
    .requiredOption('-k, --key-alias <value>', 'Alias for the key in the keystore')
    .option('-p, --password-length <value>', 'The length of the passwords to be generated for the keystore, and the key itself.', 12)

const generatePassword = (length) => {
    const characters          = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const totalAvailableChars = characters.length;
    
    let result = '';
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * totalAvailableChars));
    }
    return result;
}

const createKeystore = (keyAlias, storePassword, keyPassword) => {
    const keystoreGenCommand = `keytool -genkey -v -keystore keystore.keystore -alias ${keyAlias} -keyalg RSA -keysize 2048 -validity 100 -storepass ${storePassword} -keypass ${keyPassword}`

    console.log(keystoreGenCommand + "   <<<<<<<<<")

    exec(keystoreGenCommand, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}

const exportCredentials = (keyAlias, storePassword, keyPassword) => {
    const exportingString = `Store Password: ${storePassword} \nKey Alias: ${keyAlias} \nKey Password: ${keyPassword}`
    fs.writeFileSync("./keystore_details.txt", exportingString)
}

const main = (program) => {
    // TODO: Validate that the -e flag is not a file and indeed a directory
    if (!fs.lstatSync(program.export).isDirectory()) {
        console.log(`Path supplied in -e is ${program.export} and that is not a directory.`)
        process.exit()
    }

    // TODO: Validate that the -a alias is not an empty string
    if (program.keyAlias === "" || program.keyAlias === undefined || program.keyAlias === null) {
        console.log(`Alias supplied must not be an empty string!`)
        process.exit()
    }
    // TODO: Validate that the password length, if supplied is a number and bigger then 0
    if (isNaN(program.passwordLength) || +program.passwordLength <= 0) {
        console.log(`Password length of ${program.passwordLength} is either not a number or smaller than 1.`)
        process.exit()
    }

    const storePassword = generatePassword(program.passwordLength)
    const keyPassword = generatePassword(program.passwordLength)

    createKeystore(program.keyAlias, storePassword, keyPassword)

    exportCredentials(program.keyAlias, storePassword, keyPassword)
}

program.parse(process.argv)

main(program)