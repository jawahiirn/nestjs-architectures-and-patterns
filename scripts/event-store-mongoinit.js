// This initiates the replica set required for transactions/event sourcing
rs.initiate({
  _id: 'vf-event-store-repl-set',
  members: [{ _id: 0, host: 'localhost:27017' }],
});
