# mk-it-entry

Edit: Added scripts for easy-install-and-run

In main directory:
```
yarn install-all
```
After installation is complete:
```
yarn start
```

### Dont forget!
To include a .env file in the backend directory with:

```
MONGO_URI=<YOUR_MONGODB_URI>
TOKEN_SECRET=<YOUR_SECRET>
```

## FRONTEND

This is a [Next.js](https://nextjs.org/) project (Part1).

## Getting Started

Go to directory:
```
cd frontend
```

Install dependencies using:

```
yarn install
```


Then, run server using:
```
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.



## BACKEND:
 
This is an Express.js Backend project (Part2).

## Getting Started

Go to directory:
```
cd backend
```

Install dependencies using:

```
yarn install
```

Then, you need to create a .env file with:
```
MONGO_URI=<YOUR_MONGODB_URI>
TOKEN_SECRET=<YOUR_SECRET>
```

^This is needed for database usage (users and stuff), and authentication (JWT)

Then, run server using:
```
yarn dev
```

API Calls are made on [http://localhost:4000/api/](http://localhost:4000/api/)

