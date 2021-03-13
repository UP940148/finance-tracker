# Budgeting for Students App

## About This Repository
This repository is set up for managing the development of T44's SETAP coursework

## Initialising
Once this repository has been cloned, you will need to install all the required dependencies by running the following in the command line

```cmd
npm install
```

Then the application can be launched using
```cmd
npm start
```

Providing the app has launched successfully, you should have some messages in the console like these
```cmd
1 routines are preventing sleep!
Your computer will stay awake whilst this process is running

Server running on port XXXX!
```
The application can then be accessed by directing your browser to `localhost:XXXX` where `XXXX` is the port number specified in the messages above (Defaults to port 8080)


## Evaluation

### Limitations

- `.qif` File Limitations
  - .qif files don't have a standard date format, and they don't have any record that states what format will be used throughout the current file. After testing some popular banks (Monzo, HSBC, and Lloyds) we discovered they all stored dates as `DD/MM/YYYY`. For the scope of this project, we've only accounted for dates being stored in this format, however if the project expands, this issue will need to be looked into.
  - We are using the `qif2json` module to translate .qif files into database records. This package only accepts the following detail codes: _D, T, U, N, M, A, P, L, C, S, E, $_. Uniquely, _U_ is accepted, however it is seen as a legacy version of _T_, and is therefore ignored. This means that 21/33 detail codes cannot be processed by our application. However, this application acts primarily as a finance manager for students, and the 21 discounted detail codes cover more complex financial management such as investment. Therefore we consider this to be an acceptable limitation. We will however be looking into this and potentially creating our own library to convert the files to database records, if we feel a need to.
  - .qif files allow a number of account types to be defined in the header line. In this project we will be treating all account types in the same way (Subject to change if we feel it's necessary)
