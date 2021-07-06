const sdk = require("./sdk");
// Create a handler to capture event body of incoming request
exports.handler = async (event) => {
  try {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "HTTP method not allowed" };
    }
    // Parse the event body
    const body = JSON.parse(event.body);
    // Only accept requests with all parameters
    if (!body.loadId || !body.x || !body.y) {
      return { statusCode: 400, body: "Request is missing one or more parameters" };
    }
    let robot = await findRobot(body.x, body.y);
    if (!robot) {
      return { statusCode: 204, body: "No available robots to fulfil request" };
    }
    console.log("Best available robot", robot);
    // Return success
    return { statusCode: 200, body: JSON.stringify(robot) };
  } catch (err) {
    // Catch unexpected errors within try block and return failure
    console.error("Encountered an unexpected error:", err);
    return { statusCode: 500, body: "Unexpected error handling request. Please try again." };
  }
};

const findRobot = async (x, y) => {
  // fetch list of available robots
  let robots = await sdk.fetchAvailableRobots();
  // Enrich the list of robots with the distance to the request's xy-coordinate
  robots = sdk.enrichRobotList(robots, x, y);
  // Sort the list of enriched robots by closest distance to the xy-coordinate
  sdk.sortByDistance(robots);
  // Check for robots available within 10 units of distance
  let closestRobots = sdk.filterByDistance(robots, 10);
  console.log("closest robots:", closestRobots);
  // If there are multiple robots within 10 units of distance, return the robot with the most battery
  if (!closestRobots || closestRobots.length > 1) return sdk.sortByBattery(closestRobots)[0];
  // Otherwise, return the closest robot
  else return closestRobots[0];
};
