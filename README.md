# Food Delivery App Backend : 
This is the Restaurant Service of a microservices-based food delivery application. It handles all restaurant-related operations including managing menus, processing orders, and coordinating with the delivery system.

## Prerequisites
1. MongoDB running locally or on Atlas and its URL
2. Nodejs installed locally ([How to install NodeJS ?](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs))


## Setup
### Local Nodejs Instance
1. Clone the repository using ```git clone https://github.com/Avinendra08/FoodDelivery_Backend.git``` and navigate to the folder.
2. Create a ```.env``` file in root folder
   
   ``` bash
   touch .env
   ```
3. Enter the following details in the ```.env``` file

   ``` bash
   MONGODB_URI = YOUR_MONGO_URL
   PORT = 3005
   ACCESS_TOKEN_SECRET= your_secret
   ACCESS_TOKEN_EXPIRY= 1d
   
4. Open the terminal in the root folder and run the following commands :

   ``` bash
   npm install
   ```
5. Run the server in Dev mode using
    ``` bash
    npm run dev
    ```
    or use command
   ``` bash
    npm start
   ``` 
6. Once this is done, the server is up and runnning at port 8000

   ``` bash
    MongoDB connected !! DB HOST: ac-bs304xl-shard-00-02.xjq15on.mongodb.net
   ⚙️ Server is running at port : 3005
   ```
   

## Architecture
### Tech Stack
- Backend - **NodeJS**

  Node.js is used for making the backend as it is developer friendly and allows use to build scalable application at ease.
- Database - **MongoDB**

  MongoDB is as it provides complete flexibility over schema and facilitates faster & accessible development with help of its cloud clusters.
  It can also cater to handle large data and it read/write using various features like indexes.


## API Endpoints
You can use any of the below for testing by just attaching endpoints as the end: 
   
   (if you use deployed link,  there is no need to setup env, just go ahead with endpoints)
   1) http://localhost:3005/api
   2) https://fooddelivery-backend-d6nw.onrender.com/api (deployed link)
## User Service
1) User Register

   Endpoint: /users/register

   Method: POST

   Description: Register a new user.

   Request: Request body must contain all required fields. (Refer Postman collection)


2) User Login
   
   Endpoint: /users/login

   Method: POST

   Description: Log in an existing user and receive JWT token.

   Request: Request body must contain valid credentials.


3) Get Available Restaurants

   Endpoint: /users/getAllRestaurants

   Method: GET

   Description: Get all restaurants available at current time in a given city.

   Auth Required:  Yes (JWT) access token as bearer token in authorization.

   Request: Query parameter city is required.

   Example:
    GET https://fooddelivery-backend-d6nw.onrender.com/api/users/getAllRestaurants?city=varanasi
   
    GET http://localhost:3005/api/users/getAllRestaurants?city=varanasi


4) Place Order

   Endpoint: /users/placeOrder

   Method: POST

   Description: Place a new order with selected food items.

   Auth Required: Yes (JWT) access token as bearer token in authorization.

   Request: Request body includes restaurant ID, food items, total price, etc.


5) Get All Orders by User

    Endpoint: /users/getAllOrdersByUserId

    Method: GET

    Description: Fetch all orders placed by the currently logged-in user.

    Auth Required:  Yes (JWT) access token as bearer token in authorization.


6) Rate Order
   
    Endpoint: /users/rateorder/:orderId

    Method: PATCH

    Description: Rate an order after it is delivered.

    Auth Required: Yes (JWT) access token as bearer token in authorization.

    Request: Send restaurant and delivery rating in the request body and order id as params.


## Restaurant Service
1) Add Restaurant

   Endpoint: /restaurants/addRestaurant

   Method: POST

   Description: Create a new restaurant with available hours and menu items.

   Request: Request body must include name, city, state, phone number, availability hours, etc. (Refer Postman collection)


2) Add Foods to Menu
   
   Endpoint: /restaurants/addFoods/:id

   Method: POST

   Description: Add multiple food items to a restaurant's menu in bulk.

   Request: Request body must contain restaurant ID in URL and array of food items in the body.



3) Update Menu Items

   Endpoint: /restaurants/updateMenuItems/:id

   Method: PATCH

   Description: Bulk update food items like price, description, and stock status.

   Request: Pass restaurant ID in URL and food updates in the body.


4) Toggle Restaurant Availability

   Endpoint: /restaurants/toggle-availability/:id

   Method: PATCH

   Description: Toggle the isAvailable status of a restaurant.

   Request: Restaurant ID in URL.


5) Handle Order (Accept/Reject) and assign Delivery agent

    Endpoint: /restaurants/handleOrder/:orderId

    Method: PATCH

    Description: Accept or reject an incoming order. If accepted, it will auto-assign a delivery agent.

    Request : Body must include { status: "accepted" | "rejected" }


## Delivery Service
1) Create Delivery Agent

   Endpoint: /delivery/createDeliveryAgent

   Method: POST

   Description: Add a new delivery agent to the system.

   Request: Provide name, phone number, and default availability status. (Refer Postman collection)


2) Get Available Delivery Agents
   
   Endpoint: /delivery/getAvailableDeliveryAgents

   Method: GET

   Description: Fetch a list of delivery agents who are currently available for delivery.


3) Toggle Delivery Agent Availability

   Endpoint: /delivery/toggleDeliveryAgentAvailability/:id

   Method: PATCH

   Description: Toggle availability of a delivery agent (available/unavailable).


   Request: Agent ID in URL.



4) Handle Order Delivery

    Endpoint: /delivery/handleOrderDelivery/:orderId

    Method: PATCH

    Description: Update delivery status of a given order (delivered).

    Request : Status value in request body.
