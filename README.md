# DecisionHub

A Rule Builder application “Decision Hub” that empowers Business Analysts to create, save, and visualize decision strategies. Provide a no-code rule writing experience and visual representation to test these rules in real-time and observe the calculations at each step.

#### Web Link: https://decisionhub.netlify.app/

| Login Credentials |
| ----------------- |
| Email :           |
| Password :        |

| Login                                                                                                         |
| ------------------------------------------------------------------------------------------------------------- |
| ![Login_Image](https://github.com/rishavchanda/Trackify/assets/64485885/b8aae2e1-cb85-4d37-93f8-ca95e8141367) |

|SignUp
|--|
|![SignUp_Image]()

| Dashboard                                                                                                 |
| --------------------------------------------------------------------------------------------------------- |
| ![Image 3](https://github.com/rishavchanda/Trackify/assets/64485885/e1f89b04-2788-45b0-abc2-9dec616669e2) |
| ![Image 4](https://github.com/rishavchanda/Trackify/assets/64485885/27fce475-a52f-4f1f-91f4-228a5a4b08ab) |
| ![Image 5](https://github.com/rishavchanda/Trackify/assets/64485885/39f9083d-61cb-462d-ba85-040679f598b3) |
| ![Image 6](https://github.com/rishavchanda/Trackify/assets/64485885/80df62ef-02f0-4edc-8019-666a29a26a7c) |
| ![Image 7](https://github.com/rishavchanda/Trackify/assets/64485885/d9dd8674-6bc0-4e8a-a9fd-46fb721a4e62) |
| ![Image 8](https://github.com/rishavchanda/Trackify/assets/64485885/c951188e-20d4-4ce8-98ce-8c11f4dd507e) |
| ![Image 9](https://github.com/rishavchanda/Trackify/assets/64485885/abcf8e67-27ac-4691-a856-b76b3ae3e9db) |

| Rules |
| ----- |

| Debug / Test Rules |
| ------------------ |

| Profile |
| ------- |

## Features

- User Authentication:
  - Users can login to the service using their emails or using Google Accounts
- Rules Management:
  - Add Rules : Users can create rules for more than one database, including rule description, input attributes, output attributes
  - Create Conditions : Users can either create conditions or generate one using AI for a rule
  - Versions : Users can store multiple versions of a rule
- Debug and Testing
  - Debug & Testing : User can debug and test rule with various input to get the desired result.
- Graphical Information:
  - Tree : A tree like rule creation such that, visualisation of rules is easier

## Getting Started

### Pre-requisites

1. Install [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/).
2. Create a [Render](https://dashboard.render.com/) account and set up a new PostgreSQL database.

### Clone the repository

1. Clone the repository: `git clone https://github.com/rishavchanda/DecisionHub.git`

### Configure the client

1. Navigate to client folder: `cd client`
2. Build the docker image for the client in dev mode: `docker build -f Dockerfile.dev -t trackify-react-image .`
3. Set up and configure the environment variables, create a `.env` file in the client folder and add the following environment variables:

```
REACT_APP_API_URL = http://localhost:8800/api
```

### Configure the server

1. Navigate to server folder: `cd server`
2. Build the docker image for the server in dev mode: `docker build -f Dockerfile.dev -t trackify-server-image .`
3. Set up the database and configure the environment variables by following the instructions in the next steps.

### Set up the database

1. Create a Render Account and Create new PostgreSQL database
2. Create a `.env` file in the server folder and add the following environment variables:

```
PORT= <port_to_run_node_server>
DATABASE_URL= <postgres_connection_string>
JWT= <JWT_token>
EMAIL_USERNAME= <decision_hub_gmail_username>
EMAIL_PASSWORD= <decision_hub_gmail_password>
OPENAI_API_KEY= <openai_api_key>
```

### Run the application

1. Navigate to the root folder: `cd ..`
2. Run the docker-compose file: `docker-compose -f docker-compose.yml -f docker-compose-dev.yml  up --build`
3. Open the application in your browser at `http://localhost:3000`
4. Server will be running at `http://localhost:8800`
5. To stop the application, press `Ctrl + C` in the terminal.

## Technologies Used

- Front-End: React.js, HTML, CSS, JavaScript, Redux, React Flow
- Back-End: Node.js, Express.js, JWT
- Database: PostgreSQL

## Contributing

We welcome contributions from the community to enhance DecisionHub. Feel free to submit bug reports, feature requests, or pull requests through the GitHub repository.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Contact

For any questions or inquiries, please reach out to the development team at [DecisionHub](mailto:decisionhub629@gmail.com)

Enjoy using DecisionHub and stay productive!
