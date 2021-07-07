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
      // 
      return await fetch("https://svtrobotics.free.beeceptor.com/robots", {
        httpMethod: "GET",
      })
        .then((res) => res.json())
        .then((json) => json);
      // If the mock API is down, you can use the following line to populate a hardcoded list of robots:
      // return this.robotList;
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
      enrichedRobots.map((robot) => {
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
    // If there are multiple robots within the given units of distance, sort by the most battery
    if (!closestRobots || closestRobots.length > 1) this.sortByBattery(closestRobots);
    // Then return the best available robot
    return closestRobots[0];
  },
  // for testing porpoises:
  robotList: [
    {
      robotId: "1",
      batteryLevel: 99,
      y: 92,
      x: 48,
    },
    {
      robotId: "2",
      batteryLevel: 29,
      y: 8,
      x: 26,
    },
    {
      robotId: "3",
      batteryLevel: 99,
      y: 84,
      x: 91,
    },
    {
      robotId: "4",
      batteryLevel: 37,
      y: 7,
      x: 2,
    },
    {
      robotId: "5",
      batteryLevel: 96,
      y: 22,
      x: 36,
    },
    {
      robotId: "6",
      batteryLevel: 92,
      y: 29,
      x: 1,
    },
    {
      robotId: "7",
      batteryLevel: 24,
      y: 66,
      x: 13,
    },
    {
      robotId: "8",
      batteryLevel: 62,
      y: 96,
      x: 91,
    },
    {
      robotId: "9",
      batteryLevel: 4,
      y: 42,
      x: 89,
    },
    {
      robotId: "10",
      batteryLevel: 47,
      y: 23,
      x: 84,
    },
    {
      robotId: "11",
      batteryLevel: 52,
      y: 85,
      x: 49,
    },
    {
      robotId: "12",
      batteryLevel: 92,
      y: 27,
      x: 76,
    },
    {
      robotId: "13",
      batteryLevel: 84,
      y: 64,
      x: 34,
    },
    {
      robotId: "14",
      batteryLevel: 66,
      y: 88,
      x: 57,
    },
    {
      robotId: "15",
      batteryLevel: 95,
      y: 57,
      x: 55,
    },
    {
      robotId: "16",
      batteryLevel: 5,
      y: 21,
      x: 56,
    },
    {
      robotId: "17",
      batteryLevel: 72,
      y: 95,
      x: 53,
    },
    {
      robotId: "18",
      batteryLevel: 90,
      y: 5,
      x: 86,
    },
    {
      robotId: "19",
      batteryLevel: 22,
      y: 95,
      x: 51,
    },
    {
      robotId: "20",
      batteryLevel: 80,
      y: 28,
      x: 79,
    },
    {
      robotId: "21",
      batteryLevel: 26,
      y: 42,
      x: 86,
    },
    {
      robotId: "22",
      batteryLevel: 14,
      y: 28,
      x: 27,
    },
    {
      robotId: "23",
      batteryLevel: 86,
      y: 61,
      x: 59,
    },
    {
      robotId: "24",
      batteryLevel: 79,
      y: 28,
      x: 9,
    },
    {
      robotId: "25",
      batteryLevel: 51,
      y: 8,
      x: 24,
    },
    {
      robotId: "26",
      batteryLevel: 86,
      y: 18,
      x: 28,
    },
    {
      robotId: "27",
      batteryLevel: 91,
      y: 11,
      x: 75,
    },
    {
      robotId: "28",
      batteryLevel: 25,
      y: 92,
      x: 84,
    },
    {
      robotId: "29",
      batteryLevel: 59,
      y: 46,
      x: 11,
    },
    {
      robotId: "30",
      batteryLevel: 61,
      y: 98,
      x: 13,
    },
    {
      robotId: "31",
      batteryLevel: 47,
      y: 93,
      x: 31,
    },
    {
      robotId: "32",
      batteryLevel: 22,
      y: 60,
      x: 88,
    },
    {
      batteryLevel: 41,
      y: 29,
      x: 54,
      robotId: "33",
    },
    {
      batteryLevel: 92,
      y: 27,
      x: 16,
      robotId: "34",
    },
    {
      batteryLevel: 60,
      y: 76,
      x: 43,
      robotId: "35",
    },
    {
      batteryLevel: 22,
      y: 95,
      x: 30,
      robotId: "36",
    },
    {
      batteryLevel: 5,
      y: 64,
      x: 90,
      robotId: "37",
    },
    {
      batteryLevel: 61,
      y: 88,
      x: 97,
      robotId: "38",
    },
    {
      batteryLevel: 56,
      y: 52,
      x: 44,
      robotId: "39",
    },
    {
      batteryLevel: 61,
      y: 0,
      x: 64,
      robotId: "40",
    },
    {
      batteryLevel: 23,
      y: 57,
      x: 22,
      robotId: "41",
    },
    {
      batteryLevel: 78,
      y: 50,
      x: 55,
      robotId: "42",
    },
    {
      batteryLevel: 59,
      y: 20,
      x: 49,
      robotId: "43",
    },
    {
      batteryLevel: 36,
      y: 75,
      x: 14,
      robotId: "44",
    },
    {
      batteryLevel: 56,
      y: 26,
      x: 12,
      robotId: "45",
    },
    {
      batteryLevel: 24,
      y: 8,
      x: 83,
      robotId: "46",
    },
    {
      batteryLevel: 0,
      y: 38,
      x: 51,
      robotId: "47",
    },
    {
      batteryLevel: 78,
      y: 37,
      x: 6,
      robotId: "48",
    },
    {
      batteryLevel: 98,
      y: 29,
      x: 91,
      robotId: "49",
    },
    {
      batteryLevel: 92,
      y: 15,
      x: 44,
      robotId: "50",
    },
    {
      batteryLevel: 74,
      y: 78,
      x: 60,
      robotId: "51",
    },
    {
      batteryLevel: 29,
      y: 53,
      x: 94,
      robotId: "52",
    },
    {
      batteryLevel: 78,
      y: 26,
      x: 26,
      robotId: "53",
    },
    {
      batteryLevel: 46,
      y: 98,
      x: 1,
      robotId: "54",
    },
    {
      batteryLevel: 45,
      y: 33,
      x: 36,
      robotId: "55",
    },
    {
      batteryLevel: 100,
      y: 53,
      x: 38,
      robotId: "56",
    },
    {
      batteryLevel: 55,
      y: 41,
      x: 94,
      robotId: "57",
    },
    {
      batteryLevel: 52,
      y: 17,
      x: 18,
      robotId: "58",
    },
    {
      batteryLevel: 25,
      y: 71,
      x: 78,
      robotId: "59",
    },
    {
      batteryLevel: 56,
      y: 17,
      x: 21,
      robotId: "60",
    },
    {
      batteryLevel: 0,
      y: 67,
      x: 21,
      robotId: "61",
    },
    {
      batteryLevel: 70,
      y: 29,
      x: 36,
      robotId: "62",
    },
    {
      batteryLevel: 75,
      y: 3,
      x: 37,
      robotId: "63",
    },
    {
      batteryLevel: 68,
      y: 11,
      x: 88,
      robotId: "64",
    },
    {
      batteryLevel: 82,
      y: 97,
      x: 70,
      robotId: "65",
    },
    {
      batteryLevel: 75,
      y: 75,
      x: 39,
      robotId: "66",
    },
    {
      batteryLevel: 53,
      y: 78,
      x: 6,
      robotId: "67",
    },
    {
      batteryLevel: 86,
      y: 77,
      x: 32,
      robotId: "68",
    },
    {
      batteryLevel: 41,
      y: 27,
      x: 3,
      robotId: "69",
    },
    {
      batteryLevel: 34,
      y: 94,
      x: 41,
      robotId: "70",
    },
    {
      batteryLevel: 30,
      y: 25,
      x: 54,
      robotId: "71",
    },
    {
      batteryLevel: 32,
      y: 57,
      x: 86,
      robotId: "72",
    },
    {
      batteryLevel: 11,
      y: 73,
      x: 60,
      robotId: "73",
    },
    {
      batteryLevel: 45,
      y: 43,
      x: 59,
      robotId: "74",
    },
    {
      batteryLevel: 97,
      y: 33,
      x: 5,
      robotId: "75",
    },
    {
      batteryLevel: 13,
      y: 96,
      x: 4,
      robotId: "76",
    },
    {
      batteryLevel: 32,
      y: 22,
      x: 45,
      robotId: "77",
    },
    {
      batteryLevel: 87,
      y: 33,
      x: 12,
      robotId: "78",
    },
    {
      batteryLevel: 19,
      y: 69,
      x: 93,
      robotId: "79",
    },
    {
      batteryLevel: 65,
      y: 60,
      x: 65,
      robotId: "80",
    },
    {
      batteryLevel: 64,
      y: 97,
      x: 81,
      robotId: "81",
    },
    {
      batteryLevel: 75,
      y: 80,
      x: 81,
      robotId: "82",
    },
    {
      batteryLevel: 22,
      y: 6,
      x: 75,
      robotId: "83",
    },
    {
      batteryLevel: 77,
      y: 13,
      x: 4,
      robotId: "84",
    },
    {
      batteryLevel: 72,
      y: 66,
      x: 98,
      robotId: "85",
    },
    {
      batteryLevel: 8,
      y: 47,
      x: 68,
      robotId: "86",
    },
    {
      batteryLevel: 82,
      y: 31,
      x: 84,
      robotId: "87",
    },
    {
      batteryLevel: 98,
      y: 33,
      x: 7,
      robotId: "88",
    },
    {
      batteryLevel: 13,
      y: 16,
      x: 90,
      robotId: "89",
    },
    {
      batteryLevel: 28,
      y: 62,
      x: 91,
      robotId: "90",
    },
    {
      batteryLevel: 80,
      y: 5,
      x: 57,
      robotId: "91",
    },
    {
      batteryLevel: 75,
      y: 10,
      x: 48,
      robotId: "92",
    },
    {
      batteryLevel: 70,
      y: 21,
      x: 40,
      robotId: "93",
    },
    {
      batteryLevel: 19,
      y: 88,
      x: 42,
      robotId: "94",
    },
    {
      batteryLevel: 96,
      y: 58,
      x: 41,
      robotId: "95",
    },
    {
      batteryLevel: 85,
      y: 90,
      x: 12,
      robotId: "96",
    },
    {
      batteryLevel: 80,
      y: 63,
      x: 5,
      robotId: "97",
    },
    {
      batteryLevel: 23,
      y: 13,
      x: 100,
      robotId: "98",
    },
    {
      batteryLevel: 33,
      y: 16,
      x: 24,
      robotId: "99",
    },
    {
      batteryLevel: 62,
      y: 94,
      x: 63,
      robotId: "100",
    },
  ],
};

module.exports = sdk;
