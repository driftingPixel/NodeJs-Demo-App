# NodeJs Demo App

Small project in nodeJs

###Technology stack
NodeJs, Typescript, Express, mongoDB + Mongoose, JWT

###Test app
https://nodejs-demo-app-rg.herokuapp.com/

###Description
Simple RESTFull api, wrapper for ipstack.com

###API Endpoints

#### /login

-   <strong>POST</strong>
    Logging in to get a JWT token.
    <strong> Request format: </strong>
    ```
    {
        "email": "email@domain.com",
        "password": "password"
    }
    ```
    <strong> Response format: </strong>
    ```
    {
        "status": "OK",
        "authtoken": "JWT Token"
    }
    ```

#### /ipgeo

-   <strong>GET</strong>
    Check api state.
-   <strong>POST</strong>
    Save new address to db.
    <strong> Request format: </strong>

    ```
    {
        "address": "address or ip",
    }
    ```

    <strong> Response format: </strong>

    ```
    {
        "status":"OK",
        "data":{
            {If document has been saved in db,
            ducument data is return here}
        }
    ```

-   <strong>PUT</strong>
    Save address to db, rewrite data if exist
    <strong> Request format: </strong>
    ```
    {
        "address": "address or ip",
    }
    ```
    <strong> Response format: </strong>
    ```
    {
        "status":"OK",
        "data":{
            "result":"result of request"
        }
    }
    ```

####/ipgeo/:address

-   <strong>GET</strong>
    <strong> Response format: </strong>
    ```
    {
        "status":"OK",
        "data":{
            {If document for specific address exist in db,
            ducument data is return here}
        }
    }
    ```
-   <strong>DELETE</strong>
    Delete docuemnt from db, if exist for specific address or ip.
    ```
    {
        "status":"OK",
        "data":{
            {
                "result":"Item deleted"
            }
        }
    }
    ```
-   <strong>PUT</strong>
    Update part of data in db, for specific addres or ip
    <strong> Request example: </strong>
    ```
    {
        "regionCode": "DOL",
        "city": "Wrocław"
    }
    ```
    <strong> Response format: </strong>
    ```
    {
        "status":"OK",
        "data":
        {
            "result":{Data from db, after udpate}
        }
    }
    ```

### Installation

#### Setup Scripts

-   Clone the repository into a folder
-   Go inside the folder and run following command from terminal/command prompt

```
npm install
```

All the dependencies from package.json and typescript typings would be installed in node_modules folder.

#### Developing/Debug mode

For start app in debug mode:

```
npm run debug
```

For start app in debug mode in watch mode (nodemon)

```
npm run debug:watch
```

#### Other npm scipts

```
npm run build - build app to .dist folder
npm run lint - lint project by eslint
npm start - start builded version
```

### Authorisation

App use authorisation by JWT token from </strong> node jsonwebtoken</strong> library with expparation time.
//TODO change hardcoded credentials and add sign up endpoint.
####Signing request
Request must be signing by token in request <strong>Autorization</strong> Header.
