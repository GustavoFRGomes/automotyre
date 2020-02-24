###Gen Keystore

Gen Keystore is a script to generate keystores for Android through the keytool command line interface.

The CLI scrip will accept as parameters the length of the passwords, the export file directory and the alias for the key. It'll then generate the password with the appropriate length, create the keystore and the key inside the keystore and then export it and the credentials file to the export directory.