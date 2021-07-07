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
    let robot = await sdk.findRobot(body.x, body.y, 10);
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
