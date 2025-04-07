import Redis, { ClusterNode, ClusterOptions } from 'ioredis';

/*
 * These are custom options passed into the
 * ioredis cluster client specific to our use case.
 *
 * scaleReads:             Will allow reading from all cluster nodes.
 *                         Thus, master and replicas can respond to READ commands.
 * enableOfflineQueue:     If the redis database is unavailable for any reason,
 *                         error rather than create a queue of commands.
 * slotsRefreshTimeout:    The time allowed before a timeout of refreshing slots.
 *                         For elasticache this needs to be > 2s.
 * keyPrefix               The prefix to prepend to all keys in the cache
 * maxRetriesPerRequest:   The number of times to retry a Redis command before failing with an error
 * reconnectOnError:       When failover happens, ElastiCache will switch the primary we're currently connected
 *                         to with a replica, leading to write fails with the error READONLY.
 */
const clusterOptions: ClusterOptions = {
  scaleReads: 'all',
  enableOfflineQueue: false,
  slotsRefreshTimeout: 3000,
  redisOptions: {
    keyPrefix: `dev:`,
    maxRetriesPerRequest: 0,
    reconnectOnError(error) {
      const targetError = "READONLY";
      if (error.message.includes(targetError)) {
        // Only reconnect when the error contains "READONLY"
        return true; // or `return 1;`
      }
    },
  },
};

const clusterNode: ClusterNode = {
  host: 'redis',
  port: 6379,
};

const cache = new Redis.Cluster([clusterNode], clusterOptions);

export default cache;
