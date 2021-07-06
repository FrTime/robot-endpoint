const fetch = require("node-fetch");

/** Structure of a 'robot' object as returned from the mock API endpoint
 *
 * @typedef {Object} Robot
 * @property {string} robotId - The ID of the robot
 * @property {number} batteryLevel - The current battery level of the robot
 * @property {number} x - The X coordinate of the robot
 * @property {number} y - The Y coordinate of the robot
 */

/** Structure of an enriched 'robot' object after calculating the distance from a point
 *
 * @typedef {Object} EnrichedRobot
 * @property {string} robotId - The ID of the robot
 * @property {number} batteryLevel - The current battery level of the robot
 * @property {number} x - The X coordinate of the robot
 * @property {number} y - The Y coordinate of the robot
 * @property {number} distance - The unit-less distance from a point on the same XY-plane
 */

/** Fetches an array of available robots from a mock API endpoint
 *
 * @returns {Array.<Robot>} An array of available robots in the format of [{ robotId: '1', batteryLevel: 99, y: 92, x: 48 }, ...]
 */
async function fetchAvailableRobots() {
  try {
    return await fetch("https://svtrobotics.free.beeceptor.com/robots", {
      httpMethod: "GET",
    })
      .then((res) => res.json())
      .then((json) => json);
  } catch (err) {
    throw new Error("Error retrieving robots:", err);
  }
}

/** Calculates the distance between two points on an XY-plane
 *
 * @param {number} x1 - The X coordinate of the first point
 * @param {number} y1 - The Y coordinate of the first point
 * @param {number} x2 - The X coordinate of the second point
 * @param {number} y2 - The Y coordinate of the second point
 * @returns {number} The unit-less distance between two points
 */
function calculateDistance(x1, y1, x2, y2) {
  try {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  } catch (err) {
    throw new Error("Error calculating distance from robots:", err);
  }
}

/** Returns an enriched array of robots that includes the distance of each robot from a point on the same XY-plane
 *
 * @param {Array.<Robot>} robots - An array of 'robot' objects
 * @returns {Array.<EnrichedRobot>} An array of available robots, including distance, in the format of [{ robotId: '1', batteryLevel: 99, y: 92, x: 48, distance: 22 }, ...]
 */
function enrichRobotList(robots, x, y) {
  try {
    let enrichedRobots = [...robots];
    enrichedRobots.map((robot) => (robot.distance = calculateDistance(x, y, robot.x, robot.y)));
    return enrichedRobots;
  } catch (err) {
    throw new Error("Error enriching list of robots:", err);
  }
}

// Create a handler to capture event body of incoming request
exports.handler = async (event) => {
  try {
    // Only allow POST requests
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "HTTP method not allowed" };
    // Parse the event body
    const body = JSON.parse(event.body);
    // Only accept requests with all parameters
    if (!body.loadId || !body.x || !body.y)
      return { statusCode: 400, body: "Request is missing one or more parameters" };
    let robots = await fetchAvailableRobots();
    console.log("Available robots:", robots);
    robots = enrichRobotList(robots, body.x, body.y);
    console.log("Available robots with distance:", robots);
    // Return success
    return { statusCode: 200, body: "Hello world" };
  } catch (err) {
    // Catch unexpected errors within try block and return failure
    console.error("Encountered an unexpected error:", err);
    return { statusCode: 500, body: "Unexpected error handling request. Please try again." };
  }
};
