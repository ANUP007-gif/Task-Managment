#  Node JS API

## Prerequisites

- Node.js installed on your machine.
- MySQL database installed and running.

## Install dependencies:

- npm install

## Database Configuration:

- Create a MySQL database.
- Update the database configuration in .env file with your database credentials.

## Run Migrations:

- Uncomment the // Task.sync({alter:true}) to add table in db



## Start the Application:

- npm start OR npm run dev


Project Documentation

-The project is about Task Managment.

1- Create task

URL - http://localhost:7000/api/task
Method - POST


The api is to add Task

1- change position 

http://localhost:7000/api/task/changePosition/5


This APi will change the task by given position and all other task will be also moved in a sorted manner.


3 - Change Task Status

http://localhost:7000/api/task/7


4 http://localhost:7000/api/task?page=1&limit=10&filterKey=status&filterValue=in-progress&sortby=0&sortwith=createdAt

Get All Task consist of the dynamic filter like you can filter the data with differnt status you can also do pagination and dynamic sorting in this.


5 - http://localhost:7000/api/task/2

Get Task and delete the task