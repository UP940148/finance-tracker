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

## `.qif` File

Quicken Interchange Format uses reserved characters for the start of each new line in the file

- `D` - Date in form `DD/MM/YYYY`
- `T` - Amount. +ve value for money in, -ve value for money out
- `M` - Memo (Transaction note)
- `A` - Address. Each subsequent line starting with A represents a new line in the address
- `P` - Payee
- `L` - Category in the form `LCategory:Subcategory`
- `^` - End of transaction

## API Routes

### HTTP response status codes

Code definitions taken from https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

- `200` - The request has succeeded
- `201` - The request has succeeded and the new resource has been created
- `204` - There is no content to send for this request, but the headers may be useful
- `400` - Something went wrong
- `401` - Unauthorized
- `404` - The requested resource could not be found

### User Routes

- POST `<root>/user/` - Create a new record for a user
  - JSON body is made up of `googleId (int)`, `name (text)`, and `email (text)`
  - Returns no JSON data
- GET `<root>/users/` - Retrieves a list of all users in database
  - Takes no body or parameters
  - If successful, JSON data contains a list of all user records
- GET `<root>/user/:googleId/` - Retrieves the user record associated with the provided id
  - Takes `googleId (int)` as a parameter
  - If successful, JSON data contains the requested record
- PATCH `<root>/user/:googleId/` - Updates the user record associated with the provided id
  - Takes `googleId (int)` as a parameter and `name (text)`, and `email (text)` in the JSON body
  - Returns no JSON data
- DELETE `<root>/user/:googleId/` - Deletes the user record associated with the provided id
  - Takes `googleId (int)` as a parameter
  - Returns no JSON data

### Transaction Routes

- POST `<root>/transaction/`
- GET `<root>/transactions/`
- GET `<root>/transaction/:transactionId/`
- GET `<root>/user/:userId/transactions/`
- GET `<root>/user/:userId/transactions/:startDate/:endDate/`
- PATCH `<root>/transaction/:transactionId/`
- DELETE `<root>/transaction/:transactionId`

## Evaluation

### Limitations

- `.qif` File Limitations
  - .qif files don't have a standard date format, and they don't have any record that states what format will be used throughout the current file. After testing some popular banks (Monzo, HSBC, and Lloyds) we discovered they all stored dates as `DD/MM/YYYY`. For the scope of this project, we've only accounted for dates being stored in this format, however if the project expands, this issue will need to be looked into.
  - We are using the `qif2json` module to translate .qif files into database records. This package only accepts the following detail codes: _D, T, U, N, M, A, P, L, C, S, E, $_. Uniquely, _U_ is accepted, however it is seen as a legacy version of _T_, and is therefore ignored. This means that 21/33 detail codes cannot be processed by our application. However, this application acts primarily as a finance manager for students, and the 21 discounted detail codes cover more complex financial management such as investment. Therefore we consider this to be an acceptable limitation. We will however be looking into this and potentially creating our own library to convert the files to database records, if we feel a need to.
  - .qif files allow a number of account types to be defined in the header line. In this project we will be treating all account types in the same way (Subject to change if we feel it's necessary)


- Resource limitations
  - In the `saving-tips.html` content, we provide links to external websites and with them we have the company/website logo. These logos are stored in `www/images/saving-tips/` as static files, which could be an issue if the application was publicly deployed as we would be serving copyrighted resources. For the scope of this coursework, this doesn't pose an issue, however the possibility of dynamically fetching the logos through the server API was considered by using the `get-website-favicon` package to take a website URL and return the URL of the website's favicon, then using `res.redirect(...)` to send the favicon file to the client. However not all websites have a favicon, such as Student Beans. For this reason, the concept in it's current state was put on hold indefinitely.
