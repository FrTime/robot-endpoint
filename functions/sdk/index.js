const fetch = require("node-fetch");

var sdk = {
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
  fetchAvailableRobots: async function () {
    try {
      return await fetch("https://svtrobotics.free.beeceptor.com/robots", {
        httpMethod: "GET",
      })
        .then((res) => res.json())
        .then((json) => json);
    } catch (err) {
      throw new Error("Error retrieving robots:", err);
    }
  },

  /** Calculates the distance between two points on an XY-plane
   *
   * @param {number} x1 - The X coordinate of the first point
   * @param {number} y1 - The Y coordinate of the first point
   * @param {number} x2 - The X coordinate of the second point
   * @param {number} y2 - The Y coordinate of the second point
   * @returns {number} The unit-less distance between two points
   */
  calculateDistance: function (x1, y1, x2, y2) {
    try {
      // Calculating distance, then rounding to 3 significant figures based on available data retrieved
      return Math.round(Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)), 3);
    } catch (err) {
      throw new Error("Error calculating distance from robots:", err);
    }
  },

  /** Returns an enriched array of robots that includes the distance of each robot from a point on the same XY-plane
   *
   * @param {Array.<Robot>} robots - An array of 'robot' objects
   * @param {number} x - The X coordinate of the point
   * @param {number} y - The Y coordinate of the point
   * @returns {Array.<EnrichedRobot>} An array of available robots, including distance, in the format of [{ robotId: '1', batteryLevel: 99, y: 92, x: 48, distance: 22 }, ...]
   */
  enrichRobotList: function (robots, x, y) {
    try {
      let enrichedRobots = [...robots];
      console.log("enriched boiz:", enrichedRobots);
      enrichedRobots.map((robot) => {
        console.log(robot, x, y);
        console.log(this.calculateDistance(x, y, robot.x, robot.y));
        return (robot.distance = this.calculateDistance(x, y, robot.x, robot.y));
      });
      return enrichedRobots;
    } catch (err) {
      throw new Error("Error enriching list of robots:", err);
    }
  },

  /** Sorts an array of enriched robots by the lowest calculated distance to a point
   *
   * @param {Array.<EnrichedRobot>} robots - An array of enriched 'robot' objects
   * @returns {Array.<EnrichedRobot>} An array of sorted enriched robots in the format of [{ robotId: '1', batteryLevel: 99, y: 92, x: 48, distance: 22 }, ...]
   */
  sortByDistance: function (enrichedRobots) {
    try {
      enrichedRobots.sort(function (a, b) {
        return a.distance - b.distance;
      });
    } catch (err) {
      throw new Error("Error sorting list of robots by distance:", err);
    }
  },

  /** Sorts an array of robots by the highest battery level
   *
   * @param {Array.<Robot> | Array.<EnrichedRobot>} robots - An array of 'robot' objects
   * @returns {Array.<Robot> | Array.<EnrichedRobot>} An array of robots sorted by highest battery level
   */
  sortByBattery: function (robots) {
    try {
      robots.sort(function (a, b) {
        return b.batteryLevel - a.batteryLevel;
      });
      console.log("sorted by battery:", robots);
    } catch (err) {
      throw new Error("Error sorting list of robots by battery level:", err);
    }
  },

  /** Filters and returns a new array of robots within the given distance
   *
   * @param {Array.<EnrichedRobot>} robots - An array of enriched 'robot' objects
   * @param {number} distance - The distance to filter by
   * @returns {Array.<EnrichedRobot>} An array of filtered enriched robots in the format of [{ robotId: '1', batteryLevel: 99, y: 92, x: 48, distance: 22 }, ...]
   */
  filterByDistance: function (enrichedRobots, distance) {
    try {
      return [...enrichedRobots].filter((robot) => robot.distance <= distance);
    } catch (err) {
      throw new Error("Error filtering list of robots by distance:", err);
    }
  },

  /**
   *
   * @param {number} x - The X coordinate of a point
   * @param {number} y - The Y coordinate of a point
   * @param {number} withinDistance - Prioritize robots within this distance by the highest battery level rather than distance
   * @returns {Robot | EnrichedRobot} The closest available 'robot' object based on 
   */
  findRobot: async function (x, y, withinDistance) {
    // fetch list of available robots
    let robots = await this.fetchAvailableRobots();
    // Enrich the list of robots with the distance to the request's xy-coordinate
    robots = this.enrichRobotList(robots, x, y);
    // Sort the list of enriched robots by closest distance to the xy-coordinate
    this.sortByDistance(robots);
    // Check for robots available within 10 units of distance
    let closestRobots = this.filterByDistance(robots, withinDistance);
    console.log("closest robots:", closestRobots);
    // If there are multiple robots within the given units of distance, return the robot with the most battery
    if (!closestRobots || closestRobots.length > 1) return this.sortByBattery(closestRobots)[0];
    // Otherwise, return the closest robot
    else return closestRobots[0];
  },
};

module.exports = sdk;
