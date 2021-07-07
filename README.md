<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/frtime/robot-endpoint"> 🤖 </a>
  <h3 align="center">Robot Endpoint</h3>

  <p align="center">
    A simple POST endpoint that will retrieve a list of available robots and determine which robot is the best fit based on distance and battery level.
    <br />
    <br />
  </p>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#running-locally">Running Locally</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About The Project

When a valid request is sent, the endpoint makes an external API call to fetch a list of 100 available robots. It retrieves the robot's ID, X and Y coordinates, and its battery level. The endpoint calculates the distance between the requested coordinates and the coordinates of each robot to determine which is the closest. If multiple robots are available within a short range, the endpoint will provide the robot that has the highest level of battery (robots with no battery are excluded). The endpoint then returns the best robot as a JSON object.

### Built With

- [node.js](https://nodejs.dev)
- [netlify](https://www.netlify.com)
- .NET Core to be implemented

## Getting Started

In order to run the project locally, a few prerequisites are needed.

### Prerequisites

Ensure that NPM is installed and updated to the latest version. Then install Netlify's CLI which will be used to run the project.

- npm
  ```sh
  npm install npm@latest -g
  ```
- netlify-cli
  ```sh
  npm install netlify-cli -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/frtime/robot-endpoint.git
   ```
2. Install NPM packages
   ```sh
   cd robot-endpoint
   npm i
   ```

### Running Locally

1. Ensure that the Netlify CLI is installed

   ```sh
   ntl version

   ❯ netlify-cli/4.1.4 darwin-arm64 node-v15.14.0
   ```

2. Run the Netlify development server

   ```sh
   ntl dev

   ❯ ...
   ❯ Server now ready on http://localhost:8888
   ```

<!-- USAGE EXAMPLES -->

## Usage

This project is currently deployed and `POST` requests can be sent directly to api.tjmace.com/.netlify/functions/v1-move. If you are running the project locally, requests can be sent to `localhost:8888/.netlify/functions/v1-move` (verify the local port before proceeding).

The endpoint takes in three required parameters as a JSON object:

1. `loadID` - (string) The ID of a load you wish to be moved
2. `x` - (integer) The X coordinate of the load to move
3. `y` - (integer) The Y coordinate of the load to move

Here is an example request:

```
{
  "loadId": 231,
  "x": 5,
  "y": 3
}
```

Using Postman, or similar API client such as Insomnia, send a `POST` request to the endpoint using the example request above.

<p align="center">
<img src="https://i.imgur.com/34d0c0a.png" alt="Logo" width="600">
</p>

## Roadmap

The aim of this project is to first create a working endpoint written in Node.js before replicating the functionality in .NET (a new language for me). At this time, the Node portion of the project is completed and deployed. The next steps are to research setting up an API using .NET and begin building a working endpoint that can be run locally.

## License

Distributed under the MIT License. Have at it. See `LICENSE` for more information.

## Contact

Tim Mace - timothymace2@gmail.com

Project Link: [https://github.com/frtime/robot-endpoint](https://github.com/frtime/robot-endpoint)
